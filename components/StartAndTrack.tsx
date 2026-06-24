"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useT } from "@/lib/i18n";
import { JOURNEY } from "@/lib/portal/journey";
import { openStartProject } from "@/lib/startProject";

/* ── Start & Track ─────────────────────────────────────────────────────────
 * The home page's merged showpiece. It fuses two beats into ONE story with a
 * cause→effect: you drop a flat floor plan on the left, it tilts into a faux-3D
 * preview, and that act lights up the live production tracker on the right —
 * blueprint → render → "built while you watch". A glowing flow line carries a
 * travelling spark from the upload panel into the tracker the moment a plan
 * lands, so the merge reads as a single gesture, not two stacked sections.
 *
 * Replaces CreateYour2D3D + the live-tracking finale on the home page. The
 * /how-it-works page keeps ProcessJourney's own finale. Bilingual + RTL. */

const EASE = [0.22, 1, 0.36, 1] as const;
const LIVE_INDEX = 5; // "Production & Finishing" — the current live stage

export default function StartAndTrack() {
  const { lang, dir } = useT();
  const ar = lang === "ar";
  const reduce = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);

  const [plan, setPlan] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  // How far the tracker has "lit up". -1 = dormant; climbs to LIVE_INDEX once a
  // plan is dropped, so the build visibly comes alive from the upload.
  const [progress, setProgress] = useState(-1);

  const take = (file?: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    setPlan(URL.createObjectURL(file));
  };

  // Drive the tracker forward stage-by-stage after a plan lands.
  useEffect(() => {
    if (!plan) { setProgress(-1); return; }
    if (reduce) { setProgress(LIVE_INDEX); return; }
    setProgress(-1);
    let i = -1;
    const id = setInterval(() => {
      i += 1;
      setProgress(i);
      if (i >= LIVE_INDEX) clearInterval(id);
    }, 460);
    return () => clearInterval(id);
  }, [plan, reduce]);

  const started = !!plan;

  return (
    <section id="start-track" className="st" dir={dir} lang={lang}>
      <div className="st__bg" aria-hidden>
        {!reduce && (
          <>
            <motion.span className="st__aurora st__aurora--a"
              animate={{ x: [0, 40, 0], y: [0, -30, 0], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} />
            <motion.span className="st__aurora st__aurora--b"
              animate={{ x: [0, -50, 0], y: [0, 30, 0], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }} />
          </>
        )}
        <span className="st__grain" />
      </div>

      <div className="container st__inner">
        {/* ── header ── */}
        <header className="st__head">
          <span className="eyebrow st__eyebrow">{ar ? "ابدأ وتابع" : "Create & track"}</span>
          <h2 className="display st__title">
            {ar ? "ارفع مخطّطك، وشاهد منزلك يُبنى" : "Upload your plan. Watch your home come to life."}
          </h2>
          <p className="st__lead">
            {ar
              ? "أفلت مخططك المسطّح فيتحوّل إلى نموذج ثلاثي الأبعاد مؤثّث ومُضاء — وبمجرد اعتمادك يبدأ الإنتاج، وتتابع كل مرحلة مباشرةً من لوحتك."
              : "Drop your flat plan and watch it become a furnished, lit 3D model. The moment you approve, production begins — and you follow every stage live from your dashboard."}
          </p>
        </header>

        {/* ── the merged stage: CREATE → flow → TRACK ── */}
        <div className={`st__stage ${started ? "is-started" : ""}`}>
          {/* CREATE */}
          <div className="st__create">
            <div className="st__panel-tag">
              <span className="st__panel-n">1</span>{ar ? "أنشئ" : "Create"}
            </div>

            <input ref={inputRef} type="file" accept="image/*,application/pdf" hidden
              onChange={(e) => take(e.target.files?.[0])} />

            <AnimatePresence mode="wait">
              {!plan ? (
                <motion.button
                  key="drop"
                  type="button"
                  className={`st__drop ${drag ? "is-drag" : ""}`}
                  onClick={() => inputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                  onDragLeave={() => setDrag(false)}
                  onDrop={(e) => { e.preventDefault(); setDrag(false); take(e.dataTransfer.files?.[0]); }}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                >
                  <PlanIcon />
                  <span className="st__drop-t">{ar ? "أفلت مخطّطك هنا" : "Drop your floor plan here"}</span>
                  <span className="st__drop-s">{ar ? "أو اضغط للاختيار · PNG · JPG · PDF" : "or click to browse · PNG · JPG · PDF"}</span>
                </motion.button>
              ) : (
                <motion.div key="preview" className="st__preview"
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}>
                  <figure className="st__plate st__plate--flat">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={plan} alt="" />
                    <figcaption>{ar ? "مخططك ثنائي الأبعاد" : "Your 2D plan"}</figcaption>
                  </figure>
                  <span className="st__to" aria-hidden>→</span>
                  <figure className="st__plate st__plate--iso">
                    <motion.div className="st__iso-inner"
                      animate={reduce ? undefined : { rotateX: [52, 48, 52], rotateZ: [-26, -22, -26] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={plan} alt="" />
                    </motion.div>
                    <span className="st__scan" aria-hidden />
                    <figcaption>{ar ? "معاينة ثلاثية الأبعاد" : "3D preview"}</figcaption>
                  </figure>
                  <button type="button" className="st__redo" onClick={() => setPlan(null)}>
                    {ar ? "جرّب مخططًا آخر" : "Try another plan"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <ol className="st__steps">
              {[
                ar ? "ارفع المخطط (صورة أو PDF)" : "Upload your plan (image or PDF)",
                ar ? "نُصمّمه ونؤثّثه ثلاثي الأبعاد" : "We model & furnish it in 3D",
                ar ? "تستلم عروضًا واقعية وتعتمدها" : "You get photoreal renders to approve",
              ].map((s, i) => (
                <li key={i} className="st__step"><span className="st__step-n">{i + 1}</span><span>{s}</span></li>
              ))}
            </ol>
          </div>

          {/* FLOW connector — a travelling spark fires from Create into Track */}
          <div className="st__flow" aria-hidden>
            <span className="st__flow-line" />
            {!reduce && (
              <motion.span className="st__flow-spark"
                animate={started ? { offsetDistance: ["0%", "100%"], opacity: [0, 1, 0] } : { opacity: 0 }}
                transition={started ? { duration: 1.1, ease: EASE, repeat: Infinity, repeatDelay: 1.4 } : { duration: 0.3 }} />
            )}
            <span className={`st__flow-label ${started ? "is-on" : ""}`}>{ar ? "تعتمد" : "Approve"}</span>
          </div>

          {/* TRACK */}
          <div className={`st__track ${started ? "is-live" : ""}`}>
            <div className="st__panel-tag">
              <span className="st__panel-n">2</span>{ar ? "تابع" : "Track"}
            </div>

            <div className="st__card">
              <div className="st__card-head">
                <span className="st__card-title">{ar ? "غرفة المعيشة — فيلا" : "Living Room — Villa"}</span>
                <span className={`st__badge ${started ? "is-on" : ""}`}>
                  {started ? (ar ? "قيد الإنتاج" : "In production") : (ar ? "بانتظار البدء" : "Awaiting start")}
                </span>
              </div>

              <ol className="st__journey">
                {JOURNEY.map((s, i) => {
                  const done = i < progress;
                  const active = i === progress && progress < LIVE_INDEX ? false : i === LIVE_INDEX && progress >= LIVE_INDEX;
                  const lit = i <= progress;
                  return (
                    <li key={s.key} className={`st__j ${lit ? "is-lit" : ""} ${active ? "is-active" : ""}`}>
                      <span className="st__j-rail">
                        <span className="st__j-dot">{lit && i < LIVE_INDEX ? "✓" : ""}</span>
                        {i < JOURNEY.length - 1 && <span className="st__j-line" />}
                      </span>
                      <span className="st__j-label">
                        {ar ? s.ar : s.en}
                        {active && <LiveDot />}
                      </span>
                    </li>
                  );
                })}
              </ol>

              {!started && (
                <div className="st__card-veil">
                  <span>{ar ? "ارفع مخطّطًا لتُشغّل التتبّع المباشر" : "Upload a plan to start live tracking"}</span>
                </div>
              )}
            </div>
            <span className="st__note">
              {started
                ? (ar ? "تحديثات بالصور تظهر فورًا في لوحتك" : "Photo updates appear instantly in your dashboard")
                : (ar ? "معاينة فورية — الفريق يبني النموذج الحقيقي" : "Instant preview — our team builds the real model")}
            </span>
          </div>
        </div>

        {/* ── unified CTA ── */}
        <div className="st__cta">
          <button type="button" className="btn st__btn-solid" onClick={() => inputRef.current?.click()}>
            {ar ? "ارفع مخططك" : "Upload your plan"} <span className="arrow" aria-hidden>↗</span>
          </button>
          <Link href="/dashboard" className="btn st__btn-ghost">{ar ? "افتح لوحتي" : "Open my dashboard"}</Link>
          <button type="button" onClick={openStartProject} className="btn st__btn-ghost">{ar ? "ابدأ مشروعًا" : "Start a project"}</button>
        </div>
      </div>

      <style>{`
        .st { position: relative; isolation: isolate; background: var(--ink); color: var(--paper);
          padding-block: clamp(4.5rem, 10vw, 9rem); overflow: hidden; }
        .st__bg { position: absolute; inset: 0; z-index: -1; pointer-events: none; }
        .st__aurora { position: absolute; border-radius: 50%; filter: blur(90px); }
        .st__aurora--a { width: 46vw; height: 46vw; top: -12%; inset-inline-start: -8%;
          background: radial-gradient(circle, rgba(197,160,106,0.30), transparent 65%); }
        .st__aurora--b { width: 52vw; height: 52vw; bottom: -18%; inset-inline-end: -10%;
          background: radial-gradient(circle, rgba(54,65,47,0.42), transparent 65%); }
        .st__grain { position: absolute; inset: 0; opacity: 0.05; mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }

        .st__inner { position: relative; z-index: 1; }
        .st__head { max-width: 60ch; margin-inline: auto; text-align: center; }
        .st__eyebrow { color: var(--brass-2); display: block; }
        .st__title { font-size: clamp(2.1rem, 4.8vw, 4rem); line-height: 1.04; font-weight: 360;
          color: var(--paper); margin: 1.1rem 0 0; }
        .st__lead { color: rgba(251,247,240,0.74); font-size: clamp(1rem, 1.2vw, 1.12rem);
          line-height: 1.72; max-width: 56ch; margin: 1.4rem auto 0; }

        .st__stage { display: grid; grid-template-columns: minmax(0,1fr) auto minmax(0,0.92fr);
          gap: clamp(1rem, 3vw, 2.4rem); align-items: stretch; margin-top: clamp(2.6rem, 6vw, 4.5rem); }

        .st__panel-tag { display: inline-flex; align-items: center; gap: 0.6rem; font-size: 0.72rem;
          letter-spacing: 0.16em; text-transform: uppercase; color: rgba(251,247,240,0.66); margin-bottom: 1.1rem; }
        .st__panel-n { width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center;
          font-family: var(--f-display); font-size: 0.8rem; color: var(--ink); background: var(--brass-2); }

        /* CREATE */
        .st__create { display: flex; flex-direction: column; }
        .st__drop { width: 100%; aspect-ratio: 16/10; border-radius: 16px; cursor: pointer;
          border: 1.5px dashed rgba(251,247,240,0.3); background: rgba(251,247,240,0.04);
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.6rem;
          color: var(--paper); transition: border-color .4s var(--ease), background .4s var(--ease), transform .4s var(--ease); }
        .st__drop:hover, .st__drop.is-drag { border-color: var(--brass-2); background: rgba(197,160,106,0.10); transform: translateY(-2px); }
        .st__drop-t { font-family: var(--f-display); font-size: 1.35rem; }
        .st__drop-s { font-size: 0.85rem; color: rgba(251,247,240,0.6); }

        .st__preview { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: clamp(0.5rem,1.6vw,1.1rem); }
        .st__plate { position: relative; margin: 0; border-radius: 12px; overflow: hidden; background: #11100e;
          border: 1px solid rgba(251,247,240,0.12); aspect-ratio: 4/3; }
        .st__plate img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .st__plate figcaption { position: absolute; bottom: 0; inset-inline: 0; padding: 0.5rem 0.7rem;
          font-size: 0.62rem; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(251,247,240,0.85);
          background: linear-gradient(transparent, rgba(8,6,4,0.7)); }
        .st__plate--iso { perspective: 900px; background: #0c0b09; }
        .st__iso-inner { width: 100%; height: 100%; transform-style: preserve-3d; transform: rotateX(52deg) rotateZ(-26deg); }
        .st__iso-inner img { box-shadow: 0 30px 50px rgba(0,0,0,0.5); border-radius: 4px; }
        .st__scan { position: absolute; inset: 0; pointer-events: none; height: 40%;
          background: linear-gradient(180deg, transparent 0%, rgba(197,160,106,0.25) 50%, transparent 100%);
          animation: stscan 2.6s var(--ease) infinite; }
        @keyframes stscan { 0%{ transform: translateY(-100%);} 100%{ transform: translateY(280%);} }
        .st__to { color: var(--brass-2); font-size: 1.5rem; }
        html[dir="rtl"] .st__to { transform: scaleX(-1); }
        .st__redo { grid-column: 1 / -1; justify-self: center; margin-top: 0.7rem; background: none; border: 0;
          cursor: pointer; color: rgba(251,247,240,0.7); font-size: 0.85rem; text-decoration: underline; text-underline-offset: 4px; }
        .st__redo:hover { color: var(--brass-2); }

        .st__steps { list-style: none; margin: auto 0 0; padding: 1.8rem 0 0; display: flex; flex-direction: column; gap: 0.85rem; }
        .st__step { display: flex; align-items: center; gap: 0.9rem; color: rgba(251,247,240,0.88); font-size: 0.96rem; }
        .st__step-n { flex: none; width: 27px; height: 27px; border-radius: 50%; display: grid; place-items: center;
          font-family: var(--f-display); font-size: 0.85rem; color: var(--brass-2); border: 1px solid rgba(197,160,106,0.4); }

        /* FLOW connector */
        .st__flow { position: relative; width: 64px; display: flex; align-items: center; justify-content: center; }
        .st__flow-line { position: absolute; top: 0; bottom: 0; inset-inline-start: 50%; width: 2px; transform: translateX(-50%);
          background: linear-gradient(180deg, transparent, rgba(197,160,106,0.35), transparent); }
        .st__flow-spark { position: absolute; inset-inline-start: 50%; top: 0; width: 9px; height: 9px; transform: translateX(-50%);
          border-radius: 50%; background: var(--brass-2); box-shadow: 0 0 14px 4px rgba(197,160,106,0.7);
          offset-path: path("M 0 0 V 400"); }
        .st__flow-label { position: absolute; top: 50%; inset-inline-start: 50%; transform: translate(-50%,-50%) rotate(-90deg);
          transform-origin: center; font-size: 0.62rem; letter-spacing: 0.22em; text-transform: uppercase; white-space: nowrap;
          color: rgba(251,247,240,0.4); background: var(--ink); padding: 0.3rem 0.1rem; transition: color .5s var(--ease); }
        .st__flow-label.is-on { color: var(--brass-2); }
        html[dir="rtl"] .st__flow-label { transform: translate(50%,-50%) rotate(90deg); }

        /* TRACK */
        .st__track { display: flex; flex-direction: column; }
        .st__card { position: relative; flex: 1; background: rgba(251,247,240,0.05);
          border: 1px solid rgba(251,247,240,0.12); border-radius: 18px; padding: 1.4rem 1.5rem;
          transition: border-color .6s var(--ease), box-shadow .6s var(--ease); }
        .st__track.is-live .st__card { border-color: rgba(197,160,106,0.4); box-shadow: 0 0 0 1px rgba(197,160,106,0.15), 0 30px 70px -40px rgba(197,160,106,0.5); }
        .st__card-head { display: flex; align-items: center; justify-content: space-between; gap: 0.6rem; margin-bottom: 1.2rem; }
        .st__card-title { font-family: var(--f-display); font-size: 1.12rem; color: var(--paper); }
        .st__badge { flex: none; font-size: 0.64rem; letter-spacing: 0.04em; padding: 0.28em 0.75em; border-radius: 999px;
          color: rgba(251,247,240,0.55); border: 1px solid rgba(251,247,240,0.2); transition: all .5s var(--ease); }
        .st__badge.is-on { color: var(--brass-2); border-color: rgba(197,160,106,0.5); }

        .st__journey { list-style: none; margin: 0; padding: 0; }
        .st__j { display: flex; gap: 0.85rem; align-items: flex-start; padding-bottom: 0.7rem; }
        .st__j:last-child { padding-bottom: 0; }
        .st__j-rail { display: flex; flex-direction: column; align-items: center; align-self: stretch; }
        .st__j-dot { width: 17px; height: 17px; border-radius: 50%; flex: none; display: grid; place-items: center;
          font-size: 0.56rem; color: #fff; background: transparent; border: 1.5px solid rgba(251,247,240,0.22);
          transition: background .45s var(--ease), border-color .45s var(--ease); }
        .st__j-line { width: 1.5px; flex: 1; min-height: 14px; margin-top: 2px; background: rgba(251,247,240,0.14); transition: background .45s var(--ease); }
        .st__j-label { font-size: 0.9rem; color: rgba(251,247,240,0.45); padding-top: 1px; display: flex; align-items: center; gap: 0.5rem;
          transition: color .45s var(--ease); }
        .st__j.is-lit .st__j-dot { background: var(--clay); border-color: var(--clay); }
        .st__j.is-lit .st__j-line { background: var(--clay); }
        .st__j.is-lit .st__j-label { color: var(--paper); }
        .st__j.is-active .st__j-dot { background: var(--brass); border-color: var(--brass); }
        .st__j.is-active .st__j-label { font-weight: 600; }

        .st__card-veil { position: absolute; inset: 0; border-radius: 18px; display: grid; place-items: center; text-align: center;
          padding: 1.5rem; background: linear-gradient(rgba(18,17,13,0.62), rgba(18,17,13,0.82)); backdrop-filter: blur(1.5px); }
        .st__card-veil span { font-size: 0.86rem; color: rgba(251,247,240,0.78); max-width: 22ch; line-height: 1.5; }
        .st__note { display: block; margin-top: 0.9rem; text-align: center; font-size: 0.78rem; color: rgba(251,247,240,0.5); }

        /* CTA */
        .st__cta { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.8rem; margin-top: clamp(2.4rem, 5vw, 3.6rem); }
        .st__btn-solid { background: var(--brass-2); color: var(--ink); border-color: var(--brass-2); }
        .st__btn-solid:hover { transform: translateY(-2px); filter: brightness(1.05); }
        .st__btn-ghost { background: transparent; color: var(--paper); border-color: rgba(251,247,240,0.32); }
        .st__btn-ghost:hover { background: rgba(251,247,240,0.08); border-color: var(--paper); }

        @media (max-width: 960px) {
          .st__stage { grid-template-columns: 1fr; gap: 2rem; }
          .st__flow { width: 100%; height: 56px; }
          .st__flow-line { inset-inline: 0; inset-block: auto; top: 50%; height: 2px; width: auto; transform: translateY(-50%);
            background: linear-gradient(90deg, transparent, rgba(197,160,106,0.35), transparent); }
          .st__flow-spark { offset-path: path("M 0 0 H 400"); top: 50%; inset-inline-start: 0; transform: translateY(-50%); }
          .st__flow-label { transform: translate(-50%,-50%) !important; }
          .st__steps { margin-top: 1.6rem; }
        }
        @media (prefers-reduced-motion: reduce) { .st__scan, .st__flow-spark { animation: none; } }
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
    <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="var(--brass-2)" strokeWidth="1.2" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="1.5" />
      <path d="M3 10h7M10 3v7M10 14v7M14 14h7" />
    </svg>
  );
}
