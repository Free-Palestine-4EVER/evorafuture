"use client";

import { useRef } from "react";
import { useT } from "@/lib/i18n";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { Rise, RevealLines } from "@/components/motion";

const EASE = [0.22, 1, 0.36, 1] as const;

type Bi = { en: string; ar: string };

// ── The five cinematic "worlds" — each a full-bleed room film that
//    unmasks + parallaxes as it scrolls through the viewport.
//    Drop the generated videos at the `video` path (poster shows until then).
type World = {
  id: string;
  num: string;
  name: Bi;
  count: Bi;
  blurb: Bi;
  video: string;
  poster: string;
};

const worlds: World[] = [
  {
    id: "living",
    num: "01",
    name: { en: "The Living Room", ar: "غرفة المعيشة" },
    count: { en: "31 pieces", ar: "٣١ قطعة" },
    blurb: {
      en: "Where the day softens — sculpted sofas, brass light, the long evening.",
      ar: "حيث يهدأ النهار — كنب منحوت، إضاءة نحاسية، أمسية طويلة.",
    },
    video: "/evora/room-living.mp4",
    poster: "/evora/p06.jpg",
  },
  {
    id: "bedrooms",
    num: "02",
    name: { en: "The Bedroom", ar: "غرفة النوم" },
    count: { en: "42 pieces", ar: "٤٢ قطعة" },
    blurb: {
      en: "Linen, oak and quiet — a room that lowers your shoulders.",
      ar: "كتان وبلوط وسكون — غرفة تُرخي كتفيك.",
    },
    video: "/evora/room-bedrooms.mp4",
    poster: "/evora/c-bedrooms.jpg",
  },
  {
    id: "dining",
    num: "03",
    name: { en: "The Dining Hall", ar: "غرفة الطعام" },
    count: { en: "36 pieces", ar: "٣٦ قطعة" },
    blurb: {
      en: "The table you gather around — long, warm, made for a full house.",
      ar: "الطاولة التي تجمعكم — طويلة، دافئة، لبيت عامر.",
    },
    video: "/evora/room-dining.mp4",
    poster: "/evora/p03.jpg",
  },
  {
    id: "sofas",
    num: "04",
    name: { en: "The Lounge", ar: "صالة الجلوس" },
    count: { en: "28 sets", ar: "٢٨ طقم" },
    blurb: {
      en: "Deep seats, velvet and curve — sofa sets built to be lived in.",
      ar: "مقاعد عميقة ومخمل وانحناء — أطقم كنب لتُعاش.",
    },
    video: "/evora/room-sofas.mp4",
    poster: "/evora/p08.jpg",
  },
  {
    id: "garden",
    num: "05",
    name: { en: "Evora Garden", ar: "حديقة إيفورا" },
    count: { en: "Outdoor", ar: "مساحات خارجية" },
    blurb: {
      en: "Beyond the glass — terraces, teak and the open Amman sky.",
      ar: "خلف الزجاج — شُرفات وخشب التيك وسماء عمّان المفتوحة.",
    },
    video: "/evora/room-garden.mp4",
    poster: "/evora/p05.jpg",
  },
];

// ── "The rest" — smaller categories as slide-in photo cards.
//    Swap each `img` for the generated amazing photo at the same path.
type RoomCard = { id: string; name: Bi; count: Bi; img: string };

const cards: RoomCard[] = [
  { id: "accessories", name: { en: "Accessories", ar: "إكسسوارات" }, count: { en: "90+ pieces", ar: "+٩٠ قطعة" }, img: "/evora/p11.jpg" },
  { id: "lighting",    name: { en: "Lighting",     ar: "إضاءة" },      count: { en: "45+ pieces", ar: "+٤٥ قطعة" }, img: "/evora/p10.jpg" },
  { id: "rugs",        name: { en: "Rugs & Textiles", ar: "سجاد ومنسوجات" }, count: { en: "60+ pieces", ar: "+٦٠ قطعة" }, img: "/evora/p09.jpg" },
  { id: "storage",     name: { en: "Wardrobes & Storage", ar: "خزائن وتخزين" }, count: { en: "Built-in", ar: "حسب القياس" }, img: "/evora/p02.jpg" },
  { id: "tables",      name: { en: "Coffee & Side Tables", ar: "طاولات قهوة وجانبية" }, count: { en: "30 pieces", ar: "٣٠ قطعة" }, img: "/evora/p04.jpg" },
  { id: "seating",     name: { en: "Armchairs & Seating", ar: "كراسي ومقاعد" }, count: { en: "24 pieces", ar: "٢٤ قطعة" }, img: "/evora/ig-chesterfield.jpg" },
];

