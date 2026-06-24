"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

/* ------------------------------------------------------------------ *
 * TransformStage — the "flat plan → finished home" film, in 4 parts.
 *
 * Unlike the old looping PlanToHome, this stage is *driven by scroll*:
 * the parent passes `step` (0–3) from the swap-column scroll mechanic in
 * ProcessJourney, and the single floor-plan morphs forward part-by-part:
 *
 *   0  Blueprint      – empty plan draws itself on, technical / dimensioned
 *   1  Furnished 2D   – the same plan fills with furniture
 *   2  Built in 3D    – the plan tilts to isometric, walls extrude
 *   3  Photoreal      – crossfade to a real render + approval stamp
 *
 * One persistent SVG carries 0→2 so walls + furniture are continuous; the
 * photoreal image crossfades over the top at part 3. Bilingual captions.
 * ------------------------------------------------------------------ */

const RENDER_SRC = "/evora/configurator/base.webp";

const CAPTIONS = [
  { en: "Your blueprint", ar: "مخططك" },
  { en: "Furnished in 2D", ar: "مفروش ثنائي الأبعاد" },
  { en: "Built in 3D", ar: "مبني ثلاثي الأبعاد" },
  { en: "Photoreal — approved", ar: "واقعي — معتمد" },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

export default function TransformStage({ step, ar }: { step: number; ar: boolean }) {
  const reduced = useReducedMotion();
  const s = Math.max(0, Math.min(3, step));
  const is3D = s >= 2;
  const render = s >= 3;
  const furnished = s >= 1;

  // Idle sway only while the iso view is on-screen (parts 3) — subtle life.
  const isoZ = reduced ? -34 : ([-40, -32, -40] as number[]);

  return (
    <div className="ts-stage" aria-label={ar ? CAPTIONS[s].ar : CAPTIONS[s].en}>
      {/* ---- the morphing plan (parts 0–2) ---- */}
      <div className="ts-persp">
        <motion.div
          className="ts-tilt"
          initial={false}
          animate={
            is3D
              ? { rotateX: 54, rotateZ: isoZ, scale: 0.92, y: "2%" }
              : { rotateX: 0, rotateZ: 0, scale: 1, y: "0%" }
          }
          transition={{
            rotateX: { duration: reduced ? 0 : 1, ease: EASE },
            scale: { duration: reduced ? 0 : 1, ease: EASE },
            y: { duration: reduced ? 0 : 1, ease: EASE },
            rotateZ: reduced
              ? { duration: 0.9 }
              : { duration: 9, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <svg viewBox="0 0 400 300" className="ts-svg" style={{ overflow: "visible" }}>
            <defs>
              <pattern id="ts-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M20 0 L0 0 0 20" fill="none" stroke="var(--line)" strokeWidth="0.6" opacity="0.6" />
              </pattern>
            </defs>

            {/* paper + faint blueprint grid (fades as we leave the blueprint) */}
            <rect x="0" y="0" width="400" height="300" fill="#f7f4ee" />
            <motion.rect
              x="24" y="24" width="352" height="252"
              fill="url(#ts-grid)"
              initial={false}
              animate={{ opacity: furnished ? 0.25 : 1 }}
              transition={{ duration: 0.6 }}
            />

            {/* floor fill appears once furnished (warmer, "real" floor) */}
            <motion.rect
              x="24" y="24" width="352" height="252" rx="4"
              fill="#efe7d8"
              initial={false}
              animate={{ opacity: furnished ? 1 : 0 }}
              transition={{ duration: 0.6 }}
            />

            {/* ---- WALLS: draw on at part 0 ---- */}
            <g
              stroke="var(--ink)"
              strokeWidth={is3D ? 2 : 3}
              fill="none"
              strokeLinejoin="round"
              strokeLinecap="round"
            >
              <DrawRect x={24} y={24} w={352} h={252} on reduced={!!reduced} />
              <DrawLine x1={220} y1={24} x2={220} y2={160} on reduced={!!reduced} delay={0.25} />
              <DrawLine x1={220} y1={160} x2={376} y2={160} on reduced={!!reduced} delay={0.35} />
              <DrawLine x1={150} y1={160} x2={150} y2={276} on reduced={!!reduced} delay={0.4} />
              <DrawLine x1={24} y1={160} x2={150} y2={160} on reduced={!!reduced} delay={0.45} />
            </g>
            {/* door gaps */}
            <g stroke="#f7f4ee" strokeWidth="6">
              <line x1="220" y1="96" x2="220" y2="124" />
              <line x1="150" y1="200" x2="150" y2="228" />
            </g>

            {/* ---- DIMENSION LINES (blueprint only) ---- */}
            <motion.g
              stroke="var(--brass)" strokeWidth="1.2"
              initial={false}
              animate={{ opacity: furnished ? 0 : 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <line x1="24" y1="14" x2="376" y2="14" />
              <line x1="24" y1="9" x2="24" y2="19" />
              <line x1="376" y1="9" x2="376" y2="19" />
              <line x1="388" y1="24" x2="388" y2="276" />
              <line x1="383" y1="24" x2="393" y2="24" />
              <line x1="383" y1="276" x2="393" y2="276" />
            </motion.g>

            {/* ---- FURNITURE: pops in at part 1, gains 3D shadow at part 2 ---- */}
            <Furniture furnished={furnished} is3D={is3D} reduced={!!reduced} />

            {/* ---- EXTRUDED WALL CAPS (part 2) ---- */}
            <motion.rect
              x="24" y="24" width="352" height="12" fill="var(--brass)" opacity={0.5}
              style={{ transformBox: "fill-box", transformOrigin: "center top" }}
              initial={false}
              animate={{ scaleY: is3D ? 1 : 0 }}
              transition={{ duration: reduced ? 0 : 0.7, delay: is3D ? 0.35 : 0, ease: "easeOut" }}
            />
            <motion.rect
              x="24" y="24" width="12" height="252" fill="var(--brass-2)" opacity={0.45}
              style={{ transformBox: "fill-box", transformOrigin: "left center" }}
              initial={false}
              animate={{ scaleX: is3D ? 1 : 0 }}
              transition={{ duration: reduced ? 0 : 0.7, delay: is3D ? 0.45 : 0, ease: "easeOut" }}
            />
          </svg>
        </motion.div>
      </div>

      {/* ---- 360° badge while in 3D (not yet rendered) ---- */}
      <AnimatePresence>
        {is3D && !render && (
          <motion.span
            className="ts-badge"
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <span className="ts-badge-rot">⟲</span> 360°
          </motion.span>
        )}
      </AnimatePresence>

      {/* ---- PHOTOREAL render crossfades over the top (part 3) ---- */}
      <AnimatePresence>
        {render && (
          <motion.div
            className="ts-render"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={RENDER_SRC} alt={ar ? "عرض واقعي" : "Photoreal render"} />
            {!reduced && (
              <motion.div
                className="ts-sweep"
                initial={{ left: "-35%" }}
                animate={{ left: "100%" }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.6 }}
              />
            )}
            <ApprovedStamp ar={ar} reduced={!!reduced} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---- caption + progress dots ---- */}
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
          {ar ? CAPTIONS[s].ar : CAPTIONS[s].en}
        </motion.div>
      </AnimatePresence>

      <div className="ts-dots" aria-hidden>
        {CAPTIONS.map((_, i) => (
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
        .ts-persp {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 1100px;
        }
        .ts-tilt {
          width: 82%;
          height: 82%;
          transform-style: preserve-3d;
          will-change: transform;
        }
        .ts-svg { width: 100%; height: 100%; }
        .ts-render {
          position: absolute;
          inset: 0;
        }
        .ts-render img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .ts-sweep {
          position: absolute;
          top: -10%; bottom: -10%;
          width: 32%;
          transform: skewX(-12deg);
          background: linear-gradient(100deg,
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,0.5) 50%,
            rgba(255,255,255,0) 100%);
          mix-blend-mode: screen;
          pointer-events: none;
        }
        .ts-badge {
          position: absolute;
          top: 16px; inset-inline-end: 16px;
          z-index: 3;
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 0.72rem; font-weight: 600; letter-spacing: 0.04em;
          color: #fff;
          background: rgba(22,21,15,0.7);
          padding: 0.4em 0.85em;
          border-radius: 999px;
          backdrop-filter: blur(4px);
        }
        .ts-badge-rot { display: inline-block; animation: ts-spin 4s linear infinite; }
        @keyframes ts-spin { to { transform: rotate(360deg); } }
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
          background: rgba(255,255,255,0.82);
          backdrop-filter: blur(8px);
          border: 1px solid var(--line);
          white-space: nowrap;
          box-shadow: 0 10px 30px -16px rgba(22,21,15,0.5);
        }
        .ts-num {
          font-size: 0.72em;
          font-weight: 700;
          color: var(--brass);
          letter-spacing: 0.06em;
        }
        .ts-dots {
          position: absolute;
          left: 50%; bottom: 22px;
          transform: translateX(-50%);
          z-index: 4;
          display: flex; gap: 8px;
        }
        .ts-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: rgba(22,21,15,0.18);
          transition: background .4s ease, width .4s ease;
        }
        .ts-dot.done { background: var(--clay); }
        .ts-dot.on { width: 22px; border-radius: 999px; background: var(--brass); }

        @media (prefers-reduced-motion: reduce) {
          .ts-badge-rot, .ts-sweep { animation: none; }
        }
      `}</style>
    </div>
  );
}

/* ---------------- draw-on primitives ---------------- */

function DrawRect({ x, y, w, h, reduced }: { x: number; y: number; w: number; h: number; on?: boolean; reduced: boolean }) {
  return (
    <motion.rect
      x={x} y={y} width={w} height={h} rx={4}
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: reduced ? 0 : 1.1, ease: "easeInOut" }}
    />
  );
}

function DrawLine({ x1, y1, x2, y2, reduced, delay = 0 }: { x1: number; y1: number; x2: number; y2: number; on?: boolean; reduced: boolean; delay?: number }) {
  return (
    <motion.line
      x1={x1} y1={y1} x2={x2} y2={y2}
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : delay, ease: "easeInOut" }}
    />
  );
}

/* ---------------- furniture ---------------- */

function Furniture({ furnished, is3D, reduced }: { furnished: boolean; is3D: boolean; reduced: boolean }) {
  // Each piece scales up from its centre when the plan gets furnished.
  const pop = (i: number) => ({
    initial: false as const,
    animate: { scale: furnished ? 1 : 0, opacity: furnished ? 1 : 0 },
    transition: {
      duration: reduced ? 0 : 0.5,
      delay: reduced ? 0 : (furnished ? 0.1 + i * 0.07 : 0),
      ease: [0.2, 0.8, 0.2, 1] as const,
    },
    style: { transformBox: "fill-box" as const, transformOrigin: "center" as const },
  });

  // A soft raised shadow that only shows in 3D to lift furniture off the floor.
  const lift = { opacity: is3D ? 0.22 : 0, transition: { duration: 0.5 } };

  return (
    <g>
      {/* lift shadows (behind) */}
      <motion.g fill="rgba(22,21,15,1)" initial={false} animate={lift} style={{ filter: "blur(2px)" }}>
        <rect x="54" y="180" width="120" height="34" rx="8" />
        <rect x="252" y="50" width="100" height="86" rx="6" />
        <ellipse cx="300" cy="222" rx="40" ry="26" />
      </motion.g>

      {/* RUG (living) */}
      <motion.rect {...pop(0)} x="44" y="150" width="150" height="104" rx="8" fill="var(--clay)" opacity={0.16} stroke="var(--clay)" strokeWidth={1.2} />

      {/* SOFA + back (living) */}
      <motion.g {...pop(1)}>
        <rect x="52" y="176" width="120" height="34" rx="9" fill="var(--ever)" />
        <rect x="52" y="164" width="120" height="16" rx="6" fill="var(--ever)" opacity={0.82} />
      </motion.g>

      {/* COFFEE TABLE (living) */}
      <motion.rect {...pop(2)} x="86" y="148" width="52" height="22" rx="5" fill="var(--brass)" />

      {/* TV CONSOLE (living, top) */}
      <motion.rect {...pop(3)} x="48" y="40" width="120" height="14" rx="4" fill="var(--ink)" opacity={0.55} />

      {/* BED + headboard + pillows (bedroom, top-right) */}
      <motion.g {...pop(4)}>
        <rect x="252" y="50" width="100" height="86" rx="6" fill="var(--bone)" stroke="var(--ink)" strokeWidth={1.2} />
        <rect x="252" y="50" width="100" height="20" rx="6" fill="var(--brass-2)" opacity={0.6} />
        <rect x="264" y="58" width="32" height="16" rx="3" fill="#fff" stroke="var(--ink)" strokeWidth={0.7} />
        <rect x="308" y="58" width="32" height="16" rx="3" fill="#fff" stroke="var(--ink)" strokeWidth={0.7} />
      </motion.g>

      {/* DINING table + chairs (bottom-right) */}
      <motion.g {...pop(5)}>
        <ellipse cx="300" cy="222" rx="40" ry="26" fill="var(--brass)" opacity={0.92} />
        <circle cx="262" cy="222" r="8" fill="var(--ink)" opacity={0.5} />
        <circle cx="338" cy="222" r="8" fill="var(--ink)" opacity={0.5} />
        <circle cx="300" cy="190" r="8" fill="var(--ink)" opacity={0.5} />
        <circle cx="300" cy="254" r="8" fill="var(--ink)" opacity={0.5} />
      </motion.g>

      {/* PLANT (entry, bottom-left) */}
      <motion.g {...pop(6)}>
        <circle cx="86" cy="220" r="15" fill="var(--ever-soft)" />
        <rect x="79" y="220" width="14" height="12" rx="2" fill="var(--clay)" opacity={0.75} />
      </motion.g>
    </g>
  );
}

/* ---------------- approval stamp + pill ---------------- */

function ApprovedStamp({ ar, reduced }: { ar: boolean; reduced: boolean }) {
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "rgba(22,21,15,0.14)" }} />
      <motion.div
        style={{
          position: "absolute", top: 22, insetInlineEnd: 22, width: 78, height: 78,
          borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", background: "var(--ever)", border: "3px solid var(--brass-2)",
          boxShadow: "0 12px 32px -8px rgba(22,21,15,0.55)", zIndex: 3,
        }}
        initial={{ scale: 0, rotate: -30, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: reduced ? "tween" : "spring", stiffness: 220, damping: 14, delay: reduced ? 0 : 0.25, duration: reduced ? 0 : undefined }}
      >
        <svg viewBox="0 0 24 24" width="36" height="36" fill="none">
          <motion.path d="M5 12.5 L10 17.5 L19 7" stroke="#fff" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 0.5 }} />
        </svg>
      </motion.div>

      <motion.div
        style={{
          position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)",
          fontFamily: "var(--f-display), Georgia, serif", fontSize: "clamp(18px,3.6vw,30px)",
          color: "#fff", padding: "11px 28px", borderRadius: 999, background: "var(--ever)",
          border: "1px solid var(--brass-2)", boxShadow: "0 22px 54px -20px rgba(22,21,15,0.6)",
          display: "flex", alignItems: "center", gap: 12, whiteSpace: "nowrap", zIndex: 3,
        }}
        initial={{ scale: 0.7, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: reduced ? "tween" : "spring", stiffness: 200, damping: 16, delay: reduced ? 0 : 0.4, duration: reduced ? 0 : undefined }}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
          <path d="M5 12.5 L10 17.5 L19 7" stroke="var(--brass-2)" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {ar ? "تمت الموافقة" : "Approved"}
      </motion.div>
    </>
  );
}
