"use client";

import { useState } from "react";
import { useT } from "@/lib/i18n";
import { shopHotspots } from "@/lib/data";
import Reveal from "./Reveal";

export default function ShoppableRoom() {
  const { t, lang } = useT();
  const [active, setActive] = useState<string | null>(shopHotspots[0].id);

  return (
    <section className="section" style={{ background: "var(--ink)", color: "var(--paper)" }}>
      <div className="container">
        <div style={{ maxWidth: 620, marginBottom: "3rem" }}>
          <Reveal><span className="eyebrow" style={{ color: "var(--brass-2)" }}>{t("shop_eyebrow")}</span></Reveal>
          <Reveal delay={80}>
            <h2 className="display" style={{ fontSize: "clamp(2.2rem, 5vw, 4.2rem)", margin: "1rem 0 0.8rem", color: "var(--paper)" }}>{t("shop_title")}</h2>
          </Reveal>
          <Reveal delay={140}><p style={{ color: "rgba(251,247,240,0.66)", maxWidth: "44ch" }}>{t("shop_sub")}</p></Reveal>
        </div>

        <Reveal delay={120}>
          <div style={{ position: "relative", aspectRatio: "16/10", overflow: "hidden", borderRadius: 4, boxShadow: "0 40px 80px -40px rgba(0,0,0,0.7)" }}>
            <img src="/evora/p11.jpg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(16,15,13,0.25), transparent 50%)" }} />

            {shopHotspots.map((h) => {
              const open = active === h.id;
              return (
                <div key={h.id} className="hs" style={{ position: "absolute", left: `${h.x * 100}%`, top: `${h.y * 100}%`, transform: "translate(-50%,-50%)", zIndex: open ? 5 : 2 }}
                  onMouseEnter={() => setActive(h.id)} onClick={() => setActive(h.id)}
                  onTouchStart={() => setActive(h.id)} data-cursor="hover">
                  <button aria-label={`${h.name[lang]} — ${h.price}`} aria-pressed={open}
                    style={{ position: "relative", width: 26, height: 26, borderRadius: "50%", border: "none", cursor: "none", background: open ? "var(--brass-2)" : "rgba(251,247,240,0.9)", display: "grid", placeItems: "center", transition: "background .35s var(--ease), transform .35s var(--ease)", transform: open ? "scale(1.12)" : "scale(1)" }}>
                    <span style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1.5px solid rgba(251,247,240,0.8)", animation: "pulse-ring 2.4s var(--ease) infinite" }} />
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--ink)" }} />
                  </button>

                  <div style={{
                    position: "absolute", bottom: "calc(100% + 12px)", left: "50%", transform: `translateX(-50%) translateY(${open ? 0 : 6}px) scale(${open ? 1 : 0.95})`, transformOrigin: "bottom center",
                    minWidth: 190, background: "rgba(251,247,240,0.97)", color: "var(--ink)", borderRadius: 4, padding: "0.85rem 1rem",
                    opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", transition: "all .4s var(--ease)", boxShadow: "0 20px 40px -16px rgba(0,0,0,0.5)",
                  }}>
                    <span style={{ display: "block", fontFamily: "var(--font-display)", fontSize: "1.05rem", lineHeight: 1.2 }}>{h.name[lang]}</span>
                    <span style={{ display: "block", marginTop: 4, fontSize: "0.85rem", fontWeight: 600, color: "var(--ever-2)" }}>{h.price}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
