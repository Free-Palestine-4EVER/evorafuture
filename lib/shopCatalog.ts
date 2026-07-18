// ─────────────────────────────────────────────────────────────────────────
//  EVORA — Shop catalogue (image-based)
//
//  This is the Shop's OWN product list — 20 pieces per category, each a
//  single Higgsfield-generated catalog photograph (public/evora/shop/<cat>/
//  <id>.jpg), no 3D/GLB/AR involved.
//
//  It is DELIBERATELY separate from lib/products.ts: that file's six real,
//  client-supplied pieces still carry live GLB/USDZ models and stay wired to
//  the AR Showroom (/showroom) and the homepage Rooms section — neither of
//  those was touched by this catalogue. Only components/Shop.tsx,
//  ShopQuickView.tsx and lib/shopTaxonomy.ts read from THIS file now.
//
//  Colorways are shown as static finish swatches (a name + a chip) — since
//  there is no live 3D recolor here, picking one does not change the photo;
//  it only labels which finish an enquiry is about.
// ─────────────────────────────────────────────────────────────────────────

export type ShopCategory = "Sofas" | "Seating" | "Tables" | "Storage" | "Bedroom";
export type ShopRoom = "living" | "dining" | "bedroom" | "guest" | "outdoor" | "kitchen";

export interface ShopColorway {
  name: string;
  hex: string;
}

export interface ShopProduct {
  id: string;
  name: string;
  category: ShopCategory;
  rooms: ShopRoom[];
  dimensions: { w: number; d: number; h: number };
  materials: string[];
  colorways: ShopColorway[];
  tagline: string;
  description: string;
  taglineAr: string;
  descriptionAr: string;
  image: string;
  badge?: "New" | "Bestseller" | "Limited";
}

export const SHOP_CATEGORIES: ShopCategory[] = [
  "Sofas",
  "Seating",
  "Tables",
  "Storage",
  "Bedroom",
];

export const SHOP_CATEGORY_SLUG: Record<ShopCategory, string> = {
  Sofas: "sofas",
  Seating: "seating",
  Tables: "tables",
  Storage: "storage",
  Bedroom: "bedroom",
};

// Curated finish palettes — used only as static swatch chips.
const FABRIC_FINISHES: ShopColorway[] = [
  { name: "Oat", hex: "#d2cabb" },
  { name: "Bone", hex: "#e6ddca" },
  { name: "Sage", hex: "#9aa088" },
  { name: "Olive", hex: "#6e7043" },
  { name: "Slate", hex: "#6f757b" },
  { name: "Clay", hex: "#b27457" },
  { name: "Ink", hex: "#36352f" },
];
const LEATHER_FINISHES: ShopColorway[] = [
  { name: "Tan", hex: "#9c6b3e" },
  { name: "Cognac", hex: "#7a5235" },
  { name: "Saddle", hex: "#6a4a35" },
  { name: "Espresso", hex: "#4a3526" },
  { name: "Oxblood", hex: "#6e3b34" },
  { name: "Black", hex: "#2b2723" },
];

function buildColorways(material: string, hex: string): ShopColorway[] {
  const isLeather = /leather/i.test(material);
  const pool = isLeather ? LEATHER_FINISHES : FABRIC_FINISHES;
  const v = (h: string) => parseInt(h.replace("#", ""), 16);
  const near = (a: string, b: string) => {
    const x = v(a), y = v(b);
    const dr = ((x >> 16) & 255) - ((y >> 16) & 255);
    const dg = ((x >> 8) & 255) - ((y >> 8) & 255);
    const db = (x & 255) - (y & 255);
    return dr * dr + dg * dg + db * db < 900;
  };
  const alts = pool.filter((c) => !near(c.hex, hex)).slice(0, 3);
  return [{ name: "As shown", hex }, ...alts];
}

// id, name, category, rooms, w, d, h(cm), material, hex,
// tagline_en, desc_en, tagline_ar, desc_ar, badge
type Row = [
  string, string, ShopCategory, ShopRoom[],
  number, number, number,
  string, string,
  string, string, string, string,
  (ShopProduct["badge"] | "")
];

