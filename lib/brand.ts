// ─────────────────────────────────────────────────────────────────────────
//  EVORA — Business constants (single source of truth)
//  The one place every surface (site, Studio, portal, footer, login) reads
//  the real address, hotlines, socials, hours and proof figures from. Change
//  a number here and it changes everywhere — nothing is hand-typed twice.
//
//  Proof figures (FOLLOWERS / HOMES / SINCE) are single-sourced from here so
//  the hero meta, the proof stats ribbon and the marquee can never drift apart.
// ─────────────────────────────────────────────────────────────────────────

export type Bi = { en: string; ar: string };

/** Showroom address — Wasfi Al-Tal St, Khalda, Amman, opposite Paradise Bakeries. */
export const ADDRESS: Bi = {
  en: "Wasfi Al-Tal St · Khalda · Amman, Jordan · opposite Paradise Bakeries",
  ar: "شارع وصفي التل · خلدا · عمّان، الأردن · مقابل أفران الجنّة",
};

/** Primary showroom hotline. */
export const PHONE_PRIMARY = "+962 79 130 1444";
/** Secondary hotline (also the WhatsApp number). */
export const PHONE_SECONDARY = "+962 79 636 4105";

/** Tel-href friendly forms (no spaces) for `tel:` / `href` use. */
export const PHONE_PRIMARY_TEL = "+962791301444";
export const PHONE_SECONDARY_TEL = "+962796364105";

/** WhatsApp deep-link (the secondary number). Append `?text=` to prefill copy. */
export const WHATSAPP = "https://wa.me/962796364105";

/** Social channels. */
export const IG = "https://instagram.com/evorafuturehome";
export const FB = "https://facebook.com/evorafuturehome";

/** Opening hours — Sat–Thu daytime, Friday by appointment. */
export const HOURS: Bi = {
  en: "Sat–Thu 10:00–22:00 · Friday by appointment",
  ar: "السبت–الخميس ١٠:٠٠–٢٢:٠٠ · الجمعة بموعد مسبق",
};

/** Proof figures — single-sourced so the hero, stats and marquee stay in sync. */
export const FOLLOWERS = "103K";
export const SINCE = "2017";
export const HOMES = "2,400+";

/** Convenience bundle for any consumer that wants the whole record. */
export const BRAND = {
  ADDRESS,
  PHONE_PRIMARY,
  PHONE_SECONDARY,
  PHONE_PRIMARY_TEL,
  PHONE_SECONDARY_TEL,
  WHATSAPP,
  IG,
  FB,
  HOURS,
  FOLLOWERS,
  SINCE,
  HOMES,
} as const;
