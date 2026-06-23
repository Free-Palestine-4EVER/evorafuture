export type Bi = { en: string; ar: string };

export type Collection = {
  id: string;
  name: Bi;
  count: Bi;
  img: string;
  span?: "tall" | "wide";
};

export const collections: Collection[] = [
  {
    id: "bedrooms",
    name: { en: "Bedrooms", ar: "غرف النوم" },
    count: { en: "42 pieces", ar: "٤٢ قطعة" },
    img: "/evora/c-bedrooms.jpg",
    span: "tall",
  },
  {
    id: "dining",
    name: { en: "Dining", ar: "غرف الطعام" },
    count: { en: "36 pieces", ar: "٣٦ قطعة" },
    img: "/evora/p03.jpg",
  },
  {
    id: "sofas",
    name: { en: "Sofa Sets", ar: "أطقم الكنب" },
    count: { en: "28 pieces", ar: "٢٨ قطعة" },
    img: "/evora/p08.jpg",
  },
  {
    id: "accessories",
    name: { en: "Accessories", ar: "إكسسوارات" },
    count: { en: "90+ pieces", ar: "+٩٠ قطعة" },
    img: "/evora/p11.jpg",
    span: "tall",
  },
  {
    id: "living",
    name: { en: "Living", ar: "غرف المعيشة" },
    count: { en: "31 pieces", ar: "٣١ قطعة" },
    img: "/evora/p06.jpg",
  },
  {
    id: "garden",
    name: { en: "Evora Garden", ar: "حديقة إيفورا" },
    count: { en: "Outdoor", ar: "مساحات خارجية" },
    img: "/evora/p05.jpg",
    span: "wide",
  },
];

// Furniture categories — drives the horizontal scroll-pinned "Shop by category" rail
export type Category = {
  id: string;
  name: Bi;
  count: Bi;
  img: string;
};

export const categories: Category[] = [
  { id: "sofas",     name: { en: "Sofas & Couches",     ar: "كنب وأرائك" },        count: { en: "28 pieces", ar: "٢٨ قطعة" }, img: "/evora/p08.jpg" },
  { id: "bedrooms",  name: { en: "Beds & Bedrooms",     ar: "أسرّة وغرف نوم" },     count: { en: "42 pieces", ar: "٤٢ قطعة" }, img: "/evora/c-bedrooms.jpg" },
  { id: "dining",    name: { en: "Dining Tables",       ar: "طاولات طعام" },        count: { en: "36 pieces", ar: "٣٦ قطعة" }, img: "/evora/p03.jpg" },
  { id: "seating",   name: { en: "Armchairs & Seating", ar: "كراسي ومقاعد" },       count: { en: "24 pieces", ar: "٢٤ قطعة" }, img: "/evora/ig-chesterfield.jpg" },
  { id: "tables",    name: { en: "Coffee & Side Tables",ar: "طاولات قهوة وجانبية" }, count: { en: "30 pieces", ar: "٣٠ قطعة" }, img: "/evora/p11.jpg" },
  { id: "storage",   name: { en: "Wardrobes & Storage", ar: "خزائن وتخزين" },       count: { en: "Built-in", ar: "حسب القياس" }, img: "/evora/p02.jpg" },
  { id: "lighting",  name: { en: "Lighting",            ar: "إضاءة" },              count: { en: "45+ pieces", ar: "+٤٥ قطعة" }, img: "/evora/p10.jpg" },
  { id: "outdoor",   name: { en: "Outdoor & Garden",    ar: "حدائق وخارجي" },       count: { en: "Seasonal", ar: "موسمي" }, img: "/evora/p05.jpg" },
  { id: "rugs",      name: { en: "Rugs & Textiles",     ar: "سجاد ومنسوجات" },      count: { en: "60+ pieces", ar: "+٦٠ قطعة" }, img: "/evora/p09.jpg" },
  { id: "decor",     name: { en: "Décor & Accessories", ar: "ديكور وإكسسوارات" },   count: { en: "90+ pieces", ar: "+٩٠ قطعة" }, img: "/evora/p04.jpg" },
];

export type Hotspot = {
  id: string;
  x: number; // 0..1 across the panorama width
  y: number; // 0..1 down the height
  name: Bi;
  price: string;
};

// Hotspots for the virtual tour (panorama = p07 warm bedroom)
export const tourHotspots: Hotspot[] = [
  { id: "bed", x: 0.5, y: 0.70, name: { en: "Aspen Oak Bed", ar: "سرير أسبن البلوط" }, price: "1,290 JOD" },
  { id: "lamp", x: 0.26, y: 0.58, name: { en: "Amber Table Lamp", ar: "مصباح آمبر" }, price: "85 JOD" },
  { id: "nightstand", x: 0.735, y: 0.78, name: { en: "Linen Nightstand", ar: "كومودينو لينين" }, price: "210 JOD" },
  { id: "mirror", x: 0.80, y: 0.38, name: { en: "Halo Wall Mirror", ar: "مرآة هالو" }, price: "140 JOD" },
];