const ROWS: Row[] = [
  // ── Sofas ──────────────────────────────────────────────────────────────
  ["sofa-01", "Marmar", "Sofas", ["living"], 260, 100, 78, "Cream bouclé", "#e8e1d2",
    "Curved bouclé sofa", "A gentle curve in cream bouclé, low and soft — a single sculptural gesture for the middle of the room.",
    "كنبة بوكليه منحنية", "انحناءةٌ ناعمة بالبوكليه الكريمي، منخفضة وطرية — قطعةٌ نحتيةٌ واحدة لوسط الغرفة.", ""],
  ["sofa-02", "Cuirasse", "Sofas", ["living", "guest"], 230, 95, 80, "Cognac leather", "#7a5235",
    "Chesterfield sofa", "The deep-buttoned Chesterfield in cognac leather, rolled arms and a low stance — a study, reimagined for the living room.",
    "كنبة تشسترفيلد", "تشسترفيلد مكبوسة بعمق من الجلد الكونياكي، بمساندَ ملفوفة ووقفةٍ منخفضة — مكتبةٌ خاصة، في غرفة المعيشة.", ""],
  ["sofa-03", "Waha", "Sofas", ["living"], 320, 240, 82, "Sage linen", "#93997e",
    "Modular sectional", "A modular sectional in sage linen that reshapes itself to the room — one long, easy landing for the whole family.",
    "كنبة زاوية معيارية", "كنبةٌ معياريةٌ بالكتان الأخضر المريمي تُعيد تشكيل نفسها مع الغرفة — مهبطٌ طويلٌ ومريحٌ للعائلة كلّها.", "Bestseller"],
  ["sofa-04", "Nocturne", "Sofas", ["living"], 220, 92, 76, "Charcoal velvet", "#3a3a3a",
    "Channel-tufted sofa", "Deep channel-tufting in charcoal velvet, a quiet, architectural presence for an evening room.",
    "كنبة مخيطة بالقنوات", "خياطةٌ عميقةٌ بالقنوات من المخمل الفحمي — حضورٌ هادئٌ ومعماريٌّ لغرفةٍ مسائية.", ""],
  ["sofa-05", "Camelia", "Sofas", ["living", "guest"], 210, 90, 84, "Dusty rose velvet", "#c9a3a0",
    "Camelback sofa", "A classic camelback silhouette in dusty rose velvet — softly formal, warmly at home in the majlis.",
    "كنبة كامل باك", "خطٌّ كلاسيكيٌّ منحني الظهر بالمخمل الوردي الغبِش — رسميٌّ بلطف، ودافئٌ في المجلس.", "New"],
  ["sofa-06", "Sahel", "Sofas", ["living"], 300, 210, 80, "Oatmeal bouclé", "#d8cdb8",
    "L-shaped sectional", "A generous L-shaped sectional in oatmeal bouclé, built for long afternoons and longer conversations.",
    "كنبة زاوية بشكل L", "كنبةٌ زاويةٌ كريمة بالبوكليه الشوفاني — صُنعت لعصاري طويلة وأحاديث أطول.", ""],
  ["sofa-07", "Odense", "Sofas", ["living"], 195, 88, 78, "Mustard wool, walnut legs", "#c69a3a",
    "Danish-line sofa", "A low Danish-inspired sofa in mustard wool on slim walnut legs — a warm note of colour with a light footprint.",
    "كنبة بخطٍّ دنماركي", "كنبةٌ منخفضة بروحٍ دنماركية من الصوف الخردلي على أرجل جوزٍ نحيلة — لمسة لونٍ دافئة بحضورٍ خفيف.", ""],
  ["sofa-08", "Lin", "Sofas", ["living", "guest"], 205, 90, 82, "Ivory linen", "#ecE6d8",
    "Rolled-arm sofa", "Soft rolled arms and a crisp ivory linen cover — the sofa that disappears into every room it enters.",
    "كنبة بمسانِد ملفوفة", "مساندٌ ملفوفةٌ ناعمة وكتانٌ عاجيٌّ ناصع — كنبةٌ تنسجم مع أيّ غرفةٍ تدخلها.", ""],
  ["sofa-09", "Emeraude", "Sofas", ["living"], 190, 105, 76, "Emerald velvet", "#1f5c4a",
    "Curved loveseat", "A single emerald-velvet curve for two — a quiet, jewel-toned anchor for a reading corner.",
    "كنبة زمردية منحنية", "انحناءةٌ زمرديةٌ واحدة من المخمل لشخصين — ركيزةٌ هادئةٌ بلون الجوهر لركن القراءة.", ""],
  ["sofa-10", "Ebene", "Sofas", ["living"], 225, 95, 78, "Black leather", "#1c1a18",
    "Tuxedo sofa", "Clean, square-armed tuxedo lines in black leather — a sofa with nothing to prove.",
    "كنبة توكسيدو", "خطوطٌ مربعةٌ أنيقة على طراز التوكسيدو من الجلد الأسود — كنبةٌ لا تحتاج لإثبات شيء.", ""],
  ["sofa-11", "Olivier", "Sofas", ["living", "guest"], 215, 92, 80, "Olive velvet", "#6e7043",
    "Vintage chesterfield", "A vintage-tempered Chesterfield in olive velvet, worn-in the moment it arrives.",
    "تشسترفيلد بروحٍ عتيقة", "تشسترفيلد بمزاجٍ عتيق من المخمل الزيتوني — يبدو مألوفًا من اللحظة الأولى.", ""],
  ["sofa-12", "Rimal", "Sofas", ["living"], 280, 220, 78, "Taupe performance fabric", "#a89a86",
    "Corner sofa", "A family-proof corner sofa in a soft taupe performance weave — built for real, daily life.",
    "كنبة زاوية عائلية", "كنبةٌ زاويةٌ تتحمّل الحياة اليومية بنسيجٍ بنّيّ رماديٍّ متينٍ وناعم — للاستخدام الحقيقي كلّ يوم.", ""],
  ["sofa-13", "Roseraie", "Sofas", ["living", "guest"], 165, 85, 80, "Blush velvet", "#dcb9bd",
    "Two-seat settee", "A petite blush-velvet settee, scaled for a bay window or the foot of a bed.",
    "كنبة صغيرة لشخصين", "كنبةٌ صغيرة بالمخمل الوردي الفاتح، بمقاسٍ يناسب نافذة الجلوس أو نهاية السرير.", ""],
  ["sofa-14", "Brume", "Sofas", ["living"], 210, 95, 82, "Grey tweed", "#8a8a86",
    "Sleeper sofa", "A grey tweed sofa that folds into a proper bed — the guest room's best-kept secret.",
    "كنبة سرير", "كنبةٌ من الجوخ الرمادي تتحوّل إلى سريرٍ حقيقي — سرّ غرفة الضيوف الأفضل.", ""],
  ["sofa-15", "Teka", "Sofas", ["living"], 200, 88, 74, "Rust velvet, teak frame", "#a1502c",
    "Mid-century sofa", "A mid-century frame in solid teak, upholstered in a warm rust velvet — one confident colour, one honest wood.",
    "كنبة بروح منتصف القرن", "هيكلٌ من خشب التيك الصلب على طراز منتصف القرن، مكسوٌّ بمخملٍ صدئيٍّ دافئ — لونٌ واحدٌ واثق وخشبٌ صادق.", ""],
  ["sofa-16", "Nuage", "Sofas", ["living"], 235, 100, 78, "Off-white bouclé", "#efe9dd",
    "Curved bouclé loveseat", "An off-white bouclé loveseat, cloud-soft to look at and to sit in.",
    "كنبة بوكليه غائمة", "كنبةٌ بالبوكليه الأبيض المائل للكريمي، ناعمةٌ كالغيمة للعين واليد.", ""],
  ["sofa-17", "Ramla", "Sofas", ["living"], 290, 175, 78, "Sand linen", "#d9c9a8",
    "Sofa with chaise", "A modular sofa with a long chaise in sand linen — made for stretching out, not sitting up straight.",
    "كنبة بامتدادٍ طويل", "كنبةٌ معياريةٌ بامتدادٍ طويل من الكتان الرملي — صُنعت للاستلقاء لا للجلوس المشدود.", ""],
  ["sofa-18", "Foret", "Sofas", ["living", "guest"], 200, 90, 105, "Forest green velvet", "#2e4a3a",
    "Wingback sofa", "A tall wingback silhouette in forest-green velvet — a sofa with its own quiet gravity.",
    "كنبة بظهرٍ جناحي", "ظهرٌ عالٍ على طراز الأجنحة من المخمل الأخضر الغابي — كنبةٌ لها ثقلها الهادئ الخاص.", "Limited"],
  ["sofa-19", "Safran", "Sofas", ["living"], 215, 92, 76, "Camel leather", "#b07a43",
    "Track-arm sofa", "Straight track arms in warm camel leather — a lean, tailored profile for a modern living room.",
    "كنبة بمسانِد مستقيمة", "مساندُ مستقيمةٌ من الجلد الجملي الدافئ — قوامٌ نحيلٌ ومفصّلٌ لغرفة معيشةٍ عصرية.", ""],
  ["sofa-20", "Argile", "Sofas", ["living"], 240, 105, 78, "Cloud grey bouclé", "#cfcac2",
    "Sculptural sofa", "A sculptural, armless silhouette in cloud-grey bouclé — the sofa as a single soft object.",
    "كنبة نحتية", "قوامٌ نحتيٌّ بلا مسانِد من البوكليه الرمادي الغائم — الكنبة كقطعةٍ طريّةٍ واحدة.", ""],

  // ── Seating ────────────────────────────────────────────────────────────
  ["seat-01", "Cocon", "Seating", ["living", "guest"], 74, 78, 108, "Forest green velvet", "#2e4a3a",
    "Wingback armchair", "A deep wingback armchair in forest-green velvet — its own quiet corner, wherever it lands.",
    "كرسي بظهرٍ جناحي", "كرسيٌّ عميق بظهرٍ جناحي من المخمل الأخضر الغابي — ركنه الهادئ الخاص أينما وُضع.", ""],
  ["seat-02", "Bouclette", "Seating", ["living"], 78, 80, 82, "Cream bouclé", "#e8e1d2",
    "Bouclé swivel chair", "A swivelling cream-bouclé chair that turns to face the conversation, or the view.",
    "كرسي بوكليه دوّار", "كرسيٌّ دوّار بالبوكليه الكريمي يستدير نحو الحديث، أو نحو المنظر.", "New"],
  ["seat-03", "Ambre", "Seating", ["living", "guest"], 82, 84, 78, "Cognac leather", "#7a5235",
    "Egg chair", "A cocooning egg chair in cognac leather — one seat, its own small room.",
    "كرسي بيضاوي", "كرسيٌّ بيضاويٌّ يحتضنك من الجلد الكونياكي — مقعدٌ واحد، غرفةٌ صغيرةٌ خاصة.", ""],
  ["seat-04", "Barril", "Seating", ["living"], 76, 76, 74, "Mustard velvet", "#c69a3a",
    "Barrel chair", "A rounded barrel chair in mustard velvet, a single warm note beside any sofa.",
    "كرسي برميلي", "كرسيٌّ مستديرٌ على شكل برميل من المخمل الخردلي — لمسة لونٍ دافئة بجانب أيّ كنبة.", ""],
  ["seat-05", "Fleur", "Seating", ["living", "guest"], 66, 70, 80, "Dusty pink linen", "#d9b3ae",
    "Slipper chair", "An armless slipper chair in dusty pink linen — light enough to carry from room to room.",
    "كرسي بلا مسانِد", "كرسيٌّ بلا مسانِد من الكتان الوردي الغبِش — خفيفٌ بما يكفي لينتقل بين الغرف.", ""],
  ["seat-06", "Laiton", "Seating", ["living"], 68, 68, 78, "Ivory bouclé, brass legs", "#ecE6d8",
    "Accent chair, brass legs", "An ivory bouclé accent chair balanced on slim brass legs — soft on top, sharp underneath.",
    "كرسي بأرجل نحاسية", "كرسيٌّ من البوكليه العاجي على أرجلٍ نحاسيةٍ نحيلة — طريٌّ من فوق، حادٌّ من تحت.", ""],
  ["seat-07", "Repos", "Seating", ["living"], 85, 90, 100, "Tan leather, walnut", "#9c6b3e",
    "Lounge chair & ottoman", "A tan-leather lounge chair on a walnut frame, with its own ottoman — a seat built for staying a while.",
    "كرسي استرخاء بمسندٍ للقدمين", "كرسي استرخاءٍ بجلدٍ بنّيٍّ فاتح على هيكلٍ من الجوز، مع مسندٍ خاصٍّ للقدمين — مقعدٌ يُصمَّم للبقاء طويلًا.", "Bestseller"],
  ["seat-08", "Osier", "Seating", ["living", "outdoor"], 72, 74, 84, "Natural rattan", "#b89968",
    "Rattan accent chair", "A hand-woven natural rattan chair — light, textural, equally at home indoors or on a shaded terrace.",
    "كرسي روطان", "كرسيٌّ منسوجٌ يدويًا من الروطان الطبيعي — خفيفٌ وملموسٌ، يليق بالداخل كما بالشرفة المظلَّلة.", ""],
  ["seat-09", "Marine", "Seating", ["living", "guest"], 72, 76, 80, "Navy velvet", "#28344a",
    "Tufted club chair", "A tufted club chair in deep navy velvet — a classic silhouette in a confident colour.",
    "كرسي نادٍ مكبوس", "كرسي نادٍ مكبوس بالمخمل الكحلي العميق — قوامٌ كلاسيكيٌّ بلونٍ واثق.", ""],
  ["seat-10", "Coquille", "Seating", ["living"], 74, 78, 76, "Terracotta boucle", "#b9673f",
    "Curved shell chair", "A curved shell-back chair in terracotta bouclé — one warm, sculptural seat.",
    "كرسي بظهرٍ صدفي", "كرسيٌّ بظهرٍ منحنٍ كالصدفة من البوكليه الطيني — مقعدٌ نحتيٌّ دافئ.", ""],
  ["seat-11", "Braise", "Seating", ["living"], 78, 82, 108, "Charcoal leather", "#2b2723",
    "Wingback recliner", "A reclining wingback in charcoal leather — the quiet corner for the end of the day.",
    "كرسي استرخاء متحرك", "كرسي جناحي متحرك من الجلد الفحمي — الركن الهادئ لنهاية اليوم.", ""],
  ["seat-12", "Sauge", "Seating", ["living", "guest"], 70, 72, 82, "Sage green linen", "#93997e",
    "Occasional chair", "A soft, sage-green linen chair for a corner that just needed one more seat.",
    "كرسي إضافي", "كرسيٌّ طريٌّ من الكتان الأخضر المريمي لركنٍ كان يحتاج مقعدًا واحدًا إضافيًا.", ""],
  ["seat-13", "Pavot", "Seating", ["living"], 76, 80, 100, "Oxblood leather", "#6e3b34",
    "Chesterfield accent chair", "A Chesterfield-quilted accent chair in oxblood leather — a single, statement-making seat.",
    "كرسي تشسترفيلد", "كرسيٌّ مبطّنٌ على طراز التشسترفيلد من الجلد العنّابي — مقعدٌ واحدٌ يلفت الأنظار.", ""],
  ["seat-14", "Cannage", "Seating", ["living"], 90, 90, 92, "Cream bouclé", "#e6ddca",
    "Rounded lounge chair", "A generously rounded lounge chair in cream bouclé — a soft full-stop in any room.",
    "كرسي استرخاءٍ مستدير", "كرسي استرخاءٍ مستديرٌ بسخاء من البوكليه الكريمي — نقطةٌ طريّةٌ في أيّ غرفة.", ""],
  ["seat-15", "Prune", "Seating", ["living"], 130, 42, 46, "Emerald velvet bench", "#1f5c4a",
    "Upholstered bench seat", "A long, tufted bench in emerald velvet — extra seating that reads as furniture, not overflow.",
    "مقعد طويل مكبوس", "مقعدٌ طويلٌ مكبوس من المخمل الزمردي — جلسةٌ إضافية تبدو كقطعة أثاثٍ لا كحلٍّ مؤقت.", ""],
  ["seat-16", "Poudre", "Seating", ["living", "guest"], 120, 40, 46, "Cane & oak", "#c7a874",
    "Accent bench", "A cane-and-oak bench at the entry or the foot of a bed — practical, and quietly handsome.",
    "مقعدٌ من الروطان والبلوط", "مقعدٌ من الروطان والبلوط عند المدخل أو نهاية السرير — عمليٌّ، وأنيقٌ بهدوء.", ""],
  ["seat-17", "Etendue", "Seating", ["living"], 80, 84, 112, "Plum velvet", "#5a3350",
    "High-back armchair", "A tall-backed armchair in plum velvet, its height alone making an entrance.",
    "كرسي بظهرٍ عالٍ", "كرسيٌّ بظهرٍ عالٍ من المخمل الأرجواني — يكفي ارتفاعه ليصنع حضورًا.", ""],
  ["seat-18", "Sculpt", "Seating", ["living", "guest"], 62, 64, 76, "Blush velvet, gold legs", "#dcb9bd",
    "Petite armchair", "A petite blush-velvet armchair on slender gold legs — the finishing chair for a small corner.",
    "كرسيٌّ صغير", "كرسيٌّ صغيرٌ من المخمل الوردي على أرجلٍ ذهبيةٍ نحيلة — كرسي اللمسة الأخيرة لركنٍ صغير.", ""],
  ["seat-19", "Ivoire", "Seating", ["living"], 92, 88, 84, "Taupe bouclé", "#a89a86",
    "Wide lounge chair", "An extra-wide lounge chair in taupe bouclé, room enough to sit however you like.",
    "كرسي استرخاءٍ عريض", "كرسي استرخاءٍ عريضٌ جدًا من البوكليه البنّي الرمادي — مساحةٌ كافية للجلوس كيفما تشاء.", ""],
  ["seat-20", "Aurore", "Seating", ["living"], 70, 72, 90, "Cream, walnut frame", "#efe9dd",
    "Sculptural accent chair", "A sculptural chair in cream fabric on an exposed walnut frame — form and wood, in equal measure.",
    "كرسيٌّ نحتي", "كرسيٌّ نحتيٌّ بقماشٍ كريمي على هيكل جوزٍ ظاهر — الشكل والخشب بمقادير متساوية.", ""],

  // ── Tables ─────────────────────────────────────────────────────────────
  ["table-01", "Marbre", "Tables", ["living"], 100, 100, 40, "Carrara marble, brass", "#e9e6df",
    "Round marble coffee table", "A round Carrara-marble top on a slim brass base — cool stone, warm metal, one lasting centrepiece.",
    "طاولة قهوة رخامية مستديرة", "سطحٌ رخاميٌّ مستدير من كرارا على قاعدةٍ نحاسيةٍ نحيلة — حجرٌ باردٌ ومعدنٌ دافئ، قطعةٌ مركزيةٌ تدوم.", "Bestseller"],
  ["table-02", "Chene", "Tables", ["dining"], 240, 100, 76, "Solid oak", "#8a6a44",
    "Live-edge dining table", "A live-edge solid oak dining table — one honest slab, ready to host for years.",
    "طاولة طعام بحافةٍ طبيعية", "طاولة طعامٍ من خشب البلوط الصلب بحافةٍ طبيعية — لوحٌ صادقٌ واحد، جاهزٌ للاستضافة لسنوات.", ""],
  ["table-03", "Gigogne", "Tables", ["living"], 60, 40, 45, "Brass & smoked glass", "#8a8378",
    "Nesting side tables", "A pair of nesting tables in brass and smoked glass — one surface, or two, exactly as needed.",
    "طاولات جانبية متداخلة", "زوجٌ من الطاولات الجانبية المتداخلة من النحاس والزجاج المدخّن — سطحٌ واحد، أو اثنان، بحسب الحاجة.", ""],
  ["table-04", "Travertin", "Tables", ["living"], 90, 90, 34, "Travertine", "#d9cdb8",
    "Travertine coffee table", "A solid travertine coffee table, sand-toned and quietly textured — honest stone, no varnish.",
    "طاولة قهوة من الترافرتين", "طاولة قهوةٍ من الترافرتين الصلب، بلونٍ رملي وملمسٍ هادئ — حجرٌ صادقٌ بلا طلاء.", ""],
  ["table-05", "Ovale", "Tables", ["dining"], 260, 110, 76, "Oak, extendable", "#8a6a44",
    "Extendable dining table", "An oak dining table that extends to seat twelve — one table for a Tuesday dinner or a whole family gathering.",
    "طاولة طعام قابلة للتمديد", "طاولة طعامٍ من البلوط تتمدّد لتتّسع لاثني عشر ضيفًا — طاولةٌ واحدة لعشاء الثلاثاء أو للعائلة كلّها.", "Limited"],
  ["table-06", "Console", "Tables", ["living"], 140, 38, 82, "Marble top, brass legs", "#e9e6df",
    "Console table", "A marble-topped console on slim brass legs, made for an entryway or the wall behind a sofa.",
    "طاولة كونسول", "طاولة كونسول برخامٍ علوي وأرجلٍ نحاسيةٍ نحيلة — للمدخل أو الجدار خلف الكنبة.", ""],
  ["table-07", "Fumee", "Tables", ["living"], 110, 60, 36, "Smoked glass, black steel", "#3a3a3a",
    "Oval smoked-glass table", "An oval smoked-glass top on a black steel frame — a coffee table that reads as almost weightless.",
    "طاولة زجاج مدخّن بيضاوية", "سطحٌ بيضاويٌّ من الزجاج المدخّن على هيكلٍ من الفولاذ الأسود — طاولةٌ تبدو بلا وزن تقريبًا.", ""],
  ["table-08", "Sculptee", "Tables", ["living"], 48, 46, 52, "Carved hardwood", "#9c7b4e",
    "Carved wood side table", "A hand-carved hardwood side table — a small, sculptural resting place for a lamp or a cup.",
    "طاولة جانبية منحوتة", "طاولةٌ جانبيةٌ منحوتة يدويًا من الخشب الصلب — مكانٌ نحتيٌّ صغير لأباجورةٍ أو فنجان.", ""],
  ["table-09", "Piedestal", "Tables", ["living"], 42, 42, 48, "Marble", "#e9e6df",
    "Marble pedestal side table", "A single marble column, cut into a pedestal side table — quiet, cool, and permanent.",
    "طاولة جانبية رخامية", "عمودٌ رخاميٌّ واحد، يُنحت إلى طاولةٍ جانبية — هادئةٌ وباردةٌ ودائمة.", ""],
  ["table-10", "Recycle", "Tables", ["dining"], 220, 100, 76, "Reclaimed wood", "#6f5a3f",
    "Reclaimed wood dining table", "A dining table built from reclaimed timber — every mark and grain line its own small history.",
    "طاولة طعام من خشبٍ معاد", "طاولة طعامٍ مصنوعة من خشبٍ معاد استخدامه — كلّ علامةٍ وخطّ عرقٍ فيها تاريخه الصغير الخاص.", ""],
  ["table-11", "Laitonne", "Tables", ["living"], 100, 55, 38, "Brass & glass", "#b08d57",
    "Brass and glass coffee table", "A geometric brass frame under a clear glass top — light, precise, and endlessly easy to style.",
    "طاولة نحاس وزجاج", "هيكلٌ نحاسيٌّ هندسي تحت سطحٍ زجاجيٍّ شفاف — خفيفةٌ ودقيقة، وسهلة التنسيق دائمًا.", ""],
  ["table-12", "Ronde", "Tables", ["dining"], 150, 150, 76, "Walnut, pedestal base", "#8a6a44",
    "Round pedestal dining table", "A round walnut dining table on a single pedestal base — no corners, no hierarchy, room for everyone.",
    "طاولة طعام مستديرة", "طاولة طعامٍ مستديرة من الجوز على قاعدةٍ محورية واحدة — بلا زوايا ولا تراتبية، ومكانٌ للجميع.", ""],
  ["table-13", "Pierre", "Tables", ["living"], 70, 60, 40, "Travertine, sculptural", "#d9cdb8",
    "Sculptural side table", "A sculptural travertine side table, cut like a single quarried form — more object than furniture.",
    "طاولة جانبية نحتية", "طاولةٌ جانبيةٌ نحتيةٌ من الترافرتين، منحوتةٌ كأنها كتلةٌ محجوريةٌ واحدة — أقرب لقطعةٍ فنية من قطعة أثاث.", ""],
  ["table-14", "Tambour", "Tables", ["living"], 45, 45, 50, "Rattan drum table", "#b89968",
    "Rattan drum side table", "A woven rattan drum table — light enough to move room to room, sturdy enough to hold a tray.",
    "طاولة روطان أسطوانية", "طاولةٌ أسطوانيةٌ منسوجة من الروطان — خفيفةٌ بما يكفي للتنقل، وثابتةٌ بما يكفي لحمل صينية.", ""],
  ["table-15", "Longue", "Tables", ["living"], 160, 35, 80, "Black metal & oak", "#3a3a3a",
    "Long console table", "A long console in black metal and oak — the whole hallway, finished in one piece.",
    "طاولة كونسول طويلة", "طاولة كونسول طويلة من المعدن الأسود والبلوط — تُنهي الممر كلّه بقطعةٍ واحدة.", ""],
  ["table-16", "Rangement", "Tables", ["living"], 110, 60, 40, "Walnut, with storage", "#8a6a44",
    "Coffee table with storage", "A walnut coffee table with a hidden drawer — the surface stays clear, the clutter doesn't.",
    "طاولة قهوة بتخزين", "طاولة قهوةٍ من الجوز بدرجٍ مخفي — يبقى السطح صافيًا، والفوضى تختفي.", ""],
  ["table-17", "Bistro", "Tables", ["dining", "outdoor"], 70, 70, 74, "Marble bistro top", "#e9e6df",
    "Marble bistro table", "A small marble bistro table for two — coffee on the terrace, or a corner breakfast for one.",
    "طاولة بيسترو رخامية", "طاولة بيسترو رخامية صغيرة لشخصين — قهوة الشرفة، أو فطور ركنٍ لشخصٍ واحد.", ""],
  ["table-18", "Duo", "Tables", ["living"], 90, 55, 42, "Oak & marble nesting", "#8a6a44",
    "Nesting coffee tables", "A nesting pair in oak and marble — one grounded surface, one lighter, always in conversation.",
    "طاولات قهوة متداخلة", "زوجٌ متداخل من البلوط والرخام — سطحٌ ثابتٌ وآخر أخفّ، في حوارٍ دائم.", ""],
  ["table-19", "Teck", "Tables", ["outdoor"], 50, 50, 48, "Teak", "#a1774a",
    "Outdoor teak side table", "A weather-ready teak side table — built for the terrace, handsome enough for the living room.",
    "طاولة تيك خارجية", "طاولةٌ جانبية من خشب التيك تتحمّل الطقس — صُنعت للشرفة، وأنيقةٌ بما يكفي لغرفة المعيشة.", ""],
  ["table-20", "Roche", "Tables", ["living"], 85, 75, 36, "Sculptural stone", "#a89a86",
    "Sculptural stone coffee table", "A single sculptural stone form, low and grounded — the coffee table as a piece of landscape indoors.",
    "طاولة قهوة حجرية نحتية", "كتلةٌ حجريةٌ نحتيةٌ واحدة، منخفضةٌ وثابتة — طاولة القهوة كقطعةٍ من الطبيعة داخل البيت.", "New"],

  // ── Storage ────────────────────────────────────────────────────────────
  ["storage-01", "Armoire", "Storage", ["bedroom"], 260, 60, 220, "Walnut, mirrored doors", "#6f5636",
    "Wardrobe, mirrored doors", "A walnut wardrobe with full mirrored doors — storage that also finishes the room.",
    "خزانة ملابس بمرايا", "خزانة ملابس من الجوز بأبوابٍ مرآوية كاملة — تخزينٌ يُكمل الغرفة أيضًا.", "Bestseller"],
  ["storage-02", "Rotin", "Storage", ["living", "dining"], 180, 45, 80, "Rattan-front oak", "#b89968",
    "Rattan-front sideboard", "An oak sideboard fronted in woven rattan — warmth and texture behind closed doors.",
    "بوفيه بواجهة روطان", "بوفيهٌ من البلوط بواجهةٍ منسوجة من الروطان — دفءٌ وملمسٌ خلف الأبواب المغلقة.", ""],
  ["storage-03", "Bibliotheque", "Storage", ["living"], 100, 35, 210, "Solid oak", "#8a6a44",
    "Tall oak bookshelf", "A floor-to-ceiling oak bookshelf — open shelving for the books, the objects, the whole collected life.",
    "مكتبة عالية من البلوط", "مكتبةٌ من البلوط تمتد من الأرض إلى السقف — رفوفٌ مفتوحة للكتب والقطع وحياةٍ كاملةٍ مُجمَّعة.", ""],
  ["storage-04", "Commode", "Storage", ["bedroom"], 55, 42, 62, "Walnut", "#6f5636",
    "Bedside chest", "A compact walnut bedside chest with a single deep drawer — quietly useful, never in the way.",
    "خزانة سرير صغيرة", "خزانة سريرٍ صغيرة من الجوز بدرجٍ عميقٍ واحد — نافعةٌ بهدوء، ولا تشغل حيّزًا زائدًا.", ""],
  ["storage-05", "Media", "Storage", ["living"], 200, 42, 48, "Black oak", "#2b2723",
    "Media console", "A low black-oak media console, cable-managed and quietly built to disappear once the screen is on.",
    "طاولة تلفاز", "طاولة تلفازٍ منخفضة من البلوط الأسود، مرتّبة الأسلاك ومصمَّمة لتختفي بمجرد تشغيل الشاشة.", ""],
  ["storage-06", "Cannelee", "Storage", ["living", "bedroom"], 90, 40, 90, "Fluted oak", "#8a6a44",
    "Fluted wood cabinet", "A fluted-front oak cabinet — a small rhythm of grooves that catches the light all day.",
    "خزانة خشبية مخدَّدة", "خزانةٌ من البلوط بواجهةٍ مخدَّدة — إيقاعٌ صغيرٌ من الأخاديد يلتقط الضوء طوال النهار.", ""],
  ["storage-07", "Miroir", "Storage", ["bedroom"], 130, 48, 78, "Walnut, mirrored top", "#6f5636",
    "Mirrored dresser", "A walnut dresser topped with a wide mirror — dressing table and storage, resolved as one piece.",
    "تسريحة بمرآة", "تسريحةٌ من الجوز بمرآةٍ عريضة أعلاها — طاولة تجميلٍ وتخزينٌ في قطعةٍ واحدة.", ""],
  ["storage-08", "Cuivre", "Storage", ["living"], 90, 42, 95, "Walnut, brass details", "#7a5235",
    "Bar cabinet", "A walnut bar cabinet with brass hardware — a small, well-kept ritual behind two closed doors.",
    "خزانة مشروبات", "خزانة مشروباتٍ من الجوز بتفاصيل نحاسية — طقسٌ صغيرٌ مرتّب خلف بابين مغلقين.", ""],
  ["storage-09", "Laque", "Storage", ["living"], 100, 34, 55, "Ivory lacquer", "#ece6d8",
    "Shoe cabinet", "An ivory-lacquer shoe cabinet by the entry — closed, clean, and unbothered by a busy household.",
    "خزانة أحذية", "خزانة أحذيةٍ بطلاءٍ عاجي عند المدخل — مغلقة ونظيفة، لا تتأثر بازدحام البيت.", ""],
  ["storage-10", "Modulaire", "Storage", ["bedroom"], 300, 60, 230, "Oak, modular", "#8a6a44",
    "Modular wardrobe system", "A modular oak wardrobe system, configured wall-to-wall — as much storage as the room can give.",
    "نظام خزائن معياري", "نظام خزائن معياريّ من البلوط، يمتد من جدارٍ إلى جدار — أقصى تخزينٍ تمنحه الغرفة.", ""],
  ["storage-11", "Tressee", "Storage", ["living", "dining"], 170, 45, 82, "Cane doors, oak", "#b89968",
    "Cane-front sideboard", "An oak sideboard with hand-caned door panels — a dining room's quiet, textured anchor.",
    "بوفيه بأبوابٍ من الخيزران", "بوفيهٌ من البلوط بألواح أبوابٍ منسوجة من الخيزران يدويًا — ركيزة غرفة الطعام الهادئة والملموسة.", ""],
  ["storage-12", "Pistache", "Storage", ["bedroom"], 90, 45, 90, "Painted sage oak", "#93997e",
    "Chest of drawers", "A sage-painted chest of drawers — a soft colour note that still holds everything it needs to.",
    "خزانة أدراج", "خزانة أدراجٍ بطلاءٍ أخضر مريمي — لمسة لونٍ ناعمة، وتحمل كلّ ما تحتاج حمله.", ""],
  ["storage-13", "Vitrine", "Storage", ["living"], 90, 38, 180, "Glass doors, brass", "#e9e6df",
    "Display cabinet", "A glass-front display cabinet with brass edging — a proper stage for the pieces worth showing.",
    "خزانة عرض زجاجية", "خزانة عرضٍ بواجهةٍ زجاجية وحوافّ نحاسية — مسرحٌ حقيقيٌّ للقطع التي تستحق العرض.", ""],
  ["storage-14", "Cedre", "Storage", ["bedroom"], 120, 55, 210, "White oak", "#c9b896",
    "Linen closet", "A white-oak linen closet, tall and quiet, for towels, sheets and the year's spare blankets.",
    "خزانة بياضات", "خزانة بياضاتٍ عالية وهادئة من البلوط الأبيض، للمناشف والملاءات وبطانيات الفصل الاحتياطية.", ""],
  ["storage-15", "Corbeille", "Storage", ["living"], 150, 40, 78, "Oak, woven baskets", "#8a6a44",
    "Console with baskets", "An oak console fitted with woven baskets — open storage that still looks intentional.",
    "كونسول بسلال منسوجة", "كونسول من البلوط مزوّد بسلالٍ منسوجة — تخزينٌ مفتوح يبدو مقصودًا رغم ذلك.", ""],
  ["storage-16", "Malle", "Storage", ["living", "bedroom"], 100, 45, 46, "Leather-wrapped trunk", "#7a5235",
    "Trunk storage bench", "A leather-wrapped trunk that doubles as a bench — storage with somewhere to sit down first.",
    "صندوق تخزين بمقعد", "صندوقٌ مغلَّفٌ بالجلد يُستخدم كمقعدٍ أيضًا — تخزينٌ يمنحك مكانًا للجلوس أولًا.", ""],
  ["storage-17", "Angle", "Storage", ["living"], 90, 90, 100, "Walnut corner cabinet", "#6f5636",
    "Corner cabinet", "A walnut corner cabinet that claims a dead corner and turns it into real storage.",
    "خزانة زاوية", "خزانة زاوية من الجوز تستثمر ركنًا مهملًا وتحوّله إلى تخزينٍ حقيقي.", ""],
  ["storage-18", "Coiffeuse", "Storage", ["bedroom"], 110, 45, 75, "Marble top, oak", "#e9e6df",
    "Vanity with storage", "A marble-topped vanity with drawer storage below — morning routines, given their own quiet desk.",
    "طاولة تجميل بتخزين", "طاولة تجميلٍ برخامٍ علوي وأدراج تخزينٍ أسفلها — طقوس الصباح، بمكتبها الهادئ الخاص.", ""],
  ["storage-19", "Noyer", "Storage", ["bedroom"], 120, 60, 220, "Dark walnut", "#4a3526",
    "Tall armoire", "A tall, dark-walnut armoire with the presence of a proper piece of furniture, not a fitted box.",
    "خزانة عالية", "خزانةٌ عالية من الجوز الغامق بحضور قطعة أثاثٍ حقيقية، لا مجرد صندوقٍ مُدمج.", ""],
  ["storage-20", "Flottant", "Storage", ["living"], 180, 40, 40, "Oak, brass legs", "#8a6a44",
    "Floating sideboard", "A wall-mounted oak sideboard on slim brass legs — storage that leaves the floor clear underneath.",
    "بوفيه معلَّق", "بوفيهٌ من البلوط مثبَّتٌ على الجدار بأرجلٍ نحاسيةٍ نحيلة — تخزينٌ يترك الأرض أسفله خالية.", ""],

  // ── Bedroom ────────────────────────────────────────────────────────────
  ["bedroom-01", "Platforme", "Bedroom", ["bedroom"], 180, 210, 95, "Ivory linen", "#ece6d8",
    "Upholstered platform bed", "A low, wide upholstered bed in ivory linen — the quiet end of the day, made physical.",
    "سرير منجّد منخفض", "سريرٌ منجّدٌ منخفض وعريض من الكتان العاجي — نهاية اليوم الهادئة، في شكلٍ ملموس.", "Bestseller"],
  ["bedroom-02", "Aile", "Bedroom", ["bedroom"], 190, 210, 130, "Sage velvet", "#93997e",
    "Wingback bed", "A tall wingback headboard in sage velvet — a bed with the presence of a proper armchair.",
    "سرير بظهرٍ جناحي", "رأسية سريرٍ عالية على طراز الأجنحة من المخمل الأخضر المريمي — سريرٌ بحضور كرسيٍّ حقيقي.", ""],
  ["bedroom-03", "Courbe", "Bedroom", ["bedroom"], 185, 205, 105, "Taupe bouclé", "#a89a86",
    "Curved headboard bed", "A softly curved headboard in taupe bouclé — one gentle line to rest your head against.",
    "سرير برأسيةٍ منحنية", "رأسيةٌ منحنية بلطف من البوكليه البنّي الرمادي — خطٌّ ليّنٌ واحد تتّكئ عليه.", ""],
  ["bedroom-04", "Baldaquin", "Bedroom", ["bedroom"], 200, 210, 210, "Natural rattan canopy", "#b89968",
    "Rattan canopy bed", "A hand-woven rattan canopy bed — an airy four-poster, built for a warm climate and a slow morning.",
    "سرير مظلّل من الروطان", "سريرٌ بأربعة أعمدةٍ ومظلّةٍ من الروطان المنسوج يدويًا — خفيفٌ وهوائي، لمناخٍ دافئ وصباحٍ بطيء.", "Limited"],
  ["bedroom-05", "Capitonne", "Bedroom", ["bedroom"], 180, 210, 110, "Dusty rose velvet", "#c9a3a0",
    "Tufted bed", "A deep-tufted headboard in dusty rose velvet — soft geometry behind a soft night's sleep.",
    "سرير مكبوس", "رأسيةٌ مكبوسة بعمق من المخمل الوردي الغبِش — هندسةٌ ناعمة خلف نومٍ هادئ.", ""],
  ["bedroom-06", "Chevet", "Bedroom", ["bedroom"], 50, 42, 58, "Walnut, one drawer", "#6f5636",
    "Bedside table", "A simple walnut bedside table with one honest drawer — everything a nightstand needs, nothing more.",
    "طاولة سرير جانبية", "طاولة سريرٍ جانبية بسيطة من الجوز بدرجٍ واحدٍ صادق — كلّ ما تحتاجه طاولة السرير، ولا شيء زائد.", ""],
  ["bedroom-07", "Banquette", "Bedroom", ["bedroom"], 140, 42, 46, "Cream linen bench", "#ece6d8",
    "Bedroom bench", "A cream linen bench at the foot of the bed — a place to sit while you put your shoes on.",
    "مقعد نهاية السرير", "مقعدٌ من الكتان الكريمي عند نهاية السرير — مكانٌ للجلوس أثناء ارتداء الحذاء.", ""],
  ["bedroom-08", "Cobalt", "Bedroom", ["bedroom"], 180, 210, 100, "Navy velvet, brass legs", "#28344a",
    "Upholstered bed, brass legs", "A navy velvet bed on slim brass legs — deep colour, lifted just enough off the floor.",
    "سرير بأرجل نحاسية", "سريرٌ من المخمل الكحلي على أرجلٍ نحاسيةٍ نحيلة — لونٌ عميق، مرفوعٌ قليلًا عن الأرض.", ""],
  ["bedroom-09", "Sol", "Bedroom", ["bedroom"], 180, 210, 70, "Oak platform frame", "#8a6a44",
    "Low platform bed", "A low-slung oak platform bed — a grounded, minimal frame that lets the linens do the talking.",
    "سرير منخفض من البلوط", "سريرٌ منخفض من البلوط الصلب — إطارٌ بسيطٌ وثابت يترك الكلام للبياضات.", ""],
  ["bedroom-10", "Reflet", "Bedroom", ["bedroom"], 100, 45, 75, "Marble top, brass accents", "#e9e6df",
    "Vanity table with mirror", "A marble-topped vanity with a brass-framed mirror — a small stage for the start and end of the day.",
    "طاولة تجميل بمرآة", "طاولة تجميلٍ برخامٍ علوي ومرآةٍ بإطارٍ نحاسي — مسرحٌ صغير لبداية اليوم ونهايته.", ""],
  ["bedroom-11", "Marbree", "Bedroom", ["bedroom"], 48, 42, 60, "Marble top, walnut", "#e9e6df",
    "Nightstand, marble top", "A walnut nightstand topped in marble — cool to the touch, warm in the room.",
    "طاولة سرير برخام", "طاولة سريرٍ من الجوز برخامٍ علوي — باردةٌ عند اللمس، ودافئةٌ في الغرفة.", ""],
  ["bedroom-12", "Chamois", "Bedroom", ["bedroom"], 185, 210, 120, "Cognac leather, channel-tufted", "#7a5235",
    "Channel-tufted leather bed", "A channel-tufted headboard in cognac leather — a masculine, tailored note for the bedroom.",
    "سرير جلدي مخيط بالقنوات", "رأسيةٌ مخيطة بالقنوات من الجلد الكونياكي — لمسةٌ عصريةٌ مفصّلة لغرفة النوم.", ""],
  ["bedroom-13", "Superpose", "Bedroom", ["bedroom", "guest"], 200, 100, 165, "Oak bunk frame", "#8a6a44",
    "Bunk-style guest bed", "A solid oak bunk-style bed for the guest room — space-smart, and still handsome enough for daily use.",
    "سرير بطابقين للضيوف", "سريرٌ بطابقين من البلوط الصلب لغرفة الضيوف — يوفّر المساحة، وأنيقٌ بما يكفي للاستخدام اليومي.", ""],
  ["bedroom-14", "Acajou", "Bedroom", ["bedroom"], 130, 60, 220, "Dark walnut armoire", "#4a3526",
    "Bedroom armoire", "A dark walnut armoire for the bedroom — hanging space and drawers, in one commanding piece.",
    "خزانة غرفة نوم", "خزانةٌ من الجوز الغامق لغرفة النوم — مساحة تعليقٍ وأدراج، في قطعةٍ واحدة ذات حضور.", ""],
  ["bedroom-15", "Rangee", "Bedroom", ["bedroom"], 120, 42, 46, "Bouclé bench, hidden storage", "#e6ddca",
    "Storage bench", "A bouclé bench with a lift-up lid — extra bedding, hidden in plain sight at the foot of the bed.",
    "مقعد تخزين", "مقعدٌ من البوكليه بغطاءٍ يُرفع للأعلى — بياضاتٌ إضافية، مخفيّة على مرأى من الجميع عند نهاية السرير.", ""],
  ["bedroom-16", "Halo", "Bedroom", ["bedroom"], 80, 80, 5, "Brass-framed mirror", "#b08d57",
    "Round mirror, brass frame", "A round mirror in a slim brass frame — a single circle of light on the wall.",
    "مرآة مستديرة بإطارٍ نحاسي", "مرآةٌ مستديرة بإطارٍ نحاسيٍّ نحيل — دائرة ضوءٍ واحدة على الجدار.", ""],
  ["bedroom-17", "Lecture", "Bedroom", ["bedroom"], 68, 70, 78, "Sage linen", "#93997e",
    "Bedroom reading chair", "A soft sage-linen chair for the corner that was always meant for reading, not walking past.",
    "كرسي قراءة", "كرسيٌّ ناعم من الكتان الأخضر المريمي لركنٍ كان مخصَّصًا دائمًا للقراءة، لا للمرور بجانبه.", ""],
  ["bedroom-18", "Enveloppe", "Bedroom", ["bedroom"], 180, 210, 90, "Sand linen wrap", "#d9c9a8",
    "Fabric-wrapped bed", "A fully fabric-wrapped bed frame in sand linen — soft on every edge, nothing hard to lean against.",
    "سرير مغلَّف بالقماش", "إطار سريرٍ مغلَّفٍ بالكامل بالكتان الرملي — ناعمٌ من كلّ جانب، بلا حافةٍ صلبة تتّكئ عليها.", ""],
  ["bedroom-19", "Cabane", "Bedroom", ["bedroom", "guest"], 90, 200, 90, "Natural rattan daybed", "#b89968",
    "Rattan daybed", "A natural rattan daybed, light and airy — a guest bed or a reading nook, depending on the day.",
    "سرير نهاري من الروطان", "سرير نهاريٌّ من الروطان الطبيعي، خفيفٌ وهوائي — سرير ضيوفٍ أو ركن قراءة، بحسب اليوم.", ""],
  ["bedroom-20", "Suite", "Bedroom", ["bedroom"], 460, 270, 220, "Walnut & ivory linen", "#8a6a44",
    "Complete bedroom suite", "A full suite — bed, dresser and bench — composed in walnut and ivory linen as one warm, finished room.",
    "طقم غرفة نوم كامل", "طقمٌ كامل — سرير وتسريحة ومقعد — مؤلَّفٌ من الجوز والكتان العاجي كغرفةٍ واحدةٍ دافئةٍ متكاملة.", "Limited"],
];

export const shopProducts: ShopProduct[] = ROWS.map(
  ([id, name, category, rooms, w, d, h, material, hex, tagline, description, taglineAr, descriptionAr, badge]) => ({
    id,
    name,
    category,
    rooms,
    dimensions: { w, d, h },
    materials: material.split(", ").map((m) => m.trim()),
    colorways: buildColorways(material, hex),
    tagline,
    description,
    taglineAr,
    descriptionAr,
    image: `/evora/shop/${SHOP_CATEGORY_SLUG[category]}/${id}.jpg`,
    ...(badge ? { badge: badge as ShopProduct["badge"] } : {}),
  })
);

export const getShopProduct = (id: string) => shopProducts.find((p) => p.id === id);

export function shopProductCopy(p: ShopProduct, lang: "en" | "ar") {
  return lang === "ar"
    ? { tagline: p.taglineAr, description: p.descriptionAr }
    : { tagline: p.tagline, description: p.description };
}
