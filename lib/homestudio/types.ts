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
  /** when true, the GLB is auto-scaled so its bounding box matches dimensions_mm
   *  exactly — lets us use free models of any authored scale while keeping
   *  geometry sacred (what you see == the true real size). */
  fitToDims?: boolean;
  /** preview image for the catalog browser (path under /public). */
  thumbnailUrl?: string;
  /** key into IndexedDB (lib/modelStore) for user-imported models stored offline.
   *  When set, glbUrl is a session object URL rebuilt from IndexedDB on load. */
  idbKey?: string;
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
  /** optional finish override (hex) applied to this piece in 3D — lets the same
   *  model be shown in different woods/fabrics. Undefined = the model's own colours. */
  tint?: string;
}

// Finish presets for recolouring a placed product (wood / fabric / neutral).
export interface Finish {
  name: string;
  color: string;
  roughness: number;
  metalness?: number;
}
export const FINISHES: Finish[] = [
  { name: "Oak", color: "#c8a16a", roughness: 0.7 },
  { name: "Walnut", color: "#6b4a2f", roughness: 0.65 },
  { name: "Ebony", color: "#3b2a1f", roughness: 0.6 },
  { name: "Cream", color: "#e6dcc6", roughness: 0.95 },
  { name: "Grey", color: "#8b9097", roughness: 0.95 },
  { name: "Blue", color: "#3f5e8c", roughness: 0.9 },
  { name: "Green", color: "#4d6b50", roughness: 0.9 },
  { name: "Terracotta", color: "#b5654a", roughness: 0.9 },
  { name: "White", color: "#eceae6", roughness: 0.8 },
  { name: "Black", color: "#2a2a2c", roughness: 0.7, metalness: 0.1 },
];

export type WallHeight = "none" | "half" | "full";

export type WallKind = "exterior" | "interior";

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
  /** true wall thickness in mm (overrides the kind default when set) */
  thicknessMm?: number;
  /** exterior (thicker, on the building perimeter) vs interior partition */
  kind?: WallKind;
  /** optional custom height in mm (overrides the none/half/full preset) */
  heightMm?: number;
  /** doors & windows cut into this wall */
  openings?: Opening[];
}

export type OpeningKind = "door" | "window";

export interface Opening {
  id: string;
  kind: OpeningKind;
  /** centre position along the wall, 0..1 from endpoint (x1,y1) → (x2,y2) */
  pos: number;
  widthMm: number;
  /** height of the opening's bottom above the floor (doors = 0) */
  sillMm: number;
  /** opening height in mm */
  heightMm: number;
}

export const OPENING_DEFAULTS: Record<OpeningKind, { widthMm: number; sillMm: number; heightMm: number }> = {
  door: { widthMm: 900, sillMm: 0, heightMm: 2100 },
  window: { widthMm: 1200, sillMm: 900, heightMm: 1200 },
};

export interface Point {
  x: number;
  y: number;
}

// a floor region (one "room") painted with its own material
export interface FloorZone {
  id: string;
  /** position + size in PLAN-IMAGE PIXELS */
  x: number;
  y: number;
  w: number;
  h: number;
  /** material id (see MATERIALS in textures.ts) */
  matId: string;
}

// an imported real-space scan mesh (from a free LiDAR scanner app) shown live in 3D
export interface RoomScan {
  url: string;             // object URL of the uploaded mesh
  format: "obj" | "glb";
  rotYdeg: number;         // user rotation about vertical
  opacity: number;         // 0..1 (lower it to see inside)
  scale: number;           // size multiplier (1 = assume the file is in metres)
  yOffset: number;         // metres up/down
}

export type Mode = "select" | "draw" | "calibrate" | "wall" | "place" | "floorzone" | "opening" | "measure";

// real-world wall sizing (millimetres)
export const WALL = {
  fullMm: 2700,
  halfMm: 1100,
  thicknessMm: 100,     // interior partition default
  extThicknessMm: 200,  // exterior wall default
};

export function wallHeightMm(h: WallHeight): number {
  return h === "full" ? WALL.fullMm : h === "half" ? WALL.halfMm : 0;
}

// resolved thickness/height for a specific wall (honour per-wall overrides)
export function wallThicknessMm(w: Wall): number {
  return w.thicknessMm ?? (w.kind === "exterior" ? WALL.extThicknessMm : WALL.thicknessMm);
}
export function wallHeightOf(w: Wall): number {
  return w.heightMm ?? wallHeightMm(w.height);
}
