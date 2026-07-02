// Turn raw detected wall fragments (from wallDetect) into a clean, closed,
// editable wall network — the post-process that makes "plan → SketchUp" usable
// on real, furnished architectural plans.
//
// Pipeline: snap parallel faces/near-walls onto shared gridlines → merge spans,
// bridging small breaks AND door-sized gaps (recording a door opening at each) →
// FORCE-CLOSE the exterior as a rectangle on the building's outer extent → keep
// connected/long interior partitions, drop furniture & fixture edges → extend
// partition ends to meet perpendicular walls (clean corners). Per-wall THICKNESS is
// read from the parallel-face spacing of each cluster.
//
// Honest limit: thin/short interior walls and exterior doorways can still be missed,
// and windows aren't auto-found — that recall ceiling is where a learned detector
// (CubiCasa-style) is the next upgrade. The editable wall tools cover the rest.

import type { Seg } from "./wallDetect";
import type { WallKind, Opening } from "./types";

export type CleanWall = Seg & {
  kind: WallKind;
  thicknessMm?: number;
  openings?: Omit<Opening, "id">[];
};

export interface CleanOpts {
  snapTol?: number; gapTol?: number; junTol?: number;
  minLen?: number; longWall?: number; partMin?: number;
}

interface Gap { c: number; w: number }
interface Item { line: number; a: number; b: number; thicknessPx?: number; gaps?: Gap[] }

