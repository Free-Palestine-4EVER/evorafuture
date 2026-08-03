"use client";

import { useT } from "@/lib/i18n";
import { Rise, Stagger, StaggerItem } from "@/components/motion";
import { SURFACES } from "@/lib/configurator";
import { openStartProject } from "@/lib/startProject";

// Page-local strings (the DesignRequest.tsx / KitchenTeaser.tsx pattern) —
// everything here is new copy that doesn't exist in the shared i18n dict.
const T = {
  eyebrow: { en: "The Stone Library", ar: "مكتبة الحجر" },
  heading: { en: "Five stones, five kitchens", ar: "خمسة أحجار، خمسة مطابخ" },
  // The old lead said "the same island above, re-cut in each stone" — true when
  // every card was one render restoned, but these are now five DIFFERENT
  // kitchens, so that claim had to go rather than sit here being false.
  lead: {
    en: "Every finish here is a real option, shown in a kitchen built around it. From storm-grey Patagonia to sand-toned Travertine — scroll back up to try one live on your own island.",
    ar: "كل تشطيب هنا خيارٌ حقيقي، معروضٌ في مطبخٍ صُمّم حوله. من باتاغونيا الرمادي كالعاصفة إلى الترافرتين الرملي — عد إلى الأعلى لتجرّبه مباشرة على جزيرتك.",
  },
  cta: { en: "Try them live in the configurator", ar: "جرّبها مباشرة في المُصمِّم" },
  // Tells the visitor what tapping a card actually does, before they tap it.
  hint: { en: "Send your plan", ar: "أرسل مخططك" },
  card_aria: {
    en: "{stone} — send us your floor plan and we'll design your kitchen",
    ar: "{stone} — أرسل لنا مخطط منزلك ونصمّم مطبخك",
  },
};

// The gallery's own imagery, separate from the configurator's `surface-*` files.
// Those MUST stay as they are: the live configurator swaps the SAME island
// between stones, and that only reads as a material change because the room is
// identical in every one. These are five distinct kitchens, one per stone.
// nero-marquina is deliberately absent — its generation came out wrong and the
// client asked for these five only. Any stone without an entry here is skipped
// in the grid but still selectable in the configurator above.
const KITCHEN_IMG: Record<string, string> = {
  "patagonia": "/evora/kitchens/patagonia",
  "calacatta-gold": "/evora/kitchens/calacatta-gold",
  "emperador": "/evora/kitchens/emperador",
  "verde-alpi": "/evora/kitchens/verde-alpi",
  "travertine": "/evora/kitchens/travertine",
};

export default function KitchenMaterials() {
  const { t, lang, dir } = useT();
  const tl = (k: keyof typeof T) => T[k][lang];

  return (
    <section id="kitchen-materials" className="kmat" dir={dir} lang={lang}>
      <div className="container">
        <div className="kmat__head">
          <Rise as="span" className="eyebrow kmat__eyebrow">
            {tl("eyebrow")}
          </Rise>
          <Rise as="h2" delay={0.06} className="display kmat__h">
            {tl("heading")}
          </Rise>
          <Rise as="p" delay={0.12} className="kmat__lead">
            {tl("lead")}
          </Rise>
        </div>

        <Stagger className="kmat__grid" gap={0.07}>
          {SURFACES.filter((s) => KITCHEN_IMG[s.id]).map((s) => (
            <StaggerItem key={s.id} className="kmat__item">
              {/* Opens the "Send us your 2D plan" modal (StartProjectModal) —
                  name/email/phone + a real floor-plan upload, filed as a lead.
                  Kept as a real <a href="/start"> so middle-click, new-tab and
                  a failed modal chunk all still reach the same form; the click
                  handler just intercepts it for the nicer inline flow. */}
              <a
                href="/start"
                className="kmat__card"
                data-cursor="hover"
                aria-label={tl("card_aria").replace("{stone}", s.label[lang])}
                onClick={(e) => {
                  // let cmd/ctrl/middle-click open /start in a new tab
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                  e.preventDefault();
                  openStartProject();
                }}
              >
                <span className="kmat__imgwrap">
                  <picture>
                    <source srcSet={`${KITCHEN_IMG[s.id]}.avif`} type="image/avif" />
                    <img
                      src={`${KITCHEN_IMG[s.id]}.webp`}
                      alt={s.label[lang]}
                      className="kmat__img"
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                  <span className="kmat__scrim" aria-hidden />
                </span>
                <span
                  className="kmat__swatch"
                  aria-hidden
                  style={{ backgroundImage: `url(${s.swatch})` }}
                />
                <span className="kmat__meta">
                  <h3 className="kmat__name display">{s.label[lang]}</h3>
                  {s.note && <span className="kmat__note">{s.note[lang]}</span>}
                  <span className="kmat__hint">
                    {tl("hint")} <span className="kmat__hintarrow" aria-hidden>→</span>
                  </span>
                </span>
              </a>
            </StaggerItem>
          ))}
        </Stagger>

        <Rise delay={0.1} className="kmat__foot">
          <a href="#configurator" className="kmat__more" data-cursor="hover">
            <span>{tl("cta")}</span>
            <span className="kmat__morearrow" aria-hidden>↑</span>
          </a>
        </Rise>
      </div>

      <style>{css}</style>
    </section>
  );
}

