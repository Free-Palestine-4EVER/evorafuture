// Auto-detect doors & windows by scanning the plan image ALONG each detected wall
// for breaks in the wall ink — offline, no AI. A break in a wall line is a doorway
// or window: narrow → door, wide / exterior wall → window. This is robust because it
// reads the real image along whatever walls we found, instead of relying on the wall
// detector having split the wall into collinear spans (which fails on thin walls).
//
// Honest limit: only as good as the detected walls + how the plan draws openings.
// Windows drawn as a solid double-line (no gap) won't register; a wall the detector
// missed has nothing to scan. Catches the clear cases; the rest stay manual.

import type { Opening } from "./types";

export interface ScanWall { x1: number; y1: number; x2: number; y2: number; kind?: "exterior" | "interior"; thicknessMm?: number }

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image(); img.crossOrigin = "anonymous";
    img.onload = () => resolve(img); img.onerror = reject; img.src = src;
  });
}

/**
 * Returns a list of openings (no id) for each input wall (same order).
 */
export async function detectOpenings(
  planImage: string, walls: ScanWall[], imgW: number, imgH: number, mmPerPx: number,
): Promise<Omit<Opening, "id">[][]> {
  const empty = walls.map(() => [] as Omit<Opening, "id">[]);
  if (!walls.length || !mmPerPx) return empty;

  const img = await loadImage(planImage);
  const cap = 1400;
  const scale = Math.min(1, cap / Math.max(imgW, imgH));
  const W = Math.max(1, Math.round(imgW * scale));
  const H = Math.max(1, Math.round(imgH * scale));
  const N = W * H;
  const cv = document.createElement("canvas");
  cv.width = W; cv.height = H;
  const ctx = cv.getContext("2d", { willReadFrequently: true });
  if (!ctx) return empty;
  ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, W, H);
  ctx.drawImage(img, 0, 0, W, H);
  const data = ctx.getImageData(0, 0, W, H).data;
  let sum = 0; const lum = new Float32Array(N);
  for (let i = 0; i < N; i++) { const a = data[i * 4 + 3]; const l = a < 10 ? 255 : 0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2]; lum[i] = l; sum += l; }
  const thr = Math.max(150, Math.min(222, (sum / N) * 0.9));
  const dark = (x: number, y: number) => { const xi = Math.round(x), yi = Math.round(y); if (xi < 0 || yi < 0 || xi >= W || yi >= H) return false; return lum[yi * W + xi] < thr; };

  const mmPx = mmPerPx / scale; // mm per capped pixel
  const out: Omit<Opening, "id">[][] = [];

  for (const w of walls) {
    const sx = w.x1 * scale, sy = w.y1 * scale, ex = w.x2 * scale, ey = w.y2 * scale;
    const lenPx = Math.hypot(ex - sx, ey - sy);
    if (lenPx < 4) { out.push([]); continue; }
    const ux = (ex - sx) / lenPx, uy = (ey - sy) / lenPx;       // along
    const nx = -uy, ny = ux;                                     // perpendicular
    const thickPx = Math.max(2, ((w.thicknessMm ?? 120) / mmPerPx) * scale);
    const band = thickPx / 2 + 3;                                // search ± this off the centreline

    // 1 = wall ink present at this step, 0 = gap
    const steps = Math.ceil(lenPx);
    const present = new Uint8Array(steps + 1);
    for (let t = 0; t <= steps; t++) {
      const cx = sx + ux * t, cy = sy + uy * t;
      let hit = false;
      for (let s = -band; s <= band && !hit; s += 1) if (dark(cx + nx * s, cy + ny * s)) hit = true;
      present[t] = hit ? 1 : 0;
    }

    // ignore junctions at the wall ends (~one thickness in from each end)
    const endIgnore = Math.min(steps * 0.45, thickPx * 1.2 + 2);
    const openings: Omit<Opening, "id">[] = [];
    let t = 0;
    while (t <= steps) {
      if (present[t]) { t++; continue; }
      let g = t; while (g <= steps && !present[g]) g++;
      const gapLen = g - t;            // px (capped)
      const mid = (t + g) / 2;
      const widthMm = gapLen * mmPx;
      const nearEnd = mid < endIgnore || mid > steps - endIgnore;
      if (!nearEnd && widthMm >= 500 && widthMm <= 2600) {
        const exterior = w.kind === "exterior";
        const isWindow = exterior && widthMm > 1000;            // wide gap in an outer wall = window
        openings.push(
          isWindow
            ? { kind: "window", pos: mid / steps, widthMm: Math.round(widthMm), sillMm: 900, heightMm: 1200 }
            : { kind: "door", pos: mid / steps, widthMm: Math.round(Math.min(widthMm, 1100)), sillMm: 0, heightMm: 2100 },
        );
      }
      t = g;
    }
    out.push(openings);
  }
  return out;
}
