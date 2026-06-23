"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useT } from "@/lib/i18n";
import { Rise, useInView, useReducedMotion, motion } from "@/components/motion";
import { animate } from "framer-motion";

export default function DesignService() {
  const { t } = useT();
  const [pos, setPos] = useState(8);
  const [grabbing, setGrabbing] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const reduce = useReducedMotion();

  // Scroll-in: gently sweep from concept (8%) to delivered (62%) once, then hand control to the user.
  const inView = useInView(wrap, { once: true, margin: "0px 0px -20% 0px" });
  useEffect(() => {
    if (!inView) return;
    if (reduce) { setPos(50); return; }
    const controls = animate(8, 62, {
      duration: 1.7,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => { if (!dragging.current) setPos(v); },
    });
    return () => controls.stop();
  }, [inView, reduce]);

  const setFromClient = useCallback((clientX: number) => {
    const el = wrap.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const p = ((clientX - r.left) / r.width) * 100;
    setPos(Math.max(2, Math.min(98, p)));
  }, []);

  const onDown = (e: React.PointerEvent) => {
    dragging.current = true;
    setGrabbing(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    setFromClient(e.clientX);
  };
  const onMove = (e: React.PointerEvent) => { if (dragging.current) setFromClient(e.clientX); };
  const onUp = () => { dragging.current = false; setGrabbing(false); };

  return (
    <section id="design" className="section container">
      <style>{`
        .ds-compare { aspect-ratio: 16/9; }
        @media (max-width: 640px) { .ds-compare { aspect-ratio: 3/4; } }
      `}</style>
      <div style={{ maxWidth: 640, marginBottom: "3rem" }}>
        <Rise as="span" className="eyebrow" style={{ color: "var(--brass)", display: "block" }}>{t("design_eyebrow")}</Rise>
        <Rise delay={0.08}>
          <h2 className="display" style={{ fontSize: "clamp(2.2rem, 5.2vw, 4.4rem)", margin: "1rem 0 0.8rem" }}>{t("design_title")}</h2>
        </Rise>
        <Rise delay={0.14}><p style={{ color: "var(--ink-soft)", maxWidth: "50ch" }}>{t("design_sub")}</p></Rise>
      </div>

      <Rise delay={0.12}>
        <div
          ref={wrap}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerLeave={onUp}
          className="ds-compare"
          style={{ position: "relative", overflow: "hidden", borderRadius: 4, userSelect: "none", touchAction: "none", boxShadow: "0 30px 70px -40px rgba(0,0,0,0.4)" }}
        >
          {/* Delivered (full color) */}
          <img src="/evora/p06.jpg" alt={t("design_after")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center bottom" }} draggable={false} />

          {/* Concept (clipped overlay) — hand-drawn sketch */}
          <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
            <img src="/evora/concept.png" alt={t("design_before")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} draggable={false} />
          </div>

          {/* labels */}
          <Tag side="start" text={t("design_before")} dim={pos > 55} />
          <Tag side="end" text={t("design_after")} dim={pos < 45} />

          {/* handle */}
          <div style={{ position: "absolute", top: 0, bottom: 0, left: `${pos}%`, transform: "translateX(-50%)", width: 2, background: "var(--paper)", boxShadow: "0 0 18px rgba(0,0,0,0.4)", zIndex: 4 }}>
            <motion.button
              onPointerDown={onDown}
              aria-label="Drag to compare concept and delivered"
              data-cursor="hover"
              animate={{ scale: grabbing ? 1.12 : 1, boxShadow: grabbing ? "0 12px 34px rgba(0,0,0,0.4)" : "0 8px 24px rgba(0,0,0,0.3)" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ position: "absolute", top: "50%", left: "50%", x: "-50%", y: "-50%", width: 52, height: 52, borderRadius: "50%", background: "var(--paper)", border: "none", cursor: "none", display: "grid", placeItems: "center" }}
            >
              <span style={{ color: "var(--ink)", fontSize: "1rem", letterSpacing: "-2px" }}>‹ ›</span>
            </motion.button>
          </div>
        </div>
      </Rise>
    </section>
  );
}

function Tag({ side, text, dim }: { side: "start" | "end"; text: string; dim: boolean }) {
  return (
    <span style={{
      position: "absolute", top: "1.1rem", [side === "start" ? "insetInlineStart" : "insetInlineEnd"]: "1.1rem",
      zIndex: 3, background: "rgba(16,15,13,0.55)", backdropFilter: "blur(6px)", color: "var(--paper)",
      fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "0.45rem 0.85rem", borderRadius: 100,
      opacity: dim ? 0.32 : 1, transition: "opacity 0.4s var(--ease)",
    } as React.CSSProperties}>{text}</span>
  );
}