// Hotspots for the shoppable room (p11 brass coffee table / curved sofa)
export const shopHotspots: Hotspot[] = [
  { id: "table", x: 0.46, y: 0.74, name: { en: "Helios Brass Coffee Table", ar: "طاولة هيليوس النحاسية" }, price: "360 JOD" },
  { id: "sofa", x: 0.7, y: 0.38, name: { en: "Dune Curved Sofa", ar: "كنبة ديون المنحنية" }, price: "1,640 JOD" },
  { id: "plant", x: 0.5, y: 0.22, name: { en: "Olive Tree Planter", ar: "حوض شجرة الزيتون" }, price: "55 JOD" },
];

export type ModelDef = {
  id: string;
  name: Bi;
  tagline: Bi;
  price: string;
  src: string;
};

export const models: ModelDef[] = [
  {
    id: "sofa",
    name: { en: "Velvet Lounge Sofa", ar: "كنبة فيلفيت لاونج" },
    tagline: { en: "Three-seater · deep emerald velvet", ar: "ثلاثة مقاعد · مخمل زمردي" },
    price: "1,640 JOD",
    src: "/models/sofa.glb",
  },
  {
    id: "chair",
    name: { en: "Sheen Accent Chair", ar: "كرسي شين المميّز" },
    tagline: { en: "Hand-finished frame · sheen weave", ar: "إطار يدوي · نسيج لامع" },
    price: "430 JOD",
    src: "/models/chair.glb",
  },
];

export const marqueeItems: Bi[] = [
  { en: "Your Future Home", ar: "بيت المستقبل" },
  { en: "Built-in Closets", ar: "خزائن حائطية" },
  { en: "Interior Design", ar: "تصميم داخلي" },
  { en: "Flexible Installments", ar: "تقسيط مريح" },
  { en: "Care & Cleaning", ar: "عناية وتنظيف" },
  { en: "Free Delivery in Amman", ar: "توصيل مجاني في عمّان" },
];

export const testimonials: { quote: Bi; name: string; role: Bi }[] = [
  {
    quote: {
      en: "They designed our whole apartment — from the closets to the last cushion. It feels like a hotel.",
      ar: "صمّموا شقتنا بالكامل — من الخزائن حتى آخر وسادة. صار البيت يشبه الفنادق.",
    },
    name: "Lara H.",
    role: { en: "Homeowner · Abdoun", ar: "صاحبة منزل · عبدون" },
  },
  {
    quote: {
      en: "The quality is on another level, and the installments made it easy. Delivery team was flawless.",
      ar: "الجودة بمستوى ثاني، والتقسيط سهّل كل شي. فريق التوصيل كان ممتاز.",
    },
    name: "Omar K.",
    role: { en: "Homeowner · Khalda", ar: "صاحب منزل · خلدا" },
  },
  {
    quote: {
      en: "We furnished two villas through Evora. Their design team just gets the brief, every time.",
      ar: "أثّثنا فيلتين مع إيفورا. فريق التصميم بيفهم المطلوب من أول مرة، دائمًا.",
    },
    name: "Studio Noon",
    role: { en: "Interior Studio · Amman", ar: "استوديو تصميم · عمّان" },
  },
];

export const stats: { value: string; label: "stat_homes" | "stat_followers" | "stat_rating" | "stat_delivery" }[] = [
  { value: "2,400+", label: "stat_homes" },
  { value: "103K", label: "stat_followers" },
  { value: "4.9★", label: "stat_rating" },
  { value: "100%", label: "stat_delivery" },
];

export const processSteps: { n: string; title: Bi; body: Bi }[] = [
  {
    n: "01",
    title: { en: "Consultation", ar: "الاستشارة" },
    body: {
      en: "We visit, measure and listen — understanding how you live before we propose a single piece.",
      ar: "نزورك، نقيس، ونستمع — نفهم أسلوب حياتك قبل أن نقترح أي قطعة.",
    },
  },
  {
    n: "02",
    title: { en: "Design & 3D", ar: "التصميم والـ ٣D" },
    body: {
      en: "Our studio returns a full concept — 3D visuals, materials and a fixed, transparent quote.",
      ar: "يعيد لك الاستوديو تصميمًا كاملًا — مشاهد ثلاثية الأبعاد، مواد، وعرض سعر ثابت وواضح.",
    },
  },
  {
    n: "03",
    title: { en: "Crafted to order", ar: "يُصنع حسب الطلب" },
    body: {
      en: "Each piece is built and finished to order, quality-checked by hand at every stage.",
      ar: "تُصنع كل قطعة وتُشطّب حسب الطلب، مع فحص يدوي للجودة في كل مرحلة.",
    },
  },
  {
    n: "04",
    title: { en: "Delivered & styled", ar: "توصيل وتنسيق" },
    body: {
      en: "White-glove delivery — we carry, place and style every piece, then clear everything away.",
      ar: "توصيل بعناية فائقة — نحمل ونضع وننسّق كل قطعة، ثم نرتّب ونغادر.",
    },
  },
];

