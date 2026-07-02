// Detect furniture FOOTPRINTS from a 2D floor-plan image — fully offline, no AI,
// no per-use cost (so it can ship inside a one-time-sale Puffer).
//
// The trick that makes it work on real plans:
//   1. Threshold to ink (catch light-grey furniture lines, not just black walls).
//   2. Remove WALLS with a *box* erosion — a pixel is wall only if it sits inside a
//      solid dark block (thick in BOTH directions). Thin furniture lines survive;
//      walls (thick) are cut. (A cross/erosion-in-one-axis would wrongly eat long
//      thin furniture edges.)
//   3. HOLE-FILL: flood the background in from the image border; any enclosed white
//      region the flood can't reach is a furniture interior → fill it. Hollow sofa/
//      bed/table outlines become SOLID blobs (high fill); open door-arcs & dimension
//      lines enclose nothing, so they stay thin and get rejected by the fill test.
//   4. Connected components → bboxes, filtered by real-world size + fill, then
//      overlapping boxes merged.
//
// Output: furniture footprints in PLAN-IMAGE pixels. Honest limit: it's a heuristic —
// it catches most pieces, can miss some and add the odd wrong box (delete those).

export interface FootBox { x: number; y: number; w: number; h: number }

export interface FurnitureOpts {
  thr?: number;        // ink threshold (0-255 luminance); higher = catch lighter lines
  erodeK?: number;     // wall box-erosion half-size (× max dim)
  wallDil?: number;    // wall-zone dilation (× max dim)
  gapDil?: number;     // close furniture outline gaps (× max dim)
  minMM?: number;      // smallest furniture dimension (mm)
  maxMM?: number;      // largest furniture dimension (mm)
  minAreaM2?: number;
  maxAreaM2?: number;
  minFill?: number;    // min (component px / bbox area) after hole-fill
}

