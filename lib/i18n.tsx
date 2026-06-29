"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

export type Lang = "en" | "ar";

type Dict = Record<string, { en: string; ar: string }>;

const I18nContext = createContext<{
  lang: Lang;
  dir: "ltr" | "rtl";
  toggle: () => void;
  t: (key: keyof typeof STR) => string;
}>({ lang: "en", dir: "ltr", toggle: () => {}, t: (k) => String(k) });

export function useT() {
  return useContext(I18nContext);
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    const el = document.documentElement;
    el.lang = lang;
    el.dir = dir;
  }, [lang, dir]);

  const toggle = useCallback(() => setLang((l) => (l === "en" ? "ar" : "en")), []);
  const t = useCallback((key: keyof typeof STR) => STR[key][lang], [lang]);

  return (
    <I18nContext.Provider value={{ lang, dir, toggle, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export const STR = {
  nav_collections: { en: "Collections", ar: "المجموعات" },
  nav_tour: { en: "Virtual Showroom", ar: "الجولة الافتراضية" },
  nav_shop: { en: "Shop", ar: "تسوّق" },
  nav_catalog: { en: "Lookbook", ar: "الكتالوج" },
  nav_showroom: { en: "AR Showroom", ar: "معرض الواقع المعزّز" },
  nav_design: { en: "Design Studio", ar: "استوديو التصميم" },
  nav_studio: { en: "The Studio", ar: "الاستوديو" },

  shop_page_eyebrow: { en: "The Catalogue", ar: "الكتالوج" },
  shop_page_title: { en: "Shop the collection", ar: "تسوّق المجموعة" },
  shop_page_sub: {
    en: "Every piece, made to order and finished by hand. Tap any piece to place it in your room in AR.",
    ar: "كل قطعة، تُصنع حسب الطلب وتُشطّب يدويًا. انقر أي قطعة لتضعها في غرفتك بالواقع المعزّز.",
  },
  shop_all: { en: "All", ar: "الكل" },
  shop_view_ar: { en: "View in AR", ar: "اعرض بالواقع المعزّز" },
  shop_pieces: { en: "pieces", ar: "قطعة" },
  shop_search_ph: { en: "Search pieces…", ar: "ابحث عن قطعة…" },
  shop_sort: { en: "Sort", ar: "ترتيب" },
  shop_sort_featured: { en: "Featured", ar: "المميّزة" },
  shop_sort_az: { en: "Name · A–Z", ar: "الاسم · أ–ي" },
  shop_quickview: { en: "Quick view", ar: "عرض سريع" },
  shop_finishes: { en: "finishes", ar: "تشطيبات" },
  shop_no_results: { en: "No pieces match your search.", ar: "لا توجد قطع تطابق بحثك." },
  shop_clear: { en: "Clear filters", ar: "إعادة ضبط" },
  qv_close: { en: "Close", ar: "إغلاق" },
  qv_drag: { en: "Drag to rotate · scroll to zoom", ar: "اسحب للتدوير · مرّر للتكبير" },
  qv_finish: { en: "Finish", ar: "التشطيب" },
  qv_dims: { en: "Dimensions", ar: "الأبعاد" },
  qv_materials: { en: "Materials", ar: "الخامات" },
  qv_try: { en: "Try it in your home", ar: "جرّبها في منزلك" },
  qv_showroom: { en: "Open in showroom", ar: "افتح في المعرض" },
  nav_visit: { en: "Visit Us", ar: "زورونا" },
  nav_book: { en: "Book a Visit", ar: "احجز زيارة" },

  hero_eyebrow: { en: "Evora · Amman, Jordan", ar: "إيفورا · عمّان، الأردن" },
  hero_l1: { en: "Your home,", ar: "بيتك،" },
  hero_l2: { en: "beautifully", ar: "بكل" },
  hero_l3: { en: "furnished.", ar: "تفاصيله." },
  hero_sub: {
    en: "See every room of your home in 3D before a single piece is made — then approve it, and we design, craft and deliver it. All under one roof in Amman.",
    ar: "شاهد كل غرفة في بيتك بالأبعاد الثلاثية قبل أن تُصنع أيّ قطعة — ثم وافِق عليها، ونحن نصمّم ونصنع ونوصّل. كل ذلك تحت سقف واحد في عمّان.",
  },
  hero_cta1: { en: "Explore the Collection", ar: "اكتشف المجموعة" },
  hero_cta2: { en: "Enter the Showroom", ar: "ادخل المعرض" },
  scroll: { en: "Scroll", ar: "مرّر" },

  manifesto_eyebrow: { en: "Your Future Home", ar: "بيت المستقبل" },
  manifesto_lead: {
    en: "We don't just sell furniture — we design the whole space: named stone, solid walnut, hand-finished brass, composed in 3D for the way you actually live.",
    ar: "نحن لا نبيع الأثاث فحسب — نصمّم المساحة بأكملها: حجرٌ بالاسم، جوزٌ صلب، نحاسٌ مشغول باليد، مُصمَّمٌ بالأبعاد الثلاثية ليناسب حياتك فعلًا.",
  },
  manifesto_body: {
    en: "From a single statement piece to a whole home, with flexible installments and a design team that sees it through, from concept to delivery.",
    ar: "من قطعةٍ واحدة مميّزة إلى بيتٍ كامل، مع تقسيطٍ مريح وفريق تصميمٍ يرافقك من الفكرة حتى التسليم.",
  },

  collections_eyebrow: { en: "Collections", ar: "المجموعات" },
  collections_title: { en: "Explore by room", ar: "تصفّح حسب الغرفة" },

  tour_eyebrow: { en: "Virtual Showroom", ar: "المعرض الافتراضي" },
  tour_title: { en: "Walk through, from anywhere", ar: "تجوّل من أي مكان" },
  tour_sub: { en: "A real 3D walkthrough — move room to room and look anywhere, right from your screen.", ar: "جولة ثلاثية الأبعاد حقيقية — تنقّل بين الغرف وانظر في كل اتجاه، من شاشتك مباشرة." },
  tour_enter: { en: "Click to move · drag to look", ar: "انقر للتنقّل · اسحب للنظر" },

  ar_eyebrow: { en: "3D · Augmented Reality", ar: "ثلاثي الأبعاد · واقع معزّز" },
  ar_title: { en: "See it in your own room", ar: "شاهدها في غرفتك" },
  ar_sub: {
    en: "Spin any piece in 3D. On your phone, place it in your living room to true scale before you decide.",
    ar: "حرّك أي قطعة بثلاثة أبعاد. ومن هاتفك، ضعها في غرفتك بالحجم الحقيقي قبل أن تقرّر.",
  },
  ar_view: { en: "View in your room", ar: "اعرضها في غرفتك" },
  ar_drag: { en: "Drag to rotate", ar: "اسحب للتدوير" },

  shop_eyebrow: { en: "Shop the Look", ar: "تسوّق الإطلالة" },
  shop_title: { en: "One room. Every piece.", ar: "غرفة واحدة. كل قطعة." },
  shop_sub: { en: "Hover the markers to explore each piece in the scene.", ar: "مرّر فوق العلامات لاستكشاف كل قطعة في المشهد." },

  design_eyebrow: { en: "Design & Execution", ar: "تصميم وتنفيذ" },
  design_title: { en: "From concept to delivered", ar: "من الفكرة إلى التسليم" },
  design_sub: {
    en: "Built-in closets, full interiors, turn-key fit-outs. Drag the handle to see an Evora space come to life.",
    ar: "خزائن حائطية، تصاميم داخلية كاملة، وتجهيز جاهز للسكن. اسحب المقبض لترى مساحة إيفورا تنبض بالحياة.",
  },
  design_before: { en: "Concept", ar: "التصميم" },
  design_after: { en: "Delivered", ar: "التنفيذ" },

  services_eyebrow: { en: "More than a showroom", ar: "أكثر من مجرد معرض" },
  services_title: { en: "One studio — from your idea to delivery", ar: "استوديو واحد — من فكرتك حتى التسليم" },

  visit_eyebrow: { en: "Visit Us", ar: "زورونا" },
  visit_title: { en: "Come find your space", ar: "تعال واكتشف مساحتك" },
  visit_addr: { en: "Wasfi Al-Tal St., Khalda — Amman, Jordan · opposite Paradise Bakeries", ar: "شارع وصفي التل، خلدا — عمّان، الأردن · مقابل أفران الجنّة" },
  visit_hours: { en: "Sat – Thu · 10:00 — 22:00 · Friday by appointment", ar: "السبت – الخميس · ١٠:٠٠ — ٢٢:٠٠ · الجمعة بموعد مسبق" },
  visit_cta: { en: "Book a Showroom Visit", ar: "احجز زيارة للمعرض" },
  visit_call: { en: "Call the Studio", ar: "اتصل بالاستوديو" },

  footer_tag: { en: "Your Future Home", ar: "بيت المستقبل" },
  footer_rights: { en: "Designing & furnishing Jordan's homes — your future home, under one roof.", ar: "نصمّم ونؤثّث بيوت الأردن — بيت المستقبل، تحت سقف واحد." },
  footer_demo: { en: "Concept preview — built for Evora", ar: "نسخة تجريبية — صُمّمت لإيفورا" },

  proof_eyebrow: { en: "Homes furnished from Abdoun to Khalda", ar: "بيوتٌ أثّثناها من عبدون إلى خلدا" },
  proof_title: { en: "2,400+ homes, beautifully delivered.", ar: "أكثر من ٢٤٠٠ بيت، سُلّمت بأبهى صورة." },
  proof_since: { en: "Furnishing Jordan's homes since 2017", ar: "نؤثّث بيوت الأردن منذ ٢٠١٧" },
  stat_homes: { en: "homes furnished", ar: "بيت تم تأثيثه" },
  stat_followers: { en: "community", ar: "متابع" },
  stat_rating: { en: "showroom rating", ar: "تقييم المعرض" },
  stat_delivery: { en: "delivery across Jordan", ar: "توصيل في كل الأردن" },

  process_eyebrow: { en: "How We Work", ar: "كيف نعمل" },
  process_title: { en: "Four steps to a finished home", ar: "أربع خطوات لمنزل مكتمل" },
  process_sub: {
    en: "One team, from the first measurement to the last cushion — so nothing falls between the cracks.",
    ar: "فريق واحد، من أول قياس حتى آخر وسادة — حتى لا يضيع أي تفصيل.",
  },

  craft_eyebrow: { en: "Craftsmanship", ar: "الحرفية" },
  craft_title: { en: "Made to be lived with", ar: "صُنع ليُعاش معه" },
  craft_sub: {
    en: "We choose materials that age beautifully — honest woods, durable weaves and warm metals, finished by hand.",
    ar: "نختار موادًا تزداد جمالًا مع الوقت — أخشاب أصيلة، أقمشة متينة، ومعادن دافئة، مشغولة باليد.",
  },

  fin_eyebrow: { en: "Pay Your Way", ar: "ادفع بطريقتك" },
  fin_title: { en: "Cash price. Up to 3 years to pay.", ar: "بسعر الكاش. وتقسيط حتى ٣ سنوات." },
  fin_body: {
    en: "Furnish now and spread the cost over up to 36 months through Safwa Islamic Bank — the same cash price, no interest, no hidden cost.",
    ar: "بدون فوائد ولا ربا، عبر بنك صفوة الإسلامي — أثّث الآن وقسّط التكلفة على مدى ٣٦ شهرًا، بنفس سعر الكاش، وبدون أيّ تكلفة خفية.",
  },

  faq_eyebrow: { en: "Good to Know", ar: "أسئلة شائعة" },
  faq_title: { en: "Questions, answered", ar: "إجابات لأسئلتك" },

  news_title: { en: "Stay with Evora", ar: "ابقَ على تواصل" },
  news_body: {
    en: "New arrivals, design notes and showroom events — a few times a year, never more.",
    ar: "وصولات جديدة، ملاحظات تصميم، ودعوات للمعرض — بضع مرات في السنة، لا أكثر.",
  },
  news_placeholder: { en: "Email address", ar: "البريد الإلكتروني" },
  news_cta: { en: "Subscribe", ar: "اشترك" },
  news_thanks: { en: "Welcome — you're on the list.", ar: "أهلًا بك — أصبحت على القائمة." },

  consult: { en: "Book a Design Consultation", ar: "احجز استشارة تصميم" },
  wa_label: { en: "Chat on WhatsApp", ar: "تواصل عبر واتساب" },
  wa_msg: {
    en: "Hi Evora! I'd love to book a design consultation.",
    ar: "مرحبًا إيفورا! أودّ حجز استشارة تصميم.",
  },

  // ── Configurator beat (the kitchen-island video) — Stream 7 ───────────────
  cfg_eyebrow: { en: "Bespoke kitchens · made in Amman", ar: "مطابخ حسب الطلب · تُصنع في عمّان" },
  cfg_heading: { en: "A kitchen cut to your stone.", ar: "مطبخٌ يُفصَّل على حجرك." },
  cfg_lead: {
    en: "Every Evora island is built to order in our own workshop. Choose the marble, the finish, the proportions — and watch the room change as you decide.",
    ar: "كل جزيرة من إيفورا تُصنع خصيصًا في ورشتنا. اختر الرخام والتشطيب والمقاسات، وشاهد الغرفة تتبدّل أمام عينيك.",
  },
  cfg_panel_eyebrow: { en: "Choose your stone", ar: "اختر حجرك" },
  cfg_cta: { en: "Book a kitchen consultation", ar: "احجز استشارة مطبخك" },
  cfg_aria: { en: "Evora kitchen island, in 3D", ar: "جزيرة مطبخ إيفورا، بالأبعاد الثلاثية" },

  // ── Collections beat (showroom film + four worlds) — Stream 7 ─────────────
  col_film_badge: { en: "Inside the Khalda showroom", ar: "داخل معرض خلدا" },
  col_film_caption: {
    en: "Two floors of finished rooms — walk through before you decide.",
    ar: "طابقان من الغرف المكتملة — تجوّل فيها قبل أن تقرّر.",
  },
  col_world_coffee: {
    en: "Patagonia marble on solid walnut — the first thing a guest's eye lands on.",
    ar: "رخام باتاغونيا على جوز صلب — أوّل ما تقع عليه عين الضيف.",
  },
  col_world_sofa: {
    en: "Cream boucle, modular and deep — where the family lands every evening.",
    ar: "بوكليه كريمي، وحداتٌ وعمق — حيث تجتمع العائلة كل مساء.",
  },
  col_world_armchair: {
    en: "One sculpted seat — the detail that makes a corner feel finished.",
    ar: "مقعدٌ منحوت واحد — التفصيل الذي يجعل الزاوية مكتملة.",
  },
  col_world_bed: {
    en: "Linen, walnut and stone — the room you exhale in at the end of the day.",
    ar: "كتانٌ وجوز وحجر — الغرفة التي ترتاح فيها في آخر النهار.",
  },

  // ── Process journey (the free design service) — Stream 7 ──────────────────
  pj_free: {
    en: "The complete interior-design service — yours, free, when you furnish with Evora",
    ar: "خدمة التصميم الداخلي الكاملة — هديّتنا لك عند التأثيث مع إيفورا",
  },
  pj_loss: {
    en: "You approve the photoreal render before we cut a single board — change your mind on screen, not in your living room.",
    ar: "توافق على التصميم النهائي قبل أن نقصّ أوّل لوح خشب — غيّر رأيك على الشاشة، لا في بيتك.",
  },

  // ── Shop: rooms hub, similar rail, popup CTAs, empty state — Stream 6 ──────
  shop_rooms_eyebrow: { en: "Shop by room", ar: "تسوّق حسب الغرفة" },
  shop_rooms_title: { en: "Every room, arranged the way you live in it", ar: "كل غرفة، مرتّبة كما تعيشها" },
  shop_rooms_sub: {
    en: "Step into a room and see the full Evora collection that lives in it — then bring it home, or design the whole space with us.",
    ar: "ادخل أي غرفة وشاهد تشكيلة إيفورا الكاملة التي تعيش فيها — ثم خذها إلى بيتك، أو صمّم المساحة كاملة معنا.",
  },
  shop_similar: { en: "Complete the room", ar: "أكمِل الغرفة" },
  shop_view_all: { en: "View all", ar: "اعرض الكل" },
  shop_enquire: { en: "Enquire about this piece", ar: "استفسر عن هذه القطعة" },
  shop_add_design: { en: "Add to my design", ar: "أضِفها إلى تصميمي" },
  shop_showroom_cta: { en: "See it in the Khalda showroom", ar: "شاهدها في معرض خلدا" },
  shop_empty_enquire: {
    en: "We're adding this collection to the site. See it now in our Khalda showroom.",
    ar: "نضيف هذه المجموعة إلى الموقع قريبًا. شاهدها الآن في معرض خلدا.",
  },

  // ── Evora Future Studio presentation page — Stream 2 ──────────────────────
  studio_eyebrow: { en: "Evora Future Studio", ar: "استوديو إيفورا المستقبلي" },
  studio_hero_title: {
    en: "See your whole home in 3D — before it exists.",
    ar: "شاهد بيتك كاملًا بالأبعاد الثلاثية — قبل أن يوجد.",
  },
  studio_hero_sub: {
    en: "Bring us your floor plan. We design every room in 3D, you walk through it, and only when you approve do we build it — under one roof, complimentary with your furnishing.",
    ar: "أحضر لنا مخطّطك. نصمّم كل غرفة بالأبعاد الثلاثية، تتجوّل فيها، وحين توافق فقط نبدأ التنفيذ — تحت سقف واحد، هديّة مع تأثيثك.",
  },
  studio_cta: { en: "Book a design consultation", ar: "احجز استشارة تصميم" },
  studio_b1_t: { en: "Bring us your floor plan", ar: "أحضر لنا مخطّطك" },
  studio_b1_b: {
    en: "A bare blueprint — walls, rooms, dimensions. That's all we need to begin.",
    ar: "مخطّطٌ فارغ — جدران وغرف وأبعاد. هذا كل ما نحتاجه لنبدأ.",
  },
  studio_b2_t: { en: "Watch it become a room", ar: "شاهده يصبح غرفة" },
  studio_b2_b: {
    en: "We furnish your plan and rebuild it in real 3D — every piece placed to scale, in finishes you choose.",
    ar: "نؤثّث مخطّطك ونعيد بناءه بأبعاد ثلاثية حقيقية — كل قطعة بمقاسها، وبتشطيبات تختارها أنت.",
  },
  studio_b3_t: { en: "Walk inside before it's yours", ar: "تجوّل في الداخل قبل أن يصبح لك" },
  studio_b3_b: {
    en: "Step into your home from your screen — look anywhere, check it against your light, change your mind freely.",
    ar: "ادخل بيتك من شاشتك — انظر في كل اتجاه، جرّبه مع إضاءتك، وغيّر رأيك براحتك.",
  },
  studio_b4_t: { en: "Approve it, then we build it", ar: "وافِق عليه، ثم نصنعه" },
  studio_b4_b: {
    en: "You sign off on a photoreal render — then we craft and deliver every room, and you track each stage live. Complimentary, under one roof.",
    ar: "توافق على تصميمٍ واقعي — ثم نصنع ونوصّل كل غرفة، وأنت تتابع كل مرحلة مباشرةً. هديّة، وتحت سقف واحد.",
  },
} satisfies Dict;
