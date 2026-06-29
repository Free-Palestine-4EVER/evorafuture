"use client";

import { useT } from "@/lib/i18n";
import { marqueeItems } from "@/lib/data";

export default function Marquee() {
  const { lang } = useT();
  const items = [...marqueeItems, ...marqueeItems];
  const edgeFade =
    "linear-gradient(90deg, transparent 0%, #000 9%, #000 91%, transparent 100%)";
  return (
    <div
      className="marquee marquee--ever"
      style={{
        background: "var(--paper)",
        color: "var(--ink)",
        paddingBlock: "1.05rem",
        borderBlock: "1px solid var(--line)",
        WebkitMaskImage: edgeFade,
        maskImage: edgeFade,
      }}
    >
      <div className="marquee__track" aria-hidden>
        {items.map((it, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
            <span className="marquee__item" style={{ fontFamily: "var(--font-display)", fontStyle: lang === "ar" ? "normal" : "italic", fontSize: "1.25rem", fontWeight: 400, padding: "0 1.4rem", opacity: 0.95 }}>
              {it[lang]}
            </span>
            <span style={{ color: "var(--brass-2)", fontSize: "0.7rem" }}>✦</span>
          </span>
        ))}
      </div>
      <style>{`
        .marquee--ever:hover .marquee__track { animation-play-state: paused; }
        /* denser, faster ribbon on phones so it reads in a glance without dominating */
        @media (max-width: 640px) {
          .marquee--ever .marquee__item { font-size: 1.05rem !important; padding: 0 1rem !important; }
          .marquee--ever .marquee__track { animation-duration: 28s; }
        }
      `}</style>
    </div>
  );
}
