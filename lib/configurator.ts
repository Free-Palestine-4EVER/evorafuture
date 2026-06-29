// ─────────────────────────────────────────────────────────────────────────
//  EVORA — Kitchen-island configurator
//  The hero video scroll-scrubs and settles on its LAST frame (base.webp).
//  Each "variant" below is a full re-render of that same frame with a
//  different table / countertop finish (the images you made).
//
//  HOW TO UPLOAD YOUR VARIANTS  ───────────────────────────────────────────
//  Drop your images into:   public/evora/configurator/
//  Name them exactly as the `image` field below, e.g.  surface-patagonia.webp
//  (.webp preferred, but .jpg/.png also work — just match the extension here).
//  Recommended size: 1920×1080, same camera/frame as base.webp so the swap
//  looks like only the surface changed.
//  • Any variant whose file is missing falls back to base.webp automatically,
//    so the page never breaks while you’re still adding images.
//  • The `swatch` is the little color chip shown in the UI (a hex color, or a
//    path to a tiny texture thumb like "/evora/configurator/swatches/x.jpg").
// ─────────────────────────────────────────────────────────────────────────

export type SurfaceVariant = {
  id: string;
  label: { en: string; ar: string };
  swatch: string;            // hex color OR image path for the chip
  image: string;             // full-scene render in public/evora/configurator/
  note?: { en: string; ar: string }; // one-line stone identity, shown under the active swatch
                                      // (optional: runtime-uploaded variants have none)
};

export const CONFIG_BASE = "/evora/configurator/base.webp";

// The first entry IS the base render already shown when the scroll settles.
export const SURFACES: SurfaceVariant[] = [
  {
    id: "patagonia",
    label: { en: "Patagonia", ar: "باتاغونيا" },
    swatch: "/evora/configurator/swatches/patagonia.jpg",
    image: "/evora/configurator/base.webp",
    note: { en: "Storm-grey movement, a statement island", ar: "حركة رماديّة كالعاصفة، جزيرة تلفت الأنظار" },
  },
  {
    id: "calacatta-gold",
    label: { en: "Calacatta Gold", ar: "كالاكاتا غولد" },
    swatch: "/evora/configurator/swatches/calacatta-gold.jpg",
    image: "/evora/configurator/surface-calacatta-gold.webp",
    note: { en: "Warm gold veining, quiet wealth", ar: "عروقٌ ذهبية دافئة، ثراءٌ هادئ" },
  },
  {
    id: "emperador",
    label: { en: "Emperador", ar: "إمبرادور" },
    swatch: "/evora/configurator/swatches/emperador.jpg",
    image: "/evora/configurator/surface-emperador.webp",
    note: { en: "Deep brown, soft light", ar: "بنيٌّ عميق وضوءٌ ناعم" },
  },
  {
    id: "nero-marquina",
    label: { en: "Nero Marquina", ar: "نيرو مركينا" },
    swatch: "/evora/configurator/swatches/nero-marquina.jpg",
    image: "/evora/configurator/surface-nero-marquina.webp",
    note: { en: "Black marble, white lightning, for the bold", ar: "رخامٌ أسود ببرقٍ أبيض، لمن يجرؤ" },
  },
  {
    id: "verde-alpi",
    label: { en: "Verde Alpi", ar: "فيردي ألبي" },
    swatch: "/evora/configurator/swatches/verde-alpi.jpg",
    image: "/evora/configurator/surface-verde-alpi.webp",
    note: { en: "Forest green, rare and alive", ar: "أخضرُ غابيٌّ نادر وحيّ" },
  },
  {
    id: "travertine",
    label: { en: "Travertine", ar: "ترافرتين" },
    swatch: "/evora/configurator/swatches/travertine.jpg",
    image: "/evora/configurator/surface-travertine.webp",
    note: { en: "Sand-toned, honest stone", ar: "حجرٌ رمليٌّ صادق" },
  },
];
