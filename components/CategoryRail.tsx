"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useT } from "@/lib/i18n";
import { categories } from "@/lib/data";
import { normalizeSlug } from "@/lib/shopTaxonomy";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { Rise, RevealLines } from "@/components/motion";
import ResponsiveVideo from "@/components/ResponsiveVideo";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ============================================================
   The rail pins the section and pans the row sideways as the page
   scrolls down. Three things about that were wrong and are fixed here:

   1. IT NEVER RAN ON A PHONE. The pan was gated behind
      `matchMedia("(min-width: 880px)")`, so every touch visitor got a
      static strip they had to notice and swipe by hand — cards 03+ sat
      off-screen with nothing to say they were there. There is nothing
      about the pan that needs a mouse: it is layout and a transform.
   2. IT NEVER RAN UNDER prefers-reduced-motion. Same trap the hero was
      rewritten for (see HeroScroll.tsx): Chrome's Battery/Energy Saver
      forces `prefers-reduced-motion: reduce` whatever the visitor
      actually chose, so that branch is a large slice of ordinary
      laptops, not a rare one. A scroll-linked pan is not autoplaying
      motion — it only moves when the visitor themselves moves. Reduced
      motion is honoured by dropping the SPRING (the easing/drift), not
      the position, so the cards track the scroll exactly.
   3. IT PANNED THE WRONG WAY IN ARABIC. `dir="rtl"` lays the track out
      from the right edge and overflows to the LEFT, so translating by
      -distance drove every card clean off the screen: the Arabic rail
      went completely blank halfway through the section.

   Reachability is never left to the pan. Until the track has been
   measured — and for anyone running without JS — the rail renders as a
   natively scrollable, snap-aligned strip, so the cards are always
   reachable by hand even if nothing here ever runs.
   ============================================================ */

// Vertical scroll traded for horizontal travel: the rail moves PACE px
// sideways per 1px the page moves down. 1.5 is the pace the desktop rail
// has always run at (a 320vh section against ~3000px of track); keeping it
// as a RATIO rather than a vh number is what lets the phone — whose track
// and viewport are both far narrower — run at the same feel.
const PACE = 1.5;

