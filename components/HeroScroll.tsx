"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useT } from "@/lib/i18n";
import { FOLLOWERS } from "@/lib/brand";
import { preload } from "@/lib/preload";
import { resolveFrameExt, SAFE_FRAME_EXT, type FrameExt } from "@/lib/frameFormat";
import { createFrameScrub, budgetFrames } from "@/lib/frameScrub";

/* ============================================================
   EVORA — scroll-scrubbed hero

   Draws a bounded stack of frame images to a <canvas> on scroll —
   the technique from LILITH's site/scrubfilm.js, which scrubs
   correctly on the phones this hero kept failing on. See
   lib/frameScrub.ts.

   This has now been all three ways round, so the history matters:

   1. Canvas, UNBOUNDED (125 mobile / 361 desktop frames, plus the
      configurator's own stack). ~1 GB of decoded bitmaps against
      iOS Safari's few-hundred-MB ceiling — it evicted frames or
      killed the tab. Same bug class as BookMode / CatalogBrowser
      and /catalog. The technique was never the problem here; the
      FRAME COUNT was.
   2. <video> currentTime scrubbing. Fixed the memory, but made the
      hero depend on iOS's media stack cooperating, and it did not:
      autoplay refusal left the decoder asleep so the clip seeked
      but never painted. None of that is observable in any browser
      available for testing here, which is why several fixes in a
      row missed on the real device.
   3. Canvas again, BOUNDED to FRAME_BUDGET frames (60), drawing one
      per tick so the browser decodes lazily. Nothing to wake, no
      gesture to satisfy, no seek to hang — and a fraction of the
      memory that broke (1), because the cap is the actual fix.

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

// The copy is fully set on first paint and then dissolves as the walk starts:
// solid until COPY_HOLD, gone by COPY_OUT, so the visitor reads the promise
// first and is then handed the room with nothing on top of it.
const COPY_HOLD = 0.06;
const COPY_OUT = 0.42;

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
  const stickyRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
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
  // Separate, and null until the probe lands. The poster must render on the
  // server (so it needs a value immediately), but the SCRUB must not start
  // before the format is known — starting on the webp fallback and re-running
  // when avif resolves downloads the entire stack twice. Measured: 122 requests
  // for a 60-frame film.
  const [scrubExt, setScrubExt] = useState<FrameExt | null>(null);
  useEffect(() => {
    resolveFrameExt().then((e) => { setPosterExt(e); setScrubExt(e); });
  }, []);

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
    if (!scrubExt) return;   // wait for the avif/webp probe — see scrubExt above

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
    const sectionProgress = () => {
      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - viewportH;
      return scrollable > 0 ? Math.min(Math.max(-rect.top / scrollable, 0), 1) : 0;
    };
    // The film runs the WHOLE section — no held tail at the end. A hold was
    // tried and removed: with the copy now dissolving at the START of the walk
    // there was nothing left to hold FOR, so the tail just read as the page
    // refusing to move on.
    const progress = sectionProgress;

    // Hold the branded Loader until this clip is FULLY downloaded, reporting
    // real byte progress so the bar reflects the actual wait. 100 units = 100
    // percentage points, so the count-based preload bus gives a smooth bar.
    const UNITS = 100;
    let released = 0;
    const releaseTo = (fraction: number) => {
      const want = Math.min(UNITS, Math.round(fraction * UNITS));
      if (want > released) { preload.done(want - released); released = want; }
    };
    const release = () => releaseTo(1);
    preload.add(UNITS);

    // Canvas frame scrub (see lib/frameScrub.ts) — the <video> scrub is gone.
    // Seeking a video is a request iOS is free to refuse, and it kept refusing
    // in ways nothing available here could reproduce. Drawing an image is not.
    const mobile = isMobileNow();
    const stack = mobile ? mobileStack(scrubExt) : desktopStack(variant, scrubExt);
    const frames = budgetFrames(stack.total, stack.src);

    const scrub = createFrameScrub({
      container: stage,
      frames,
      className: "hs__canvas",
      progress,
      reduce: !!reduce,
      onProgress: releaseTo,
      onFirstFrame: () => { setReady(true); setPainted(true); },
    });
    // The reveal must never wait on the whole stack: the nearest-loaded-frame
    // fallback means the hero is correct from the first frame that lands.
    const revealTimer = window.setTimeout(release, 2500);

    // Copy DISSOLVE, driven from the same scroll position as the film: the
    // headline is fully set on arrival, then lifts and fades out as the walk
    // gets going, handing the visitor the room with nothing written over it.
    // Written straight to the node's style rather than through state — this
    // runs every frame, and a setState per frame would re-render the whole
    // hero (and its canvas) 60 times a second. Polled off layout in rAF for
    // the same reason the scrub is: scroll events and IntersectionObserver
    // both misreport under Lenis on phones.
    let uiRaf = 0;
    const copyEl = copyRef.current;
    const uiTick = () => {
      if (copyEl) {
        const p = sectionProgress();
        const t = Math.min(1, Math.max(0, (p - COPY_HOLD) / (COPY_OUT - COPY_HOLD)));
        // ease-out cubic, so it holds its presence a beat then leaves cleanly
        const e = 1 - Math.pow(1 - t, 3);
        copyEl.style.opacity = String(1 - e);
        copyEl.style.transform = `translate3d(0, ${-e * 6}vh, 0)`;
        // once invisible it must not eat clicks meant for the film/section
        copyEl.style.pointerEvents = e > 0.98 ? "none" : "";
      }
      uiRaf = requestAnimationFrame(uiTick);
    };
    uiRaf = requestAnimationFrame(uiTick);

    const onResize = () => measureViewport();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    return () => {
      cancelAnimationFrame(uiRaf);
      window.clearTimeout(revealTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      release();
      scrub.destroy();
    };
  }, [variant, reduce, scrubExt]);

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
  // staticMode = the visitor prefers reduced motion. The copy is simply there,
  // already in place, on first paint. (The scroll dissolve in HeroScroll still
  // applies — it only moves when the visitor moves, which is not the
  // autoplaying motion reduced-motion protects against.)
  const up = staticMode
    ? { hidden: { y: "0%" }, show: () => ({ y: "0%", transition: { duration: 0 } }) }
    : {
        hidden: { y: "115%" },
        show: (i: number) => ({ y: "0%", transition: { duration: 1.25, ease, delay: 0.25 + i * 0.13 } }),
      };
  const fade = (delay: number) =>
    staticMode
      ? { initial: { opacity: 1, y: 0 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0 } }
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1.0, ease, delay },
        };

  const heroTitleLines = [t("hero_l1" as never), t("hero_l2" as never), t("hero_l3" as never)];

  return (
    <div className="hero__content hs__content">
      <motion.span {...fade(0.2)} className="eyebrow" style={{ color: "var(--brass-2)", display: "block" }}>
        {t("hero_eyebrow" as never)}
      </motion.span>

      {/* aria-label carries the whole sentence, and a real space text node
          follows each line, so a screen reader / crawler reads
          "Your home, beautifully furnished." — not the run-together
          "Your home,beautifullyfurnished." the block spans produced with no
          whitespace between them. */}
      <h1 className="display hero__title" aria-label={heroTitleLines.join(" ")}>
        {heroTitleLines.map((line, i) => (
          <span key={i} style={{ display: "block", overflow: "hidden", paddingBottom: "0.06em" }}>
            <motion.span variants={up} custom={i} initial="hidden" animate="show" style={{ display: "inline-block" }}>
              {i === 1 ? <span className="serif-i" style={{ color: "var(--brass-2)" }}>{line}</span> : line}
            </motion.span>
            {i < heroTitleLines.length - 1 ? " " : ""}
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
  .hs__canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
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

  /* RTL: the copy moves to the right, so the readability scrim must darken the
     RIGHT instead of the left. Mirror each gradient's angle horizontally
     (Xdeg -> 360-Xdeg). Without this the Arabic copy sits over the bright side
     of the film. */
  html[dir="rtl"] .hs__scrim, html[dir="rtl"] .hero__scrim { background:
      linear-gradient(255deg, rgba(13,11,9,0.92) 0%, rgba(13,11,9,0.62) 32%, rgba(13,11,9,0.18) 64%, rgba(13,11,9,0.05) 100%),
      radial-gradient(120% 80% at 50% 120%, rgba(8,6,4,0.6), transparent 60%); }
  html[dir="rtl"] .hs--c .hs__scrim { background:
      linear-gradient(260deg, rgba(13,11,9,0.44) 0%, rgba(13,11,9,0.20) 24%, rgba(13,11,9,0.03) 48%, rgba(13,11,9,0) 66%),
      linear-gradient(0deg, rgba(8,6,4,0.26) 0%, rgba(8,6,4,0) 26%); }
  html[dir="rtl"] .hs__left { background: linear-gradient(270deg, rgba(8,6,4,0.6) 0%, rgba(8,6,4,0.3) 14%, rgba(8,6,4,0) 34%); }
  .hs--c .hero__title { text-shadow: 0 2px 22px rgba(8,6,4,0.7), 0 1px 4px rgba(8,6,4,0.45); }
  .hs--c .hero__sub { text-shadow: 0 1px 16px rgba(8,6,4,0.7), 0 1px 3px rgba(8,6,4,0.5); }
  .hs--c .hero__meta { color: rgba(251,247,240,0.85); text-shadow: 0 1px 8px rgba(8,6,4,0.6); }

  .hs__copy { position: absolute; inset: 0; z-index: 3; display: flex; align-items: center; will-change: transform, opacity; }
  .hs--static .hero__content { position: relative; z-index: 3; }
  /* Bottom padding must clear the vertical SCROLL indicator pinned at
     bottom:1.8rem — at the old clamp(3rem,8vh,5rem) the meta line ("103K+
     following · Khalda · Amman") ran straight through it, in both LTR and RTL. */
  .hero__content, .hs__content { width: 100%; max-width: 1480px; margin-inline: auto; padding-inline: var(--gut); padding-block: clamp(8rem, 14vh, 11rem) clamp(4rem, 9vh, 6rem); }
  /* Headline: bigger and tighter than the old 7rem/400. The film behind it is
     busy, so the type has to hold its own — heavier weight, negative tracking
     and a sub-1 line-height stack the three lines into one solid block. */
  /* Sized against the viewport's HEIGHT as well as its width. The copy block is
     vertically centred in the sticky pane, so a width-only clamp overflowed a
     short laptop window — pushing the eyebrow up under the fixed nav and
     cutting the meta line off the bottom. min(vw, vh) keeps the three lines,
     the sub, the buttons and the meta row inside the pane at any aspect. */
  .hero__title { color: var(--paper); font-size: clamp(2.9rem, min(8.4vw, 10.4vh), 7.4rem); line-height: 0.92; margin: 1.4rem 0 0; font-weight: 500; letter-spacing: -0.042em; max-width: 13ch;
    text-shadow: 0 2px 30px rgba(8,6,4,0.45), 0 1px 3px rgba(8,6,4,0.35); }
  /* The one accent word carries the contrast: lighter, italic, brass. */
  .hero__title .serif-i { font-weight: 400; letter-spacing: -0.022em; }
  .hero__sub { color: rgba(251,247,240,0.9); font-size: clamp(1rem, min(1.4vw, 2.2vh), 1.32rem); line-height: 1.55; max-width: 44ch; margin: clamp(1.1rem, 2.4vh, 1.9rem) 0 0; font-weight: 300; letter-spacing: -0.004em; text-shadow: 0 1px 20px rgba(8,6,4,0.5); }
  .hero__cta { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: clamp(1.4rem, 3.2vh, 2.4rem); }
  /* Buttons sized up to sit under a much larger headline without looking like
     leftovers, and given a real hover lift. */
  .hero__cta-1, .hero__cta-2 { padding: 1.05em 2.1em; font-size: 0.9rem; font-weight: 500; letter-spacing: 0.01em;
    transition: background .45s var(--ease), border-color .45s var(--ease), color .45s var(--ease), transform .45s var(--ease); }
  .hero__cta-1 { background: var(--paper); color: var(--ink); box-shadow: 0 14px 40px -18px rgba(0,0,0,0.7); }
  .hero__cta-1:hover { background: var(--brass-2); color: var(--ink); transform: translateY(-3px); }
  .hero__cta-2 { border: 1px solid rgba(251,247,240,0.45); color: var(--paper); backdrop-filter: blur(6px); background: rgba(251,247,240,0.04); }
  .hero__cta-2:hover { background: rgba(251,247,240,0.14); border-color: var(--paper); transform: translateY(-3px); }
  @media (max-width: 768px) {
    .hero__title { max-width: 11ch; letter-spacing: -0.038em; }
    .hero__cta { gap: 0.6rem; }
    .hero__cta-1, .hero__cta-2 { padding: 1em 1.6em; }
  }
  .hero__meta { display: flex; align-items: center; flex-wrap: wrap; gap: 0.85rem; margin-top: clamp(1.5rem, 3.4vh, 2.6rem); color: rgba(251,247,240,0.72); font-size: 0.72rem; letter-spacing: 0.14em; text-transform: uppercase; }
  .hero__dot { width: 4px; height: 4px; border-radius: 50%; background: var(--brass-2); }

  .hs__tag { position: absolute; bottom: 1.7rem; inset-inline-end: clamp(1.25rem, 5vw, 6rem); z-index: 4; display: inline-flex; align-items: center; gap: 0.7rem; background: rgba(251,247,240,0.92); backdrop-filter: blur(8px); color: var(--ink); padding: 0.6rem 1rem 0.6rem 0.7rem; border-radius: 100px; font-size: 0.84rem; font-family: var(--font-display); }
  .hs__tag-k { background: #0d0b09; color: var(--paper); font-family: var(--font-sans); font-size: 0.6rem; letter-spacing: 0.18em; text-transform: uppercase; padding: 0.3em 0.7em; border-radius: 100px; }
  /* Bottom-CENTRE, not bottom-start. Pinned to the inline-start gutter it sat
     in the same column as the hero copy and ran through the meta line
     ("103K+ following · Khalda · Amman") — in LTR and RTL, and at some viewport
     heights no amount of bottom padding cleared it. Centre is free (the "Now
     showing" tag holds bottom-end) and is direction-neutral, so it needs no RTL
     variant. */

  @media (max-width: 860px) {
    .hs__content { padding-block: clamp(7rem, 18vh, 9rem) clamp(4rem, 12vh, 6rem); }
    .hero__title { font-size: clamp(2.8rem, 13vw, 4.4rem); margin-top: 1.1rem; max-width: 14ch; }
    .hero__sub { font-size: 1.02rem; margin-top: 1.3rem; }
    .hero__cta { margin-top: 1.8rem; gap: 0.6rem; }
    .hero__cta .btn { flex: 1 1 auto; justify-content: center; min-height: 44px; align-items: center; }
    .hero__meta { margin-top: 2rem; gap: 0.6rem; font-size: 0.66rem; }
    .hs__tag { display: none; }
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
