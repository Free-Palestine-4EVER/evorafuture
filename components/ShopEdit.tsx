"use client";

import { useT } from "@/lib/i18n";
import { motion } from "framer-motion";
import { Rise, RevealLines } from "@/components/motion";

const EASE = [0.22, 1, 0.36, 1] as const;

type Bi = { en: string; ar: string };
type Product = {
  id: string;
  name: Bi;
  tag: Bi;
  price: string;
  img: string;
  href: string;
};

// the featured hero piece — the sofa
const featured: Product = {
  id: "sofa",
  name: { en: "Dune Curved Sofa", ar: "كنبة ديون المنحنية" },
  tag: { en: "Three-seater · cream bouclé", ar: "ثلاثة مقاعد · بوكليه كريمي" },
  price: "1,640 JOD",
  img: "/evora/vid-sofa.jpg",
  href: "/shop",
};

// three best-sellers beside it
const products: Product[] = [
  {
    id: "coffee",
    name: { en: "Helios Coffee Table", ar: "طاولة هيليوس" },
    tag: { en: "Patagonia stone · walnut", ar: "حجر باتاغونيا · جوز" },
    price: "360 JOD",
    img: "/evora/vid-coffee.jpg",
    href: "/shop",
  },
  {
    id: "chair",
    name: { en: "Sheen Accent Chair", ar: "كرسي شين المميّز" },
    tag: { en: "Cream velvet · brass legs", ar: "مخمل كريمي · أرجل نحاسية" },
    price: "430 JOD",
    img: "/evora/ig-chesterfield.jpg",
    href: "/shop",
  },
  {
    id: "bed",
    name: { en: "Aspen Oak Bed", ar: "سرير أسبن البلوط" },
    tag: { en: "King · linen headboard", ar: "كينغ · لوح كتاني" },
    price: "1,290 JOD",
    img: "/evora/vid-bed.jpg",
    href: "/shop",
  },
];

