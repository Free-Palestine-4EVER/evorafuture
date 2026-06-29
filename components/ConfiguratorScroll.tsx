"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useT } from "@/lib/i18n";
import { SURFACES, CONFIG_BASE, type SurfaceVariant } from "@/lib/configurator";

// 169 native frames of the kitchen fly-through, ending pinned on the island.
const TOTAL = 169;
const SCROLL_VH = 420; // scrub length; the last ~22% reveals the configurator
const pad = (n: number) => String(n).padStart(4, "0");
const frameSrc = (i: number) => `/evora/config-frames/frame_${pad(i)}.webp`;

export default function ConfiguratorScroll() {
  const { t, lang } = useT();
  const reduce = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;

  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const targetFrame = useRef(1);
  const currentFrame = useRef(1);
  const ticking = useRef(false);

  const [ready, setReady] = useState(false);
  const [revealed, setRevealed] = useState(false); // configurator UI visible/interactive

  // ---- selected surface + any user-uploaded variants ----
  const [variants, setVariants] = useState<SurfaceVariant[]>(SURFACES);
  const [activeId, setActiveId] = useState<string>(SURFACES[0].id);
  const active = variants.find((v) => v.id === activeId) ?? variants[0];

  // ---------- frame scrubbing ----------
  useEffect(() => {
    if (reduce) return;
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

    const onScroll = () => {
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

    // preload
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

    const onResize = () => { sizeCanvas(); draw(Math.round(currentFrame.current)); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    onScroll();

    return () => {
      mounted = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
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

  return (
    <section
      id="configurator"
      ref={sectionRef}
      className="cfg"
      style={{ height: reduce ? "100svh" : `${SCROLL_VH}vh` }}
    >
      <div className="cfg__sticky">
        {/* scrubbed video frames */}
        {!reduce && (
          <canvas ref={canvasRef} className="cfg__canvas" role="img"
            aria-label={t("cfg_aria")} />
        )}
        {(!ready || reduce) && <img src={frameSrc(TOTAL)} alt="" className="cfg__poster" aria-hidden />}

        {/* the selected variant image, layered over the final frame */}
        <AnimatePresence mode="popLayout">
          {(revealed || reduce) && !isBase && active && (
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

        {/* the configurator panel */}
        <AnimatePresence>
          {(revealed || reduce) && (
            <motion.div
              className="cfg__panel"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.5, ease }}
            >
              <div className="cfg__panel-head">
                <span className="eyebrow" style={{ color: "var(--brass-2)" }}>
                  {t("cfg_panel_eyebrow")}
                </span>
                <strong className="cfg__active-name">
                  {active ? active.label[lang] : ""}
                </strong>
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
                <a href="/visit" className="btn cfg__cta-1">
                  {t("cfg_cta")} <span className="arrow">→</span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{css}</style>
    </section>
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
  .cfg__panel-head { display: flex; align-items: baseline; gap: 0.6rem; flex-wrap: wrap; margin-bottom: 0.55rem; }
  .cfg__active-name { color: #fbf7f0; font-size: 1.25rem; letter-spacing: 0.01em; }
  .cfg__note { color: rgba(251,247,240,0.74); font-size: 0.92rem; line-height: 1.5;
    margin: 0 0 0.9rem; max-width: 34ch; }
  [dir="rtl"] .cfg__note { letter-spacing: 0; }

  .cfg__swatches { display: flex; gap: 0.7rem; flex-wrap: wrap; }
  .cfg__swatch { width: 46px; height: 46px; border-radius: 50%;
    border: 2px solid rgba(251,247,240,0.25); cursor: pointer; padding: 0;
    transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
    background-position: center; }
  .cfg__swatch:hover { transform: translateY(-2px) scale(1.05); }
  .cfg__swatch.is-active { border-color: var(--brass-2, #c8a972);
    box-shadow: 0 0 0 3px rgba(200,169,114,0.3); transform: scale(1.06); }
  .cfg__upload { display: grid; place-items: center; color: #fbf7f0;
    background: rgba(251,247,240,0.08); border-style: dashed; font-size: 1.3rem; }
  .cfg__upload:hover { background: rgba(251,247,240,0.16); }

  .cfg__cta { margin-top: 1.1rem; }
  .cfg__cta-1 { display: inline-flex; align-items: center; gap: 0.5rem; }

  [dir="rtl"] .cfg__intro, [dir="rtl"] .cfg__panel { left: auto; right: clamp(1.4rem, 5vw, 5rem); }

  @media (max-width: 720px) {
    .cfg__intro { top: 16%; transform: none; }
    .cfg__panel { left: 50%; right: auto; transform: translateX(-50%); bottom: 1.4rem; }
    [dir="rtl"] .cfg__panel { right: auto; left: 50%; transform: translateX(-50%); }
  }
`;
