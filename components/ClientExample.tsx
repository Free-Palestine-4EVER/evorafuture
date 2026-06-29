"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Rise, RevealLines } from "@/components/motion";
import { useT, type Lang } from "@/lib/i18n";

type L = { en: string; ar: string };

interface Piece {
  id: string;
  name: L;
  tagline: L;
  desc: L;
  instagram: string;
  model: string;
  meta: L[];
  accent: string;
}

const PIECES: Piece[] = [
  {
    id: "chesterfield-cream",
    name: { en: "The Cream Chesterfield", ar: "تشسترفيلد الكريمي" },
    tagline: {
      en: "Chic design meets ultimate coziness",
      ar: "أناقةٌ في التصميم ودفءٌ بلا حدود",
    },
    desc: {
      en: "Deep-buttoned tufting, generous rolled arms and hand-set studwork, wrapped in a soft natural linen. A timeless club piece built around a single sink-in cushion — quietly grand, endlessly comfortable.",
      ar: "حشوةٌ مزرّرة عميقة، وأذرعٌ ملفوفة واسعة، ومساميرُ مثبّتة باليد، مكسوّةٌ بكتانٍ طبيعي ناعم. قطعةٌ كلاسيكية خالدة مبنيّة حول وسادةٍ واحدة تغوص فيها — فخامةٌ هادئة وراحةٌ لا تنتهي.",
    },
    instagram: "/evora/ig-chesterfield.jpg",
    model: "/models/chesterfield-cream.glb",
    meta: [
      { en: "Hand-tufted linen", ar: "كتان محشوّ يدويًا" },
      { en: "Solid turned legs", ar: "أرجل خشب مخروطة" },
      { en: "Made to order", ar: "يُصنع حسب الطلب" },
    ],
    accent: "#b8a98c",
  },
  {
    id: "lounge-orange",
    name: { en: "The Bold Orange Lounge", ar: "كرسي الاسترخاء البرتقالي" },
    tagline: {
      en: "Bold in colour, soft in style",
      ar: "جريءٌ في لونه، ناعمٌ في طرازه",
    },
    desc: {
      en: "A sculptural sling lounge with a plush pillow seat in burnt-orange leather, slung on a blackened-steel frame. Arrives with its matching ottoman — your new favourite seat, made to be noticed.",
      ar: "كرسي استرخاءٍ منحوت بمقعدٍ وثير من الجلد البرتقالي المحروق، محمولٌ على هيكلٍ فولاذي أسود. يأتي مع مسندٍ للقدمين مطابق — مقعدك المفضّل الجديد، صُنع ليلفت الأنظار.",
    },
    instagram: "/evora/ig-lounge.jpg",
    model: "/models/lounge-orange.glb",
    meta: [
      { en: "Burnt-orange leather", ar: "جلد برتقالي محروق" },
      { en: "Blackened steel frame", ar: "هيكل فولاذي أسود" },
      { en: "Chair + ottoman", ar: "كرسي + مسند قدمين" },
    ],
    accent: "#c0703a",
  },
];

/* All user-facing chrome for this route — every EN string has native Jordanian AR. */
const T = {
  eyebrow: {
    en: "From @evorafuturehome · Now in 3D",
    ar: "من @evorafuturehome · الآن بالأبعاد الثلاثية",
  },
  lead_a: {
    en: "Two pieces from Evora's Instagram — spin each one freely, then tap ",
    ar: "قطعتان من إنستغرام إيفورا — حرّك كلًّا منهما بحرية، ثم انقر ",
  },
  lead_b: {
    en: " to drop it into your space in AR and scale it to size.",
    ar: " لتضعها في مساحتك بالواقع المعزّز وتضبطها على مقاسك.",
  },
  view: { en: "View in your room", ar: "اعرضها في غرفتك" },
  badge: { en: "3D · Live", ar: "ثلاثي الأبعاد · مباشر" },
  loading: { en: "Loading 3D…", ar: "جارٍ تحميل الـ3D…" },
  hint: { en: "⟲ Drag to spin freely", ar: "⟲ اسحب للتدوير بحرية" },
  ig_source: {
    en: "@evorafuturehome · Instagram",
    ar: "@evorafuturehome · إنستغرام",
  },
  ig_alt_suffix: { en: " on Evora's Instagram", ar: " على إنستغرام إيفورا" },
  model_alt_suffix: { en: " 3D model", ar: " نموذج ثلاثي الأبعاد" },
  enquire: { en: "Enquire on WhatsApp", ar: "استفسر عبر واتساب" },
  wa_text: {
    en: "Hi Evora — I'm interested in ",
    ar: "مرحبًا إيفورا — أنا مهتم بـ",
  },
  col_eyebrow: { en: "The full collection", ar: "المجموعة كاملة" },
  col_title: { en: "See the whole collection", ar: "شاهد المجموعة كاملة" },
  col_desc: {
    en: "These two are just the start. Explore every Evora piece — sofas, beds, kitchens and more — and place any of them in your own room in AR.",
    ar: "هاتان مجرد البداية. اكتشف كل قطعة من إيفورا — كنبات وأسرّة ومطابخ والمزيد — وضع أيًّا منها في غرفتك بالواقع المعزّز.",
  },
  col_cta: { en: "Shop the collection", ar: "تسوّق المجموعة" },
};

