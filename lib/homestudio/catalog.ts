import { Product } from "./types";
import { KENNEY_CATALOG } from "./catalogData";
import { QUATERNIUS_CATALOG } from "./catalogDataQuaternius";

// The built-in starter catalog. Real CC0 GLB models (Kenney Furniture Kit) carry
// TRUE dimensions in millimetres; the 3D view auto-fits each model to its dims so
// what you see is the real size. A furniture company swaps these stand-ins for
// their own products (same shape: name + true mm dimensions + glbUrl).
export const CATALOG: Product[] = [
  ...KENNEY_CATALOG,
  ...QUATERNIUS_CATALOG,
  // higher-fidelity demo models (Khronos sample assets) — show what a maker's own
  // photoreal GLB looks like dropped into the same pipeline.
  { id: "demo-sofa-glb",  name: "Velvet Sofa (HD demo)", category: "Seating", dimensions_mm: { w: 2050, d: 950, h: 800 }, color: "#6b7280", glbUrl: "/models/demo-sofa.glb" },
  { id: "demo-chair-glb", name: "Sheen Chair (HD demo)", category: "Seating", dimensions_mm: { w: 700,  d: 750, h: 950 }, color: "#8b8f9a", glbUrl: "/models/demo-chair.glb" },
];

export function getProduct(id: string | null): Product | undefined {
  if (!id) return undefined;
  return CATALOG.find((p) => p.id === id);
}

// resolve against both the built-in catalog and the user's own (AI-generated) library
export function resolveProduct(id: string | null, userProducts: Product[]): Product | undefined {
  if (!id) return undefined;
  return CATALOG.find((p) => p.id === id) ?? userProducts.find((p) => p.id === id);
}
