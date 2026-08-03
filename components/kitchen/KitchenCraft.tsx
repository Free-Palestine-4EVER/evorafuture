"use client";

import { useT } from "@/lib/i18n";
import { Rise, Stagger, StaggerItem } from "@/components/motion";
import { avifSrc } from "@/lib/avifSrc";

// Page-local strings. Facts are sourced and rephrased from copy that already
// exists elsewhere in the repo — see the comment above each item — so the
// section reads as new prose while never introducing a new claim:
//   f1 → ConfiguratorScroll's cfg-make step 2 ("cut it in our workshop")
//   f2 → lib/i18n manifesto_body + pj_free (design team + free design service)
//   f3 → ConfiguratorScroll's cfg-make step 3 + lib/data.ts faqs (own delivery team)
//   f4 → lib/i18n fin_title / fin_body are reused verbatim via t() below —
//        financing terms are exact figures, so they're quoted, not rephrased.
const T = {
  eyebrow: { en: "Why a bespoke Evora kitchen", ar: "لماذا مطبخ إيفورا حسب الطلب" },
  heading: { en: "One workshop, start to finish", ar: "ورشة واحدة، من الفكرة حتى التسليم" },
  lead: {
    en: "Your island isn't picked off a shelf. The same studio that designs it also cuts, finishes and installs it — under one roof, in Amman.",
    ar: "جزيرتك لا تُنتقى من على رف. الاستوديو نفسه الذي يصمّمها يقصّها ويشطّبها ويركّبها — تحت سقف واحد، في عمّان.",
  },
  photoCaption: { en: "An Evora kitchen island, built in Amman", ar: "جزيرة مطبخ من إيفورا، صُنعت في عمّان" },
  f1_t: { en: "Cut to order, in our workshop", ar: "تُقصّ حسب الطلب، في ورشتنا" },
  f1_b: {
    en: "No catalogue numbers — one slab, measured and finished by hand by our own makers in Amman.",
    ar: "بلا أرقام كتالوج — لوحٌ واحد، يُقاس ويُشطَّب يدويًا على أيدي صنّاعنا في عمّان.",
  },
  f2_t: { en: "One design team, start to finish", ar: "فريق تصميم واحد، من البداية للنهاية" },
  f2_b: {
    en: "The same team that helps you choose the stone sees the project through to delivery — part of Evora's complimentary design service.",
    ar: "الفريق نفسه الذي يساعدك على اختيار الحجر يرافق مشروعك حتى التسليم — ضمن خدمة التصميم المجانية من إيفورا.",
  },
  f3_t: { en: "Delivered and installed by us", ar: "نوصّلها ونركّبها بأنفسنا" },
  f3_b: {
    en: "Our own team fits every island in place, so nothing is lost between the workshop and your kitchen.",
    ar: "فريقنا نفسه يركّب كل جزيرة في مكانها، حتى لا يضيع شيء بين الورشة ومطبخك.",
  },
};

const PHOTO = "/evora/config-frames/frame_0001.webp";

export default function KitchenCraft() {
  const { t, lang, dir } = useT();
  const tl = (k: keyof typeof T) => T[k][lang];

  const features = [
    { n: "01", t: tl("f1_t"), b: tl("f1_b") },
    { n: "02", t: tl("f2_t"), b: tl("f2_b") },
    { n: "03", t: tl("f3_t"), b: tl("f3_b") },
    { n: "04", t: t("fin_title"), b: t("fin_body") },
  ];

  return (
    <section id="kitchen-craft" className="kcr" dir={dir} lang={lang}>
      <div className="container kcr__grid">
        <Rise className="kcr__photo">
          <picture>
            <source srcSet={avifSrc(PHOTO)} type="image/avif" />
            <img src={PHOTO} alt={tl("photoCaption")} className="kcr__img" loading="lazy" decoding="async" />
          </picture>
          <span className="kcr__photoscrim" aria-hidden />
          <span className="kcr__photocap">{tl("photoCaption")}</span>
        </Rise>

        <div className="kcr__body">
          <span className="eyebrow kcr__eyebrow">{tl("eyebrow")}</span>
          <Rise as="h2" delay={0.06} className="display kcr__h">
            {tl("heading")}
          </Rise>
          <Rise as="p" delay={0.12} className="kcr__lead">
            {tl("lead")}
          </Rise>

          <Stagger className="kcr__list" gap={0.08} delay={0.1}>
            {features.map((f) => (
              <StaggerItem key={f.n} className="kcr__item">
                <span className="kcr__n">{f.n}</span>
                <span className="kcr__itembody">
                  <strong className="kcr__itemt">{f.t}</strong>
                  <span className="kcr__itemb">{f.b}</span>
                </span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>

      <style>{css}</style>
    </section>
  );
}

const css = `
  .kcr { position: relative; background: var(--bone); padding-block: clamp(4rem, 9vw, 7.5rem); }

  .kcr__grid { display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
    gap: clamp(2rem, 5vw, 4.5rem); align-items: center; }
  [dir="rtl"] .kcr__grid { direction: rtl; }

  .kcr__photo { position: relative; overflow: hidden; border-radius: 8px;
    aspect-ratio: 4 / 5; box-shadow: 0 30px 80px -44px rgba(16,15,13,0.5); }
  .kcr__img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
    transform: scale(1.02); transition: transform 1.3s var(--ease); }
  .kcr__photo:hover .kcr__img { transform: scale(1.07); }
  .kcr__photoscrim { position: absolute; inset: 0;
    background: linear-gradient(180deg, transparent 55%, rgba(16,15,13,0.72) 100%); }
  .kcr__photocap { position: absolute; z-index: 1; bottom: 1.1rem; inset-inline-start: 1.2rem;
    inset-inline-end: 1.2rem; color: rgba(251,247,240,0.9);
    font-size: 0.78rem; letter-spacing: 0.04em; line-height: 1.4; }

  .kcr__body { min-width: 0; }
  .kcr__eyebrow { color: var(--brass); display: block; }
  .kcr__h { font-size: clamp(2rem, 4.2vw, 3.2rem); line-height: 1.05; margin: 0.9rem 0 0; color: var(--ink); }
  .kcr__lead { color: var(--ink-soft); font-size: clamp(0.98rem, 1.2vw, 1.1rem); line-height: 1.65;
    margin: 1.1rem 0 0; max-width: 52ch; }

  .kcr__list { list-style: none; margin: clamp(2rem, 4vw, 2.8rem) 0 0; padding: 0;
    display: flex; flex-direction: column; }
  .kcr__item { display: grid; grid-template-columns: auto 1fr; gap: clamp(1rem, 2vw, 1.6rem);
    padding: clamp(1rem, 1.8vw, 1.4rem) 0; border-top: 1px solid var(--line); }
  .kcr__n { font-family: var(--font-display); font-size: clamp(1.2rem, 1.8vw, 1.5rem);
    line-height: 1.4; color: var(--brass); letter-spacing: 0.02em; }
  .kcr__itembody { display: flex; flex-direction: column; gap: 0.3rem; }
  .kcr__itemt { font-size: 1.02rem; color: var(--ink); font-weight: 600; line-height: 1.3; }
  .kcr__itemb { font-size: 0.92rem; color: var(--ink-faint); line-height: 1.55; max-width: 52ch; }

  @media (max-width: 860px) {
    .kcr__grid { grid-template-columns: 1fr; }
    .kcr__photo { aspect-ratio: 16 / 11; }
  }
`;
