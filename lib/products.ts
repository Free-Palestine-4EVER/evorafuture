// Evora catalogue — the blue velvet sofa (main piece) plus 28 hand-picked
// imports. Each `id` matches its file under public/models/furni/<id>.glb and
// thumbnail public/posters/furni/<id>.png.
//
// This is the SINGLE product source of truth. Every product carries BOTH a
// type `category` and a `rooms[]` tag (where it lives in the home), so the
// taxonomy resolver (lib/shopTaxonomy.ts) can answer every shop URL — by type
// or by room — from one list. There is deliberately NO price/currency field:
// "no prices" is a structural guarantee, not a styling choice.

export type Category = "Sofas" | "Seating" | "Tables" | "Storage" | "Bedroom";

// Where a piece lives — drives the "Shop by room" hub and the
// "Complete the room" rail. A piece can belong to more than one room.
export type Room = "living" | "dining" | "bedroom" | "guest" | "outdoor" | "kitchen";

export interface Colorway {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: Category;
  rooms: Room[];
  dimensions: { w: number; d: number; h: number };
  materials: string[];
  colorways: Colorway[];
  description: string;
  model: string;
  iosModel?: string;
  arPlacement: "floor" | "wall";
  badge?: "New" | "Bestseller" | "Limited";
}

export const CATEGORIES: Category[] = [
  "Sofas",
  "Seating",
  "Tables",
  "Storage",
  "Bedroom",
];

// id, name, category, rooms, w, d, h(cm), material, hex, tagline, blurb, badge?
type Row = [
  string, string, Category, Room[],
  number, number, number,
  string, string, string, string, (Product["badge"] | "")
];

const ROWS: Row[] = [
  // ── The main piece ──
  ["bed", "Laurel", "Bedroom", ["bedroom"], 314, 226, 118, "Beige velvet & oak", "#b9a596", "Upholstered bed set", "The piece the room is built around — a low upholstered bed with a softly curved, button-tufted headboard in warm beige velvet, dressed in crisp white linen and flanked by a pair of matching nightstands. The quiet end of the day.", "Bestseller"],

  // ── Sofas ──
  ["item-1", "Halden", "Sofas", ["living", "guest"], 224, 96, 80, "Bouclé wool", "#cdbfa6", "Three-seat sofa", "A low, generous three-seater with deep cushions and a quiet, tailored line.", ""],
  ["item-2", "Brenna", "Sofas", ["living", "guest"], 262, 100, 78, "Brushed linen", "#d2cabb", "Grand sofa", "A long, low sofa built for stretching out — soft enough to sink into, structured enough to last.", "New"],
  ["item-3", "Fjord", "Sofas", ["living", "guest"], 236, 98, 79, "Wool blend", "#9aa0a0", "Three-seat sofa", "A clean-lined sofa in cool grey wool with a relaxed, lived-in seat.", ""],
  ["item-4", "Loom", "Sofas", ["living"], 200, 90, 62, "Ribbed velvet", "#6e7043", "Low modular sofa", "A floor-hugging modular sofa in ribbed olive velvet. Loose, organic, endlessly rearrangeable.", ""],
  ["item-5", "Cove", "Sofas", ["living", "guest"], 228, 96, 78, "Cotton weave", "#dcd5c6", "Three-seat sofa", "A soft, pale sofa with rounded arms and a welcoming depth. The everyday hero.", ""],
  ["item-7", "Sten", "Sofas", ["living", "guest"], 240, 98, 80, "Chenille", "#c2a888", "Three-seat sofa", "A warm chenille sofa with plump cushions and a grounded, easy stance.", ""],
  ["item-9", "Solène", "Sofas", ["living", "guest"], 250, 150, 76, "Cream bouclé", "#e3dccb", "Curved sofa", "A sculptural curved sofa that wraps a room in conversation. Quietly grand.", "Limited"],
  ["item-14", "Bridge", "Sofas", ["living", "guest"], 226, 98, 80, "Saddle leather", "#7a5235", "Leather sofa", "A broad leather sofa that softens and deepens with every year of use.", ""],
  ["item-17", "Aspen", "Sofas", ["living", "guest"], 218, 96, 78, "Tan leather", "#9c6b3e", "Leather sofa", "A low tan-leather sofa with a wood frame and an honest, hard-wearing build.", ""],
  ["item-24", "Saddle", "Sofas", ["living", "guest"], 224, 98, 82, "Tufted leather", "#6a4a35", "Tufted leather sofa", "A deeply tufted leather sofa with a club-room confidence. Built to be inherited.", ""],
  ["item-25", "Mallory", "Sofas", ["living"], 296, 182, 74, "Tufted weave", "#e0d8c7", "Tufted sectional", "A large tufted sectional that turns an open plan into a destination.", "New"],

  // ── Seating ──
  ["item-8", "Forge", "Seating", ["living", "guest"], 100, 100, 42, "Tufted leather & brass", "#5a4632", "Cocktail ottoman", "A tufted leather ottoman on a fine brass frame — extra seat, footrest, or low table.", ""],
  ["item-10", "Aalto", "Seating", ["dining"], 48, 52, 84, "Steam-bent ash", "#c9a877", "Dining chair", "A featherweight dining chair with a steam-bent frame and a forgiving curved back.", ""],
  ["item-11", "Nord", "Seating", ["living", "guest"], 72, 78, 88, "Oak & wool", "#b08a5a", "Armchair", "A wood-framed armchair with a soft, deep seat. Reading, talking, dozing.", ""],
  ["item-13", "Hopper", "Seating", ["living", "guest"], 70, 72, 82, "Velvet & steel", "#3e5e57", "Accent chair", "A teal accent chair slung on a slim steel frame. A jolt of colour with a small footprint.", "New"],
  ["item-16", "Marlow", "Seating", ["dining"], 52, 56, 86, "Canvas & oak", "#cdb79a", "Folding chair", "A handsome folding chair in canvas and oak — for the table that grows on a whim.", ""],
  ["item-18", "Linden", "Seating", ["bedroom", "living"], 120, 45, 50, "Leather & oak", "#8a5a36", "Upholstered bench", "A leather-and-oak bench with a soft cushioned top. End of bed, hallway, window.", ""],
  ["item-19", "Wren", "Seating", ["living", "guest"], 74, 76, 78, "Bouclé", "#ddd4c2", "Tub chair", "A rounded tub chair with a soft, enveloping shell. Sculpture you can sit in.", ""],
  ["item-20", "Pebble", "Seating", ["living", "guest"], 64, 66, 80, "Wool", "#9aa6ac", "Occasional chair", "A compact occasional chair with a gentle, organic profile.", ""],
  ["item-23", "Nimbus", "Seating", ["living"], 85, 85, 75, "Heavy cotton", "#9a958a", "Bean bag", "An oversized cotton bean bag that takes the shape of whoever lands in it.", ""],
  ["item-26", "Saga", "Seating", ["dining"], 50, 54, 82, "Moulded shell", "#4a4744", "Dining chair", "A clean moulded dining chair with a confident, minimal line.", ""],
  ["item-27", "Tonin", "Seating", ["living", "guest"], 74, 78, 86, "Boiled wool", "#dcd9d2", "Designer armchair", "An Italian-style armchair with a crisp silhouette and a soft, structured seat.", "Limited"],

  // ── Tables ──
  ["item-15", "Mesa", "Tables", ["dining"], 200, 95, 75, "Marble & steel", "#e6e2da", "Dining table", "A marble-topped dining table on a fine black-steel base. Built to host for decades.", "Bestseller"],
  ["item-22", "Basin", "Tables", ["living", "guest"], 110, 110, 45, "Microcement", "#cdc6b8", "Round coffee table", "A round microcement table with a soft monolithic form. Tactile and indestructible.", ""],
  ["item-28", "Bistro", "Tables", ["dining"], 200, 95, 75, "Lacquer & steel", "#e8e6e0", "Dining set", "A compact dining set — table and chairs that move as one. Breakfast nook to dinner party.", ""],

  // ── Storage ──
  ["item-21", "Atlas", "Storage", ["living"], 200, 45, 130, "Walnut", "#8a6b45", "Media console", "An open walnut media wall with display shelving and a place for everything.", ""],

  // ── Bedroom ──
  ["item-6", "Aurelia", "Bedroom", ["bedroom"], 170, 215, 200, "Upholstered linen", "#dcd2bf", "Arched canopy bed", "A statement bed framed by a soft arched canopy. The calm centre of the room.", "Limited"],
  ["item-12", "Suna", "Bedroom", ["bedroom"], 220, 235, 100, "Linen", "#cfc6b3", "Platform bed", "A low upholstered platform bed with a generous headboard you can lean into.", ""],
];

