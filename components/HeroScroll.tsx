"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useT } from "@/lib/i18n";
import { FOLLOWERS } from "@/lib/brand";
import { preload } from "@/lib/preload";
import { resolveFrameExt, SAFE_FRAME_EXT, type FrameExt } from "@/lib/frameFormat";

/* ============================================================
   EVORA — scroll-scrubbed hero (rebuilt)

   One <canvas> that advances a frame stack purely on scroll — no
   autoplay, no <video> seeking (which stutters on iOS). Desktop
   scrubs the landscape film; phones scrub a light 9:16 portrait
   stack. The SAME DOM is server- and client-rendered — the device
   is resolved *inside* the effect (matchMedia) and the section
   height is set by CSS media query — so there is no hydration
   branch that could leave a phone stuck on the desktop hero.
   ============================================================ */

export type HeroVariant = "a" | "b" | "c";

const MOBILE_QUERY = "(max-width: 768px)";
const pad = (n: number) => String(n).padStart(4, "0");

// PHYSICAL frame counts on disk (each ships as AVIF primary + WebP fallback;
// the ext is resolved per-browser at runtime — see resolveFrameExt).
const DESKTOP_TOTAL: Record<HeroVariant, number> = { a: 193, b: 193, c: 361 };
const MOBILE_TOTAL = 250;

// STRIDE subsampling. We only FETCH every Nth physical frame, which roughly
// halves the bytes on the wire without touching a single asset on disk or
// losing quality. 180 desktop / 125 mobile frames over a 600vh / 420svh scrub
// is still far denser than one frame per rAF tick, so the scrub stays smooth —
// the previous 1:1 density just wasted bandwidth the network couldn't deliver
// fast enough, which is what starved the scrub and made it stutter.
const DESKTOP_STRIDE = 2;
const MOBILE_STRIDE = 2;

// How many leading frames the branded Loader waits on before it lifts. The
// nearest-loaded-frame fallback (see draw) means the reveal never lands on a
// blank/broken hero even if these are the ONLY frames ready — so we keep the
// gate small for a fast first paint and let the rest stream in behind it.
const DESKTOP_CRITICAL = 12;
const MOBILE_CRITICAL = 10;

type Stack = {
  total: number;            // number of LOGICAL (fetched) frames, 1..total
  critical: number;
  src: (i: number) => string;
};

// Map a logical index (1..total, after striding) to its physical frame number,
// always including the very last physical frame so the scrub reaches the end.
const strideStack = (
  physicalTotal: number,
  stride: number,
  critical: number,
  dir: string,
  ext: FrameExt,
): Stack => {
  const total = Math.floor((physicalTotal - 1) / stride) + 1;
  const phys = (i: number) => Math.min(physicalTotal, 1 + (i - 1) * stride);
  return {
    total,
    critical: Math.min(critical, total),
    src: (i) => `${dir}/frame_${pad(phys(i))}.${ext}`,
  };
};

function desktopStack(variant: HeroVariant, ext: FrameExt = SAFE_FRAME_EXT): Stack {
  return strideStack(DESKTOP_TOTAL[variant], DESKTOP_STRIDE, DESKTOP_CRITICAL, `/evora/hero-frames-${variant}`, ext);
}
function mobileStack(ext: FrameExt = SAFE_FRAME_EXT): Stack {
  return strideStack(MOBILE_TOTAL, MOBILE_STRIDE, MOBILE_CRITICAL, `/evora/hero-frames-mobile`, ext);
}

const isMobileNow = () =>
  typeof window !== "undefined" && !!window.matchMedia && window.matchMedia(MOBILE_QUERY).matches;

