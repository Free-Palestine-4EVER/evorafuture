"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useT } from "@/lib/i18n";
import { Rise } from "@/components/motion";
import { openStartProject } from "@/lib/startProject";
import { WHATSAPP } from "@/lib/brand";
import { SURFACES, CONFIG_BASE, CONFIG_MOBILE_VIDEO, type SurfaceVariant } from "@/lib/configurator";

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
const TOTAL = 169;
const SCROLL_VH = 420; // scrub length; the last ~22% reveals the configurator
const pad = (n: number) => String(n).padStart(4, "0");
const frameSrc = (i: number) => `/evora/config-frames/frame_${pad(i)}.webp`;

export default function ConfiguratorScroll() {
  const { t, lang } = useT();
  const tl = (k: keyof typeof T) => T[k][lang];
  const reduce = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;
  const waHref = `${WHATSAPP}?text=${encodeURIComponent(T.wa_msg[lang])}`;

  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const targetFrame = useRef(1);
  const currentFrame = useRef(1);
  const ticking = useRef(false);

  const [ready, setReady] = useState(false);
  const [revealed, setRevealed] = useState(false); // configurator UI visible/interactive
  const [isMobile, setIsMobile] = useState(false);  // ≤768px → video beat + bottom sheet
  const [videoFailed, setVideoFailed] = useState(false); // kitchen-mobile.mp4 not provided yet

  // ---- phone vs. desktop: drives the whole mobile beat (video + bottom sheet) ----
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // on mobile (or reduced motion) the panel is always present; desktop reveals on scroll
  const panelOpen = revealed || reduce || isMobile;

  // ---- selected surface + any user-uploaded variants ----
  const [variants, setVariants] = useState<SurfaceVariant[]>(SURFACES);
  const [activeId, setActiveId] = useState<string>(SURFACES[0].id);
  const active = variants.find((v) => v.id === activeId) ?? variants[0];

  // ---------- frame scrubbing (desktop only) ----------
  useEffect(() => {
    if (reduce || isMobile) return; // mobile plays a portrait video, no 169-frame preload
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let mounted = true;

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
      const cw = window.innerWidth;
      const ch = window.innerHeight;
      const ir = img.naturalWidth / img.naturalHeight;
      const cr = cw / ch;
      let w = cw, h = ch, x = 0, y = 0;
      if (ir > cr) { h = ch; w = ch * ir; x = (cw - w) / 2; }
      else { w = cw; h = cw / ir; y = (ch - h) / 2; }
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, x, y, w, h);
    };

    const render = () => {
      ticking.current = false;
      const cur = currentFrame.current;
      const tgt = targetFrame.current;
      const next = cur + (tgt - cur) * 0.18;
      currentFrame.current = Math.abs(tgt - next) < 0.4 ? tgt : next;
      draw(Math.round(currentFrame.current));
      if (Math.round(currentFrame.current) !== tgt) requestTick();
    };
    const requestTick = () => {
      if (!ticking.current) { ticking.current = true; requestAnimationFrame(render); }
    };

    // Lazy-gate the 169-frame preload: the page paints the single poster webp
    // first, and the heavy frame set only starts loading once the visitor
    // scrolls (or the main thread goes idle) — never on the initial render.
    let started = false;
    const startPreload = () => {
      if (started || !mounted) return;
      started = true;
      let loaded = 0;
      for (let i = 1; i <= TOTAL; i++) {
        const img = new Image();
        img.src = frameSrc(i);
        img.onload = () => {
          loaded++;
          if (i === 1 && mounted) { sizeCanvas(); draw(1); setReady(true); }
          if (loaded === TOTAL && mounted) onScroll();
        };
        imagesRef.current[i] = img;
      }
    };

    const onScroll = () => {
      startPreload(); // first scroll kicks off the frame fetch
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollable = el.offsetHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, -rect.top / scrollable)); // 0..1
      // frames play across the first 78% of the scroll; last 22% holds the
      // final frame and brings up the configurator.
      const frameP = Math.min(1, p / 0.78);
      targetFrame.current = Math.min(TOTAL, Math.max(1, Math.round(frameP * (TOTAL - 1)) + 1));
      setRevealed(p > 0.8);
      requestTick();
    };

    const onResize = () => { sizeCanvas(); draw(Math.round(currentFrame.current)); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    // idle fallback so the frames are ready even if the visitor lingers before
    // scrolling — but still after the first paint, never blocking it.
    const ric = (window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    });
    let idleId: number | undefined;
    let idleTimer: ReturnType<typeof setTimeout> | undefined;
    if (ric.requestIdleCallback) idleId = ric.requestIdleCallback(startPreload, { timeout: 2500 });
    else idleTimer = setTimeout(startPreload, 1400);

    return () => {
      mounted = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (idleId !== undefined && ric.cancelIdleCallback) ric.cancelIdleCallback(idleId);
      if (idleTimer !== undefined) clearTimeout(idleTimer);
    };
  }, [reduce, isMobile]);

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
      style={{ height: reduce || isMobile ? "100svh" : `${SCROLL_VH}vh` }}
    >
      <div className="cfg__sticky">
        {/* DESKTOP: scrubbed 169-frame canvas */}
        {!reduce && !isMobile && (
          <canvas ref={canvasRef} className="cfg__canvas" role="img"
            aria-label={t("cfg_aria")} />
        )}
        {!reduce && !isMobile && !ready && (
          <img src={frameSrc(TOTAL)} alt="" className="cfg__poster" aria-hidden />
        )}

        {/* MOBILE: light portrait video, with base.webp as poster + 404 fallback */}
        {isMobile && (
          <>
            <img src={CONFIG_BASE} alt="" className="cfg__poster" aria-hidden />
            {!reduce && !videoFailed && (
              <video
                className="cfg__video"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster={CONFIG_BASE}
                onError={() => setVideoFailed(true)}
                aria-label={t("cfg_aria")}
              >
                <source src={CONFIG_MOBILE_VIDEO} type="video/mp4" />
              </video>
            )}
          </>
        )}

        {/* reduced-motion desktop: still poster */}
        {reduce && !isMobile && <img src={frameSrc(TOTAL)} alt="" className="cfg__poster" aria-hidden />}

        {/* the selected variant image, layered over the final frame */}
        <AnimatePresence mode="popLayout">
          {panelOpen && !isBase && active && (
            <motion.img
              key={active.id}
              src={active.image}
              alt=""
              className="cfg__variant"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease }}
              // if a variant file isn't uploaded yet, silently fall back to base
              onError={(ev) => { (ev.currentTarget as HTMLImageElement).style.opacity = "0"; }}
            />
          )}
        </AnimatePresence>

        <div className="cfg__scrim" />

        {/* heading sits over the footage until the configurator reveals */}
        <motion.div className="cfg__intro" animate={{ opacity: revealed || isMobile ? 0 : 1 }} transition={{ duration: 0.4 }}>
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
  .cfg { position: relative; background: #0d0b09; }
  .cfg__sticky { position: sticky; top: 0; height: 100vh; overflow: hidden; }
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
    background: rgba(18,14,11,0.55); backdrop-filter: blur(14px) saturate(1.1);
    -webkit-backdrop-filter: blur(14px) saturate(1.1);
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
    background: rgba(14,11,9,0.86);
    box-shadow: 0 -18px 50px rgba(0,0,0,0.5);
    padding: 1.1rem 1.2rem;
    padding-top: 1.1rem;
    padding-bottom: calc(1.1rem + env(safe-area-inset-bottom));
    padding-left: max(1.2rem, env(safe-area-inset-left));
    padding-right: max(1.2rem, env(safe-area-inset-right));
  }

  /* swatch row scrolls horizontally instead of wrapping; chips ≥44px */
  .cfg--mobile .cfg__swatches {
    flex-wrap: nowrap; overflow-x: auto; -webkit-overflow-scrolling: touch;
    padding-bottom: 0.35rem; scrollbar-width: none;
    scroll-snap-type: x proximity;
  }
  .cfg--mobile .cfg__swatches::-webkit-scrollbar { display: none; }
  .cfg--mobile .cfg__swatch { width: 54px; height: 54px; scroll-snap-align: start; }

  /* full-width, finger-friendly CTAs */
  .cfg--mobile .cfg__cta { gap: 0.85rem; margin-top: 1rem; }
  .cfg--mobile .cfg__cta-1 { width: 100%; justify-content: center; min-height: 48px; }
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
