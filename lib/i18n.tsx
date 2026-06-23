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
  shop_sort_price_asc: { en: "Price · low to high", ar: "السعر · من الأقل" },
  shop_sort_price_desc: { en: "Price · high to low", ar: "السعر · من الأعلى" },
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
  qv_price: { en: "Price", ar: "السعر" },
  qv_try: { en: "Try it in your home", ar: "جرّبها في منزلك" },
  qv_showroom: { en: "Open in showroom", ar: "افتح في المعرض" },
  nav_visit: { en: "Visit Us", ar: "زورونا" },
  nav_book: { en: "Book a Visit", ar: "احجز زيارة" },

  hero_eyebrow: { en: "Evora · Amman, Jordan", ar: "إيفورا · عمّان، الأردن" },
  hero_l1: { en: "Your home,", ar: "بيتك،" },
  hero_l2: { en: "beautifully", ar: "بكل" },
  hero_l3: { en: "furnished.", ar: "تفاصيله." },
  hero_sub: {
    en: "Your home for furniture & beyond — every room, every detail, designed and delivered under one roof.",
    ar: "وجهتك للأثاث وأكثر — كل غرفة، كل تفصيل، نصمّمه ونوصّله تحت سقف واحد.",
  },
  hero_cta1: { en: "Explore the Collection", ar: "اكتشف المجموعة" },
  hero_cta2: { en: "Enter the Showroom", ar: "ادخل المعرض" },
  scroll: { en: "Scroll", ar: "مرّر" },

  manifesto_eyebrow: { en: "Your Future Home", ar: "بيت المستقبل" },
  manifesto_lead: {
    en: "We don't just sell furniture. We compose spaces — warm woods, soft tones, and quiet luxury, brought together for the way you actually live.",
    ar: "نحن لا نبيع الأثاث فحسب. نحن نصمّم المساحات — أخشاب دافئة، ألوان ناعمة، وفخامة هادئة، مجتمعة لتناسب أسلوب حياتك.",
  },
  manifesto_body: {
    en: "From a single statement piece to a fully designed home, Evora brings together craftsmanship, comfort and care — with flexible installments and a design team that sees it through, from concept to delivery.",
    ar: "من قطعة واحدة مميزة إلى منزل متكامل التصميم، يجمع إيفورا بين الحرفية والراحة والعناية — مع تقسيط مريح وفريق تصميم يرافقك من الفكرة حتى التسليم.",
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
  shop_sub: { en: "Hover the markers to price each piece in the scene.", ar: "مرّر فوق العلامات لمعرفة سعر كل قطعة في المشهد." },

  design_eyebrow: { en: "Design & Execution", ar: "تصميم وتنفيذ" },
  design_title: { en: "From concept to delivered", ar: "من الفكرة إلى التسليم" },
  design_sub: {
    en: "Built-in closets, full interiors, turn-key fit-outs. Drag the handle to see an Evora space come to life.",
    ar: "خزائن حائطية، تصاميم داخلية كاملة، وتجهيز جاهز للسكن. اسحب المقبض لترى مساحة إيفورا تنبض بالحياة.",
  },
  design_before: { en: "Concept", ar: "التصميم" },
  design_after: { en: "Delivered", ar: "التنفيذ" },

  services_eyebrow: { en: "Evora Promise", ar: "وعد إيفورا" },
  services_title: { en: "More than a showroom", ar: "أكثر من مجرد معرض" },

  visit_eyebrow: { en: "Visit Us", ar: "زورونا" },
  visit_title: { en: "Come find your space", ar: "تعال واكتشف مساحتك" },
  visit_addr: { en: "Wasfi Al-Tal St., Khalda — Amman, Jordan", ar: "شارع وصفي التل، خلدا — عمّان، الأردن" },
  visit_hours: { en: "Sat – Thu · 10:00 — 22:00", ar: "السبت – الخميس · ١٠:٠٠ — ٢٢:٠٠" },
  visit_cta: { en: "Book a Showroom Visit", ar: "احجز زيارة للمعرض" },
  visit_call: { en: "Call the Studio", ar: "اتصل بالاستوديو" },

  footer_tag: { en: "Your Future Home", ar: "بيت المستقبل" },
  footer_rights: { en: "Designing & furnishing Jordan's homes — your future home, under one roof.", ar: "نصمّم ونؤثّث بيوت الأردن — بيت المستقبل، تحت سقف واحد." },
  footer_demo: { en: "Concept preview — built for Evora", ar: "نسخة تجريبية — صُمّمت لإيفورا" },

  proof_eyebrow: { en: "Loved across Amman", ar: "محبوب في كل عمّان" },
  proof_title: { en: "Homes, beautifully delivered", ar: "بيوت، سُلّمت بأبهى صورة" },
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
    en: "Furnish now and spread the cost with comfortable installments through Safwa Islamic Bank — at the same cash price, with no hidden cost.",
    ar: "أثّث الآن وقسّط التكلفة بمرونة عبر بنك صفوة الإسلامي — بنفس سعر الكاش، وبدون أي تكلفة خفية.",
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
} satisfies Dict;
