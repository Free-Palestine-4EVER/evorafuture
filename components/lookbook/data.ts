/* Shared data for the Evora · ARGOS Lookbook web-app (all 3 modes). */

/* Page 0 is the branded front cover, page 32 is a closing room shot that pairs
 * with the final blueprint (p31), and page 33 is the branded back cover — so
 * the book opens AND closes on Evora branding instead of a floor-plan page.
 * Pages 1..31 keep their original p01..p31 filenames untouched. */
export const PAGE_COUNT = 34;
export const PDF_HREF = "/evora/Evora-ARGOS-Lookbook.pdf";
export const pageSrc = (i: number) => {
  if (i === 0 || i === PAGE_COUNT - 1) return "/evora/lookbook/cover.webp";
  if (i === PAGE_COUNT - 2) return "/evora/lookbook/back-filler.webp";
  return `/evora/lookbook/p${String(i).padStart(2, "0")}.webp`;
};

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
