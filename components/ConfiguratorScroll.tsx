"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useT } from "@/lib/i18n";
import { Rise } from "@/components/motion";
import { openStartProject } from "@/lib/startProject";
import { WHATSAPP } from "@/lib/brand";
import { SURFACES, CONFIG_BASE, type SurfaceVariant } from "@/lib/configurator";
import { resolveFrameExt, SAFE_FRAME_EXT, type FrameExt } from "@/lib/frameFormat";
import { avifSrc } from "@/lib/avifSrc";
import { createVideoScrub } from "@/lib/videoScrub";

// New, page-local strings (the DesignRequest.tsx pattern). Existing keys still
// come from t(); only fresh copy lives here.
const T = {
  wa: { en: "Ask on WhatsApp", ar: "اسأل عبر واتساب" },
  wa_msg: {
    en: "Hi Evora — I'd like to talk about a bespoke kitchen island.",
    ar: "مرحبًا إيفورا — أودّ التحدث عن جزيرة مطبخ حسب الطلب.",
  },
  // tells the visitor the swatches are live — the whole point of the beat
  cfg_instruct: {
    en: "Pick a stone — your island re-renders live.",
    ar: "اختر حجرًا — تتبدّل الجزيرة أمامك.",
  },
  cfg_active_label: { en: "Selected stone", ar: "الحجر المختار" },
  make_eyebrow: { en: "From plan to kitchen", ar: "من المخطط إلى المطبخ" },
  make_heading: { en: "How a bespoke island is made", ar: "كيف تُصنع جزيرة حسب الطلب" },
  make_lead: {
    en: "No catalogue numbers, no guesswork — three steps from the stone you choose to the island standing in your home.",
    ar: "لا أرقام كتالوج ولا تخمين — ثلاث خطوات من الحجر الذي تختاره إلى الجزيرة في منزلك.",
  },
  s1_n: { en: "01", ar: "٠١" },
  s1_t: { en: "Choose your stone", ar: "اختر حجرك" },
  s1_b: {
    en: "Sit with our designers in Khalda and settle the marble, finish and proportions — exactly as you saw them on screen.",
    ar: "اجلس مع مصمّمينا في خلدا واختر الرخام والتشطيب والمقاسات — تمامًا كما رأيتها على الشاشة.",
  },
  s2_n: { en: "02", ar: "٠٢" },
  s2_t: { en: "We cut it in our workshop", ar: "نصنعها في ورشتنا" },
  s2_b: {
    en: "Your island is built to order by our own makers in Amman — one slab, measured and finished by hand.",
    ar: "تُصنع جزيرتك خصيصًا على أيدي صنّاعنا في عمّان — لوحٌ واحد، يُقاس ويُشطَّب يدويًا.",
  },
  s3_n: { en: "03", ar: "٠٣" },
  s3_t: { en: "We fit it in your home", ar: "نركّبها في منزلك" },
  s3_b: {
    en: "We deliver and install it ourselves, then leave the room looking exactly the way you decided it would.",
    ar: "نوصّلها ونركّبها بأنفسنا، ثم نترك الغرفة كما قرّرتها أنت تمامًا.",
  },
};

// 169 native frames of the kitchen fly-through, ending pinned on the island.
const DESKTOP_TOTAL = 169;
const DESKTOP_SCROLL_VH = 420; // scrub length; the last ~22% reveals the configurator
// phones scrub a portrait frame stack (/evora/config-frames-mobile) — same
// scroll-scrub interaction as desktop, correctly framed for the phone, full
// 24fps stack (169 frames @native 720px) — crisp + as smooth as desktop
const MOBILE_TOTAL = 169;
const MOBILE_SCROLL_VH = 300;
const pad = (n: number) => String(n).padStart(4, "0");

