"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useT } from "@/lib/i18n";

// "Create your own 2D → 3D": drop a flat floor plan and watch it tilt into a
// faux-3D preview, with a CTA to start the real project. Local-only preview
// (FileReader) — no upload server needed.
const EASE = [0.22, 1, 0.36, 1] as const;

export default function CreateYour2D3D() {
  const { lang } = useT();
  const ar = lang === "ar";
  const reduce = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const [plan, setPlan] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);

  const take = (file?: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    setPlan(URL.createObjectURL(file));
  };

  return (
    <section id="create-2d-3d" className="c23" lang={lang}>
      <div className="container c23__grid">
        {/* ── copy ── */}
        <div className="c23__copy">
          <span className="eyebrow c23__eyebrow">{ar ? "حوّل مخططك" : "Create your own"}</span>
          <h2 className="display c23__title">
            {ar ? "من مخطط ثنائي الأبعاد إلى منزل ثلاثي الأبعاد" : "Turn your 2D plan into a 3D home"}
          </h2>
          <p className="c23__lead">
            {ar
              ? "ارفع مخطط منزلك المسطّح — وسنحوّله إلى نموذج ثلاثي الأبعاد كامل بإضاءة وأثاث وعروض واقعية تعتمدها قبل التنفيذ."
              : "Upload your flat floor plan — we turn it into a full 3D model, furnished, lit and rendered photoreal for you to approve before anything is built."}
          </p>

          <ol className="c23__steps">
            {[
              ar ? "ارفع المخطط (صورة أو PDF)" : "Upload your plan (image or PDF)",
              ar ? "نُصمّمه ونؤثّثه ثلاثي الأبعاد" : "We model & furnish it in 3D",
              ar ? "تستلم عروضًا واقعية وتعتمدها" : "You get photoreal renders to approve",
            ].map((s, i) => (
              <li key={i} className="c23__step">
                <span className="c23__step-n">{i + 1}</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>

          <div className="c23__cta">
            <button type="button" className="btn c23__btn-solid" onClick={() => inputRef.current?.click()}>
              {ar ? "ارفع مخططك" : "Upload your plan"} <span className="arrow" aria-hidden>↗</span>
            </button>
            <a href="/start" className="btn c23__btn-ghost">{ar ? "ابدأ مشروعًا" : "Start a project"}</a>
          </div>
        </div>

        {/* ── interactive dropzone / preview ── */}
        <div className="c23__stage">
          <input
            ref={inputRef}
            type="file"
            accept="image/*,application/pdf"
            hidden
            onChange={(e) => take(e.target.files?.[0])}
          />

          <AnimatePresence mode="wait">
            {!plan ? (
              <motion.button
                key="drop"
                type="button"
                className={`c23__drop ${drag ? "is-drag" : ""}`}
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={(e) => { e.preventDefault(); setDrag(false); take(e.dataTransfer.files?.[0]); }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <PlanIcon />
                <span className="c23__drop-t">{ar ? "أفلت مخطّطك هنا" : "Drop your floor plan here"}</span>
                <span className="c23__drop-s">{ar ? "أو اضغط للاختيار · PNG · JPG · PDF" : "or click to browse · PNG · JPG · PDF"}</span>
              </motion.button>
            ) : (
              <motion.div
                key="preview"
                className="c23__preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* flat 2D */}
                <figure className="c23__plate c23__plate--flat">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={plan} alt="" />
                  <figcaption>{ar ? "مخططك ثنائي الأبعاد" : "Your 2D plan"}</figcaption>
                </figure>

                <span className="c23__arrow" aria-hidden>→</span>

                {/* faux-3D tilt */}
                <figure className="c23__plate c23__plate--iso">
                  <motion.div
                    className="c23__iso-inner"
                    animate={reduce ? undefined : { rotateX: [52, 48, 52], rotateZ: [-26, -22, -26] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={plan} alt="" />
                  </motion.div>
                  <span className="c23__scan" aria-hidden />
                  <figcaption>{ar ? "معاينة ثلاثية الأبعاد" : "3D preview"}</figcaption>
                </figure>

                <button type="button" className="c23__redo" onClick={() => setPlan(null)}>
                  {ar ? "جرّب مخططًا آخر" : "Try another plan"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <span className="c23__note">
            {ar ? "معاينة فورية — الفريق يبني النموذج الحقيقي" : "Instant preview — our team builds the real model"}
          </span>
        </div>
      </div>

      <style>{`
        .c23 { position: relative; background: var(--ink); color: var(--paper); padding-block: clamp(4.5rem, 10vw, 9rem); overflow: hidden; }
        .c23::before { content:""; position:absolute; inset:0; pointer-events:none;
          background: radial-gradient(70% 60% at 0% 0%, rgba(197,160,106,0.12), transparent 60%), radial-gradient(60% 60% at 100% 100%, rgba(54,65,47,0.18), transparent 60%); }
        .c23__grid { position: relative; z-index: 1; display: grid; grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr); gap: clamp(2.5rem, 6vw, 6rem); align-items: center; }

        .c23__eyebrow { color: var(--brass-2); display: block; }
        .c23__title { font-size: clamp(2.1rem, 4.6vw, 3.8rem); line-height: 1.04; font-weight: 360; color: var(--paper); margin: 1.2rem 0 0; }
        .c23__lead { color: rgba(251,247,240,0.74); font-size: clamp(1rem, 1.2vw, 1.1rem); line-height: 1.72; max-width: 46ch; margin: 1.4rem 0 0; }
        .c23__steps { list-style: none; margin: 2rem 0 0; padding: 0; display: flex; flex-direction: column; gap: 1rem; }
        .c23__step { display: flex; align-items: center; gap: 1rem; color: rgba(251,247,240,0.9); font-size: 1rem; }
        .c23__step-n { flex: none; width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center;
          font-family: var(--f-display); font-size: 0.95rem; color: var(--brass-2); border: 1px solid rgba(197,160,106,0.4); }
        .c23__cta { display: flex; flex-wrap: wrap; gap: 0.8rem; margin: 2.2rem 0 0; }
        .c23__btn-solid { background: var(--brass-2); color: var(--ink); border-color: var(--brass-2); }
        .c23__btn-solid:hover { transform: translateY(-2px); filter: brightness(1.05); }
        .c23__btn-ghost { background: transparent; color: var(--paper); border-color: rgba(251,247,240,0.32); }
        .c23__btn-ghost:hover { background: rgba(251,247,240,0.08); border-color: var(--paper); }

        /* stage */
        .c23__stage { position: relative; }
        .c23__drop {
          width: 100%; aspect-ratio: 16/11; border-radius: 16px; cursor: pointer;
          border: 1.5px dashed rgba(251,247,240,0.3); background: rgba(251,247,240,0.04);
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.6rem;
          color: var(--paper); transition: border-color .4s var(--ease), background .4s var(--ease), transform .4s var(--ease);
        }
        .c23__drop:hover, .c23__drop.is-drag { border-color: var(--brass-2); background: rgba(197,160,106,0.10); transform: translateY(-2px); }
        .c23__drop-t { font-family: var(--f-display); font-size: 1.35rem; }
        .c23__drop-s { font-size: 0.85rem; color: rgba(251,247,240,0.6); }

        .c23__preview { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: clamp(0.6rem,2vw,1.4rem); }
        .c23__plate { position: relative; margin: 0; border-radius: 12px; overflow: hidden; background: #11100e; border: 1px solid rgba(251,247,240,0.12); aspect-ratio: 4/3; }
        .c23__plate img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .c23__plate figcaption { position: absolute; bottom: 0; inset-inline: 0; padding: 0.5rem 0.7rem; font-size: 0.66rem; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(251,247,240,0.85); background: linear-gradient(transparent, rgba(8,6,4,0.7)); }
        .c23__plate--iso { perspective: 900px; background: #0c0b09; }
        .c23__iso-inner { width: 100%; height: 100%; transform-style: preserve-3d; transform: rotateX(52deg) rotateZ(-26deg); }
        .c23__iso-inner img { box-shadow: 0 30px 50px rgba(0,0,0,0.5); border-radius: 4px; }
        .c23__scan { position: absolute; inset: 0; pointer-events: none; background: linear-gradient(180deg, transparent 0%, rgba(197,160,106,0.25) 50%, transparent 100%); height: 40%; animation: c23scan 2.6s var(--ease) infinite; }
        @keyframes c23scan { 0%{ transform: translateY(-100%);} 100%{ transform: translateY(280%);} }
        .c23__arrow { color: var(--brass-2); font-size: 1.6rem; }
        html[dir="rtl"] .c23__arrow { transform: scaleX(-1); }
        .c23__redo { grid-column: 1 / -1; justify-self: center; margin-top: 0.8rem; background: none; border: 0; cursor: pointer;
          color: rgba(251,247,240,0.7); font-size: 0.85rem; text-decoration: underline; text-underline-offset: 4px; }
        .c23__redo:hover { color: var(--brass-2); }

        .c23__note { display: block; margin-top: 1rem; text-align: center; font-size: 0.78rem; color: rgba(251,247,240,0.5); }

        @media (max-width: 880px) {
          .c23__grid { grid-template-columns: 1fr; }
        }
        @media (prefers-reduced-motion: reduce) { .c23__scan { animation: none; } }
      `}</style>
    </section>
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