export default function HeroScroll({ variant = "a" }: { variant?: HeroVariant }) {
  const { t, lang } = useT();
  const reduce = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;

  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  // The poster <img> (behind the canvas, and the whole hero in reduced-motion
  // mode) is the actual LCP element — the canvas isn't LCP-eligible. It starts
  // on SAFE_FRAME_EXT (webp) so server and first client render agree, then
  // upgrades to AVIF (~30-45% lighter) once the decode probe resolves, same
  // as the scrub frames already do.
  const [posterExt, setPosterExt] = useState<FrameExt>(SAFE_FRAME_EXT);
  useEffect(() => { resolveFrameExt().then(setPosterExt); }, []);

  useEffect(() => {
    if (reduce) return; // reduced motion renders a static poster, no scrub
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let mounted = true;
    let rafId = 0;
    let images: HTMLImageElement[] = [];
    let frameExt: FrameExt = SAFE_FRAME_EXT; // upgraded to "avif" once the probe resolves
    const buildStack = (): Stack =>
      isMobileNow() ? mobileStack(frameExt) : desktopStack(variant, frameExt);
    let stack: Stack = buildStack();
    let stackIsMobile = isMobileNow();
    let currentFrame = 1;
    let lastDrawn = -1;
    let lastDrawnExact = false;
    let firstDrawn = false;

    // Cached viewport size used for ALL scrub math and canvas sizing below —
    // never read window.innerWidth/innerHeight live inside tick()/paint(). In
    // Instagram/TikTok's in-app browser, window.innerHeight changes by ~50-120px
    // as their chrome (address/bottom bars) auto-hides and reappears WHILE the
    // user scrolls, with no real viewport change. Reading it live made the scrub
    // progress (and thus the visible frame) jump on every scroll direction
    // change. commitViewport() only trusts a height change on mobile when it
    // arrives together with a width change (a real rotation/resize).
    let viewportW = window.innerWidth;
    let viewportH = window.innerHeight;
    const commitViewport = (w: number, h: number) => {
      const widthChanged = w !== viewportW;
      viewportW = w;
      if (widthChanged || !isMobileNow()) viewportH = h;
    };

    const sizeCanvas = () => {
      // Cap DPR lower on phones: many are DPR 3, where the per-frame fill
      // (drawImage over a full-screen canvas) is 2.25× the pixels of DPR 2 and
      // can't hold 60fps on mid-range devices. 1.75 stays crisp for a MOVING
      // film while cutting ~23% of the fill cost vs the 2 cap.
      const dpr = Math.min(window.devicePixelRatio || 1, isMobileNow() ? 1.75 : 2);
      canvas.width = Math.round(viewportW * dpr);
      canvas.height = Math.round(viewportH * dpr);
      canvas.style.width = viewportW + "px";
      canvas.style.height = viewportH + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const isLoaded = (i: number) => {
      const img = images[i];
      return !!img && img.complete && !!img.naturalWidth;
    };

    // The nearest already-loaded frame to `i` (search outward). Guarantees the
    // scrub always shows SOMETHING close instead of freezing/blanking when the
    // exact frame hasn't streamed in yet — the film just sharpens as it fills.
    const nearestLoaded = (i: number): number => {
      if (isLoaded(i)) return i;
      for (let d = 1; d < stack.total; d++) {
        if (i - d >= 1 && isLoaded(i - d)) return i - d;
        if (i + d <= stack.total && isLoaded(i + d)) return i + d;
      }
      return -1;
    };

    const paint = (img: HTMLImageElement) => {
      const vw = viewportW;
      const vh = viewportH;
      const ir = img.naturalWidth / img.naturalHeight;
      const vr = vw / vh;
      let w: number, h: number, x: number, y: number;
      if (ir > vr) {
        h = vh; w = vh * ir; x = (vw - w) / 2; y = 0;
      } else {
        w = vw; h = vw / ir; x = 0; y = (vh - h) / 2;
      }
      ctx.drawImage(img, x, y, w, h);
    };

    // Draw frame `i`, or the nearest loaded frame if it isn't ready yet.
    // Returns true only when the EXACT frame was drawn (so the tick loop knows
    // to keep retrying that index until its real frame lands).
    const draw = (i: number): boolean => {
      if (isLoaded(i)) { paint(images[i]); return true; }
      const near = nearestLoaded(i);
      if (near > 0) paint(images[near]);
      return false;
    };

    // (re)load the frame stack for the current device. Called on mount and
    // whenever a resize crosses the mobile breakpoint (e.g. phone rotate).
    //
    // TWO-PHASE: the critical frames (the only thing the Loader waits on,
    // ~300KB) fetch alone at high priority; the remaining ~14MB stream in
    // AFTERWARDS through a small concurrency window, in scrub order. Firing
    // all 361 at once made the tail starve the gating 8 over one HTTP/2
    // connection — the loader then sat its full HARD_CAP on cold cache.
    let loadGen = 0;
    const loadStack = () => {
      images.forEach((im) => { im.onload = null; im.onerror = null; im.src = ""; });
      images = [];
      lastDrawn = -1;
      lastDrawnExact = false;
      loadGen++; // invalidates any in-flight streamer from a previous stack
      const gen = loadGen;
      // frame COUNTS are ext-independent — register with the Loader
      // SYNCHRONOUSLY, before the avif/webp probe's async hop, so the Loader
      // can never hit its "no hero registered" fallback and lift early.
      const critical = Math.min(stack.critical, stack.total);
      let releasedCount = 0;
      const release = () => {
        if (releasedCount < critical) { releasedCount++; preload.done(); }
      };
      preload.add(critical);

      resolveFrameExt().then((ext) => {
        if (!mounted || gen !== loadGen) {
          // stack swapped (rotate) or unmounted before fetching began — drain
          // this generation's registered slots so the Loader never stalls
          while (releasedCount < critical) release();
          return;
        }
        frameExt = ext;
        stack = buildStack();
        stackIsMobile = isMobileNow();
        const s = stack;

        // phase 2 — stream the rest, max WINDOW in flight, always fetching the
        // unloaded frame NEAREST the current scrub position first. Ascending
        // order starved mid-scroll: if the user was at 50% the frame under them
        // was the LAST to arrive. Prioritising by distance-to-current means the
        // frames actually on screen download first, wherever the user is.
        const WINDOW = 8;
        const requested: boolean[] = [];
        for (let i = 1; i <= critical; i++) requested[i] = true; // phase-1 owns these
        let remaining = s.total - critical;
        let inFlight = 0;
        let streaming = false;

        const pickNext = (): number => {
          const cur = Math.max(1, Math.min(s.total, Math.round(currentFrame)));
          let best = -1, bestD = Infinity;
          for (let i = 1; i <= s.total; i++) {
            if (requested[i]) continue;
            const d = Math.abs(i - cur);
            if (d < bestD) { bestD = d; best = i; }
          }
          return best;
        };

        const pump = () => {
          if (gen !== loadGen || !mounted) return;
          while (inFlight < WINDOW && remaining > 0) {
            const i = pickNext();
            if (i < 0) break;
            requested[i] = true;
            remaining--;
            inFlight++;
            const im = new Image();
            im.decoding = "async";
            im.fetchPriority = "low";
            const done = () => { inFlight--; pump(); };
            im.onload = done;
            im.onerror = done;
            im.src = s.src(i);
            images[i] = im;
          }
        };
        const startStream = () => {
          if (streaming || gen !== loadGen || !mounted) return;
          streaming = true;
          pump();
        };

        // phase 1 — the loader-gating critical set, alone on the wire
        let settled = 0;
        for (let i = 1; i <= critical; i++) {
          const im = new Image();
          im.decoding = "async";
          im.fetchPriority = "high";
          const settle = () => {
            release();
            if (!firstDrawn && i === 1 && mounted) {
              firstDrawn = true;
              sizeCanvas();
              draw(1);
              setReady(true);
            }
            settled++;
            if (settled >= critical) startStream();
          };
          im.onload = settle;
          im.onerror = settle;
          im.src = s.src(i);
          images[i] = im;
        }
        // safety: one stalled critical frame must not block streaming forever
        window.setTimeout(startStream, 4000);
      });
    };

    // One always-on rAF loop that reads scrub position from layout every frame.
    // Input-agnostic (wheel, touch, Lenis momentum) and never gated by scroll
    // events or IntersectionObserver — both misreport under Lenis on phones.
    const tick = () => {
      if (!mounted) return;
      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - viewportH;
      const progress = scrollable > 0 ? Math.min(Math.max(-rect.top / scrollable, 0), 1) : 0;
      const target = 1 + progress * (stack.total - 1);

      // fade the copy out over the first 16% of the scrub
      const fade = Math.min(progress / 0.16, 1);
      if (copyRef.current) {
        copyRef.current.style.opacity = (1 - fade).toFixed(3);
        copyRef.current.style.transform = `translateY(${-fade * 34}px)`;
      }
      if (hintRef.current) {
        hintRef.current.style.opacity = (1 - Math.min(progress / 0.07, 1)).toFixed(3);
      }

      // ease toward the target frame, redraw only when the index changes
      currentFrame += (target - currentFrame) * 0.2;
      if (Math.abs(target - currentFrame) < 0.25) currentFrame = target;
      let idx = Math.round(currentFrame);
      if (idx < 1) idx = 1;
      if (idx > stack.total) idx = stack.total;
      // Redraw when the index moves OR when we last drew an APPROXIMATION for
      // this index (nearest-frame fallback) and its real frame has since
      // streamed in — otherwise the canvas would freeze on the stand-in forever.
      if (idx !== lastDrawn || !lastDrawnExact) {
        lastDrawnExact = draw(idx);
        lastDrawn = idx;
      }
      rafId = requestAnimationFrame(tick);
    };

    const onResize = () => {
      commitViewport(window.innerWidth, window.innerHeight);
      const nowMobile = isMobileNow();
      if (nowMobile !== stackIsMobile) {
        // crossed the breakpoint — swap to the right stack
        stack = buildStack();
        stackIsMobile = nowMobile;
        currentFrame = 1;
        loadStack();
      }
      sizeCanvas();
      lastDrawn = -1;
      lastDrawnExact = false;
      draw(Math.round(currentFrame));
    };

    sizeCanvas();
    // loadStack registers the Loader-gating frames synchronously, resolves the
    // avif/webp probe internally, then fetches only the winning format.
    loadStack();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    rafId = requestAnimationFrame(tick);

    return () => {
      mounted = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      images.forEach((im) => { im.onload = null; im.onerror = null; });
      images = [];
    };
    // variant is the only real input; device is handled live inside the effect.
  }, [variant, reduce]);

  // ----- reduced motion: a calm static hero, no scrub -----
  if (reduce) {
    return (
      <section id="top" className="hs hs--static">
        <picture>
          <source media="(max-width: 768px)" srcSet={mobileStack(posterExt).src(1)} />
          <img src={desktopStack(variant, posterExt).src(1)} alt="" className="hs__poster" fetchPriority="high" />
        </picture>
        <div className="hs__scrim" />
        <HeroCopy t={t} lang={lang} ease={ease} staticMode />
        <style>{heroCss}</style>
      </section>
    );
  }

  return (
    <section id="top" ref={sectionRef} className={`hs hs--${variant}`}>
      <div className="hs__sticky">
        <canvas
          ref={canvasRef}
          className={`hs__canvas${ready ? " is-ready" : ""}`}
          role="img"
          aria-label={
            lang === "en"
              ? "A scroll-driven walk through Evora showroom in Khalda, Amman"
              : "جولة بالتمرير داخل معرض إيفورا في خلدا، عمّان"
          }
        />
        {/* posters sit behind the canvas until frame 1 draws; CSS picks which
            aspect shows per breakpoint (no JS branch → no hydration mismatch) */}
        <picture>
          <source media="(max-width: 768px)" srcSet={mobileStack(posterExt).src(1)} />
          <img src={desktopStack(variant, posterExt).src(1)} alt="" aria-hidden className="hs__poster" fetchPriority="high" />
        </picture>

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
          <span className="hs__tag-k">{lang === "en" ? "Now showing" : "يُعرض الآن"}</span>
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
        <span>{lang === "en" ? "Made in Jordan" : "صُنع في الأردن"}</span>
      </motion.div>
    </div>
  );
}

const heroCss = `
  /* section height drives the scrub length — set by CSS per breakpoint so the
     phone gets the portrait scrub length without any JS/hydration branch */
  .hs { position: relative; background: #0d0b09; height: 600vh; }
  @media (max-width: 768px) { .hs { height: 420svh; } }
  .hs--static { height: 100svh; min-height: 100svh; overflow: hidden; display: flex; align-items: center; }

  .hs__sticky { position: sticky; top: 0; height: 100vh; height: 100svh; overflow: hidden; }
  .hs__canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; z-index: 1; opacity: 0; transition: opacity .35s ease; }
  .hs__canvas.is-ready { opacity: 1; }
  .hs__poster { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0; }
  /* CSS decides which poster aspect is shown — both are in the DOM for SSR safety */
  .hs__poster--m { display: none; }
  @media (max-width: 768px) {
    .hs__poster--d { display: none; }
    .hs__poster--m { display: block; }
  }

  .hs__scrim, .hero__scrim { position: absolute; inset: 0; z-index: 2; pointer-events: none; background:
      linear-gradient(105deg, rgba(13,11,9,0.92) 0%, rgba(13,11,9,0.62) 32%, rgba(13,11,9,0.18) 64%, rgba(13,11,9,0.05) 100%),
      radial-gradient(120% 80% at 50% 120%, rgba(8,6,4,0.6), transparent 60%); }
  .hero__top { position: absolute; inset-inline: 0; top: 0; height: 200px; z-index: 2; pointer-events: none; background: linear-gradient(rgba(8,6,4,0.6), transparent); }

  /* film "c": keep the clean bright footage — lighter scrim, readability carried
     by a localized gradient behind the copy + stronger text shadows */
  .hs--c .hs__scrim { background:
      linear-gradient(100deg, rgba(13,11,9,0.44) 0%, rgba(13,11,9,0.20) 24%, rgba(13,11,9,0.03) 48%, rgba(13,11,9,0) 66%),
      linear-gradient(0deg, rgba(8,6,4,0.26) 0%, rgba(8,6,4,0) 26%); }
  .hs--c .hero__top { height: 130px; background: linear-gradient(rgba(8,6,4,0.28), transparent); }
  .hs__left { position: absolute; inset: 0; z-index: 2; pointer-events: none;
    background: linear-gradient(90deg, rgba(8,6,4,0.6) 0%, rgba(8,6,4,0.3) 14%, rgba(8,6,4,0) 34%); }
  .hs--c .hero__title { text-shadow: 0 2px 22px rgba(8,6,4,0.7), 0 1px 4px rgba(8,6,4,0.45); }
  .hs--c .hero__sub { text-shadow: 0 1px 16px rgba(8,6,4,0.7), 0 1px 3px rgba(8,6,4,0.5); }
  .hs--c .hero__meta { color: rgba(251,247,240,0.85); text-shadow: 0 1px 8px rgba(8,6,4,0.6); }

  .hs__copy { position: absolute; inset: 0; z-index: 3; display: flex; align-items: center; will-change: transform, opacity; }
  .hs--static .hero__content { position: relative; z-index: 3; }
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

  .hs__tag { position: absolute; bottom: 1.7rem; inset-inline-end: clamp(1.25rem, 5vw, 6rem); z-index: 4; display: inline-flex; align-items: center; gap: 0.7rem; background: rgba(251,247,240,0.92); backdrop-filter: blur(8px); color: var(--ink); padding: 0.6rem 1rem 0.6rem 0.7rem; border-radius: 100px; font-size: 0.84rem; font-family: var(--font-display); }
  .hs__tag-k { background: #0d0b09; color: var(--paper); font-family: var(--font-sans); font-size: 0.6rem; letter-spacing: 0.18em; text-transform: uppercase; padding: 0.3em 0.7em; border-radius: 100px; }
  .hero__scroll { position: absolute; bottom: 1.8rem; inset-inline-start: clamp(1.25rem, 5vw, 6rem); z-index: 4; display: flex; flex-direction: column; align-items: center; gap: 8px; color: rgba(251,247,240,0.9); }
  .hero__scroll span:first-child { font-size: 0.6rem; letter-spacing: 0.3em; text-transform: uppercase; writing-mode: vertical-rl; }
  html[dir="rtl"] .hero__scroll span:first-child { letter-spacing: 0.1em; }
  .hero__scroll-line { width: 1px; height: 40px; background: linear-gradient(rgba(251,247,240,0.85), transparent); animation: bob 2.4s ease-in-out infinite; }

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
    .hs__scrim, .hs--c .hs__scrim { background:
      linear-gradient(180deg, rgba(8,6,4,0.44) 0%, rgba(8,6,4,0.10) 30%, rgba(8,6,4,0.32) 60%, rgba(8,6,4,0.82) 100%); }
    .hs__left { background: none; }
    .hs__content { padding-block: clamp(6rem, 15vh, 8rem) clamp(3.5rem, 11vh, 5.5rem); }
    .hero__title { font-size: clamp(2.6rem, 12vw, 3.8rem); max-width: 12ch; }
    .hero__sub { font-size: clamp(0.98rem, 4.2vw, 1.1rem); max-width: 34ch; }
    .hero__cta { flex-direction: column; align-items: stretch; gap: 0.7rem; width: 100%; max-width: 22rem; }
    .hero__cta .btn { width: 100%; min-height: 48px; justify-content: center; }
    .hero__meta { font-size: 0.62rem; gap: 0.5rem; }
  }
`;
