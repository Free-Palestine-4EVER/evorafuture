"use client";

import { useT } from "@/lib/i18n";
import { financingPoints } from "@/lib/data";
import {
  Rise,
  RevealLines,
  Stagger,
  StaggerItem,
  CountUp,
  ParallaxImage,
  Magnetic,
} from "@/components/motion";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Financing() {
  const { t, lang } = useT();
  const ar = lang === "ar";

  return (
    <section
      id="financing"
      className="section fin"
      style={{ background: "var(--bone)", color: "var(--ink)" }}
    >
      <div className="container">
        <div className="fin-grid">
          {/* ── LEFT — real furnished-room photograph, framed hero element ── */}
          <Rise className="fin-figure" y={36}>
            <ParallaxImage
              src="/evora/p10.jpg"
              alt=""
              amount={10}
              className="fin-photo"
            />
            <span className="fin-figcaption">
              {ar ? "بيت من إيفورا · عمّان" : "An Evora home · Amman"}
            </span>
          </Rise>

          {/* ── RIGHT — the offer, on a rich ever panel ── */}
          <Rise className="fin-panel" delay={0.08} y={36}>
            <span className="fin-panel-grain" aria-hidden="true" />

            <div className="fin-panel-body">
              <Rise
                as="span"
                className="eyebrow fin-eyebrow"
                delay={0.12}
              >
                {t("fin_eyebrow")}
              </Rise>

              <RevealLines
                lines={[t("fin_title")]}
                className="display fin-title"
                delay={0.16}
              />

              <Rise delay={0.24}>
                <p className="fin-body">{t("fin_body")}</p>
              </Rise>

              {/* big brass stat */}
              <Rise delay={0.3}>
                <div className="fin-stat">
                  <CountUp value="36" className="fin-stat-num" />
                  <span className="fin-stat-unit">
                    {ar ? "شهرًا" : "months"}
                  </span>
                </div>
              </Rise>

              {/* the three financing points — diamond-marked list */}
              <Stagger className="fin-list" delay={0.34}>
                {financingPoints.map((point, i) => (
                  <StaggerItem key={i} className="fin-item">
                    <svg
                      className="fin-mark"
                      viewBox="0 0 12 12"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M6 0l1.6 4.4L12 6 7.6 7.6 6 12 4.4 7.6 0 6l4.4-1.6z" />
                    </svg>
                    <span>{point[lang]}</span>
                  </StaggerItem>
                ))}
              </Stagger>

              <Rise delay={0.42}>
                <p className="fin-bank">
                  {ar ? "عبر بنك صفوة الإسلامي" : "via Safwa Islamic Bank"}
                </p>
              </Rise>

              <Rise delay={0.48}>
                <div className="fin-actions">
                  <Magnetic>
                    <a href="/visit" className="btn fin-btn-solid">
                      {t("consult")}
                      <span className="arrow" aria-hidden="true">↗</span>
                    </a>
                  </Magnetic>
                  <a href="/visit" className="btn fin-btn-ghost">
                    {t("visit_cta")}
                  </a>
                </div>
              </Rise>
            </div>
          </Rise>
        </div>
      </div>

      <style>{`
        .fin-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(2rem, 4vw, 4.5rem);
          align-items: stretch;
        }

        /* ---- LEFT photo ---- */
        .fin-figure {
          position: relative;
          align-self: stretch;
        }
        .fin-photo {
          width: 100%;
          height: 100%;
          min-height: clamp(420px, 60vh, 760px);
          aspect-ratio: 4 / 5;
          border-radius: 4px;
          box-shadow:
            0 2px 1px rgba(27,25,22,0.04),
            0 38px 80px -34px rgba(27,25,22,0.45);
        }
        .fin-figcaption {
          position: absolute;
          inset-block-end: 1.2rem;
          inset-inline-start: 1.3rem;
          z-index: 2;
          padding: 0.5rem 0.85rem;
          border-radius: 100px;
          font-size: 0.64rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--paper);
          background: rgba(27,25,22,0.32);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        html[dir="rtl"] .fin-figcaption { letter-spacing: 0.06em; }

        /* ---- RIGHT panel ---- */
        .fin-panel {
          position: relative;
          overflow: hidden;
          border-radius: 4px;
          background:
            radial-gradient(120% 90% at 12% 0%, rgba(76,90,64,0.55), transparent 60%),
            var(--ever);
          color: var(--paper);
          box-shadow: 0 38px 80px -40px rgba(27,25,22,0.5);
        }
        .fin-panel-grain {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          opacity: 0.4;
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 180px;
        }
        .fin-panel-body {
          position: relative;
          z-index: 1;
          padding: clamp(2.2rem, 4vw, 3.6rem);
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .fin-eyebrow {
          display: block;
          color: var(--brass-2);
        }
        .fin-title {
          color: var(--paper);
          font-size: clamp(2rem, 4vw, 3.4rem);
          line-height: 1.02;
          margin: 1rem 0 0;
        }
        html[dir="rtl"] .fin-title { line-height: 1.2; }
        .fin-body {
          color: rgba(251,247,240,0.8);
          font-size: clamp(1rem, 1.15vw, 1.08rem);
          line-height: 1.72;
          max-width: 42ch;
          margin: 1.3rem 0 0;
        }

        /* big brass stat */
        .fin-stat {
          display: flex;
          align-items: baseline;
          gap: 0.5ch;
          margin: 2rem 0 0;
          font-family: var(--font-display);
          font-weight: 420;
          color: var(--brass-2);
          line-height: 0.92;
        }
        html[dir="rtl"] .fin-stat { font-family: var(--font-ar); font-weight: 600; }
        .fin-stat-num { font-size: clamp(3.4rem, 8vw, 5.2rem); }
        .fin-stat-unit { font-size: clamp(1.2rem, 2.6vw, 1.8rem); color: rgba(197,160,106,0.78); }

        /* points list */
        .fin-list {
          margin: 1.6rem 0 0;
          border-top: 1px solid rgba(251,247,240,0.16);
        }
        .fin-item {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.9rem 0;
          border-bottom: 1px solid rgba(251,247,240,0.12);
          color: var(--paper);
          font-size: clamp(0.95rem, 1vw, 1.02rem);
        }
        .fin-mark {
          flex: none;
          width: 11px;
          height: 11px;
          color: var(--brass-2);
        }

        .fin-bank {
          margin: 1.5rem 0 0;
          font-size: 0.8rem;
          letter-spacing: 0.04em;
          color: rgba(251,247,240,0.52);
        }
        html[dir="rtl"] .fin-bank { letter-spacing: 0; }

        .fin-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.85rem;
          margin: auto 0 0;
          padding-top: 2.1rem;
        }
        .fin-btn-solid {
          background: var(--paper);
          color: var(--ever);
          border-color: var(--paper);
        }
        .fin-btn-solid:hover {
          background: var(--brass-2);
          border-color: var(--brass-2);
          color: var(--ink);
          transform: translateY(-2px);
        }
        .fin-btn-ghost {
          background: transparent;
          color: var(--paper);
          border-color: rgba(251,247,240,0.34);
        }
        .fin-btn-ghost:hover {
          border-color: var(--paper);
          background: rgba(251,247,240,0.08);
        }

        /* ---- responsive: stack, image first ---- */
        @media (max-width: 880px) {
          .fin-grid { grid-template-columns: 1fr; gap: 1.6rem; }
          .fin-photo { height: auto; min-height: 0; aspect-ratio: 4 / 3; }
        }
      `}</style>
    </section>
  );
}