// Curated finish palettes. The 3D viewer recolors the upholstery live, so these
// double as real, choosable options — on desktop and in AR alike.
const FABRIC_FINISHES: Colorway[] = [
  { name: "Oat", hex: "#d2cabb" },
  { name: "Bone", hex: "#e6ddca" },
  { name: "Sage", hex: "#9aa088" },
  { name: "Olive", hex: "#6e7043" },
  { name: "Slate", hex: "#6f757b" },
  { name: "Clay", hex: "#b27457" },
  { name: "Ink", hex: "#36352f" },
];
const LEATHER_FINISHES: Colorway[] = [
  { name: "Tan", hex: "#9c6b3e" },
  { name: "Cognac", hex: "#7a5235" },
  { name: "Saddle", hex: "#6a4a35" },
  { name: "Espresso", hex: "#4a3526" },
  { name: "Oxblood", hex: "#6e3b34" },
  { name: "Black", hex: "#2b2723" },
];

// Build a 5-finish set: the as-shown finish first, then on-brand alternates
// drawn from the palette that matches the piece's material (fabric vs leather),
// skipping any that sit too close to the as-shown colour.
function buildColorways(material: string, hex: string): Colorway[] {
  const isLeather = /leather/i.test(material);
  const pool = isLeather ? LEATHER_FINISHES : FABRIC_FINISHES;
  const v = (h: string) => parseInt(h.replace("#", ""), 16);
  const near = (a: string, b: string) => {
    const x = v(a), y = v(b);
    const dr = ((x >> 16) & 255) - ((y >> 16) & 255);
    const dg = ((x >> 8) & 255) - ((y >> 8) & 255);
    const db = (x & 255) - (y & 255);
    return dr * dr + dg * dg + db * db < 900; // ~30/channel
  };
  const alts = pool.filter((c) => !near(c.hex, hex)).slice(0, 4);
  return [{ name: "As shown", hex }, ...alts];
}

export const products: Product[] = ROWS.map(
  ([id, name, category, rooms, w, d, h, material, hex, tagline, description, badge]) => ({
    id,
    name,
    tagline,
    category,
    rooms,
    dimensions: { w, d, h },
    materials: material.split(" & ").map((m) => m.trim()),
    colorways: buildColorways(material, hex),
    description,
    model: `/models/furni/${id}.glb`,
    arPlacement: "floor",
    ...(badge ? { badge: badge as Product["badge"] } : {}),
  })
);

export const posterFor = (p: Product) =>
  p.model.replace("/models/", "/posters/").replace(/\.glb$/, ".png");

export const getProduct = (id: string) => products.find((p) => p.id === id);
