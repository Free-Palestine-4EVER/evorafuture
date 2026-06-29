"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useT } from "@/lib/i18n";
import { FOLLOWERS } from "@/lib/brand";
import ResponsiveVideo from "@/components/ResponsiveVideo";

const MOBILE_QUERY = "(max-width: 768px)";

// frame count + scroll length per hero film. Film "c" is the new full-quality
// walk-through: every native frame of the source clip (1920x1080 WebP), given a
// long scrub so the motion stays buttery on scroll.
const FRAME_TOTAL: Record<HeroVariant, number> = { a: 193, b: 193, c: 361 };
const SCROLL_VH: Record<HeroVariant, number> = { a: 500, b: 500, c: 600 };
const pad = (n: number) => String(n).padStart(4, "0");

export type HeroVariant = "a" | "b" | "c";

export default function HeroScroll({ variant = "a" }: { variant?: HeroVariant }) {
  const { t, lang } = useT();
  const reduce = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;
  const TOTAL = FRAME_TOTAL[variant];
  const scrollVh = SCROLL_VH[variant];
  // film "c" frames are WebP (cleaner + lighter for smooth 60fps scrub); a/b are jpg
  const ext = variant === "c" ? "webp" : "jpg";
  const frameSrc = (i: number) => `/evora/hero-frames-${variant}/frame_${pad(i)}.${ext}`;

  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const targetFrame = useRef(1);
  const currentFrame = useRef(1);
  const ticking = useRef(false);
  const copyRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  const [ready, setReady] = useState(false);
  // On phones the heavy frame-scrub canvas (up to 361 preloaded WebPs) is
  // replaced by a single full-bleed portrait video — far lighter + still
  // cinematic. Decided client-side to avoid a hydration mismatch.
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia(MOBILE_QUERY);
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    // Never preload the frame stack on phones — the mobile video hero owns it.
    if (typeof window !== "undefined" && window.matchMedia?.(MOBILE_QUERY).matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let mounted = true;

    // Film "c" auto-plays on load so the hero never sits on a frozen first
    // frame; the moment the user scrolls, it hands over to scroll-scrubbing.
    let autoplaying = variant === "c";
    let autoFrame = 1;
    let rafAuto = 0;

    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (i: number) => {
      const img = imagesRef.current[i];
      if (!img || !img.complete || !img.naturalWidth) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const ir = img.width / img.height;
      const vr = vw / vh;
      let w: number, h: number, x: number, y: number;
      if (ir > vr) {
        h = vh;
        w = vh * ir;
        x = (vw - w) / 2;
        y = 0;
      } else {
        w = vw;
        h = vw / ir;
        x = 0;
        y = (vh - h) / 2;
      }
      ctx.clearRect(0, 0, vw, vh);
      ctx.drawImage(img, x, y, w, h);
    };

    // auto-play loop (variant "c" only, until the first user scroll)
    const autoTick = () => {
      if (!autoplaying) return;
      autoFrame = autoFrame >= TOTAL ? 1 : autoFrame + 1;
      currentFrame.current = autoFrame;
      targetFrame.current = autoFrame;
      draw(autoFrame);
      rafAuto = requestAnimationFrame(autoTick);
    };

    // preload all frames — draw the first as soon as it lands
    let loaded = 0;
    for (let i = 1; i <= TOTAL; i++) {
      const im = new Image();
      im.decoding = "async";
      im.onload = () => {
        loaded++;
        if (i === 1 && mounted) {
          sizeCanvas();
          draw(1);
          setReady(true);
          if (autoplaying) rafAuto = requestAnimationFrame(autoTick);
        }
      };
      im.onerror = () => { loaded++; };
      im.src = frameSrc(i);
      imagesRef.current[i] = im;
    }

    const render = () => {
      currentFrame.current += (targetFrame.current - currentFrame.current) * 0.18;
      let idx = Math.round(currentFrame.current);
      if (idx < 1) idx = 1;
      if (idx > TOTAL) idx = TOTAL;
      draw(idx);
      if (Math.abs(targetFrame.current - currentFrame.current) > 0.25) {
        requestAnimationFrame(render);
      } else {
        currentFrame.current = targetFrame.current;
        draw(Math.round(currentFrame.current));
        ticking.current = false;
      }
    };

    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollable = el.offsetHeight - window.innerHeight;
      const progress = Math.min(Math.max(-rect.top / scrollable, 0), 1);
      targetFrame.current = 1 + progress * (TOTAL - 1);

      // fade the copy out over the first 16% of the scrub
      const fade = Math.min(progress / 0.16, 1);
      if (copyRef.current) {
        copyRef.current.style.opacity = (1 - fade).toFixed(3);
        copyRef.current.style.transform = `translateY(${-fade * 38}px)`;
      }
      if (hintRef.current) {
        hintRef.current.style.opacity = (1 - Math.min(progress / 0.07, 1)).toFixed(3);
      }

      if (!ticking.current) {
        requestAnimationFrame(render);
        ticking.current = true;
      }
    };

    const onResize = () => {
      sizeCanvas();
      draw(Math.round(currentFrame.current));
    };

    // a real user scroll stops autoplay and snaps to the scroll position
    const onUserScroll = () => {
      if (autoplaying) {
        autoplaying = false;
        cancelAnimationFrame(rafAuto);
        onScroll();
        currentFrame.current = targetFrame.current;
        draw(Math.round(currentFrame.current));
        return;
      }
      onScroll();
    };

    window.addEventListener("scroll", onUserScroll, { passive: true });
    window.addEventListener("resize", onResize);
    onScroll();

    return () => {
      mounted = false;
      cancelAnimationFrame(rafAuto);
      window.removeEventListener("scroll", onUserScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [TOTAL, variant]);

  // ----- reduced motion: a calm static hero, no scrub -----
  if (reduce) {
    return (
      <section id="top" className="hs hs--static">
        <img src={frameSrc(1)} alt="" className="hs__poster" />
        <div className="hero__scrim" />
        <HeroCopy t={t} lang={lang} ease={ease} staticMode />
        <style>{heroCss}</style>
      </section>
    );
  }

  // ----- phones: a full-bleed portrait video hero (prefers hero-*-mobile.mp4),
  //        with the copy overlaid. 100svh so browser chrome never crops it. -----
  if (isMobile) {
    return (
      <section id="top" className={`hs hs--static hs--${variant} hs--mob`}>
        <ResponsiveVideo
          className="hs__video"
          src={`/evora/hero-${variant}.mp4`}
          poster="/evora/hero-mobile.jpg"
          aria-label={lang === "en" ? "A walk through Evora showroom in Khalda, Amman" : "جولة داخل معرض إيفورا في خلدا، عمّان"}
        />
        <div className="hs__scrim" />
        <div className="hs__left" />
        <div className="hero__top" />
        <HeroCopy t={t} lang={lang} ease={ease} staticMode />
        <style>{heroCss}</style>
      </section>
    );
  }

  return (
    <section id="top" ref={sectionRef} className={`hs hs--${variant}`} style={{ height: `${scrollVh}vh` }}>
      <div className="hs__sticky">
        <canvas
          ref={canvasRef}
          className="hs__canvas"
          role="img"
          aria-label={lang === "en" ? "A scroll-driven walk through Evora showroom in Khalda, Amman" : "جولة بالتمرير داخل معرض إيفورا في خلدا، عمّان"}
        />
        {!ready && <img src={frameSrc(1)} alt="" className="hs__poster" aria-hidden />}
        <div className="hs__scrim" />
        <div className="hs__left" />
        <div className="hero__top" />

        <div ref={copyRef} className="hs__copy">
          <HeroCopy t={t} lang={lang} ease={ease} />
        </div>

        <motion.div
          ref={hintRef}
          className="hero__scroll hs__scroll"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, ease, delay: 1.3 }}
        >
          <span>{t("scroll")}</span>
          <span className="hero__scroll-line" />
        </motion.div>

        <div className="hs__tag">
          <span className="hs__tag-k">{lang === "en" ? "Now showing" : "الآن"}</span>
          {lang === "en" ? "A walk through Evora · Khalda" : "جولة داخل إيفورا · خلدا"}
        </div>
      </div>

      <style>{heroCss}</style>
    </section>
  );
}

