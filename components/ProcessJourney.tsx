"use client";

import { useState } from "react";
import Link from "next/link";
import { useT } from "@/lib/i18n";
import { processSteps } from "@/lib/data";
import { JOURNEY } from "@/lib/portal/journey";
import { Rise, motion } from "@/components/motion";
import TransformStage from "@/components/TransformStage";
import { openStartProject } from "@/lib/startProject";

/* Public "How Evora works" story: the exact client journey — a bare 2D plan,
 * furnished in 2D, rebuilt in 3D, rendered photoreal for sign-off, then built
 * while the client tracks production live.
 *
 * The 4 design steps use a sticky "swap column" scroll mechanic: one panel
 * stays pinned in the viewport and springs from one side to the other as each
 * step crosses the screen center (detected via onViewportEnter), while its
 * visual crossfades. Bilingual via lang. Mounted after the hero. */

const EASE = [0.22, 1, 0.36, 1] as const;
const SPRING = { type: "spring", stiffness: 380, damping: 30 } as const;

export default function ProcessJourney({ showFinale = true }: { showFinale?: boolean }) {
  const { lang, dir } = useT();
  const ar = lang === "ar";
  const [active, setActive] = useState(0);

  // Even steps (0,2) → panel on the LEFT; odd (1,3) → panel on the RIGHT.
  const panelRight = active % 2 === 1;

  return (
    <section dir={dir} style={{ position: "relative", paddingTop: "clamp(4rem,9vw,7rem)" }}>
      {/* Header — centered lead-in; the 4-part film now lives in the swap panel below */}
      <div className="container pj-intro">
        <header className="pj-intro-text">
          <Rise>
            <span className="pj-kicker">
              <span className="pj-kicker-rule" />
              {ar ? "كيف تعمل إيفورا" : "How Evora works"}
              <span className="pj-kicker-rule" />
            </span>
          </Rise>
          <Rise delay={0.06} as="h2" className="pj-title">
            {ar ? (
              <>
                من مخطط مسطّح <em>إلى منزلك المكتمل</em>
              </>
            ) : (
              <>
                From a flat plan <em>to your finished home</em>
              </>
            )}
          </Rise>
          <Rise delay={0.12} as="p" className="pj-lede">
            {ar
              ? "أربع خطوات تصميم تحوّل مخططك الفارغ إلى تصميم تعتمده — تابع التحول مرحلةً مرحلة بينما تتنقّل، ثم نصنعه وأنت تشاهد كل خطوة مباشرةً."
              : "Four design steps turn your empty plan into a look you approve — watch it transform, stage by stage, as you scroll. Then we build it while you follow every step live."}
          </Rise>
        </header>
      </div>

      {/* ---- Swap-column region ---- */}
      <div className="pj-swap container" style={{ position: "relative", marginTop: "clamp(2rem,5vw,4rem)" }}>
        {/* Sticky panel that springs side-to-side (desktop only) */}
        <div className="pj-sticky">
          <motion.div className="pj-panel" animate={{ left: panelRight ? "42%" : "0%" }} transition={SPRING}>
            <TransformStage step={active} ar={ar} />
          </motion.div>
        </div>

        {/* Pull the steps up over the sticky panel so they share the same space */}
        <div className="pj-offset" />

        {processSteps.map((step, i) => {
          const textRight = i % 2 === 1 ? false : true; // panel left → text right
          return (
            <motion.section
              key={step.n}
              className="pj-step"
              onViewportEnter={() => setActive(i)}
              viewport={{ margin: "-50% 0px -50% 0px", amount: 0 }}
              style={{ justifyContent: textRight ? "flex-end" : "flex-start" }}
            >
              <div className="pj-step-text">
                <span className="pj-step-count">
                  <b>{step.n}</b>
                  <span className="pj-step-rule" />
                  <span className="pj-step-total">{ar ? "من ٠٤" : "of 04"}</span>
                </span>
                <span className="pj-step-ghost" aria-hidden>{step.n}</span>
                <h3 className="pj-step-title">{step.title[lang]}</h3>
                <p className="pj-step-body">{step.body[lang]}</p>
                {/* Mobile inline visual (sticky panel is hidden < 760px) */}
                <div className="pj-step-media-mobile">
                  <TransformStage step={i} ar={ar} />
                </div>
              </div>
            </motion.section>
          );
        })}
      </div>

      {/* Finale — live production tracking. Suppressed on the home page, where
          StartAndTrack merges this with the upload→3D beat into one showpiece. */}
      {showFinale && (
        <div className="container">
          <TrackingFinale ar={ar} />
        </div>
      )}

      <style>{`
        .pj-intro {
          text-align: center;
          max-width: 70ch;
          margin-inline: auto;
        }
        .pj-intro-text { width: 100%; }

        /* Kicker — centered label between two hairline rules */
        .pj-kicker {
          display: inline-flex; align-items: center; gap: 0.9rem;
          font-family: var(--f-sans);
          font-size: 0.72rem; font-weight: 600;
          letter-spacing: 0.28em; text-transform: uppercase;
          color: var(--brass-2, #8a6d3f);
        }
        .pj-kicker-rule {
          display: inline-block; width: clamp(28px, 6vw, 64px); height: 1px;
          background: linear-gradient(to right, transparent, var(--brass) 50%, transparent);
        }

        /* Display headline — Fraunces, optically sized, with an italic accent */
        .pj-title {
          font-family: var(--f-display), Georgia, serif;
          font-optical-sizing: auto;
          font-variation-settings: "opsz" 140, "SOFT" 0, "WONK" 1;
          font-weight: 340;
          font-size: clamp(2.5rem, 6.4vw, 5.25rem);
          line-height: 0.98;
          letter-spacing: -0.022em;
          margin: 1.25rem 0 0;
          color: var(--ink);
          text-wrap: balance;
        }
        .pj-title em {
          font-style: italic;
          font-variation-settings: "opsz" 140, "SOFT" 60, "WONK" 1;
          color: var(--ever, #2f5d4a);
        }

        .pj-lede {
          max-width: 54ch; margin-inline: auto; margin-top: 1.6rem;
          font-family: var(--f-sans);
          color: var(--ink-soft);
          font-size: clamp(1.02rem, 1.4vw, 1.18rem);
          line-height: 1.72;
          text-wrap: pretty;
        }
        .pj-sticky {
          pointer-events: none;
          position: sticky; top: 0; z-index: 2;
          height: 100vh; width: 100%;
          display: flex; align-items: center;
        }
        .pj-panel { position: absolute; width: 58%; }
        .pj-offset { margin-top: -100vh; }
        .pj-step {
          position: relative; z-index: 1;
          display: flex; align-items: center;
          min-height: 100vh;
        }
        .pj-step-text { width: 38%; position: relative; }

        /* Step counter — "01 — of 04" with a hairline */
        .pj-step-count {
          display: inline-flex; align-items: center; gap: 0.7rem;
          font-family: var(--f-sans);
          font-size: 0.74rem; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--ink-soft);
        }
        .pj-step-count b { color: var(--clay); font-weight: 700; }
        .pj-step-rule { width: 34px; height: 1px; background: var(--line); display: inline-block; }
        .pj-step-total { color: var(--ink-faint, #9a948b); }

        /* Oversized ghost numeral behind the title */
        .pj-step-ghost {
          position: absolute; z-index: -1;
          inset-block-start: -0.35em; inset-inline-start: -0.08em;
          font-family: var(--f-display), Georgia, serif;
          font-variation-settings: "opsz" 144, "WONK" 1;
          font-size: clamp(7rem, 13vw, 11rem);
          line-height: 0.8; font-weight: 360;
          color: var(--brass);
          opacity: 0.12;
          pointer-events: none; user-select: none;
        }

        .pj-step-title {
          font-family: var(--f-display), Georgia, serif;
          font-optical-sizing: auto;
          font-variation-settings: "opsz" 60, "SOFT" 40;
          font-weight: 380;
          font-size: clamp(1.7rem, 3.4vw, 2.6rem);
          line-height: 1.06; letter-spacing: -0.012em;
          color: var(--ink);
          margin: 0.9rem 0 0.7rem;
          text-wrap: balance;
        }
        .pj-step-body {
          font-family: var(--f-sans);
          color: var(--ink-soft);
          font-size: clamp(1.0rem, 1.3vw, 1.08rem);
          line-height: 1.72; max-width: 42ch;
          text-wrap: pretty;
        }
        .pj-step-media-mobile { display: none; margin-top: 1.6rem; }

        @media (max-width: 760px) {
          .pj-sticky, .pj-offset { display: none; }
          .pj-step { min-height: auto; padding-block: 2.2rem; justify-content: stretch !important; }
          .pj-step-text { width: 100%; }
          .pj-step-media-mobile { display: block; }
        }
      `}</style>
    </section>
  );
}