export default function ConfiguratorScroll() {
  const { t, lang } = useT();
  const tl = (k: keyof typeof T) => T[k][lang];
  const reduce = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;
  const waHref = `${WHATSAPP}?text=${encodeURIComponent(T.wa_msg[lang])}`;

  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const [ready, setReady] = useState(false);
  // Only true once the video has painted a real frame — see HeroScroll for why
  // metadata alone is not enough on iOS.
  const [painted, setPainted] = useState(false);
  const [revealed, setRevealed] = useState(false); // configurator UI visible/interactive
  const [isMobile, setIsMobile] = useState(false);  // ≤768px → portrait frame scrub + bottom sheet
  // frames ship as avif (primary) + webp (fallback); resolved per-browser.
  // null until the probe lands — the scrub preloader MUST NOT start before
  // then, or the frameExt flip re-runs the effect and downloads BOTH formats.
  const [frameExt, setFrameExt] = useState<FrameExt | null>(null);

  // frame stack + scrub length for the active device (phones scrub the portrait
  // mobile kitchen frames; desktop scrubs the landscape fly-through)
  const TOTAL = isMobile ? MOBILE_TOTAL : DESKTOP_TOTAL;
  // NOTE: scroll length now lives in CSS (.cfg / @media), not here — see the
  // hydration-branch note in the JSX. MOBILE_SCROLL_VH / DESKTOP_SCROLL_VH are
  // kept as the documented source of those two numbers.
  const frameSrc = (i: number) => {
    const ext = frameExt ?? SAFE_FRAME_EXT; // poster renders before the probe
    return isMobile
      ? `/evora/config-frames-mobile/frame_${pad(i)}.${ext}`
      : `/evora/config-frames/frame_${pad(i)}.${ext}`;
  };

  // ---- phone vs. desktop: drives the whole mobile beat (video + bottom sheet) ----
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // ---- resolve avif-vs-webp once (near-instant data-URI probe) ----
  useEffect(() => { resolveFrameExt().then(setFrameExt); }, []);

  // ---- preload every stone variant once the format is known ----
  // Without this, tapping a swatch swaps `src` on an unloaded <img>; the
  // AnimatePresence crossfade starts immediately, so for the ~100-300ms the
  // new file takes to fetch you see straight through the (now-transparent)
  // outgoing image to the base kitchen frame on the canvas underneath — read
  // by the visitor as "it flashes the first photo, then loads another."
  // Preloading means every variant is already cached before it's ever picked.
  useEffect(() => {
    if (!frameExt) return;
    const toAvifLocal = (src: string) => (frameExt === "avif" ? src.replace(/\.webp$/i, ".avif") : src);
    const urls = new Set<string>();
    for (const v of SURFACES) {
      urls.add(toAvifLocal(v.image));
      if (/^\/evora\/configurator\/surface-[a-z0-9-]+\.webp$/.test(v.image)) {
        urls.add(toAvifLocal(v.image.replace(/\.webp$/, "-mobile.webp")));
      }
    }
    const imgs = Array.from(urls, (src) => {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
      return img;
    });
    return () => { imgs.length = 0; };
  }, [frameExt]);

  // the panel reveals near the end of the scrub (phone & desktop); reduced motion
  // shows it immediately
  // Was `revealed || reduce`, which force-opened the panel for reduced-motion
  // visitors because the scrub used to be disabled for them and they'd never
  // reach the reveal point. The scrub runs for everyone now, so `revealed`
  // alone is correct — and it removes another server/client render branch.
  const panelOpen = revealed;

  // ---- selected surface + any user-uploaded variants ----
  const [variants, setVariants] = useState<SurfaceVariant[]>(SURFACES);
  const [activeId, setActiveId] = useState<string>(SURFACES[0].id);
  const active = variants.find((v) => v.id === activeId) ?? variants[0];

  // ---------- frame scrubbing (phone + desktop) ----------
  useEffect(() => {
    // Reduced motion no longer bails out. This scrub has no self-driven motion
    // — it advances only as the visitor scrolls — and Chrome forces
    // prefers-reduced-motion:reduce on every laptop running Battery Saver, so
    // bailing turned the kitchen film into a dead poster on ordinary machines.
    // That exact bug was already fixed in the hero (commit befef66) and never
    // applied here. Reduced motion instead drops the easing lerp, so frames
    // track the scroll exactly rather than drifting toward it.
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    // Viewport height for the scrub math, measured from .cfg__sticky's own
    // rendered box (CSS: height:100svh). svh is stable while in-app browser
    // chrome hides and reappears; innerHeight is not, and reading it live made
    // the scrub jump on every scroll direction change.
    let viewportH = window.innerHeight;
    const measureViewport = () => {
      const rect = stickyRef.current?.getBoundingClientRect();
      viewportH = rect && rect.height > 0 ? rect.height : window.innerHeight;
    };
    measureViewport();

    // Raw scroll progress through the section, 0..1.
    const sectionProgress = () => {
      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - viewportH;
      return scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0;
    };
    // Frames play across the first 78% of the scroll; the last 22% holds the
    // final frame and brings up the configurator UI. Passed to the scrub.
    const progress = () => Math.min(1, sectionProgress() / 0.78);

    // Lazy-load the clip only once the section is within ~2 viewports. The
    // hero clip is what fills the screen first; if the configurator blob
    // downloaded concurrently it would fight the hero for bandwidth (measured:
    // first paint slipped to 30s on a cold 3Mbps mobile connection) and a
    // phone would spend data on a clip the visitor may never scroll to. The
    // scrub is created on approach, then the rest is identical.
    let scrub: ReturnType<typeof createVideoScrub> | null = null;
    const startScrub = () => {
      if (scrub) return;
      scrub = createVideoScrub({
        container: stage,
        src: "/evora/scrub/config-desktop.mp4",
        srcMobile: "/evora/scrub/config-mobile.mp4",
        mobileQuery: "(max-width: 768px)",
        className: "cfg__video",
        progress,
        reduce: !!reduce,
        onReady: () => setReady(true),
        onFirstFrame: () => setPainted(true),
      });
    };

    // One always-on light rAF that (a) starts the scrub on approach and (b)
    // drives the configurator UI reveal from scroll position. Both must run
    // regardless of whether the clip has loaded — the reveal is scroll-driven
    // UI, not a video event, so it can't live inside the scrub's progress()
    // callback (which only fires once the blob is ready). Poll layout rather
    // than IntersectionObserver, which misreports under Lenis on phones.
    let uiRaf = 0;
    let revealedNow = false;
    const uiTick = () => {
      const rect = section.getBoundingClientRect();
      if (!scrub && rect.top < viewportH * 2) startScrub();
      const rev = sectionProgress() > 0.8;
      if (rev !== revealedNow) { revealedNow = rev; setRevealed(rev); }
      uiRaf = requestAnimationFrame(uiTick);
    };
    uiRaf = requestAnimationFrame(uiTick);

    const onResize = () => measureViewport();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    return () => {
      cancelAnimationFrame(uiRaf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      scrub?.destroy();
    };
  }, [reduce]);

  // ---- handle a user-uploaded variant image (instant local preview) ----
  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const id = `upload-${variants.length}`;
    const name = file.name.replace(/\.[^.]+$/, "");
    setVariants((prev) => [
      ...prev,
      { id, label: { en: name, ar: name }, swatch: url, image: url },
    ]);
    setActiveId(id);
    e.target.value = "";
  };

  const isBase = active?.image === CONFIG_BASE || active?.id === SURFACES[0].id;
  // Upgrade the still images (base poster + stone swaps) to AVIF, but ONLY once
  // the probe has confirmed this browser can decode it — so the .webp original
  // is always the safe fallback (identical pattern to the frame stack). ~54%
  // lighter swaps with zero risk on old Safari/Android.
  const toAvif = (src: string) => (frameExt === "avif" ? src.replace(/\.webp$/i, ".avif") : src);
  // On phones the swap uses a portrait 9:16 render of each stone
  // (surface-<id>-mobile.webp) so it fills the vertical frame instead of a
  // cropped landscape. Falls back to the landscape image via onError.
  const variantSrc = toAvif(
    isMobile && active && /^\/evora\/configurator\/surface-[a-z0-9-]+\.webp$/.test(active.image)
      ? active.image.replace(/\.webp$/, "-mobile.webp")
      : (active?.image ?? "")
  ) || active?.image;

  const steps = [
    { n: tl("s1_n"), title: tl("s1_t"), body: tl("s1_b") },
    { n: tl("s2_n"), title: tl("s2_t"), body: tl("s2_b") },
    { n: tl("s3_n"), title: tl("s3_t"), body: tl("s3_b") },
  ];

  return (
    <>
    <section
      id="configurator"
      ref={sectionRef}
      className={`cfg ${isMobile ? "cfg--mobile" : ""}`}
    >
      <div className="cfg__sticky" ref={stickyRef}>
        {/* Scrub video — portrait clip on phones, landscape on desktop.
            The section's scroll LENGTH is set by CSS media query (see css
            below), not by an inline style off `isMobile` state. The old inline
            style was a hydration branch: SSR shipped 420vh and hydration
            flipped it to 300svh, moving document height by ~130,000px on a
            phone mid-load. The hero avoids exactly this, by design. */}
        <div ref={stageRef} className={`cfg__stage${painted ? " is-painted" : ""}`}
          role="img" aria-label={t("cfg_aria")} />
        {!painted && (
          // <picture> so phones never fetch the desktop poster during the
          // pre-hydration render (isMobile state starts false on SSR)
          <picture>
            <source
              media="(max-width: 768px)"
              srcSet={`/evora/config-frames-mobile/frame_${pad(MOBILE_TOTAL)}.${frameExt ?? SAFE_FRAME_EXT}`}
            />
            <img
              src={`/evora/config-frames/frame_${pad(DESKTOP_TOTAL)}.${frameExt ?? SAFE_FRAME_EXT}`}
              alt=""
              className="cfg__poster"
              aria-hidden
            />
          </picture>
        )}

        {/* The reduced-motion still poster that used to live here is gone: the
            film now scrubs under reduced motion too, so a separate still was
            both redundant AND a hydration branch (server renders nothing,
            a reduced-motion client renders a <picture>). */}

        {/* the selected variant image, layered over the final frame */}
        <AnimatePresence mode="popLayout">
          {panelOpen && !isBase && active && (
            <motion.img
              key={active.id}
              src={variantSrc}
              alt=""
              className="cfg__variant"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease }}
              // if the portrait -mobile render is missing, fall back to the
              // landscape image; if that's missing too, fade out to the base
              onError={(ev) => {
                const el = ev.currentTarget as HTMLImageElement;
                // ext-agnostic: matches -mobile.webp OR -mobile.avif
                if (active && /-mobile\.(webp|avif)$/i.test(el.src) && !el.dataset.fellback) {
                  el.dataset.fellback = "1";
                  el.src = toAvif(active.image); // landscape, same format
                } else {
                  el.style.opacity = "0";
                }
              }}
            />
          )}
        </AnimatePresence>

        <div className="cfg__scrim" />

        {/* heading sits over the footage until the configurator reveals */}
        <motion.div className="cfg__intro" animate={{ opacity: revealed ? 0 : 1 }} transition={{ duration: 0.4 }}>
          <span className="eyebrow" style={{ color: "var(--brass-2)" }}>
            {t("cfg_eyebrow")}
          </span>
          <h2 className="display cfg__h">
            {t("cfg_heading")}
          </h2>
          <p className="cfg__lead">
            {t("cfg_lead")}
          </p>
        </motion.div>

        {/* the configurator panel — bottom sheet on mobile */}
        <AnimatePresence>
          {panelOpen && (
            <motion.div
              className="cfg__panel"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.5, ease }}
            >
              {/* what this beat IS — always on screen so the interaction is obvious */}
              <span className="eyebrow cfg__panel-eyebrow" style={{ color: "var(--brass-2)" }}>
                {t("cfg_panel_eyebrow")}
              </span>
              <p className="cfg__instruct">{tl("cfg_instruct")}</p>

              {/* the active stone, named prominently — swaps as you pick */}
              <div className="cfg__panel-head">
                <span className="cfg__active-kicker">{tl("cfg_active_label")}</span>
                <AnimatePresence mode="wait">
                  <motion.strong
                    key={active ? active.id : "none"}
                    className="cfg__active-name"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, ease }}
                  >
                    {active ? active.label[lang] : ""}
                  </motion.strong>
                </AnimatePresence>
              </div>

              {/* the chosen stone's identity line — swaps as you pick */}
              <AnimatePresence mode="wait">
                {active && active.note && (
                  <motion.p
                    key={active.id}
                    className="cfg__note"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.35, ease }}
                  >
                    {active.note[lang]}
                  </motion.p>
                )}
              </AnimatePresence>

              <div className="cfg__swatches">
                {variants.map((v) => {
                  const isImg = v.swatch.startsWith("/") || v.swatch.startsWith("blob:") || v.swatch.startsWith("http");
                  return (
                    <button
                      key={v.id}
                      type="button"
                      className={`cfg__swatch ${activeId === v.id ? "is-active" : ""}`}
                      onClick={() => setActiveId(v.id)}
                      aria-label={v.label[lang]}
                      aria-pressed={activeId === v.id}
                      title={v.label[lang]}
                      style={isImg
                        ? { backgroundImage: `url(${v.swatch})`, backgroundSize: "cover" }
                        : { background: v.swatch }}
                    />
                  );
                })}

                {/* upload-your-own variant */}
                <label className="cfg__swatch cfg__upload" title={lang === "en" ? "Upload an image" : "ارفع صورة"}>
                  <input type="file" accept="image/*" onChange={onUpload} hidden />
                  <span>＋</span>
                </label>
              </div>

              <div className="cfg__cta">
                <button type="button" className="btn cfg__cta-1" onClick={openStartProject}>
                  {t("cfg_cta")} <span className="arrow">→</span>
                </button>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cfg__cta-wa"
                >
                  {tl("wa")}
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </section>

    {/* closing, static beat — gives the page substance after the scrub */}
    <section className="cfg-make">
      <div className="cfg-make__inner">
        <Rise as="header" className="cfg-make__head">
          <span className="eyebrow" style={{ color: "var(--brass-2)" }}>
            {tl("make_eyebrow")}
          </span>
          <h2 className="display cfg-make__h">{tl("make_heading")}</h2>
          <p className="cfg-make__lead">{tl("make_lead")}</p>
        </Rise>

        <div className="cfg-make__grid">
          {steps.map((s, i) => (
            <Rise key={s.n} as="article" delay={0.08 * (i + 1)} className="cfg-make__step">
              <span className="cfg-make__num">{s.n}</span>
              <h3 className="cfg-make__step-t">{s.title}</h3>
              <p className="cfg-make__step-b">{s.body}</p>
            </Rise>
          ))}
        </div>

        <Rise className="cfg-make__cta" delay={0.34}>
          <button type="button" className="btn cfg-make__cta-1" onClick={openStartProject}>
            {t("cfg_cta")} <span className="arrow">→</span>
          </button>
          <a href={waHref} target="_blank" rel="noopener noreferrer" className="cfg-make__cta-wa">
            {tl("wa")}
          </a>
        </Rise>
      </div>
    </section>

    <style>{css}</style>
    </>
  );
}

