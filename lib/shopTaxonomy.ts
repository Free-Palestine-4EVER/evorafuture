// ─────────────────────────────────────────────────────────────────────────
//  EVORA — Shop taxonomy (the one resolver)
//
//  lib/products.ts is the single product source of truth. THIS file is the
//  only place that turns a URL slug — a type ("sofas"), a room ("living"),
//  a home-page world ("coffee"), or a soft bucket with no 3D yet
//  ("chandeliers") — into a real, non-empty answer.
//
//  The rule that kills the dead-button bug: EVERY slug resolves to either a
//  non-empty product query OR a soft bucket that renders an "enquire in the
//  Khalda showroom" card. No button in the whole site can ever land on an
//  empty grid, because every consumer (Nav, CategoryRail, the Rooms hub,
//  the home Collections worlds, the Quick View "View all") routes through
//  `resolveSlug` here.
// ─────────────────────────────────────────────────────────────────────────

import {
  products,
  CATEGORIES,
  type Product,
  type Category,
  type Room,
} from "@/lib/products";

export type TaxKind = "type" | "room" | "soft";

export interface TaxNode {
  slug: string;
  labelEN: string;
  labelAR: string;
  /** presentational hero/card image (public/...) */
  image: string;
  /** short editorial note — used by the Rooms hub + page header */
  noteEN: string;
  noteAR: string;
  kind: TaxKind;
  /** the products this slug shows. Empty ⇒ render the enquire card. */
  resolve: () => Product[];
}

// ── query helpers ────────────────────────────────────────────────────────
const inCat = (c: Category) => products.filter((p) => p.category === c);
const inRoom = (r: Room) => products.filter((p) => p.rooms.includes(r));
const uniq = (list: Product[]) =>
  Array.from(new Map(list.map((p) => [p.id, p])).values());
/** Tables + Storage — the "finishing details" hub. */
const accessories = () => uniq([...inCat("Tables"), ...inCat("Storage")]);

// ── the canonical nodes, keyed by slug ───────────────────────────────────
export const TAXONOMY: Record<string, TaxNode> = {
  // ── catalogue type categories ──
  sofas: {
    slug: "sofas",
    labelEN: "Sofas",
    labelAR: "الكنب",
    image: "/evora/room-sofas.jpg",
    noteEN: "Where the family lands every evening",
    noteAR: "حيث تجتمع العائلة كل مساء",
    kind: "type",
    resolve: () => inCat("Sofas"),
  },
  seating: {
    slug: "seating",
    labelEN: "Armchairs & Seating",
    labelAR: "الكراسي والمقاعد",
    image: "/evora/ig-chesterfield.jpg",
    noteEN: "One sculpted seat finishes a corner",
    noteAR: "مقعدٌ منحوت يُكمل الزاوية",
    kind: "type",
    resolve: () => inCat("Seating"),
  },
  tables: {
    slug: "tables",
    labelEN: "Tables & Accessories",
    labelAR: "الطاولات والإكسسوارات",
    image: "/evora/vid-coffee.jpg",
    noteEN: "The finishing details",
    noteAR: "اللمسات الأخيرة",
    kind: "type",
    resolve: accessories,
  },
  storage: {
    slug: "storage",
    labelEN: "Wardrobes & Storage",
    labelAR: "الخزائن والتخزين",
    image: "/evora/p02.jpg",
    noteEN: "Built-in, made to measure",
    noteAR: "حسب القياس، تُصنع لمساحتك",
    kind: "type",
    resolve: () => inCat("Storage"),
  },

  // ── lived-in rooms ──
  living: {
    slug: "living",
    labelEN: "Living",
    labelAR: "غرفة المعيشة",
    image: "/evora/room-living.jpg",
    noteEN: "Where the home gathers",
    noteAR: "حيث يجتمع البيت",
    kind: "room",
    resolve: () => inRoom("living"),
  },
  dining: {
    slug: "dining",
    labelEN: "Dining",
    labelAR: "غرفة الطعام",
    image: "/evora/room-dining.jpg",
    noteEN: "Long evenings, well set",
    noteAR: "أمسياتٌ طويلة وسفرةٌ أنيقة",
    kind: "room",
    resolve: () => inRoom("dining"),
  },
  bedroom: {
    slug: "bedroom",
    labelEN: "Bedroom",
    labelAR: "غرفة النوم",
    image: "/evora/room-bedrooms.jpg",
    noteEN: "The quiet end of the day",
    noteAR: "نهاية اليوم الهادئة",
    kind: "room",
    resolve: () => inRoom("bedroom"),
  },
  guest: {
    slug: "guest",
    labelEN: "Guest · Majlis",
    labelAR: "المجلس",
    image: "/evora/p06.jpg",
    noteEN: "Where guests see your taste first",
    noteAR: "حيث يرى ضيوفك ذوقك أوّلًا",
    kind: "room",
    resolve: () => inRoom("guest"),
  },

  // ── soft buckets (no GLBs yet) — never an empty grid ──
  // `decor` borrows the nearest filled set (the accessories hub) so it stays
  // shoppable; the rest render the "enquire in the Khalda showroom" card.
  decor: {
    slug: "decor",
    labelEN: "Décor & Accessories",
    labelAR: "الديكور والإكسسوارات",
    image: "/evora/p04.jpg",
    noteEN: "The finishing details",
    noteAR: "اللمسات الأخيرة",
    kind: "type",
    resolve: accessories,
  },
  chandeliers: {
    slug: "chandeliers",
    labelEN: "Chandeliers",
    labelAR: "الثريّات",
    image: "/evora/p10.jpg",
    noteEN: "Light, made an occasion",
    noteAR: "ضوءٌ يصنع المناسبة",
    kind: "soft",
    resolve: () => [],
  },
  lighting: {
    slug: "lighting",
    labelEN: "Lighting",
    labelAR: "الإضاءة",
    image: "/evora/p10.jpg",
    noteEN: "Light, made an occasion",
    noteAR: "ضوءٌ يصنع المناسبة",
    kind: "soft",
    resolve: () => [],
  },
  rugs: {
    slug: "rugs",
    labelEN: "Rugs & Textiles",
    labelAR: "السجاد والمنسوجات",
    image: "/evora/p09.jpg",
    noteEN: "The layer underfoot",
    noteAR: "الطبقة التي تحت قدميك",
    kind: "soft",
    resolve: () => [],
  },
  outdoor: {
    slug: "outdoor",
    labelEN: "Outdoor & Garden",
    labelAR: "الحديقة والخارج",
    image: "/evora/room-garden.jpg",
    noteEN: "The home, stepped outside",
    noteAR: "البيت، يمتدّ إلى الخارج",
    kind: "soft",
    resolve: () => [],
  },
  kitchen: {
    slug: "kitchen",
    labelEN: "Kitchens",
    labelAR: "المطابخ",
    image: "/evora/room-kitchen.jpg",
    noteEN: "Bespoke, cut to your stone",
    noteAR: "حسب الطلب، يُفصَّل على حجرك",
    kind: "soft",
    resolve: () => [],
  },
};