/* ---------- Live tracking finale ---------- */

function TrackingFinale({ ar }: { ar: boolean }) {
  const liveIndex = 5; // "Production & Finishing"
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.8, ease: EASE }}
      style={{
        marginTop: "clamp(3rem,7vw,6rem)", borderRadius: 24, padding: "clamp(1.8rem,4vw,3.2rem)",
        background: "var(--ink)", color: "var(--paper)", overflow: "hidden", position: "relative",
      }}
    >
      <div className="pj-finale" style={{ display: "grid", gap: "clamp(2rem,5vw,4rem)", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.1fr)", alignItems: "center" }}>
        <div>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.72rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--brass)" }}>
            <LiveDot active /> {ar ? "متابعة مباشرة" : "Live tracking"}
          </span>
          <h2 className="display" style={{ fontSize: "clamp(1.8rem,4vw,3rem)", margin: "1rem 0 0.9rem", fontWeight: 360, lineHeight: 1.1, color: "var(--paper)" }}>
            {ar ? "ثم نصنعه — وأنت تشاهد" : "Then we build it — and you watch"}
          </h2>
          <p style={{ color: "rgba(245,242,235,0.72)", fontSize: "1.02rem", lineHeight: 1.7, maxWidth: "44ch", margin: 0 }}>
            {ar
              ? "بعد اعتمادك، يبدأ الإنتاج. يحدّث فريقنا كل مرحلة بالصور، وتظهر التحديثات فورًا في لوحتك — تجهيز المواد، التصنيع، التشطيب، حتى التركيب."
              : "After you approve, production begins. Our team updates each stage with photos, and updates appear instantly in your dashboard — sourcing materials, building, finishing, all the way to install."}
          </p>
          <div style={{ display: "flex", gap: "0.8rem", marginTop: "1.8rem", flexWrap: "wrap" }}>
            <Link href="/dashboard" style={{ padding: "0.85rem 1.5rem", borderRadius: 999, background: "var(--clay)", color: "#fff", fontWeight: 600, fontSize: "0.92rem", textDecoration: "none" }}>
              {ar ? "افتح لوحتي" : "Open my dashboard"}
            </Link>
            <button type="button" onClick={openStartProject} style={{ padding: "0.85rem 1.5rem", borderRadius: 999, border: "1px solid rgba(245,242,235,0.3)", background: "transparent", color: "var(--paper)", fontWeight: 500, fontSize: "0.92rem", cursor: "pointer", fontFamily: "var(--f-sans)" }}>
              {ar ? "ابدأ مشروعًا" : "Start a project"}
            </button>
          </div>
        </div>

        {/* Mini live tracker */}
        <div style={{ background: "rgba(245,242,235,0.05)", border: "1px solid rgba(245,242,235,0.12)", borderRadius: 18, padding: "1.4rem 1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.1rem" }}>
            <span style={{ fontFamily: "var(--f-display)", fontSize: "1.15rem", color: "var(--paper)" }}>{ar ? "غرفة المعيشة — فيلا" : "Living Room — Villa"}</span>
            <span style={{ fontSize: "0.68rem", color: "var(--brass)", border: "1px solid rgba(201,162,93,0.4)", padding: "0.25em 0.7em", borderRadius: 999 }}>{ar ? "قيد الإنتاج" : "In production"}</span>
          </div>
          <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {JOURNEY.map((s, i) => {
              const done = i < liveIndex, active = i === liveIndex;
              return (
                <li key={s.key} style={{ display: "flex", gap: "0.8rem", alignItems: "flex-start", paddingBottom: i < JOURNEY.length - 1 ? "0.7rem" : 0 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", alignSelf: "stretch" }}>
                    <span style={{ width: 16, height: 16, borderRadius: 999, flexShrink: 0, display: "grid", placeItems: "center", fontSize: "0.55rem", color: "#fff",
                      background: done ? "var(--clay)" : active ? "var(--brass)" : "transparent", border: done || active ? "none" : "1.5px solid rgba(245,242,235,0.25)" }}>
                      {done ? "✓" : ""}
                    </span>
                    {i < JOURNEY.length - 1 && <span style={{ width: 1.5, flex: 1, background: done ? "var(--clay)" : "rgba(245,242,235,0.15)", marginTop: 2, minHeight: 14 }} />}
                  </div>
                  <span style={{ fontSize: "0.9rem", color: done || active ? "var(--paper)" : "rgba(245,242,235,0.45)", fontWeight: active ? 600 : 400, paddingTop: 1, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    {ar ? s.ar : s.en}
                    {active && <LiveDot active small />}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <style>{`@media (max-width: 760px){ .pj-finale{ grid-template-columns: 1fr !important; } }`}</style>
    </motion.div>
  );
}

function LiveDot({ active, small }: { active?: boolean; small?: boolean }) {
  const d = small ? 7 : 9;
  return (
    <span style={{ position: "relative", width: d, height: d, display: "inline-block" }}>
      <span style={{ position: "absolute", inset: 0, borderRadius: 999, background: "var(--brass)" }} />
      {active && (
        <motion.span
          style={{ position: "absolute", inset: 0, borderRadius: 999, background: "var(--brass)" }}
          animate={{ scale: [1, 2.4], opacity: [0.6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
        />
      )}
    </span>
  );
}
