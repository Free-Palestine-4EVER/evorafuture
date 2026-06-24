"use client";

import { useEffect, useState } from "react";
import { useT } from "@/lib/i18n";
import {
  Rise,
  RevealLines,
  Stagger,
  StaggerItem,
  Magnetic,
} from "@/components/motion";

// five photos that crossfade every 1.5s
const SVC_PHOTOS = [
  "/evora/p06.jpg",
  "/evora/p03.jpg",
  "/evora/p09.jpg",
  "/evora/p11.jpg",
];

const Icon = ({ name }: { name: string }) => {
  const common = { width: 26, height: 26, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.3, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case "idea":
      return (<svg {...common}><path d="M9 18h6" /><path d="M10 21h4" /><path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.3 1 2.5h6c0-1.2.3-1.8 1-2.5A6 6 0 0 0 12 3z" /></svg>);
    case "proposal":
      return (<svg {...common}><path d="M6 2h8l4 4v16H6z" /><path d="M14 2v4h4" /><path d="M9 12h6" /><path d="M9 16h4" /></svg>);
    case "3d":
      return (<svg {...common}><path d="M12 2l8 4.5v9L12 20l-8-4.5v-9z" /><path d="M12 2v9l8 4.5M12 11L4 15.5" /></svg>);
    case "craft":
      return (<svg {...common}><path d="M3 21l4-1 11-11a2.8 2.8 0 0 0-4-4L3 16l-1 5z" /><path d="M14 5l4 4" /></svg>);
    case "delivery":
      return (<svg {...common}><path d="M3 13l1-5h11l3 4h3v4h-2" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" /><path d="M9 17h6" /></svg>);
    default:
      return (<svg {...common}><circle cx="12" cy="12" r="9" /></svg>);
  }
};

// The one-stop journey — idea in your head → proposal → 3D → crafting → delivery.
const PIPELINE: { icon: string; title: { en: string; ar: string }; body: { en: string; ar: string } }[] = [
  {
    icon: "idea",
    title: { en: "The idea in your head", ar: "الفكرة في رأسك" },
    body: {
      en: "Tell us how you live and what you picture. We listen, measure, and understand the space before a single line is drawn.",
      ar: "أخبرنا كيف تعيش وما الذي تتخيّله. نستمع ونقيس ونفهم المساحة قبل رسم أي خط.",
    },
  },
  {
    icon: "proposal",
    title: { en: "A tailored proposal", ar: "عرض مفصّل لك" },
    body: {
      en: "A moodboard, a layout and a clear quote — your whole project shaped on paper, with no surprises.",
      ar: "لوحة إلهام، وتوزيع للمساحة، وعرض سعر واضح — مشروعك كاملًا على الورق، دون أي مفاجآت.",
    },
  },
  {
    icon: "3d",
    title: { en: "Designed in 3D", ar: "تصميم ثلاثي الأبعاد" },
    body: {
      en: "Walk your home before it exists. We model every room in 3D and render it photoreal — you approve each detail.",
      ar: "تجوّل في منزلك قبل أن يُبنى. نُصمّم كل غرفة ثلاثية الأبعاد ونُخرجها بواقعية تامة — وتعتمد أنت كل تفصيل.",
    },
  },
  {
    icon: "craft",
    title: { en: "Crafted to order", ar: "تصنيع حسب الطلب" },
    body: {
      en: "Once you sign off, our workshops build it by hand — your materials, your dimensions, made only for you.",
      ar: "بعد اعتمادك، تُصنّعه ورشنا يدويًا — بموادك وقياساتك، خصيصًا لك وحدك.",
    },
  },
  {
    icon: "delivery",
    title: { en: "Delivered & installed", ar: "توصيل وتركيب" },
    body: {
      en: "We deliver, place and install everything in your home — and you track every stage live until the keys are in your hand.",
      ar: "نوصّل ونركّب كل شيء في منزلك — وتتابع كل مرحلة مباشرةً حتى يصبح المفتاح في يدك.",
    },
  },
];

// split the title into balanced display lines for the masked line-reveal
function titleLines(text: string): string[] {
  const words = text.split(" ");
  if (words.length < 2) return [text];
  const cut = Math.ceil(words.length / 2);
  return [words.slice(0, cut).join(" "), words.slice(cut).join(" ")];
}

export default function Services() {
  const { t, lang } = useT();

  // cycle through the five photos every 1.5s
  const [shot, setShot] = useState(0);
  useEffect(() => {
    const id = setInterval(
      () => setShot((i) => (i + 1) % SVC_PHOTOS.length),
      1500
    );
    return () => clearInterval(id);
  }, []);

  return (
    <section className="svc" lang={lang}>
      <div className="container svc__grid">
        {/* MEDIA — real photography is the hero */}
        <div className="svc__media">
          <div
            className="svc__frame svc__slideshow"
            style={{ aspectRatio: "4 / 5", borderRadius: "var(--r, 3px)" }}
          >
            {SVC_PHOTOS.map((src, i) => (
              <img
                key={src}
                src={src}
                alt=""
                className="svc__slide"
                aria-hidden={i !== shot}
                style={{ opacity: i === shot ? 1 : 0 }}
              />
            ))}
          </div>
          <span className="svc__media-cap" aria-hidden>
            {lang === "en" ? "Made for living" : "صُنع للعيش"}
          </span>
        </div>

        {/* EDITORIAL — eyebrow, title, then the elegant service list */}
        <div className="svc__body">
          <div className="svc__kick">
            <span className="svc__rule" aria-hidden />
            <Rise as="span" className="eyebrow svc__eyebrow">
              {t("services_eyebrow")}
            </Rise>
          </div>

          <RevealLines
            lines={titleLines(t("services_title"))}
            className="display svc__title"
            delay={0.05}
          />

          <Rise delay={0.12} as="p" className="svc__lead">
            {lang === "en"
              ? "We're not just a furniture shop — we take the idea in your head all the way to a finished home. One studio, one team, every step under one roof."
              : "نحن لسنا مجرد متجر أثاث — نأخذ الفكرة من رأسك إلى منزل مكتمل. استوديو واحد، فريق واحد، وكل خطوة تحت سقف واحد."}
          </Rise>

          <Stagger className="svc__pipe" delay={0.15}>
            {PIPELINE.map((s, i) => (
              <StaggerItem key={i}>
                <div className="svc__step">
                  <span className="svc__node" aria-hidden>
                    <span className="svc__node-ico"><Icon name={s.icon} /></span>
                    {i < PIPELINE.length - 1 && <span className="svc__node-line" />}
                  </span>
                  <div className="svc__text">
                    <span className="svc__step-n">{lang === "en" ? `Step ${i + 1}` : `الخطوة ${i + 1}`}</span>
                    <h3 className="svc__item-title">{s.title[lang]}</h3>
                    <p className="svc__item-body">{s.body[lang]}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Rise delay={0.25} className="svc__cta">
            <Magnetic>
              <a href="/visit" className="btn svc__btn">
                {lang === "en" ? "Start your project" : "ابدأ مشروعك"}
                <span className="arrow" aria-hidden>↗</span>
              </a>
            </Magnetic>
          </Rise>
        </div>
      </div>

      <style>{`
        .svc {
          position: relative;
          padding-block: clamp(5rem, 11vw, 11rem);
          background: var(--bone);
          color: var(--ink);
          overflow: hidden;
        }
        /* warm light, never flat */
        .svc::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(60% 50% at 14% 8%, rgba(197,160,106,0.10), transparent 62%),
            radial-gradient(120% 90% at 50% 120%, rgba(54,65,47,0.06), transparent 60%);
        }
        .svc__grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: minmax(0, 0.92fr) minmax(0, 1fr);
          gap: clamp(2.5rem, 6vw, 6rem);
          align-items: center;
        }

        /* ---- media ---- */
        .svc__media { position: relative; }
        .svc__frame {
          width: 100%;
          box-shadow: 0 46px 90px -38px rgba(0,0,0,0.7);
        }
        .svc__slideshow {
          position: relative;
          overflow: hidden;
        }
        .svc__slide {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: opacity 0.8s var(--ease);
        }
        @media (prefers-reduced-motion: reduce) {
          .svc__slide { transition: none; }
        }
        .svc__media-cap {
          position: absolute;
          z-index: 2;
          bottom: 1.2rem;
          inset-inline-start: 1.2rem;
          font-size: 0.66rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--paper);
          padding: 0.5em 0.9em;
          border-radius: 100px;
          background: rgba(16,15,13,0.42);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          border: 1px solid rgba(251,247,240,0.16);
        }
        html[lang="ar"] .svc__media-cap { letter-spacing: 0; }

        /* ---- editorial ---- */
        .svc__body { max-width: 38rem; }
        .svc__kick { display: flex; align-items: center; gap: 1rem; }
        .svc__rule {
          display: block; width: 56px; height: 1px;
          background: var(--brass-2); flex-shrink: 0;
        }
        .svc__eyebrow { color: var(--brass); display: block; }
        .svc__title {
          color: var(--ink);
          font-size: clamp(2.1rem, 4.6vw, 4rem);
          line-height: 1.05;
          font-weight: 360;
          margin: 1.4rem 0 0;
        }

        .svc__lead {
          margin: 1.6rem 0 0;
          color: var(--ink-soft);
          font-size: clamp(1rem, 1.2vw, 1.12rem);
          line-height: 1.72;
          max-width: 46ch;
        }

        /* ---- one-stop pipeline ---- */
        .svc__pipe { margin: 2.4rem 0 0; }
        .svc__step {
          display: flex;
          gap: 1.25rem;
          align-items: flex-start;
          padding-bottom: 1.7rem;
        }
        .svc__node {
          position: relative;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          align-self: stretch;
        }
        .svc__node-ico {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 50px;
          height: 50px;
          border-radius: 999px;
          color: var(--brass);
          border: 1px solid rgba(169,130,76,0.34);
          background: rgba(169,130,76,0.06);
          transition: color 0.5s var(--ease), border-color 0.5s var(--ease), background 0.5s var(--ease), transform 0.5s var(--ease);
        }
        .svc__step:hover .svc__node-ico {
          color: var(--paper);
          border-color: var(--ever);
          background: var(--ever);
          transform: translateY(-2px);
        }
        .svc__node-line {
          flex: 1;
          width: 1.5px;
          margin-top: 6px;
          min-height: 18px;
          background: linear-gradient(var(--brass-2), rgba(169,130,76,0.18));
        }
        .svc__step-n {
          display: block;
          font-size: 0.64rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--brass);
          margin-bottom: 0.4rem;
        }
        html[lang="ar"] .svc__step-n { letter-spacing: 0.04em; }
        .svc__text { padding-top: 0.35rem; padding-bottom: 0.4rem; }
        .svc__item-title {
          font-family: var(--font-display);
          font-weight: 420;
          font-size: 1.3rem;
          line-height: 1.2;
          margin: 0 0 0.45rem;
          color: var(--ink);
        }
        .svc__item-body {
          margin: 0;
          color: var(--ink-soft);
          font-size: 0.95rem;
          line-height: 1.7;
          max-width: 44ch;
        }

        .svc__cta { margin: 2.6rem 0 0; display: block; }
        .svc__btn {
          background: var(--ink);
          color: var(--paper);
          border-color: var(--ink);
        }
        .svc__btn:hover {
          background: var(--ever);
          border-color: var(--ever);
          color: var(--paper);
          transform: translateY(-2px);
        }

        /* ---- responsive: stack, image on top ---- */
        @media (max-width: 880px) {
          .svc__grid {
            grid-template-columns: 1fr;
            gap: clamp(2rem, 8vw, 3rem);
            align-items: stretch;
          }
          .svc__media { order: -1; }
          .svc__frame { aspect-ratio: 16 / 11 !important; }
          .svc__body { max-width: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .svc__mark, .svc__item:hover .svc__mark { transition: none; }
        }
      `}</style>
    </section>
  );
}
