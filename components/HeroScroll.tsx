"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useT } from "@/lib/i18n";
import { FOLLOWERS } from "@/lib/brand";
import { preload } from "@/lib/preload";
import { resolveFrameExt, SAFE_FRAME_EXT, type FrameExt } from "@/lib/frameFormat";
import { createVideoScrub } from "@/lib/videoScrub";

/* ============================================================
   EVORA — scroll-scrubbed hero

   Scrubs a <video>'s currentTime on scroll. Previously this drew a
   stack of individual frame images to a <canvas>, which was correct
   in every way except the one that mattered: it retained a live
   HTMLImageElement per frame for the page's whole life, and the
   scrub force-decoded every one of them.

       phone   125 frames x 720x1280x4  =   439 MB decoded
       desktop 181 frames x 1920x1080x4 = 1,431 MB decoded

   iOS Safari kills a tab somewhere around 200-400 MB, so the hero
   alone blew the budget before the configurator's 594 MB landed on
   top of it. That is the "works on some phones, not others" report.
   The same bug class is already documented twice in evoraproj.md
   (BookMode, CatalogBrowser) — it was fixed there and never here.

   A <video> hands frame lifetime to the platform decoder, which
   keeps a handful of frames alive instead of all of them, and turns
   125-361 requests into one. Playback technique (blob source, seek
   coalescing, poster-until-first-paint, iOS gesture priming) is
   adapted from oso95/scroll-world — see lib/videoScrub.ts.

   UNCHANGED ON PURPOSE: the sticky/section DOM, the copy overlay,
   the scroll math read from the sticky element's own box (100svh is
   stable while mobile browser chrome hides; dvh is NOT, and would
   animate the box mid-scrub), the CSS-media-query section height so
   there is no hydration branch, and the deliberate refusal to bail
   out under prefers-reduced-motion.
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

// Scrub clips, encoded from the very same frame folders (no visuals were
// regenerated): crf 20, -g 8 desktop / -g 4 mobile. The tight GOP is the whole
// point — phone seek cost is dominated by how many frames must be decoded from
// the nearest keyframe, so a short GOP is what makes scrubbing smooth.
// Mobile is one shared portrait clip: the frame stack was shared across
// variants too (/evora/hero-frames-mobile).
const HERO_CLIP: Record<HeroVariant, string> = {
  a: "/evora/scrub/hero-a-desktop.mp4",
  b: "/evora/scrub/hero-b-desktop.mp4",
  c: "/evora/scrub/hero-c-desktop.mp4",
};
const HERO_CLIP_MOBILE = "/evora/scrub/hero-shared-mobile.mp4";

export default function HeroScroll({ variant = "a" }: { variant?: HeroVariant }) {
  const { t, lang } = useT();
  const reduce = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;

  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  // `painted` flips only once the video has actually rendered a frame (its
  // first `seeked`). On iOS a muted video that has been seeked but never played
  // stays BLANK, so hiding the poster on metadata alone would flash an empty
  // hero. The poster stays on top until there is something real behind it.
  const [painted, setPainted] = useState(false);

  // The poster <img> (behind the canvas, and the whole hero in reduced-motion
  // mode) is the actual LCP element — the canvas isn't LCP-eligible. It starts
  // on SAFE_FRAME_EXT (webp) so server and first client render agree, then
  // upgrades to AVIF (~30-45% lighter) once the decode probe resolves, same
  // as the scrub frames already do.
  const [posterExt, setPosterExt] = useState<FrameExt>(SAFE_FRAME_EXT);
  useEffect(() => { resolveFrameExt().then(setPosterExt); }, []);

  useEffect(() => {
    // NOTE: the scrub deliberately does NOT bail out under prefers-reduced-motion.
    // Nothing here moves on its own — every frame change is driven directly by
    // the user's own scroll, which is not the autoplaying/parallax motion that
    // reduced-motion protects against. Bailing out here used to blank the film
    // into a dead poster for anyone whose OS *or browser* reports "reduce" —
    // including every Chrome laptop running Battery/Energy Saver, which forces
    // prefers-reduced-motion: reduce regardless of what the user chose. That
    // turned the entire hero into a still image on ordinary laptops.
    // Reduced motion is honoured by dropping the AUTOPLAYING copy animations
    // (see reduceCopy below) and by removing the scrub's easing lerp, so frames
    // track the scroll exactly instead of drifting toward it.
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    // Viewport height used for the scrub math, measured from .hs__sticky's own
    // rendered box (CSS: height:100svh) rather than window.innerHeight. svh is
    // a browser-guaranteed STABLE value that does not change as an in-app
    // browser's chrome hides and reappears mid-scroll, unlike innerHeight —
    // reading innerHeight live made the scrub jump on every direction change.
    let viewportH = window.innerHeight;
    const measureViewport = () => {
      const rect = stickyRef.current?.getBoundingClientRect();
      viewportH = rect && rect.height > 0 ? rect.height : window.innerHeight;
    };
    measureViewport();

    // Progress is read from layout every frame rather than from scroll events,
    // so it is input-agnostic (wheel, touch, Lenis momentum). Scroll events and
    // IntersectionObserver both misreport under Lenis on phones.
    const progress = () => {
      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - viewportH;
      return scrollable > 0 ? Math.min(Math.max(-rect.top / scrollable, 0), 1) : 0;
    };

    // The Loader now gates on ONE thing (this clip) instead of 125-181 separate
    // images, so it lifts as soon as the film can actually be scrubbed.
    let released = false;
    const release = () => { if (!released) { released = true; preload.done(); } };
    preload.add(1);

    const scrub = createVideoScrub({
      container: stage,
      src: HERO_CLIP[variant],
      srcMobile: HERO_CLIP_MOBILE,
      mobileQuery: MOBILE_QUERY,
      className: "hs__video",
      progress,
      reduce: !!reduce,
      onReady: () => { setReady(true); release(); },
      onFirstFrame: () => setPainted(true),
      // Never let a failed clip leave the branded loader up forever — the
      // poster frame stays and the page reveals normally.
      onError: release,
    });

    // Safety net: if the clip stalls on a bad connection, reveal anyway rather
    // than holding the whole page behind the loader.
    const failsafe = window.setTimeout(release, 8000);

    const onResize = () => measureViewport();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    return () => {
      window.clearTimeout(failsafe);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      release();
      scrub.destroy();
    };
  }, [variant, reduce]);

  return (
    <section id="top" ref={sectionRef} className={`hs hs--${variant}`}>
      <div className="hs__sticky" ref={stickyRef}>
        {/* The scrub <video> is appended here by createVideoScrub. The wrapper
            carries the accessible name, because the video itself is decorative
            chrome for a film the user drives with their own scroll. */}
        <div
          ref={stageRef}
          className={`hs__stage${ready ? " is-ready" : ""}${painted ? " is-painted" : ""}`}
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
          <HeroCopy t={t} lang={lang} ease={ease} staticMode={!!reduce} />
        </div>

        <motion.div
          ref={hintRef}
          className="hero__scroll hs__scroll"
          initial={{ opacity: reduce ? 1 : 0 }}
          animate={{ opacity: 1 }}
          transition={reduce ? { duration: 0 } : { duration: 0.9, ease, delay: 1.3 }}
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
  // staticMode = the visitor prefers reduced motion. The scroll-driven film
  // still scrubs (it only moves when they move), but the copy stops performing
  // its own entrance: it is simply there, already in place, on first paint.
  const up = staticMode
    ? { hidden: { y: "0%" }, show: () => ({ y: "0%", transition: { duration: 0 } }) }
    : {
        hidden: { y: "108%" },
        show: (i: number) => ({ y: "0%", transition: { duration: 1.0, ease, delay: 0.35 + i * 0.1 } }),
      };
  const fade = (delay: number) =>
    staticMode
      ? { initial: { opacity: 1, y: 0 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0 } }
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, ease, delay },
        };

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
  /* The stage holds the scrub video. It only fades in once a real frame has
     painted (.is-painted) — not merely when metadata arrived — so the poster
     underneath is never swapped out for a blank iOS video surface. */
  .hs__stage { position: absolute; inset: 0; z-index: 1; opacity: 0; transition: opacity .35s ease; }
  .hs__stage.is-painted { opacity: 1; }
  .hs__video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
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
