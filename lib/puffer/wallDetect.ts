// Auto-detect walls from a 2D floor-plan image.
//
// Floor plans are (almost always) dark wall lines on a light background, and the
// walls are overwhelmingly axis-aligned. So instead of a heavy ML model, we:
//   1. rasterise the plan to a canvas and build a "dark pixel" mask,
//   2. find long continuous horizontal runs (row scan) and vertical runs (col scan),
//   3. merge the rows/cols that belong to the same thick wall into one centreline.
// This gives clean, instant results on architectural/CAD-style plans (and our
// samples). Diagonal walls and messy scans are the known limit — that's where the
// ML route (CubiCasa etc.) becomes the later upgrade.

export interface Seg { x1: number; y1: number; x2: number; y2: number; }

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
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

interface Run { line: number; a: number; b: number } // a..b along the run, at row/col `line`
// a..b extent, centred on `line`, `thick` px deep perpendicular to the run
interface Grouped { line: number; a: number; b: number; thick: number }

// group parallel runs (same orientation) that belong to one thick wall
function groupRuns(runs: Run[], mergeGap: number): Grouped[] {
  runs.sort((p, q) => p.line - q.line);
  interface G { lastLine: number; aMin: number; bMax: number; lines: number[]; as: number[]; bs: number[] }
  const groups: G[] = [];
  for (const r of runs) {
    let placed = false;
    for (let i = groups.length - 1; i >= 0; i--) {
      const g = groups[i];
      if (r.line - g.lastLine > mergeGap) continue; // groups are sorted; older ones only get further
      const overlap = Math.max(r.a, g.aMin) <= Math.min(r.b, g.bMax);
      if (overlap) {
        g.lastLine = r.line;
        g.aMin = Math.min(g.aMin, r.a);
        g.bMax = Math.max(g.bMax, r.b);
        g.lines.push(r.line); g.as.push(r.a); g.bs.push(r.b);
        placed = true;
        break;
      }
    }
    if (!placed) groups.push({ lastLine: r.line, aMin: r.a, bMax: r.b, lines: [r.line], as: [r.a], bs: [r.b] });
  }
  // output one centreline per group, using medians to resist junction over-extension.
  // `thick` is the stroke depth — the key signal that separates real walls (thick,
  // solid bars) from thin furniture / fixture outlines.
  return groups.map((g) => {
    const line = Math.round(g.lines.reduce((s, v) => s + v, 0) / g.lines.length);
    const a = Math.round(median(g.as));
    const b = Math.round(median(g.bs));
    const thick = Math.max(...g.lines) - Math.min(...g.lines) + 1;
    return { line, a, b, thick };
  });
}

export interface ExcludeBox { x: number; y: number; w: number; h: number }

export async function detectWalls(
  src: string,
  natW: number,
  natH: number,
  exclude: ExcludeBox[] = [],
): Promise<Seg[]> {
  const img = await loadImage(src);

  // work at a capped resolution for speed
  const cap = 1400;
  const scale = Math.min(1, cap / Math.max(natW, natH));
  const W = Math.max(1, Math.round(natW * scale));
  const H = Math.max(1, Math.round(natH * scale));

  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, W, H); // flatten transparency to white
  ctx.drawImage(img, 0, 0, W, H);
  const { data } = ctx.getImageData(0, 0, W, H);

  // luminance + dark mask
  const lum = new Float32Array(W * H);
  let sum = 0;
  for (let i = 0; i < W * H; i++) {
    const a = data[i * 4 + 3];
    const l = a < 10 ? 255 : 0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2];
    lum[i] = l; sum += l;
  }
  const mean = sum / (W * H);
  // Walls read as near-black, solid strokes. Threshold low so we mask the wall ink
  // but not the lighter grey furniture / fixture line-art.
  const thresh = Math.min(125, mean * 0.55);
  const dark = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) dark[i] = lum[i] < thresh ? 1 : 0;

  const big = Math.max(W, H);
  const minLen = Math.max(16, Math.round(big * 0.04));   // ignore text/short symbols
  const runGap = Math.max(2, Math.round(big * 0.004));   // bridge tiny breaks within a wall
  const mergeGap = Math.max(5, Math.round(big * 0.02));  // collapse wall thickness / double lines
  const minThick = Math.max(3, Math.round(big * 0.006)); // reject thin furniture/fixture outlines

  // Furniture slots are not walls: blank the excluded boxes out of the dark mask
  // so their outlines/fills can't form wall runs. Pad slightly to catch the stroke.
  if (exclude.length) {
    const pad = Math.max(1, Math.round(big * 0.004));
    for (const e of exclude) {
      const x0 = Math.max(0, Math.floor(e.x * scale) - pad);
      const y0 = Math.max(0, Math.floor(e.y * scale) - pad);
      const x1 = Math.min(W - 1, Math.ceil((e.x + e.w) * scale) + pad);
      const y1 = Math.min(H - 1, Math.ceil((e.y + e.h) * scale) + pad);
      for (let y = y0; y <= y1; y++)
        for (let x = x0; x <= x1; x++) dark[y * W + x] = 0;
    }
  }

  // --- horizontal runs (scan each row) ---
  const hRuns: Run[] = [];
  for (let y = 0; y < H; y++) {
    let x = 0;
    while (x < W) {
      if (dark[y * W + x]) {
        let last = x, gap = 0, xx = x;
        while (xx < W) {
          if (dark[y * W + xx]) { last = xx; gap = 0; }
          else { gap++; if (gap > runGap) break; }
          xx++;
        }
        if (last - x + 1 >= minLen) hRuns.push({ line: y, a: x, b: last });
        x = xx + 1;
      } else x++;
    }
  }

  // --- vertical runs (scan each column) ---
  const vRuns: Run[] = [];
  for (let x = 0; x < W; x++) {
    let y = 0;
    while (y < H) {
      if (dark[y * W + x]) {
        let last = y, gap = 0, yy = y;
        while (yy < H) {
          if (dark[yy * W + x]) { last = yy; gap = 0; }
          else { gap++; if (gap > runGap) break; }
          yy++;
        }
        if (last - y + 1 >= minLen) vRuns.push({ line: x, a: y, b: last });
        y = yy + 1;
      } else y++;
    }
  }

  const hGroups = groupRuns(hRuns, mergeGap); // {line=y, a=x1, b=x2}
  const vGroups = groupRuns(vRuns, mergeGap); // {line=x, a=y1, b=y2}

  const inv = 1 / scale;
  const segs: Seg[] = [];
  for (const g of hGroups) {
    if (g.b - g.a < minLen || g.thick < minThick) continue;
    segs.push({ x1: g.a * inv, y1: g.line * inv, x2: g.b * inv, y2: g.line * inv });
  }
  for (const g of vGroups) {
    if (g.b - g.a < minLen || g.thick < minThick) continue;
    segs.push({ x1: g.line * inv, y1: g.a * inv, x2: g.line * inv, y2: g.b * inv });
  }
  return segs;
}
