"use client";

import { useEffect, useState } from "react";
import { useT } from "@/lib/i18n";
import Reveal from "@/components/Reveal";
import { resolveFrameExt, SAFE_FRAME_EXT, type FrameExt } from "@/lib/frameFormat";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

// Calacatta-marble kitchen, generated for this section and supplied by the
// client. Source was already ~4:3 (1200x896), so it resizes to 1600x1200 with
// no meaningful crop: 77KB avif / 94KB webp.
// NOTE the versioned filename. This path has now served three different
// pictures; browsers AND the site's service worker both cache aggressively by
// URL, so a content change at a stable filename ships the OLD image to anyone
// who has visited before. Always mint a new name when the picture changes.
const STILL_BASE = "/evora/kitchen-teaser-marble";

// Page-local strings (the DesignRequest.tsx pattern). The heading and lead are
// now local rather than the shared cfg_* keys: those keys still belong to
// ConfiguratorScroll on /kitchen, where "choose your stone" is literally what
// the visitor is about to do. Here it was just repeating "stone" three times
// over a photo of a finished kitchen. Editing the shared keys would have
// changed /kitchen too, so the teaser gets its own voice instead.
// Every claim below is already made elsewhere on the site: built to order in
// Evora's own workshop in Amman, and approved as a photoreal 3D render before
// anything is cut.
const T = {
  cta: { en: "Step into the kitchen", ar: "ادخل تجربة المطبخ" },
  badge: { en: "Bespoke · made in Amman", ar: "حسب الطلب · صُنع في عمّان" },
  heading: { en: "A kitchen made to measure.", ar: "مطبخٌ على مقاسك." },
  lead: {
    en: "Built to order in our own workshop — the marble, the finish, the proportions, all yours to decide. See the whole room in 3D before a single cut is made.",
    ar: "يُصنع خصيصًا في ورشتنا — الرخام والتشطيب والمقاسات، كلّها بقرارك. شاهد الغرفة كاملة بالأبعاد الثلاثية قبل أن يُقطع أي شيء.",
  },
};

