"use client";

import { useRef } from "react";
import { useT } from "@/lib/i18n";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { RevealLines, RevealWords, Rise } from "@/components/motion";

const EASE = [0.22, 1, 0.36, 1] as const;
const SPRING = { stiffness: 80, damping: 30, mass: 0.5 };
const TILT = { stiffness: 120, damping: 18, mass: 0.4 };

export default function Manifesto() {
  const { t, lang } = useT();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  // ----- scroll-driven depth -----
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgScale = useSpring(useTransform(scrollYProgress, [0, 1], [1.3, 1.06]), SPRING);
  const imgY = useSpring(useTransform(scrollYProgress, [0, 1], ["-9%", "9%"]), SPRING);
  const textY = useSpring(useTransform(scrollYProgress, [0, 1], ["16%", "-14%"]), SPRING);
  const cardY = useSpring(useTransform(scrollYProgress, [0, 1], ["46%", "-46%"]), SPRING);
  const captionY = useSpring(useTransform(scrollYProgress, [0, 1], ["40%", "-40%"]), SPRING);

  // ----- cursor-reactive 3D tilt -----
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), TILT);
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), TILT);

  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => { mx.set(0); my.set(0); };

  return (
    <section ref={ref} className="mani" onPointerMove={onMove} onPointerLeave={reset}>
      {/* 3D STAGE — tilts toward the cursor; children sit on different depth planes */}
      <motion.div className="mani__stage" style={reduce ? undefined : { rotateX: rotX, rotateY: rotY }}>
        <div className="mani__plane mani__plane--bg">
          <motion.div className="mani__imgwrap" style={reduce ? undefined : { scale: imgScale, y: imgY }}>
            <img src="/evora/mani-bedroom.jpg" alt="" className="mani__img" />
          </motion.div>
        </div>

        <div className="mani__plane mani__plane--glow" />

        <div className="mani__plane mani__plane--card">
          <motion.a href="/shop" data-cursor="hover" className="mani__shop" style={reduce ? undefined : { y: cardY }}>
            <img src="/evora/p09.jpg" alt="" />
            <span className="mani__shop-scrim" />
            <span className="mani__shop-label">
              <span className="mani__shop-k">{lang === "en" ? "The Catalogue" : "الكتالوج"}</span>
              <span className="mani__shop-t">
                {lang === "en" ? "Shop the collection" : "تسوّق المجموعة"}
                <span className="mani__shop-arrow" aria-hidden>↗</span>
              </span>
            </span>
          </motion.a>
        </div>
      </motion.div>

      <div className="mani__scrim" />
      <div className="mani__grain" />

      {/* TEXT — flat, always crisp */}
      <div className="container mani__inner">
        <motion.div className="mani__content" style={reduce ? undefined : { y: textY }}>
          <div className="mani__kick">
            <motion.span
              className="mani__rule"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "0px 0px -12% 0px" }}
              transition={{ duration: 0.9, ease: EASE }}
            />
            <Rise as="span" className="eyebrow mani__eyebrow">{t("manifesto_eyebrow")}</Rise>
          </div>
          <RevealLines lines={leadLines(t("manifesto_lead"))} className="display mani__lead" />
          <Rise delay={0.15}>
            <p className="mani__body">{t("manifesto_body")}</p>
          </Rise>
        </motion.div>
      </div>

      <motion.span className="mani__caption" style={reduce ? undefined : { y: captionY }}>
        {lang === "en" ? "An Evora home · Amman" : "بيت من إيفورا · عمّان"}
      </motion.span>

      <style>{`
        .mani { position: relative; min-height: 112svh; display: flex; align-items: center; overflow: hidden; background: var(--ink); perspective: 1500px; }
        .mani__stage { position: absolute; inset: 0; z-index: 0; transform-style: preserve-3d; will-change: transform; }
        .mani__plane { position: absolute; inset: 0; transform-style: preserve-3d; }
        .mani__plane--bg { transform: translateZ(-110px) scale(1.12); }
        .mani__imgwrap { position: absolute; inset: -10%; will-change: transform; }
        .mani__img { width: 100%; height: 100%; object-fit: cover; }
        .mani__plane--glow { transform: translateZ(-40px); pointer-events: none; background:
            radial-gradient(50% 50% at 78% 36%, rgba(197,160,106,0.20), transparent 60%); }
        .mani__plane--card { transform: translateZ(95px); pointer-events: none; }

        .mani__shop { display: block; position: absolute; bottom: 16%; inset-inline-end: clamp(2rem, 8vw, 9rem); width: clamp(190px, 17vw, 250px); aspect-ratio: 4/5; border-radius: 10px; overflow: hidden; pointer-events: auto; cursor: none; box-shadow: 0 44px 86px -30px rgba(0,0,0,0.75); }
        .mani__shop img { width: 100%; height: 100%; object-fit: cover; transition: transform 1.1s var(--ease); }
        .mani__shop:hover img { transform: scale(1.07); }
        .mani__shop-scrim { position: absolute; inset: 0; background: linear-gradient(180deg, transparent 35%, rgba(16,15,13,0.78) 100%); }
        .mani__shop-label { position: absolute; inset-inline: 0; bottom: 0; display: flex; flex-direction: column; gap: 4px; padding: 1rem 1.05rem 1.05rem; }
        .mani__shop-k { font-size: 0.56rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--brass-2); font-weight: 600; }
        .mani__shop-t { display: inline-flex; align-items: center; gap: 0.45rem; font-family: var(--font-display); font-size: 1.15rem; color: var(--paper); line-height: 1.12; }
        .mani__shop-arrow { transition: transform .4s var(--ease); }
        .mani__shop:hover .mani__shop-arrow { transform: translate(3px, -3px); }
        html[dir="rtl"] .mani__shop-arrow { transform: scaleX(-1); }
        html[dir="rtl"] .mani__shop:hover .mani__shop-arrow { transform: translate(-3px, -3px) scaleX(-1); }

        .mani__scrim { position: absolute; inset: 0; z-index: 1; pointer-events: none; background:
            linear-gradient(100deg, rgba(16,15,13,0.94) 0%, rgba(20,22,17,0.76) 32%, rgba(20,22,17,0.30) 62%, rgba(20,22,17,0.06) 100%),
            radial-gradient(130% 95% at 50% 122%, rgba(12,12,10,0.6), transparent 60%); }
        .mani__grain { position: absolute; inset: 0; z-index: 1; pointer-events: none; opacity: 0.5; mix-blend-mode: overlay;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); background-size: 180px; }

        .mani__inner { position: relative; z-index: 2; width: 100%; }
        .mani__content { max-width: 820px; }
        .mani__kick { display: flex; align-items: center; gap: 1rem; }
        .mani__rule { display: block; width: 64px; height: 1px; background: var(--brass-2); transform-origin: left; flex-shrink: 0; }
        html[dir="rtl"] .mani__rule { transform-origin: right; }
        .mani__eyebrow { color: var(--brass-2); display: block; }
        .mani__lead { color: var(--paper); font-size: clamp(2rem, 4.6vw, 4rem); line-height: 1.08; font-weight: 360; margin: 1.5rem 0 0; text-shadow: 0 2px 36px rgba(16,15,13,0.45); }
        .mani__body { color: rgba(251,247,240,0.84); font-size: clamp(1rem, 1.2vw, 1.14rem); line-height: 1.7; max-width: 46ch; margin: 2.1rem 0 0; }

        .mani__caption { position: absolute; z-index: 2; bottom: 2rem; inset-inline-start: clamp(1.25rem, 5vw, 6rem); font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(251,247,240,0.66); }

        @media (max-width: 860px) {
          .mani { min-height: 100svh; }
          .mani__scrim { background: linear-gradient(0deg, rgba(16,15,13,0.92) 0%, rgba(20,22,17,0.55) 52%, rgba(20,22,17,0.32) 100%); }
          .mani__card { bottom: auto; top: 12%; width: 140px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .mani__plane--bg { transform: none; } .mani__imgwrap { inset: 0; }
        }
      `}</style>
    </section>
  );
}

// split the lead into balanced display lines for the masked line-reveal
function leadLines(text: string): string[] {
  const words = text.split(" ");
  const target = Math.ceil(words.length / 3);
  const lines: string[] = [];
  for (let i = 0; i < words.length; i += target) {
    lines.push(words.slice(i, i + target).join(" "));
  }
  return lines;
}
