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

// distance from a point to a segment
function ptSegDist(px: number, py: number, s: Seg): number {
  const dx = s.x2 - s.x1, dy = s.y2 - s.y1, L2 = dx * dx + dy * dy || 1;
  let t = ((px - s.x1) * dx + (py - s.y1) * dy) / L2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(s.x1 + dx * t - px, s.y1 + dy * t - py);
}

// Keep only segments that belong to the WALL NETWORK. Real walls connect to one
// another (a partition spans between walls; the shell joins at corners); stray text
// underlines / furniture edges float free in a room and form tiny isolated
// components. So: build a connection graph (endpoints within `tol`), then keep the
// big connected components and drop the isolated little ones. This is what lets us
// crank erosion DOWN to catch thin interior walls without dragging in the noise.
function keepNetwork(segs: Seg[], tol: number): Seg[] {
  const n = segs.length;
  if (n <= 2) return segs;
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    const a = segs[i], b = segs[j];
    if (ptSegDist(a.x1, a.y1, b) < tol || ptSegDist(a.x2, a.y2, b) < tol ||
        ptSegDist(b.x1, b.y1, a) < tol || ptSegDist(b.x2, b.y2, a) < tol) { adj[i].push(j); adj[j].push(i); }
  }
  const comp = new Array(n).fill(-1); let nc = 0;
  for (let i = 0; i < n; i++) if (comp[i] < 0) { const st = [i]; comp[i] = nc; while (st.length) { const c = st.pop()!; for (const k of adj[c]) if (comp[k] < 0) { comp[k] = nc; st.push(k); } } nc++; }
  const len = (s: Seg) => Math.hypot(s.x2 - s.x1, s.y2 - s.y1);
  const cl = new Array(nc).fill(0), cc = new Array(nc).fill(0);
  for (let i = 0; i < n; i++) { cl[comp[i]] += len(segs[i]); cc[comp[i]]++; }
  const mx = Math.max(...cl, 1);
  const keep = new Set<number>();
  for (let c = 0; c < nc; c++) if (cl[c] >= mx * 0.2 || cc[c] >= 3) keep.add(c);
  return segs.filter((_, i) => keep.has(comp[i]));
}

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

// group parallel runs (same orientation) that belong to one thick wall
function groupRuns(runs: Run[], mergeGap: number): Seg[] {
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
  // output one centreline per group, using medians to resist junction over-extension
  return groups.map((g) => {
    const line = Math.round(g.lines.reduce((s, v) => s + v, 0) / g.lines.length);
    const a = Math.round(median(g.as));
    const b = Math.round(median(g.bs));
    return { line, a, b };
  }) as unknown as Seg[]; // caller fixes orientation
}

export async function detectWalls(
  src: string, natW: number, natH: number,
  opts: { minLenK?: number; threshK?: number; erodeK?: number; wallsOnly?: boolean; connect?: boolean; tolK?: number } = {},
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
  // adaptive ink cutoff — scales with the plan's overall brightness (clamped), so
  // walls drawn lighter or darker both read, not just a fixed constant.
  const thresh = Math.max(120, Math.min(200, mean * (opts.threshK ?? 0.78)));
  const dark = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) dark[i] = lum[i] < thresh ? 1 : 0;

  const big = Math.max(W, H);
  const minLen = Math.max(16, Math.round(big * (opts.minLenK ?? 0.045))); // ignore text/short symbols
  const runGap = Math.max(2, Math.round(big * 0.004));   // bridge tiny breaks within a wall
  const mergeGap = Math.max(5, Math.round(big * 0.02));  // collapse wall thickness / double lines

  // ── thick-stroke isolation (the "read real walls, not furniture" upgrade) ──
  // Real walls are THICK bands; furniture outlines, dimension/leader lines, door
  // arcs and text strokes are THIN. We keep a pixel only if the stroke is dark for
  // a perpendicular band of ±erodeK: horizontal walls need vertical thickness
  // (hThick), vertical walls need horizontal thickness (vThick). This drops the
  // thin clutter before the run-scan, so we trace walls instead of sofas & labels.
  const wallsOnly = opts.wallsOnly ?? true;
  const erodeK = Math.max(1, Math.round(big * (opts.erodeK ?? 0.0013))); // lower → catches thin interior walls (noise removed by the connectivity pass)
  let hMask = dark, vMask = dark;
  if (wallsOnly) {
    const hThick = new Uint8Array(W * H);
    const vThick = new Uint8Array(W * H);
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = y * W + x;
        if (!dark[i]) continue;
        let okV = true;
        for (let dy = -erodeK; dy <= erodeK; dy++) { const yy = y + dy; if (yy < 0 || yy >= H || !dark[yy * W + x]) { okV = false; break; } }
        if (okV) hThick[i] = 1;
        let okH = true;
        for (let dx = -erodeK; dx <= erodeK; dx++) { const xx = x + dx; if (xx < 0 || xx >= W || !dark[y * W + xx]) { okH = false; break; } }
        if (okH) vThick[i] = 1;
      }
    }
    hMask = hThick; vMask = vThick;
  }

  // --- horizontal runs (scan each row of the horizontal-wall mask) ---
  const hRuns: Run[] = [];
  for (let y = 0; y < H; y++) {
    let x = 0;
    while (x < W) {
      if (hMask[y * W + x]) {
        let last = x, gap = 0, xx = x;
        while (xx < W) {
          if (hMask[y * W + xx]) { last = xx; gap = 0; }
          else { gap++; if (gap > runGap) break; }
          xx++;
        }
        if (last - x + 1 >= minLen) hRuns.push({ line: y, a: x, b: last });
        x = xx + 1;
      } else x++;
    }
  }

  // --- vertical runs (scan each column of the vertical-wall mask) ---
  const vRuns: Run[] = [];
  for (let x = 0; x < W; x++) {
    let y = 0;
    while (y < H) {
      if (vMask[y * W + x]) {
        let last = y, gap = 0, yy = y;
        while (yy < H) {
          if (vMask[yy * W + x]) { last = yy; gap = 0; }
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
  for (const g of hGroups as unknown as { line: number; a: number; b: number }[]) {
    if (g.b - g.a < minLen) continue;
    segs.push({ x1: g.a * inv, y1: g.line * inv, x2: g.b * inv, y2: g.line * inv });
  }
  for (const g of vGroups as unknown as { line: number; a: number; b: number }[]) {
    if (g.b - g.a < minLen) continue;
    segs.push({ x1: g.line * inv, y1: g.a * inv, x2: g.line * inv, y2: g.b * inv });
  }
  // keep only the connected wall network (drops floating text/furniture noise)
  if ((opts.connect ?? true) && (opts.wallsOnly ?? true)) {
    const tol = Math.max(8, Math.round(Math.max(natW, natH) * (opts.tolK ?? 0.022)));
    return keepNetwork(segs, tol);
  }
  return segs;
}
