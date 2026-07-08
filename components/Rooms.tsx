"use client";

import { useEffect, useRef, useState } from "react";
import { useT } from "@/lib/i18n";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Rise } from "@/components/motion";
import { products as catalog, posterFor, productCopy } from "@/lib/products";

const EASE = [0.22, 1, 0.36, 1] as const;

const BADGE_AR: Record<string, string> = {
  New: "جديد",
  Bestseller: "الأكثر مبيعًا",
  Limited: "إصدار محدود",
};

type Bi = { en: string; ar: string };

/* ── The six rooms — carried over 1:1 from the original Evora site
 *    (Living / Dining / Bedroom / Guest / Tables & Accessories / Chandeliers),
 *    re-staged as a cinematic image-swap gallery. No prices: each room
 *    speaks through its world and the pieces that live in it. */
type Room = {
  id: string;
  num: string;
  name: Bi;
  note: Bi;          // the kind of room / its feeling — never a price
  img: string;
  href: string;
  pieces: Bi[];      // the product types found in this room
};

const rooms: Room[] = [
  {
    id: "living",
    num: "01",
    name: { en: "Living Room", ar: "غرفة المعيشة" },
    note: { en: "Where the home gathers", ar: "حيث يجتمع البيت" },
    img: "/evora/room-living.jpg",
    href: "/shop/living",
    pieces: [
      { en: "Sofas", ar: "كنب" },
      { en: "Armchairs", ar: "كراسي" },
      { en: "Coffee Tables", ar: "طاولات قهوة" },
      { en: "Fireplaces", ar: "مدافئ" },
    ],
  },
  {
    id: "dining",
    num: "02",
    name: { en: "Dining Room", ar: "غرفة الطعام" },
    note: { en: "Long evenings, well set", ar: "أمسياتٌ طويلة وسفرةٌ أنيقة" },
    img: "/evora/room-dining.jpg",
    href: "/shop/dining",
    pieces: [
      { en: "Dining Tables", ar: "طاولات طعام" },
      { en: "Chairs", ar: "كراسي" },
      { en: "Sideboards", ar: "بوفيهات" },
      { en: "Shelving", ar: "أرفف" },
    ],
  },
  {
    id: "bedroom",
    num: "03",
    name: { en: "Bedroom", ar: "غرفة النوم" },
    note: { en: "The quiet end of the day", ar: "نهاية اليوم الهادئة" },
    img: "/evora/room-bedrooms.jpg",
    href: "/shop/bedroom",
    pieces: [
      { en: "Beds", ar: "أسرّة" },
      { en: "Wardrobes", ar: "خزائن" },
      { en: "Dressing Tables", ar: "تسريحات" },
      { en: "Nightstands", ar: "كومدينات" },
    ],
  },
  {
    id: "guest",
    num: "04",
    name: { en: "Guest Room", ar: "غرفة الضيوف" },
    note: { en: "Where guests see your taste first", ar: "حيث يرى ضيوفك ذوقك أوّلًا" },
    img: "/evora/ig-lounge.jpg",
    href: "/shop/guest",
    pieces: [
      { en: "Majlis Seating", ar: "جلسات مجلس" },
      { en: "Ottomans", ar: "بوفات" },
      { en: "Side Tables", ar: "طاولات جانبية" },
      { en: "Cushions", ar: "وسائد" },
    ],
  },
  {
    id: "tables",
    num: "05",
    name: { en: "Tables & Accessories", ar: "طاولات وإكسسوارات" },
    note: { en: "The finishing details", ar: "اللمسات الأخيرة" },
    img: "/evora/p11.jpg",
    href: "/shop/tables",
    pieces: [
      { en: "Console Tables", ar: "طاولات كونسول" },
      { en: "Floor & Table Lamps", ar: "أباجورات وقوايم" },
      { en: "Vases", ar: "مزهريات" },
      { en: "Curtains", ar: "ستائر" },
    ],
  },
  {
    id: "chandeliers",
    num: "06",
    name: { en: "Chandeliers", ar: "الثريات" },
    note: { en: "Light, made an occasion", ar: "ضوءٌ يصنع المناسبة" },
    img: "/evora/p10.jpg",
    href: "/shop/chandeliers",
    pieces: [
      { en: "Chandeliers", ar: "ثريات" },
      { en: "Pendants", ar: "معلّقات" },
      { en: "Ceiling Fans", ar: "مراوح سقف" },
      { en: "Wall Lights", ar: "إضاءة جدارية" },
    ],
  },
];

