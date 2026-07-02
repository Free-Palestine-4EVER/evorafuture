// Detect ROOMS from the wall network — offline, no AI. Same "engine" idea as the
// furniture detector (rasterise + flood-fill), applied to floors/tiles:
//   1. paint every wall segment (at its true thickness) onto a grid as a barrier,
//   2. flood the OUTSIDE in from the grid border over non-wall cells,
//   3. whatever interior cells the flood can't reach are enclosed by walls — and the
//      walls split them into separate connected regions = ROOMS.
// Returns one bounding box per room (plan-image px) → a floor zone the user tiles.
//
// Honest limit: it needs the walls to actually enclose the rooms. A partition that
// doesn't reach the outer wall (a gap) lets two rooms merge; a wide doorway can too.
// Good starting point you nudge — not a guarantee.

import { Wall, wallThicknessMm } from "./types";

export interface RoomBox { x: number; y: number; w: number; h: number }

function stampThickLine(b: Uint8Array, W: number, H: number, x1: number, y1: number, x2: number, y2: number, th: number) {
  const steps = Math.max(1, Math.ceil(Math.hypot(x2 - x1, y2 - y1)));
  const r = Math.max(1, Math.ceil(th / 2));
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const px = Math.round(x1 + (x2 - x1) * t), py = Math.round(y1 + (y2 - y1) * t);
    for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
      const xx = px + dx, yy = py + dy;
      if (xx >= 0 && xx < W && yy >= 0 && yy < H) b[yy * W + xx] = 1;
    }
  }
}

export function detectRooms(
  walls: Wall[], imgW: number, imgH: number, mmPerPx: number,
  opts: { minAreaM2?: number } = {},
): RoomBox[] {
  if (!walls.length || !mmPerPx) return [];
  const minAreaM2 = opts.minAreaM2 ?? 1.2;

  const cap = 600;
  const scale = Math.min(1, cap / Math.max(imgW, imgH));
  const W = Math.max(1, Math.round(imgW * scale));
  const H = Math.max(1, Math.round(imgH * scale));
  const N = W * H;

  // 1. paint walls as barriers (use real thickness so doorways/segment ends seal)
  const barrier = new Uint8Array(N);
  for (const wl of walls) {
    const thickPx = Math.max(2, (wallThicknessMm(wl) / mmPerPx) * scale);
    stampThickLine(barrier, W, H, wl.x1 * scale, wl.y1 * scale, wl.x2 * scale, wl.y2 * scale, thickPx);
  }

  // 2. flood the outside in from the border over non-barrier cells
  const outside = new Uint8Array(N);
  const st = new Int32Array(N); let sp = 0;
  const seed = (i: number) => { if (!barrier[i] && !outside[i]) { outside[i] = 1; st[sp++] = i; } };
  for (let x = 0; x < W; x++) { seed(x); seed((H - 1) * W + x); }
  for (let y = 0; y < H; y++) { seed(y * W); seed(y * W + W - 1); }
  while (sp) {
    const c = st[--sp]; const cx = c % W;
    const nb = [c - 1, c + 1, c - W, c + W];
    for (let k = 0; k < 4; k++) { const n = nb[k]; if (n < 0 || n >= N) continue; if (Math.abs((n % W) - cx) > 1) continue; if (!barrier[n] && !outside[n]) { outside[n] = 1; st[sp++] = n; } }
  }

  // 3. interior connected components (not wall, not outside) = rooms
  const inv = 1 / scale;
  const seen = new Uint8Array(N);
  const rooms: RoomBox[] = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const s = y * W + x; if (barrier[s] || outside[s] || seen[s]) continue;
    let sp2 = 0; st[sp2++] = s; seen[s] = 1;
    let mnx = x, mny = y, mxx = x, mxy = y;
    while (sp2) {
      const c = st[--sp2]; const cx = c % W, cy = (c / W) | 0;
      if (cx < mnx) mnx = cx; if (cx > mxx) mxx = cx; if (cy < mny) mny = cy; if (cy > mxy) mxy = cy;
      const nb = [c - 1, c + 1, c - W, c + W];
      for (let k = 0; k < 4; k++) { const n = nb[k]; if (n < 0 || n >= N) continue; if (Math.abs((n % W) - cx) > 1) continue; if (!barrier[n] && !outside[n] && !seen[n]) { seen[n] = 1; st[sp2++] = n; } }
    }
    // measure in plan px → metres; skip closets/gaps and wall-gap slivers
    const bw = (mxx - mnx + 1) * inv, bh = (mxy - mny + 1) * inv;
    const areaM2 = (bw * mmPerPx / 1000) * (bh * mmPerPx / 1000);
    const ar = Math.max(bw, bh) / Math.max(1, Math.min(bw, bh));
    if (areaM2 < minAreaM2 || ar > 12) continue;
    // inset by half a wall so the zone sits inside the room, not under the walls
    const inset = (wallThicknessMm(walls[0]) / mmPerPx) * 0.5 || 0;
    rooms.push({ x: mnx * inv + inset, y: mny * inv + inset, w: Math.max(4, bw - 2 * inset), h: Math.max(4, bh - 2 * inset) });
  }
  return rooms;
}