export default function KitchenTeaser() {
  const { t, lang, dir } = useT();
  const en = lang === "en";
  const [ext, setExt] = useState<FrameExt>(SAFE_FRAME_EXT);

  useEffect(() => {
    let alive = true;
    resolveFrameExt().then((e) => {
      if (alive) setExt(e);
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section id="kitchen-teaser" className="ktz" lang={lang} dir={dir}>
      {/* deliberately NOT inside .container — .container caps at 1480px and adds
          auto side margins, which is what kept turning this into a floating card
          in a field of white instead of a full-bleed screen */}
      <div className="ktz__grid">
        <Reveal className="ktz__frame" delay={0}>
          <a href="/kitchen" className="ktz__framelink" data-cursor="hover" aria-label={t("cfg_aria")}>
            <picture>
              <source srcSet={`${STILL_BASE}.avif`} type="image/avif" />
              <img
                src={ext === "avif" ? `${STILL_BASE}.avif` : `${STILL_BASE}.webp`}
                onError={(e) => {
                  const img = e.currentTarget;
                  if (!img.src.endsWith(".webp")) img.src = `${STILL_BASE}.webp`;
                }}
                alt={t("cfg_aria")}
                className="ktz__img"
                loading="lazy"
              />
            </picture>
            <span className="ktz__scrim" />
            <span className="ktz__badge">{en ? T.badge.en : T.badge.ar}</span>
            <span className="ktz__playhint" aria-hidden>
              <span className="ktz__playarrow">↗</span>
            </span>
          </a>
        </Reveal>

        <Reveal className="ktz__copy" delay={0.08}>
          <span className="eyebrow ktz__eyebrow">{t("cfg_eyebrow")}</span>
          <h2 className="display ktz__heading">{en ? T.heading.en : T.heading.ar}</h2>
          <p className="ktz__lead">{en ? T.lead.en : T.lead.ar}</p>
          <a href="/kitchen" className="btn btn-solid ktz__cta">
            {en ? T.cta.en : T.cta.ar} <span className="arrow">→</span>
          </a>
        </Reveal>
      </div>

      <style>{`
        /* A true full-bleed screen: exactly one viewport tall, no container, no
           side gutters, no padding — the photo runs off the left edge and meets
           the copy panel flush down the middle seam. 100svh (not 100vh) so it
           doesn't jump as mobile browser chrome shows and hides mid-scroll.
           overflow:hidden contains the Reveal wrapper's entrance translate. */
        .ktz {
          position: relative;
          height: 100svh;
          min-height: 100svh;
          overflow: hidden;
          /* dark panel — the warm walnut/marble photograph reads far richer
             against ink than against paper, and it gives the homepage a break
             from an otherwise unbroken run of light sections */
          background: #0d0b09;
        }
        /* The photo column is sized by its own 4:3 ratio at full section height,
           and the copy takes whatever is left — which makes the copy column
           narrower than the old 0.94fr split, as asked. */
        .ktz__grid {
          width: 100%; height: 100%;
          display: grid; grid-template-columns: auto 1fr;
          gap: 0; align-items: stretch;
        }
        [dir="rtl"] .ktz__grid { direction: rtl; }

        /* photo — a true 4:3 block running the full height of the screen and
           bleeding off the leading edge. max-width stops it crowding the copy
           out on short/wide windows, where 4:3 of 100svh gets very wide. */
        .ktz__frame {
          position: relative; height: 100%; min-height: 0;
          aspect-ratio: 4 / 3; max-width: 64vw;
        }
        .ktz__framelink {
          position: relative; display: block; height: 100%; width: 100%;
          overflow: hidden; border-radius: 0;
        }
        .ktz__img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          transform: scale(1.02); transition: transform 1.2s ${EASE};
        }
        .ktz__framelink:hover .ktz__img { transform: scale(1.06); }
        .ktz__scrim {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(16,15,13,0.05) 0%, transparent 42%, rgba(16,15,13,0.6) 100%);
        }
        .ktz__badge {
          position: absolute; top: 1.1rem; inset-inline-start: 1.1rem;
          background: rgba(251,247,240,0.92); color: var(--ink);
          font-size: 0.6rem; letter-spacing: 0.16em; text-transform: uppercase;
          padding: 0.45em 0.8em; border-radius: 100px;
        }
        .ktz__playhint {
          position: absolute; inset-inline-end: 1.2rem; bottom: 1.2rem;
          width: 2.8rem; height: 2.8rem; border-radius: 50%;
          background: rgba(251,247,240,0.92); display: flex; align-items: center; justify-content: center;
          transition: transform .5s ${EASE};
        }
        .ktz__framelink:hover .ktz__playhint { transform: translate(3px, -3px); }
        .ktz__playarrow { color: var(--ink); font-size: 1.1rem; }
        [dir="rtl"] .ktz__playarrow { transform: scaleX(-1); display: inline-block; }

        /* copy half — carries its own padding (the section has none) so the two
           halves stay flush against the seam while the text still breathes */
        .ktz__copy {
          min-width: 0; height: 100%;
          display: flex; flex-direction: column; justify-content: center;
          padding-inline: clamp(1.5rem, 4.5vw, 5rem);
          padding-block: clamp(2rem, 5vh, 3.5rem);
        }
        /* on-dark copy: brass-2 is the lighter brass the rest of the site uses
           on dark grounds (--brass is the on-light one and goes muddy here) */
        .ktz__eyebrow { color: var(--brass-2); display: block; margin-bottom: 0.7em; }
        .ktz__heading {
          font-size: clamp(2.1rem, 4vw, 3.6rem); line-height: 1.03;
          margin-bottom: 0.65em; max-width: 15ch; color: #fbf7f0;
        }
        .ktz__lead {
          font-size: clamp(0.98rem, 1.25vw, 1.1rem); line-height: 1.6;
          color: rgba(251,247,240,0.76); max-width: 42ch; margin-bottom: 2.1em;
        }
        /* the shared .btn-solid is ink-on-paper; invert it so the CTA still
           reads as the primary action against the dark panel */
        .ktz__cta {
          width: fit-content;
          background: var(--paper); color: var(--ink); border-color: var(--paper);
        }
        .ktz__cta:hover { background: var(--brass-2); border-color: var(--brass-2); color: var(--ink); }

        @media (max-width: 900px) {
          /* A side-by-side split is unreadable at phone widths, so the halves
             stack — but they stay ROWS of one 100svh screen (48/52) rather than
             becoming two loose blocks, so the section is still exactly one
             full, connected screen with the seam running horizontally. */
          .ktz__grid { grid-template-columns: 1fr; grid-template-rows: auto 1fr; }
          /* stacked: the photo keeps its 4:3 ratio across the full width and the
             copy fills the rest of the screen beneath it */
          .ktz__frame { height: auto; width: 100%; max-width: none; aspect-ratio: 4 / 3; }
          .ktz__copy {
            height: 100%;
            padding-inline: clamp(1.25rem, 6vw, 2.2rem);
            padding-block: clamp(1.4rem, 3.5vh, 2.2rem);
          }
          .ktz__heading { max-width: 20ch; }
          .ktz__lead { margin-bottom: 1.5em; }
        }
        @media (max-width: 640px) {
          .ktz__cta { width: 100%; justify-content: center; }
          .ktz__heading { font-size: clamp(1.75rem, 7.4vw, 2.4rem); margin-bottom: 0.5em; }
          .ktz__lead { font-size: 0.95rem; margin-bottom: 1.3em; }
        }
      `}</style>
    </section>
  );
}