/* ── The actual catalogue carried over from evorafuturehome.com/Products.
 *    Their live shop holds two real collections — "600 Heaven" and
 *    "700 Heaven" — each shown across its real Evora renders (the rest of the
 *    old site was PrestaShop demo filler, deliberately left out). No prices,
 *    per the house rule: each piece speaks through the room it lives in. */
type Product = { id: string; name: string; note: Bi; hero: string; gallery: string[]; href: string };
const products: Product[] = [
  {
    id: "600-heaven",
    name: "600 Heaven",
    note: { en: "Curved sofa salon · ring chandelier", ar: "صالة بكنب منحنٍ · ثريا حلقيّة" },
    hero: "/evora-legacy/products/600-heaven-1.webp",
    gallery: ["/evora-legacy/products/600-heaven-2.webp", "/evora-legacy/products/600-heaven-3.webp"],
    href: "/shop/living",
  },
  {
    id: "700-heaven",
    name: "700 Heaven",
    note: { en: "Boucle sofa · marble nesting tables", ar: "كنبة بوكليه · طاولات رخاميّة متداخلة" },
    hero: "/evora-legacy/products/700-heaven-1.webp",
    gallery: ["/evora-legacy/products/700-heaven-2.webp", "/evora-legacy/products/700-heaven-3.webp"],
    href: "/shop/living",
  },
];

