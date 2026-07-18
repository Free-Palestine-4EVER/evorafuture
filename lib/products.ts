// Evora catalogue — the six real Evora pieces the client supplied (converted
// from their SketchUp/CAD sources). Each `id` matches its file under
// public/models/furni/<id>.glb and thumbnail public/posters/furni/<id>.png.
//
// This is the SINGLE product source of truth. Every product carries BOTH a
// type `category` and a `rooms[]` tag (where it lives in the home), so the
// taxonomy resolver (lib/shopTaxonomy.ts) can answer every shop URL — by type
// or by room — from one list. There is deliberately NO price/currency field:
// "no prices" is a structural guarantee, not a styling choice.
//
// `swatchHints` (optional) name the upholstery material(s) in each GLB so the
// live recolor targets the fabric precisely instead of guessing by colour.

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
  // Case-insensitive substrings that identify the upholstery material(s) in the
  // GLB, so the finish-swatch recolor tints the fabric and leaves wood/metal.
  swatchHints?: string[];
}

export const CATEGORIES: Category[] = [
  "Sofas",
  "Seating",
  "Tables",
  "Storage",
  "Bedroom",
];

// id, name, category, rooms, w, d, h(cm), material, hex, tagline, blurb, badge, swatchHints
type Row = [
  string, string, Category, Room[],
  number, number, number,
  string, string, string, string, (Product["badge"] | ""), string[]
];