function WorldPanel({ world, i }: { world: World; i: number }) {
  const { lang } = useT();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // film drifts slower than the frame = parallax depth
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.12, 1.0, 1.08]);
  // unmask: the panel opens like a shutter as it enters
  const clip = useTransform(
    scrollYProgress,
    [0, 0.32],
    ["inset(14% 8% 14% 8% round 6px)", "inset(0% 0% 0% 0% round 6px)"]
  );
  const capY = useTransform(scrollYProgress, [0.1, 0.45], [60, 0]);
  const capO = useTransform(scrollYProgress, [0.1, 0.45], [0, 1]);

  return (
    <a
      ref={ref}
      href="/shop"
      className="world"
      data-cursor="hover"
      lang={lang}
    >
      <motion.div
        className="world__frame"
        style={reduce ? undefined : { clipPath: clip }}
      >
        <motion.div className="world__media" style={reduce ? undefined : { y, scale }}>
          <video
            className="world__video"
            poster={world.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
          >
            <source src={world.video} type="video/mp4" />
          </video>
          <span className="world__scrim" />
          <span className="world__grain" aria-hidden />
        </motion.div>

        <span className="world__num display">{world.num}</span>

        <motion.div
          className="world__cap"
          style={reduce ? undefined : { y: capY, opacity: capO }}
        >
          <span className="world__count">{world.count[lang]}</span>
          <span className="world__name display">{world.name[lang]}</span>
          <span className="world__blurb">{world.blurb[lang]}</span>
          <span className="world__cta">
            {lang === "en" ? "Step inside" : "ادخل"}
            <span className="world__arrow" aria-hidden>↗</span>
          </span>
        </motion.div>
      </motion.div>
    </a>
  );
}

