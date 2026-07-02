// Turn a wall + its openings into the solid rectangles ("panels") that remain after
// the doors/windows are cut out — in the wall's own length × height plane (metres).
// Shared by the 3D view (SceneView) and the exporter so what you see == what exports.
//
//   pillar(s) between/around openings · apron under a window · lintel above an opening

import type { Opening } from "./types";

export interface Panel { x0: number; x1: number; y0: number; y1: number } // along-length, height (m)

export function wallPanels(openings: Opening[] | undefined, lengthM: number, heightM: number): Panel[] {
  const ops = (openings ?? [])
    .map((o) => {
      const c = o.pos * lengthM, w = o.widthMm / 1000;
      return {
        a: Math.max(0, c - w / 2),
        b: Math.min(lengthM, c + w / 2),
        y0: Math.max(0, o.sillMm / 1000),
        y1: Math.min(heightM, (o.sillMm + o.heightMm) / 1000),
      };
    })
    .filter((o) => o.b > o.a + 1e-4 && o.y1 > o.y0 + 1e-4);

  if (!ops.length) return [{ x0: 0, x1: lengthM, y0: 0, y1: heightM }];

  // Sweep the length axis: split at every opening edge into columns; in each column
  // subtract the (merged) opening height-bands from the full height → solid panels.
  // Handles overlapping / adjacent doors+windows correctly (no duplicated panels).
  const cuts = Array.from(new Set([0, lengthM, ...ops.flatMap((o) => [o.a, o.b])]))
    .filter((x) => x >= -1e-6 && x <= lengthM + 1e-6)
    .sort((p, q) => p - q);

  const raw: Panel[] = [];
  for (let i = 0; i < cuts.length - 1; i++) {
    const x0 = cuts[i], x1 = cuts[i + 1];
    if (x1 - x0 < 1e-4) continue;
    const mid = (x0 + x1) / 2;
    const bands = ops.filter((o) => o.a <= mid && o.b >= mid).map((o) => [o.y0, o.y1] as [number, number]).sort((p, q) => p[0] - q[0]);
    const merged: [number, number][] = [];
    for (const [b0, b1] of bands) {
      const last = merged[merged.length - 1];
      if (last && b0 <= last[1] + 1e-4) last[1] = Math.max(last[1], b1);
      else merged.push([b0, b1]);
    }
    let y = 0;
    for (const [b0, b1] of merged) { if (b0 > y + 1e-4) raw.push({ x0, x1, y0: y, y1: b0 }); y = Math.max(y, b1); }
    if (y < heightM - 1e-4) raw.push({ x0, x1, y0: y, y1: heightM });
  }

  // merge horizontally-adjacent panels sharing a height band (keeps box count low)
  raw.sort((p, q) => p.y0 - q.y0 || p.y1 - q.y1 || p.x0 - q.x0);
  const out: Panel[] = [];
  for (const p of raw) {
    const last = out[out.length - 1];
    if (last && Math.abs(last.y0 - p.y0) < 1e-4 && Math.abs(last.y1 - p.y1) < 1e-4 && Math.abs(last.x1 - p.x0) < 1e-4) last.x1 = p.x1;
    else out.push({ ...p });
  }
  return out;
}