/* ---------- shared overlay copy ---------- */
function HeroCopy({
  t,
  lang,
  ease,
  staticMode = false,
}: {
  t: (k: never) => string;
  lang: "en" | "ar";
  ease: readonly [number, number, number, number];
  staticMode?: boolean;
}) {
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
    <div className="hero__content hs__content">
      <motion.span {...fade(0.2)} className="eyebrow" style={{ color: "var(--brass-2)", display: "block" }}>
        {t("hero_eyebrow" as never)}
      </motion.span>

      <h1 className="display hero__title">
        {[t("hero_l1" as never), t("hero_l2" as never), t("hero_l3" as never)].map((line, i) => (
          <span key={i} style={{ display: "block", overflow: "hidden", paddingBottom: "0.06em" }}>
            <motion.span variants={up} custom={i} initial="hidden" animate="show" style={{ display: "inline-block" }}>
              {i === 1 ? <span className="serif-i" style={{ color: "var(--brass-2)" }}>{line}</span> : line}
            </motion.span>
          </span>
        ))}
      </h1>

      <motion.p {...fade(0.85)} className="hero__sub">{t("hero_sub" as never)}</motion.p>

      <motion.div {...fade(1.0)} className="hero__cta">
        <a href="/shop" className="btn hero__cta-1">{t("hero_cta1" as never)} <span className="arrow">→</span></a>
        <a href="/showroom" className="btn hero__cta-2">{t("hero_cta2" as never)}</a>
      </motion.div>

      <motion.div {...fade(1.15)} className="hero__meta">
        <span>{FOLLOWERS}+ {lang === "en" ? "following" : "متابع"}</span>
        <span className="hero__dot" />
        <span>{lang === "en" ? "Khalda · Amman" : "خلدا · عمّان"}</span>
        <span className="hero__dot" />
        <span>{lang === "en" ? "Est. Jordan" : "صُنع في الأردن"}</span>
      </motion.div>
    </div>
  );
}

