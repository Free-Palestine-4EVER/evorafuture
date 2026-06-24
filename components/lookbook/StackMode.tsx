"use client";

import { useRef, useState } from "react";
import { PAGE_COUNT, pageSrc, chapterOf, type Lang } from "./data";

/* v6 — STACK. A tactile deck of plates. Flick the top card away to advance,
 * pull it right to go back. Cards behind peek with depth. */
export default function StackMode({
  page, setPage, lang,
}: { page: number; setPage: (n: number) => void; lang: Lang; dir: "ltr" | "rtl" }) {
  const en = lang === "en";
  const [d, setD] = useState({ x: 0, y: 0, on: false });
  const meta = useRef({ sx: 0, sy: 0 });

  const down = (e: React.PointerEvent) => {
    meta.current = { sx: e.clientX, sy: e.clientY };
    setD({ x: 0, y: 0, on: true });
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const move = (e: React.PointerEvent) => {
    if (!d.on) return;
    setD({ x: e.clientX - meta.current.sx, y: e.clientY - meta.current.sy, on: true });
  };
  const up = () => {
    if (!d.on) return;
    const { x, y } = d;
    const far = Math.abs(x) > 110 || y < -120;
    if (far && x > 80) setPage(Math.max(page - 1, 0));        // flick right → back
    else if (far) setPage(Math.min(page + 1, PAGE_COUNT - 1)); // flick left/up → next
    setD({ x: 0, y: 0, on: false });
  };

  const depth = 4;
  return (
    <div className="lbsk">
      <div className="lbsk-deck">
        {Array.from({ length: depth }).map((_, k) => {
          const i = page + k;
          if (i >= PAGE_COUNT) return null;
          const top = k === 0;
          const style: React.CSSProperties = top
            ? {
                zIndex: 50,
                transform: `translate(${d.x}px, ${d.y}px) rotate(${d.x * 0.04}deg)`,
                transition: d.on ? "none" : "transform .45s cubic-bezier(.22,1,.36,1)",
              }
            : {
                zIndex: 50 - k,
                transform: `translateY(${k * 14}px) scale(${1 - k * 0.05})`,
                opacity: 1 - k * 0.18,
              };
          return (
            <div
              key={i}
              className={`lbsk-card ${top ? "is-top" : ""}`}
              style={style}
              onPointerDown={top ? down : undefined}
              onPointerMove={top ? move : undefined}
              onPointerUp={top ? up : undefined}
              onPointerCancel={top ? up : undefined}
            >
              <img src={pageSrc(i)} alt={en ? `Page ${i + 1}` : `صفحة ${i + 1}`} draggable={false} loading={k < 2 ? "eager" : "lazy"} />
              {top && <span className="lbsk-cap">{chapterOf(i, lang)} · {String(i + 1).padStart(2, "0")} / {PAGE_COUNT}</span>}
            </div>
          );
        })}
      </div>
      <p className="lbsk-hint">{en ? "Flick the card · left to advance, right to go back" : "اسحب البطاقة · لليسار للتقدّم، لليمين للرجوع"}</p>
    </div>
  );
}
