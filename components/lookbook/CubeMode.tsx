"use client";

import { useEffect, useRef, useState } from "react";
import { PAGE_COUNT, pageSrc, chapterOf, type Lang } from "./data";

/* v10 — CUBE. The whole stage is a rotating 3D cube; each turn swings the
 * next plate into view across a face. Drag, wheel or arrows to rotate. */
export default function CubeMode({
  page, setPage, lang,
}: { page: number; setPage: (n: number) => void; lang: Lang; dir: "ltr" | "rtl" }) {
  const en = lang === "en";
  const wrapRef = useRef<HTMLDivElement>(null);
  const [s, setS] = useState(420);
  const [dragDeg, setDragDeg] = useState(0);
  const meta = useRef({ on: false, sx: 0, moved: 0, w: 800 });
  const wheelLock = useRef(0);
  const clamp = (n: number) => Math.max(0, Math.min(PAGE_COUNT - 1, n));

  useEffect(() => {
    const el = wrapRef.current; if (!el) return;
    const fit = () => { const m = Math.min(el.clientWidth, el.clientHeight); setS(Math.max(220, m * 0.74)); meta.current.w = el.clientWidth; };
    const ro = new ResizeObserver(fit); ro.observe(el); fit();
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setPage(clamp(page + 1));
      else if (e.key === "ArrowLeft") setPage(clamp(page - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [page, setPage]);

  const half = Math.round(s / 2);
  const fk = ((page % 4) + 4) % 4; // front face index

  const pageForFace = (k: number) => {
    const off = (((k - fk) % 4) + 4) % 4; // 0=front,1=right(next),2=back,3=left(prev)
    const delta = off === 3 ? -1 : off;
    const p = page + delta;
    return p >= 0 && p < PAGE_COUNT ? p : null;
  };

  const down = (e: React.PointerEvent) => { meta.current.on = true; meta.current.sx = e.clientX; meta.current.moved = 0; (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId); };
  const move = (e: React.PointerEvent) => {
    if (!meta.current.on) return;
    const dx = e.clientX - meta.current.sx;
    meta.current.moved = Math.max(meta.current.moved, Math.abs(dx));
    setDragDeg(Math.max(-90, Math.min(90, (dx / (meta.current.w * 0.5)) * 90)));
  };
  const up = () => {
    if (!meta.current.on) return; meta.current.on = false;
    setDragDeg((d) => { if (d <= -45) setPage(clamp(page + 1)); else if (d >= 45) setPage(clamp(page - 1)); return 0; });
  };
  const onWheel = (e: React.WheelEvent) => {
    const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(d) < 6 || e.timeStamp - wheelLock.current < 260) return;
    wheelLock.current = e.timeStamp;
    setPage(clamp(page + (d > 0 ? 1 : -1)));
  };

  const faces = [0, 1, 2, 3];
  const baseAngle = [0, 90, 180, 270];

  return (
    <div className={`lbcu ${meta.current.on ? "is-dragging" : ""}`} ref={wrapRef}
      onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onWheel={onWheel}>
      <div className="lbcu-scene">
        <div className={`lbcu-cube ${meta.current.on ? "no-anim" : ""}`}
          style={{ width: s, height: s, transform: `translateZ(${-half}px) rotateY(${-page * 90 + dragDeg}deg)` }}>
          {faces.map((k) => {
            const p = pageForFace(k);
            return (
              <div className="lbcu-face" key={k}
                style={{ transform: `rotateY(${baseAngle[k]}deg) translateZ(${half}px)` }}>
                {p == null ? <span className="lbcu-blank" /> : <img src={pageSrc(p)} alt={en ? `Page ${p + 1}` : `صفحة ${p + 1}`} draggable={false} loading="eager" />}
              </div>
            );
          })}
        </div>
      </div>
      <button className="lbk-nav lbk-nav--prev lbcu-nav lbcu-nav--l" aria-label="Prev" onClick={() => setPage(clamp(page - 1))} disabled={page === 0}>‹</button>
      <button className="lbk-nav lbk-nav--next lbcu-nav lbcu-nav--r" aria-label="Next" onClick={() => setPage(clamp(page + 1))} disabled={page === PAGE_COUNT - 1}>›</button>
      <div className="lbcu-caption">
        <span className="lbcu-chapter">{chapterOf(page, lang)}</span>
        <span className="lbcu-count">{String(page + 1).padStart(2, "0")} / {PAGE_COUNT}</span>
      </div>
    </div>
  );
}
