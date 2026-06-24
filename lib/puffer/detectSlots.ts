// Auto-detect furniture "slots" from a 2D floor-plan image — locally, no AI/API.
//
// In a real plan, walls are near-black, thick, solid strokes; furniture and
// fixtures are lighter grey line-art. So we:
//   1. find the walls (near-black + thick) and paint a wall mask,
//   2. take all the "ink" (grey + black), subtract the wall mask → furniture only,
//   3. dilate so each piece's thin outline + interior detail fuse into one blob,
//   4. label connected components and keep the furniture-sized ones,
//   5. merge overlapping boxes → bounding rectangles.
//
// It's a heuristic STARTING layout you review and adjust — not exact. Windows,
// empty closets, and clustered pieces can over/under-box; you fix those by hand.

export interface SlotBox { x: number; y: number; w: number; h: number }

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function median(arr: number[]): number {
  if (!arr.length) return 0;
  const s = [...arr].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

// binary dilation by radius r (separable: horizontal then vertical max-filter)
function dilate(mask: Uint8Array, W: number, H: number, r: number): Uint8Array {
  if (r <= 0) return mask;
  const tmp = new Uint8Array(W * H), out = new Uint8Array(W * H);
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      let v = 0;
      for (let k = -r; k <= r; k++) { const xx = x + k; if (xx >= 0 && xx < W && mask[y * W + xx]) { v = 1; break; } }
      tmp[y * W + x] = v;
    }
  for (let x = 0; x < W; x++)
    for (let y = 0; y < H; y++) {
      let v = 0;
      for (let k = -r; k <= r; k++) { const yy = y + k; if (yy >= 0 && yy < H && tmp[yy * W + x]) { v = 1; break; } }
      out[y * W + x] = v;
    }
  return out;
}

interface Run { line: number; a: number; b: number }
interface Wall { x1: number; y1: number; x2: number; y2: number; thick: number }

// scan a binary mask for dark runs, either along rows (horiz) or columns
function maskRuns(mask: Uint8Array, W: number, H: number, horiz: boolean, minLen: number, runGap: number): Run[] {
  const runs: Run[] = [];
  const major = horiz ? W : H, minor = horiz ? H : W;
  for (let l = 0; l < minor; l++) {
    let k = 0;
    while (k < major) {
      const idx = horiz ? l * W + k : k * W + l;
      if (mask[idx]) {
        let last = k, gap = 0, kk = k;
        while (kk < major) {
          const id2 = horiz ? l * W + kk : kk * W + l;
          if (mask[id2]) { last = kk; gap = 0; } else { gap++; if (gap > runGap) break; }
          kk++;
        }
        if (last - k + 1 >= minLen) runs.push({ line: l, a: k, b: last });
        k = kk + 1;
      } else k++;
    }
  }
  return runs;
}

// group parallel runs into thick strokes; keep only ones thick enough to be a wall
function thickWalls(runs: Run[], mergeGap: number, minLen: number, minThick: number, horiz: boolean): Wall[] {
  runs.sort((p, q) => p.line - q.line);
  interface G { lastLine: number; aMin: number; bMax: number; lines: number[]; as: number[]; bs: number[] }
  const groups: G[] = [];
  for (const r of runs) {
    let placed = false;
    for (let i = groups.length - 1; i >= 0; i--) {
      const g = groups[i];
      if (r.line - g.lastLine > mergeGap) continue;
      if (Math.max(r.a, g.aMin) <= Math.min(r.b, g.bMax)) {
        g.lastLine = r.line; g.aMin = Math.min(g.aMin, r.a); g.bMax = Math.max(g.bMax, r.b);
        g.lines.push(r.line); g.as.push(r.a); g.bs.push(r.b); placed = true; break;
      }
    }
    if (!placed) groups.push({ lastLine: r.line, aMin: r.a, bMax: r.b, lines: [r.line], as: [r.a], bs: [r.b] });
  }
  const out: Wall[] = [];
  for (const g of groups) {
    const line = Math.round(g.lines.reduce((s, v) => s + v, 0) / g.lines.length);
    const a = Math.round(median(g.as)), b = Math.round(median(g.bs));
    const thick = Math.max(...g.lines) - Math.min(...g.lines) + 1;
    if (b - a < minLen || thick < minThick) continue;
    out.push(horiz ? { x1: a, y1: line, x2: b, y2: line, thick } : { x1: line, y1: a, x2: line, y2: b, thick });
  }
  return out;
}

interface Box { x: number; y: number; w: number; h: number; area: number }

