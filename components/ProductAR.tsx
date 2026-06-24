"use client";

import { createElement, useEffect, useRef, useState } from "react";
import { useT } from "@/lib/i18n";
import { models } from "@/lib/data";
import { Rise, Magnetic } from "@/components/motion";

type ModelViewerEl = HTMLElement & {
  canActivateAR?: boolean;
  activateAR?: () => void;
};

export default function ProductAR() {
  const { t, lang } = useT();
  const [ready, setReady] = useState(false);
  const [idx, setIdx] = useState(0);
  const mvRef = useRef<ModelViewerEl>(null);

  useEffect(() => {
    let on = true;
    import("@google/model-viewer").then(() => on && setReady(true));
    return () => { on = false; };
  }, []);

  const m = models[idx];

  const launchAR = (e: React.MouseEvent) => {
    e.preventDefault();
    const mv = mvRef.current;
    if (mv && mv.canActivateAR && typeof mv.activateAR === "function") {
      mv.activateAR();
    } else {
      // No AR on this device/desktop — send them into the full walk-in AR showroom.
      window.location.href = "/showroom";
    }
  };

  const viewer = ready
    ? createElement("model-viewer" as unknown as string, {
        key: m.id,
        ref: mvRef,
        src: m.src,
        alt: m.name[lang],
        "camera-controls": true,
        "auto-rotate": true,
        "auto-rotate-delay": 3000,
        "rotation-per-second": "18deg",
        ar: true,
        "ar-modes": "webxr scene-viewer quick-look",
        "shadow-intensity": "1.1",
        "shadow-softness": "1",
        exposure: "1.05",
        "environment-image": "neutral",
        "camera-orbit": "30deg 78deg 105%",
        "min-camera-orbit": "auto 60deg auto",
        "interaction-prompt": "none",
        style: { width: "100%", height: "100%", backgroundColor: "transparent", "--poster-color": "transparent" } as React.CSSProperties,
      })
    : null;

  return (
    <section className="section" style={{ background: "var(--paper-2)" }}>
      <div className="container ar-grid">
        <div className="ar-copy">
          <Rise as="span" className="eyebrow" style={{ color: "var(--brass)", display: "block" }}>{t("ar_eyebrow")}</Rise>
          <Rise delay={0.08}>
            <h2 className="display" style={{ fontSize: "clamp(2.2rem, 5vw, 4.4rem)", margin: "1rem 0 0.9rem" }}>{t("ar_title")}</h2>
          </Rise>
          <Rise delay={0.14}><p style={{ color: "var(--ink-soft)", maxWidth: "42ch" }}>{t("ar_sub")}</p></Rise>

          <Rise delay={0.2}>
            <div style={{ marginTop: "2.2rem" }}>
              <div style={{ display: "flex", gap: "0.6rem", marginBottom: "1.6rem" }}>
                {models.map((mm, i) => (
                  <button key={mm.id} onClick={() => setIdx(i)} data-cursor="hover"
                    aria-pressed={i === idx} aria-label={`${lang === "en" ? "View" : "اعرض"} ${mm.name[lang]}`}
                    style={{
                      padding: "0.6em 1.1em", borderRadius: 100, cursor: "none", fontSize: "0.82rem", fontWeight: 500,
                      border: `1px solid ${i === idx ? "var(--ink)" : "var(--line)"}`,
                      background: i === idx ? "var(--ink)" : "transparent", color: i === idx ? "var(--paper)" : "var(--ink)",
                      transition: "all .3s var(--ease)",
                    }}>
                    {mm.name[lang]}
                  </button>
                ))}
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem" }}>{m.name[lang]}</div>
              <div style={{ color: "var(--ink-faint)", fontSize: "0.9rem", marginTop: 4 }}>{m.tagline[lang]}</div>

              <a href="/showroom" data-cursor="hover" className="ar-fulllink">
                {lang === "en" ? "Enter the full AR showroom" : "ادخل معرض الواقع المعزّز الكامل"} <span className="arrow">→</span>
              </a>
            </div>
          </Rise>
        </div>

        <Rise delay={0.12} className="ar-stage-wrap">
          <div className="ar-stage">
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(60% 55% at 50% 60%, rgba(54,65,47,0.10), transparent 70%)" }} />
            {viewer ?? <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "var(--ink-faint)", fontSize: "0.85rem" }}>Loading 3D…</div>}
            <div className="ar-badge">
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--clay)", boxShadow: "0 0 0 4px rgba(178,116,87,0.22)" }} />
              {t("ar_drag")}
            </div>
            <Magnetic strength={0.25} className="ar-viewbtn-wrap">
              <a className="ar-viewbtn" href="/showroom" onClick={launchAR} data-cursor="hover">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" /><path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" /></svg>
                {t("ar_view")}
              </a>
            </Magnetic>
          </div>
        </Rise>
      </div>

      <style>{`
        .ar-grid { display: grid; grid-template-columns: 0.85fr 1.15fr; gap: clamp(2rem, 5vw, 5rem); align-items: center; }
        .ar-stage { position: relative; aspect-ratio: 1/1; border-radius: 6px; background: linear-gradient(160deg, #fff, var(--bone)); border: 1px solid var(--line-soft); overflow: hidden; box-shadow: 0 40px 90px -50px rgba(0,0,0,0.35); }
        .ar-badge { position: absolute; top: 1rem; inset-inline-start: 1rem; z-index: 5; display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(251,247,240,0.85); backdrop-filter: blur(6px); border-radius: 100px; padding: 0.5rem 0.9rem; font-size: 0.72rem; letter-spacing: 0.04em; }
        .ar-viewbtn-wrap { position: absolute; bottom: 1rem; inset-inline-start: 50%; transform: translateX(-50%); z-index: 5; }
        html[dir="rtl"] .ar-viewbtn-wrap { transform: translateX(50%); }
        .ar-viewbtn { display: inline-flex; align-items: center; gap: 0.6rem; background: var(--ink); color: var(--paper); border-radius: 100px; padding: 0.85rem 1.4rem; font-size: 0.82rem; font-weight: 500; cursor: none; transition: background .3s var(--ease); white-space: nowrap; }
        .ar-viewbtn:hover { background: var(--ever); }
        .ar-fulllink { display: inline-flex; align-items: center; gap: 0.5rem; margin-top: 1.6rem; font-size: 0.82rem; font-weight: 500; color: var(--ink); border-bottom: 1px solid var(--line); padding-bottom: 3px; transition: border-color .3s var(--ease), gap .3s var(--ease); cursor: none; }
        .ar-fulllink:hover { border-color: var(--ink); }
        .ar-fulllink .arrow { transition: transform .3s var(--ease); }
        .ar-fulllink:hover .arrow { transform: translateX(4px); }
        html[dir="rtl"] .ar-fulllink .arrow { transform: scaleX(-1); }
        html[dir="rtl"] .ar-fulllink:hover .arrow { transform: translateX(-4px) scaleX(-1); }
        @media (max-width: 820px) { .ar-grid { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  );
}
