"use client";

import { useT } from "@/lib/i18n";
import { testimonials, stats } from "@/lib/data";
import {
  Rise,
  Stagger,
  StaggerItem,
  RevealLines,
  CountUp,
  motion,
} from "@/components/motion";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Proof() {
  const { t, lang } = useT();

  return (
    <section className="proof">
      {/* ───────── CINEMATIC IMAGE BAND ───────── */}
      <div className="proof__band">
        <div className="proof__media">
          <motion.img
            src="/evora/p08.jpg"
            alt=""
            className="proof__img"
            initial={{ scale: 1.12 }}
            whileInView={{ scale: 1.0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 2.0, ease: EASE }}
          />
          <div className="proof__scrim" />
          <div className="proof__grain" />
        </div>

        <div className="container proof__bandinner">
          <div className="proof__head">
            <div className="proof__kick">
              <motion.span
                className="proof__rule"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "0px 0px -12% 0px" }}
                transition={{ duration: 0.9, ease: EASE }}
              />
              <Rise as="span" className="eyebrow proof__eyebrow">
                {t("proof_eyebrow")}
              </Rise>
            </div>

            <RevealLines
              lines={[t("proof_title")]}
              className="display proof__title"
              delay={0.08}
            />

            <Rise delay={0.18}>
              <p className="serif-i proof__since">{t("proof_since")}</p>
            </Rise>
          </div>

          {/* big brass count-up stats */}
          <Stagger className="proof__stats" delay={0.25}>
            {stats.map((s) => (
              <StaggerItem key={s.label} className="proof__stat">
                <CountUp value={s.value} className="display proof__statnum" />
                <span className="proof__statlabel">{t(s.label)}</span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>

      {/* ───────── EDITORIAL TESTIMONIALS ───────── */}
      <div className="proof__quotes">
        <div className="container">
          <Stagger className="proof__qgrid" gap={0.14}>
            {testimonials.map((tm, i) => (
              <StaggerItem key={i} className="proof__qitem">
                <figure className="proof__quote">
                  <span className="proof__mark" aria-hidden>
                    &ldquo;
                  </span>
                  <blockquote className="display proof__qtext">
                    {tm.quote[lang]}
                  </blockquote>
                  <figcaption className="proof__qcap">
                    <span className="proof__qname">{tm.name}</span>
                    <span className="proof__qrole">{tm.role[lang]}</span>
                  </figcaption>
                </figure>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>

      <style>{`
        .proof { position: relative; background: var(--bone); }

        /* ── image band ── */
        .proof__band { position: relative; min-height: clamp(560px, 78svh, 860px); display: flex; align-items: flex-end; overflow: hidden; background: var(--ink); }
        .proof__media { position: absolute; inset: 0; z-index: 0; }
        .proof__img { width: 100%; height: 100%; object-fit: cover; will-change: transform; }
        .proof__scrim { position: absolute; inset: 0; pointer-events: none; background:
            linear-gradient(180deg, rgba(16,15,13,0.62) 0%, rgba(16,15,13,0.18) 30%, rgba(16,15,13,0.34) 62%, rgba(16,15,13,0.92) 100%),
            radial-gradient(120% 80% at 50% 120%, rgba(12,12,10,0.7), transparent 60%); }
        .proof__grain { position: absolute; inset: 0; pointer-events: none; opacity: 0.42; mix-blend-mode: overlay;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); background-size: 180px; }

        .proof__bandinner { position: relative; z-index: 2; width: 100%; padding-block: clamp(2.5rem, 6vw, 4.5rem); }
        .proof__head { max-width: 880px; }
        .proof__kick { display: flex; align-items: center; gap: 1rem; }
        .proof__rule { display: block; width: 64px; height: 1px; background: var(--brass-2); transform-origin: left; flex-shrink: 0; }
        html[dir="rtl"] .proof__rule { transform-origin: right; }
        .proof__eyebrow { color: var(--brass-2); display: block; }
        .proof__title { color: var(--paper); font-size: clamp(2.4rem, 5.4vw, 4.6rem); line-height: 1.06; font-weight: 360; margin: 1.4rem 0 0; text-shadow: 0 2px 36px rgba(16,15,13,0.5); }
        .proof__since { color: rgba(251,247,240,0.82); font-size: clamp(1.02rem, 1.4vw, 1.18rem); margin: 1.1rem 0 0; }

        /* ── stats overlay ── */
        .proof__stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: clamp(1.4rem, 3vw, 3rem); margin-top: clamp(2.6rem, 5vw, 4rem); }
        .proof__stat { display: flex; flex-direction: column; gap: 0.5rem; }
        html[dir="rtl"] .proof__stat { align-items: flex-start; }
        .proof__statnum { color: var(--brass-2); font-size: clamp(2.6rem, 5vw, 4.4rem); line-height: 0.95; font-weight: 400; letter-spacing: -0.01em; text-shadow: 0 2px 30px rgba(16,15,13,0.55); }
        .proof__statlabel { font-size: clamp(0.66rem, 0.9vw, 0.78rem); letter-spacing: 0.16em; text-transform: uppercase; color: rgba(251,247,240,0.74); font-weight: 500; }
        html[dir="rtl"] .proof__statlabel { letter-spacing: 0.06em; }

        /* ── editorial quotes ── */
        .proof__quotes { background: var(--bone); padding-block: clamp(3.6rem, 8vw, 7rem); }
        .proof__qgrid { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(2rem, 4vw, 3.6rem); }
        .proof__qitem { height: 100%; }
        .proof__quote { position: relative; margin: 0; padding-top: 2.6rem; height: 100%; display: flex; flex-direction: column; transition: transform 0.5s var(--ease); }
        .proof__quote:hover { transform: translateY(-3px); }
        .proof__mark { position: absolute; top: -0.55rem; inset-inline-start: -0.2rem; font-family: var(--font-display); font-size: 5.2rem; line-height: 1; color: var(--brass); opacity: 0.6; pointer-events: none; }
        html[dir="rtl"] .proof__mark { transform: scaleX(-1); }
        .proof__qtext { margin: 0; font-size: clamp(1.3rem, 1.7vw, 1.62rem); line-height: 1.4; font-weight: 360; color: var(--ink); flex: 1; }
        .proof__qcap { margin-top: 1.8rem; padding-top: 1.1rem; border-top: 1px solid var(--brass); border-top-color: color-mix(in srgb, var(--brass) 40%, transparent); display: flex; flex-direction: column; gap: 0.2rem; }
        .proof__qname { font-family: var(--font-display); font-size: 1.05rem; color: var(--ever); }
        .proof__qrole { font-size: 0.78rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-faint); }
        html[dir="rtl"] .proof__qrole { letter-spacing: 0.02em; }

        @media (max-width: 960px) {
          .proof__qgrid { grid-template-columns: 1fr; gap: 2.6rem; }
        }
        @media (max-width: 720px) {
          .proof__band { align-items: flex-end; }
          .proof__scrim { background:
              linear-gradient(180deg, rgba(16,15,13,0.5) 0%, rgba(16,15,13,0.2) 26%, rgba(16,15,13,0.55) 58%, rgba(16,15,13,0.96) 100%); }
          .proof__stats { grid-template-columns: 1fr 1fr; gap: 1.6rem 1.2rem; }
          .proof__statnum { font-size: clamp(2.2rem, 11vw, 3rem); }
        }
        @media (prefers-reduced-motion: reduce) {
          .proof__img { scale: 1 !important; }
        }
      `}</style>
    </section>
  );
}
