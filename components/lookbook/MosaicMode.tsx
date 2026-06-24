"use client";

import { useEffect, useState } from "react";
import { PAGE_COUNT, pageSrc, chapterOf, type Lang } from "./data";

/* v5 — MOSAIC. The whole book as a living wall of plates; click any to open
 * a focused lightbox with prev/next. Overview + detail in one. */
export default function MosaicMode({
  page, setPage, lang,
}: { page: number; setPage: (n: number) => void; lang: Lang; dir: "ltr" | "rtl" }) {
  const en = lang === "en";
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      else if (e.key === "ArrowRight") setPage(Math.min(page + 1, PAGE_COUNT - 1));
      else if (e.key === "ArrowLeft") setPage(Math.max(page - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, page, setPage]);

  return (
    <div className="lbmo">
      <div className="lbmo-grid">
        {Array.from({ length: PAGE_COUNT }).map((_, i) => (
          <button
            key={i}
            className={`lbmo-tile ${i === page ? "is-on" : ""}`}
            onClick={() => { setPage(i); setOpen(true); }}
            aria-label={en ? `Open page ${i + 1}` : `افتح صفحة ${i + 1}`}
          >
            <img src={pageSrc(i)} alt="" loading="lazy" draggable={false} />
            <span className="lbmo-no">{String(i + 1).padStart(2, "0")}</span>
          </button>
        ))}
      </div>

      {open && (
        <div className="lbmo-light" onClick={() => setOpen(false)}>
          <button className="lbmo-x" aria-label={en ? "Close" : "إغلاق"} onClick={() => setOpen(false)}>✕</button>
          <button className="lbmo-arrow lbmo-arrow--l" aria-label="Prev"
            onClick={(e) => { e.stopPropagation(); setPage(Math.max(page - 1, 0)); }} disabled={page === 0}>‹</button>
          <figure className="lbmo-figure" onClick={(e) => e.stopPropagation()}>
            <img src={pageSrc(page)} alt={en ? `Page ${page + 1}` : `صفحة ${page + 1}`} draggable={false} />
            <figcaption>{chapterOf(page, lang)} · {String(page + 1).padStart(2, "0")} / {PAGE_COUNT}</figcaption>
          </figure>
          <button className="lbmo-arrow lbmo-arrow--r" aria-label="Next"
            onClick={(e) => { e.stopPropagation(); setPage(Math.min(page + 1, PAGE_COUNT - 1)); }} disabled={page === PAGE_COUNT - 1}>›</button>
        </div>
      )}
    </div>
  );
}
