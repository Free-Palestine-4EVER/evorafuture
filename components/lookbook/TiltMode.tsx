"use client";

import { useEffect, useRef, useState } from "react";
import { PAGE_COUNT, pageSrc, chapterOf, type Lang } from "./data";

/* v8 — TILT. A single plate as a floating 3D slab that leans toward your
 * pointer with a sweeping glare and layered depth. Arrows / swipe to change. */
export default function TiltMode({
  page, setPage, lang,
}: { page: number; setPage: (n: number) => void; lang: Lang; dir: "ltr" | "rtl" }) {
  const en = lang === "en";
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({ rx: 0, ry: 0, gx: 50, gy: 50, active: false });
  const swipe = useRef({ x: 0, on: false });
  const clamp = (n: number) => Math.max(0, Math.min(PAGE_COUNT - 1, n));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setPage(clamp(page + 1));
      else if (e.key === "ArrowLeft") setPage(clamp(page - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [page, setPage]);

  const move = (e: React.PointerEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setT({ rx: (0.5 - py) * 16, ry: (px - 0.5) * 18, gx: px * 100, gy: py * 100, active: true });
  };
  const leave = () => setT((s) => ({ ...s, rx: 0, ry: 0, active: false }));

  const down = (e: React.PointerEvent) => { swipe.current = { x: e.clientX, on: true }; };
  const up = (e: React.PointerEvent) => {
    if (!swipe.current.on) return;
    const dx = e.clientX - swipe.current.x;
    swipe.current.on = false;
    if (dx < -60) setPage(clamp(page + 1));
    else if (dx > 60) setPage(clamp(page - 1));
  };

  return (
    <div className="lbt" ref={ref} onPointerMove={move} onPointerLeave={leave} onPointerDown={down} onPointerUp={up}>
      <button className="lbk-nav lbk-nav--prev lbt-nav" aria-label="Prev" onClick={() => setPage(clamp(page - 1))} disabled={page === 0}>‹</button>
      <div
        className={`lbt-card ${t.active ? "is-live" : ""}`}
        style={{ transform: `perspective(1100px) rotateX(${t.rx}deg) rotateY(${t.ry}deg)` }}
      >
        <img className="lbt-img" key={page} src={pageSrc(page)} alt={en ? `Page ${page + 1}` : `صفحة ${page + 1}`} draggable={false} />
        <span className="lbt-glare" style={{ background: `radial-gradient(circle at ${t.gx}% ${t.gy}%, rgba(255,255,255,.35), transparent 45%)` }} />
        <span className="lbt-cap">{chapterOf(page, lang)} · {String(page + 1).padStart(2, "0")} / {PAGE_COUNT}</span>
      </div>
      <button className="lbk-nav lbk-nav--next lbt-nav" aria-label="Next" onClick={() => setPage(clamp(page + 1))} disabled={page === PAGE_COUNT - 1}>›</button>
    </div>
  );
}