export default function CategoryRail() {
  const { t, lang } = useT();
  const en = lang === "en";
  const rtl = lang === "ar";
  const reduce = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [pin, setPin] = useState(false);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      const stage = stageRef.current;
      if (!track || !stage) return;
      // The track is `width: max-content`, so its own border box IS the full
      // row. Measured against the STAGE, not window.innerWidth: once pinned
      // the viewport div grows to the track, but the stage stays the width of
      // the window minus any classic scrollbar.
      const trackW = Math.ceil(track.getBoundingClientRect().width);
      const stageW = stage.clientWidth;
      if (trackW <= 0 || stageW <= 0) return; // not laid out — stay on the strip
      setDistance(Math.max(0, trackW - stageW));
      // Latch: once there is real travel the rail stays pinned. Un-pinning on
      // a later measurement would swap the card widths back (the pinned layout
      // uses different ones), change the measured distance, and leave the two
      // states flipping each other forever.
      if (trackW - stageW > 24) setPin(true);
    };
    measure();
    // The pinned layout changes the card widths, so the first measurement —
    // taken while the strip is still rendered — is not the one that counts.
    // Observing the track re-measures the moment the pinned CSS lands, which
    // is also what fixed the rail over-panning past its own last card.
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    if (stageRef.current) ro.observe(stageRef.current);
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef });
  const xRaw = useTransform(scrollYProgress, [0.05, 0.95], [0, rtl ? distance : -distance]);
  const xSpring = useSpring(xRaw, { stiffness: 90, damping: 30, mass: 0.5 });
  // Reduced motion keeps the pan and drops the spring: the row sits exactly
  // where the scroll puts it instead of easing toward it.
  const x = reduce ? xRaw : xSpring;
  // subtle progress bar for the rail
  const barScale = useTransform(scrollYProgress, [0.05, 0.95], [0.04, 1]);

  const Cards = (
    <div ref={trackRef} className="crail__track">
      {/* lead feature — the framed showroom film */}
      <a href="/showroom" className="crail__card crail__feature" data-cursor="hover">
        <div className="crail__imgwrap crail__feature-media">
          <ResponsiveVideo
            className="crail__video"
            src="/evora/hero-c.mp4"
            preload="metadata"
          />
          <span className="crail__scrim" />
          <span className="crail__feature-badge">{t("col_film_badge")}</span>
          <div className="crail__feature-cap">
            <span className="crail__feature-t display">
              {t("col_film_caption")}
            </span>
            <span className="crail__feature-arrow" aria-hidden>↗</span>
          </div>
        </div>
      </a>

      {categories.map((c, i) => (
        <a key={c.id} href={`/shop/${normalizeSlug(c.id)}`} className="crail__card" data-cursor="hover">
          <div className="crail__imgwrap">
            <img src={c.img} alt={c.name[lang]} className="crail__img" loading="lazy" />
            <span className="crail__scrim" />
            <span className="crail__index">{String(i + 1).padStart(2, "0")}</span>
          </div>
          <div className="crail__meta">
            <div>
              <span className="crail__count">{c.count[lang]}</span>
              <span className="crail__name display">{c.name[lang]}</span>
            </div>
            <span className="crail__arrow" aria-hidden>↗</span>
          </div>
        </a>
      ))}

      {/* tail CTA card */}
      <a href="/shop" className="crail__card crail__card--cta" data-cursor="hover">
        <span className="crail__cta-k">{en ? "Everything" : "كل القطع"}</span>
        <span className="crail__cta-t display">
          {en ? "View the full catalogue" : "تصفّح الكتالوج كاملًا"}
        </span>
        <span className="crail__cta-arrow" aria-hidden>→</span>
      </a>
    </div>
  );

  return (
    <section
      ref={sectionRef}
      id="categories"
      className={pin ? "crail crail--pin" : "crail"}
      // How much page the pin is allowed to eat, derived from the row that has
      // to get past rather than a fixed 320vh — which is what let the phone,
      // with a much narrower viewport, be pinned for the right length.
      style={pin ? ({ "--crail-travel": `${Math.round(distance / PACE)}px` } as CSSProperties) : undefined}
      lang={lang}
    >
      <div ref={stageRef} className={pin ? "crail__stage crail__stage--pin" : "crail__stage"}>
        <div className="container crail__head">
          <div className="crail__kick">
            <motion.span
              className="crail__rule"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "0px 0px -12% 0px" }}
              transition={{ duration: 0.9, ease: EASE }}
            />
            <Rise as="span" className="eyebrow crail__eyebrow">
              {en ? "Shop by category" : "تسوّق حسب الفئة"}
            </Rise>
          </div>
          <RevealLines
            lines={en ? ["Every piece,", "every room."] : ["كل قطعة،", "لكل غرفة."]}
            className="display crail__title"
            delay={0.06}
          />
          <Rise delay={0.12} as="p" className="crail__sub">
            {en
              ? "Ten worlds of furniture under one roof — slide through and step inside."
              : "عشرة عوالم من الأثاث تحت سقف واحد — مرّر وادخل."}
          </Rise>
        </div>

        {/* the rail */}
        {pin ? (
          <motion.div className="crail__viewport" style={{ x }}>
            {Cards}
          </motion.div>
        ) : (
          <div className="crail__viewport crail__viewport--swipe">{Cards}</div>
        )}

        {pin && (
          <div className="container crail__progress">
            <motion.span className="crail__progressbar" style={{ scaleX: barScale }} />
          </div>
        )}
      </div>

      <style>{`
        .crail { position: relative; background: var(--paper); }
        /* One screen to stand in, plus however much page the row needs to get
           past. The vh line is the fallback; svh wins where it is supported and
           is what keeps the maths still on a phone, whose vh changes as the
           browser chrome hides and reappears mid-scroll. */
        .crail--pin {
          height: calc(100vh + var(--crail-travel, 0px));
          height: calc(100svh + var(--crail-travel, 0px));
        }
        .crail__stage { position: relative; padding-block: clamp(4rem, 9vw, 8rem); }
        .crail__stage--pin {
          position: sticky; top: 0; height: 100vh; height: 100svh;
          display: grid; grid-template-rows: auto minmax(0, 1fr) auto;
          align-content: center; gap: clamp(1rem, 2.4vh, 2rem);
          padding-block: clamp(1.4rem, 4vh, 2.8rem); overflow: hidden;
        }
        /* pinned: cards fill the middle row so nothing clips on short screens */
        .crail__stage--pin .crail__viewport { height: 100%; min-height: 0; display: flex; align-items: stretch; }
        .crail__stage--pin .crail__track { height: 100%; align-items: stretch; }
        .crail__stage--pin .crail__card { height: 100%; width: clamp(228px, 23vw, 320px); }
        .crail__stage--pin .crail__imgwrap { flex: 1 1 auto; min-height: 0; aspect-ratio: auto; }
        .crail__stage--pin .crail__meta { flex: 0 0 auto; }
        .crail__stage--pin .crail__feature { width: clamp(360px, 38vw, 640px); }
        /* keep the pinned header compact so the rail keeps its height */
        .crail__stage--pin .crail__head { margin-bottom: 0; }
        .crail__stage--pin .crail__title { font-size: clamp(1.9rem, 3.6vw, 3.2rem); margin-top: 0.7rem; }
        .crail__stage--pin .crail__sub { margin-top: 0.6rem; }
        @media (max-height: 840px) {
          .crail__stage--pin .crail__sub { display: none; }
        }

        .crail__head { margin-bottom: clamp(2rem, 4vw, 3.4rem); }
        .crail__kick { display: flex; align-items: center; gap: 1rem; }
        .crail__rule { display: block; width: 64px; height: 1px; background: var(--brass); transform-origin: left; flex-shrink: 0; }
        html[dir="rtl"] .crail__rule { transform-origin: right; }
        .crail__eyebrow { color: var(--brass); display: block; }
        .crail__title { font-size: clamp(2.4rem, 6vw, 5rem); line-height: 1.0; margin: 1rem 0 0; }
        .crail__sub { color: var(--ink-soft); max-width: 42ch; margin: 1rem 0 0; font-size: 0.98rem; }

        /* viewport + track */
        .crail__viewport { will-change: transform; }
        .crail__track {
          display: flex; gap: clamp(14px, 1.4vw, 22px);
          padding-inline: var(--gut);
          width: max-content;
        }
        .crail__viewport--swipe {
          overflow-x: auto; overflow-y: hidden;
          -webkit-overflow-scrolling: touch;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
        }
        .crail__viewport--swipe::-webkit-scrollbar { display: none; }
        .crail__viewport--swipe .crail__card { scroll-snap-align: start; }

        .crail__card {
          position: relative; flex: 0 0 auto;
          width: clamp(248px, 26vw, 360px);
          display: flex; flex-direction: column;
        }
        .crail__imgwrap {
          position: relative; overflow: hidden; border-radius: 4px;
          aspect-ratio: 3 / 4;
        }
        .crail__img {
          width: 100%; height: 100%; object-fit: cover;
          transform: scale(1.03);
          transition: transform 1.1s var(--ease), filter 1.1s var(--ease);
          filter: saturate(0.98);
        }
        .crail__card:hover .crail__img { transform: scale(1.1); }
        .crail__scrim {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, transparent 45%, rgba(16,15,13,0.5) 100%);
        }
        .crail__index {
          position: absolute; top: 0.9rem; inset-inline-start: 1rem;
          font-family: var(--font-display); font-size: 0.8rem;
          color: var(--paper); opacity: 0.85; letter-spacing: 0.1em;
        }
        .crail__meta {
          display: flex; align-items: flex-end; justify-content: space-between; gap: 1rem;
          padding: 1rem 0.2rem 0;
        }
        .crail__count {
          display: block; font-size: 0.66rem; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--ink-faint); margin-bottom: 5px;
        }
        html[dir="rtl"] .crail__count { letter-spacing: 0.06em; }
        .crail__name { font-size: clamp(1.25rem, 1.8vw, 1.6rem); color: var(--ink); line-height: 1.05; }
        .crail__arrow { color: var(--brass); font-size: 1.1rem; transition: transform .5s var(--ease); }
        .crail__card:hover .crail__arrow { transform: translate(3px, -3px); }
        html[dir="rtl"] .crail__arrow { transform: scaleX(-1); }
        html[dir="rtl"] .crail__card:hover .crail__arrow { transform: translate(-3px, -3px) scaleX(-1); }

        /* tail CTA card */
        .crail__card--cta {
          justify-content: center; align-items: flex-start; gap: 0.8rem;
          width: clamp(240px, 22vw, 320px);
          padding: 2rem clamp(1.4rem, 2vw, 2rem);
          border-radius: 4px;
          background: var(--ever);
          color: var(--paper);
          aspect-ratio: auto;
        }
        .crail__cta-k { font-size: 0.66rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--brass-2); }
        .crail__cta-t { font-size: clamp(1.5rem, 2.2vw, 2rem); color: var(--paper); line-height: 1.08; }
        .crail__cta-arrow { font-size: 1.4rem; color: var(--brass-2); transition: transform .5s var(--ease); }
        .crail__card--cta:hover .crail__cta-arrow { transform: translateX(6px); }
        html[dir="rtl"] .crail__cta-arrow { transform: scaleX(-1); }

        /* progress */
        .crail__progress { margin-top: clamp(1.6rem, 3vw, 2.6rem); }
        .crail__progressbar {
          display: block; height: 2px; width: 100%;
          background: var(--ink); transform-origin: left; border-radius: 2px;
        }
        html[dir="rtl"] .crail__progressbar { transform-origin: right; }

        /* lead feature — framed showroom film */
        .crail__feature-media { aspect-ratio: 4 / 5; }
        .crail__video { width: 100%; height: 100%; object-fit: cover; display: block; }
        .crail__feature-badge {
          position: absolute; top: 0.9rem; inset-inline-start: 1rem; z-index: 2;
          background: rgba(251,247,240,0.92); color: var(--ink);
          font-family: var(--font-sans); font-size: 0.6rem; letter-spacing: 0.18em;
          text-transform: uppercase; padding: 0.4em 0.75em; border-radius: 100px;
        }
        .crail__feature-cap {
          position: absolute; inset-inline: 1.1rem; bottom: 1rem; z-index: 2;
          display: flex; align-items: flex-end; justify-content: space-between; gap: 1rem;
          color: var(--paper);
        }
        .crail__feature-t { font-size: clamp(1.1rem, 1.7vw, 1.5rem); line-height: 1.2; max-width: 22ch; }
        .crail__feature-arrow { color: var(--brass-2); font-size: 1.3rem; transition: transform .5s var(--ease); }
        .crail__feature:hover .crail__feature-arrow { transform: translate(3px, -3px); }
        html[dir="rtl"] .crail__feature-arrow { transform: scaleX(-1); }

        @media (max-width: 880px) {
          .crail__viewport--swipe { padding-bottom: 0.5rem; }
          .crail__card { width: clamp(220px, 72vw, 300px); }
          .crail__feature { width: clamp(280px, 84vw, 420px); }
          .crail__track { padding-inline: var(--gut); }

          /* Pinned on a phone: the head has to give the row its height back,
             and the cards have to be narrow enough that more than one is on
             screen — at the desktop widths a single card filled the display and
             the pan read as a slideshow. */
          .crail__stage--pin { gap: clamp(0.8rem, 2vh, 1.4rem); padding-block: clamp(1rem, 3vh, 2rem); }
          .crail__stage--pin .crail__title { font-size: clamp(1.7rem, 7.4vw, 2.4rem); }
          .crail__stage--pin .crail__kick { gap: 0.7rem; }
          .crail__stage--pin .crail__rule { width: 36px; }
          .crail__stage--pin .crail__card { width: clamp(196px, 56vw, 260px); }
          .crail__stage--pin .crail__feature { width: clamp(232px, 68vw, 320px); }
          .crail__stage--pin .crail__progress { margin-top: clamp(0.9rem, 2vh, 1.6rem); }
        }
      `}</style>
    </section>
  );
}
