"use client";

import { useT } from "@/lib/i18n";
import { Rise } from "@/components/motion";

// A real, fully navigable 3D walkthrough (Matterport). Move room to room,
// look anywhere, open the dollhouse/floor-plan views from the controls.
const TOUR_SRC =
  "https://my.matterport.com/show/?m=JGPnGQ6hosj&play=1&qs=1&brand=0&help=0&title=0";

export default function VirtualTour() {
  const { t, lang } = useT();

  return (
    <section id="tour" className="section" style={{ background: "var(--paper)", color: "var(--ink)", paddingBlock: "clamp(4rem,8vw,7rem)" }}>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem", marginBottom: "2.4rem" }}>
          <div>
            <Rise as="span" className="eyebrow" style={{ color: "var(--brass)", display: "block" }}>{t("tour_eyebrow")}</Rise>
            <Rise delay={0.08}><h2 className="display" style={{ fontSize: "clamp(2.2rem, 5.2vw, 4.4rem)", margin: "0.9rem 0 0", color: "var(--ink)" }}>{t("tour_title")}</h2></Rise>
          </div>
          <Rise delay={0.12}><p style={{ color: "var(--ink-faint)", maxWidth: "34ch", fontSize: "0.92rem" }}>{t("tour_sub")}</p></Rise>
        </div>

        <Rise delay={0.12}>
          <div className="tour-frame">
            <div className="tour-loading">{lang === "en" ? "Loading the space…" : "جارٍ تحميل المساحة…"}</div>
            <iframe
              className="tour-iframe"
              src={TOUR_SRC}
              title={lang === "en" ? "Evora — 3D virtual walkthrough" : "إيفورا — جولة ثلاثية الأبعاد"}
              allow="xr-spatial-tracking; gyroscope; accelerometer; fullscreen; vr"
              allowFullScreen
              loading="lazy"
            />
            <div className="tour-badge">
              <span className="tour-dot" />
              {lang === "en" ? "Live 3D walkthrough" : "جولة ثلاثية الأبعاد حية"}
            </div>
          </div>
        </Rise>
      </div>

      <style>{`
        .tour-frame { position: relative; aspect-ratio: 16/9; border-radius: 5px; overflow: hidden; background: #0c0b0a; box-shadow: 0 50px 100px -50px rgba(0,0,0,0.8); border: 1px solid rgba(251,247,240,0.08); }
        .tour-loading { position: absolute; inset: 0; z-index: 0; display: grid; place-items: center; color: rgba(251,247,240,0.4); font-size: 0.85rem; letter-spacing: 0.04em; }
        .tour-iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; z-index: 1; }
        .tour-badge { position: absolute; top: 1rem; inset-inline-start: 1rem; z-index: 2; display: inline-flex; align-items: center; gap: 0.55rem; background: rgba(16,15,13,0.55); backdrop-filter: blur(6px); color: rgba(251,247,240,0.92); border-radius: 100px; padding: 0.5rem 1rem; font-size: 0.7rem; letter-spacing: ${lang === "ar" ? "0" : "0.14em"}; text-transform: uppercase; pointer-events: none; }
        .tour-dot { width: 7px; height: 7px; border-radius: 50%; background: #4ade80; box-shadow: 0 0 0 0 rgba(74,222,128,0.5); animation: tourPulse 2s ease-out infinite; }
        @keyframes tourPulse { 0% { box-shadow: 0 0 0 0 rgba(74,222,128,0.5); } 70% { box-shadow: 0 0 0 8px rgba(74,222,128,0); } 100% { box-shadow: 0 0 0 0 rgba(74,222,128,0); } }
        @media (max-width: 640px) { .tour-frame { aspect-ratio: 4/3; } }
        @media (prefers-reduced-motion: reduce) { .tour-dot { animation: none; } }
      `}</style>
    </section>
  );
}
