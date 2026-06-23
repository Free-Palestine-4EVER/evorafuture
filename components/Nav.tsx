"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";
import { useT } from "@/lib/i18n";

const LINKS: { id: string; key: "nav_shop" | "nav_catalog" | "nav_showroom" | "nav_visit" }[] = [
  { id: "/shop", key: "nav_shop" },
  { id: "/catalog", key: "nav_catalog" },
  { id: "/showroom", key: "nav_showroom" },
  { id: "/visit", key: "nav_visit" },
];

export default function Nav({ pinnedSolid = false }: { pinnedSolid?: boolean }) {
  const { t, lang, toggle } = useT();
  const [solid, setSolid] = useState(pinnedSolid);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (pinnedSolid) { setSolid(true); return; }
    const onScroll = () => {
      // a tall scroll-scrubbed hero keeps the nav transparent until it releases
      const hero = document.getElementById("top");
      const tall = hero && hero.offsetHeight > window.innerHeight * 1.5;
      const threshold = tall
        ? hero!.offsetHeight - window.innerHeight * 1.1
        : window.innerHeight * 0.78;
      setSolid(window.scrollY > threshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pinnedSolid]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const tone: "ink" | "paper" = solid || open ? "ink" : "paper";
  const fg = open ? "var(--ink)" : solid ? "var(--ink)" : "var(--paper)";

  return (
    <header
      style={{
        position: "fixed", insetInline: 0, top: 0, zIndex: 100,
        transition: "background .5s var(--ease), border-color .5s var(--ease)",
        background: solid && !open ? "rgba(255,255,255,0.82)" : "transparent",
        backdropFilter: solid && !open ? "saturate(1.1) blur(14px)" : "none",
        borderBottom: `1px solid ${solid && !open ? "var(--line)" : "transparent"}`,
      }}
    >
      <nav className="container" style={{ position: "relative", zIndex: 96, display: "flex", alignItems: "center", justifyContent: "space-between", height: 78, color: fg }}>
        <a href="/" aria-label="Evora home" onClick={() => setOpen(false)}>
          <Logo tone={open ? "ink" : tone} size={0.92} />
        </a>

        <div style={{ display: "flex", alignItems: "center", gap: "clamp(1rem,2.4vw,2.4rem)" }}>
          <ul className="nav-links" style={{ display: "flex", gap: "1.9rem", listStyle: "none", margin: 0, padding: 0 }}>
            {LINKS.map((l) => (
              <li key={l.id}>
                <a href={l.id} style={{ fontSize: "0.82rem", fontWeight: 500, letterSpacing: "0.02em", color: fg, opacity: 0.85 }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.85")}>
                  {t(l.key)}
                </a>
              </li>
            ))}
            <li>
              <a href="/dashboard" style={{ fontSize: "0.82rem", fontWeight: 500, letterSpacing: "0.02em", color: fg, opacity: 0.85 }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.85")}>
                {lang === "ar" ? "بوابة العملاء" : "Client Portal"}
              </a>
            </li>
          </ul>

          <button onClick={toggle} aria-label="Toggle language"
            style={{
              fontFamily: lang === "en" ? "var(--f-ar)" : "var(--font-sans)",
              fontSize: "0.82rem", fontWeight: 600, letterSpacing: lang === "en" ? "0" : "0.06em",
              color: fg, background: "transparent",
              border: `1px solid ${solid && !open ? "var(--line)" : "rgba(251,247,240,0.4)"}`,
              borderRadius: 100, padding: "0.5em 0.95em", cursor: "none", transition: "all .3s var(--ease)",
            }}>
            {lang === "en" ? "العربية" : "EN"}
          </button>

          <a href="/visit" className="btn btn-ghost nav-book" style={{ borderColor: solid ? "var(--line)" : "rgba(251,247,240,0.5)", color: fg }}>
            {t("nav_book")}
          </a>

          <button className="nav-burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}
            style={{ background: "transparent", border: "none", cursor: "none", width: 30, height: 22, position: "relative", padding: 0 }}>
            <span style={{ position: "absolute", left: 0, right: 0, height: 1.6, background: fg, top: open ? 10 : 3, transform: open ? "rotate(45deg)" : "none", transition: "all .35s var(--ease)" }} />
            <span style={{ position: "absolute", left: 0, right: 0, height: 1.6, background: fg, top: 10, opacity: open ? 0 : 1, transition: "all .25s var(--ease)" }} />
            <span style={{ position: "absolute", left: 0, right: 0, height: 1.6, background: fg, top: open ? 10 : 17, transform: open ? "rotate(-45deg)" : "none", transition: "all .35s var(--ease)" }} />
          </button>
        </div>
      </nav>

      {/* mobile overlay */}
      <div className="mobile-menu" aria-hidden={!open}
        style={{
          position: "fixed", inset: 0, zIndex: 95, background: "var(--paper)",
          display: "flex", flexDirection: "column", justifyContent: "center", padding: "var(--gut)",
          opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none",
          clipPath: open ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
          transition: "clip-path .6s var(--ease), opacity .4s var(--ease)",
        }}>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          {LINKS.map((l, i) => (
            <li key={l.id} style={{ overflow: "hidden" }}>
              <a href={l.id} onClick={() => setOpen(false)} className="display"
                style={{
                  display: "block", color: "var(--ink)", fontSize: "clamp(2.2rem,9vw,3.6rem)", padding: "0.25rem 0",
                  transform: open ? "translateY(0)" : "translateY(110%)", opacity: open ? 1 : 0,
                  transition: `transform .7s var(--ease) ${0.12 + i * 0.07}s, opacity .7s ease ${0.12 + i * 0.07}s`,
                }}>
                {t(l.key)}
              </a>
            </li>
          ))}
        </ul>
        <div style={{ marginTop: "2.5rem", display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
          <a href="/visit" onClick={() => setOpen(false)} className="btn" style={{ background: "var(--ink)", color: "var(--paper)" }}>{t("nav_book")} <span className="arrow">→</span></a>
          <a href="/dashboard" onClick={() => setOpen(false)} className="btn" style={{ border: "1px solid var(--line)", color: "var(--ink)" }}>{lang === "ar" ? "بوابة العملاء" : "Client Portal"}</a>
          <button onClick={toggle} className="btn" style={{ border: "1px solid var(--line)", color: "var(--ink)", fontFamily: lang === "en" ? "var(--f-ar)" : "var(--font-sans)" }}>
            {lang === "en" ? "العربية" : "English"}
          </button>
        </div>
        <span style={{ marginTop: "2.5rem", color: "var(--ink-faint)", fontSize: "0.72rem", letterSpacing: "0.18em", textTransform: "uppercase" }}>{t("visit_addr")}</span>
      </div>

      <style>{`
        .nav-burger { display: none; }
        @media (max-width: 900px) {
          .nav-links { display: none !important; }
          .nav-book { display: none !important; }
          .nav-burger { display: block !important; }
        }
      `}</style>
    </header>
  );
}
