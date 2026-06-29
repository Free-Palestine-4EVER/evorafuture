"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useT } from "@/lib/i18n";
import { JOURNEY } from "@/lib/portal/journey";
import { openStartProject } from "@/lib/startProject";

/* ── Start & Track ─────────────────────────────────────────────────────────
 * The home page's create + track showpiece, fully rebuilt. Two columns under
 * one promise: LEFT is a clean upload invitation that opens the real Start-a-
 * Project modal; RIGHT is the payoff — a live production card fronted by the
 * actual finished-kitchen reveal film, whose stage list lights up stage by
 * stage the moment the section comes into view. Bilingual + RTL. */

const LIVE_INDEX = 5; // "Production & Finishing" — the current live stage
const REVEAL = "/evora/kitchen/reveal.mp4";
const POSTER = "/evora/kitchen/stage-4.jpg";

export default function StartAndTrack() {
  const { lang, dir } = useT();
  const ar = lang === "ar";
  const reduce = useReducedMotion();
  const [progress, setProgress] = useState(reduce ? LIVE_INDEX : -1);
  const seen = useRef(false);

  // Light up the tracker stage-by-stage once the section enters view.
  function onView() {
    if (seen.current) return;
    seen.current = true;
    if (reduce) { setProgress(LIVE_INDEX); return; }
    let i = -1;
    const id = setInterval(() => {
      i += 1;
      setProgress(i);
      if (i >= LIVE_INDEX) clearInterval(id);
    }, 520);
  }

  const points = ar
    ? ["ارفع مخطّطك — صورة أو PDF", "نصمّمه ونؤثّثه ثلاثي الأبعاد، ثم نقدّمه بعرض واقعي", "تعتمده — ثم نصنعه وأنت تتابع كل مرحلة مباشرةً"]
    : ["Upload your plan — an image or a PDF", "We model & furnish it in 3D, then render it photoreal", "You approve — then we build it while you track every stage"];

  return (
    <section id="start-track" className="st" dir={dir} lang={lang}>
      <div className="st__bg" aria-hidden>
        {!reduce && (
          <>
            <motion.span className="st__aurora st__aurora--a"
              animate={{ x: [0, 40, 0], y: [0, -30, 0], opacity: [0.45, 0.75, 0.45] }}
              transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }} />
            <motion.span className="st__aurora st__aurora--b"
              animate={{ x: [0, -50, 0], y: [0, 30, 0], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 23, repeat: Infinity, ease: "easeInOut" }} />
          </>
        )}
        <span className="st__grain" />
      </div>

      <div className="container st__inner">
        <header className="st__head">
          <span className="st__eyebrow">{ar ? "ابدأ وتابع" : "Create & track"}</span>
          <h2 className="st__title">
            {ar ? (
              <>ارفع مخطّطك. <em>وشاهد بيتك يُبنى.</em></>
            ) : (
              <>Upload your plan. <em>Watch your home come to life.</em></>
            )}
          </h2>
          <p className="st__lead">
            {ar
              ? "من مخطّطٍ مسطّح إلى بيتٍ مؤثّثٍ واقعيٍّ بالأبعاد الثلاثية — وبمجرّد موافقتك يبدأ الإنتاج، وتتابع كل مرحلة مباشرةً من لوحتك. وافِق على الشاشة أوّلًا؛ لا نصنع شيئًا قبل ذلك."
              : "From a flat plan to a furnished, photoreal 3D home — and once you approve, production begins and every stage streams live to your dashboard. Approve on screen first; we don't cut a board until you do."}
          </p>
        </header>

        <motion.div className="st__grid" onViewportEnter={onView} viewport={{ once: true, margin: "0px 0px -18% 0px" }}>
          {/* ── LEFT · Create ── */}
          <div className="st__create">
            <span className="st__tag"><b>01</b>{ar ? "أنشئ" : "Create"}</span>

            <button
              type="button"
              className="st__drop"
              onClick={openStartProject}
              onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("is-drag"); }}
              onDragLeave={(e) => e.currentTarget.classList.remove("is-drag")}
              onDrop={(e) => { e.preventDefault(); e.currentTarget.classList.remove("is-drag"); openStartProject(); }}
            >
              <span className="st__drop-ic"><PlanIcon /></span>
              <span className="st__drop-t">{ar ? "أفلت مخطّطك هنا" : "Drop your floor plan here"}</span>
              <span className="st__drop-s">{ar ? "أو اضغط للرفع · PNG · JPG · PDF" : "or tap to upload · PNG · JPG · PDF"}</span>
            </button>

            <ul className="st__points">
              {points.map((p, i) => (
                <li key={i} className="st__point">
                  <span className="st__point-n">{i + 1}</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>

            <div className="st__cta">
              <button type="button" className="st__btn st__btn--solid" onClick={openStartProject}>
                {ar ? "ارفع مخططك" : "Upload your plan"} <span className="arrow" aria-hidden>↗</span>
              </button>
              <button type="button" className="st__btn st__btn--ghost" onClick={openStartProject}>
                {ar ? "ابدأ مشروعًا" : "Start a project"}
              </button>
            </div>
          </div>

          {/* ── RIGHT · Track ── */}
          <div className="st__track">
            <span className="st__tag"><b>02</b>{ar ? "تابع" : "Track"}</span>

            <div className="st__card">
              <figure className="st__film">
                <video src={REVEAL} poster={POSTER} autoPlay muted loop playsInline preload="metadata" />
                <figcaption><LiveDot /> {ar ? "معاينة حيّة · نموذجك الحقيقي" : "Live preview · your real model"}</figcaption>
              </figure>

              <div className="st__card-head">
                <span className="st__card-title">{ar ? "غرفة المعيشة — فيلا" : "Living Room — Villa"}</span>
                <span className="st__badge">{ar ? "قيد الإنتاج" : "In production"}</span>
              </div>

              <ol className="st__journey">
                {JOURNEY.map((s, i) => {
                  const lit = i <= progress;
                  const isActive = i === LIVE_INDEX && progress >= LIVE_INDEX;
                  return (
                    <li key={s.key} className={`st__j${lit ? " is-lit" : ""}${isActive ? " is-active" : ""}`}>
                      <span className="st__j-rail">
                        <span className="st__j-dot">{lit && i < LIVE_INDEX ? "✓" : ""}</span>
                        {i < JOURNEY.length - 1 && <span className="st__j-line" />}
                      </span>
                      <span className="st__j-label">
                        {ar ? s.ar : s.en}
                        {isActive && <LiveDot />}
                      </span>
                    </li>
                  );
                })}
              </ol>

              <Link href="/dashboard" className="st__dash">
                {ar ? "افتح لوحتي" : "Open my dashboard"} <span className="arrow" aria-hidden>{ar ? "←" : "→"}</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        .st { position: relative; isolation: isolate; background: var(--ink); color: var(--paper);
          padding-block: clamp(4.5rem, 10vw, 9rem); overflow: hidden; }
        .st__bg { position: absolute; inset: 0; z-index: -1; pointer-events: none; }
        .st__aurora { position: absolute; border-radius: 50%; filter: blur(95px); }
        .st__aurora--a { width: 46vw; height: 46vw; top: -14%; inset-inline-start: -8%;
          background: radial-gradient(circle, rgba(197,160,106,0.30), transparent 65%); }
        .st__aurora--b { width: 54vw; height: 54vw; bottom: -20%; inset-inline-end: -12%;
          background: radial-gradient(circle, rgba(54,65,47,0.42), transparent 65%); }
        .st__grain { position: absolute; inset: 0; opacity: 0.05; mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }

        .st__inner { position: relative; z-index: 1; }

        /* Header */
        .st__head { max-width: 62ch; }
        .st__eyebrow { font-family: var(--f-sans); font-size: 0.72rem; font-weight: 600;
          letter-spacing: 0.26em; text-transform: uppercase; color: var(--brass-2); }
        .st__title { font-family: var(--f-display), Georgia, serif; font-optical-sizing: auto;
          font-variation-settings: "opsz" 140, "SOFT" 0, "WONK" 1; font-weight: 340;
          font-size: clamp(2.2rem, 5.2vw, 4.2rem); line-height: 1.0; letter-spacing: -0.02em;
          color: var(--paper); margin: 1rem 0 0; text-wrap: balance; }
        .st__title em { font-style: italic; font-variation-settings: "opsz" 140, "SOFT" 60, "WONK" 1;
          color: var(--brass); }
        .st__lead { font-family: var(--f-sans); color: rgba(251,247,240,0.74);
          font-size: clamp(1rem, 1.25vw, 1.14rem); line-height: 1.7; max-width: 56ch; margin: 1.3rem 0 0; }

        /* Grid */
        .st__grid { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr);
          gap: clamp(1.4rem, 4vw, 3.4rem); align-items: stretch; margin-top: clamp(2.6rem, 6vw, 4.5rem); }
        .st__tag { display: inline-flex; align-items: center; gap: 0.7rem; font-family: var(--f-sans);
          font-size: 0.72rem; letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(251,247,240,0.62); margin-bottom: 1.2rem; }
        .st__tag b { width: 24px; height: 24px; border-radius: 50%; display: grid; place-items: center;
          font-family: var(--f-display); font-size: 0.82rem; color: var(--ink); background: var(--brass); font-weight: 600; }

        /* LEFT — Create */
        .st__create { display: flex; flex-direction: column; }
        .st__drop { width: 100%; aspect-ratio: 16/9; border-radius: 18px; cursor: pointer;
          border: 1.5px dashed rgba(251,247,240,0.28); background: rgba(251,247,240,0.04);
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.55rem;
          color: var(--paper); text-align: center; padding: 1.4rem;
          transition: border-color .4s var(--ease), background .4s var(--ease), transform .4s var(--ease); }
        .st__drop:hover, .st__drop.is-drag { border-color: var(--brass); background: rgba(197,160,106,0.1); transform: translateY(-2px); }
        .st__drop-ic { width: 60px; height: 60px; border-radius: 16px; display: grid; place-items: center;
          background: rgba(197,160,106,0.14); margin-bottom: 0.3rem; }
        .st__drop-t { font-family: var(--f-display), Georgia, serif; font-size: clamp(1.25rem, 2.4vw, 1.6rem); }
        .st__drop-s { font-family: var(--f-sans); font-size: 0.84rem; color: rgba(251,247,240,0.6); }

        .st__points { list-style: none; margin: 1.6rem 0 0; padding: 0; display: flex; flex-direction: column; gap: 0.9rem; }
        .st__point { display: flex; align-items: flex-start; gap: 0.85rem; font-family: var(--f-sans);
          color: rgba(251,247,240,0.86); font-size: 0.98rem; line-height: 1.5; }
        .st__point-n { flex: none; width: 26px; height: 26px; border-radius: 50%; display: grid; place-items: center;
          font-family: var(--f-display); font-size: 0.82rem; color: var(--brass); border: 1px solid rgba(197,160,106,0.45); }

        .st__cta { display: flex; flex-wrap: wrap; gap: 0.7rem; margin-top: auto; padding-top: 1.8rem; }
        .st__btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.95rem 1.6rem;
          border-radius: 999px; font-family: var(--f-sans); font-weight: 600; font-size: 0.92rem; cursor: pointer;
          border: 1px solid transparent; transition: transform .25s ease, background .25s ease, border-color .25s ease, filter .25s ease; }
        .st__btn--solid { background: var(--brass); color: var(--ink); }
        .st__btn--solid:hover { transform: translateY(-2px); filter: brightness(1.05); }
        .st__btn--ghost { background: transparent; color: var(--paper); border-color: rgba(251,247,240,0.32); }
        .st__btn--ghost:hover { background: rgba(251,247,240,0.08); border-color: var(--paper); }

        /* RIGHT — Track */
        .st__track { display: flex; flex-direction: column; }
        .st__card { flex: 1; background: rgba(251,247,240,0.05); border: 1px solid rgba(197,160,106,0.38);
          border-radius: 20px; padding: 1.1rem 1.2rem 1.3rem;
          box-shadow: 0 0 0 1px rgba(197,160,106,0.12), 0 40px 90px -50px rgba(197,160,106,0.5); }
        .st__film { position: relative; margin: 0 0 1.2rem; border-radius: 14px; overflow: hidden;
          aspect-ratio: 16/10; background: #0c0b09; border: 1px solid rgba(251,247,240,0.1); }
        .st__film video { width: 100%; height: 100%; object-fit: cover; display: block; }
        .st__film figcaption { position: absolute; left: 0; bottom: 0; right: 0; display: flex; align-items: center; gap: 0.5rem;
          padding: 0.6rem 0.8rem; font-family: var(--f-sans); font-size: 0.7rem; letter-spacing: 0.05em;
          text-transform: uppercase; color: rgba(251,247,240,0.9);
          background: linear-gradient(transparent, rgba(8,6,4,0.78)); }
        .st__card-head { display: flex; align-items: center; justify-content: space-between; gap: 0.6rem; margin-bottom: 1.1rem; }
        .st__card-title { font-family: var(--f-display), Georgia, serif; font-size: 1.12rem; color: var(--paper); }
        .st__badge { flex: none; font-family: var(--f-sans); font-size: 0.64rem; letter-spacing: 0.05em;
          padding: 0.3em 0.8em; border-radius: 999px; color: var(--brass); border: 1px solid rgba(197,160,106,0.5); }

        .st__journey { list-style: none; margin: 0; padding: 0; }
        .st__j { display: flex; gap: 0.85rem; align-items: flex-start; padding-bottom: 0.65rem; }
        .st__j:last-child { padding-bottom: 0; }
        .st__j-rail { display: flex; flex-direction: column; align-items: center; align-self: stretch; }
        .st__j-dot { width: 17px; height: 17px; border-radius: 50%; flex: none; display: grid; place-items: center;
          font-size: 0.56rem; color: #fff; background: transparent; border: 1.5px solid rgba(251,247,240,0.22);
          transition: background .45s var(--ease), border-color .45s var(--ease); }
        .st__j-line { width: 1.5px; flex: 1; min-height: 13px; margin-top: 2px; background: rgba(251,247,240,0.14); transition: background .45s var(--ease); }
        .st__j-label { font-family: var(--f-sans); font-size: 0.9rem; color: rgba(251,247,240,0.45); padding-top: 1px;
          display: flex; align-items: center; gap: 0.5rem; transition: color .45s var(--ease); }
        .st__j.is-lit .st__j-dot { background: var(--clay); border-color: var(--clay); }
        .st__j.is-lit .st__j-line { background: var(--clay); }
        .st__j.is-lit .st__j-label { color: var(--paper); }
        .st__j.is-active .st__j-dot { background: var(--brass); border-color: var(--brass); }
        .st__j.is-active .st__j-label { font-weight: 600; }

        .st__dash { display: inline-flex; align-items: center; gap: 0.5rem; margin-top: 1.3rem;
          font-family: var(--f-sans); font-weight: 600; font-size: 0.88rem; color: var(--brass);
          text-decoration: none; transition: gap .25s ease, color .25s ease; }
        .st__dash:hover { gap: 0.75rem; color: var(--paper); }

        @media (max-width: 900px) {
          .st__grid { grid-template-columns: 1fr; gap: 2.4rem; }
          .st__cta { margin-top: 1.6rem; }
        }
        @media (prefers-reduced-motion: reduce) {
          .st__film video { /* still frame via poster */ }
        }
      `}</style>
    </section>
  );
}

function LiveDot() {
  return (
    <span style={{ position: "relative", width: 7, height: 7, display: "inline-block" }}>
      <span style={{ position: "absolute", inset: 0, borderRadius: 999, background: "var(--brass)" }} />
      <motion.span
        style={{ position: "absolute", inset: 0, borderRadius: 999, background: "var(--brass)" }}
        animate={{ scale: [1, 2.4], opacity: [0.6, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
      />
    </span>
  );
}

function PlanIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--brass)" strokeWidth="1.3" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="1.5" />
      <path d="M3 10h7M10 3v7M10 14v7M14 14h7" />
    </svg>
  );
}