export const materials: { name: Bi; note: Bi; img: string }[] = [
  {
    name: { en: "Solid Oak & Walnut", ar: "بلوط وجوز صلب" },
    note: { en: "Kiln-dried hardwood frames, built to outlast trends.", ar: "هياكل من الخشب الصلب المجفّف، تدوم أطول من الموضة." },
    img: "/evora/p02.jpg",
  },
  {
    name: { en: "Performance Velvet & Linen", ar: "مخمل وكتان عملي" },
    note: { en: "Soft to the touch, engineered to live with daily life.", ar: "ناعم الملمس، مصمّم ليصمد أمام الحياة اليومية." },
    img: "/evora/p09.jpg",
  },
  {
    name: { en: "Hand-finished Brass", ar: "نحاس مشغول يدويًا" },
    note: { en: "Warm metal details, patinated and sealed by hand.", ar: "تفاصيل معدنية دافئة، مصقولة ومحميّة باليد." },
    img: "/evora/p10.jpg",
  },
];

export const financingPoints: Bi[] = [
  { en: "Up to 36 months", ar: "حتى ٣٦ شهرًا" },
  { en: "Same cash price", ar: "بنفس سعر الكاش" },
  { en: "Fast in-showroom approval", ar: "موافقة سريعة في المعرض" },
];

export const faqs: { q: Bi; a: Bi }[] = [
  {
    q: { en: "Where do you deliver, and how long does it take?", ar: "أين توصّلون، وكم يستغرق ذلك؟" },
    a: {
      en: "We deliver across Jordan with our own white-glove team. In-stock pieces arrive within a few days; made-to-order pieces follow the lead time on your quote.",
      ar: "نوصّل في كل الأردن عبر فريقنا المختص. القطع المتوفرة تصل خلال أيام؛ أما المصنوعة حسب الطلب فتتبع المدة المذكورة في عرض السعر.",
    },
  },
  {
    q: { en: "Can pieces be customised?", ar: "هل يمكن تخصيص القطع؟" },
    a: {
      en: "Yes. Most pieces can be made in your choice of fabric, finish and — for many — dimensions. Our design studio will guide the options.",
      ar: "نعم. معظم القطع تُصنع بالقماش واللون الذي تختاره، ولكثير منها أبعاد قابلة للتعديل. يرشدك استوديو التصميم للخيارات.",
    },
  },
  {
    q: { en: "Do you design whole homes?", ar: "هل تصمّمون المنازل بالكامل؟" },
    a: {
      en: "We do — from a single room to a turn-key villa, including built-in closets and full interiors, from concept through to installation.",
      ar: "بالتأكيد — من غرفة واحدة إلى فيلا جاهزة للسكن، بما في ذلك الخزائن الحائطية والتصاميم الداخلية الكاملة، من الفكرة حتى التركيب.",
    },
  },
  {
    q: { en: "What about warranty and after-care?", ar: "ماذا عن الضمان والعناية بعد البيع؟" },
    a: {
      en: "Every piece is covered against manufacturing defects, and we offer professional upholstery cleaning and after-sale care to keep it looking new.",
      ar: "كل قطعة مضمونة ضد عيوب التصنيع، ونوفّر تنظيفًا احترافيًا للمفروشات وعناية بعد البيع للحفاظ على رونقها.",
    },
  },
  {
    q: { en: "How do the installments work?", ar: "كيف يعمل التقسيط؟" },
    a: {
      en: "Buy at the cash price and spread it over up to three years through Safwa Islamic Bank, with fast approval right in the showroom.",
      ar: "اشترِ بسعر الكاش وقسّطه حتى ثلاث سنوات عبر بنك صفوة الإسلامي، مع موافقة سريعة داخل المعرض.",
    },
  },
];

export const services: { icon: string; title: Bi; body: Bi }[] = [
  {
    icon: "design",
    title: { en: "Design Studio", ar: "استوديو التصميم" },
    body: {
      en: "Our in-house team designs and executes full interiors and built-in closets — concept, 3D, install.",
      ar: "فريقنا الداخلي يصمّم وينفّذ التصاميم الداخلية والخزائن الحائطية — فكرة، ثلاثي الأبعاد، تركيب.",
    },
  },
  {
    icon: "installment",
    title: { en: "Pay Your Way", ar: "ادفع بطريقتك" },
    body: {
      en: "Buy at the cash price with the comfort of installments up to 3 years through Safwa Islamic Bank.",
      ar: "اشترِ بسعر الكاش مع راحة التقسيط حتى ٣ سنوات عبر بنك صفوة الإسلامي.",
    },
  },
  {
    icon: "care",
    title: { en: "Care & Cleaning", ar: "العناية والتنظيف" },
    body: {
      en: "Keep every piece looking new — professional upholstery cleaning and after-sale care.",
      ar: "حافظ على رونق كل قطعة — تنظيف احترافي للمفروشات وعناية ما بعد البيع.",
    },
  },
  {
    icon: "delivery",
    title: { en: "Delivered & Set", ar: "توصيل وتركيب" },
    body: {
      en: "White-glove delivery across Jordan — we carry, place and set every piece for you.",
      ar: "توصيل بعناية فائقة في كل الأردن — نحمل ونضع ونركّب كل قطعة لك.",
    },
  },
];
