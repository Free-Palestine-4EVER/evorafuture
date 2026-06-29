"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { Magnetic, motion, useReducedMotion } from "./motion";
import { useT } from "@/lib/i18n";
import { openStartProject } from "@/lib/startProject";

const LINKS: { id: string; key: "nav_shop" | "nav_catalog" | "nav_studio" | "nav_showroom" | "nav_visit" }[] = [
  { id: "/shop", key: "nav_shop" },
  { id: "/catalog", key: "nav_catalog" },
  { id: "/studio", key: "nav_studio" },
  { id: "/showroom", key: "nav_showroom" },
  { id: "/visit", key: "nav_visit" },
];

const burgerSpring = { type: "spring", stiffness: 520, damping: 32 } as const;

export default function Nav({ pinnedSolid = false }: { pinnedSolid?: boolean }) {
  const { t, lang, toggle } = useT();
  const reduce = useReducedMotion();
  const pathname = usePathname();
  const [solid, setSolid] = useState(pinnedSolid);
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const drawerRef = useRef<HTMLDivElement>(null);

  // route match: exact, or a section parent (e.g. /shop/rooms highlights "Shop")
  const isActive = (id: string) =>
    !!pathname && (pathname === id || pathname.startsWith(id + "/"));

  // solid-on-scroll + hide-on-scroll-down / show-on-scroll-up
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (pinnedSolid) {
        setSolid(true);
      } else {
        // a tall scroll-scrubbed hero keeps the nav transparent until it releases
        const hero = document.getElementById("top");
        const tall = hero && hero.offsetHeight > window.innerHeight * 1.5;
        const threshold = tall
          ? hero!.offsetHeight - window.innerHeight * 1.1
          : window.innerHeight * 0.78;
        setSolid(y > threshold);
      }
      if (!reduce) {
        const goingDown = y > lastY.current + 2;
        const goingUp = y < lastY.current - 2;
        if (goingDown && y > 160) setHidden(true);
        else if (goingUp) setHidden(false);
      }
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pinnedSolid, reduce]);

  // close the drawer whenever the route changes (belt-and-braces with onClick)
  useEffect(() => { setOpen(false); }, [pathname]);

  // lock body scroll while the drawer is open (touch-action stops iOS rubber-band)
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    document.body.style.touchAction = open ? "none" : "";
    return () => { document.body.style.overflow = ""; document.body.style.touchAction = ""; };
  }, [open]);

  // focus-trap + Esc-to-close for the mobile drawer (a11y)
  useEffect(() => {
    if (!open) return;
    const el = drawerRef.current;
    if (!el) return;
    const focusables = () =>
      Array.from(el.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'))
        .filter((n) => n.offsetParent !== null);
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); return; }
      if (e.key !== "Tab") return;
      const f = focusables();
      if (f.length === 0) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const tone: "ink" | "paper" = solid || open ? "ink" : "paper";
  const fg = open ? "var(--ink)" : solid ? "var(--ink)" : "var(--paper)";

  return (
    <motion.header
      data-solid={solid && !open ? "true" : undefined}
      initial={false}
      animate={{ y: hidden && !open ? "-112%" : 0 }}
      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 40 }}
      style={{
        position: "fixed", insetInline: 0, top: 0, zIndex: 100,
        transition: "background .5s var(--ease), border-color .5s var(--ease)",
        background: solid && !open ? "rgba(255,255,255,0.82)" : "transparent",
        backdropFilter: solid && !open ? "saturate(1.1) blur(14px)" : "none",
        borderBottom: `1px solid ${solid && !open ? "var(--line)" : "transparent"}`,
      }}
    >
      <nav
        key={solid ? "solid" : "clear"}
        className={`container nav-bar${solid && !open ? " nav-settle" : ""}`}
        style={{ position: "relative", zIndex: 96, display: "flex", alignItems: "center", justifyContent: "space-between", height: "var(--nav-h, 78px)", color: fg }}
      >
        <a href="/" aria-label="Evora home" onClick={() => setOpen(false)}>
          <Logo tone={open ? "ink" : tone} size={0.92} />
        </a>

        <div style={{ display: "flex", alignItems: "center", gap: "clamp(1rem,2.4vw,2.4rem)" }}>
          <ul className="nav-links" style={{ display: "flex", gap: "1.9rem", listStyle: "none", margin: 0, padding: 0 }}>
            {LINKS.map((l) => (
              <li key={l.id}>
                <Magnetic strength={0.2}>
                  <a href={l.id} className="nav-link" data-active={isActive(l.id) || undefined} aria-current={isActive(l.id) ? "page" : undefined}>
                    {t(l.key)}
                  </a>
                </Magnetic>
              </li>
            ))}
            <li>
              <Magnetic strength={0.2}>
                <button type="button" onClick={openStartProject} className="nav-link">
                  {lang === "ar" ? "صمّم منزلي" : "Design my home"}
                </button>
              </Magnetic>
            </li>
            <li>
              <Magnetic strength={0.2}>
                <a href="/login" className="nav-link" data-active={isActive("/login") || undefined}>
                  {lang === "ar" ? "بوابة العملاء" : "Client Portal"}
                </a>
              </Magnetic>
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

          <Magnetic strength={0.2}>
            <a href="/visit" className="btn btn-ghost nav-book" style={{ borderColor: solid ? "var(--line)" : "rgba(251,247,240,0.5)", color: fg }}>
              {t("nav_book")}
            </a>
          </Magnetic>

          <button className="nav-burger" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="evora-mobile-menu" onClick={() => setOpen((o) => !o)}
            style={{ background: "transparent", border: "none", cursor: "none", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
            <span style={{ position: "relative", width: 30, height: 22, display: "block" }}>
              <motion.span animate={{ top: open ? 10 : 3, rotate: open ? 45 : 0 }} transition={reduce ? { duration: 0 } : burgerSpring}
                style={{ position: "absolute", left: 0, right: 0, height: 1.6, background: fg, top: 3, transformOrigin: "center" }} />
              <motion.span animate={{ opacity: open ? 0 : 1, scaleX: open ? 0 : 1 }} transition={reduce ? { duration: 0 } : { duration: 0.2 }}
                style={{ position: "absolute", left: 0, right: 0, height: 1.6, background: fg, top: 10 }} />
              <motion.span animate={{ top: open ? 10 : 17, rotate: open ? -45 : 0 }} transition={reduce ? { duration: 0 } : burgerSpring}
                style={{ position: "absolute", left: 0, right: 0, height: 1.6, background: fg, top: 17, transformOrigin: "center" }} />
            </span>
          </button>
        </div>
      </nav>

      {/* mobile overlay */}
      <div ref={drawerRef} id="evora-mobile-menu" className="mobile-menu" role="dialog" aria-modal={open || undefined} aria-label={lang === "ar" ? "القائمة" : "Menu"} aria-hidden={!open}
        style={{
          position: "fixed", inset: 0, zIndex: 95, background: "var(--paper)",
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "calc(var(--gut) + var(--safe-top)) calc(var(--gut) + var(--safe-right)) calc(var(--gut) + var(--safe-bottom)) calc(var(--gut) + var(--safe-left))",
          opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none",
          overflowY: "auto", WebkitOverflowScrolling: "touch",
          clipPath: open ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
          transition: "clip-path .6s var(--ease), opacity .4s var(--ease)",
        }}>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          {LINKS.map((l, i) => (
            <li key={l.id} style={{ overflow: "hidden" }}>
              <a href={l.id} onClick={() => setOpen(false)} className="display" aria-current={isActive(l.id) ? "page" : undefined}
                style={{
                  display: "flex", alignItems: "center", minHeight: 44, color: isActive(l.id) ? "var(--clay)" : "var(--ink)", fontSize: "clamp(2.2rem,9vw,3.6rem)", padding: "0.25rem 0",
                  transform: open ? "translateY(0)" : "translateY(110%)", opacity: open ? 1 : 0,
                  transition: `transform .7s var(--ease) ${0.12 + i * 0.07}s, opacity .7s ease ${0.12 + i * 0.07}s, color .3s var(--ease)`,
                }}>
                {t(l.key)}
              </a>
            </li>
          ))}
        </ul>
        <div style={{ marginTop: "2.5rem", display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
          <a href="/visit" onClick={() => setOpen(false)} className="btn" style={{ background: "var(--ink)", color: "var(--paper)" }}>{t("nav_book")} <span className="arrow">→</span></a>
          <button type="button" onClick={() => { setOpen(false); openStartProject(); }} className="btn" style={{ background: "var(--clay)", color: "#fff", border: "none", cursor: "pointer" }}>{lang === "ar" ? "صمّم منزلي" : "Design my home"} <span className="arrow">→</span></button>
          <a href="/login" onClick={() => setOpen(false)} className="btn" style={{ border: "1px solid var(--line)", color: "var(--ink)" }}>{lang === "ar" ? "بوابة العملاء" : "Client Portal"}</a>
          <button onClick={toggle} className="btn" style={{ border: "1px solid var(--line)", color: "var(--ink)", fontFamily: lang === "en" ? "var(--f-ar)" : "var(--font-sans)" }}>
            {lang === "en" ? "العربية" : "English"}
          </button>
        </div>
        <span style={{ marginTop: "2.5rem", color: "var(--ink-faint)", fontSize: "0.72rem", letterSpacing: "0.18em", textTransform: "uppercase" }}>{t("visit_addr")}</span>
      </div>

      <style>{`
        /* desktop link: shared base + RTL-aware animated underline */
        .nav-link {
          position: relative; display: inline-block;
          font-family: inherit; font-size: 0.82rem; font-weight: 500; letter-spacing: 0.02em;
          color: inherit; opacity: 0.82; background: transparent; border: none;
          padding: 2px 0; cursor: none; transition: opacity .35s var(--ease);
        }
        .nav-link::after {
          content: ""; position: absolute; left: 0; right: 0; bottom: -5px; height: 1px;
          background: currentColor; transform: scaleX(0); transform-origin: left center;
          transition: transform .45s var(--ease);
        }
        html[dir="rtl"] .nav-link::after { transform-origin: right center; }
        .nav-link:hover, .nav-link:focus-visible { opacity: 1; }
        .nav-link:hover::after, .nav-link:focus-visible::after { transform: scaleX(1); }
        .nav-link[data-active]::after { transform: scaleX(1); }
        .nav-link[data-active] { opacity: 1; }

        /* one-shot settle the bar gives when it goes solid */
        @keyframes navSettle { from { transform: translateY(-5px); } to { transform: translateY(0); } }
        .nav-settle { animation: navSettle .5s var(--ease); }
        @media (prefers-reduced-motion: reduce) { .nav-settle { animation: none; } }

        .nav-burger { display: none; }
        @media (max-width: 900px) {
          .nav-links { display: none !important; }
          .nav-book { display: none !important; }
          .nav-burger { display: block !important; }
        }
      `}</style>
    </motion.header>
  );
}
