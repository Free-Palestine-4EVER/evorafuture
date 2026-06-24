"use client";

import { useEffect, useRef, useState } from "react";
import { PAGE_COUNT, pageSrc, chapterOf, type Lang } from "./data";

/* v9 — CAROUSEL. The plates wrap around a 3D drum; spin it with drag, wheel
 * or arrows and the front plate snaps to face you. */
export default function CylinderMode({
  page, setPage, lang, dir,
}: { page: number; setPage: (n: number) => void; lang: Lang; dir: "ltr" | "rtl" }) {
  const en = lang === "en";
  const rtl = dir === "rtl";
  const wrapRef = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(1000);
  const [dragPx, setDragPx] = useState(0);
  const meta = useRef({ on: false, sx: 0, moved: 0 });
  const wheelLock = useRef(0);

  useEffect(() => {
    const el = wrapRef.current; if (!el) return;
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el); setW(el.clientWidth);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setPage(Math.min(page + 1, PAGE_COUNT - 1));
      else if (e.key === "ArrowLeft") setPage(Math.max(page - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [page, setPage]);

  const cardW = Math.min(w * 0.32, 300);
  const radius = Math.round(cardW * 1.35);
  const theta = 22;
  const sens = cardW * 0.9;
  const dirSign = rtl ? -1 : 1;
  const virtual = page - (dragPx / sens) * dirSign;
  const clamp = (n: number) => Math.max(0, Math.min(PAGE_COUNT - 1, n));

  const down = (e: React.PointerEvent) => { meta.current = { on: true, sx: e.clientX, moved: 0 }; (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId); };
  const move = (e: React.PointerEvent) => {
    if (!meta.current.on) return;
    const dx = e.clientX - meta.current.sx;
    meta.current.moved = Math.max(meta.current.moved, Math.abs(dx));
    setDragPx(dx);
  };
  const up = () => { if (!meta.current.on) return; meta.current.on = false; const t = clamp(Math.round(virtual)); setDragPx(0); setPage(t); };
  const onWheel = (e: React.WheelEvent) => {
    const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(d) < 6 || e.timeStamp - wheelLock.current < 220) return;
    wheelLock.current = e.timeStamp;
    setPage(clamp(page + (d > 0 ? 1 : -1) * dirSign));
  };

  return (
    <div className={`lbcy ${meta.current.on ? "is-dragging" : ""}`} ref={wrapRef}
      onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onWheel={onWheel}>
      <div className="lbcy-stage">
        {Array.from({ length: PAGE_COUNT }).map((_, i) => {
          const rel = (i - virtual) * dirSign;
          if (Math.abs(rel) > 6.5) return null;
          const a = rel * theta;
          const op = Math.abs(rel) > 5 ? 0 : 1;
          return (
            <button key={i}
              className={`lbcy-card ${i === page ? "is-active" : ""} ${meta.current.on ? "no-anim" : ""}`}
              style={{ width: cardW, height: cardW, transform: `translate(-50%,-50%) rotateY(${a}deg) translateZ(${radius}px)`, zIndex: 100 - Math.round(Math.abs(rel)), opacity: op }}
              onClick={() => { if (meta.current.moved < 6) setPage(i); }}
              aria-label={en ? `Page ${i + 1}` : `صفحة ${i + 1}`} tabIndex={i === page ? 0 : -1}>
              <img src={pageSrc(i)} alt="" loading={Math.abs(rel) < 2 ? "eager" : "lazy"} draggable={false} />
            </button>
          );
        })}
      </div>
      <div className="lbcy-caption">
        <span className="lbcy-chapter">{chapterOf(page, lang)}</span>
        <span className="lbcy-count">{String(page + 1).padStart(2, "0")} / {PAGE_COUNT}</span>
      </div>
    </div>
  );
}
