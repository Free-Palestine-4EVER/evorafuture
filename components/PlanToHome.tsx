"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useT } from "@/lib/i18n";

type Caption = { en: string; ar: string };

const CAPTIONS: Caption[] = [
  { en: "Your plans", ar: "مخططاتك" },
  { en: "Furnished in 2D", ar: "مفروشة ثنائية الأبعاد" },
  { en: "Built in 3D", ar: "مبنية ثلاثية الأبعاد" },
  { en: "Photoreal render", ar: "تصوير واقعي" },
  { en: "Approved", ar: "تمت الموافقة" },
];

const PHASE_MS = 2400;
const RENDER_SRC = "/evora/configurator/base.webp";

/* ------------------------------------------------------------------ */

export default function PlanToHome({ className }: { className?: string }) {
  const { lang } = useT();
  const ar = lang === "ar";
  const reduced = useReducedMotion();

  const [phase, setPhase] = useState(reduced ? 4 : 0);

  useEffect(() => {
    if (reduced) {
      setPhase(4);
      return;
    }
    const id = setInterval(() => {
      setPhase((p) => (p + 1) % CAPTIONS.length);
    }, PHASE_MS);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <div className={className} dir={ar ? "rtl" : "ltr"}>
      <style>{`
        .pth-stage {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3;
          border-radius: 16px;
          overflow: hidden;
          background: #f3f0ea;
          border: 1px solid var(--line);
          box-shadow: 0 40px 90px -45px rgba(22,21,15,0.5);
        }
        .pth-layer {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pth-svg { width: 72%; height: 72%; overflow: visible; }
        .pth-caption {
          position: absolute;
          left: 50%;
          bottom: 56px;
          transform: translateX(-50%);
          font-family: var(--f-display), Georgia, serif;
          font-size: clamp(15px, 2.4vw, 20px);
          letter-spacing: 0.01em;
          color: var(--ink);
          padding: 7px 18px;
          border-radius: 999px;
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(6px);
          border: 1px solid var(--line);
          white-space: nowrap;
        }
        .pth-dots {
          position: absolute;
          left: 50%;
          bottom: 22px;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
        }
        .pth-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: rgba(22,21,15,0.18);
          transition: background 0.4s ease, transform 0.4s ease, width 0.4s ease;
        }
        .pth-dot.on {
          width: 20px;
          border-radius: 999px;
          background: var(--brass);
        }
        .pth-paper {
          fill: #fbf9f4;
          stroke: var(--line);
          stroke-width: 1.2;
        }
        .pth-sketch {
          fill: none;
          stroke: var(--ink);
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
          opacity: 0.78;
        }
        .pth-render {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .pth-sweep {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 30%;
          background: linear-gradient(100deg,
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,0.55) 50%,
            rgba(255,255,255,0) 100%);
          mix-blend-mode: screen;
          pointer-events: none;
        }
        .pth-stamp {
          position: absolute;
          top: 26px;
          inset-inline-end: 26px;
          width: 84px;
          height: 84px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          background: var(--ever);
          border: 3px solid var(--brass-2);
          box-shadow: 0 10px 30px -8px rgba(22,21,15,0.5);
        }
        .pth-pill {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          font-family: var(--f-display), Georgia, serif;
          font-size: clamp(20px, 4vw, 34px);
          color: #fff;
          padding: 12px 30px;
          border-radius: 999px;
          background: var(--ever);
          border: 1px solid var(--brass-2);
          box-shadow: 0 20px 50px -18px rgba(22,21,15,0.6);
          display: flex;
          align-items: center;
          gap: 12px;
          white-space: nowrap;
        }
      `}</style>

      <div className="pth-stage" aria-label={ar ? CAPTIONS[phase].ar : CAPTIONS[phase].en}>
        <AnimatePresence mode="wait">
          {phase === 0 && <PaperPlans key="p0" reduced={!!reduced} />}
          {phase === 1 && <StyledPlan key="p1" reduced={!!reduced} />}
          {phase === 2 && <Iso3D key="p2" reduced={!!reduced} />}
          {phase === 3 && <Render key="p3" reduced={!!reduced} sweep />}
          {phase === 4 && <Approved key="p4" reduced={!!reduced} ar={ar} />}
        </AnimatePresence>

        {/* caption */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`cap-${phase}`}
            className="pth-caption"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
          >
            {ar ? CAPTIONS[phase].ar : CAPTIONS[phase].en}
          </motion.div>
        </AnimatePresence>

        {/* dots */}
        <div className="pth-dots" role="tablist" aria-hidden>
          {CAPTIONS.map((_, i) => (
            <span key={i} className={`pth-dot${i === phase ? " on" : ""}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================ PHASES ============================== */

const fadeWrap = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.55 },
};

/* PHASE 1 — three fanned paper plans */
function PaperPlans({ reduced }: { reduced: boolean }) {
  const sheets = [
    { rot: -8, x: -26, y: 10, delay: 0 },
    { rot: 4, x: 4, y: -4, delay: 0.08 },
    { rot: 11, x: 30, y: 14, delay: 0.16 },
  ];
  return (
    <motion.div className="pth-layer" {...fadeWrap}>
      {sheets.map((s, i) => (
        <motion.div
          key={i}
          style={{ position: "absolute", width: "52%", height: "66%" }}
          initial={{ opacity: 0, rotate: s.rot, x: s.x, y: s.y + 18 }}
          animate={
            reduced
              ? { opacity: 1, rotate: s.rot, x: s.x, y: s.y }
              : {
                  opacity: 1,
                  rotate: s.rot,
                  x: s.x,
                  y: [s.y, s.y - 6, s.y],
                }
          }
          transition={{
            opacity: { duration: 0.5, delay: s.delay },
            rotate: { duration: 0.5, delay: s.delay },
            y: reduced
              ? { duration: 0.5, delay: s.delay }
              : { duration: 4, repeat: Infinity, ease: "easeInOut", delay: s.delay },
          }}
        >
          <svg viewBox="0 0 200 260" className="pth-svg" style={{ width: "100%", height: "100%" }}>
            <rect className="pth-paper" x="6" y="6" width="188" height="248" rx="4" />
            <g className="pth-sketch" transform={`rotate(${i - 1} 100 130)`}>
              <path d="M28 40 L172 38 L174 150 L120 152 L118 220 L30 222 Z" />
              <path d="M28 110 L120 112" />
              <path d="M118 152 L172 150" />
              <path d="M70 38 L72 110" />
              <path d="M150 200 L150 222" />
              <path d="M40 222 L40 210 L64 210" />
            </g>
          </svg>
        </motion.div>
      ))}
    </motion.div>
  );
}

/* PHASE 2 — single styled 2D plan with furniture drawing in */
function StyledPlan({ reduced }: { reduced: boolean }) {
  const draw = (delay: number) => ({
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1 },
    transition: { duration: reduced ? 0 : 0.7, delay: reduced ? 0 : delay, ease: "easeInOut" as const },
  });
  const pop = (delay: number) => ({
    initial: { scale: 0.6, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: reduced ? 0 : 0.45, delay: reduced ? 0 : delay, ease: [0.2, 0.8, 0.2, 1] as const },
  });
  return (
    <motion.div className="pth-layer" {...fadeWrap}>
      <svg viewBox="0 0 320 240" className="pth-svg">
        {/* walls */}
        <motion.rect
          x="20" y="20" width="280" height="200" rx="6"
          fill="#fbf9f4" stroke="var(--ink)" strokeWidth={3}
          {...draw(0)}
        />
        <motion.line x1="190" y1="20" x2="190" y2="140" stroke="var(--ink)" strokeWidth={3} {...draw(0.25)} />
        <motion.line x1="190" y1="140" x2="300" y2="140" stroke="var(--ink)" strokeWidth={3} {...draw(0.35)} />
        {/* rug */}
        <motion.rect x="44" y="120" width="120" height="80" rx="6" fill="var(--clay)" opacity={0.18} stroke="var(--clay)" strokeWidth={1.5} {...pop(0.5)} />
        {/* sofa */}
        <motion.g {...pop(0.6)}>
          <rect x="48" y="150" width="100" height="34" rx="8" fill="var(--ever)" opacity={0.85} />
          <rect x="48" y="138" width="100" height="16" rx="6" fill="var(--ever)" />
        </motion.g>
        {/* coffee table */}
        <motion.rect x="78" y="124" width="44" height="22" rx="5" fill="var(--brass)" {...pop(0.72)} />
        {/* bed */}
        <motion.g {...pop(0.66)}>
          <rect x="210" y="40" width="76" height="86" rx="6" fill="var(--bone)" stroke="var(--ink)" strokeWidth={1.4} />
          <rect x="210" y="40" width="76" height="22" rx="6" fill="var(--brass-2)" opacity={0.6} />
          <rect x="222" y="48" width="24" height="14" rx="3" fill="#fff" stroke="var(--ink)" strokeWidth={0.8} />
          <rect x="250" y="48" width="24" height="14" rx="3" fill="#fff" stroke="var(--ink)" strokeWidth={0.8} />
        </motion.g>
        {/* dining table */}
        <motion.g {...pop(0.78)}>
          <ellipse cx="60" cy="62" rx="26" ry="20" fill="var(--brass)" opacity={0.9} />
          <circle cx="36" cy="62" r="6" fill="var(--ink)" opacity={0.5} />
          <circle cx="84" cy="62" r="6" fill="var(--ink)" opacity={0.5} />
          <circle cx="60" cy="40" r="6" fill="var(--ink)" opacity={0.5} />
          <circle cx="60" cy="84" r="6" fill="var(--ink)" opacity={0.5} />
        </motion.g>
        {/* plants */}
        <motion.g {...pop(0.86)}>
          <circle cx="282" cy="200" r="13" fill="var(--ever-soft)" />
          <rect x="277" y="200" width="10" height="10" fill="var(--clay)" opacity={0.7} />
        </motion.g>
        <motion.g {...pop(0.92)}>
          <circle cx="150" cy="40" r="11" fill="var(--ever-soft)" />
          <rect x="146" y="40" width="8" height="8" fill="var(--clay)" opacity={0.7} />
        </motion.g>
      </svg>
    </motion.div>
  );
}

/* PHASE 3 — flat plan tilts into isometric room, walls extrude */
function Iso3D({ reduced }: { reduced: boolean }) {
  return (
    <motion.div
      className="pth-layer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55 }}
      style={{ perspective: 900 }}
    >
      <motion.div
        style={{ width: "70%", height: "70%", transformStyle: "preserve-3d" }}
        initial={{ rotateX: 0, rotateZ: 0, scale: 0.92 }}
        animate={
          reduced
            ? { rotateX: 56, rotateZ: -38, scale: 1 }
            : { rotateX: 56, rotateZ: [-42, -34, -42], scale: 1 }
        }
        transition={{
          rotateX: { duration: 0.9, ease: "easeInOut" },
          scale: { duration: 0.9, ease: "easeInOut" },
          rotateZ: reduced
            ? { duration: 0.9 }
            : { duration: 7, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <svg viewBox="0 0 320 240" className="pth-svg" style={{ width: "100%", height: "100%", overflow: "visible" }}>
          {/* floor */}
          <rect x="20" y="20" width="280" height="200" rx="6" fill="#efe9dd" stroke="var(--ink)" strokeWidth={2} />
          {/* furniture footprints */}
          <rect x="48" y="150" width="100" height="46" rx="8" fill="var(--ever)" opacity={0.85} />
          <rect x="210" y="40" width="76" height="86" rx="6" fill="var(--bone)" stroke="var(--ink)" strokeWidth={1.2} />
          <rect x="44" y="120" width="120" height="80" rx="6" fill="var(--clay)" opacity={0.16} />
          {/* extruding walls (animated height via scaleY) */}
          <motion.rect
            x="20" y="20" width="280" height="14" fill="var(--brass)" opacity={0.55}
            style={{ transformOrigin: "20px 20px" }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: reduced ? 0 : 0.8, delay: reduced ? 0 : 0.4, ease: "easeOut" }}
          />
          <motion.rect
            x="20" y="20" width="14" height="200" fill="var(--brass-2)" opacity={0.5}
            style={{ transformOrigin: "20px 20px" }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: reduced ? 0 : 0.8, delay: reduced ? 0 : 0.5, ease: "easeOut" }}
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}

/* PHASE 4 & shared — photoreal render with optional sweep */
function Render({ reduced, sweep }: { reduced: boolean; sweep?: boolean }) {
  return (
    <motion.div
      className="pth-layer"
      initial={{ opacity: 0, scale: 1.04 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="pth-render" src={RENDER_SRC} alt="Photoreal render" />
      {sweep && !reduced && (
        <motion.div
          className="pth-sweep"
          initial={{ left: "-30%", skewX: -12 }}
          animate={{ left: "100%", skewX: -12 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.4 }}
        />
      )}
    </motion.div>
  );
}

/* PHASE 5 — approved render + stamp + pill */
function Approved({ reduced, ar }: { reduced: boolean; ar: boolean }) {
  return (
    <motion.div
      className="pth-layer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55 }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="pth-render" src={RENDER_SRC} alt="Approved render" />
      <div style={{ position: "absolute", inset: 0, background: "rgba(22,21,15,0.18)" }} />

      <motion.div
        className="pth-stamp"
        initial={{ scale: 0, rotate: -30, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{
          type: reduced ? "tween" : "spring",
          stiffness: 220,
          damping: 14,
          duration: reduced ? 0 : undefined,
          delay: reduced ? 0 : 0.25,
        }}
      >
        <svg viewBox="0 0 24 24" width="38" height="38" fill="none">
          <motion.path
            d="M5 12.5 L10 17.5 L19 7"
            stroke="#fff"
            strokeWidth={2.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 0.55 }}
          />
        </svg>
      </motion.div>

      <motion.div
        className="pth-pill"
        initial={{ scale: 0.7, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{
          type: reduced ? "tween" : "spring",
          stiffness: 200,
          damping: 16,
          duration: reduced ? 0 : undefined,
          delay: reduced ? 0 : 0.4,
        }}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
          <path d="M5 12.5 L10 17.5 L19 7" stroke="var(--brass-2)" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {ar ? "تمت الموافقة" : "Approved"}
      </motion.div>
    </motion.div>
  );
}