function SlideCard({ card, i }: { card: RoomCard; i: number }) {
  const { lang } = useT();
  const fromLeft = i % 2 === 0;
  return (
    <motion.a
      href="/shop"
      className="rcard"
      data-cursor="hover"
      initial={{ opacity: 0, x: fromLeft ? -64 : 64, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -14% 0px" }}
      transition={{ duration: 0.9, ease: EASE, delay: (i % 3) * 0.06 }}
    >
      <div className="rcard__imgwrap">
        <img src={card.img} alt={card.name[lang]} className="rcard__img" loading="lazy" />
        <span className="rcard__scrim" />
      </div>
      <div className="rcard__meta">
        <div>
          <span className="rcard__count">{card.count[lang]}</span>
          <span className="rcard__name display">{card.name[lang]}</span>
        </div>
        <span className="rcard__arrow" aria-hidden>↗</span>
      </div>
    </motion.a>
  );
}

export default function Collections() {
  const { lang } = useT();
  const en = lang === "en";

  return (
    <section id="collections" className="rooms" lang={lang}>
      <div className="container rooms__head">
        <div className="rooms__kick">
          <motion.span
            className="rooms__rule"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "0px 0px -12% 0px" }}
            transition={{ duration: 0.9, ease: EASE }}
          />
          <Rise as="span" className="eyebrow rooms__eyebrow">
            {en ? "Explore by room" : "استكشف حسب الغرفة"}
          </Rise>
        </div>
        <RevealLines
          lines={en ? ["Six worlds,", "one address."] : ["ستة عوالم،", "عنوان واحد."]}
          className="display rooms__title"
          delay={0.06}
        />
        <Rise delay={0.12} as="p" className="rooms__sub">
          {en
            ? "Step through five rooms of Evora — then everything else that finishes the home."
            : "تنقّل بين خمس غرف من إيفورا — ثم كل ما يكمّل البيت."}
        </Rise>
      </div>

      {/* five cinematic room films */}
      <div className="rooms__worlds">
        {worlds.map((w, i) => (
          <WorldPanel key={w.id} world={w} i={i} />
        ))}
      </div>

      {/* the rest — slide-in photo cards */}
      <div className="container rooms__resthead">
        <Rise as="span" className="eyebrow rooms__resteyebrow">
          {en ? "And everything else" : "وكل ما عداها"}
        </Rise>
        <Rise delay={0.08} as="h3" className="display rooms__resttitle">
          {en ? "The finishing pieces" : "قطع اللمسة الأخيرة"}
        </Rise>
      </div>

      <div className="container rooms__grid">
        {cards.map((c, i) => (
          <SlideCard key={c.id} card={c} i={i} />
        ))}
        <a href="/shop" className="rcard rcard--cta" data-cursor="hover">
          <span className="rcard__ctak">{en ? "Everything" : "كل القطع"}</span>
          <span className="rcard__ctat display">
            {en ? "View the full catalogue" : "تصفّح الكتالوج كاملًا"}
          </span>
          <span className="rcard__ctaarrow" aria-hidden>→</span>
        </a>
      </div>

      <style>{`
        .rooms { position: relative; background: var(--paper); padding-block: clamp(3rem, 7vw, 6rem) clamp(4rem, 9vw, 8rem); }

        .rooms__head { margin-bottom: clamp(2rem, 4vw, 3.4rem); }
        .rooms__kick { display: flex; align-items: center; gap: 1rem; }
        .rooms__rule { display: block; width: 64px; height: 1px; background: var(--brass); transform-origin: left; flex-shrink: 0; }
        html[dir="rtl"] .rooms__rule { transform-origin: right; }
        .rooms__eyebrow { color: var(--brass); display: block; }
        .rooms__title { font-size: clamp(2.4rem, 6vw, 5rem); line-height: 1; margin: 1rem 0 0; }
        .rooms__sub { color: var(--ink-soft); max-width: 46ch; margin: 1rem 0 0; font-size: 0.98rem; }

        /* ── cinematic worlds ── */
        .rooms__worlds { display: flex; flex-direction: column; gap: clamp(1rem, 2.2vw, 2rem); padding-inline: var(--gut); margin-top: clamp(1.5rem, 3vw, 2.5rem); }
        .world { position: relative; display: block; }
        .world__frame {
          position: relative; overflow: hidden; border-radius: 6px;
          height: clamp(340px, 72vh, 760px); will-change: clip-path;
        }
        .world__media { position: absolute; inset: -1px; will-change: transform; }
        .world__video { width: 100%; height: 100%; object-fit: cover; display: block; }
        .world__scrim {
          position: absolute; inset: 0;
          background:
            linear-gradient(180deg, rgba(16,15,13,0.18) 0%, transparent 30%, transparent 50%, rgba(16,15,13,0.72) 100%),
            linear-gradient(90deg, rgba(16,15,13,0.42) 0%, transparent 46%);
        }
        html[dir="rtl"] .world__scrim {
          background:
            linear-gradient(180deg, rgba(16,15,13,0.18) 0%, transparent 30%, transparent 50%, rgba(16,15,13,0.72) 100%),
            linear-gradient(270deg, rgba(16,15,13,0.42) 0%, transparent 46%);
        }
        .world__grain { position: absolute; inset: 0; opacity: 0.05; mix-blend-mode: overlay;
          background-image: radial-gradient(rgba(255,255,255,0.7) 0.5px, transparent 0.6px);
          background-size: 3px 3px; pointer-events: none; }
        .world__num {
          position: absolute; top: clamp(1rem, 2vw, 1.8rem); inset-inline-end: clamp(1.2rem, 2.4vw, 2.2rem);
          color: rgba(251,247,240,0.5); font-size: clamp(2rem, 5vw, 4.2rem); line-height: 1; letter-spacing: 0.02em;
        }
        .world__cap {
          position: absolute; inset-inline-start: clamp(1.4rem, 4vw, 3.4rem); bottom: clamp(1.4rem, 3.5vw, 3rem);
          max-width: 30ch; color: var(--paper); display: flex; flex-direction: column; gap: 0.5rem;
        }
        .world__count { font-size: 0.66rem; letter-spacing: 0.22em; text-transform: uppercase; color: var(--brass-2); }
        html[dir="rtl"] .world__count { letter-spacing: 0.08em; }
        .world__name { font-size: clamp(2rem, 5vw, 4rem); line-height: 0.98; }
        .world__blurb { font-size: clamp(0.92rem, 1.4vw, 1.08rem); color: rgba(251,247,240,0.82); max-width: 34ch; margin-top: 0.2rem; }
        .world__cta { display: inline-flex; align-items: center; gap: 0.5rem; margin-top: 0.7rem;
          font-size: 0.8rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--paper);
          border-bottom: 1px solid rgba(251,247,240,0.4); padding-bottom: 3px; width: fit-content; }
        .world__arrow { color: var(--brass-2); font-size: 1rem; transition: transform .5s var(--ease); }
        html[dir="rtl"] .world__arrow { transform: scaleX(-1); }
        .world:hover .world__arrow { transform: translate(3px, -3px); }
        html[dir="rtl"] .world:hover .world__arrow { transform: translate(-3px, -3px) scaleX(-1); }

        /* ── the rest: header ── */
        .rooms__resthead { margin-top: clamp(3.5rem, 7vw, 6rem); margin-bottom: clamp(1.6rem, 3vw, 2.6rem); }
        .rooms__resteyebrow { color: var(--brass); display: block; }
        .rooms__resttitle { font-size: clamp(1.7rem, 3.6vw, 2.8rem); margin-top: 0.5rem; line-height: 1.04; }

        /* ── slide-in cards ── */
        .rooms__grid {
          display: grid; gap: clamp(14px, 1.6vw, 24px);
          grid-template-columns: repeat(4, 1fr);
        }
        .rcard { position: relative; display: flex; flex-direction: column; border-radius: 4px; overflow: hidden; will-change: transform, opacity; }
        .rcard__imgwrap { position: relative; aspect-ratio: 3 / 4; overflow: hidden; }
        .rcard__img { width: 100%; height: 100%; object-fit: cover; transform: scale(1.04);
          transition: transform 1.1s var(--ease); filter: saturate(0.98); }
        .rcard:hover .rcard__img { transform: scale(1.11); }
        .rcard__scrim { position: absolute; inset: 0; background: linear-gradient(180deg, transparent 44%, rgba(16,15,13,0.7) 100%); }
        .rcard__meta { position: absolute; inset-inline: 0; bottom: 0; padding: 1rem 1.1rem;
          display: flex; align-items: flex-end; justify-content: space-between; gap: 0.8rem; }
        .rcard__count { display: block; font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(251,247,240,0.78); margin-bottom: 5px; }
        html[dir="rtl"] .rcard__count { letter-spacing: 0.06em; }
        .rcard__name { font-size: clamp(1.05rem, 1.5vw, 1.4rem); color: var(--paper); line-height: 1.05; }
        .rcard__arrow { color: var(--paper); font-size: 1rem; opacity: 0; transition: opacity .5s var(--ease), transform .5s var(--ease); }
        .rcard:hover .rcard__arrow { opacity: 1; transform: translateY(-3px); }
        html[dir="rtl"] .rcard__arrow { transform: scaleX(-1); }

        .rcard--cta { justify-content: center; align-items: flex-start; gap: 0.8rem;
          padding: 1.8rem clamp(1.2rem, 1.8vw, 1.8rem); background: var(--ever); color: var(--paper); }
        .rcard__ctak { font-size: 0.64rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--brass-2); }
        .rcard__ctat { font-size: clamp(1.3rem, 1.9vw, 1.7rem); color: var(--paper); line-height: 1.08; }
        .rcard__ctaarrow { font-size: 1.4rem; color: var(--brass-2); transition: transform .5s var(--ease); }
        .rcard--cta:hover .rcard__ctaarrow { transform: translateX(6px); }
        html[dir="rtl"] .rcard__ctaarrow { transform: scaleX(-1); }

        @media (max-width: 900px) {
          .rooms__grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 520px) {
          .rooms__grid { grid-template-columns: 1fr; }
          .world__frame { height: clamp(320px, 64vh, 520px); }
        }
      `}</style>
    </section>
  );
}