const TITLE_LINES: Record<Lang, string[]> = {
  en: ["Straight off", "the feed, in 3D."],
  ar: ["مباشرةً من المنشور،", "بالأبعاد الثلاثية."],
};

/* One 3D panel — pure interactive model, free orbit, AR with pinch-to-resize.
   Mounts the (large) model-viewer only once the panel scrolls into view, so each
   GLB downloads on demand rather than on page load. */
function Viewer3D({ piece: p, mvReady, lang }: { piece: Piece; mvReady: boolean; lang: Lang }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const active = inView && mvReady;

  return (
    <div ref={ref} className="cx__viewer" style={{ ["--accent" as string]: p.accent }}>
      <span className="cx__badge">{T.badge[lang]}</span>
      {active && (
        <model-viewer
          src={p.model}
          alt={`${p.name[lang]}${T.model_alt_suffix[lang]}`}
          camera-controls
          touch-action="none"
          auto-rotate
          auto-rotate-delay="2500"
          rotation-per-second="18deg"
          interaction-prompt="none"
          /* free spin: full vertical + horizontal orbit, generous zoom */
          min-camera-orbit="auto 0deg 50%"
          max-camera-orbit="auto 180deg 200%"
          min-field-of-view="10deg"
          max-field-of-view="45deg"
          /* AR: launchable + pinch-to-resize in the room */
          ar
          ar-modes="webxr scene-viewer quick-look"
          ar-placement="floor"
          ar-scale="auto"
          shadow-intensity="1.15"
          shadow-softness="1"
          exposure="1.05"
          environment-image="neutral"
          loading="eager"
          reveal="auto"
          onLoad={() => setLoaded(true)}
          style={{ width: "100%", height: "100%", backgroundColor: "transparent" }}
        >
          {/* our own AR button, wired to model-viewer's AR slot */}
          <button slot="ar-button" className="cx__ar" data-cursor="hover">
            ⤢ {T.view[lang]}
          </button>
          <div slot="progress-bar" style={{ display: "none" }} />
        </model-viewer>
      )}
      {!loaded && <span className="cx__loading-tag">{T.loading[lang]}</span>}
      <span className="cx__hint">{T.hint[lang]}</span>
    </div>
  );
}

