"use client";

import dynamic from "next/dynamic";
import { useT } from "@/lib/i18n";
import { Rise, RevealLines, Magnetic } from "@/components/motion";

const SofaScene = dynamic(() => import("./SofaScene"), {
  ssr: false,
  loading: () => <div className="sofa__loading" aria-hidden />,
});

export default function SofaShowcase() {
  const { lang } = useT();
  const en = lang === "en";

  return (
    <section className="sofa" lang={lang}>
      {/* atmosphere */}
      <span className="sofa__aurora sofa__aurora--a" aria-hidden />
      <span className="sofa__aurora sofa__aurora--b" aria-hidden />
      <span className="sofa__grain" aria-hidden />
      <span className="sofa__word" aria-hidden>EVORA</span>

      <div className="container sofa__grid">
        {/* copy */}
        <div className="sofa__copy">
          <Rise as="span" className="eyebrow sofa__eyebrow">
            {en ? "Signature piece · Live 3D" : "قطعة مميّزة · ثلاثي الأبعاد"}
          </Rise>
          <RevealLines
            lines={en ? ["The Laurel,", "in velvet."] : ["لورِل،", "بالمخمل."]}
            className="display sofa__title"
            delay={0.06}
          />
          <Rise delay={0.16}>
            <p className="sofa__body">
              {en
                ? "Hand-built in Amman, wrapped in warm beige velvet with a softly tufted headboard and a pair of matching nightstands. Spin it, light it, and turn it over in your hands — then make it yours in five fabrics."
                : "مصنوع يدويًا في عمّان، بقماش مخمل بيج دافئ ولوح رأس منجّد، مع كومودينتين متطابقتين. أدِره، أضئه، وقلّبه بين يديك — ثم اختره بخمسة أقمشة."}
            </p>
          </Rise>

          <Rise delay={0.24} className="sofa__specs">
            {[
              en ? "Made to order" : "حسب الطلب",
              en ? "Tufted headboard" : "لوح رأس منجّد",
              en ? "Matching nightstands" : "كومودينات متطابقة",
            ].map((s) => (
              <span className="sofa__chip" key={s}>{s}</span>
            ))}
          </Rise>

          <Rise delay={0.32} className="sofa__cta">
            <Magnetic strength={0.3}>
              <a href="/shop" className="btn sofa__btn-solid">
                {en ? "Customise this piece" : "خصّص هذه القطعة"}
                <span className="arrow" aria-hidden>→</span>
              </a>
            </Magnetic>
            <a href="/showroom" className="sofa__textlink">
              {en ? "See it in your room" : "شاهدها في غرفتك"}
              <span aria-hidden>↗</span>
            </a>
          </Rise>
        </div>

        {/* 3D stage */}
        <div className="sofa__stage">
          <span className="sofa__halo" aria-hidden />
          <SofaScene />

          {/* floating spec badge */}
          <Rise delay={0.4} className="sofa__badge">
            <span className="sofa__badge-k">{en ? "Signature" : "قطعة مميّزة"}</span>
            <span className="sofa__badge-s">{en ? "Made to order · 6 weeks" : "حسب الطلب · ٦ أسابيع"}</span>
          </Rise>

          <span className="sofa__drag" aria-hidden>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 9l-3 3 3 3M16 9l3 3-3 3M5 12h14" />
            </svg>
            {en ? "Drag to spin" : "اسحب للتدوير"}
          </span>
        </div>
      </div>

      <style>{`
        .sofa {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          color: var(--ink);
          margin-top: clamp(8rem, 18vw, 18rem);
          padding-block: clamp(6rem, 12vw, 12rem);
          background:
            radial-gradient(120% 90% at 50% 0%, #FFFFFF, transparent 60%),
            var(--bone);
        }

        /* drifting soft glows — barely-there warmth on white */
        .sofa__aurora {
          position: absolute; z-index: 0; pointer-events: none;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.5;
          mix-blend-mode: multiply;
        }
        .sofa__aurora--a {
          width: 46vw; height: 46vw; top: -8%; inset-inline-end: 4%;
          background: radial-gradient(circle, rgba(40,76,134,0.10), transparent 68%);
          animation: sofaDriftA 16s var(--ease) infinite alternate;
        }
        .sofa__aurora--b {
          width: 40vw; height: 40vw; bottom: -12%; inset-inline-start: -4%;
          background: radial-gradient(circle, rgba(197,160,106,0.12), transparent 70%);
          animation: sofaDriftB 20s var(--ease) infinite alternate;
        }
        @keyframes sofaDriftA {
          0%   { transform: translate(0,0) scale(1); }
          100% { transform: translate(-6%, 8%) scale(1.15); }
        }
        @keyframes sofaDriftB {
          0%   { transform: translate(0,0) scale(1.1); }
          100% { transform: translate(7%, -6%) scale(0.92); }
        }

        .sofa__grain {
          position: absolute; inset: 0; z-index: 0; pointer-events: none; opacity: 0.22;
          mix-blend-mode: multiply;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 170px;
        }
        .sofa__word {
          position: absolute; z-index: 0; pointer-events: none; user-select: none;
          top: 50%; left: 50%; transform: translate(-50%, -50%);
          width: 100%; text-align: center; white-space: nowrap;
          font-family: var(--font-display); font-weight: 400;
          font-size: 17vw; line-height: 0.9;
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(22,21,15,0.07);
          letter-spacing: 0.01em;
        }

        .sofa__grid {
          position: relative; z-index: 1;
          display: grid;
          grid-template-columns: minmax(0, 0.82fr) minmax(0, 1.18fr);
          gap: clamp(1.5rem, 4vw, 4rem);
          align-items: center;
        }

        /* copy */
        .sofa__copy { max-width: 31rem; }
        .sofa__eyebrow { display: inline-flex; align-items: center; gap: 0.7rem; color: var(--brass); }
        .sofa__eyebrow::before { content: ""; width: 32px; height: 1px; background: var(--brass); }
        .sofa__title {
          margin: 1.2rem 0 0;
          font-size: clamp(2.6rem, 6vw, 5rem);
          line-height: 0.98; font-weight: 360; letter-spacing: -0.01em;
          color: var(--ink);
        }
        html[dir="rtl"] .sofa__title { line-height: 1.18; letter-spacing: 0; }
        .sofa__body {
          margin: 1.4rem 0 0; max-width: 40ch;
          color: var(--ink-soft); font-size: 1rem; line-height: 1.7;
        }

        /* spec chips */
        .sofa__specs { display: flex; flex-wrap: wrap; gap: 0.6rem; margin-top: 2rem; }
        .sofa__chip {
          font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--ink-soft);
          padding: 0.5em 0.95em;
          border: 1px solid var(--line);
          border-radius: 100px;
          background: rgba(40,76,134,0.04);
        }
        html[dir="rtl"] .sofa__chip { letter-spacing: 0; }

        .sofa__cta { display: flex; align-items: center; flex-wrap: wrap; gap: 1.4rem; margin-top: 2.2rem; }
        .sofa__btn-solid { background: #284c86; color: #fff; border-color: #284c86; }
        .sofa__btn-solid:hover { background: var(--ink); border-color: var(--ink); color: #fff; transform: translateY(-2px); }
        .sofa__textlink {
          position: relative; display: inline-flex; align-items: center; gap: 0.4rem;
          font-size: 0.92rem; color: var(--ink); padding-bottom: 2px;
        }
        .sofa__textlink::after {
          content: ""; position: absolute; inset-inline-start: 0; bottom: 0;
          width: 100%; height: 1px; background: var(--ink);
          transform: scaleX(0); transform-origin: left; transition: transform 0.45s var(--ease);
        }
        html[dir="rtl"] .sofa__textlink::after { transform-origin: right; }
        .sofa__textlink:hover::after { transform: scaleX(1); }

        /* stage */
        .sofa__stage { position: relative; height: clamp(420px, 58vh, 680px); }
        .sofa__stage canvas { touch-action: none; position: relative; z-index: 1; }
        .sofa__halo {
          position: absolute; z-index: 0; top: 46%; left: 50%;
          width: 70%; height: 60%; transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(40,76,134,0.16), transparent 65%);
          filter: blur(34px); pointer-events: none;
          animation: sofaPulse 6s var(--ease) infinite alternate;
        }
        @keyframes sofaPulse { 0% { opacity: 0.45; } 100% { opacity: 0.75; } }
        .sofa__loading { position: absolute; inset: 0; }

        /* floating badge */
        .sofa__badge {
          position: absolute; z-index: 2; top: 8%; inset-inline-end: 2%;
          display: flex; flex-direction: column; gap: 0.15rem;
          padding: 0.9rem 1.1rem; border-radius: 4px;
          background: rgba(255,255,255,0.82);
          border: 1px solid var(--line);
          backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 16px 40px -22px rgba(22,21,15,0.35);
        }
        .sofa__badge-k { font-size: 0.66rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--ink-faint); }
        .sofa__badge-v { font-family: var(--font-display); font-size: 1.4rem; color: var(--ink); line-height: 1.1; }
        .sofa__badge-s { font-size: 0.72rem; color: var(--brass); }

        .sofa__drag {
          position: absolute; z-index: 2; bottom: 0.4rem; inset-inline-start: 50%;
          transform: translateX(-50%);
          display: inline-flex; align-items: center; gap: 0.5rem;
          font-size: 0.72rem; letter-spacing: 0.06em; text-transform: uppercase;
          color: var(--ink-faint); pointer-events: none;
        }
        html[dir="rtl"] .sofa__drag { transform: translateX(50%); letter-spacing: 0; }

        @media (max-width: 880px) {
          .sofa__grid { grid-template-columns: 1fr; }
          .sofa__stage { order: -1; height: clamp(340px, 50vh, 480px); }
          .sofa__copy { max-width: none; }
          .sofa__badge { top: 4%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .sofa__aurora--a, .sofa__aurora--b, .sofa__halo { animation: none; }
          .sofa__textlink::after, .sofa__btn-solid, .sofa__swatch { transition: none; }
        }
      `}</style>
    </section>
  );
}
