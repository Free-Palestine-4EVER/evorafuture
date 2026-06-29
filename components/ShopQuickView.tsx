"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import ModelViewer, { type ViewerEl } from "@/components/showroom/ModelViewer";
import { applyFinish, pickUpholsteryIndices, type MVElement } from "@/lib/recolor";
import { posterFor, type Product, type Category } from "@/lib/products";
import { completeTheRoom, CATEGORY_SLUG } from "@/lib/shopTaxonomy";
import { WHATSAPP } from "@/lib/brand";
import { openStartProject } from "@/lib/startProject";
import { useT, type Lang } from "@/lib/i18n";

const CAT_AR: Record<Category, string> = {
  Sofas: "الكنب",
  Seating: "الجلوس",
  Tables: "الطاولات",
  Storage: "التخزين",
  Bedroom: "غرف النوم",
};
const FINISH_AR: Record<string, string> = {
  "As shown": "كما هو",
  Oat: "شوفان",
  Bone: "عاجي",
  Sage: "مريمية",
  Olive: "زيتي",
  Slate: "رمادي",
  Clay: "طيني",
  Ink: "حبري",
  Tan: "بني فاتح",
  Cognac: "كونياك",
  Saddle: "سرج",
  Espresso: "إسبريسو",
  Oxblood: "عنّابي",
  Black: "أسود",
  // featured signature pieces
  Navy: "كحلي",
  Champagne: "شمبانيا",
  Gray: "رمادي",
  "Pale Pink": "وردي فاتح",
  Carrara: "كرارا",
  Sand: "رملي",
  Graphite: "غرافيت",
  Onyx: "أونيكس",
  "Mango Velvet": "مخمل مانجو",
  "Peacock Velvet": "مخمل طاووسي",
};
const finishLabel = (n: string, lang: Lang) => (lang === "ar" ? FINISH_AR[n] ?? n : n);
const catLabel = (c: Category, lang: Lang) => (lang === "ar" ? CAT_AR[c] : c);