export default function ClientExample() {
  const { lang, dir } = useT();
  const t = (k: keyof typeof T) => T[k][lang];

  // Load the model-viewer web component once, on the client only.
  const [mvReady, setMvReady] = useState(false);
  useEffect(() => {
    let active = true;
    import("@google/model-viewer").then(() => active && setMvReady(true));
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="cx" dir={dir}>
      {/* Intro */}
      <header className="cx__head container">
        <Rise as="span" className="eyebrow" style={{ color: "var(--brass)", display: "block" }}>
          {t("eyebrow")}
        </Rise>
        <RevealLines
          key={lang}
          className="display cx__title"
          lines={TITLE_LINES[lang]}
          italicIndex={1}
          italicColor="var(--brass)"
          delay={0.08}
        />
        <Rise delay={0.16}>
          <p className="cx__lead">
            {t("lead_a")}
            <em>{t("view")}</em>
            {t("lead_b")}
          </p>
        </Rise>
      </header>

      {/* Pieces */}
      <div className="cx__list">
        {PIECES.map((p, i) => (
          <article key={p.id} className={`cx__row ${i % 2 ? "cx__row--rev" : ""}`}>
            {/* The original Instagram post */}
            <Rise className="cx__media" delay={0.05}>
              <figure className="cx__ig">
                <img src={p.instagram} alt={`${p.name[lang]}${t("ig_alt_suffix")}`} loading="lazy" />
                <figcaption>
                  <span className="cx__ig-dot" /> {t("ig_source")}
                </figcaption>
              </figure>
            </Rise>

            {/* 3D viewer — loads only when scrolled into view */}
            <Rise className="cx__media" delay={0.12}>
              <Viewer3D piece={p} mvReady={mvReady} lang={lang} />
            </Rise>

            {/* Copy */}
            <div className="cx__copy">
              <Rise delay={0.05}>
                <span className="cx__index">0{i + 1}</span>
                <h2 className="display cx__name">{p.name[lang]}</h2>
                <p className="cx__tag">{p.tagline[lang]}</p>
                <p className="cx__desc">{p.desc[lang]}</p>
                <ul className="cx__meta">
                  {p.meta.map((m) => (
                    <li key={m.en}>{m[lang]}</li>
                  ))}
                </ul>
                <a
                  href={`https://wa.me/962796364105?text=${encodeURIComponent(t("wa_text") + p.name[lang])}`}
                  className="btn btn-solid cx__cta"
                  data-cursor="hover"
                >
                  {t("enquire")} <span className="arrow">→</span>
                </a>
              </Rise>
            </div>
          </article>
        ))}

        {/* The whole collection — third card */}
        <article className="cx__row cx__collection">
          <Rise className="cx__col-inner">
            <span className="cx__index">0{PIECES.length + 1}</span>
            <span className="eyebrow cx__col-eyebrow">{t("col_eyebrow")}</span>
            <h2 className="display cx__col-title">{t("col_title")}</h2>
            <p className="cx__col-desc">{t("col_desc")}</p>
            <Link href="/shop" className="btn btn-solid cx__cta" data-cursor="hover">
              {t("col_cta")} <span className="arrow">→</span>
            </Link>
          </Rise>
        </article>
      </div>

      <style>{`
        .cx { background: var(--paper); padding-block: clamp(6rem, 12vw, 10rem); overflow: hidden; }
        .cx__head { max-width: 760px; margin-bottom: clamp(3rem, 7vw, 6rem); }
        .cx__title { font-size: clamp(2.6rem, 7vw, 5.4rem); margin: 1rem 0 0; }
        .cx__lead { color: var(--ink-soft); font-size: clamp(1rem, 1.4vw, 1.2rem); line-height: 1.65; max-width: 54ch; margin-top: 1.6rem; }
        .cx__lead em { font-family: var(--font-display); font-style: italic; color: var(--ink); }
        html[dir="rtl"] .cx__lead em { font-style: normal; font-weight: 600; }

        .cx__list { display: flex; flex-direction: column; gap: clamp(5rem, 12vw, 9rem); }
        .cx__row { width: 100%; max-width: 1480px; margin-inline: auto; padding-inline: var(--gut);
          display: grid; grid-template-columns: 0.82fr 1.18fr; grid-template-areas: "ig viewer" "copy copy";
          gap: clamp(1.2rem, 2.6vw, 2.4rem); align-items: start; }
        .cx__media { grid-area: ig; min-width: 0; }
        .cx__media:nth-of-type(2) { grid-area: viewer; }

        /* Instagram post — shown whole, framed like a phone screen on a dark stage */
        .cx__ig { position: relative; margin: 0; border-radius: 14px; overflow: hidden;
          height: clamp(480px, 58vw, 720px); background: #0c0c0e;
          border: 1px solid rgba(255,255,255,0.06); box-shadow: 0 40px 90px -50px rgba(0,0,0,0.6); }
        .cx__ig img { width: 100%; height: 100%; object-fit: contain; display: block; }
        .cx__ig figcaption { position: absolute; bottom: 0.8rem; inset-inline-start: 0.8rem; z-index: 2;
          display: inline-flex; align-items: center; gap: 0.5rem; color: var(--paper);
          font-size: 0.66rem; letter-spacing: 0.14em; text-transform: uppercase;
          background: rgba(16,15,13,0.6); backdrop-filter: blur(6px); padding: 0.45em 0.9em; border-radius: 100px; }
        .cx__ig-dot { width: 7px; height: 7px; border-radius: 50%;
          background: conic-gradient(from 0deg, #feda75, #d62976, #962fbf, #4f5bd5, #feda75); }

        /* 3D viewer — pure model on a soft studio backdrop */
        .cx__viewer { position: relative; height: clamp(480px, 58vw, 720px);
          border-radius: 14px; overflow: hidden;
          background: radial-gradient(120% 100% at 50% 12%, #fff 0%, var(--paper-2) 52%, #e7ddcc 100%);
          border: 1px solid var(--line-soft); box-shadow: inset 0 1px 0 rgba(255,255,255,0.7); }
        .cx__viewer model-viewer { position: relative; z-index: 1; --poster-color: transparent; }
        .cx__badge { position: absolute; top: 1rem; inset-inline-start: 1rem; z-index: 3; display: inline-flex; align-items: center; gap: 0.45rem;
          background: var(--ink); color: var(--paper); font-size: 0.6rem; letter-spacing: 0.18em; text-transform: uppercase; padding: 0.4em 0.8em; border-radius: 100px; }
        .cx__badge::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 8px var(--accent); }
        .cx__hint { position: absolute; bottom: 1rem; inset-inline-end: 1rem; z-index: 3; color: var(--ink-faint);
          font-size: 0.64rem; letter-spacing: 0.14em; text-transform: uppercase; pointer-events: none; }
        .cx__loading-tag { position: absolute; bottom: 1rem; inset-inline-start: 1rem; z-index: 3; color: var(--ink-soft);
          font-size: 0.62rem; letter-spacing: 0.16em; text-transform: uppercase; }
        .cx__ar { position: absolute; top: 1rem; inset-inline-end: 1rem; z-index: 4; cursor: none;
          display: inline-flex; align-items: center; gap: 0.45rem; border: none;
          background: var(--accent); color: #fff; font-family: var(--font-sans); font-weight: 500;
          font-size: 0.72rem; letter-spacing: 0.04em; padding: 0.7em 1.1em; border-radius: 100px;
          box-shadow: 0 10px 26px -10px rgba(0,0,0,0.45); transition: transform 0.3s var(--ease), filter 0.3s var(--ease); }
        .cx__ar:hover { transform: translateY(-2px); filter: brightness(1.06); }

        .cx__copy { grid-area: copy; padding-top: clamp(1rem, 2vw, 1.6rem); max-width: 62ch; }
        .cx__index { font-family: var(--font-display); color: var(--brass); font-size: 0.9rem; letter-spacing: 0.1em; }
        .cx__name { font-size: clamp(1.9rem, 4vw, 3rem); margin: 0.4rem 0 0; }
        .cx__tag { font-family: var(--font-display); font-style: italic; color: var(--brass); font-size: clamp(1.05rem, 1.6vw, 1.35rem); margin: 0.5rem 0 0; }
        html[dir="rtl"] .cx__tag { font-style: normal; }
        .cx__desc { color: var(--ink-soft); line-height: 1.7; margin: 1.1rem 0 0; }
        .cx__meta { list-style: none; padding: 0; margin: 1.5rem 0 0; display: flex; flex-wrap: wrap; gap: 0.6rem; }
        .cx__meta li { font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-soft);
          border: 1px solid var(--line); border-radius: 100px; padding: 0.5em 1em; }
        .cx__cta { margin-top: 2rem; }

        /* Reversed rows: 3D on the left, the post on the right */
        .cx__row--rev { grid-template-columns: 1.18fr 0.82fr; grid-template-areas: "viewer ig" "copy copy"; }

        /* Third card — the whole collection, link to the shop */
        .cx__collection { display: block; }
        .cx__col-inner { max-width: 1480px; margin-inline: auto; text-align: center;
          border: 1px solid var(--line); border-radius: 18px;
          background: radial-gradient(130% 120% at 50% 0%, #fff 0%, var(--paper-2) 60%, #e7ddcc 120%);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.7), 0 40px 90px -60px rgba(0,0,0,0.5);
          padding: clamp(2.6rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem); }
        .cx__col-eyebrow { display: block; color: var(--brass); margin-top: 0.6rem; }
        .cx__col-title { font-size: clamp(1.9rem, 4.4vw, 3.2rem); margin: 0.8rem 0 0; }
        .cx__col-desc { color: var(--ink-soft); line-height: 1.7; max-width: 56ch; margin: 1.1rem auto 0; }
        .cx__collection .cx__cta { display: inline-flex; }

        @media (max-width: 860px) {
          .cx__row, .cx__row--rev { grid-template-columns: 1fr; grid-template-areas: "viewer" "ig" "copy"; gap: 1rem; }
          .cx__ig { height: auto; }
          .cx__ig img { height: auto; }
          .cx__viewer { height: clamp(420px, 92vw, 560px); }
          .cx__copy { padding-top: 0.6rem; }
          .cx__cta { width: 100%; justify-content: center; }
          .cx__collection .cx__cta { width: auto; }
          /* tap-friendly AR launch + a touch larger copy CTA on phones */
          .cx__ar { min-height: 44px; padding-block: 0.55em; }
          .cx__cta { min-height: 48px; }
        }
      `}</style>
    </section>
  );
}
