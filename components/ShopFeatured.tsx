"use client";

import { useState } from "react";
import { useT } from "@/lib/i18n";
import { shopProducts, shopProductCopy, type ShopProduct } from "@/lib/shopCatalog";
import ShopQuickView, { AnimatePresence } from "@/components/ShopQuickView";
import { Rise, RevealLines } from "@/components/motion";

const BADGE_AR: Record<string, string> = {
  New: "جديد",
  Bestseller: "الأكثر مبيعًا",
  Limited: "محدود",
};

// Three signature pieces — one bestseller each from the sofa, table and
// bedroom worlds — leading the catalogue photography, full-bleed.
const FEATURED_IDS = ["sofa-01", "table-01", "bedroom-01"];
const featured: ShopProduct[] = FEATURED_IDS
  .map((id) => shopProducts.find((p) => p.id === id))
  .filter((p): p is ShopProduct => Boolean(p));

function FeaturedCard({ product, onOpen }: { product: ShopProduct; onOpen: () => void }) {
  const { lang } = useT();
  const tagline = shopProductCopy(product, lang).tagline;

  return (
    <button className="feat-card" onClick={onOpen} data-cursor="hover"
      aria-label={`${product.name} — ${tagline}`}>
      <div className="feat-stage">
        {product.badge && <span className="feat-badge">{lang === "ar" ? BADGE_AR[product.badge] : product.badge}</span>}
        <img src={product.image} alt={product.name} className="feat-img" loading="lazy" />
        <span className="feat-wm" aria-hidden />
        <span className="feat-look">↗</span>
      </div>
      <div className="feat-meta">
        <h3 className="display feat-name">{product.name}</h3>
        <p className="feat-tag">{tagline}</p>
      </div>
    </button>
  );
}

export default function ShopFeatured() {
  const { lang } = useT();
  const [open, setOpen] = useState<ShopProduct | null>(null);

  return (
    <section className="feat">
      <div className="container">
        <div className="feat-intro">
          <Rise as="span" className="eyebrow" style={{ color: "var(--brass)", display: "block" }}>
            {lang === "ar" ? "قطع مميّزة" : "Signature pieces"}
          </Rise>
          <RevealLines lines={[lang === "ar" ? "أعمالنا الأكثر طلبًا." : "Our most-loved pieces."]}
            className="display feat-title" />
          <Rise delay={0.12}>
            <p className="feat-sub">
              {lang === "ar"
                ? "ثلاث قطعٍ توضّح لغة إيفورا — لون واحد، خطٌّ واحد، وحرفةٌ لا تُخطئها العين."
                : "Three pieces that sum up the Evora language — one colour, one line, craft you can spot from across the room."}
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
        .feat-card { display: flex; flex-direction: column; text-align: start; background: none; border: none; padding: 0; cursor: none; font: inherit; color: inherit; }
        .feat-stage { position: relative; width: 100%; aspect-ratio: 4/5; border-radius: 8px; overflow: hidden; background: linear-gradient(165deg, #fcfbf8, #ece6da); box-shadow: 0 40px 80px -50px rgba(0,0,0,0.6); }
        .feat-img { width: 100%; height: 100%; object-fit: cover; transition: transform 1.1s var(--ease); }
        .feat-card:hover .feat-img { transform: scale(1.06); }
        .feat-badge { position: absolute; top: 1rem; inset-inline-start: 1rem; z-index: 4; background: var(--brass, #a98445); color: #fff; font-size: 0.58rem; letter-spacing: 0.16em; text-transform: uppercase; font-weight: 600; padding: 0.4em 0.8em; border-radius: 100px; }
        .feat-wm { position: absolute; bottom: 1rem; inset-inline-end: 1rem; z-index: 4; width: 26px; height: 26px; background-color: rgba(255,255,255,0.94); -webkit-mask: url('/brand/evora-monogram.svg') center / contain no-repeat; mask: url('/brand/evora-monogram.svg') center / contain no-repeat; filter: drop-shadow(0 1px 4px rgba(0,0,0,0.4)); pointer-events: none; }
        .feat-look { position: absolute; bottom: 1rem; inset-inline-end: 1rem; z-index: 4; width: 38px; height: 38px; display: grid; place-items: center; border-radius: 50%; background: var(--ink, #1c1815); color: var(--paper, #fbf9f4); font-size: 1rem; opacity: 0; transform: translateY(8px); transition: opacity .35s var(--ease), transform .35s var(--ease); }
        .feat-stage:hover .feat-look { opacity: 1; transform: translateY(0); }

        .feat-meta { padding-top: 1.1rem; }
        .feat-name { font-size: clamp(1.4rem, 2.2vw, 1.9rem); margin: 0; color: var(--paper, #fbf9f4); }
        .feat-tag { font-size: 0.84rem; color: rgba(251,249,244,0.6); margin: 0.2rem 0 0; }
        .feat-dots { display: flex; gap: 0.5rem; margin-top: 1rem; }
        .feat-swatch { width: 14px; height: 14px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); box-shadow: inset 0 0 0 1.5px #222a1e; }

        @media (max-width: 900px) { .feat-grid { grid-template-columns: 1fr; max-width: 460px; } .feat-stage { aspect-ratio: 1/1; } }

        @media (max-width: 640px) {
          /* the look icon is hover-only on desktop; reveal it on touch */
          .feat-look { opacity: 1; transform: none; }
        }
      `}</style>
    </section>
  );
}