const css = `
  .kmat { position: relative; background: var(--paper); padding-block: clamp(4rem, 9vw, 7.5rem); }

  .kmat__head { max-width: 62ch; margin-bottom: clamp(2.2rem, 5vw, 3.6rem); }
  .kmat__eyebrow { color: var(--brass); display: block; }
  .kmat__h { font-size: clamp(2.1rem, 4.6vw, 3.6rem); line-height: 1.04; margin: 0.9rem 0 0; color: var(--ink); }
  .kmat__lead { color: var(--ink-soft); font-size: clamp(0.98rem, 1.2vw, 1.1rem); line-height: 1.65; margin: 1.1rem 0 0; max-width: 58ch; }

  .kmat__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(14px, 1.8vw, 24px); }
  .kmat__item { display: flex; }
  .kmat__card {
    position: relative; display: flex; flex-direction: column; width: 100%;
    border-radius: 8px; overflow: hidden; background: var(--bone);
    box-shadow: 0 20px 50px -32px rgba(22,21,15,0.35);
    transition: transform 0.5s var(--ease), box-shadow 0.5s var(--ease);
  }
  .kmat__card:hover { transform: translateY(-4px); box-shadow: 0 34px 70px -34px rgba(22,21,15,0.45); }

  .kmat__imgwrap { position: relative; aspect-ratio: 4 / 3; overflow: hidden; }
  .kmat__img { width: 100%; height: 100%; object-fit: cover; display: block;
    transform: scale(1.03); transition: transform 1.1s var(--ease); }
  .kmat__card:hover .kmat__img { transform: scale(1.09); }
  .kmat__scrim { position: absolute; inset: 0;
    background: linear-gradient(180deg, transparent 48%, rgba(16,15,13,0.72) 100%); }

  .kmat__swatch {
    position: absolute; top: 0.85rem; inset-inline-start: 0.85rem; z-index: 2;
    width: 34px; height: 34px; border-radius: 9px;
    background-size: cover; background-position: center;
    border: 2px solid rgba(251,247,240,0.85);
    box-shadow: 0 6px 16px rgba(0,0,0,0.35);
  }

  .kmat__meta { position: absolute; inset-inline: 0; bottom: 0; z-index: 2;
    padding: 1rem 1.1rem 1.05rem; display: flex; flex-direction: column; gap: 0.2rem; }
  .kmat__name { color: var(--paper); font-size: clamp(1.1rem, 1.6vw, 1.35rem); line-height: 1.08; }
  .kmat__note { color: rgba(251,247,240,0.82); font-size: 0.84rem; line-height: 1.45; max-width: 32ch; }

  /* "Send your plan →" — the card's actual action. Held back until hover on
     pointer devices so the card stays photographic, but ALWAYS visible on
     touch, where there is no hover to reveal it. */
  .kmat__hint {
    display: inline-flex; align-items: center; gap: 0.45em; margin-top: 0.5rem;
    color: var(--brass-2); font-size: 0.7rem; letter-spacing: 0.14em;
    text-transform: uppercase; font-weight: 500;
  }
  .kmat__hintarrow { transition: transform 0.4s var(--ease); }
  [dir="rtl"] .kmat__hintarrow { transform: scaleX(-1); }
  .kmat__card:hover .kmat__hintarrow { transform: translateX(4px); }
  [dir="rtl"] .kmat__card:hover .kmat__hintarrow { transform: scaleX(-1) translateX(4px); }
  @media (hover: hover) and (pointer: fine) {
    .kmat__hint { opacity: 0; transform: translateY(4px);
      transition: opacity 0.4s var(--ease), transform 0.4s var(--ease); }
    .kmat__card:hover .kmat__hint,
    .kmat__card:focus-visible .kmat__hint { opacity: 1; transform: none; }
  }
  .kmat__card:focus-visible { outline: 2px solid var(--brass); outline-offset: 3px; }

  .kmat__foot { margin-top: clamp(2rem, 4vw, 3rem); display: flex; justify-content: center; }
  .kmat__more {
    display: inline-flex; align-items: center; gap: 0.6em;
    font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--ink); border-bottom: 1px solid var(--brass); padding-bottom: 0.35em;
    transition: color 0.35s var(--ease), gap 0.35s var(--ease);
  }
  .kmat__more:hover { color: var(--brass); gap: 0.9em; }
  .kmat__morearrow { color: var(--brass); font-size: 1rem; transition: transform 0.4s var(--ease); }
  .kmat__more:hover .kmat__morearrow { transform: translateY(-3px); }

  @media (max-width: 900px) {
    .kmat__grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 560px) {
    .kmat__grid { grid-template-columns: 1fr; }
    .kmat__imgwrap { aspect-ratio: 16 / 11; }
  }
`;
