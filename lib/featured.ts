// Three ultra-HD signature pieces, shown live in 3D at the top of /shop.
// These are richer models than the catalogue's item-N set — used to show off
// the interactive, colour-changeable 3D. Same Product shape, so they plug
// straight into ShopQuickView + the live recolour helper.

import type { Product } from "@/lib/products";

export const featured: Product[] = [
  {
    id: "azur",
    name: "Azur",
    tagline: "Curved velvet sofa",
    category: "Sofas",
    price: 3480,
    currency: "€",
    dimensions: { w: 248, d: 96, h: 78 },
    materials: ["Navy velvet", "Blackened steel", "Brass"],
    // Names match the model's KHR variants — swatches switch the designed finish.
    colorways: [
      { name: "Navy", hex: "#243a6b" },
      { name: "Champagne", hex: "#d8c4a0" },
      { name: "Gray", hex: "#8a8d90" },
      { name: "Black", hex: "#2a2a2c" },
      { name: "Pale Pink", hex: "#d8a8ad" },
    ],
    description:
      "A sculptural, single-curve sofa in deep navy velvet, floated on slim brass-tipped legs. The signature piece — generous, low, and quietly theatrical.",
    model: "/models/featured/blue-sofa.glb",
    arPlacement: "floor",
    badge: "Limited",
  },
  {
    id: "carrara",
    name: "Carrara",
    tagline: "Marble & brass coffee table",
    category: "Tables",
    price: 1880,
    currency: "€",
    dimensions: { w: 110, d: 110, h: 42 },
    materials: ["Carrara marble", "Polished brass"],
    colorways: [
      { name: "Carrara", hex: "#e8e4dc" },
      { name: "Sand", hex: "#d8cdb8" },
      { name: "Sage", hex: "#aab0a0" },
      { name: "Graphite", hex: "#5a5a5c" },
      { name: "Onyx", hex: "#2c2b2a" },
    ],
    description:
      "A round Carrara-marble top on a sculptural polished-brass ring base. Cool stone, warm metal — a centrepiece built to outlast trends.",
    model: "/models/featured/hd-coffee-table.glb",
    arPlacement: "floor",
    badge: "New",
  },
  {
    id: "castello",
    name: "Castello",
    tagline: "Tufted velvet lounge",
    category: "Seating",
    price: 1460,
    currency: "€",
    dimensions: { w: 116, d: 78, h: 80 },
    materials: ["Velvet", "Stained oak"],
    // Names match the model's KHR variants — Mango / Peacock velvet.
    colorways: [
      { name: "Mango Velvet", hex: "#c8502a" },
      { name: "Peacock Velvet", hex: "#1f5a5e" },
    ],
    description:
      "A low, deeply tufted lounge in rich velvet on tapered oak legs. A warm jolt of colour with a relaxed, mid-century stance — in mango or peacock.",
    model: "/models/featured/src-chair.glb",
    arPlacement: "floor",
    badge: "Bestseller",
  },
];