export function cleanWalls(segs: Seg[], imgW: number, imgH: number, o: CleanOpts = {}, mmPerPx?: number): CleanWall[] {
  const big = Math.max(imgW, imgH);
  const snapTol = o.snapTol ?? Math.round(big * 0.022);
  const gapTol = o.gapTol ?? Math.round(big * 0.04);
  const junTol = o.junTol ?? Math.round(big * 0.03);
  const minLen = o.minLen ?? Math.round(big * 0.05);
  const longWall = o.longWall ?? Math.round(big * 0.2);
  const partMin = o.partMin ?? Math.round(big * 0.05);
  // door-sized gaps (px) — used to bridge a doorway and drop a door opening there
  const doorMinPx = mmPerPx ? 600 / mmPerPx : Infinity;
  const doorMaxPx = mmPerPx ? 1150 / mmPerPx : 0;

  const isH = (s: Seg) => Math.abs(s.y2 - s.y1) <= Math.abs(s.x2 - s.x1);
  const toItem = (s: Seg, h: boolean): Item => h
    ? { line: Math.round((s.y1 + s.y2) / 2), a: Math.min(s.x1, s.x2), b: Math.max(s.x1, s.x2) }
    : { line: Math.round((s.x1 + s.x2) / 2), a: Math.min(s.y1, s.y2), b: Math.max(s.y1, s.y2) };
  let H = segs.filter(isH).map((s) => toItem(s, true));
  let V = segs.filter((s) => !isH(s)).map((s) => toItem(s, false));

  // cluster by line (collapse faces / align parallels); thickness = cluster spread;
  // merge spans, bridging small breaks silently and door-sized gaps as door openings
  function consolidate(items: Item[]): Item[] {
    items = items.filter((it) => it.b - it.a >= minLen).sort((p, q) => p.line - q.line);
    const clusters: { items: Item[]; lineMin: number; lineMax: number }[] = [];
    for (const it of items) {
      const c = clusters[clusters.length - 1];
      if (c && it.line - c.lineMax <= snapTol) { c.items.push(it); c.lineMax = it.line; }
      else clusters.push({ items: [it], lineMin: it.line, lineMax: it.line });
    }
    const out: Item[] = [];
    for (const c of clusters) {
      const wsum = c.items.reduce((s, it) => s + (it.b - it.a), 0) || 1;
      const line = Math.round(c.items.reduce((s, it) => s + it.line * (it.b - it.a), 0) / wsum);
      const thicknessPx = c.lineMax - c.lineMin;
      const spans = c.items.map((it) => ({ a: it.a, b: it.b })).sort((p, q) => p.a - q.a);
      let cur: { a: number; b: number; gaps: Gap[] } | null = null;
      for (const sp of spans) {
        if (!cur) { cur = { a: sp.a, b: sp.b, gaps: [] }; continue; }
        const gap = sp.a - cur.b;
        if (gap <= gapTol) { cur.b = Math.max(cur.b, sp.b); }
        else if (gap >= doorMinPx && gap <= doorMaxPx) { cur.gaps.push({ c: (cur.b + sp.a) / 2, w: gap }); cur.b = Math.max(cur.b, sp.b); }
        else { out.push({ line, a: cur.a, b: cur.b, thicknessPx, gaps: cur.gaps }); cur = { a: sp.a, b: sp.b, gaps: [] }; }
      }
      if (cur) out.push({ line, a: cur.a, b: cur.b, thicknessPx, gaps: cur.gaps });
    }
    return out;
  }
  H = consolidate(H); V = consolidate(V);

  // building outer extent
  const allX = V.map((v) => v.line).concat(H.flatMap((h) => [h.a, h.b]));
  const allY = H.map((h) => h.line).concat(V.flatMap((v) => [v.a, v.b]));
  if (!allX.length || !allY.length) return [];
  const minx = Math.min(...allX), maxx = Math.max(...allX), miny = Math.min(...allY), maxy = Math.max(...allY);
  const edgeTol = Math.max(snapTol, Math.round(big * 0.03));
  const nearEdge = (v: number, lo: number, hi: number) => Math.abs(v - lo) <= edgeTol || Math.abs(v - hi) <= edgeTol;

  // 1) force-close the exterior as a clean rectangle
  const perimH: Item[] = [{ line: miny, a: minx, b: maxx }, { line: maxy, a: minx, b: maxx }];
  const perimV: Item[] = [{ line: minx, a: miny, b: maxy }, { line: maxx, a: miny, b: maxy }];

  // 2) interior partitions: drop perimeter dups + furniture; keep connected / long
  const connects = (perp: Item[], ln: number, pos: number) =>
    perp.some((p) => Math.abs(p.line - pos) <= junTol && ln >= p.a - junTol && ln <= p.b + junTol);
  const interior = (items: Item[], perpAll: Item[], lo: number, hi: number) =>
    items.filter((it) => {
      if (nearEdge(it.line, lo, hi)) return false;
      const len = it.b - it.a;
      if (len >= longWall) return true;
      return (connects(perpAll, it.line, it.a) || connects(perpAll, it.line, it.b)) && len >= partMin;
    });
  const Vi = interior(V, V.concat(perimV), minx, maxx);
  const Hi = interior(H, H.concat(perimH), miny, maxy);

  // 3) extend interior ends to the nearest perpendicular line (incl. perimeter) → close corners
  const snapEnd = (pos: number, perp: Item[]) => {
    let best = pos, d = junTol + 1;
    for (const p of perp) { const dd = Math.abs(p.line - pos); if (dd < d) { d = dd; best = p.line; } }
    return best;
  };
  const Vlines = Vi.concat(perimV), Hlines = Hi.concat(perimH);
  for (const h of Hi) { h.a = snapEnd(h.a, Vlines); h.b = snapEnd(h.b, Vlines); }
  for (const v of Vi) { v.a = snapEnd(v.a, Hlines); v.b = snapEnd(v.b, Hlines); }

  // turn captured gaps into door openings (positions relative to the final span)
  const doorsFor = (a: number, b: number, gaps?: Gap[]): Omit<Opening, "id">[] => {
    if (!mmPerPx || !gaps || b - a < 1) return [];
    return gaps
      .filter((g) => g.c > a + 1 && g.c < b - 1)
      .map((g) => ({ kind: "door" as const, pos: (g.c - a) / (b - a), widthMm: Math.round(g.w * mmPerPx), sillMm: 0, heightMm: 2100 }));
  };
  const thick = (it: Item): number | undefined =>
    mmPerPx && it.thicknessPx ? Math.max(80, Math.min(400, Math.round(it.thicknessPx * mmPerPx))) : undefined;

  const out: CleanWall[] = [];
  for (const h of perimH) out.push({ x1: h.a, y1: h.line, x2: h.b, y2: h.line, kind: "exterior" });
  for (const v of perimV) out.push({ x1: v.line, y1: v.a, x2: v.line, y2: v.b, kind: "exterior" });
  for (const h of Hi) if (h.b - h.a >= minLen) out.push({ x1: h.a, y1: h.line, x2: h.b, y2: h.line, kind: "interior", thicknessMm: thick(h), openings: doorsFor(h.a, h.b, h.gaps) });
  for (const v of Vi) if (v.b - v.a >= minLen) out.push({ x1: v.line, y1: v.a, x2: v.line, y2: v.b, kind: "interior", thicknessMm: thick(v), openings: doorsFor(v.a, v.b, v.gaps) });
  return out;
}
