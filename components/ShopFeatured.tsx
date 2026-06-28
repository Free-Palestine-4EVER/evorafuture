"use client";

import { useCallback, useRef, useState } from "react";
import { useT, type Lang } from "@/lib/i18n";
import { featured } from "@/lib/featured";
import { type Product } from "@/lib/products";
import { applyFinish, pickUpholsteryIndices, type MVElement } from "@/lib/recolor";
import ModelViewer, { type ViewerEl } from "@/components/showroom/ModelViewer";
import ShopQuickView, { AnimatePresence } from "@/components/ShopQuickView";
import { Rise, RevealLines } from "@/components/motion";

const FINISH_AR: Record<string, string> = {
  Navy: "كحلي", Champagne: "شمبانيا", Gray: "رمادي", Black: "أسود", "Pale Pink": "وردي فاتح",
  Carrara: "كرارا", Sand: "رملي", Sage: "مريمية", Graphite: "غرافيت", Onyx: "أونيكس",
  "Mango Velvet": "مخمل مانجو", "Peacock Velvet": "مخمل طاووسي",
};
const finishLabel = (n: string, lang: Lang) => (lang === "ar" ? FINISH_AR[n] ?? n : n);

function FeaturedCard({ product, onOpen }: { product: Product; onOpen: () => void }) {
  const { lang } = useT();
  const [color, setColor] = useState(0);
  const viewerRef = useRef<MVElement | null>(null);
  const targetIdx = useRef<number[]>([]);
  const anchorHex = product.colorways[0].hex;

  const onReady = useCallback(
    (el: ViewerEl) => {
      const mv = el as unknown as MVElement;
      viewerRef.current = mv;
      targetIdx.current = pickUpholsteryIndices(mv, anchorHex);
      const c = product.colorways[color];
      applyFinish(mv, c.name, c.hex, targetIdx.current);
    },
    [anchorHex, color, product.colorways]
  );

  const pick = (i: number) => {
    setColor(i);
    const c = product.colorways[i];
    applyFinish(viewerRef.current, c.name, c.hex, targetIdx.current);
  };

  return (
    <div className="feat-card">
      <button className="feat-stage" onClick={onOpen} data-cursor="hover"
        aria-label={`${product.name} — ${product.tagline}`}>
        {product.badge && <span className="feat-badge">{product.badge}</span>}
        <ModelViewer product={product} onReady={onReady} autoRotate />
        <span className="feat-look">↗</span>
      </button>
      <div className="feat-meta">
        <div className="feat-head">
          <div>
            <h3 className="display feat-name">{product.name}</h3>
            <p className="feat-tag">{product.tagline}</p>
          </div>
        </div>
        <div className="feat-finish">
          <span className="feat-finish-label">{finishLabel(product.colorways[color].name, lang)}</span>
          <div className="feat-dots">
            {product.colorways.map((c, i) => (
              <button key={c.name} className={`feat-swatch${i === color ? " on" : ""}`}
                style={{ background: c.hex }} onClick={() => pick(i)} data-cursor="hover"
                aria-pressed={i === color} title={finishLabel(c.name, lang)} aria-label={finishLabel(c.name, lang)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopFeatured() {
  const { t, lang } = useT();
  const [open, setOpen] = useState<Product | null>(null);

  return (
    <section className="feat">
      <div className="container">
        <div className="feat-intro">
          <Rise as="span" className="eyebrow" style={{ color: "var(--brass)", display: "block" }}>
            {lang === "ar" ? "قطع مميّزة · بدقة فائقة" : "Signature pieces · ultra-HD 3D"}
          </Rise>
          <RevealLines lines={[lang === "ar" ? "شاهدها بكامل تفاصيلها." : "See them in full detail."]}
            className="display feat-title" />
          <Rise delay={0.12}>
            <p className="feat-sub">
              {lang === "ar"
                ? "اسحب لتدويرها، وبدّل خاماتها مباشرةً — حتى على جهازك. هكذا ستبدو كل قطعة."
                : "Drag to spin them, switch finishes live — right here on desktop. This is how every piece will look."}
            </p>
          </Rise>
        </div>

        <div className="feat-grid">
          {featured.map((p) => (
            <FeaturedCard key={p.id} product={p} onOpen={() => setOpen(p)} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open && <ShopQuickView key={open.id} product={open} onClose={() => setOpen(null)} />}
      </AnimatePresence>

      <style>{`
        .feat { position: relative; background: linear-gradient(180deg, var(--ever, #2c3626), #222a1e); color: var(--paper, #fbf9f4); padding: clamp(5rem, 10vh, 8rem) 0 clamp(4rem, 8vh, 6rem); }
        .feat-intro { max-width: 680px; margin-bottom: clamp(2.4rem, 5vw, 3.6rem); }
        .feat-title { font-size: clamp(2.2rem, 5.5vw, 4.2rem); margin: 0.8rem 0 0; color: var(--paper, #fbf9f4); }
        .feat-sub { color: rgba(251,249,244,0.7); max-width: 50ch; margin-top: 1.1rem; line-height: 1.6; }

        .feat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(1.2rem, 2.5vw, 2rem); }
        .feat-card { display: flex; flex-direction: column; }
        .feat-stage { position: relative; width: 100%; aspect-ratio: 4/5; border: none; padding: 0; cursor: none; border-radius: 8px; overflow: hidden; background: linear-gradient(165deg, #fcfbf8, #ece6da); box-shadow: 0 40px 80px -50px rgba(0,0,0,0.6); }
        .feat-stage model-viewer { width: 100%; height: 100%; --poster-color: transparent; }
        .feat-badge { position: absolute; top: 1rem; inset-inline-start: 1rem; z-index: 4; background: var(--brass, #a98445); color: #fff; font-size: 0.58rem; letter-spacing: 0.16em; text-transform: uppercase; font-weight: 600; padding: 0.4em 0.8em; border-radius: 100px; }
        .feat-look { position: absolute; bottom: 1rem; inset-inline-end: 1rem; z-index: 4; width: 38px; height: 38px; display: grid; place-items: center; border-radius: 50%; background: var(--ink, #1c1815); color: var(--paper, #fbf9f4); font-size: 1rem; opacity: 0; transform: translateY(8px); transition: opacity .35s var(--ease), transform .35s var(--ease); }
        .feat-stage:hover .feat-look { opacity: 1; transform: translateY(0); }

        .feat-meta { padding-top: 1.1rem; }
        .feat-head { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; }
        .feat-name { font-size: clamp(1.4rem, 2.2vw, 1.9rem); margin: 0; color: var(--paper, #fbf9f4); }
        .feat-tag { font-size: 0.84rem; color: rgba(251,249,244,0.6); margin: 0.2rem 0 0; }
        .feat-finish { margin-top: 1rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
        .feat-finish-label { font-size: 0.66rem; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(251,249,244,0.55); }
        .feat-dots { display: flex; gap: 0.5rem; }
        .feat-swatch { width: 24px; height: 24px; border-radius: 50%; cursor: none; border: 1px solid rgba(255,255,255,0.2); box-shadow: inset 0 0 0 2px #222a1e; transition: transform .25s var(--ease), box-shadow .25s var(--ease); }
        .feat-swatch:hover { transform: scale(1.12); }
        .feat-swatch.on { box-shadow: inset 0 0 0 2px #222a1e, 0 0 0 2px var(--brass, #d8b878); }

        @media (max-width: 900px) { .feat-grid { grid-template-columns: 1fr; max-width: 460px; } .feat-stage { aspect-ratio: 1/1; } }
      `}</style>
    </section>
  );
}
