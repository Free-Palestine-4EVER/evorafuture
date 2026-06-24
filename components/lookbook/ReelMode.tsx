"use client";

import { useEffect, useRef } from "react";
import { PAGE_COUNT, pageSrc, chapterOf, type Lang } from "./data";

/* v2 — immersive scroll cinema. One full-bleed plate per page, floating on
 * the dark stage with a chapter band, oversized index and ken-burns drift.
 * Scroll position drives the shared `page`; filmstrip jumps scroll here. */
export default function ReelMode({
  page, setPage, lang,
}: { page: number; setPage: (n: number) => void; lang: Lang; dir: "ltr" | "rtl" }) {
  const en = lang === "en";
  const scrollRef = useRef<HTMLDivElement>(null);
  const panels = useRef<(HTMLDivElement | null)[]>([]);
  const selfSet = useRef(false);

  // scroll → active page
  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        let best = -1, ratio = 0;
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio > ratio) {
            ratio = e.intersectionRatio;
            best = Number((e.target as HTMLElement).dataset.i);
          }
        }
        if (best >= 0) { selfSet.current = true; setPage(best); }
      },
      { root, threshold: [0.45, 0.6, 0.8] },
    );
    panels.current.forEach((p) => p && io.observe(p));
    return () => io.disconnect();
  }, [setPage]);

  // external jump → scroll into view
  useEffect(() => {
    if (selfSet.current) { selfSet.current = false; return; }
    panels.current[page]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [page]);

  return (
    <div className="lbr" ref={scrollRef}>
      {Array.from({ length: PAGE_COUNT }).map((_, i) => (
        <div className="lbr-panel" key={i} data-i={i} ref={(el) => { panels.current[i] = el; }}>
          <span className="lbr-index" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
          <div className="lbr-figure">
            <img className="lbr-img" src={pageSrc(i)} alt={en ? `Page ${i + 1}` : `صفحة ${i + 1}`} loading={i < 2 ? "eager" : "lazy"} draggable={false} />
          </div>
          <div className="lbr-meta">
            <span className="lbr-chapter">{chapterOf(i, lang)}</span>
            <span className="lbr-count">{en ? "Plate" : "لوحة"} {String(i + 1).padStart(2, "0")} / {PAGE_COUNT}</span>
          </div>
        </div>
      ))}
      <div className="lbr-end">
        <span>{en ? "ARGOS · Interior Design by Evora" : "أرغوس · تصميم داخلي من إيفورا"}</span>
      </div>
    </div>
  );
}
