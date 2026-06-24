// The Evora project journey — the official path every project follows, from a
// bare 2D blueprint to delivery. Shared by the admin (updates it live) and the
// customer portal (sees it live). Safe to import on client or server.

export interface JourneyStage {
  key: string;
  en: string;
  ar: string;
  hint_en: string;
  hint_ar: string;
  phase: "design" | "production";
}

export const JOURNEY: JourneyStage[] = [
  { key: "blueprint", en: "2D Blueprint", ar: "المخطط ثنائي الأبعاد",
    hint_en: "We receive your empty 2D plan — no furniture yet.", hint_ar: "نستلم مخططك ثنائي الأبعاد بدون أثاث.", phase: "design" },
  { key: "furniture", en: "Furniture Design", ar: "تصميم الأثاث",
    hint_en: "We design the furniture for your space and get your approval.", hint_ar: "نصمم الأثاث لمساحتك وننتظر موافقتك.", phase: "design" },
  { key: "design3d", en: "3D Design & Setup", ar: "التصميم ثلاثي الأبعاد",
    hint_en: "We build your space in 3D — kitchen, living, every room set up.", hint_ar: "نبني مساحتك ثلاثية الأبعاد — المطبخ والمعيشة وكل غرفة.", phase: "design" },
  { key: "render", en: "Photoreal Render", ar: "العرض الواقعي",
    hint_en: "We render photoreal images of the final look.", hint_ar: "ننتج صورًا واقعية للمظهر النهائي.", phase: "design" },
  { key: "materials", en: "Gathering Materials", ar: "تجهيز المواد",
    hint_en: "We source and gather all materials for production.", hint_ar: "نوفّر ونجهّز جميع المواد للإنتاج.", phase: "production" },
  { key: "finishing", en: "Production & Finishing", ar: "الإنتاج والتشطيب",
    hint_en: "Your pieces are built and finished by hand.", hint_ar: "تُصنع قطعك وتُشطّب يدويًا.", phase: "production" },
  { key: "delivery", en: "Delivery & Install", ar: "التسليم والتركيب",
    hint_en: "We deliver and install everything in your home.", hint_ar: "نسلّم ونركّب كل شيء في منزلك.", phase: "production" },
];

export const stageIndex = (key: string) => Math.max(0, JOURNEY.findIndex((s) => s.key === key));
export const stageByIndex = (i: number) => JOURNEY[Math.max(0, Math.min(JOURNEY.length - 1, i))];
