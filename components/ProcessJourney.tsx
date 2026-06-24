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

export default function ProcessJourney({ showFinale = true }: { showFinale?: boolean }) {
  const { lang, dir } = useT();
  const ar = lang === "ar";
  const [active, setActive] = useState(0);

  return (
    <section dir={dir} style={{ position: "relative", paddingTop: "clamp(4rem,9vw,7rem)" }}>
      {/* Header */}
      <div className="container pj-head">
        <Rise>
          <span className="pj-kicker">
            <span className="pj-kicker-rule" />
            {ar ? "كيف تعمل إيفورا" : "How Evora works"}
          </span>
        </Rise>
        <Rise delay={0.06} as="h2" className="pj-title">
          {ar ? (
            <>من مخطط مسطّح <em>إلى منزلك المكتمل</em></>
          ) : (
            <>From a flat plan <em>to your finished home</em></>
          )}
        </Rise>
        <Rise delay={0.12} as="p" className="pj-lede">
          {ar
            ? "لا تخمين في صالة العرض. أرسل مخططك، ونحوّله أمام عينيك خلال أربع خطوات — مؤثّثًا، مبنيًا ثلاثي الأبعاد، ومُقدّمًا بعرض واقعي لتعتمده."
            : "No showroom guesswork. Send your floor plan and watch it become a finished home in four moves — furnished, rebuilt in 3D, and rendered photoreal for your sign-off."}
        </Rise>
      </div>

      {/* ---- Sticky image + scrolling step timeline ---- */}
      <div className="container pj-grid">
        {/* Left: pinned kitchen film + clickable progress track */}
        <div className="pj-visual">
          <div className="pj-visual-inner">
            <TransformStage step={active} ar={ar} />
            <div className="pj-track" role="tablist" aria-label={ar ? "المراحل" : "Stages"}>
              {processSteps.map((st, i) => (
                <button
                  key={st.n}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  aria-label={st.title[lang]}
                  className={`pj-track-seg${i <= active ? " on" : ""}${i === active ? " now" : ""}`}
                  onClick={() => setActive(i)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right: timeline of step cards */}
        <ol className="pj-steps">
          {processSteps.map((step, i) => {
            const done = i < active;
            return (
              <motion.li
                key={step.n}
                className={`pj-card${i === active ? " is-active" : ""}${done ? " is-done" : ""}`}
                onViewportEnter={() => setActive(i)}
                viewport={{ margin: "-45% 0px -45% 0px", amount: 0.2 }}
              >
                <div className="pj-card-rail" aria-hidden>
                  <span className="pj-card-badge">{done ? "✓" : step.n}</span>
                  {i < processSteps.length - 1 && <span className="pj-card-line" />}
                </div>
                <div className="pj-card-main">
                  <span className="pj-card-meta">
                    {ar ? `الخطوة ${step.n}` : `Step ${step.n}`}
                    <i />
                    {ar ? "من ٠٤" : "of 04"}
                  </span>
                  <h3 className="pj-card-title">{step.title[lang]}</h3>
                  <p className="pj-card-body">{step.body[lang]}</p>
                  {/* Mobile inline visual (sticky image hidden < 900px) */}
                  <div className="pj-card-media">
                    <TransformStage step={i} ar={ar} />
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ol>
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
        .pj-head { max-width: 62ch; }
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
          max-width: 50ch; margin-top: 1.4rem;
          font-family: var(--f-sans); color: var(--ink-soft);
          font-size: clamp(1.02rem, 1.35vw, 1.16rem); line-height: 1.7;
          text-wrap: pretty;
        }

        /* ---------- Sticky visual + timeline grid ---------- */
        .pj-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.02fr) minmax(0, 0.98fr);
          gap: clamp(2rem, 5vw, 5.5rem);
          margin-top: clamp(2.6rem, 5vw, 4.5rem);
        }
        .pj-visual-inner { position: sticky; top: clamp(84px, 13vh, 150px); }
        .pj-track { display: flex; gap: 8px; margin-top: 18px; }
        .pj-track-seg {
          flex: 1; height: 5px; padding: 0; border: none; cursor: pointer;
          border-radius: 999px; background: var(--line);
          transition: background .45s ease, transform .45s ease;
        }
        .pj-track-seg.on { background: var(--brass); }
        .pj-track-seg.now { transform: scaleY(1.5); }

        /* ---------- Step cards ---------- */
        .pj-steps { list-style: none; margin: 0; padding: 0; }
        .pj-card {
          display: grid;
          grid-template-columns: 48px minmax(0, 1fr);
          gap: clamp(1rem, 2vw, 1.5rem);
        }
        .pj-card-rail { display: flex; flex-direction: column; align-items: center; }
        .pj-card-badge {
          flex: none; width: 46px; height: 46px; border-radius: 999px;
          display: grid; place-items: center;
          font-family: var(--f-display), Georgia, serif; font-size: 1.15rem; font-weight: 420;
          background: #fff; border: 1.5px solid var(--line); color: var(--ink-soft);
          transition: background .4s ease, border-color .4s ease, color .4s ease, box-shadow .4s ease;
        }
        .pj-card.is-active .pj-card-badge {
          border-color: var(--brass); color: var(--ink);
          box-shadow: 0 0 0 4px rgba(176,141,87,0.16);
        }
        .pj-card.is-done .pj-card-badge { background: var(--brass); border-color: var(--brass); color: #fff; }
        .pj-card-line {
          flex: 1; width: 2px; margin: 8px 0; min-height: clamp(1.8rem, 5vh, 4rem);
          background: var(--line); transition: background .5s ease;
        }
        .pj-card.is-done .pj-card-line { background: var(--brass); }
        .pj-card-main {
          padding-bottom: clamp(1.8rem, 6vh, 4.5rem); max-width: 46ch;
          transition: opacity .45s ease;
        }
        .pj-card:not(.is-active) .pj-card-main { opacity: 0.5; }
        .pj-card-meta {
          display: inline-flex; align-items: center; gap: 0.6rem;
          font-family: var(--f-sans); font-size: 0.72rem; font-weight: 600;
          letter-spacing: 0.14em; text-transform: uppercase; color: var(--brass-2);
        }
        .pj-card-meta i { width: 22px; height: 1px; background: var(--line); display: inline-block; }
        .pj-card-title {
          font-family: var(--f-display), Georgia, serif;
          font-optical-sizing: auto; font-variation-settings: "opsz" 60, "SOFT" 40;
          font-weight: 380; font-size: clamp(1.5rem, 2.9vw, 2.15rem);
          line-height: 1.08; letter-spacing: -0.012em; color: var(--ink);
          margin: 0.7rem 0 0.6rem; text-wrap: balance;
        }
        .pj-card-body {
          font-family: var(--f-sans); color: var(--ink-soft);
          font-size: clamp(1rem, 1.25vw, 1.06rem); line-height: 1.7; text-wrap: pretty;
        }
        .pj-card-media { display: none; margin-top: 1.3rem; }

        @media (max-width: 900px) {
          .pj-grid { grid-template-columns: 1fr; gap: 0; margin-top: 2.2rem; }
          .pj-visual { display: none; }
          .pj-card { grid-template-columns: 40px minmax(0, 1fr); }
          .pj-card-badge { width: 40px; height: 40px; font-size: 1rem; }
          .pj-card-main { opacity: 1 !important; padding-bottom: 2.4rem; }
          .pj-card-media { display: block; }
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
