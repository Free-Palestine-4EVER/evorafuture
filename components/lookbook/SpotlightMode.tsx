"use client";

import { useEffect } from "react";
import { PAGE_COUNT, pageSrc, chapterOf, type Lang } from "./data";

/* v7 — SPOTLIGHT. A cinema: the plate glows centre-stage over an ambient
 * blurred bloom of itself; cross-fades between pages; a seek bar scrubs. */
export default function SpotlightMode({
  page, setPage, lang,
}: { page: number; setPage: (n: number) => void; lang: Lang; dir: "ltr" | "rtl" }) {
  const en = lang === "en";
  const clamp = (n: number) => Math.max(0, Math.min(PAGE_COUNT - 1, n));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setPage(clamp(page + 1));
      else if (e.key === "ArrowLeft") setPage(clamp(page - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [page, setPage]);

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setPage(clamp(Math.round(((e.clientX - r.left) / r.width) * (PAGE_COUNT - 1))));
  };

  return (
    <div className="lbsp">
      <img className="lbsp-bloom" key={`b${page}`} src={pageSrc(page)} alt="" aria-hidden="true" draggable={false} />
      <div className="lbsp-vignette" aria-hidden="true" />

      <button className="lbsp-zone lbsp-zone--l" aria-label="Prev" onClick={() => setPage(clamp(page - 1))} />
      <figure className="lbsp-figure">
        <img className="lbsp-img" key={page} src={pageSrc(page)} alt={en ? `Page ${page + 1}` : `صفحة ${page + 1}`} draggable={false} />
      </figure>
      <button className="lbsp-zone lbsp-zone--r" aria-label="Next" onClick={() => setPage(clamp(page + 1))} />

      <div className="lbsp-hud">
        <span className="lbsp-chapter">{chapterOf(page, lang)}</span>
        <div className="lbsp-seek" onClick={seek}>
          <span className="lbsp-seek__fill" style={{ width: `${((page + 1) / PAGE_COUNT) * 100}%` }} />
          <span className="lbsp-seek__knob" style={{ left: `${((page + 1) / PAGE_COUNT) * 100}%` }} />
        </div>
        <span className="lbsp-count">{String(page + 1).padStart(2, "0")} / {PAGE_COUNT}</span>
      </div>
    </div>
  );
}
