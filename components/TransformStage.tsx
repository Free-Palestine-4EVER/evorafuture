"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

/* ------------------------------------------------------------------ *
 * TransformStage — the "flat plan → finished home" film, in 4 parts,
 * told through one real kitchen. Each stage is a photoreal asset
 * generated stage-by-stage (Higgsfield · Nano Banana) so the SAME
 * kitchen carries through all four:
 *
 *   0  2D blueprint    – the bare architectural floor plan
 *   1  Furnished 2D    – the plan filled with cabinets, island, dining
 *   2  Built in 3D     – the same plan as a 3D cut-away model
 *   3  Photoreal       – the finished kitchen (a live reveal video)
 *
 * Driven by scroll: the parent passes `step` (0–3) from the swap-column
 * mechanic in ProcessJourney and the stages cross-dissolve with a slow
 * Ken-Burns push. Bilingual captions. The final stage plays a Seedance
 * reveal video (with the still as poster / fallback).
 * ------------------------------------------------------------------ */

const STAGES = [
  { src: "/evora/kitchen/stage-1.jpg", en: "2D blueprint", ar: "مخطط ثنائي الأبعاد" },
  { src: "/evora/kitchen/stage-2.jpg", en: "Furnished in 2D", ar: "مفروش ثنائي الأبعاد" },
  { src: "/evora/kitchen/stage-3.jpg", en: "Built in 3D", ar: "مبني ثلاثي الأبعاد" },
  { src: "/evora/kitchen/stage-4.jpg", en: "Photoreal — approved", ar: "واقعي — معتمد" },
] as const;

const REVEAL_VIDEO = "/evora/kitchen/reveal.mp4";
const EASE = [0.22, 1, 0.36, 1] as const;

export default function TransformStage({ step, ar }: { step: number; ar: boolean }) {
  const reduced = useReducedMotion();
  const s = Math.max(0, Math.min(3, step));
  const isRender = s >= 3;

  return (
    <div className="ts-stage" aria-label={ar ? STAGES[s].ar : STAGES[s].en}>
      {/* stacked, cross-dissolving stage images with a slow Ken-Burns push */}
      {STAGES.map((stage, i) => {
        const on = i === s;
        return (
          <motion.div
            key={i}
            className="ts-frame"
            initial={false}
            animate={{ opacity: on ? 1 : 0 }}
            transition={{ duration: reduced ? 0 : 0.7, ease: "easeInOut" }}
            style={{ zIndex: on ? 2 : 1 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img
              src={stage.src}
              alt={ar ? stage.ar : stage.en}
              className="ts-img"
              initial={false}
              animate={reduced ? { scale: 1 } : { scale: on ? 1.06 : 1 }}
              transition={{ duration: on ? 7 : 0, ease: "linear" }}
              draggable={false}
            />
          </motion.div>
        );
      })}

      {/* photoreal reveal video on the final stage (still is the poster/fallback) */}
      <AnimatePresence>
        {isRender && (
          <motion.div
            className="ts-frame ts-video"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ zIndex: 3 }}
          >
            <video
              className="ts-img"
              src={REVEAL_VIDEO}
              poster={STAGES[3].src}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />
            <ApprovedBadge ar={ar} reduced={!!reduced} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* soft top + bottom scrims for legibility */}
      <div className="ts-scrim" />

      {/* caption + progress dots */}
      <AnimatePresence mode="wait">
        <motion.div
          key={s}
          className="ts-caption"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4 }}
        >
          <span className="ts-num">{`0${s + 1}`}</span>
          {ar ? STAGES[s].ar : STAGES[s].en}
        </motion.div>
      </AnimatePresence>

      <div className="ts-dots" aria-hidden>
        {STAGES.map((_, i) => (
          <span key={i} className={`ts-dot${i === s ? " on" : i < s ? " done" : ""}`} />
        ))}
      </div>

      <style>{`
        .ts-stage {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3;
          border-radius: 18px;
          overflow: hidden;
          background: #f3f0ea;
          border: 1px solid var(--line);
          box-shadow: 0 50px 110px -50px rgba(22,21,15,0.55);
        }
        .ts-frame { position: absolute; inset: 0; }
        .ts-img {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          will-change: transform, opacity;
        }
        .ts-video { pointer-events: none; }
        .ts-scrim {
          position: absolute; inset: 0; z-index: 3; pointer-events: none;
          background:
            linear-gradient(to bottom, rgba(22,21,15,0) 64%, rgba(22,21,15,0.28) 100%);
        }
        .ts-caption {
          position: absolute;
          left: 50%; bottom: 52px;
          transform: translateX(-50%);
          z-index: 4;
          display: inline-flex; align-items: center; gap: 10px;
          font-family: var(--f-display), Georgia, serif;
          font-size: clamp(15px, 2.3vw, 20px);
          color: var(--ink);
          padding: 8px 18px;
          border-radius: 999px;
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(8px);
          border: 1px solid var(--line);
          white-space: nowrap;
          box-shadow: 0 10px 30px -16px rgba(22,21,15,0.5);
        }
        .ts-num { font-size: 0.72em; font-weight: 700; color: var(--brass); letter-spacing: 0.06em; }
        .ts-dots {
          position: absolute; left: 50%; bottom: 22px; transform: translateX(-50%);
          z-index: 4; display: flex; gap: 8px;
        }
        .ts-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: rgba(255,255,255,0.55);
          box-shadow: 0 1px 3px rgba(22,21,15,0.3);
          transition: background .4s ease, width .4s ease;
        }
        .ts-dot.done { background: var(--clay); }
        .ts-dot.on { width: 22px; border-radius: 999px; background: var(--brass); }
      `}</style>
    </div>
  );
}

/* ---------- approval badge on the photoreal stage ---------- */

function ApprovedBadge({ ar, reduced }: { ar: boolean; reduced: boolean }) {
  return (
    <motion.div
      className="ts-approved"
      initial={{ scale: 0.7, opacity: 0, y: 10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: reduced ? "tween" : "spring", stiffness: 200, damping: 16, delay: reduced ? 0 : 0.5 }}
      style={{
        position: "absolute", top: 16, insetInlineEnd: 16, zIndex: 4,
        display: "inline-flex", alignItems: "center", gap: 8,
        fontFamily: "var(--f-display), Georgia, serif", fontSize: "clamp(13px,1.5vw,16px)",
        color: "#fff", padding: "8px 16px", borderRadius: 999,
        background: "var(--ever)", border: "1px solid var(--brass-2)",
        boxShadow: "0 16px 40px -16px rgba(22,21,15,0.6)",
      }}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
        <path d="M5 12.5 L10 17.5 L19 7" stroke="var(--brass-2)" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {ar ? "تمت الموافقة" : "Approved"}
    </motion.div>
  );
}