export default function ShopEdit() {
  const { lang } = useT();
  const en = lang === "en";

  return (
    <section id="shop-edit" className="se" lang={lang}>
      <div className="container se__head">
        <div className="se__headl">
          <div className="se__kick">
            <motion.span
              className="se__rule"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "0px 0px -12% 0px" }}
              transition={{ duration: 0.9, ease: EASE }}
            />
            <Rise as="span" className="eyebrow se__eyebrow">
              {en ? "Shop the collection" : "تسوّق المجموعة"}
            </Rise>
          </div>
          <RevealLines
            lines={en ? ["Four favourites,", "ready for your home."] : ["أربع قطع مختارة،", "جاهزة لبيتك."]}
            className="display se__title"
            delay={0.06}
          />
          <Rise delay={0.12} as="p" className="se__sub">
            {en
              ? "Hand-picked from the Evora collection. Or upload your plan and watch your whole home come to life."
              : "مختارة بعناية من مجموعة إيفورا. أو ارفع مخططك وشاهد بيتك كاملاً ينبض بالحياة."}
          </Rise>
        </div>
        <Rise delay={0.16} className="se__viewall-wrap">
          <a href="/shop" className="se__viewall" data-cursor="hover">
            {en ? "View all products" : "كل المنتجات"}
            <span className="se__viewall-arrow" aria-hidden>→</span>
          </a>
        </Rise>
      </div>

      <div className="container se__grid">
        {/* featured sofa */}
        <motion.a
          href={featured.href}
          className="se__feature"
          data-cursor="hover"
          initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "0px 0px -12% 0px" }}
          transition={{ duration: 1, ease: EASE }}
        >
          <div className="se__featimg">
            <img src={featured.img} alt={featured.name[lang]} />
          </div>
          <span className="se__featscrim" />
          <span className="se__badge">{en ? "Featured" : "مميّز"}</span>
          <div className="se__featmeta">
            <span className="se__feattag">{featured.tag[lang]}</span>
            <span className="se__featname display">{featured.name[lang]}</span>
            <div className="se__featbottom">
              <span className="se__featcta">
                {en ? "Shop sofa" : "تسوّق الكنبة"}
                <span className="se__arrow" aria-hidden>↗</span>
              </span>
            </div>
          </div>
        </motion.a>

        {/* three best-sellers */}
        <div className="se__side">
          {products.map((p, i) => (
            <motion.a
              key={p.id}
              href={p.href}
              className="se__row"
              data-cursor="hover"
              initial={{ opacity: 0, x: 48, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.06 * i }}
            >
              <div className="se__rowimg">
                <img src={p.img} alt={p.name[lang]} loading="lazy" />
              </div>
              <div className="se__rowmeta">
                <span className="se__rowtag">{p.tag[lang]}</span>
                <span className="se__rowname display">{p.name[lang]}</span>
              </div>
              <span className="se__rowarrow" aria-hidden>↗</span>
            </motion.a>
          ))}
        </div>
      </div>

      <style>{`
        .se { position: relative; background: var(--paper); padding-block: clamp(3.5rem, 8vw, 7rem); }

        .se__head { display: flex; align-items: flex-end; justify-content: space-between; gap: 2rem; margin-bottom: clamp(2rem, 4vw, 3.4rem); }
        .se__headl { min-width: 0; }
        .se__kick { display: flex; align-items: center; gap: 1rem; }
        .se__rule { display: block; width: 64px; height: 1px; background: var(--brass); transform-origin: left; flex-shrink: 0; }
        html[dir="rtl"] .se__rule { transform-origin: right; }
        .se__eyebrow { color: var(--brass); display: block; }
        .se__title { font-size: clamp(2.2rem, 5.2vw, 4.4rem); line-height: 1.0; margin: 1rem 0 0; color: var(--ink); }
        .se__sub { color: var(--ink-soft); max-width: 52ch; margin: 1rem 0 0; font-size: 1rem; }
        .se__viewall-wrap { flex-shrink: 0; }
        .se__viewall { display: inline-flex; align-items: center; gap: 0.55rem; white-space: nowrap;
          font-size: 0.78rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--ink);
          border-bottom: 1px solid var(--ink); padding-bottom: 4px; transition: gap .4s var(--ease), color .3s var(--ease); }
        .se__viewall:hover { gap: 0.9rem; color: var(--brass); border-color: var(--brass); }
        .se__viewall-arrow { transition: transform .4s var(--ease); }
        html[dir="rtl"] .se__viewall-arrow { transform: scaleX(-1); }

        /* ── grid: featured + 3 rows ── */
        .se__grid { display: grid; grid-template-columns: 1.32fr 1fr; gap: clamp(14px, 1.8vw, 26px); align-items: stretch; }

        /* featured sofa */
        .se__feature { position: relative; display: block; overflow: hidden; border-radius: 8px; min-height: clamp(420px, 56vh, 640px); box-shadow: 0 30px 80px -50px rgba(16,15,13,0.45); }
        .se__featimg { position: absolute; inset: 0; }
        .se__featimg img { width: 100%; height: 100%; object-fit: cover; transform: scale(1.03); transition: transform 1.3s var(--ease); }
        .se__feature:hover .se__featimg img { transform: scale(1.08); }
        .se__featscrim { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(16,15,13,0.05) 0%, transparent 38%, rgba(16,15,13,0.72) 100%); }
        .se__badge { position: absolute; top: 1.1rem; inset-inline-start: 1.1rem; background: rgba(251,247,240,0.94); color: var(--ink);
          font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; padding: 0.5em 0.95em; border-radius: 100px; }
        .se__featmeta { position: absolute; inset-inline: clamp(1.3rem, 2.4vw, 2.4rem); bottom: clamp(1.3rem, 2.4vw, 2.2rem); color: var(--paper); display: flex; flex-direction: column; gap: 0.4rem; }
        .se__feattag { font-size: 0.66rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--brass-2); }
        html[dir="rtl"] .se__feattag { letter-spacing: 0.06em; }
        .se__featname { font-size: clamp(1.8rem, 3.2vw, 2.8rem); line-height: 1.0; }
        .se__featbottom { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; margin-top: 0.5rem; }
        .se__featprice { font-size: clamp(1.1rem, 1.6vw, 1.35rem); color: var(--paper); }
        .se__featcta { display: inline-flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--paper); border-bottom: 1px solid rgba(251,247,240,0.45); padding-bottom: 3px; }
        .se__arrow { color: var(--brass-2); transition: transform .5s var(--ease); }
        html[dir="rtl"] .se__arrow { transform: scaleX(-1); }
        .se__feature:hover .se__arrow { transform: translate(3px, -3px); }
        html[dir="rtl"] .se__feature:hover .se__arrow { transform: translate(-3px, -3px) scaleX(-1); }

        /* 3 product rows */
        .se__side { display: grid; grid-template-rows: repeat(3, 1fr); gap: clamp(14px, 1.8vw, 26px); }
        .se__row { display: grid; grid-template-columns: clamp(110px, 13vw, 168px) 1fr auto; align-items: center; gap: clamp(0.9rem, 1.6vw, 1.4rem);
          background: var(--paper-2); border: 1px solid rgba(16,15,13,0.08); border-radius: 8px; padding: clamp(0.6rem, 1vw, 0.8rem);
          transition: border-color .4s var(--ease), box-shadow .4s var(--ease), transform .4s var(--ease); overflow: hidden; }
        .se__row:hover { border-color: rgba(138,106,60,0.4); box-shadow: 0 20px 50px -36px rgba(16,15,13,0.4); transform: translateY(-2px); }
        .se__rowimg { position: relative; aspect-ratio: 4 / 3; border-radius: 5px; overflow: hidden; }
        .se__rowimg img { width: 100%; height: 100%; object-fit: cover; transform: scale(1.04); transition: transform 1.1s var(--ease); }
        .se__row:hover .se__rowimg img { transform: scale(1.12); }
        .se__rowmeta { min-width: 0; display: flex; flex-direction: column; gap: 0.28rem; }
        .se__rowtag { font-size: 0.6rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--ink-faint); }
        html[dir="rtl"] .se__rowtag { letter-spacing: 0.04em; }
        .se__rowname { font-size: clamp(1.05rem, 1.5vw, 1.35rem); color: var(--ink); line-height: 1.08; }
        .se__rowprice { font-size: 0.92rem; color: var(--brass); margin-top: 0.1rem; }
        .se__rowarrow { color: var(--ink-faint); font-size: 1.1rem; padding-inline-end: 0.4rem; transition: transform .5s var(--ease), color .3s var(--ease); }
        html[dir="rtl"] .se__rowarrow { transform: scaleX(-1); }
        .se__row:hover .se__rowarrow { color: var(--brass); transform: translate(3px, -3px); }
        html[dir="rtl"] .se__row:hover .se__rowarrow { transform: translate(-3px, -3px) scaleX(-1); }

        @media (max-width: 900px) {
          .se__head { flex-direction: column; align-items: flex-start; gap: 1.4rem; }
          .se__grid { grid-template-columns: 1fr; }
          .se__feature { min-height: clamp(360px, 60vh, 520px); }
        }
        @media (max-width: 520px) {
          .se__row { grid-template-columns: clamp(96px, 30vw, 130px) 1fr auto; }
        }
      `}</style>
    </section>
  );
}