const ROWS: Row[] = [
  // ── Sofas ──
  ["corner-sofa", "Corniche", "Sofas", ["living", "guest"], 330, 250, 90,
    "Cream velour", "#e6ded0", "Modular corner sofa",
    "A generous corner sofa built for the majlis — soft rolled arms, deep channel-stitched seats and a low, grounded stance in warm cream velour. The room gathers around it.",
    "Bestseller", ["velour"]],
  ["curve-sofa-2seat", "Hilal", "Sofas", ["living"], 192, 110, 66,
    "Taupe velvet", "#cbbfae", "Curved two-seater",
    "A single sculptural curve in soft taupe velvet — a crescent two-seater that turns a corner into a conversation. Quietly grand, endlessly photogenic.",
    "New", ["vray", "2110305"]],
  ["fahrenheit-sofa", "Fahrenheit", "Sofas", ["living", "guest"], 173, 66, 72,
    "Tufted velvet", "#c9b39a", "Three-seat sofa",
    "The Fahrenheit three-seater — a deep button-tufted back, softly rolled arms and turned hardwood legs, finished with a row of scatter cushions. The centrepiece of the majlis.",
    "Bestseller", []],
  ["fahrenheit-loveseat", "Fahrenheit Duo", "Sofas", ["living", "guest"], 126, 66, 68,
    "Tufted velvet", "#cdb89e", "Two-seat sofa",
    "The two-seat companion to the Fahrenheit — the same tufted comfort and carved feet, scaled for a reading corner or the foot of a larger room.",
    "", []],

  // ── Seating ──
  ["fahrenheit-armchair", "Fahrenheit Wing", "Seating", ["living", "guest"], 66, 66, 72,
    "Tufted velvet", "#c7b39b", "Wingback armchair",
    "A tufted wingback with a high, enveloping back and turned front legs — the armchair the whole Fahrenheit collection is drawn around. A corner of your own.",
    "New", []],

  // ── Tables ──
  ["fahrenheit-dining-table", "Fahrenheit Table", "Tables", ["dining"], 240, 110, 78,
    "Walnut & upholstery", "#8a6a44", "Dining table & chairs",
    "The Fahrenheit dining table — a long top on a sculpted base, dressed with a full run of tufted chairs. Built to host from the first coffee to the last course.",
    "Bestseller", []],
  ["fahrenheit-side-table", "Fahrenheit Guéridon", "Tables", ["living", "guest"], 44, 44, 36,
    "Carved hardwood", "#9c7b4e", "Carved side table",
    "A small carved side table from the Fahrenheit collection — a scrolled apron and fluted legs, a resting place for a lamp or a cup beside any seat.",
    "", []],

  // ── Bedroom ──
  ["bed", "Layl", "Bedroom", ["bedroom"], 180, 210, 118,
    "Ivory linen & velvet", "#e7dfce", "Upholstered bed",
    "A low upholstered bed with a soft, wide headboard you can sink back into, dressed in crisp ivory linen. The quiet end of the day.",
    "Bestseller", ["2201261"]],
  ["turkish-room", "Anadolu", "Bedroom", ["bedroom"], 460, 270, 205,
    "Walnut & ivory", "#cbb89c", "Bedroom suite",
    "The Anadolu suite — an upholstered bed, a mirrored walnut dresser and bench, composed as one warm, complete room in the Turkish tradition.",
    "Limited", ["cewsbvr0100", "cewsbvr0096"]],
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

// Pieces that also ship a USDZ (public/models/furni/<id>.usdz) for iOS AR
// Quick Look — the Meshy-retextured Fahrenheit collection.
const HAS_USDZ = new Set([
  "fahrenheit-sofa",
  "fahrenheit-loveseat",
  "fahrenheit-armchair",
  "fahrenheit-dining-table",
  "fahrenheit-side-table",
]);

export const products: Product[] = ROWS.map(
  ([id, name, category, rooms, w, d, h, material, hex, tagline, description, badge, swatchHints]) => ({
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
    ...(HAS_USDZ.has(id) ? { iosModel: `/models/furni/${id}.usdz` } : {}),
    arPlacement: "floor",
    ...(badge ? { badge: badge as Product["badge"] } : {}),
    ...(swatchHints && swatchHints.length ? { swatchHints } : {}),
  })
);

export const posterFor = (p: Product) =>
  p.model.replace("/models/", "/posters/").replace(/\.glb$/, ".png");

export const getProduct = (id: string) => products.find((p) => p.id === id);

// ── Bilingual prose ───────────────────────────────────────────────────────
// The English `tagline`/`description` live in ROWS above; this is their warm
// native-Arabic transcreation — written as original copy, not a calque, naming
// the SAME real materials (مخمل، جوز، بلوط، كتّان). Keyed by id so the three
// without an entry falls back to the English, so nothing ever renders empty.
export interface LocalizedCopy {
  tagline: string;
  description: string;
}

const AR_COPY: Record<string, LocalizedCopy> = {
  // ── Sofas ──
  "corner-sofa": { tagline: "كنبة زاوية معيارية", description: "كنبة زاوية كريمة صُنعت للمجلس — بمساندَ مستديرة طريّة، ومقاعدَ عميقةٍ مخيطةٍ بالقنوات، ووقفةٍ منخفضةٍ ثابتة من المخمل الكريمي الدافئ. حولها تجتمع الغرفة." },
  "curve-sofa-2seat": { tagline: "كنبة منحنية ثنائية", description: "انحناءةٌ واحدةٌ كالنحت من المخمل الرمادي البُنّي الناعم — كنبةٌ هلاليةٌ لشخصين تحوّل الزاوية إلى حديث. فخمةٌ بهدوء، وأخّاذةٌ من كل زاوية." },

  // ── Sofas (مجموعة فهرنهايت) ──
  "fahrenheit-sofa": { tagline: "كنبة ثلاثية", description: "كنبة فهرنهايت الثلاثية — ظهرٌ عميق مكبوس بالأزرار، ومساندُ مدوّرةٌ ناعمة، وأرجلٌ خشبيةٌ مخروطة، تُزيّنها صفٌّ من الوسائد. قلب المجلس." },
  "fahrenheit-loveseat": { tagline: "كنبة ثنائية", description: "رفيقة فهرنهايت لشخصين — الراحة المكبوسة نفسها والأرجل المنحوتة، بمقاسٍ يناسب ركن القراءة أو طرف الغرفة الأكبر." },

  // ── Seating ──
  "fahrenheit-armchair": { tagline: "كرسي بظهر جناحي", description: "كرسيٌّ مكبوس بظهرٍ عالٍ يحتضنك وأرجلٍ أماميةٍ مخروطة — الكرسي الذي بُنيت حوله مجموعة فهرنهايت كاملة. ركنٌ خاصٌّ بك." },

  // ── Tables ──
  "fahrenheit-dining-table": { tagline: "طاولة طعام وكراسي", description: "طاولة طعام فهرنهايت — سطحٌ طويل على قاعدةٍ منحوتة، مع مجموعةٍ كاملةٍ من الكراسي المكبوسة. صُنعت لتستضيف من فنجان القهوة الأول إلى آخر الأطباق." },
  "fahrenheit-side-table": { tagline: "طاولة جانبية منحوتة", description: "طاولةٌ جانبيةٌ صغيرة منحوتة من مجموعة فهرنهايت — إطارٌ مزخرف وأرجلٌ محزّزة، مكانٌ لأباجورةٍ أو فنجانٍ بجانب أيّ مقعد." },

  // ── Bedroom ──
  bed: { tagline: "سرير منجّد", description: "سرير منخفض منجّد بظهرٍ عريضٍ طريٍّ تتّكئ عليه، يُكسى بكتّانٍ عاجيٍّ ناصع. نهاية اليوم الهادئة." },
  "turkish-room": { tagline: "طقم غرفة نوم", description: "طقم الأناضول — سريرٌ منجّد، وتسريحةٌ من خشب الجوز بمرآة ومقعد، مؤلّفةً كغرفةٍ واحدةٍ دافئةٍ متكاملة على الطراز التركي." },
};

/** Tagline + description for a piece in the active language (EN fallback). */
export function productCopy(p: Product, lang: "en" | "ar"): LocalizedCopy {
  if (lang === "ar") {
    const ar = AR_COPY[p.id];
    if (ar) return ar;
  }
  return { tagline: p.tagline, description: p.description };
}
