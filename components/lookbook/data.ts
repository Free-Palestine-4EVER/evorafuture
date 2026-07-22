/* Shared data for the Evora · ARGOS Lookbook web-app (all 3 modes). */

/* Page 0 is the branded cover (cover.webp/.avif); pages 1..31 are the real book
 * content and keep their original p01..p31 filenames untouched. */
export const PAGE_COUNT = 32;
export const PDF_HREF = "/evora/Evora-ARGOS-Lookbook.pdf";
export const pageSrc = (i: number) =>
  i === 0 ? "/evora/lookbook/cover.webp" : `/evora/lookbook/p${String(i).padStart(2, "0")}.webp`;

export type Lang = "en" | "ar";

/* Broad, safe chapter bands (no room-specific claims that could be wrong). */
export const CHAPTERS: { from: number; en: string; ar: string }[] = [
  { from: 0, en: "The Lookbook", ar: "الكتالوج" },
  { from: 1, en: "The Private Quarters", ar: "الأجنحة الخاصة" },
  { from: 16, en: "Living & Majlis", ar: "المعيشة والمجلس" },
  { from: 25, en: "Lounge & Leisure", ar: "الاستراحة والترفيه" },
];

export function chapterOf(i: number, lang: Lang): string {
  let c = CHAPTERS[0];
  for (const ch of CHAPTERS) if (ch.from <= i) c = ch;
  return lang === "en" ? c.en : c.ar;
}

export function chapterIndex(i: number): number {
  let idx = 0;
  CHAPTERS.forEach((ch, k) => { if (ch.from <= i) idx = k; });
  return idx;
}