const css = `
  /* Scroll LENGTH set here, per breakpoint, so there is no JS/hydration branch
     that changes document height after load (see the note in the JSX). */
  .cfg { position: relative; background: #0d0b09; height: 420vh; }
  @media (max-width: 768px) { .cfg { height: 300svh; } }
  .cfg__sticky { position: sticky; top: 0; height: 100vh; height: 100svh; overflow: hidden; }
  .cfg__stage { position: absolute; inset: 0; z-index: 1; opacity: 0; transition: opacity .35s ease; }
  .cfg__stage.is-painted { opacity: 1; }
  .cfg__video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
  .cfg__canvas, .cfg__poster, .cfg__variant {
    position: absolute; inset: 0; width: 100%; height: 100%;
    object-fit: cover; display: block; z-index: 0;
  }
  .cfg__variant { z-index: 1; }
  .cfg__scrim { position: absolute; inset: 0; z-index: 2; pointer-events: none;
    background:
      linear-gradient(0deg, rgba(8,6,4,0.55) 0%, rgba(8,6,4,0) 34%),
      linear-gradient(90deg, rgba(8,6,4,0.45) 0%, rgba(8,6,4,0) 30%); }

  .cfg__intro { position: absolute; z-index: 3; left: clamp(1.4rem, 5vw, 5rem);
    top: 50%; transform: translateY(-50%); max-width: 30ch; pointer-events: none; }
  .cfg__h { color: #fbf7f0; font-size: clamp(2.4rem, 6vw, 5rem); line-height: 0.98; margin: 0.3rem 0; }
  .cfg__lead { color: rgba(251,247,240,0.82); font-size: clamp(1rem, 1.4vw, 1.2rem); }

  .cfg__panel { position: absolute; z-index: 4;
    left: clamp(1.4rem, 5vw, 5rem); bottom: clamp(1.6rem, 6vh, 4rem);
    background: rgba(18,14,11,0.78); backdrop-filter: blur(16px) saturate(1.1);
    -webkit-backdrop-filter: blur(16px) saturate(1.1);
    border: 1px solid rgba(251,247,240,0.14); border-radius: 18px;
    padding: clamp(1rem, 2vw, 1.6rem); width: min(92vw, 460px);
    box-shadow: 0 24px 60px rgba(0,0,0,0.45); }
  .cfg__panel-eyebrow { display: block; }
  .cfg__instruct { color: rgba(251,247,240,0.82); font-size: clamp(0.9rem, 1.1vw, 1rem);
    line-height: 1.5; margin: 0.4rem 0 0.9rem; max-width: 34ch; }
  .cfg__panel-head { display: flex; flex-direction: column; gap: 0.12rem; margin-bottom: 0.5rem; }
  .cfg__active-kicker { color: rgba(251,247,240,0.55); font-size: 0.72rem;
    letter-spacing: 0.16em; text-transform: uppercase; }
  .cfg__active-name { color: #fbf7f0; font-size: clamp(1.6rem, 4.4vw, 2.1rem);
    line-height: 1.05; letter-spacing: 0.005em; font-weight: 600; }
  .cfg__note { color: rgba(251,247,240,0.74); font-size: clamp(0.88rem, 1vw, 0.95rem); line-height: 1.5;
    margin: 0 0 0.9rem; max-width: 34ch; }
  [dir="rtl"] .cfg__note { letter-spacing: 0; }

  .cfg__swatches { display: flex; gap: 0.7rem; flex-wrap: wrap; }
  .cfg__swatch { width: 46px; height: 46px; border-radius: 12px; flex: 0 0 auto;
    border: 2px solid rgba(251,247,240,0.25); cursor: pointer; padding: 0;
    transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
    background-position: center; background-size: cover; }
  .cfg__swatch:hover { transform: translateY(-2px) scale(1.05); }
  .cfg__swatch.is-active { border-color: var(--brass-2, #c8a972);
    box-shadow: 0 0 0 3px rgba(200,169,114,0.4); transform: scale(1.06); }
  /* keyboard focus on the dark glass panel: the page's dark-brass ring is hard
     to see here, so use the lighter on-dark brass + offset for clear contrast */
  .cfg__panel .cfg__swatch:focus-visible,
  .cfg__panel .cfg__cta-wa:focus-visible {
    outline: 2px solid var(--brass-2, #c8a972); outline-offset: 3px; }
  .cfg__upload { display: grid; place-items: center; color: #fbf7f0;
    background: rgba(251,247,240,0.08); border-style: dashed; font-size: 1.3rem; }
  .cfg__upload:hover { background: rgba(251,247,240,0.16); }
  .cfg__video { position: absolute; inset: 0; width: 100%; height: 100%;
    object-fit: cover; display: block; z-index: 0; }

  .cfg__cta { margin-top: 1.1rem; display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
  .cfg__cta-1 { display: inline-flex; align-items: center; gap: 0.5rem; cursor: pointer; }
  .cfg__cta-wa { color: rgba(251,247,240,0.82); font-size: 0.92rem; text-decoration: none;
    border-bottom: 1px solid rgba(251,247,240,0.3); padding-bottom: 1px; transition: color 0.2s ease, border-color 0.2s ease; }
  .cfg__cta-wa:hover { color: #fbf7f0; border-color: var(--brass-2, #c8a972); }

  [dir="rtl"] .cfg__intro, [dir="rtl"] .cfg__panel { left: auto; right: clamp(1.4rem, 5vw, 5rem); }

  /* ── MOBILE (≤768px): full-bleed video beat + bottom-sheet panel ──────── */
  .cfg--mobile .cfg__sticky { height: 100svh; }
  .cfg--mobile .cfg__intro { display: none; } /* the panel carries the explanation */

  .cfg--mobile .cfg__panel,
  [dir="rtl"] .cfg--mobile .cfg__panel {
    left: 0; right: 0; bottom: 0; top: auto; transform: none;
    width: 100%; max-width: none;
    border-radius: 20px 20px 0 0;
    border-width: 1px 0 0 0;
    background: rgba(14,11,9,0.8);
    box-shadow: 0 -18px 50px rgba(0,0,0,0.5);
    padding: 0.6rem 1.15rem;
    padding-top: 0.6rem;
    padding-bottom: calc(0.55rem + env(safe-area-inset-bottom));
    padding-left: max(1.15rem, env(safe-area-inset-left));
    padding-right: max(1.15rem, env(safe-area-inset-right));
  }
  /* keep the bottom sheet as small as possible so the kitchen fills the screen:
     drop the instruction, eyebrow and note lines; compact header + swatches */
  .cfg--mobile .cfg__instruct,
  .cfg--mobile .cfg__panel-eyebrow,
  .cfg--mobile .cfg__note { display: none; }
  .cfg--mobile .cfg__panel-head { flex-direction: row; align-items: baseline; gap: 0.5rem; margin-bottom: 0.4rem; }
  .cfg--mobile .cfg__active-kicker { font-size: 0.58rem; }
  .cfg--mobile .cfg__active-name { font-size: clamp(1rem, 4.4vw, 1.25rem); }

  /* swatch row scrolls horizontally instead of wrapping; chips ≥44px */
  .cfg--mobile .cfg__swatches {
    flex-wrap: nowrap; overflow-x: auto; -webkit-overflow-scrolling: touch;
    padding-bottom: 0.35rem; scrollbar-width: none;
    scroll-snap-type: x proximity;
  }
  .cfg--mobile .cfg__swatches::-webkit-scrollbar { display: none; }
  .cfg--mobile .cfg__swatch { width: 42px; height: 42px; scroll-snap-align: start; }

  /* full-width, finger-friendly CTAs */
  .cfg--mobile .cfg__cta { gap: 0.6rem; margin-top: 0.55rem; }
  .cfg--mobile .cfg__cta-1 { width: 100%; justify-content: center; min-height: 44px; }
  .cfg--mobile .cfg__cta-wa { min-height: 44px; display: inline-flex; align-items: center; }

  /* ── closing "how it's made" beat ───────────────────────────────── */
  .cfg-make { background: #0d0b09; color: #fbf7f0; padding: clamp(4rem, 10vh, 8rem) 0; }
  .cfg-make__inner { max-width: 1100px; margin: 0 auto; padding: 0 clamp(1.4rem, 5vw, 3rem); }
  .cfg-make__head { max-width: 40ch; }
  .cfg-make__h { font-size: clamp(2rem, 4.6vw, 3.4rem); line-height: 1.02; margin: 0.4rem 0 0.8rem; color: #fbf7f0; }
  .cfg-make__lead { color: rgba(251,247,240,0.74); font-size: clamp(1rem, 1.3vw, 1.15rem); line-height: 1.6; }
  .cfg-make__grid { display: grid; grid-template-columns: repeat(3, 1fr);
    gap: clamp(1.4rem, 3vw, 2.6rem); margin-top: clamp(2.4rem, 5vh, 3.6rem); }
  .cfg-make__step { border-top: 1px solid rgba(251,247,240,0.16); padding-top: 1.2rem; }
  .cfg-make__num { display: block; font-size: 0.85rem; letter-spacing: 0.18em;
    color: var(--brass-2, #c8a972); margin-bottom: 0.7rem; }
  .cfg-make__step-t { font-size: 1.25rem; margin: 0 0 0.5rem; color: #fbf7f0; }
  .cfg-make__step-b { color: rgba(251,247,240,0.72); font-size: 0.98rem; line-height: 1.6; margin: 0; }
  .cfg-make__cta { margin-top: clamp(2.4rem, 5vh, 3.6rem); display: flex; align-items: center; gap: 1.2rem; flex-wrap: wrap; }
  .cfg-make__cta-1 { display: inline-flex; align-items: center; gap: 0.5rem; cursor: pointer; }
  .cfg-make__cta-wa { color: rgba(251,247,240,0.82); font-size: 0.95rem; text-decoration: none;
    border-bottom: 1px solid rgba(251,247,240,0.3); padding-bottom: 1px; transition: color 0.2s ease, border-color 0.2s ease; }
  .cfg-make__cta-wa:hover { color: #fbf7f0; border-color: var(--brass-2, #c8a972); }

  @media (max-width: 820px) {
    .cfg-make__grid { grid-template-columns: 1fr; gap: 1.6rem; }
  }
`;
