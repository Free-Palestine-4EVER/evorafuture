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
const SPRING = { type: "spring", stiffness: 320, damping: 34 } as const;

// A short closing line per step — adds bite under the data copy.
const TAGLINES = [
  { en: "Walls, rooms, dimensions — nothing else yet.", ar: "جدران وغرف وأبعاد — لا شيء آخر بعد." },
  { en: "Every piece placed to scale, to how you live.", ar: "كل قطعة موضوعة بالمقاس، وبأسلوب حياتك." },
  { en: "Walk it, spin it, see it from any angle.", ar: "تجوّل فيه، أدِره، شاهده من أي زاوية." },
  { en: "Approve once — then we build it for real.", ar: "اعتمده مرة — ثم نصنعه على الحقيقة." },
];

export default function ProcessJourney({ showFinale = true }: { showFinale?: boolean }) {
  const { lang, dir } = useT();
  const ar = lang === "ar";
  const [active, setActive] = useState(0);

  // Panel springs side-to-side: even steps (0,2) → LEFT, odd (1,3) → RIGHT.
  const panelRight = active % 2 === 1;

  return (
    <section dir={dir} style={{ position: "relative", paddingTop: "clamp(4rem,9vw,7rem)" }}>
      {/* Header */}
      <div className="container pj-head">
        <Rise>
          <span className="pj-kicker">
            <span className="pj-kicker-rule" />
            {ar ? "كيف تعمل إيفورا" : "How Evora works"}
            <span className="pj-kicker-rule" />
          </span>
        </Rise>
        <Rise delay={0.06} as="h2" className="pj-title">
          {ar ? (
            <>مخطّطٌ مسطّح، <em>يصبح منزلك.</em></>
          ) : (
            <>A flat plan, <em>made your home.</em></>
          )}
        </Rise>
        <Rise delay={0.12} as="p" className="pj-lede">
          {ar
            ? "أربع خطوات فقط: ترسل مخطّطك، فنؤثّثه ونبنيه ثلاثي الأبعاد ونقدّمه بعرض واقعي تعتمده — ثم نصنعه وأنت تتابع كل مرحلة مباشرةً."
            : "Four moves: you send a plan, we furnish it, rebuild it in 3D and render it photoreal for your sign-off — then we build it while you watch every stage."}
        </Rise>
        <Rise delay={0.18}>
          <span className="pj-free">
            <span className="pj-free-dot" aria-hidden />
            {ar
              ? "خدمة التصميم الداخلي الكاملة — مجانًا لعملاء المعرض"
              : "The full interior-design service — complimentary for showroom clients"}
          </span>
        </Rise>
      </div>

      {/* ---- Left↔right swap-column scroll ---- */}
      <div className="pj-swap container">
        {/* Sticky panel that springs side-to-side (desktop only) */}
        <div className="pj-sticky">
          <motion.div className="pj-panel" animate={{ left: panelRight ? "42%" : "0%" }} transition={SPRING}>
            <TransformStage step={active} ar={ar} />
          </motion.div>
        </div>

        {/* Steps share the sticky panel's space, pulled up over it */}
        <div className="pj-offset" />

        {processSteps.map((step, i) => {
          const textRight = i % 2 === 0; // panel left → text right, and vice-versa
          return (
            <motion.section
              key={step.n}
              className="pj-step"
              onViewportEnter={() => setActive(i)}
              viewport={{ margin: "-50% 0px -50% 0px", amount: 0 }}
              style={{ justifyContent: textRight ? "flex-end" : "flex-start" }}
            >
              <div className={`pj-step-text${i === active ? " is-active" : ""}`}>
                <span className="pj-step-ghost" aria-hidden>{step.n}</span>
                <span className="pj-step-eyebrow">
                  {ar ? "المرحلة" : "Stage"} <b>{step.n}</b>
                  <i />
                  {ar ? "من ٠٤" : "of 04"}
                </span>
                <h3 className="pj-step-title">{step.title[lang]}</h3>
                <p className="pj-step-body">{step.body[lang]}</p>
                <span className="pj-step-tag">{ar ? TAGLINES[i].ar : TAGLINES[i].en}</span>
                {/* Mobile inline visual (sticky panel hidden < 860px) */}
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
        /* ---------- Header ---------- */
        .pj-head { max-width: 64ch; margin-inline: auto; text-align: center; }
        .pj-kicker {
          display: inline-flex; align-items: center; gap: 0.85rem;
          font-family: var(--f-sans);
          font-size: 0.72rem; font-weight: 600;
          letter-spacing: 0.26em; text-transform: uppercase;
          color: var(--brass-2, #8a6d3f);
        }
        .pj-kicker-rule {
          display: inline-block; width: clamp(28px, 6vw, 56px); height: 1px;
          background: linear-gradient(to right, var(--brass), transparent);
        }
        html[dir="rtl"] .pj-kicker-rule { background: linear-gradient(to left, var(--brass), transparent); }
        .pj-title {
          font-family: var(--f-display), Georgia, serif;
          font-optical-sizing: auto;
          font-variation-settings: "opsz" 140, "SOFT" 0, "WONK" 1;
          font-weight: 340;
          font-size: clamp(2.4rem, 5.6vw, 4.5rem);
          line-height: 0.99; letter-spacing: -0.022em;
          margin: 1.1rem 0 0; color: var(--ink); text-wrap: balance;
        }
        .pj-title em {
          font-style: italic;
          font-variation-settings: "opsz" 140, "SOFT" 60, "WONK" 1;
          color: var(--ever, #2f5d4a);
        }
        .pj-lede {
          max-width: 54ch; margin: 1.4rem auto 0;
          font-family: var(--f-sans); color: var(--ink-soft);
          font-size: clamp(1.02rem, 1.35vw, 1.16rem); line-height: 1.7;
          text-wrap: pretty;
        }
        .pj-free {
          display: inline-flex; align-items: center; gap: 0.6rem;
          margin-top: 1.5rem; padding: 0.55rem 1.1rem;
          font-family: var(--f-sans); font-size: 0.8rem; font-weight: 600;
          letter-spacing: 0.04em; color: var(--ever, #2f5d4a);
          background: color-mix(in srgb, var(--ever, #2f5d4a) 8%, transparent);
          border: 1px solid color-mix(in srgb, var(--ever, #2f5d4a) 26%, transparent);
          border-radius: 999px; text-wrap: balance;
        }
        .pj-free-dot { width: 7px; height: 7px; border-radius: 999px; background: var(--ever, #2f5d4a); flex: 0 0 auto; }

        /* ---------- Left↔right swap-column scroll ---------- */
        .pj-swap { position: relative; margin-top: clamp(2rem, 5vw, 4rem); }
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

        /* ---------- Step text ---------- */
        .pj-step-text {
          position: relative; width: 38%;
          opacity: 0.4; transition: opacity .5s ease;
        }
        .pj-step-text.is-active { opacity: 1; }
        .pj-step-ghost {
          position: absolute; z-index: -1;
          inset-block-start: -0.46em; inset-inline-start: -0.06em;
          font-family: var(--f-display), Georgia, serif;
          font-optical-sizing: auto; font-variation-settings: "opsz" 144, "WONK" 1;
          font-size: clamp(8rem, 15vw, 13rem);
          line-height: 0.78; font-weight: 360;
          color: var(--brass); opacity: 0.1;
          pointer-events: none; user-select: none;
        }
        .pj-step-eyebrow {
          display: inline-flex; align-items: center; gap: 0.6rem;
          font-family: var(--f-sans); font-size: 0.72rem; font-weight: 600;
          letter-spacing: 0.18em; text-transform: uppercase; color: var(--brass-2);
        }
        .pj-step-eyebrow b { color: var(--clay); font-weight: 700; }
        .pj-step-eyebrow i { width: 26px; height: 1px; background: var(--line); display: inline-block; }
        .pj-step-title {
          font-family: var(--f-display), Georgia, serif;
          font-optical-sizing: auto; font-variation-settings: "opsz" 90, "SOFT" 40;
          font-weight: 360; font-size: clamp(1.9rem, 4vw, 3.1rem);
          line-height: 1.04; letter-spacing: -0.018em; color: var(--ink);
          margin: 0.9rem 0 0.8rem; text-wrap: balance;
        }
        .pj-step-body {
          font-family: var(--f-sans); color: var(--ink-soft);
          font-size: clamp(1.02rem, 1.3vw, 1.12rem); line-height: 1.72;
          max-width: 40ch; text-wrap: pretty;
        }
        .pj-step-tag {
          display: block; margin-top: 1.1rem; padding-inline-start: 0.9rem;
          border-inline-start: 2px solid var(--brass);
          font-family: var(--f-display), Georgia, serif; font-style: italic;
          font-variation-settings: "opsz" 40, "SOFT" 60;
          font-size: clamp(1.02rem, 1.5vw, 1.22rem); line-height: 1.4;
          color: var(--ever, #2f5d4a);
        }
        .pj-step-media-mobile { display: none; margin-top: 1.6rem; }

        @media (max-width: 860px) {
          .pj-sticky, .pj-offset { display: none; }
          .pj-step { min-height: auto; padding-block: 2.4rem; justify-content: stretch !important; }
          .pj-step-text { width: 100%; opacity: 1; }
          .pj-step-ghost { font-size: clamp(6rem, 22vw, 9rem); }
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
