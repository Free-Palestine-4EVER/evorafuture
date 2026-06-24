// Bridge: a Gaussian-splat furniture detection (from `splat_analyzer`) → Puffer ScanFile.
//
// splat_analyzer renders synthetic views of a 3D Gaussian splat, runs OWLv2
// open-vocabulary detection, and lifts each 2D box to a 3D box, emitting
// `interactions.json`:  { objects: [{ label, position{x,y,z}, scale{x,y,z} }] }.
//
// We trust the detection for WHAT and WHERE (label + floor position) but NOT for
// size — splat_analyzer's boxes are axis-aligned and coarse (cubic). So, true to
// Puffer's "geometry is sacred" rule, the real dimensions come from a canonical
// table here, not from the detected scale. The result is fed through the existing
// scanToProject() → walls + true-size furniture slots.

import type { ScanFile, ScanWall, ScanObject } from "./importScan";

export interface SplatObject {
  label: string;
  position: { x: number; y: number; z: number };
  scale?: { x: number; y: number; z: number };
}
export interface SplatDetections {
  source?: string;
  objects: SplatObject[];
}

// Canonical real-world furniture footprints (metres), keyed by detection label.
// w = width, d = depth (the floor footprint), h = height. The authoritative geometry.
const CANON: Record<string, { type: string; w: number; d: number; h: number }> = {
  television:     { type: "tv",       w: 1.3,  d: 0.08, h: 0.74 },
  tv:             { type: "tv",       w: 1.3,  d: 0.08, h: 0.74 },
  monitor:        { type: "tv",       w: 0.6,  d: 0.06, h: 0.4 },
  couch:          { type: "sofa",     w: 2.1,  d: 0.92, h: 0.82 },
  sofa:           { type: "sofa",     w: 2.1,  d: 0.92, h: 0.82 },
  armchair:       { type: "armchair", w: 0.85, d: 0.85, h: 0.8 },
  chair:          { type: "chair",    w: 0.5,  d: 0.55, h: 0.92 },
  "dining table": { type: "table",    w: 1.6,  d: 0.9,  h: 0.75 },
  table:          { type: "table",    w: 1.2,  d: 0.7,  h: 0.45 },
  "coffee table": { type: "table",    w: 1.1,  d: 0.6,  h: 0.42 },
  desk:           { type: "desk",     w: 1.4,  d: 0.7,  h: 0.74 },
  "potted plant": { type: "plant",    w: 0.5,  d: 0.5,  h: 1.1 },
  plant:          { type: "plant",    w: 0.5,  d: 0.5,  h: 1.1 },
  vase:           { type: "vase",     w: 0.24, d: 0.24, h: 0.42 },
  "book shelf":   { type: "shelf",    w: 0.9,  d: 0.32, h: 1.8 },
  bookshelf:      { type: "shelf",    w: 0.9,  d: 0.32, h: 1.8 },
  shelf:          { type: "shelf",    w: 0.9,  d: 0.32, h: 1.8 },
  cabinet:        { type: "cabinet",  w: 1.0,  d: 0.45, h: 0.8 },
  sideboard:      { type: "cabinet",  w: 1.6,  d: 0.45, h: 0.75 },
  bed:            { type: "bed",      w: 1.6,  d: 2.0,  h: 0.55 },
  rug:            { type: "rug",      w: 2.2,  d: 1.5,  h: 0.02 },
  lamp:           { type: "lamp",     w: 0.35, d: 0.35, h: 1.55 },
  "floor lamp":   { type: "lamp",     w: 0.35, d: 0.35, h: 1.55 },
};

const FALLBACK = { w: 0.8, d: 0.8, h: 0.8 };

export interface ToScanOpts {
  /** splat units → metres (splats are up-to-scale). A clean metric capture ≈ 1. */
  metersPerUnit?: number;
  /** labels to drop from placement (case-insensitive), e.g. ["rug"]. */
  exclude?: string[];
  /** add a derived bounding-box room wall around the detected furniture. */
  walls?: boolean;
  /** margin (m) added around the furniture for the derived walls. */
  margin?: number;
}

/** Convert a splat_analyzer detection into a Puffer ScanFile (metres, top-down X/Z). */
export function interactionsToScan(det: SplatDetections, opts: ToScanOpts = {}): ScanFile {
  const { metersPerUnit = 1, exclude = [], walls = true, margin = 0.6 } = opts;
  const ex = new Set(exclude.map((s) => s.toLowerCase()));

  const objects: ScanObject[] = [];
  for (const o of det.objects ?? []) {
    const key = (o.label ?? "").toLowerCase().trim();
    if (!key || ex.has(key)) continue;
    const c = CANON[key] ?? { type: key, ...FALLBACK };
    // detection = WHERE (project the 3D centre onto the floor: drop the up axis Y)
    objects.push({
      type: c.type,
      cx: o.position.x * metersPerUnit,
      cz: o.position.z * metersPerUnit,
      w: c.w, d: c.d, h: c.h,        // catalog = true size ("geometry is sacred")
      angle: 0,                     // splat_analyzer boxes are axis-aligned (orientation not recovered)
    });
  }
  if (objects.length === 0) throw new Error("no placeable objects in detection");

  let wallsOut: ScanWall[] = [];
  if (walls) {
    const xs = objects.flatMap((o) => [o.cx - o.w / 2, o.cx + o.w / 2]);
    const zs = objects.flatMap((o) => [o.cz - o.d / 2, o.cz + o.d / 2]);
    const x0 = Math.min(...xs) - margin, x1 = Math.max(...xs) + margin;
    const z0 = Math.min(...zs) - margin, z1 = Math.max(...zs) + margin;
    wallsOut = [
      { x1: x0, z1: z0, x2: x1, z2: z0, height: 2.7 },
      { x1: x1, z1: z0, x2: x1, z2: z1, height: 2.7 },
      { x1: x1, z1: z1, x2: x0, z2: z1, height: 2.7 },
      { x1: x0, z1: z1, x2: x0, z2: z0, height: 2.7 },
    ];
  }

  return { version: 1, units: "m", walls: wallsOut, objects };
}
