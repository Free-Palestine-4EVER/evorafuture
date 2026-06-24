"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PAGE_COUNT, pageSrc, chapterOf, type Lang } from "./data";

/* "Read" — a deep-zoom inspector. Wheel / pinch / double-tap to zoom, drag to
 * pan; at 1× a horizontal drag turns the page. Built for studying detail. */
const MIN = 1, MAX = 4.5;

export default function ZoomMode({
  page, setPage, lang,
}: { page: number; setPage: (n: number) => void; lang: Lang; dir: "ltr" | "rtl" }) {
  const en = lang === "en";
  const clamp = (n: number) => Math.max(0, Math.min(PAGE_COUNT - 1, n));
  const frameRef = useRef<HTMLDivElement>(null);
  const [v, setV] = useState({ s: 1, x: 0, y: 0 });
  const pts = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinch = useRef({ d: 0, s: 1 });
  const pan = useRef({ on: false, x: 0, y: 0, vx: 0, vy: 0, moved: 0 });

  useEffect(() => { setV({ s: 1, x: 0, y: 0 }); }, [page]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setPage(clamp(page + 1));
      else if (e.key === "ArrowLeft") setPage(clamp(page - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [page, setPage]);

  const bound = useCallback((s: number, x: number, y: number) => {
    const el = frameRef.current;
    const sz = el ? Math.min(el.clientWidth, el.clientHeight) : 0;
    const m = Math.max(0, (sz * s - sz) / 2);
    return { s, x: Math.max(-m, Math.min(m, x)), y: Math.max(-m, Math.min(m, y)) };
  }, []);

  const zoomAt = (factor: number, cx: number, cy: number) => {
    setV((p) => {
      const el = frameRef.current; if (!el) return p;
      const r = el.getBoundingClientRect();
      const px = cx - r.left - r.width / 2;
      const py = cy - r.top - r.height / 2;
      const s = Math.max(MIN, Math.min(MAX, p.s * factor));
      const k = s / p.s;
      return bound(s, px - k * (px - p.x), py - k * (py - p.y));
    });
  };

  const onWheel = (e: React.WheelEvent) => { e.preventDefault(); zoomAt(e.deltaY < 0 ? 1.18 : 1 / 1.18, e.clientX, e.clientY); };

  const down = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pts.current.size === 1) pan.current = { on: true, x: e.clientX, y: e.clientY, vx: v.x, vy: v.y, moved: 0 };
    if (pts.current.size === 2) {
      const [a, b] = [...pts.current.values()];
      pinch.current = { d: Math.hypot(a.x - b.x, a.y - b.y), s: v.s };
      pan.current.on = false;
    }
  };
  const move = (e: React.PointerEvent) => {
    if (!pts.current.has(e.pointerId)) return;
    pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pts.current.size === 2) {
      const [a, b] = [...pts.current.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      const s = Math.max(MIN, Math.min(MAX, pinch.current.s * (d / (pinch.current.d || d))));
      setV((p) => bound(s, p.x, p.y));
      return;
    }
    if (pan.current.on) {
      const dx = e.clientX - pan.current.x, dy = e.clientY - pan.current.y;
      pan.current.moved = Math.max(pan.current.moved, Math.abs(dx) + Math.abs(dy));
      if (v.s > 1) setV((p) => bound(p.s, pan.current.vx + dx, pan.current.vy + dy));
    }
  };
  const up = (e: React.PointerEvent) => {
    const wasPan = pan.current;
    pts.current.delete(e.pointerId);
    if (pts.current.size < 2) pinch.current.d = 0;
    if (pts.current.size === 0) {
      pan.current.on = false;
      if (v.s <= 1.02 && Math.abs(e.clientX - wasPan.x) > 60 && wasPan.moved < 400) {
        setPage(clamp(page + (e.clientX < wasPan.x ? 1 : -1)));
      }
    }
  };
  const dbl = (e: React.MouseEvent) => { if (v.s > 1.2) setV({ s: 1, x: 0, y: 0 }); else zoomAt(2.6, e.clientX, e.clientY); };

  const zoomed = v.s > 1.02;
  return (
    <div className="lbz">
      <div
        ref={frameRef}
        className={`lbz-frame ${zoomed ? "is-zoomed" : ""}`}
        onWheel={onWheel} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onDoubleClick={dbl}
      >
        <img
          className="lbz-img"
          src={pageSrc(page)}
          alt={en ? `Page ${page + 1}` : `صفحة ${page + 1}`}
          draggable={false}
          style={{ transform: `translate(${v.x}px, ${v.y}px) scale(${v.s})`, transition: pan.current.on || pinch.current.d ? "none" : "transform .28s cubic-bezier(.22,1,.36,1)" }}
        />
      </div>

      <div className="lbz-tools">
        <button className="lbz-btn" aria-label="Previous" onClick={() => setPage(clamp(page - 1))} disabled={page === 0}>‹</button>
        <button className="lbz-btn" aria-label="Zoom out" onClick={() => zoomAt(1 / 1.4, innerW() / 2, innerH() / 2)}>–</button>
        <span className="lbz-level">{Math.round(v.s * 100)}%</span>
        <button className="lbz-btn" aria-label="Zoom in" onClick={() => zoomAt(1.4, innerW() / 2, innerH() / 2)}>+</button>
        <button className="lbz-btn" aria-label="Next" onClick={() => setPage(clamp(page + 1))} disabled={page === PAGE_COUNT - 1}>›</button>
      </div>
      <div className="lbz-cap">{chapterOf(page, lang)} · {String(page + 1).padStart(2, "0")} / {PAGE_COUNT}</div>
    </div>
  );
}

function innerW() { return typeof window !== "undefined" ? window.innerWidth : 0; }
function innerH() { return typeof window !== "undefined" ? window.innerHeight : 0; }
