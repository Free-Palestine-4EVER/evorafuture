"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PAGE_COUNT, pageSrc, type Lang } from "./data";

/* v1 — a realistic 3D page-turn book (square pages, two-page spread on
 * desktop). Drag the page or use arrows. Controlled by the shared `page`. */
export default function BookMode({
  page, setPage, lang, dir, mono = false,
}: { page: number; setPage: (n: number) => void; lang: Lang; dir: "ltr" | "rtl"; mono?: boolean }) {
  const en = lang === "en";
  const ltr = dir !== "rtl";

  // mono (mobile): one square page per leaf. spread (desktop): two pages/leaf.
  const sheets = useMemo(() => {
    const arr: (number | null)[] = Array.from({ length: PAGE_COUNT }, (_, i) => i);
    if (!mono && arr.length % 2 !== 0) arr.push(null);
    return arr;
  }, [mono]);
  const leaves = mono ? PAGE_COUNT : sheets.length / 2;

  const toFlip = (p: number) => (mono ? p : Math.round(p / 2));
  const toPage = (f: number) => (mono ? f : Math.min(f * 2, PAGE_COUNT - 1));

  const [flipped, setFlipped] = useState(() => toFlip(page));
  const lastReported = useRef(-1);

  // external page → flip to the leaf/spread containing it
  useEffect(() => {
    const target = Math.min(toFlip(page), leaves);
    setFlipped((f) => (f === target ? f : target));
  }, [page, leaves, mono]);

  // internal flip → report page upward
  useEffect(() => {
    const rp = toPage(flipped);
    if (rp !== lastReported.current) { lastReported.current = rp; setPage(rp); }
  }, [flipped, setPage, mono]);

  const maxFlip = mono ? leaves - 1 : leaves;
  const next = useCallback(() => setFlipped((f) => Math.min(f + 1, maxFlip)), [maxFlip]);
  const prev = useCallback(() => setFlipped((f) => Math.max(f - 1, 0)), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const fwd = dir === "rtl" ? "ArrowLeft" : "ArrowRight";
      const back = dir === "rtl" ? "ArrowRight" : "ArrowLeft";
      if (e.key === fwd) next();
      else if (e.key === back) prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, dir]);

  // measured stage box → exact square size for the mono (mobile) page
  const lbkRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = lbkRef.current; if (!el) return;
    const read = () => setBox({ w: el.clientWidth, h: el.clientHeight });
    const ro = new ResizeObserver(read); ro.observe(el); read();
    return () => ro.disconnect();
  }, []);
  const monoSize = mono && box.w ? Math.round(Math.min(box.w * 0.9, box.h * 0.96)) : undefined;

  // drag-to-flip
  const bookRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<{ leaf: number; dir: 1 | -1; p: number } | null>(null);
  const meta = useRef({ startX: 0, moved: 0, half: 1 });

  const down = (e: React.PointerEvent) => {
    if (e.button !== 0 || drag) return;
    const el = bookRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const onRight = e.clientX - r.left > r.width / 2;
    const forward = ltr ? onRight : !onRight;
    if (forward && flipped >= maxFlip) return;
    if (!forward && flipped <= 0) return;
    meta.current = { startX: e.clientX, moved: 0, half: r.width / 2 };
    el.setPointerCapture?.(e.pointerId);
    setDrag({ leaf: forward ? flipped : flipped - 1, dir: forward ? 1 : -1, p: 0 });
  };
  const move = (e: React.PointerEvent) => {
    if (!drag) return;
    const dx = e.clientX - meta.current.startX;
    meta.current.moved = Math.max(meta.current.moved, Math.abs(dx));
    const raw = drag.dir === 1 ? (ltr ? -dx : dx) : ltr ? dx : -dx;
    setDrag((d) => (d ? { ...d, p: Math.max(0, Math.min(1, raw / meta.current.half)) } : d));
  };
  const up = useCallback(() => {
    setDrag((d) => {
      if (!d) return null;
      const click = meta.current.moved < 6;
      if (d.p > 0.35 || click) setFlipped((f) => (d.dir === 1 ? Math.min(f + 1, maxFlip) : Math.max(f - 1, 0)));
      return null;
    });
  }, [maxFlip]);

  const atStart = flipped === 0;
  const atEnd = flipped === maxFlip;
  const sign = ltr ? -1 : 1;

  const Face = ({ idx }: { idx: number }) => {
    const v = sheets[idx];
    if (v == null) return <span className="lbk-blank" />;
    return <img className="lbk-img" src={pageSrc(v)} alt={en ? `Page ${v + 1}` : `صفحة ${v + 1}`} draggable={false} loading={v < 4 ? "eager" : "lazy"} />;
  };

  return (
    <div className="lbk" ref={lbkRef}>
      <button className="lbk-nav lbk-nav--prev" aria-label={en ? "Previous" : "السابق"} onClick={prev} disabled={atStart}>‹</button>
      <div
        ref={bookRef}
        style={monoSize ? { width: monoSize, height: monoSize } : undefined}
        className={`lbk-book ${mono ? "is-mono" : ""} ${!mono && atStart ? "is-closed" : ""} ${!mono && atEnd ? "is-end" : ""} ${drag ? "is-dragging" : ""}`}
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
      >
        <span className="lbk-floor" aria-hidden="true" />
        {Array.from({ length: leaves }).map((_, i) => {
          const isFlipped = i < flipped;
          const isLive = drag?.leaf === i;
          let style: React.CSSProperties = { zIndex: isFlipped ? i : leaves - i };
          if (isLive && drag) {
            const ang = sign * 180 * (drag.dir === 1 ? drag.p : 1 - drag.p);
            style = { zIndex: leaves + 5, transform: `rotateY(${ang}deg)`, ["--cp" as string]: String(Math.sin(drag.p * Math.PI)) } as React.CSSProperties;
          }
          const frontIdx = mono ? i : i * 2;
          return (
            <div className={`lbk-leaf ${isFlipped ? "is-flipped" : ""} ${isLive ? "is-live" : ""}`} key={i} style={style}>
              <div className="lbk-face lbk-face--front">
                <div className="lbk-sheet"><Face idx={frontIdx} /></div>
                <span className="lbk-shade lbk-shade--front" />
              </div>
              <div className="lbk-face lbk-face--back">
                <div className="lbk-sheet">{mono ? <span className="lbk-blank" /> : <Face idx={i * 2 + 1} />}</div>
                <span className="lbk-shade lbk-shade--back" />
              </div>
            </div>
          );
        })}
        {!mono && <span className="lbk-spine" />}
      </div>
      <button className="lbk-nav lbk-nav--next" aria-label={en ? "Next" : "التالي"} onClick={next} disabled={atEnd}>›</button>
    </div>
  );
}
