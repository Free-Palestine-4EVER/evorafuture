// Core domain types for the furnished-plan tool.
// Guiding rule: geometry is sacred. A product's real dimensions are the source
// of truth — rectangles on the plan define WHERE and HOW a product sits, never
// how big it is. We never stretch a model to fill a slot.

export interface Product {
  id: string;
  name: string;
  category: string;
  /** true real-world dimensions in millimetres (the authoritative geometry) */
  dimensions_mm: { w: number; d: number; h: number };
  /** placeholder material colour until the client's real GLB models arrive */
  color: string;
  /** real 3D model (path under /public, e.g. "/models/sofa.glb"). When set, the
   *  scene shows this instead of the procedural placeholder. Author at TRUE scale
   *  in metres, origin at the base centre. */
  glbUrl?: string;
  /** unit fix if the model isn't authored in metres (e.g. 0.001 for mm). Default 1. */
  glbScale?: number;
}

export interface Rect {
  id: string;
  /** position + size in PLAN-IMAGE PIXELS (top-left origin, y down) */
  x: number;
  y: number;
  w: number;
  h: number;
  /** rotation around the vertical axis, in degrees */
  rotationDeg: number;
  /** linked catalog product, or null if the slot is still empty */
  productId: string | null;
}

export type WallHeight = "none" | "half" | "full";

export interface Wall {
  id: string;
  /** endpoints in PLAN-IMAGE PIXELS */
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  height: WallHeight;
  /** "auto" = detected from the plan image; "manual" = drawn/traced by the user */
  source: "auto" | "manual";
}

export interface Point {
  x: number;
  y: number;
}

export type Mode = "select" | "draw" | "calibrate" | "wall";

// real-world wall sizing (millimetres)
export const WALL = {
  fullMm: 2700,
  halfMm: 1100,
  thicknessMm: 100,
};

export function wallHeightMm(h: WallHeight): number {
  return h === "full" ? WALL.fullMm : h === "half" ? WALL.halfMm : 0;
}