export default function Rooms() {
  const { lang, dir } = useT();
  const ar = lang === "ar";
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const room = rooms[active];

  // ---- scroll-driven active room (desktop): whichever row crosses the
  // viewport's centre band becomes active, so the sticky image swaps as you
  // scroll — no hover required. Hover still works too (nice on desktop when
  // not actively scrolling); both just set the same `active` index. ----
  const listRef = useRef<HTMLUListElement>(null);
  const rowRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [bar, setBar] = useState({ top: 0, height: 0 });

  useEffect(() => {
    if (reduce) return;
    const mq = window.matchMedia("(max-width: 860px)");
    if (mq.matches) return; // mobile uses its own stacked cards below

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const i = Number((e.target as HTMLElement).dataset.i);
          if (!Number.isNaN(i)) setActive(i);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    rowRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [reduce]);

  // slide the accent bar to the active row's measured position
  useEffect(() => {
    const measure = () => {
      const list = listRef.current;
      const row = rowRefs.current[active];
      if (!list || !row) return;
      const lr = list.getBoundingClientRect();
      const rr = row.getBoundingClientRect();
      setBar({ top: rr.top - lr.top, height: rr.height });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [active]);

  return (
    <section id="rooms" dir={dir} className="rm" lang={lang}>
      <div className="container rm__head">
        <Rise as="span" className="rm__kicker">
          <span className="rm__rule" />
          {ar ? "تسوّق حسب الغرفة" : "Shop by room"}
        </Rise>
        <Rise delay={0.06} as="h2" className="rm__title">
          {ar ? (
            <>كل غرفة في البيت، <em>تحت سقف واحد.</em></>
          ) : (
            <>Every room of the home, <em>under one roof.</em></>
          )}
        </Rise>
        <Rise delay={0.12} as="p" className="rm__lede">
          {ar
            ? "من غرفة المعيشة إلى الثريا فوق المائدة — تشكيلة إيفورا الكاملة، مرتّبة كما تعيشها."
            : "From the living room to the chandelier above the table — the full Evora collection, arranged the way you live in it."}
        </Rise>
      </div>

      {/* Desktop: sticky image pinned left, scroll-driven room list right —
          the image swaps as each row crosses the centre of the viewport, no
          hover required (hover still works as an instant preview too). */}
      <div className="container rm__scrollarea">
        <a className="rm__stage" href={room.href} aria-label={room.name[lang]}>
          <AnimatePresence initial={false} mode="popLayout">
            <motion.img
              key={room.id}
              src={room.img}
              alt={room.name[lang]}
              className="rm__img"
              initial={reduce ? false : { opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.7, ease: EASE }}
              loading="lazy"
            />
          </AnimatePresence>
          <div className="rm__stageveil" aria-hidden />
          <div className="rm__stagecap">
            <span className="rm__stagenum">{room.num}</span>
            <div>
              <span className="rm__stagename">{room.name[lang]}</span>
              <span className="rm__stagenote">{room.note[lang]}</span>
            </div>
          </div>
          <div className="rm__pieces" aria-hidden>
            {room.pieces.map((p) => (
              <span key={p.en} className="rm__piece">{p[lang]}</span>
            ))}
          </div>
          <span className="rm__enter">{ar ? "ادخل الغرفة" : "Enter room"} →</span>
        </a>

        <ul className="rm__list" ref={listRef}>
          <motion.span
            className="rm__listbar"
            animate={{ top: bar.top, height: bar.height }}
            initial={false}
            transition={{ duration: 0.45, ease: EASE }}
            aria-hidden
          />
          {rooms.map((r, i) => (
            <li
              key={r.id}
              ref={(el) => { rowRefs.current[i] = el; }}
              data-i={i}
              className="rm__row"
            >
              <a
                href={r.href}
                className={`rm__item${i === active ? " is-active" : ""}`}
                aria-current={i === active ? "true" : undefined}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
              >
                <span className="rm__inum">{r.num}</span>
                <span className="rm__itext">
                  <span className="rm__iname">{r.name[lang]}</span>
                  <span className="rm__inote">{r.note[lang]}</span>
                </span>
                <span className="rm__iarrow" aria-hidden>→</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile: stacked full-bleed room cards — each carries its own image,
          no sticky/scroll-linking (keeps small-screen scroll simple + smooth). */}
      <div className="container rm__mobile">
        {rooms.map((r, i) => (
          <motion.a
            key={r.id}
            href={r.href}
            className="rm__mcard"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.6, ease: EASE, delay: reduce ? 0 : (i % 3) * 0.05 }}
          >
            <div className="rm__mimgwrap">
              <img src={r.img} alt={r.name[lang]} className="rm__mimg" loading="lazy" />
              <div className="rm__mveil" aria-hidden />
              <div className="rm__mpieces" aria-hidden>
                {r.pieces.slice(0, 3).map((p) => (
                  <span key={p.en} className="rm__piece">{p[lang]}</span>
                ))}
              </div>
            </div>
            <div className="rm__mmeta">
              <span className="rm__inum">{r.num}</span>
              <span className="rm__itext">
                <span className="rm__iname">{r.name[lang]}</span>
                <span className="rm__inote">{r.note[lang]}</span>
              </span>
              <span className="rm__iarrow" aria-hidden>→</span>
            </div>
          </motion.a>
        ))}
      </div>

      {/* Every piece we make — the real catalogue, shown as product tiles */}
      <div className="container rm__tax">
        <Rise as="span" className="rm__taxlabel">
          {ar ? "كل ما يحتاجه كل ركن" : "Everything for every corner"}
        </Rise>
        <div className="rm__cat">
          {catalog.map((p, i) => {
            const copy = productCopy(p, lang);
            return (
              <motion.a
                key={p.id}
                href={`/showroom?p=${p.id}`}
                className="rm__cat-item"
                data-cursor="hover"
                aria-label={p.name}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                transition={{ duration: 0.55, ease: EASE, delay: (i % 4) * 0.05 }}
              >
                <div className="rm__cat-imgwrap">
                  <img src={posterFor(p)} alt={p.name} className="rm__cat-img" loading="lazy" />
                  {p.badge ? (
                    <span className="rm__cat-badge">{ar ? BADGE_AR[p.badge] : p.badge}</span>
                  ) : null}
                </div>
                <span className="rm__cat-name">{p.name}</span>
                <span className="rm__cat-note">{copy.tagline}</span>
              </motion.a>
            );
          })}
        </div>
      </div>

      {/* The real catalogue from evorafuturehome.com/Products — the two Evora
          collections, each across its renders. */}
      <div className="container rm__shop">
        <Rise as="header" className="rm__shophead">
          <span className="rm__taxlabel" style={{ marginBottom: 0 }}>
            {ar ? "من المتجر" : "From the shop"}
          </span>
          <h3 className="rm__shoptitle">
            {ar ? "مجموعاتنا" : "Our collections"}
          </h3>
        </Rise>

        <div className="rm__products">
          {products.map((p, i) => (
            <motion.a
              key={p.id}
              href={p.href}
              className="rm__product"
              data-cursor="hover"
              initial={reduce ? false : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.7, ease: EASE, delay: i * 0.08 }}
            >
              <div className="rm__pimgwrap">
                <img src={p.hero} alt={p.name} className="rm__pimg" loading="lazy" />
                <span className="rm__pveil" />
                <span className="rm__pthumbs" aria-hidden>
                  {p.gallery.map((g) => (
                    <img key={g} src={g} alt="" className="rm__pthumb" loading="lazy" />
                  ))}
                </span>
              </div>
              <div className="rm__pmeta">
                <span className="rm__pname">{p.name}</span>
                <span className="rm__pnote">{p.note[lang]}</span>
                <span className="rm__pcta">
                  {ar ? "اكتشف المجموعة" : "View collection"}
                  <span className="rm__parrow" aria-hidden>→</span>
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>

      <style>{`
        .rm { padding-block: clamp(4rem, 9vw, 7.5rem); background: var(--paper); color: var(--ink); }
        .rm__head { max-width: 60ch; }
        .rm__kicker {
          display: inline-flex; align-items: center; gap: 0.85rem;
          font-family: var(--f-sans); font-size: 0.72rem; font-weight: 600;
          letter-spacing: 0.26em; text-transform: uppercase; color: var(--brass-2, #8a6d3f);
        }
        .rm__rule { display: inline-block; width: clamp(28px,6vw,56px); height: 1px;
          background: linear-gradient(to right, var(--brass), transparent); }
        html[dir="rtl"] .rm__rule { background: linear-gradient(to left, var(--brass), transparent); }
        .rm__title {
          font-family: var(--f-display), Georgia, serif; font-optical-sizing: auto;
          font-variation-settings: "opsz" 140, "WONK" 1; font-weight: 340;
          font-size: clamp(2.2rem, 5.2vw, 4.2rem); line-height: 1.0;
          letter-spacing: -0.022em; margin: 1.1rem 0 0; text-wrap: balance;
        }
        .rm__title em { font-style: italic; font-variation-settings: "opsz" 140,"SOFT" 60,"WONK" 1; color: var(--ever, #2f5d4a); }
        .rm__lede { max-width: 52ch; margin: 1.3rem 0 0; font-family: var(--f-sans);
          color: var(--ink-soft); font-size: clamp(1rem,1.3vw,1.14rem); line-height: 1.7; text-wrap: pretty; }

        /* ---- stage + list: sticky image pinned left, scroll-driven rows
           on the right (the grid cell auto-stretches to the list's taller
           height, which is what lets the sticky stage release at the end) ---- */
        .rm__scrollarea {
          display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr);
          gap: clamp(1.5rem, 4vw, 3.5rem);
          margin-top: clamp(2.5rem, 5vw, 4rem);
        }
        .rm__stage {
          position: sticky; top: clamp(84px, 10vh, 112px); align-self: start;
          display: block; overflow: hidden;
          border-radius: 4px; aspect-ratio: 16 / 11; background: var(--ink);
          text-decoration: none; isolation: isolate;
        }
        .rm__img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .rm__stageveil { position: absolute; inset: 0; z-index: 1;
          background: linear-gradient(to top, rgba(20,18,15,0.72) 0%, rgba(20,18,15,0.05) 42%, transparent 70%); }
        .rm__stagecap { position: absolute; z-index: 2; inset-inline-start: clamp(1.1rem,2.5vw,2rem);
          inset-block-end: clamp(1.1rem,2.5vw,1.8rem); display: flex; align-items: flex-end; gap: 0.9rem; color: var(--paper); }
        .rm__stagenum { font-family: var(--f-display), Georgia, serif; font-size: clamp(1.4rem,2.4vw,2rem);
          font-weight: 340; color: var(--brass); line-height: 1; }
        .rm__stagename { display: block; font-family: var(--f-display), Georgia, serif;
          font-weight: 360; font-size: clamp(1.5rem,3vw,2.4rem); line-height: 1.05; }
        .rm__stagenote { display: block; margin-top: 0.25rem; font-family: var(--f-sans);
          font-size: 0.84rem; letter-spacing: 0.02em; color: rgba(245,242,235,0.74); }
        .rm__pieces { position: absolute; z-index: 2; inset-block-start: clamp(1rem,2.2vw,1.6rem);
          inset-inline-start: clamp(1.1rem,2.5vw,2rem); display: flex; flex-wrap: wrap; gap: 0.4rem; max-width: 62%; }
        .rm__piece { font-family: var(--f-sans); font-size: 0.68rem; letter-spacing: 0.04em;
          color: var(--paper); background: rgba(255,255,255,0.12); backdrop-filter: blur(6px);
          border: 1px solid rgba(255,255,255,0.18); padding: 0.28em 0.7em; border-radius: 999px; }
        .rm__enter { position: absolute; z-index: 2; inset-block-end: clamp(1.1rem,2.5vw,1.8rem);
          inset-inline-end: clamp(1.1rem,2.5vw,2rem); font-family: var(--f-sans); font-size: 0.8rem;
          font-weight: 600; letter-spacing: 0.04em; color: var(--paper);
          opacity: 0; transform: translateX(-6px); transition: opacity .4s var(--ease), transform .4s var(--ease); }
        html[dir="rtl"] .rm__enter { transform: translateX(6px); }
        .rm__stage:hover .rm__enter, .rm__stage:focus-visible .rm__enter { opacity: 1; transform: none; }
        .rm__stage:hover .rm__img { transform: scale(1.03); transition: transform 1.2s var(--ease); }

        .rm__list { position: relative; list-style: none; margin: 0; padding: 0;
          border-top: 1px solid var(--line); }
        .rm__listbar { position: absolute; inset-inline-start: 0; width: 2px;
          background: var(--ever, #2f5d4a); }
        .rm__row { min-height: 58vh; display: flex; align-items: center; }
        .rm__item { display: flex; align-items: center; gap: 1rem; width: 100%;
          padding: clamp(0.85rem,1.8vw,1.25rem) 0 clamp(0.85rem,1.8vw,1.25rem) 1.1rem;
          border-bottom: 1px solid var(--line); text-decoration: none; color: var(--ink);
          transition: color .35s var(--ease), padding-inline-start .35s var(--ease); }
        .rm__row:last-child .rm__item { border-bottom: none; }
        .rm__item:hover, .rm__item.is-active { padding-inline-start: 1.6rem; }
        .rm__inum { font-family: var(--f-sans); font-size: 0.74rem; font-weight: 600; letter-spacing: 0.1em;
          color: var(--brass-2); min-width: 2ch; align-self: flex-start; margin-top: 0.4em; }
        .rm__itext { flex: 1; display: flex; flex-direction: column; gap: 0.4rem; }
        .rm__iname { font-family: var(--f-display), Georgia, serif; font-weight: 360;
          font-size: clamp(1.6rem,3.4vw,2.6rem); line-height: 1.05; letter-spacing: -0.01em;
          color: var(--ink-soft); transition: color .35s var(--ease); }
        .rm__inote { font-family: var(--f-sans); font-size: 0.86rem; color: var(--ink-faint);
          opacity: 0; transform: translateY(-4px); transition: opacity .35s var(--ease), transform .35s var(--ease); }
        .rm__item:hover .rm__iname, .rm__item.is-active .rm__iname { color: var(--ever, #2f5d4a); }
        .rm__item:hover .rm__inote, .rm__item.is-active .rm__inote { opacity: 1; transform: none; }
        .rm__iarrow { font-size: 1.1rem; color: var(--brass); opacity: 0; transform: translateX(-6px);
          transition: opacity .35s var(--ease), transform .35s var(--ease); align-self: flex-start; margin-top: 0.3em; }
        html[dir="rtl"] .rm__iarrow { transform: scaleX(-1) translateX(-6px); }
        .rm__item:hover .rm__iarrow, .rm__item.is-active .rm__iarrow { opacity: 1; transform: none; }
        html[dir="rtl"] .rm__item:hover .rm__iarrow, html[dir="rtl"] .rm__item.is-active .rm__iarrow { transform: scaleX(-1); }

        /* ---- mobile stacked cards (own image per room, no sticky/scroll-link) ---- */
        .rm__mobile { display: none; }
        .rm__mcard { display: block; text-decoration: none; color: var(--ink); }
        .rm__mimgwrap { position: relative; overflow: hidden; border-radius: 4px;
          aspect-ratio: 4 / 3.1; background: var(--ink); isolation: isolate; }
        .rm__mimg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .rm__mveil { position: absolute; inset: 0; z-index: 1;
          background: linear-gradient(to top, rgba(20,18,15,0.5) 0%, transparent 55%); }
        .rm__mpieces { position: absolute; z-index: 2; inset-block-start: 0.85rem; inset-inline-start: 0.85rem;
          display: flex; flex-wrap: wrap; gap: 0.35rem; max-width: 80%; }
        .rm__mmeta { display: flex; align-items: flex-start; gap: 0.9rem; padding: 1rem 0.2rem 0; }
        .rm__mmeta .rm__iname { font-size: clamp(1.3rem, 5.5vw, 1.6rem); color: var(--ink); }
        .rm__mmeta .rm__inote { opacity: 1; transform: none; }
        .rm__mmeta .rm__iarrow { opacity: 1; transform: none; color: var(--ink-faint); }

        /* ---- taxonomy strip ---- */
        .rm__tax { margin-top: clamp(3rem, 6vw, 5rem); padding-top: clamp(2rem,4vw,3rem); border-top: 1px solid var(--line); }
        .rm__taxlabel { display: block; text-align: center; font-family: var(--f-sans);
          font-size: 0.72rem; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--brass-2); margin-bottom: clamp(1.6rem,3vw,2.4rem); }
        .rm__cat { display: grid; grid-template-columns: repeat(4, 1fr); gap: clamp(1rem, 2.2vw, 1.8rem); }
        .rm__cat-item { display: flex; flex-direction: column; text-decoration: none; color: var(--ink); }
        .rm__cat-imgwrap { position: relative; overflow: hidden; border-radius: 4px; aspect-ratio: 4 / 3;
          background: var(--surface, #efece6); border: 1px solid var(--line); isolation: isolate; }
        .rm__cat-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
          transition: transform 1s var(--ease); }
        .rm__cat-item:hover .rm__cat-img, .rm__cat-item:focus-visible .rm__cat-img { transform: scale(1.05); }
        .rm__cat-badge { position: absolute; z-index: 2; inset-block-start: 0.55rem; inset-inline-start: 0.55rem;
          font-family: var(--f-sans); font-size: 0.6rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--ink); background: rgba(255,255,255,0.86); backdrop-filter: blur(6px);
          border: 1px solid rgba(255,255,255,0.6); padding: 0.3em 0.62em; border-radius: 999px; }
        .rm__cat-name { margin-top: 0.7rem; font-family: var(--f-display), Georgia, serif; font-weight: 360;
          font-size: clamp(1.05rem, 1.7vw, 1.32rem); line-height: 1.12; letter-spacing: -0.01em; color: var(--ink); }
        .rm__cat-note { margin-top: 0.15rem; font-family: var(--f-sans); font-size: 0.8rem;
          letter-spacing: 0.01em; color: var(--ink-faint); }

        /* ---- real catalogue (600 / 700 Heaven) ---- */
        .rm__shop { margin-top: clamp(3rem, 6vw, 5rem); padding-top: clamp(2rem,4vw,3rem); border-top: 1px solid var(--line); }
        .rm__shophead { text-align: center; margin-bottom: clamp(1.8rem,3.5vw,2.8rem); }
        .rm__shoptitle { font-family: var(--f-display), Georgia, serif; font-weight: 340;
          font-size: clamp(1.9rem, 4vw, 3rem); line-height: 1.02; letter-spacing: -0.02em;
          margin: 0.5rem 0 0; color: var(--ink); }
        .rm__products { display: grid; grid-template-columns: repeat(2, 1fr); gap: clamp(1.2rem, 3vw, 2.4rem); }
        .rm__product { display: block; text-decoration: none; color: var(--ink); }
        .rm__pimgwrap { position: relative; overflow: hidden; border-radius: 4px;
          aspect-ratio: 4 / 3; background: var(--ink); isolation: isolate; }
        .rm__pimg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
          transition: transform 1.2s var(--ease); }
        .rm__product:hover .rm__pimg, .rm__product:focus-visible .rm__pimg { transform: scale(1.04); }
        .rm__pveil { position: absolute; inset: 0; z-index: 1;
          background: linear-gradient(to top, rgba(20,18,15,0.34) 0%, transparent 46%); }
        .rm__pthumbs { position: absolute; z-index: 2; inset-block-end: 0.7rem; inset-inline-end: 0.7rem;
          display: flex; gap: 0.4rem; opacity: 0; transform: translateY(6px);
          transition: opacity .4s var(--ease), transform .4s var(--ease); }
        .rm__product:hover .rm__pthumbs, .rm__product:focus-visible .rm__pthumbs { opacity: 1; transform: none; }
        .rm__pthumb { width: clamp(40px,5vw,58px); aspect-ratio: 1; object-fit: cover; border-radius: 3px;
          border: 1px solid rgba(255,255,255,0.5); box-shadow: 0 4px 14px rgba(0,0,0,0.35); }
        .rm__pmeta { display: flex; flex-direction: column; gap: 0.2rem; padding: 0.9rem 0.2rem 0; }
        .rm__pname { font-family: var(--f-display), Georgia, serif; font-weight: 360;
          font-size: clamp(1.3rem,2.2vw,1.8rem); line-height: 1.1; letter-spacing: -0.01em; color: var(--ink); }
        .rm__pnote { font-family: var(--f-sans); font-size: 0.86rem; letter-spacing: 0.01em; color: var(--ink-faint); }
        .rm__pcta { display: inline-flex; align-items: center; gap: 0.45rem; margin-top: 0.5rem;
          font-family: var(--f-sans); font-size: 0.78rem; font-weight: 600; letter-spacing: 0.04em;
          color: var(--brass); }
        .rm__parrow { transition: transform .35s var(--ease); }
        html[dir="rtl"] .rm__parrow { transform: scaleX(-1); }
        .rm__product:hover .rm__parrow { transform: translateX(4px); }
        html[dir="rtl"] .rm__product:hover .rm__parrow { transform: scaleX(-1) translateX(4px); }
        @media (max-width: 720px) {
          .rm__products { grid-template-columns: 1fr; gap: 1.6rem; }
        }

        @media (max-width: 860px) {
          /* the sticky scroll-linked gallery only really works with room to
             breathe beside a pinned image — below this width, swap to the
             stacked mobile cards (each with its own image) instead. */
          .rm__scrollarea { display: none; }
          .rm__mobile { display: flex; flex-direction: column; gap: 1.6rem; margin-top: clamp(2rem, 5vw, 3rem); }
          .rm__cat { grid-template-columns: repeat(3, 1fr); row-gap: 1.6rem; }
        }
        @media (max-width: 460px) {
          .rm__cat { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </section>
  );
}
