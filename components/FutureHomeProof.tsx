"use client";

import { useRef } from "react";
import { useT } from "@/lib/i18n";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import {
  RevealLines,
  Rise,
  Stagger,
  StaggerItem,
  CountUp,
} from "@/components/motion";
import { testimonials, stats } from "@/lib/data";

/* ── Your Future Home × Loved across Amman ──────────────────────────────────
 * One cinematic story instead of two stacked sections. It runs as a single
 * editorial arc:
 *   I.  MANIFESTO  — full-bleed cream-bouclé living room, scroll-parallaxed,
 *                    with the "we compose spaces" statement + a floating
 *                    shop-the-collection card.
 *   II. PROOF      — a translucent stats ribbon that overlaps the image, so the
 *                    numbers read as part of the same frame (2,400 homes, etc).
 *   III.VOICES     — real homeowner quotes on bone, beside a tall walnut detail,
 *                    each with a five-star row + brass initial avatar.
 * Bilingual + RTL via the existing i18n keys/data — no new strings. Replaces
 * Manifesto.tsx + Proof.tsx on the home page. */

const EASE = [0.22, 1, 0.36, 1] as const;
const SPRING = { stiffness: 80, damping: 30, mass: 0.5 };

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function FutureHomeProof() {
  const { t, lang } = useT();
  const ar = lang === "ar";
  const reduce = useReducedMotion();
  const bandRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: bandRef, offset: ["start end", "end start"] });
  const imgScale = useSpring(useTransform(scrollYProgress, [0, 1], [1.28, 1.06]), SPRING);
  const imgY = useSpring(useTransform(scrollYProgress, [0, 1], ["-8%", "10%"]), SPRING);
  const cardY = useSpring(useTransform(scrollYProgress, [0, 1], ["38%", "-30%"]), SPRING);
  const textY = useSpring(useTransform(scrollYProgress, [0, 1], ["12%", "-10%"]), SPRING);

  return (
    <section className="fh" dir={ar ? "rtl" : "ltr"}>
      {/* ───────── I · CINEMATIC MANIFESTO ───────── */}
      <div className="fh__band" ref={bandRef}>
        <div className="fh__media">
          <motion.img
            src="/evora/vid-sofa.jpg"
            alt=""
            className="fh__img"
            style={reduce ? undefined : { scale: imgScale, y: imgY }}
          />
          <div className="fh__scrim" />
          <div className="fh__grain" />
        </div>

        <div className="container fh__bandinner">
          <motion.div className="fh__content" style={reduce ? undefined : { y: textY }}>
            <div className="fh__kick">
              <motion.span
                className="fh__rule"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "0px 0px -12% 0px" }}
                transition={{ duration: 0.9, ease: EASE }}
              />
              <Rise as="span" className="eyebrow fh__eyebrow">{t("manifesto_eyebrow")}</Rise>
            </div>
            <RevealLines lines={leadLines(t("manifesto_lead"))} className="display fh__lead" />
            <Rise delay={0.15}>
              <p className="fh__body">{t("manifesto_body")}</p>
            </Rise>
          </motion.div>
        </div>

        {/* floating shop-the-collection card on a forward depth plane */}
        <motion.a href="/shop" className="fh__shop" style={reduce ? undefined : { y: cardY }}>
          <img src="/evora/p11.jpg" alt="" />
          <span className="fh__shop-scrim" />
          <span className="fh__shop-label">
            <span className="fh__shop-k">{ar ? "الكتالوج" : "The Catalogue"}</span>
            <span className="fh__shop-t">
              {ar ? "تسوّق المجموعة" : "Shop the collection"}
              <span className="fh__shop-arrow" aria-hidden>↗</span>
            </span>
          </span>
        </motion.a>

        <span className="fh__caption">{ar ? "بيت من إيفورا · عمّان" : "An Evora home · Amman"}</span>
      </div>

      {/* ───────── II · PROOF RIBBON (overlaps the image) ───────── */}
      <div className="fh__proof">
        <div className="container">
          <div className="fh__proofhead">
            <div className="fh__kick fh__kick--center">
              <motion.span className="fh__rule"
                initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "0px 0px -12% 0px" }}
                transition={{ duration: 0.9, ease: EASE }} />
              <Rise as="span" className="eyebrow fh__eyebrow">{t("proof_eyebrow")}</Rise>
              <motion.span className="fh__rule"
                initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "0px 0px -12% 0px" }}
                transition={{ duration: 0.9, ease: EASE }} />
            </div>
            <RevealLines lines={[t("proof_title")]} className="display fh__prooftitle" delay={0.06} />
            <Rise delay={0.16}>
              <p className="serif-i fh__since">{t("proof_since")}</p>
            </Rise>
          </div>

          <Stagger className="fh__stats" delay={0.2}>
            {stats.map((s) => (
              <StaggerItem key={s.label} className="fh__stat">
                <CountUp value={s.value} className="display fh__statnum" />
                <span className="fh__statlabel">{t(s.label)}</span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>

      {/* ───────── III · VOICES (editorial, on bone) ───────── */}
      <div className="fh__voices">
        <div className="container fh__voicesgrid">
          {/* tall walnut detail beside the quotes */}
          <Rise className="fh__voicesfig">
            <figure className="fh__figframe">
              <img src="/evora/p10.jpg" alt="" />
              <figcaption>{ar ? "صُمّم وسُلّم · عمّان" : "Designed & delivered · Amman"}</figcaption>
            </figure>
          </Rise>

          <div className="fh__voicescol">
            <Rise as="h3" className="display fh__voicestitle">
              {ar ? "بكلماتهم" : "In their words"}
            </Rise>
            <Stagger className="fh__qlist" gap={0.12} delay={0.05}>
              {testimonials.map((tm, i) => (
                <StaggerItem key={i} className="fh__qitem">
                  <figure className="fh__quote">
                    <div className="fh__stars" aria-label={ar ? "خمس نجوم" : "Five stars"}>
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star key={s} />
                      ))}
                    </div>
                    <blockquote className="fh__qtext">{tm.quote[lang]}</blockquote>
                    <figcaption className="fh__qcap">
                      <span className="fh__avatar" aria-hidden>{initials(tm.name)}</span>
                      <span className="fh__qmeta">
                        <span className="fh__qname">{tm.name}</span>
                        <span className="fh__qrole">{tm.role[lang]}</span>
                      </span>
                    </figcaption>
                  </figure>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </div>

      <style>{`
        .fh { position: relative; background: var(--bone); }

        /* ── I · band ── */
        .fh__band { position: relative; min-height: clamp(640px, 104svh, 980px); display: flex; align-items: center;
          overflow: hidden; background: var(--ink); }
        .fh__media { position: absolute; inset: 0; z-index: 0; }
        .fh__img { width: 100%; height: 100%; object-fit: cover; will-change: transform; }
        .fh__scrim { position: absolute; inset: 0; pointer-events: none; background:
          linear-gradient(100deg, rgba(16,15,13,0.92) 0%, rgba(20,22,17,0.7) 30%, rgba(20,22,17,0.26) 60%, rgba(20,22,17,0.05) 100%),
          linear-gradient(180deg, transparent 40%, rgba(14,14,11,0.55) 100%),
          radial-gradient(60% 50% at 80% 32%, rgba(197,160,106,0.16), transparent 60%); }
        .fh__grain { position: absolute; inset: 0; pointer-events: none; opacity: 0.45; mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); background-size: 180px; }

        .fh__bandinner { position: relative; z-index: 2; width: 100%; }
        .fh__content { max-width: 760px; }
        .fh__kick { display: flex; align-items: center; gap: 1rem; }
        .fh__kick--center { justify-content: center; }
        .fh__rule { display: block; width: 60px; height: 1px; background: var(--brass-2); transform-origin: left; flex-shrink: 0; }
        html[dir="rtl"] .fh__rule { transform-origin: right; }
        .fh__eyebrow { color: var(--brass-2); display: block; }
        .fh__lead { color: var(--paper); font-size: clamp(2rem, 4.6vw, 4rem); line-height: 1.08; font-weight: 360;
          margin: 1.5rem 0 0; text-shadow: 0 2px 36px rgba(16,15,13,0.5); }
        .fh__body { color: rgba(251,247,240,0.85); font-size: clamp(1rem, 1.2vw, 1.14rem); line-height: 1.7;
          max-width: 46ch; margin: 2rem 0 0; }

        .fh__shop { position: absolute; z-index: 3; bottom: clamp(8.5rem, 16vw, 11rem); inset-inline-end: clamp(2rem, 8vw, 9rem);
          width: clamp(180px, 16vw, 240px); aspect-ratio: 4/5; border-radius: 12px; overflow: hidden;
          box-shadow: 0 44px 90px -30px rgba(0,0,0,0.78); border: 1px solid rgba(251,247,240,0.1); }
        .fh__shop img { width: 100%; height: 100%; object-fit: cover; transition: transform 1.1s var(--ease); }
        .fh__shop:hover img { transform: scale(1.07); }
        .fh__shop-scrim { position: absolute; inset: 0; background: linear-gradient(180deg, transparent 35%, rgba(16,15,13,0.82) 100%); }
        .fh__shop-label { position: absolute; inset-inline: 0; bottom: 0; display: flex; flex-direction: column; gap: 4px; padding: 1rem 1.05rem 1.05rem; }
        .fh__shop-k { font-size: 0.56rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--brass-2); font-weight: 600; }
        .fh__shop-t { display: inline-flex; align-items: center; gap: 0.45rem; font-family: var(--font-display); font-size: 1.12rem; color: var(--paper); line-height: 1.12; }
        .fh__shop-arrow { transition: transform .4s var(--ease); }
        .fh__shop:hover .fh__shop-arrow { transform: translate(3px, -3px); }
        html[dir="rtl"] .fh__shop-arrow { transform: scaleX(-1); }
        html[dir="rtl"] .fh__shop:hover .fh__shop-arrow { transform: translate(-3px, -3px) scaleX(-1); }

        .fh__caption { position: absolute; z-index: 2; bottom: clamp(1.4rem, 4vw, 2.4rem); inset-inline-start: clamp(1.25rem, 5vw, 6rem);
          font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(251,247,240,0.66); }

        /* ── II · proof ribbon (overlaps band) ── */
        .fh__proof { position: relative; z-index: 4; margin-top: clamp(-6rem, -9vw, -9rem); padding-bottom: clamp(3rem, 6vw, 5rem); }
        .fh__proof .container { background: linear-gradient(180deg, rgba(22,21,16,0.96), rgba(22,21,16,0.99));
          border: 1px solid rgba(197,160,106,0.22); border-radius: 20px; padding: clamp(2.2rem, 5vw, 3.6rem) clamp(1.6rem, 4vw, 3.4rem);
          box-shadow: 0 60px 120px -50px rgba(0,0,0,0.7); backdrop-filter: blur(4px); }
        .fh__proofhead { text-align: center; max-width: 60ch; margin-inline: auto; }
        .fh__prooftitle { color: var(--paper); font-size: clamp(2rem, 4.4vw, 3.6rem); line-height: 1.06; font-weight: 360; margin: 1.2rem 0 0; }
        .fh__since { color: rgba(251,247,240,0.8); font-size: clamp(1rem, 1.4vw, 1.16rem); margin: 1rem 0 0; }

        .fh__stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: clamp(1rem, 3vw, 2.4rem);
          margin-top: clamp(2.4rem, 5vw, 3.4rem); }
        .fh__stat { position: relative; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; text-align: center; padding-inline: 0.5rem; }
        .fh__stat + .fh__stat::before { content: ""; position: absolute; inset-inline-start: 0; top: 12%; bottom: 12%; width: 1px;
          background: linear-gradient(transparent, rgba(197,160,106,0.45), transparent); }
        .fh__statnum { color: var(--brass-2); font-size: clamp(2.4rem, 5vw, 4.2rem); line-height: 0.95; font-weight: 400;
          letter-spacing: -0.01em; text-shadow: 0 2px 30px rgba(16,15,13,0.55); }
        .fh__statlabel { font-size: clamp(0.64rem, 0.9vw, 0.76rem); letter-spacing: 0.16em; text-transform: uppercase;
          color: rgba(251,247,240,0.72); font-weight: 500; }
        html[dir="rtl"] .fh__statlabel { letter-spacing: 0.06em; }

        /* ── III · voices ── */
        .fh__voices { background: var(--bone); padding-block: clamp(3.6rem, 8vw, 7rem); }
        .fh__voicesgrid { display: grid; grid-template-columns: minmax(0, 0.82fr) minmax(0, 1.18fr); gap: clamp(2.4rem, 6vw, 5rem); align-items: start; }
        .fh__voicesfig { position: sticky; top: clamp(5rem, 12vh, 9rem); }
        .fh__figframe { position: relative; margin: 0; border-radius: 16px; overflow: hidden; aspect-ratio: 3/4;
          box-shadow: 0 50px 100px -45px rgba(22,21,15,0.5); border: 1px solid var(--line); }
        .fh__figframe img { width: 100%; height: 100%; object-fit: cover; }
        .fh__figframe figcaption { position: absolute; bottom: 0; inset-inline: 0; padding: 1.4rem 1.2rem 1.1rem;
          font-size: 0.66rem; letter-spacing: 0.16em; text-transform: uppercase; color: rgba(251,247,240,0.92);
          background: linear-gradient(transparent, rgba(16,15,13,0.78)); }
        html[dir="rtl"] .fh__figframe figcaption { letter-spacing: 0.06em; }

        .fh__voicestitle { color: var(--ink); font-size: clamp(1.7rem, 3vw, 2.4rem); font-weight: 380; margin: 0 0 1.8rem; }
        .fh__qlist { display: flex; flex-direction: column; gap: clamp(1.2rem, 2.4vw, 1.8rem); }
        .fh__quote { position: relative; margin: 0; padding: clamp(1.4rem, 2.6vw, 2rem); border-radius: 16px;
          background: rgba(255,255,255,0.6); border: 1px solid color-mix(in srgb, var(--brass) 26%, transparent);
          box-shadow: 0 24px 60px -40px rgba(22,21,15,0.35); transition: transform 0.5s var(--ease), box-shadow 0.5s var(--ease); }
        .fh__quote:hover { transform: translateY(-4px); box-shadow: 0 36px 80px -42px rgba(22,21,15,0.45); }
        .fh__stars { display: flex; gap: 3px; color: var(--brass); margin-bottom: 0.9rem; }
        html[dir="rtl"] .fh__stars { justify-content: flex-start; }
        .fh__qtext { margin: 0; font-family: var(--font-display); font-size: clamp(1.2rem, 1.7vw, 1.5rem); line-height: 1.45; font-weight: 360; color: var(--ink); }
        .fh__qcap { display: flex; align-items: center; gap: 0.85rem; margin-top: 1.4rem; padding-top: 1.2rem;
          border-top: 1px solid color-mix(in srgb, var(--brass) 32%, transparent); }
        .fh__avatar { flex: none; width: 42px; height: 42px; border-radius: 50%; display: grid; place-items: center;
          font-family: var(--font-display); font-size: 0.92rem; color: var(--ink);
          background: linear-gradient(150deg, var(--brass-2), color-mix(in srgb, var(--brass) 70%, #7a5c2e));
          box-shadow: inset 0 1px 1px rgba(255,255,255,0.4); }
        .fh__qmeta { display: flex; flex-direction: column; gap: 0.1rem; }
        .fh__qname { font-family: var(--font-display); font-size: 1.02rem; color: var(--ever); }
        .fh__qrole { font-size: 0.74rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-faint); }
        html[dir="rtl"] .fh__qrole { letter-spacing: 0.02em; }

        @media (max-width: 960px) {
          .fh__voicesgrid { grid-template-columns: 1fr; gap: 2.4rem; }
          .fh__voicesfig { position: static; }
          .fh__figframe { aspect-ratio: 16/10; }
          .fh__stats { grid-template-columns: 1fr 1fr; gap: 1.8rem 1rem; }
          .fh__stat:nth-child(3)::before, .fh__stat:nth-child(2)::before { content: none; }
        }
        @media (max-width: 760px) {
          .fh__band { min-height: 100svh; }
          .fh__scrim { background:
            linear-gradient(180deg, rgba(16,15,13,0.5) 0%, rgba(16,15,13,0.2) 30%, rgba(16,15,13,0.78) 100%); }
          .fh__shop { display: none; }
          .fh__statnum { font-size: clamp(2.2rem, 11vw, 3rem); }
        }
        @media (prefers-reduced-motion: reduce) {
          .fh__img { scale: 1 !important; }
        }
      `}</style>
    </section>
  );
}

function Star() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.2l2.95 5.98 6.6.96-4.78 4.66 1.13 6.57L12 17.27l-5.9 3.1 1.13-6.57L2.45 9.14l6.6-.96L12 2.2z" />
    </svg>
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