export async function detectSlots(src: string, natW: number, natH: number): Promise<SlotBox[]> {
  const img = await loadImage(src);

  const cap = 1100;
  const scale = Math.min(1, cap / Math.max(natW, natH));
  const W = Math.max(1, Math.round(natW * scale));
  const H = Math.max(1, Math.round(natH * scale));

  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, W, H);
  ctx.drawImage(img, 0, 0, W, H);
  const { data } = ctx.getImageData(0, 0, W, H);

  const N = W * H;
  const lum = new Float32Array(N);
  let sum = 0;
  for (let i = 0; i < N; i++) {
    const a = data[i * 4 + 3];
    const l = a < 10 ? 255 : 0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2];
    lum[i] = l; sum += l;
  }
  const mean = sum / N;
  const big = Math.max(W, H);

  // ---- 1+2: find walls (near-black + thick) and paint a (dilated) wall mask ----
  const wallThresh = Math.min(125, mean * 0.55);
  const wmask = new Uint8Array(N);
  for (let i = 0; i < N; i++) wmask[i] = lum[i] < wallThresh ? 1 : 0;
  const minLen = Math.round(big * 0.04);
  const runGap = Math.max(2, Math.round(big * 0.004));
  const mergeGap = Math.max(4, Math.round(big * 0.02));
  const minThick = Math.max(3, Math.round(big * 0.006));
  const walls = [
    ...thickWalls(maskRuns(wmask, W, H, true, minLen, runGap), mergeGap, minLen, minThick, true),
    ...thickWalls(maskRuns(wmask, W, H, false, minLen, runGap), mergeGap, minLen, minThick, false),
  ];
  const wallPix = new Uint8Array(N);
  const dil = Math.round(big * 0.012);
  for (const s of walls) {
    const half = Math.ceil(s.thick / 2) + dil;
    const x0 = Math.max(0, Math.min(s.x1, s.x2) - half), x1 = Math.min(W - 1, Math.max(s.x1, s.x2) + half);
    const y0 = Math.max(0, Math.min(s.y1, s.y2) - half), y1 = Math.min(H - 1, Math.max(s.y1, s.y2) + half);
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) wallPix[y * W + x] = 1;
  }

  // ---- 3: furniture ink (grey + black) minus walls, then dilate into blobs ----
  const inkThresh = 215;
  const fmask0 = new Uint8Array(N);
  for (let i = 0; i < N; i++) fmask0[i] = lum[i] < inkThresh && !wallPix[i] ? 1 : 0;
  const fmask = dilate(fmask0, W, H, Math.max(1, Math.round(big * 0.005)));

  // ---- 4: connected components (8-connectivity flood fill) ----
  const label = new Int32Array(N), stack = new Int32Array(N), boxes: Box[] = [];
  let cur = 0;
  for (let s = 0; s < N; s++) {
    if (!fmask[s] || label[s]) continue;
    cur++; let sp = 0; stack[sp++] = s; label[s] = cur;
    let minx = W, miny = H, maxx = 0, maxy = 0, area = 0;
    while (sp > 0) {
      const p = stack[--sp]; const px = p % W, py = (p - px) / W; area++;
      if (px < minx) minx = px; if (px > maxx) maxx = px;
      if (py < miny) miny = py; if (py > maxy) maxy = py;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        const nx = px + dx, ny = py + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const np = ny * W + nx;
        if (fmask[np] && !label[np]) { label[np] = cur; stack[sp++] = np; }
      }
    }
    boxes.push({ x: minx, y: miny, w: maxx - minx + 1, h: maxy - miny + 1, area });
  }

  // ---- 4b: keep furniture-sized blobs (drop text, walls leftovers, full-room) ----
  const minDim = big * 0.045, maxDim = big * 0.62, minThin = big * 0.02;
  const cands = boxes.filter((b) => {
    const mx = Math.max(b.w, b.h), mn = Math.min(b.w, b.h);
    if (mx < minDim || mx > maxDim) return false;
    if (mn < minThin) return false;
    if (mx / mn > 9) return false;
    if (b.area / (b.w * b.h) < 0.02) return false;
    return true;
  });

  // ---- 5: merge boxes that overlap or sit very close ----
  cands.sort((a, b) => b.area - a.area);
  const gap = big * 0.018;
  const merged: Box[] = [];
  for (const b of cands) {
    let hit = false;
    for (const m of merged) {
      const overlap =
        b.x < m.x + m.w + gap && b.x + b.w + gap > m.x &&
        b.y < m.y + m.h + gap && b.y + b.h + gap > m.y;
      if (overlap) {
        const nx = Math.min(m.x, b.x), ny = Math.min(m.y, b.y);
        const nxr = Math.max(m.x + m.w, b.x + b.w), nyr = Math.max(m.y + m.h, b.y + b.h);
        m.x = nx; m.y = ny; m.w = nxr - nx; m.h = nyr - ny; m.area += b.area;
        hit = true; break;
      }
    }
    if (!hit) merged.push({ ...b });
  }

  const inv = 1 / scale;
  return merged
    .slice(0, 40)
    .map((b) => ({ x: b.x * inv, y: b.y * inv, w: b.w * inv, h: b.h * inv }));
}
