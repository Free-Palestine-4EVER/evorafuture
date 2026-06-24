"use client";

import { useEffect, useRef, useState } from "react";
import { PAGE_COUNT, pageSrc, chapterOf, type Lang } from "./data";

/* v3 — a 3D coverflow deck. The centred plate faces front; neighbours fan
 * back with depth, tilt and a soft reflection. Drag / wheel / click to spin
 * through. `page` is the active card (shared with the rest of the app). */
export default function GalleryMode({
  page, setPage, lang, dir,
}: { page: number; setPage: (n: number) => void; lang: Lang; dir: "ltr" | "rtl" }) {
  const en = lang === "en";
  const rtl = dir === "rtl";
  const wrapRef = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(1000);
  const [dragPx, setDragPx] = useState(0);
  const meta = useRef({ down: false, startX: 0, moved: 0, id: -1 });
  const wheelLock = useRef(0);

  useEffect(() => {
    const el = wrapRef.current; if (!el) return;
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el); setW(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const cardW = Math.min(w * 0.52, 440);
  const spacing = cardW * 0.64;
  const dirSign = rtl ? -1 : 1;
  const virtual = page - (dragPx / spacing) * dirSign;

  const clamp = (n: number) => Math.max(0, Math.min(PAGE_COUNT - 1, n));

  const down = (e: React.PointerEvent) => {
    meta.current = { down: true, startX: e.clientX, moved: 0, id: e.pointerId };
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const move = (e: React.PointerEvent) => {
    if (!meta.current.down) return;
    const dx = e.clientX - meta.current.startX;
    meta.current.moved = Math.max(meta.current.moved, Math.abs(dx));
    setDragPx(dx);
  };
  const up = () => {
    if (!meta.current.down) return;
    meta.current.down = false;
    const moved = meta.current.moved;
    const target = clamp(Math.round(virtual));
    setDragPx(0);
    setPage(target);
    // a tiny click that didn't move snaps to nearest (no-op) — handled by card onClick
    void moved;
  };

  const onWheel = (e: React.WheelEvent) => {
    const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    const now = e.timeStamp;
    if (Math.abs(d) < 6 || now - wheelLock.current < 220) return;
    wheelLock.current = now;
    setPage(clamp(page + (d > 0 ? 1 : -1) * dirSign));
  };

  return (
    <div
      className={`lbg ${meta.current.down ? "is-dragging" : ""}`}
      ref={wrapRef}
      onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
      onWheel={onWheel}
    >
      <div className="lbg-stage">
        {Array.from({ length: PAGE_COUNT }).map((_, i) => {
          const rel = (i - virtual) * dirSign;
          const a = Math.abs(rel);
          if (a > 4.5) return null;
          const x = rel * spacing;
          const rotY = Math.max(-1, Math.min(1, rel)) * -48;
          const z = -a * 120;
          const scale = Math.max(0.7, 1 - a * 0.08);
          const op = a > 3.5 ? 0 : 1;
          return (
            <button
              key={i}
              className={`lbg-card ${i === page ? "is-active" : ""} ${meta.current.down ? "no-anim" : ""}`}
              style={{
                width: cardW, height: cardW,
                transform: `translate3d(${x}px,0,${z}px) rotateY(${rotY}deg) scale(${scale})`,
                zIndex: 100 - Math.round(a),
                opacity: op,
              }}
              onClick={() => { if (meta.current.moved < 6) setPage(i); }}
              aria-label={en ? `Open page ${i + 1}` : `افتح صفحة ${i + 1}`}
              tabIndex={i === page ? 0 : -1}
            >
              <img className="lbg-img" src={pageSrc(i)} alt={en ? `Page ${i + 1}` : `صفحة ${i + 1}`} loading={a < 2 ? "eager" : "lazy"} draggable={false} />
              {a < 2.5 && <img className="lbg-reflect" src={pageSrc(i)} alt="" aria-hidden="true" draggable={false} />}
            </button>
          );
        })}
      </div>
      <div className="lbg-caption">
        <span className="lbg-chapter">{chapterOf(page, lang)}</span>
        <span className="lbg-count">{String(page + 1).padStart(2, "0")} / {PAGE_COUNT}</span>
      </div>
    </div>
  );
}