const DEFAULTS: Required<Omit<FurnitureOpts, "thr">> = {
  erodeK: 0.003, wallDil: 0.005, gapDil: 0.0024,
  minMM: 320, maxMM: 3500, minAreaM2: 0.07, maxAreaM2: 6, minFill: 0.4,
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function detectFurniture(
  src: string, natW: number, natH: number, mmPerPx: number, opts: FurnitureOpts = {},
): Promise<FootBox[]> {
  const P = { ...DEFAULTS, ...opts };
  const img = await loadImage(src);

  const cap = 1400;
  const scale = Math.min(1, cap / Math.max(natW, natH));
  const W = Math.max(1, Math.round(natW * scale));
  const H = Math.max(1, Math.round(natH * scale));
  const N = W * H;

  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, W, H);
  ctx.drawImage(img, 0, 0, W, H);
  const data = ctx.getImageData(0, 0, W, H).data;

  // luminance + ADAPTIVE threshold — works whether the plan is drawn dark or light
  // grey (catch furniture lines without a magic constant). opts.thr overrides.
  const lum = new Float32Array(N); let sum = 0;
  for (let i = 0; i < N; i++) {
    const a = data[i * 4 + 3];
    const l = a < 10 ? 255 : 0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2];
    lum[i] = l; sum += l;
  }
  const thr = opts.thr ?? Math.max(150, Math.min(222, (sum / N) * 0.9));
  const dark = new Uint8Array(N);
  for (let i = 0; i < N; i++) dark[i] = lum[i] < thr ? 1 : 0;
  const big = Math.max(W, H);

  // content box (the drawn area) so we ignore the page margins
  let cminX = W, cminY = H, cmaxX = 0, cmaxY = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (dark[y * W + x]) { if (x < cminX) cminX = x; if (x > cmaxX) cmaxX = x; if (y < cminY) cminY = y; if (y > cmaxY) cmaxY = y; }
  }
  if (cmaxX <= cminX || cmaxY <= cminY) return [];

  // WALL mask — box erosion gives thick "cores"; but a solid-FILLED furniture block
  // is also a thick core. Real walls are LONG; filled furniture is blocky. So keep a
  // core only if its connected component spans a long distance → genuine wall.
  const eK = Math.max(1, Math.round(big * P.erodeK));
  const core = new Uint8Array(N);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x;
    if (!dark[i]) continue;
    let ok = 1;
    for (let dy = -eK; dy <= eK && ok; dy++) {
      const yy = y + dy; if (yy < 0 || yy >= H) { ok = 0; break; }
      for (let dx = -eK; dx <= eK; dx++) { const xx = x + dx; if (xx < 0 || xx >= W || !dark[yy * W + xx]) { ok = 0; break; } }
    }
    if (ok) core[i] = 1;
  }
  const wall = new Uint8Array(N);
  const stC = new Int32Array(N);
  const seenC = new Uint8Array(N);
  const wallLen = big * 0.1; // a wall core must span ≥10% of the plan
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const s = y * W + x; if (!core[s] || seenC[s]) continue;
    let sp = 0; stC[sp++] = s; seenC[s] = 1;
    const px: number[] = []; let mnx = x, mny = y, mxx = x, mxy = y;
    while (sp) {
      const c = stC[--sp]; const cx = c % W, cy = (c / W) | 0; px.push(c);
      if (cx < mnx) mnx = cx; if (cx > mxx) mxx = cx; if (cy < mny) mny = cy; if (cy > mxy) mxy = cy;
      const nb = [c - 1, c + 1, c - W, c + W];
      for (let k = 0; k < 4; k++) { const n = nb[k]; if (n < 0 || n >= N) continue; if (Math.abs((n % W) - cx) > 1) continue; if (core[n] && !seenC[n]) { seenC[n] = 1; stC[sp++] = n; } }
    }
    if (Math.max(mxx - mnx, mxy - mny) >= wallLen) for (const p of px) wall[p] = 1;
  }
  const wz = Math.max(2, Math.round(big * P.wallDil));
  const wallZone = new Uint8Array(N);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (!wall[y * W + x]) continue;
    for (let dy = -wz; dy <= wz; dy++) for (let dx = -wz; dx <= wz; dx++) {
      const yy = y + dy, xx = x + dx; if (yy >= 0 && yy < H && xx >= 0 && xx < W) wallZone[yy * W + xx] = 1;
    }
  }

  // furniture ink = dark & not wall, inside the content box
  const pad = Math.round(big * 0.008);
  const ink = new Uint8Array(N);
  for (let y = cminY + pad; y <= cmaxY - pad; y++) for (let x = cminX + pad; x <= cmaxX - pad; x++) {
    const i = y * W + x; if (dark[i] && !wallZone[i]) ink[i] = 1;
  }
  // close small outline gaps
  const gd = Math.max(1, Math.round(big * P.gapDil));
  const ink2 = new Uint8Array(N);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (!ink[y * W + x]) continue;
    for (let dy = -gd; dy <= gd; dy++) for (let dx = -gd; dx <= gd; dx++) {
      const yy = y + dy, xx = x + dx; if (yy >= 0 && yy < H && xx >= 0 && xx < W) ink2[yy * W + xx] = 1;
    }
  }

  // HOLE FILL — flood outer background from the borders; enclosed gaps = furniture
  const outer = new Uint8Array(N);
  const st = new Int32Array(N); let sp = 0;
  const seed = (i: number) => { if (!ink2[i] && !outer[i]) { outer[i] = 1; st[sp++] = i; } };
  for (let x = 0; x < W; x++) { seed(x); seed((H - 1) * W + x); }
  for (let y = 0; y < H; y++) { seed(y * W); seed(y * W + W - 1); }
  while (sp) {
    const c = st[--sp]; const cx = c % W;
    const nb = [c - 1, c + 1, c - W, c + W];
    for (let k = 0; k < 4; k++) { const n = nb[k]; if (n < 0 || n >= N) continue; if (Math.abs((n % W) - cx) > 1) continue; if (!ink2[n] && !outer[n]) { outer[n] = 1; st[sp++] = n; } }
  }
  const filled = new Uint8Array(N);
  for (let i = 0; i < N; i++) filled[i] = ink2[i] || !outer[i] ? 1 : 0;

  // connected components → boxes
  const seen = new Uint8Array(N);
  const boxes: { x0: number; y0: number; x1: number; y1: number; fill: number }[] = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const s = y * W + x; if (!filled[s] || seen[s]) continue;
    let sp2 = 0; st[sp2++] = s; seen[s] = 1;
    let mnx = x, mny = y, mxx = x, mxy = y, cnt = 0;
    while (sp2) {
      const c = st[--sp2]; const cy = (c / W) | 0, cx = c % W; cnt++;
      if (cx < mnx) mnx = cx; if (cx > mxx) mxx = cx; if (cy < mny) mny = cy; if (cy > mxy) mxy = cy;
      const nb = [c - 1, c + 1, c - W, c + W];
      for (let k = 0; k < 4; k++) { const n = nb[k]; if (n < 0 || n >= N) continue; if (Math.abs((n % W) - cx) > 1) continue; if (filled[n] && !seen[n]) { seen[n] = 1; st[sp2++] = n; } }
    }
    const bw = mxx - mnx + 1, bh = mxy - mny + 1;
    boxes.push({ x0: mnx, y0: mny, x1: mxx, y1: mxy, fill: cnt / (bw * bh) });
  }

  // filter by real-world size + fill (work in plan-image px → mm)
  const inv = 1 / scale;
  const toMM = (px: number) => px * inv * mmPerPx;
  let kept = boxes.filter((b) => {
    const wmm = toMM(b.x1 - b.x0 + 1), hmm = toMM(b.y1 - b.y0 + 1);
    const mn = Math.min(wmm, hmm), mx = Math.max(wmm, hmm), arM2 = (wmm * hmm) / 1e6;
    return mn >= P.minMM && mx <= P.maxMM && arM2 >= P.minAreaM2 && arM2 <= P.maxAreaM2 && b.fill >= P.minFill;
  }).map((b) => ({ x: b.x0 * inv, y: b.y0 * inv, w: (b.x1 - b.x0 + 1) * inv, h: (b.y1 - b.y0 + 1) * inv }));

  // merge boxes that heavily overlap (a piece split into two components)
  kept = mergeOverlaps(kept);
  return kept;
}

function mergeOverlaps(boxes: FootBox[]): FootBox[] {
  const out: FootBox[] = [];
  const used = new Array(boxes.length).fill(false);
  for (let i = 0; i < boxes.length; i++) {
    if (used[i]) continue;
    let { x, y, w, h } = boxes[i];
    for (let j = i + 1; j < boxes.length; j++) {
      if (used[j]) continue;
      const b = boxes[j];
      const ix = Math.max(0, Math.min(x + w, b.x + b.w) - Math.max(x, b.x));
      const iy = Math.max(0, Math.min(y + h, b.y + b.h) - Math.max(y, b.y));
      const inter = ix * iy;
      const minA = Math.min(w * h, b.w * b.h);
      if (inter > 0.45 * minA) { // mostly the same piece → union them
        const nx = Math.min(x, b.x), ny = Math.min(y, b.y);
        const nx2 = Math.max(x + w, b.x + b.w), ny2 = Math.max(y + h, b.y + b.h);
        x = nx; y = ny; w = nx2 - nx; h = ny2 - ny; used[j] = true;
      }
    }
    out.push({ x, y, w, h });
  }
  return out;
}
