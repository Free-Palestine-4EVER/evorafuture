"use client";

import { motion } from "framer-motion";
import { useT } from "@/lib/i18n";
import { useEffect, useState } from "react";

export default function Hero() {
  const { t, lang } = useT();
  const ease = [0.22, 1, 0.36, 1] as const;

  // Swap to the portrait mobile clip on small screens; desktop keeps the landscape film.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 860px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const up = {
    hidden: { y: "108%" },
    show: (i: number) => ({ y: "0%", transition: { duration: 1.0, ease, delay: 0.35 + i * 0.1 } }),
  };
  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, ease, delay },
  });

  return (
    <section id="top" className="hero">
      {/* FULL-BLEED VIDEO BACKGROUND — portrait clip on mobile, landscape on desktop */}
      <motion.video
        key={isMobile ? "mobile" : "desktop"}
        className="hero__video"
        autoPlay
        muted
        loop
        playsInline
        preload={isMobile ? "auto" : "none"}
        poster={isMobile ? "/evora/hero-mobile.jpg" : "/evora/p07.jpg"}
        initial={{ opacity: 0, scale: 1.06 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, ease }}
      >
        <source src={isMobile ? "/evora/hero-mobile.mp4" : "/evora/hero.mp4"} type="video/mp4" />
      </motion.video>

      {/* SCRIMS for legibility */}
      <div className="hero__scrim" />
      <div className="hero__top" />

      {/* CONTENT */}
      <div className="hero__content">
        <motion.span {...fade(0.2)} className="eyebrow" style={{ color: "var(--brass-2)", display: "block" }}>
          {t("hero_eyebrow")}
        </motion.span>

        <h1 className="display hero__title">
          {[t("hero_l1"), t("hero_l2"), t("hero_l3")].map((line, i) => (
            <span key={i} style={{ display: "block", overflow: "hidden", paddingBottom: "0.06em" }}>
              <motion.span variants={up} custom={i} initial="hidden" animate="show" style={{ display: "inline-block" }}>
                {i === 1 ? <span className="serif-i" style={{ color: "var(--brass-2)" }}>{line}</span> : line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p {...fade(0.85)} className="hero__sub">{t("hero_sub")}</motion.p>

        <motion.div {...fade(1.0)} className="hero__cta">
          <a href="/shop" className="btn hero__cta-1">{t("hero_cta1")} <span className="arrow">→</span></a>
          <a href="/showroom" className="btn hero__cta-2">{t("hero_cta2")}</a>
        </motion.div>

        <motion.div {...fade(1.15)} className="hero__meta">
          <span>103K+ {lang === "en" ? "following" : "متابع"}</span>
          <span className="hero__dot" />
          <span>{lang === "en" ? "Khalda · Amman" : "خلدا · عمّان"}</span>
          <span className="hero__dot" />
          <span>{lang === "en" ? "Est. Jordan" : "صُنع في الأردن"}</span>
        </motion.div>
      </div>

      {/* FEATURED TAG */}
      <motion.div {...fade(1.1)} className="hero__tag">
        <span className="hero__tag-k">{lang === "en" ? "Now showing" : "الآن"}</span>
        {lang === "en" ? "Inside Evora · Khalda" : "داخل إيفورا · خلدا"}
      </motion.div>

      {/* SCROLL HINT */}
      <motion.div {...fade(1.3)} className="hero__scroll">
        <span>{t("scroll")}</span>
        <span className="hero__scroll-line" />
      </motion.div>

      <style>{`
        .hero { position: relative; min-height: 100svh; background: var(--ever) url(/evora/p07.jpg) center/cover no-repeat; overflow: hidden; display: flex; align-items: center; }
        .hero__video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0; }
        .hero__scrim { position: absolute; inset: 0; z-index: 1; pointer-events: none; background:
            linear-gradient(105deg, rgba(20,26,18,0.94) 0%, rgba(27,25,22,0.74) 30%, rgba(27,25,22,0.30) 62%, rgba(27,25,22,0.10) 100%),
            radial-gradient(120% 80% at 50% 120%, rgba(16,15,13,0.55), transparent 60%); }
        .hero__top { position: absolute; inset-inline: 0; top: 0; height: 200px; z-index: 1; pointer-events: none; background: linear-gradient(rgba(16,15,13,0.55), transparent); }

        .hero__content { position: relative; z-index: 2; width: 100%; max-width: 1480px; margin-inline: auto; padding-inline: var(--gut); padding-block: clamp(8rem, 14vh, 11rem) clamp(3rem, 8vh, 5rem); }
        .hero__title { color: var(--paper); font-size: clamp(3rem, 8vw, 7rem); margin: 1.5rem 0 0; font-weight: 360; max-width: 16ch; text-shadow: 0 2px 30px rgba(16,15,13,0.35); }
        .hero__sub { color: rgba(251,247,240,0.86); font-size: clamp(1rem, 1.3vw, 1.25rem); line-height: 1.6; max-width: 42ch; margin: 1.8rem 0 0; font-weight: 300; text-shadow: 0 1px 20px rgba(16,15,13,0.4); }
        .hero__cta { display: flex; flex-wrap: wrap; gap: 0.8rem; margin-top: 2.2rem; }
        .hero__cta-1 { background: var(--paper); color: var(--ink); }
        .hero__cta-1:hover { background: var(--brass-2); transform: translateY(-2px); }
        .hero__cta-2 { border: 1px solid rgba(251,247,240,0.5); color: var(--paper); backdrop-filter: blur(4px); }
        .hero__cta-2:hover { background: rgba(251,247,240,0.12); border-color: var(--paper); }
        .hero__meta { display: flex; align-items: center; flex-wrap: wrap; gap: 0.85rem; margin-top: 2.6rem; color: rgba(251,247,240,0.72); font-size: 0.72rem; letter-spacing: 0.14em; text-transform: uppercase; }
        .hero__dot { width: 4px; height: 4px; border-radius: 50%; background: var(--brass-2); }

        .hero__tag { position: absolute; bottom: 1.7rem; inset-inline-end: clamp(1.25rem, 5vw, 6rem); z-index: 3; display: inline-flex; align-items: center; gap: 0.7rem; background: rgba(251,247,240,0.92); backdrop-filter: blur(8px); color: var(--ink); padding: 0.6rem 1rem 0.6rem 0.7rem; border-radius: 100px; font-size: 0.84rem; font-family: var(--font-display); }
        .hero__tag-k { background: var(--ever); color: var(--paper); font-family: var(--font-sans); font-size: 0.6rem; letter-spacing: 0.18em; text-transform: uppercase; padding: 0.3em 0.7em; border-radius: 100px; }
        .hero__scroll { position: absolute; bottom: 1.8rem; inset-inline-start: clamp(1.25rem, 5vw, 6rem); z-index: 3; display: flex; flex-direction: column; align-items: center; gap: 8px; color: rgba(251,247,240,0.9); }
        .hero__scroll span:first-child { font-size: 0.6rem; letter-spacing: ${lang === "ar" ? "0.1em" : "0.3em"}; text-transform: uppercase; writing-mode: vertical-rl; }
        .hero__scroll-line { width: 1px; height: 40px; background: linear-gradient(rgba(251,247,240,0.85), transparent); animation: bob 2.4s ease-in-out infinite; }

        @media (max-width: 860px) {
          .hero { background: var(--ever) url(/evora/hero-mobile.jpg) center/cover no-repeat; min-height: 100svh; }
          .hero__scrim { background:
              linear-gradient(0deg, rgba(16,15,13,0.9) 0%, rgba(27,25,22,0.5) 42%, rgba(27,25,22,0.34) 100%); }
          .hero__content { padding-block: clamp(7rem, 18vh, 9rem) clamp(4rem, 12vh, 6rem); }
          .hero__title { font-size: clamp(2.8rem, 13vw, 4.4rem); margin-top: 1.1rem; max-width: 14ch; }
          .hero__sub { font-size: 1.02rem; margin-top: 1.3rem; }
          .hero__cta { margin-top: 1.8rem; gap: 0.6rem; }
          .hero__cta .btn { flex: 1 1 auto; justify-content: center; }
          .hero__meta { margin-top: 2rem; gap: 0.6rem; font-size: 0.66rem; }
          .hero__tag { display: none; }
          .hero__scroll { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero__video { display: none; }
          .hero { background: var(--ever) url(/evora/p07.jpg) center/cover; }
        }
      `}</style>
    </section>
  );
}