export default function ShopQuickView({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const { t, lang } = useT();
  const en = lang === "en";
  const reduce = useReducedMotion();
  // The popup owns a "current" piece so the "Complete the room" rail can swap
  // content in place without unmounting the dialog.
  const [current, setCurrent] = useState(product);
  const [color, setColor] = useState(0);
  const viewerRef = useRef<MVElement | null>(null);
  const targetIdx = useRef<number[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const anchorHex = current.colorways[0].hex;

  // Parent opened a different piece → follow it.
  useEffect(() => setCurrent(product), [product]);
  // New piece → reset to its as-shown finish and scroll the panel back up.
  useEffect(() => {
    setColor(0);
    scrollRef.current?.scrollTo({ top: 0 });
  }, [current.id]);

  // Lock scroll + Escape to close.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  // When the model finishes loading, lock onto the upholstery material(s) and
  // apply whatever finish is currently selected.
  const onReady = useCallback(
    (el: ViewerEl) => {
      const mv = el as unknown as MVElement;
      viewerRef.current = mv;
      targetIdx.current = pickUpholsteryIndices(mv, anchorHex);
      const c = current.colorways[color];
      applyFinish(mv, c.name, c.hex, targetIdx.current);
    },
    [anchorHex, color, current.colorways]
  );

  const pickColor = (i: number) => {
    setColor(i);
    const c = current.colorways[i];
    applyFinish(viewerRef.current, c.name, c.hex, targetIdx.current);
  };

  // Swap the popup content in place — the dialog stays mounted (stable key in
  // the parent), the 3D stage re-keys to reload the new model.
  const swapTo = (p: Product) => setCurrent(p);

  const similar = completeTheRoom(current);
  const viewAllHref = `/shop/${CATEGORY_SLUG[current.category]}`;
  const waEnquire = `${WHATSAPP}?text=${encodeURIComponent(
    en
      ? `Hi Evora! I'd love to enquire about the ${current.name} (${current.tagline}).`
      : `مرحبًا إيفورا! أودّ الاستفسار عن ${current.name} (${current.tagline}).`
  )}`;

  return (
    <motion.div
      className="qv-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <motion.div
        className="qv"
        initial={reduce ? { opacity: 0 } : { y: 40, opacity: 0, scale: 0.985 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={reduce ? { opacity: 0 } : { y: 28, opacity: 0, scale: 0.99 }}
        transition={{ type: "spring", stiffness: 250, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={current.name}
      >
        <button className="qv-close" onClick={onClose} aria-label={t("qv_close")}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </button>

        {/* 3D stage — re-keyed so a swapped piece reloads its own model */}
        <div className="qv-stage">
          <div className="qv-stage-glow" />
          <ModelViewer key={current.id} product={current} onReady={onReady} autoRotate />
          <span className="qv-hint">
            <span className="qv-dot" />
            {t("qv_drag")}
          </span>
        </div>

        {/* Info */}
        <div className="qv-info">
          <div className="qv-scroll" ref={scrollRef}>
            {current.badge && <span className="qv-tag">{current.badge}</span>}
            <span className="eyebrow qv-cat">{catLabel(current.category, lang)}</span>
            <h2 className="display qv-name">{current.name}</h2>
            <p className="qv-tagline">{current.tagline}</p>
            <p className="qv-desc">{current.description}</p>

            <div className="qv-finish">
              <span className="qv-label">
                {t("qv_finish")} — {finishLabel(current.colorways[color].name, lang)}
              </span>
              <div className="qv-dots">
                {current.colorways.map((c, i) => (
                  <button
                    key={c.name}
                    className={`qv-swatch${i === color ? " on" : ""}`}
                    style={{ background: c.hex }}
                    onClick={() => pickColor(i)}
                    data-cursor="hover"
                    aria-pressed={i === color}
                    aria-label={finishLabel(c.name, lang)}
                    title={finishLabel(c.name, lang)}
                  />
                ))}
              </div>
            </div>

            <dl className="qv-specs">
              <div>
                <dt>{t("qv_dims")}</dt>
                <dd>
                  {current.dimensions.w} × {current.dimensions.d} ×{" "}
                  {current.dimensions.h} cm
                </dd>
              </div>
              <div>
                <dt>{t("qv_materials")}</dt>
                <dd>{current.materials.join(" · ")}</dd>
              </div>
            </dl>

            {/* ── Complete the room — pieces that finish the same space ── */}
            {similar.length > 0 && (
              <div className="qv-similar">
                <div className="qv-similar-head">
                  <span className="qv-label" style={{ marginBottom: 0 }}>{t("shop_similar")}</span>
                  <a href={viewAllHref} className="qv-viewall" data-cursor="hover">
                    {t("shop_view_all")} <span aria-hidden>→</span>
                  </a>
                </div>
                <div className="qv-similar-row">
                  {similar.map((p) => (
                    <button key={p.id} type="button" className="qv-mini" data-cursor="hover"
                      onClick={() => swapTo(p)} aria-label={p.name}>
                      <span className="qv-mini-img">
                        <img src={posterFor(p)} alt={p.name} loading="lazy" />
                      </span>
                      <span className="qv-mini-name display">{p.name}</span>
                      <span className="qv-mini-tag">{p.tagline}</span>
                      <span className="qv-mini-swatches" aria-hidden>
                        {p.colorways.slice(0, 3).map((c) => (
                          <span key={c.name} className="qv-mini-swatch" style={{ background: c.hex }} />
                        ))}
                        <span className="qv-mini-finish">{finishLabel(p.colorways[0].name, lang)}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="qv-foot">
            <div className="qv-cta">
              <button type="button" onClick={openStartProject} className="qv-btn qv-btn-dark" data-cursor="hover">
                {t("shop_add_design")}
              </button>
              <a href={`/showroom?p=${current.id}`} className="qv-btn qv-btn-ghost" data-cursor="hover">
                <ArIcon />
                {t("qv_try")}
              </a>
            </div>
            <div className="qv-cta-sub">
              <a href={waEnquire} target="_blank" rel="noopener noreferrer" className="qv-link" data-cursor="hover">
                {t("shop_enquire")}
              </a>
              <span aria-hidden>·</span>
              <a href="/visit" className="qv-link" data-cursor="hover">
                {t("shop_showroom_cta")}
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      <style>{`
        .qv-overlay { position: fixed; inset: 0; z-index: 120; display: grid; place-items: center; padding: clamp(0.8rem, 3vw, 2.4rem); background: rgba(28,24,21,0.46); backdrop-filter: blur(10px) saturate(1.1); }
        .qv { position: relative; display: grid; grid-template-columns: 1.05fr 0.95fr; width: min(1040px, 100%); max-height: min(90vh, 760px); background: var(--paper, #fbf9f4); border: 1px solid var(--line-soft, rgba(0,0,0,0.08)); border-radius: 10px; overflow: hidden; box-shadow: 0 50px 120px -40px rgba(0,0,0,0.55); }
        .qv-close { position: absolute; top: 0.9rem; inset-inline-end: 0.9rem; z-index: 10; width: 38px; height: 38px; display: grid; place-items: center; border-radius: 50%; border: 1px solid var(--line, rgba(0,0,0,0.12)); background: rgba(251,249,244,0.8); backdrop-filter: blur(6px); color: var(--ink, #1c1815); cursor: none; transition: background .3s var(--ease), transform .3s var(--ease); }
        .qv-close:hover { background: var(--ink, #1c1815); color: var(--paper, #fbf9f4); transform: rotate(90deg); }

        .qv-stage { position: relative; background: linear-gradient(165deg, #fff, var(--bone, #efe9dd)); border-inline-end: 1px solid var(--line-soft, rgba(0,0,0,0.07)); min-height: 340px; }
        .qv-stage-glow { position: absolute; inset: 0; background: radial-gradient(58% 52% at 50% 62%, rgba(54,65,47,0.10), transparent 70%); pointer-events: none; }
        .qv-stage model-viewer { width: 100%; height: 100%; }
        .qv-hint { position: absolute; bottom: 0.9rem; inset-inline-start: 0.9rem; display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(251,249,244,0.82); backdrop-filter: blur(6px); border-radius: 100px; padding: 0.45rem 0.85rem; font-size: 0.7rem; letter-spacing: 0.04em; color: var(--ink, #1c1815); }
        .qv-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--clay, #b27457); box-shadow: 0 0 0 4px rgba(178,116,87,0.22); }

        .qv-info { display: flex; flex-direction: column; min-height: 0; }
        .qv-scroll { flex: 1; min-height: 0; overflow-y: auto; padding: clamp(1.6rem, 3vw, 2.6rem); padding-bottom: 1rem; }
        .qv-tag { display: inline-block; background: var(--brass, #a98445); color: #fff; font-size: 0.6rem; letter-spacing: 0.16em; text-transform: uppercase; font-weight: 600; padding: 0.35em 0.7em; border-radius: 100px; margin-bottom: 0.9rem; }
        .qv-cat { display: block; color: var(--brass, #a98445); }
        .qv-name { font-size: clamp(2rem, 4vw, 2.9rem); margin: 0.5rem 0 0.3rem; color: var(--ink, #1c1815); }
        .qv-tagline { color: var(--ink-faint, #8a857c); font-size: 0.92rem; margin: 0 0 1.1rem; }
        .qv-desc { color: var(--ink-soft, #4a463f); line-height: 1.65; font-size: 0.92rem; margin: 0 0 1.6rem; }

        .qv-finish { margin-bottom: 1.6rem; }
        .qv-label { display: block; font-size: 0.66rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--ink-faint, #8a857c); margin-bottom: 0.7rem; }
        .qv-dots { display: flex; gap: 0.6rem; flex-wrap: wrap; }
        .qv-swatch { width: 30px; height: 30px; border-radius: 50%; cursor: none; border: 1px solid rgba(0,0,0,0.12); box-shadow: inset 0 0 0 2px var(--paper, #fbf9f4); transition: transform .25s var(--ease), box-shadow .25s var(--ease); }
        .qv-swatch:hover { transform: scale(1.1); }
        .qv-swatch.on { box-shadow: inset 0 0 0 2px var(--paper, #fbf9f4), 0 0 0 2px var(--ink, #1c1815); }

        .qv-specs { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem 1.4rem; margin: 0; padding-top: 1.2rem; border-top: 1px solid var(--line, rgba(0,0,0,0.1)); }
        .qv-specs dt { font-size: 0.64rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-faint, #8a857c); margin-bottom: 0.3rem; }
        .qv-specs dd { margin: 0; font-size: 0.9rem; color: var(--ink, #1c1815); }

        /* Complete the room */
        .qv-similar { margin-top: 1.6rem; padding-top: 1.3rem; border-top: 1px solid var(--line, rgba(0,0,0,0.1)); }
        .qv-similar-head { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; margin-bottom: 0.9rem; }
        .qv-viewall { font-size: 0.74rem; font-weight: 500; letter-spacing: 0.04em; color: var(--brass, #a98445); cursor: none; white-space: nowrap; }
        html[dir="rtl"] .qv-viewall span { display: inline-block; transform: scaleX(-1); }
        .qv-similar-row { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.9rem; }
        .qv-mini { display: block; text-align: start; background: none; border: none; padding: 0; cursor: none; font: inherit; color: inherit; }
        .qv-mini-img { display: block; position: relative; aspect-ratio: 4/3; overflow: hidden; border-radius: 4px; background: var(--bone, #efe9dd); }
        .qv-mini-img img { width: 100%; height: 100%; object-fit: cover; transition: transform .9s var(--ease); }
        .qv-mini:hover .qv-mini-img img { transform: scale(1.07); }
        .qv-mini-name { display: block; font-size: 1.05rem; color: var(--ink, #1c1815); margin: 0.5rem 0 0.1rem; }
        .qv-mini-tag { display: block; font-size: 0.76rem; color: var(--ink-faint, #8a857c); }
        .qv-mini-swatches { display: flex; align-items: center; gap: 0.3rem; margin-top: 0.45rem; }
        .qv-mini-swatch { width: 11px; height: 11px; border-radius: 50%; border: 1px solid rgba(0,0,0,0.12); box-shadow: inset 0 0 0 1.5px var(--paper, #fbf9f4); }
        .qv-mini-finish { margin-inline-start: 0.3rem; font-size: 0.62rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-faint, #8a857c); }

        .qv-foot { border-top: 1px solid var(--line, rgba(0,0,0,0.1)); padding: 1.1rem clamp(1.6rem, 3vw, 2.6rem); display: flex; flex-direction: column; gap: 0.8rem; background: var(--paper, #fbf9f4); }
        .qv-cta { display: flex; gap: 0.6rem; }
        .qv-btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; border-radius: 100px; padding: 0.8rem 1.3rem; font-size: 0.82rem; font-weight: 500; cursor: none; white-space: nowrap; font-family: inherit; transition: background .3s var(--ease), color .3s var(--ease), border-color .3s var(--ease); }
        .qv-btn-dark { flex: 1; background: var(--ink, #1c1815); color: var(--paper, #fbf9f4); border: none; }
        .qv-btn-dark:hover { background: var(--ever, #2c3626); }
        .qv-btn-ghost { flex: 1; border: 1px solid var(--line, rgba(0,0,0,0.18)); color: var(--ink, #1c1815); background: none; }
        .qv-btn-ghost:hover { border-color: var(--ink, #1c1815); }
        .qv-cta-sub { display: flex; align-items: center; gap: 0.7rem; flex-wrap: wrap; color: var(--ink-faint, #8a857c); font-size: 0.78rem; }
        .qv-link { color: var(--ink-soft, #4a463f); cursor: none; transition: color .3s var(--ease); }
        .qv-link:hover { color: var(--brass, #a98445); }

        @media (max-width: 820px) {
          /* full-screen bottom sheet, docked to the bottom edge of the viewport */
          .qv-overlay { padding: 0; place-items: end stretch; }
          .qv { grid-template-columns: 1fr; grid-template-rows: 46dvh minmax(0, 1fr);
            width: 100%; max-width: 100%; max-height: 92dvh;
            border-radius: 18px 18px 0 0; }
          .qv-stage { border-inline-end: none; border-bottom: 1px solid var(--line-soft, rgba(0,0,0,0.07)); min-height: 0; }
          .qv-close { width: 44px; height: 44px; top: 0.7rem; inset-inline-end: 0.7rem; }
          /* finish swatches — chunky and tap-friendly */
          .qv-dots { gap: 0.7rem; }
          .qv-swatch { width: 44px; height: 44px; }
          /* Complete the room → a swipeable, snapping horizontal rail */
          .qv-similar-row { display: flex; gap: 0.9rem; overflow-x: auto; overflow-y: hidden;
            -webkit-overflow-scrolling: touch; scrollbar-width: none; scroll-snap-type: x mandatory;
            margin-inline: calc(-1 * clamp(1.6rem, 3vw, 2.6rem)); padding-inline: clamp(1.6rem, 3vw, 2.6rem);
            padding-bottom: 0.3rem; }
          .qv-similar-row::-webkit-scrollbar { display: none; }
          .qv-mini { flex: 0 0 62%; max-width: 240px; scroll-snap-align: start; }
          /* footer clears the home indicator; CTAs stay ≥44px */
          .qv-foot { padding-bottom: calc(1.1rem + env(safe-area-inset-bottom)); }
          .qv-btn { min-height: 48px; }
        }
        @media (max-width: 480px) {
          .qv-cta { flex-direction: column; }
        }
      `}</style>
    </motion.div>
  );
}

function ArIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M4 7.5l8 4.5 8-4.5M12 12v9" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

// Re-export AnimatePresence so the Shop grid can wrap a single instance.
export { AnimatePresence };
