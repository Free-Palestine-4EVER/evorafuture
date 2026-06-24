"use client";

import { useEffect, useRef, useState } from "react";
import { PAGE_COUNT, pageSrc, chapterOf, type Lang } from "./data";

/* "Tour" — a guided, hands-free presentation. Each plate holds for a beat with
 * a slow ken-burns drift, then advances; play/pause and a progress beam. */
const HOLD = 5000;

export default function TourMode({
  page, setPage, lang,
}: { page: number; setPage: (n: number) => void; lang: Lang; dir: "ltr" | "rtl" }) {
  const en = lang === "en";
  const clamp = (n: number) => Math.max(0, Math.min(PAGE_COUNT - 1, n));
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!playing) return;
    let id = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / HOLD);
      setProgress(p);
      if (p >= 1) setPage(page >= PAGE_COUNT - 1 ? 0 : page + 1);
      else id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [playing, page, setPage]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setPage(clamp(page + 1));
      else if (e.key === "ArrowLeft") setPage(clamp(page - 1));
      else if (e.key === " ") { e.preventDefault(); setPlaying((p) => !p); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [page, setPage]);

  return (
    <div className="lbtour">
      <img className="lbtour-bloom" key={`b${page}`} src={pageSrc(page)} alt="" aria-hidden="true" draggable={false} />
      <div className="lbtour-vignette" aria-hidden="true" />

      <button className="lbtour-stage" onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause" : "Play"}>
        <figure className={`lbtour-figure ${page % 2 ? "kb-b" : "kb-a"}`} key={page}>
          <img className="lbtour-img" src={pageSrc(page)} alt={en ? `Page ${page + 1}` : `صفحة ${page + 1}`} draggable={false} />
        </figure>
        <span className={`lbtour-play ${playing ? "is-playing" : ""}`}>
          {playing ? <PauseGlyph /> : <PlayGlyph />}
        </span>
      </button>

      <div className="lbtour-hud">
        <button className="lbz-btn" aria-label="Previous" onClick={() => setPage(clamp(page - 1))} disabled={page === 0}>‹</button>
        <div className="lbtour-meta">
          <span className="lbtour-chapter">{chapterOf(page, lang)}</span>
          <div className="lbtour-track"><span className="lbtour-fill" style={{ width: `${progress * 100}%` }} /></div>
          <span className="lbtour-count">{String(page + 1).padStart(2, "0")} / {PAGE_COUNT}</span>
        </div>
        <button className="lbz-btn" aria-label="Next" onClick={() => setPage(clamp(page + 1))} disabled={page === PAGE_COUNT - 1}>›</button>
      </div>
    </div>
  );
}

function PlayGlyph() { return <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>; }
function PauseGlyph() { return <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>; }
