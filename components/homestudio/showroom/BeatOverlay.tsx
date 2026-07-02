"use client";

// The text beats + the final AR button. Driven by the same scroll-progress ref
// via a rAF loop that sets opacity directly on the DOM (no React re-renders),
// so it stays perfectly smooth and in sync with the 3D reveal.

import { useEffect, useRef, type RefObject } from "react";
import { TEXT_BEATS, clamp01 } from "@/lib/homestudio/revealTimeline";

export default function BeatOverlay({ progress, onAr, arBusy }: {
  progress: RefObject<number>;
  onAr: () => void;
  arBusy: boolean;
}) {
  const beatRefs = useRef<(HTMLDivElement | null)[]>([]);
  const arRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const fade = 0.03; // fade in/out width in progress units
    const tick = () => {
      const p = progress.current ?? 0;
      TEXT_BEATS.forEach((b, i) => {
        const el = beatRefs.current[i];
        if (!el) return;
        const [a, c] = b.at;
        let o = 0;
        if (p >= a - fade && p <= c + fade) {
          o = Math.min(clamp01((p - (a - fade)) / fade), clamp01(((c + fade) - p) / fade));
        }
        el.style.opacity = String(o);
        el.style.transform = `translateY(${(1 - o) * 14}px)`;
      });
      if (arRef.current) {
        const show = p > 0.9;
        arRef.current.style.opacity = show ? "1" : "0";
        arRef.current.style.pointerEvents = show ? "auto" : "none";
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progress]);

  return (
    <div className="pointer-events-none fixed inset-0 z-10">
      {TEXT_BEATS.map((b, i) => (
        <div
          key={b.id}
          ref={(el) => { beatRefs.current[i] = el; }}
          className="absolute inset-x-0 bottom-[16vh] mx-auto w-full max-w-2xl px-6"
          style={{ opacity: 0 }}
        >
          <div className="mx-auto inline-block rounded-3xl bg-black/30 px-8 py-6 text-center backdrop-blur-md">
            <div className="font-mono text-[11px] uppercase tracking-[0.35em] text-white/55">{b.kicker}</div>
            <h2 className="mt-1 font-display text-4xl leading-tight text-white md:text-6xl">{b.title}</h2>
            {b.sub && <p className="mt-3 text-sm text-white/80 md:text-lg">{b.sub}</p>}
          </div>
        </div>
      ))}

      <div
        ref={arRef}
        className="absolute inset-x-0 bottom-[7vh] flex justify-center transition-opacity duration-500"
        style={{ opacity: 0 }}
      >
        <button
          onClick={onAr}
          disabled={arBusy}
          className="pointer-events-auto rounded-full bg-white px-7 py-3 font-medium text-ink shadow-2xl transition hover:bg-white/90 disabled:opacity-60"
        >
          {arBusy ? "Preparing…" : "Place in your room (AR)  ↗"}
        </button>
      </div>
    </div>
  );
}
