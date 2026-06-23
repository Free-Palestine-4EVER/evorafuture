"use client";

import { useT } from "@/lib/i18n";
import { Rise, RevealLines, Magnetic, motion } from "@/components/motion";

const EASE = [0.22, 1, 0.36, 1] as const;
// Evora Future Home — Wasfi Al-Tal St., Khalda, Amman
const MAPS_DIR =
  "https://www.google.com/maps/dir/?api=1&destination=Evora+Future+Home%2C+Wasfi+Al-Tal+St%2C+Khalda%2C+Amman";
const MAPS_EMBED =
  "https://www.google.com/maps?q=Evora+Future+Home%2C+Wasfi+Al-Tal+St%2C+Khalda%2C+Amman&ll=31.9929926,35.8638714&z=16&output=embed";

// split a title into two balanced lines for the masked reveal
function lines(text: string): string[] {
  const w = text.split(" ");
  if (w.length < 2) return [text];
  const c = Math.ceil(w.length / 2);
  return [w.slice(0, c).join(" "), w.slice(c).join(" ")];
}

export default function Visit() {
  const { t, lang } = useT();
  const en = lang === "en";

  const registry = [
    {
      n: "01",
      label: en ? "The Showroom" : "المعرض",
      value: t("visit_addr"),
      sub: en ? "By appointment & walk-in" : "بموعد أو زيارة مباشرة",
    },
    {
      n: "02",
      label: en ? "Opening Hours" : "ساعات العمل",
      value: t("visit_hours"),
      sub: en ? "Friday — by appointment" : "الجمعة — بموعد مسبق",
    },
    {
      n: "03",
      label: en ? "Find Us" : "تابعونا",
      value: "@evorafuturehome",
      sub: en ? "Follow us on Instagram" : "تابعونا على إنستغرام",
    },
  ];

  return (
    <section id="visit" className="vst" lang={lang}>
      <span className="vst__edge" aria-hidden>
        {en ? "Amman — Jordan" : "عمّان — الأردن"}
      </span>

      <div className="container vst__inner">
        {/* header */}
        <div className="vst__head">
          <Rise as="span" className="eyebrow vst__eyebrow">
            {t("visit_eyebrow")}
          </Rise>
          <Rise as="span" delay={0.06} className="vst__coords">
            31.99° N · 35.84° E
          </Rise>
        </div>

        <div className="vst__grid">
          {/* ── engraved card ── */}
          <div className="vst__card">
            <span className="vst__corner vst__corner--tl" aria-hidden />
            <span className="vst__corner vst__corner--br" aria-hidden />

            <RevealLines
              lines={lines(t("visit_title"))}
              className="display vst__title"
              delay={0.08}
            />

            <ul className="vst__registry">
              {registry.map((r, i) => (
                <li className="vst__entry" key={r.n}>
                  <span className="vst__n">{r.n}</span>
                  <span className="vst__entry-body">
                    <span className="vst__label">{r.label}</span>
                    <span className="vst__value">{r.value}</span>
                    <span className="vst__sub">{r.sub}</span>
                  </span>
                  {i < registry.length - 1 && <AnimRule />}
                </li>
              ))}
            </ul>

            <Rise delay={0.24} className="vst__cta">
              <Magnetic strength={0.3}>
                <a href="/visit" className="btn vst__btn-solid">
                  {t("consult")} <span className="arrow">→</span>
                </a>
              </Magnetic>
              <a
                href={MAPS_DIR}
                target="_blank"
                rel="noopener noreferrer"
                className="vst__textlink"
              >
                {en ? "Get directions" : "احصل على الاتجاهات"}
                <span aria-hidden>↗</span>
              </a>
            </Rise>
          </div>

          {/* ── tinted map plate ── */}
          <Rise delay={0.14} className="vst__plate">
            <div className="vst__map">
              <iframe
                className="vst__iframe"
                src={MAPS_EMBED}
                title={en ? "Evora — Khalda, Amman" : "إيفورا — خلدا، عمّان"}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <span className="vst__tint" aria-hidden />
              <a
                href={MAPS_DIR}
                target="_blank"
                rel="noopener noreferrer"
                className="vst__plaque"
              >
                <span className="vst__plaque-pin">
                  <span className="vst__plaque-pulse" />
                </span>
                <span className="vst__plaque-text">
                  <span>{en ? "Khalda · Amman" : "خلدا · عمّان"}</span>
                  <span className="vst__plaque-cta">
                    {en ? "Open in Maps" : "افتح في الخرائط"} ↗
                  </span>
                </span>
              </a>
            </div>
          </Rise>
        </div>
      </div>

      <style>{`
        .vst {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          background: var(--paper);
          color: var(--ink);
          padding-block: clamp(5rem, 11vw, 11rem);
        }
        /* warm atmosphere, never flat */
        .vst::before {
          content: "";
          position: absolute; inset: 0; z-index: -1; pointer-events: none;
          background:
            radial-gradient(55% 45% at 100% 0%, rgba(197,160,106,0.12), transparent 60%),
            radial-gradient(60% 60% at 0% 100%, rgba(54,65,47,0.07), transparent 60%);
        }
        .vst__edge {
          position: absolute;
          top: 50%; inset-inline-end: clamp(0.4rem, 1.5vw, 1.4rem);
          transform: translateY(-50%) rotate(180deg);
          writing-mode: vertical-rl;
          font-size: 0.66rem; letter-spacing: 0.42em; text-transform: uppercase;
          color: var(--ink-faint); opacity: 0.5;
          pointer-events: none; user-select: none;
        }
        html[dir="rtl"] .vst__edge { inset-inline-end: auto; inset-inline-start: clamp(0.4rem,1.5vw,1.4rem); letter-spacing: 0.1em; }

        .vst__inner { position: relative; z-index: 1; }
        .vst__head {
          display: flex; align-items: baseline; justify-content: space-between;
          gap: 1rem; flex-wrap: wrap;
          padding-bottom: clamp(2rem, 4vw, 3.2rem);
          border-bottom: 1px solid var(--line);
        }
        .vst__eyebrow {
          display: inline-flex; align-items: center; gap: 0.7rem;
          color: var(--brass);
        }
        .vst__eyebrow::before { content: ""; width: 34px; height: 1px; background: var(--brass); }
        .vst__coords {
          font-family: var(--font-display);
          font-style: italic;
          font-size: 0.92rem;
          color: var(--ink-faint);
          letter-spacing: 0.02em;
        }
        html[dir="rtl"] .vst__coords { font-style: normal; }

        .vst__grid {
          display: grid;
          grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
          gap: clamp(2rem, 5vw, 5.5rem);
          align-items: stretch;
          padding-top: clamp(2.4rem, 5vw, 4rem);
        }

        /* ── card ── */
        .vst__card {
          position: relative;
          align-self: center;
          padding: clamp(0.5rem, 2vw, 1.5rem) clamp(0.5rem, 2vw, 1rem);
        }
        .vst__corner {
          position: absolute; width: 18px; height: 18px; pointer-events: none;
          border-color: var(--brass); opacity: 0.6;
        }
        .vst__corner--tl { top: 0; inset-inline-start: 0; border-top: 1px solid; border-inline-start: 1px solid; }
        .vst__corner--br { bottom: 0; inset-inline-end: 0; border-bottom: 1px solid; border-inline-end: 1px solid; }

        .vst__title {
          font-size: clamp(2.5rem, 5.4vw, 4.6rem);
          line-height: 1.0;
          font-weight: 360;
          letter-spacing: -0.01em;
          margin: 0 0 clamp(2rem, 4vw, 3rem);
        }
        html[dir="rtl"] .vst__title { line-height: 1.2; letter-spacing: 0; }

        .vst__registry { list-style: none; margin: 0; padding: 0; }
        .vst__entry {
          position: relative;
          display: grid;
          grid-template-columns: auto 1fr;
          gap: clamp(1rem, 2vw, 1.6rem);
          padding: clamp(1.1rem, 2vw, 1.5rem) 0;
        }
        .vst__entry:first-child { padding-top: 0; }
        .vst__n {
          font-family: var(--font-display);
          font-size: 0.92rem;
          color: var(--brass);
          padding-top: 0.35rem;
          letter-spacing: 0.04em;
        }
        .vst__entry-body { display: flex; flex-direction: column; gap: 0.3rem; }
        .vst__label {
          font-size: 0.66rem; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--ink-faint);
        }
        html[dir="rtl"] .vst__label { letter-spacing: 0.05em; }
        .vst__value {
          font-family: var(--font-display);
          font-weight: 400;
          font-size: clamp(1.15rem, 1.6vw, 1.42rem);
          line-height: 1.3;
          color: var(--ink);
        }
        .vst__sub { font-size: 0.84rem; color: var(--ink-faint); }
        .vst__entry .rule {
          position: absolute; left: 0; right: 0; bottom: 0; height: 1px;
          background: var(--line); transform-origin: left;
        }
        html[dir="rtl"] .vst__entry .rule { transform-origin: right; }

        .vst__cta { display: flex; align-items: center; flex-wrap: wrap; gap: 1.4rem; margin-top: clamp(2rem, 4vw, 3rem); }
        .vst__btn-solid {
          background: var(--ever); color: var(--paper); border-color: var(--ever);
        }
        .vst__btn-solid:hover { background: var(--ink); border-color: var(--ink); transform: translateY(-2px); }
        .vst__textlink {
          position: relative;
          display: inline-flex; align-items: center; gap: 0.4rem;
          font-size: 0.92rem; color: var(--ink);
          padding-bottom: 2px;
        }
        .vst__textlink::after {
          content: ""; position: absolute; inset-inline-start: 0; bottom: 0;
          width: 100%; height: 1px; background: var(--ink);
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.45s var(--ease);
        }
        html[dir="rtl"] .vst__textlink::after { transform-origin: right; }
        .vst__textlink:hover::after { transform: scaleX(1); }

        /* ── map plate ── */
        .vst__plate { display: block; }
        .vst__map {
          position: relative;
          height: 100%;
          min-height: clamp(440px, 60vh, 720px);
          overflow: hidden;
          border-radius: 3px;
          background: var(--bone);
          box-shadow:
            0 0 0 1px rgba(169,130,76,0.45),
            0 0 0 7px var(--paper),
            0 0 0 8px rgba(169,130,76,0.22),
            0 44px 90px -50px rgba(27,25,22,0.5);
        }
        .vst__iframe {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          border: 0;
          /* tint Google's default palette toward the brand */
          filter: grayscale(0.45) sepia(0.18) saturate(0.78) contrast(1.02) brightness(0.98);
        }
        .vst__tint {
          position: absolute; inset: 0; z-index: 2; pointer-events: none;
          mix-blend-mode: multiply;
          background:
            radial-gradient(120% 120% at 50% 0%, transparent 55%, rgba(54,65,47,0.16)),
            linear-gradient(180deg, rgba(54,65,47,0.05), rgba(27,25,22,0.12));
        }
        .vst__plaque {
          position: absolute; z-index: 3;
          bottom: 1.1rem; inset-inline-start: 1.1rem;
          display: inline-flex; align-items: center; gap: 0.7rem;
          background: rgba(251,247,240,0.95);
          backdrop-filter: blur(7px); -webkit-backdrop-filter: blur(7px);
          padding: 0.7rem 1rem; border-radius: 3px;
          box-shadow: 0 10px 30px -16px rgba(27,25,22,0.5);
          transition: transform 0.4s var(--ease), box-shadow 0.4s var(--ease);
        }
        .vst__plaque:hover { transform: translateY(-2px); box-shadow: 0 16px 36px -16px rgba(27,25,22,0.55); }
        .vst__plaque-pin { position: relative; flex: none; width: 9px; height: 9px; border-radius: 50%; background: var(--clay); }
        .vst__plaque-pulse {
          position: absolute; inset: 0; border-radius: 50%;
          box-shadow: 0 0 0 0 rgba(178,116,87,0.5);
          animation: vstPulse 2.4s var(--ease) infinite;
        }
        .vst__plaque-text { display: flex; flex-direction: column; gap: 0.1rem; line-height: 1.25; }
        .vst__plaque-text > span:first-child { font-size: 0.86rem; font-weight: 600; color: var(--ink); }
        .vst__plaque-cta { font-size: 0.7rem; letter-spacing: 0.04em; color: var(--brass); }

        @keyframes vstPulse {
          0%   { box-shadow: 0 0 0 0 rgba(178,116,87,0.5); }
          70%  { box-shadow: 0 0 0 13px rgba(178,116,87,0); }
          100% { box-shadow: 0 0 0 0 rgba(178,116,87,0); }
        }

        @media (max-width: 860px) {
          .vst__grid { grid-template-columns: 1fr; }
          .vst__plate { order: -1; }
          .vst__map { min-height: 0; aspect-ratio: 16 / 11; }
          .vst__card { align-self: stretch; }
          .vst__edge { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .vst__plaque-pulse { animation: none; }
          .vst__plaque, .vst__textlink::after, .vst__btn-solid { transition: none; }
        }
      `}</style>
    </section>
  );
}

function AnimRule() {
  return (
    <motion.span
      className="rule"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, ease: EASE }}
    />
  );
}