const heroCss = `
  .hs { position: relative; background: #0d0b09; }
  .hs--static { height: 100svh; min-height: 100svh; overflow: hidden; display: flex; align-items: center; }
  .hs__sticky { position: sticky; top: 0; height: 100vh; overflow: hidden; }
  .hs__canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; z-index: 0; }
  .hs__poster { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0; }

  .hs__scrim, .hero__scrim { position: absolute; inset: 0; z-index: 1; pointer-events: none; background:
      linear-gradient(105deg, rgba(13,11,9,0.92) 0%, rgba(13,11,9,0.62) 32%, rgba(13,11,9,0.18) 64%, rgba(13,11,9,0.05) 100%),
      radial-gradient(120% 80% at 50% 120%, rgba(8,6,4,0.6), transparent 60%); }
  .hero__top { position: absolute; inset-inline: 0; top: 0; height: 200px; z-index: 1; pointer-events: none; background: linear-gradient(rgba(8,6,4,0.6), transparent); }

  /* film "c": keep the clean bright footage — much lighter scrim, readability
     carried by a localized gradient behind the copy + stronger text shadows */
  .hs--c .hs__scrim { background:
      linear-gradient(100deg, rgba(13,11,9,0.44) 0%, rgba(13,11,9,0.20) 24%, rgba(13,11,9,0.03) 48%, rgba(13,11,9,0) 66%),
      linear-gradient(0deg, rgba(8,6,4,0.26) 0%, rgba(8,6,4,0) 26%); }
  .hs--c .hero__top { height: 130px; background: linear-gradient(rgba(8,6,4,0.28), transparent); }
  /* a little extra black overlay on the left edge */
  .hs__left { position: absolute; inset: 0; z-index: 1; pointer-events: none;
    background: linear-gradient(90deg, rgba(8,6,4,0.6) 0%, rgba(8,6,4,0.3) 14%, rgba(8,6,4,0) 34%); }
  .hs--c .hero__title { text-shadow: 0 2px 22px rgba(8,6,4,0.7), 0 1px 4px rgba(8,6,4,0.45); }
  .hs--c .hero__sub { text-shadow: 0 1px 16px rgba(8,6,4,0.7), 0 1px 3px rgba(8,6,4,0.5); }
  .hs--c .hero__meta { color: rgba(251,247,240,0.85); text-shadow: 0 1px 8px rgba(8,6,4,0.6); }

  .hs__copy { position: absolute; inset: 0; z-index: 2; display: flex; align-items: center; will-change: transform, opacity; }
  .hs--static .hero__content { position: relative; z-index: 2; }
  .hero__content, .hs__content { width: 100%; max-width: 1480px; margin-inline: auto; padding-inline: var(--gut); padding-block: clamp(8rem, 14vh, 11rem) clamp(3rem, 8vh, 5rem); }
  .hero__title { color: var(--paper); font-size: clamp(3rem, 8vw, 7rem); margin: 1.5rem 0 0; font-weight: 360; max-width: 16ch; text-shadow: 0 2px 30px rgba(8,6,4,0.4); }
  .hero__sub { color: rgba(251,247,240,0.86); font-size: clamp(1rem, 1.3vw, 1.25rem); line-height: 1.6; max-width: 42ch; margin: 1.8rem 0 0; font-weight: 300; text-shadow: 0 1px 20px rgba(8,6,4,0.45); }
  .hero__cta { display: flex; flex-wrap: wrap; gap: 0.8rem; margin-top: 2.2rem; }
  .hero__cta-1 { background: var(--paper); color: var(--ink); }
  .hero__cta-1:hover { background: var(--brass-2); transform: translateY(-2px); }
  .hero__cta-2 { border: 1px solid rgba(251,247,240,0.5); color: var(--paper); backdrop-filter: blur(4px); }
  .hero__cta-2:hover { background: rgba(251,247,240,0.12); border-color: var(--paper); }
  .hero__meta { display: flex; align-items: center; flex-wrap: wrap; gap: 0.85rem; margin-top: 2.6rem; color: rgba(251,247,240,0.72); font-size: 0.72rem; letter-spacing: 0.14em; text-transform: uppercase; }
  .hero__dot { width: 4px; height: 4px; border-radius: 50%; background: var(--brass-2); }

  .hs__tag { position: absolute; bottom: 1.7rem; inset-inline-end: clamp(1.25rem, 5vw, 6rem); z-index: 3; display: inline-flex; align-items: center; gap: 0.7rem; background: rgba(251,247,240,0.92); backdrop-filter: blur(8px); color: var(--ink); padding: 0.6rem 1rem 0.6rem 0.7rem; border-radius: 100px; font-size: 0.84rem; font-family: var(--font-display); }
  .hs__tag-k { background: #0d0b09; color: var(--paper); font-family: var(--font-sans); font-size: 0.6rem; letter-spacing: 0.18em; text-transform: uppercase; padding: 0.3em 0.7em; border-radius: 100px; }
  .hero__scroll { position: absolute; bottom: 1.8rem; inset-inline-start: clamp(1.25rem, 5vw, 6rem); z-index: 3; display: flex; flex-direction: column; align-items: center; gap: 8px; color: rgba(251,247,240,0.9); }
  .hero__scroll span:first-child { font-size: 0.6rem; letter-spacing: 0.3em; text-transform: uppercase; writing-mode: vertical-rl; }
  html[dir="rtl"] .hero__scroll span:first-child { letter-spacing: 0.1em; }
  .hero__scroll-line { width: 1px; height: 40px; background: linear-gradient(rgba(251,247,240,0.85), transparent); animation: bob 2.4s ease-in-out infinite; }

  .hs__video { position: absolute; inset: 0; z-index: 0; }
  .hs--mob { height: 100svh; min-height: 100svh; overflow: hidden; display: flex; align-items: center; }

  @media (max-width: 860px) {
    .hs__content { padding-block: clamp(7rem, 18vh, 9rem) clamp(4rem, 12vh, 6rem); }
    .hero__title { font-size: clamp(2.8rem, 13vw, 4.4rem); margin-top: 1.1rem; max-width: 14ch; }
    .hero__sub { font-size: 1.02rem; margin-top: 1.3rem; }
    .hero__cta { margin-top: 1.8rem; gap: 0.6rem; }
    .hero__cta .btn { flex: 1 1 auto; justify-content: center; min-height: 44px; align-items: center; }
    .hero__meta { margin-top: 2rem; gap: 0.6rem; font-size: 0.66rem; }
    .hs__tag { display: none; }
    .hero__scroll { display: none; }
  }

  @media (max-width: 640px) {
    /* white copy must stay legible over any footage on a small bright phone */
    .hs__scrim { background:
      linear-gradient(180deg, rgba(8,6,4,0.46) 0%, rgba(8,6,4,0.12) 30%, rgba(8,6,4,0.32) 60%, rgba(8,6,4,0.84) 100%); }
    .hs--c .hs__scrim { background:
      linear-gradient(180deg, rgba(8,6,4,0.42) 0%, rgba(8,6,4,0.10) 30%, rgba(8,6,4,0.32) 60%, rgba(8,6,4,0.82) 100%); }
    .hs__left { background: none; }
    .hs__content { padding-block: clamp(6rem, 15vh, 8rem) clamp(3.5rem, 11vh, 5.5rem); }
    .hero__title { font-size: clamp(2.6rem, 12vw, 3.8rem); max-width: 12ch; }
    .hero__sub { font-size: clamp(0.98rem, 4.2vw, 1.1rem); max-width: 34ch; }
    /* CTAs: stacked, full-width, comfy ≥48px touch targets */
    .hero__cta { flex-direction: column; align-items: stretch; gap: 0.7rem; width: 100%; max-width: 22rem; }
    .hero__cta .btn { width: 100%; min-height: 48px; justify-content: center; }
    .hero__meta { font-size: 0.62rem; gap: 0.5rem; }
  }
`;