// ── aliases → canonical slug ──────────────────────────────────────────────
// Covers data.ts category ids, the home Collections worlds, the Rooms hub
// labels, and the obvious plurals/synonyms, so an upstream stream can pick
// any reasonable slug and still land somewhere real.
const ALIASES: Record<string, string> = {
  // type plurals / synonyms
  sofa: "sofas",
  couches: "sofas",
  "sofa-sets": "sofas",
  armchair: "seating",
  armchairs: "seating",
  chairs: "seating",
  lounge: "seating",
  table: "tables",
  "coffee-tables": "tables",
  "side-tables": "tables",
  accessories: "tables",
  "tables-accessories": "tables",
  finishing: "tables",
  wardrobes: "storage",
  closets: "storage",
  // rooms
  bedrooms: "bedroom",
  bed: "bedroom",
  beds: "bedroom",
  majlis: "guest",
  guests: "guest",
  // home Collections worlds (Stream 7 hrefs)
  coffee: "tables",
  // soft buckets
  chandelier: "chandeliers",
  lights: "lighting",
  light: "lighting",
  rug: "rugs",
  textiles: "rugs",
  garden: "outdoor",
  "evora-garden": "outdoor",
  kitchens: "kitchen",
};

/** Normalise a raw URL segment to a known canonical slug (or itself). */
export function normalizeSlug(raw: string): string {
  const s = decodeURIComponent(raw || "").toLowerCase().trim();
  return ALIASES[s] ?? s;
}

/** The node for a slug, or null if the slug is unknown. */
export function getTaxNode(raw: string): TaxNode | null {
  return TAXONOMY[normalizeSlug(raw)] ?? null;
}

/** Every product for a slug. Empty array ⇒ the page shows the enquire card. */
export function resolveSlug(raw: string): Product[] {
  return getTaxNode(raw)?.resolve() ?? [];
}

/** Map a catalogue Category to its canonical URL slug. */
export const CATEGORY_SLUG: Record<Category, string> = {
  Sofas: "sofas",
  Seating: "seating",
  Tables: "tables",
  Storage: "storage",
  Bedroom: "bedroom",
};

/** The categories actually present in a product list — for tab seeding. */
export function categoriesIn(list: Product[]): Category[] {
  const present = new Set(list.map((p) => p.category));
  return CATEGORIES.filter((c) => present.has(c));
}

// ── the six-room hub (shop/rooms) ─────────────────────────────────────────
// Living, Dining, Bedroom, Guest/Majlis, Tables & Accessories, Chandeliers —
// the same six rooms the home Rooms section links into. Chandeliers is a soft
// bucket and resolves to the enquire card; the other five are full of pieces.
export const ROOMS_HUB: TaxNode[] = [
  TAXONOMY.living,
  TAXONOMY.dining,
  TAXONOMY.bedroom,
  TAXONOMY.guest,
  TAXONOMY.tables,
  TAXONOMY.chandeliers,
];

/**
 * "Complete the room" — products that finish the same room as `product`.
 * Same category first (closest matches), then anything sharing a room,
 * excluding the piece itself. Returns up to `limit` editorial suggestions.
 */
export function completeTheRoom(product: Product, limit = 4): Product[] {
  const sameCat = products.filter(
    (p) => p.id !== product.id && p.category === product.category
  );
  const sameRoom = products.filter(
    (p) =>
      p.id !== product.id &&
      p.category !== product.category &&
      p.rooms.some((r) => product.rooms.includes(r))
  );
  return uniq([...sameCat, ...sameRoom]).slice(0, limit);
}
