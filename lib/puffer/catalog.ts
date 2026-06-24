import { Product } from "./types";

// Placeholder catalog — stands in for the furniture company's real product
// library. Each entry carries TRUE dimensions in millimetres. When the client
// sends real models, each product gains glbUrl/usdzUrl/thumbnailUrl fields and
// the 3D view swaps boxes for the actual geometry — the dimensions stay locked.
export const CATALOG: Product[] = [
  { id: "sofa-3seat",   name: "3-Seat Sofa",      category: "Seating",  dimensions_mm: { w: 2200, d: 950,  h: 850  }, color: "#6b7280" },
  { id: "sofa-2seat",   name: "2-Seat Sofa",      category: "Seating",  dimensions_mm: { w: 1600, d: 950,  h: 850  }, color: "#7c8190" },
  { id: "armchair",     name: "Armchair",         category: "Seating",  dimensions_mm: { w: 800,  d: 850,  h: 800  }, color: "#8b8f9a" },
  { id: "coffee-table", name: "Coffee Table",     category: "Tables",   dimensions_mm: { w: 1200, d: 600,  h: 420  }, color: "#a16207" },
  { id: "dining-table", name: "Dining Table (6)", category: "Tables",   dimensions_mm: { w: 1800, d: 900,  h: 750  }, color: "#92400e" },
  { id: "dining-chair", name: "Dining Chair",     category: "Seating",  dimensions_mm: { w: 460,  d: 520,  h: 900  }, color: "#b45309" },
  { id: "bed-queen",    name: "Queen Bed",        category: "Bedroom",  dimensions_mm: { w: 1600, d: 2100, h: 450  }, color: "#475569" },
  { id: "wardrobe",     name: "Wardrobe",         category: "Storage",  dimensions_mm: { w: 1500, d: 600,  h: 2200 }, color: "#5b4636" },
  { id: "bookshelf",    name: "Bookshelf",        category: "Storage",  dimensions_mm: { w: 900,  d: 350,  h: 1800 }, color: "#6b5640" },
  { id: "tv-unit",      name: "TV Unit",          category: "Storage",  dimensions_mm: { w: 1800, d: 450,  h: 500  }, color: "#3f3f46" },
  // real 3D models (Khronos sample assets) — show what a true GLB product looks like
  { id: "demo-sofa-glb",  name: "Velvet Sofa (real 3D)", category: "Seating", dimensions_mm: { w: 2050, d: 950, h: 800 }, color: "#6b7280", glbUrl: "/models/demo-sofa.glb" },
  { id: "demo-chair-glb", name: "Sheen Chair (real 3D)", category: "Seating", dimensions_mm: { w: 700,  d: 750, h: 950 }, color: "#8b8f9a", glbUrl: "/models/demo-chair.glb" },
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
