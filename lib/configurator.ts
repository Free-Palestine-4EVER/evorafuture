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
};

export const CONFIG_BASE = "/evora/configurator/base.webp";

// The first entry IS the base render already shown when the scroll settles.
export const SURFACES: SurfaceVariant[] = [
  {
    id: "patagonia",
    label: { en: "Patagonia", ar: "باتاغونيا" },
    swatch: "#d9cdbe",
    image: "/evora/configurator/base.webp",
  },
  {
    id: "calacatta-gold",
    label: { en: "Calacatta Gold", ar: "كالاكاتا غولد" },
    swatch: "#efe9dc",
    image: "/evora/configurator/surface-calacatta-gold.webp",
  },
  {
    id: "emperador",
    label: { en: "Emperador", ar: "إمبرادور" },
    swatch: "#5a463a",
    image: "/evora/configurator/surface-emperador.webp",
  },
  {
    id: "nero-marquina",
    label: { en: "Nero Marquina", ar: "نيرو مركينا" },
    swatch: "#1c1a18",
    image: "/evora/configurator/surface-nero-marquina.webp",
  },
  {
    id: "verde-alpi",
    label: { en: "Verde Alpi", ar: "فيردي ألبي" },
    swatch: "#2f4338",
    image: "/evora/configurator/surface-verde-alpi.webp",
  },
  {
    id: "travertine",
    label: { en: "Travertine", ar: "ترافرتين" },
    swatch: "#c9b79a",
    image: "/evora/configurator/surface-travertine.webp",
  },
];
