"use client";

/* ============================================================
   EVORA — "Follow us" band (replaces the old email-capture band)
   Lives inside Footer.tsx, in the same slot the newsletter form
   used to occupy. Three parts:
     1. A follow CTA for Instagram + Facebook — real URLs, no
        invented handles/counts. This is what ships today.
     2. A static grid of six real Evora photographs (TILES below)
        that fills the visual gap until a live feed exists — see
        the comment above <Rise className="ft__gallery"> below.
     3. An inert mount point for a future third-party Instagram
        feed widget (Behold.so / SnapWidget / Elfsight / etc.) —
        see the comment above <div id="evora-ig-feed" /> below.
   ============================================================ */

import { useT } from "@/lib/i18n";
import { FOLLOWERS } from "@/lib/brand";
import { Rise, Magnetic, Stagger, StaggerItem } from "@/components/motion";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

// Same URLs already used in Footer.tsx's "Connect" column (social[] array) —
// the client's real, verified Instagram and Facebook pages. Do not swap for
// the slightly different (non-www) strings in lib/brand.ts; these are the
// canonical ones already live on the site.
const INSTAGRAM_URL = "https://www.instagram.com/evorafuturehome/";
const FACEBOOK_URL = "https://www.facebook.com/EvoraFutureHome/";
const INSTAGRAM_HANDLE = "@evorafuturehome";

type Bi = { en: string; ar: string };

/* ------------------------------------------------------------------
   STATIC IMAGE GRID — six real Evora photographs, not Instagram posts.

   The client's live feed needs their own Behold.so/SnapWidget account +
   Instagram Business OAuth (see the mount-point comment below) which
   doesn't exist yet, and the band read as broken/empty without it. This
   is a stopgap: Evora's own product/interior photography, already
   proven elsewhere on this site, cropped into an Instagram-grid-style
   mosaic. Every tile links to the real profile so "see more of this on
   Instagram" is a true statement — nothing here claims to BE a post
   (no captions, no like/comment counts, no timestamps, no "latest").

   Sources (already shipped assets, re-encoded small for this band —
   see public/evora/social/README below the TILES array):
     - living/dining/bedroom/kitchen: the same room photography used in
       Rooms.tsx and lib/shopTaxonomy.ts (public/evora/room-*.jpg).
     - chesterfield/lounge: the two genuinely-from-Instagram photos
       ClientExample.tsx already uses (public/evora/ig-*.jpg) — these
       two really did come from the client's feed, which is the most
       honest pair to lead with here.
   `name` below reuses each piece's EXISTING site-wide label verbatim
   (Rooms.tsx / ClientExample.tsx) rather than inventing new copy, so
   the accessible name for a room matches what it's called everywhere
   else on the site.
   ------------------------------------------------------------------ */
type Tile = { id: string; srcBase: string; name: Bi; alt: Bi };

const TILES: Tile[] = [
  {
    id: "living",
    srcBase: "/evora/social/tile-living",
    name: { en: "Living Room", ar: "غرفة المعيشة" },
    alt: {
      en: "A curved caramel bouclé sofa beneath a brass ring chandelier, floor-to-ceiling city views beyond",
      ar: "كنبة منحنية بقماش الكراميل الدافئ تحت ثريا حلقية نحاسية، ونوافذ ممتدة تطل على المدينة",
    },
  },
  {
    id: "dining",
    srcBase: "/evora/social/tile-dining",
    name: { en: "Dining Room", ar: "غرفة الطعام" },
    alt: {
      en: "A long walnut dining table set with emerald velvet chairs beneath a brass pendant light",
      ar: "طاولة طعام طويلة من خشب الجوز محاطة بكراسٍ مخملية زمردية تحت إضاءة نحاسية معلّقة",
    },
  },
  {
    id: "bedroom",
    srcBase: "/evora/social/tile-bedroom",
    name: { en: "Bedroom", ar: "غرفة النوم" },
    alt: {
      en: "A bedroom with a tufted emerald headboard, crisp white linens and a matching velvet bench",
      ar: "غرفة نوم برأسية سرير زمردية مبطّنة، وأغطية بيضاء ناصعة، ومقعد مخملي مطابق",
    },
  },
  {
    id: "kitchen",
    srcBase: "/evora/social/tile-kitchen",
    name: { en: "Kitchen", ar: "المطبخ" },
    alt: {
      en: "A walnut kitchen with a marble waterfall island and a sculptural black hood",
      ar: "مطبخ من خشب الجوز بجزيرة رخامية بتصميم الشلال ومدخنة سوداء نحتية",
    },
  },
  {
    id: "chesterfield",
    srcBase: "/evora/social/tile-chesterfield",
    // Reuses ClientExample.tsx's exact name for this piece (PIECES[0].name)
    name: { en: "The Cream Chesterfield", ar: "تشسترفيلد الكريمي" },
    alt: {
      en: "A cream channel-tufted armchair beside a brass side table in soft daylight",
      ar: "كرسي كريمي مبطّن بخطوط ناعمة بجانب طاولة نحاسية جانبية في ضوء نهارٍ دافئ",
    },
  },
  {
    id: "lounge",
    srcBase: "/evora/social/tile-lounge",
    // Reuses Rooms.tsx's exact name for this room (rooms[3].name — the
    // "guest" entry, which already uses this same source photograph)
    name: { en: "Guest Room", ar: "غرفة الضيوف" },
    alt: {
      en: "A taupe living-room seating set arranged around a walnut coffee table",
      ar: "طقم جلوس بقماش بيج دافئ حول طاولة قهوة من خشب الجوز",
    },
  },
];

// Page-local bilingual copy, matching the inline en/ar pattern Footer.tsx
// already uses for its own labels (explore[], social[], "Explore"/"استكشف"…)
// rather than adding to the shared lib/i18n.tsx dict.
const COPY: Record<
  | "eyebrow"
  | "title"
  | "sub"
  | "followingSuffix"
  | "igCta"
  | "fbCta"
  | "igAria"
  | "fbAria"
  | "galleryLabel"
  | "tileAriaSuffix",
  Bi
> = {
  eyebrow: { en: "Follow Along", ar: "تابعونا" },
  title: {
    en: "Follow Evora on Instagram & Facebook",
    ar: "تابعوا إيفورا على إنستغرام وفيسبوك",
  },
  sub: {
    en: "New arrivals, showroom moments and behind-the-scenes — right where you already scroll.",
    ar: "وصولات جديدة، ولحظات من المعرض، وما خلف الكواليس — في المكان الذي تتصفّحه أصلًا.",
  },
  // Reuses the exact figure + phrasing already shown in the hero
  // (HeroScroll.tsx .hero__meta: "{FOLLOWERS}+ following" / "{FOLLOWERS}+ متابع").
  // Deliberately NOT split per platform — the repo only ever single-sources
  // one combined figure, so that's the only claim made here too.
  followingSuffix: { en: "following", ar: "متابع" },
  igCta: { en: "Follow on Instagram", ar: "تابعونا على إنستغرام" },
  fbCta: { en: "Follow on Facebook", ar: "تابعونا على فيسبوك" },
  // Deliberately starts with the exact visible button text (igCta/fbCta)
  // so the accessible name contains the visible label verbatim — WCAG 2.5.3
  // Label in Name, so speech-input users saying "click Follow on Instagram"
  // still match.
  igAria: {
    en: "Follow on Instagram — opens in a new tab",
    ar: "تابعونا على إنستغرام — يفتح في نافذة جديدة",
  },
  fbAria: {
    en: "Follow on Facebook — opens in a new tab",
    ar: "تابعونا على فيسبوك — يفتح في نافذة جديدة",
  },
  // A truthful eyebrow for the static grid below — deliberately NOT "Latest
  // posts" / "From our feed" / anything implying these were pulled from
  // Instagram. It just names what it is: a look at Evora's own work.
  galleryLabel: { en: "A closer look", ar: "نظرة أقرب" },
  // Appended to each tile's room/piece name to build its accessible name,
  // e.g. "Living Room — see more on Instagram, opens in a new tab". Honest
  // because it's true: the tile really does link straight to the profile.
  tileAriaSuffix: {
    en: "— see more on Instagram, opens in a new tab",
    ar: "— شاهدوا المزيد على إنستغرام، يفتح في نافذة جديدة",
  },
};

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.332.014 7.052.072 2.695.272.273 2.69.073 7.052.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.332 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12.06C22 6.505 17.523 2 12 2S2 6.505 2 12.06c0 5.02 3.657 9.184 8.438 9.94v-7.03H7.898v-2.91h2.54V9.845c0-2.523 1.492-3.917 3.777-3.917 1.094 0 2.238.197 2.238.197v2.476h-1.26c-1.243 0-1.63.775-1.63 1.57v1.888h2.773l-.443 2.91h-2.33V22c4.78-.756 8.437-4.92 8.437-9.94z" />
    </svg>
  );
}

export default function SocialFollow() {
  const { lang } = useT();
  const c = (k: keyof typeof COPY) => COPY[k][lang];

  return (
    <div className="ft__social" lang={lang}>
      <style>{`
        .ft__social {
          padding-bottom: clamp(2.5rem, 5vw, 3.5rem);
          border-bottom: 1px solid var(--line);
        }
        .ft__social-top {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: clamp(1.5rem, 5vw, 4rem);
        }
        .ft__social-copy { max-width: 46ch; text-align: start; }
        .ft__social-eyebrow { display: block; }
        .ft__social-title {
          margin: 0.7rem 0 0;
          font-weight: 400;
          font-size: clamp(1.5rem, 3vw, 2.1rem);
          line-height: 1.15;
          color: var(--ink);
        }
        .ft__social-sub {
          margin: 0.7rem 0 0;
          max-width: 44ch;
          color: var(--ink-faint);
          font-size: 0.92rem;
          line-height: 1.6;
        }
        .ft__social-meta {
          margin: 0.9rem 0 0;
          color: var(--brass);
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        html[dir="rtl"] .ft__social-meta { letter-spacing: 0.02em; }

        .ft__social-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.85rem;
          flex: 0 0 auto;
        }
        .ft__social-btn { gap: 0.6em; }
        .ft__social-handle {
          opacity: 0.72;
          font-size: 0.82em;
        }
        /* the little Instagram gradient dot — same motif as .cx__ig-dot in
           ClientExample.tsx, reused here rather than inventing a new accent */
        .ft__ig-dot {
          width: 7px; height: 7px; border-radius: 50%; flex: 0 0 auto;
          background: conic-gradient(from 0deg, #feda75, #d62976, #962fbf, #4f5bd5, #feda75);
        }

        /* ---- static image grid (see comment in JSX below) ---- */
        .ft__gallery {
          margin-block-start: clamp(2.2rem, 5vw, 3.5rem);
        }
        .ft__gallery-eyebrow {
          display: block;
          color: var(--brass);
          margin-bottom: 0.9rem;
        }
        .ft__grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: clamp(0.5rem, 1.2vw, 0.85rem);
        }
        .ft__tile {
          position: relative;
          display: block;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          border-radius: 4px;
          background: var(--bone);
        }
        .ft__tile-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transform: scale(1.03);
          transition: transform 0.7s ${EASE};
        }
        .ft__tile:hover .ft__tile-img,
        .ft__tile:focus-visible .ft__tile-img {
          transform: scale(1.09);
        }
        .ft__tile-scrim {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 55%, rgba(22,21,15,0.55) 100%);
          opacity: 0;
          transition: opacity 0.45s ${EASE};
        }
        .ft__tile:hover .ft__tile-scrim,
        .ft__tile:focus-visible .ft__tile-scrim {
          opacity: 1;
        }
        .ft__tile-icon {
          position: absolute;
          inset-block-end: 0.55rem;
          inset-inline-end: 0.55rem;
          width: 1.9rem;
          height: 1.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: rgba(251,247,240,0.94);
          color: var(--ink);
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 0.4s ${EASE}, transform 0.4s ${EASE};
        }
        .ft__tile:hover .ft__tile-icon,
        .ft__tile:focus-visible .ft__tile-icon {
          opacity: 1;
          transform: translateY(0);
        }
        .ft__tile:focus-visible {
          outline: 2px solid var(--brass);
          outline-offset: 3px;
        }

        @media (max-width: 900px) {
          .ft__grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 520px) {
          .ft__grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ft__tile-img, .ft__tile-scrim, .ft__tile-icon { transition: none; }
        }

        /* ---- live feed mount point (see comment in JSX below) ---- */
        .ft__feed-mount {
          width: 100%;
          max-width: 100%;
        }
        /* Only when a widget script has actually injected content do we open
           up any spacing for it — an empty mount point must take up zero
           space, so :empty (no children at all) keeps margin at 0. */
        .ft__feed-mount:not(:empty) {
          margin-block-start: clamp(2rem, 5vw, 3.5rem);
        }

        @media (max-width: 860px) {
          .ft__social-top { flex-direction: column; align-items: flex-start; }
          .ft__social-actions { width: 100%; }
        }
        @media (max-width: 640px) {
          .ft__social-actions { flex-direction: column; align-items: stretch; }
          .ft__social-btn { width: 100%; justify-content: center; min-height: 46px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ft__social-btn { transition: none; }
        }
      `}</style>

      <Rise as="div" className="ft__social-top">
        <div className="ft__social-copy">
          <span className="eyebrow ft__social-eyebrow" style={{ color: "var(--brass)" }}>
            {c("eyebrow")}
          </span>
          <h2 className="display ft__social-title">{c("title")}</h2>
          <p className="ft__social-sub">{c("sub")}</p>
          <p className="ft__social-meta">
            {FOLLOWERS}+ {c("followingSuffix")}
          </p>
        </div>

        <div className="ft__social-actions">
          <Magnetic>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-solid ft__social-btn"
              aria-label={c("igAria")}
              data-cursor="hover"
            >
              <InstagramIcon />
              <span>{c("igCta")}</span>
              <span className="ft__ig-dot" aria-hidden="true" />
              <span className="ft__social-handle">{INSTAGRAM_HANDLE}</span>
              <span className="arrow">→</span>
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost ft__social-btn"
              aria-label={c("fbAria")}
              data-cursor="hover"
            >
              <FacebookIcon />
              <span>{c("fbCta")}</span>
              <span className="arrow">→</span>
            </a>
          </Magnetic>
        </div>
      </Rise>

      {/* ================================================================
          STATIC IMAGE GRID — real Evora photography, not Instagram posts.
          See the TILES array + comment above for what these six images are
          and why each one was picked. Ships today so the band doesn't read
          as empty while the client's own live-feed widget account doesn't
          exist yet; see the mount-point comment right below for how the
          two relate once that widget is ready.
         ================================================================ */}
      <Rise as="div" className="ft__gallery" delay={0.1}>
        <span className="eyebrow ft__gallery-eyebrow">{c("galleryLabel")}</span>
        <Stagger className="ft__grid" gap={0.06}>
          {TILES.map((tile) => (
            <StaggerItem key={tile.id} className="ft__tile-cell">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="ft__tile"
                aria-label={`${tile.name[lang]} ${c("tileAriaSuffix")}`}
                data-cursor="hover"
              >
                <picture>
                  <source srcSet={`${tile.srcBase}.avif`} type="image/avif" />
                  <img
                    src={`${tile.srcBase}.webp`}
                    alt={tile.alt[lang]}
                    loading="lazy"
                    decoding="async"
                    className="ft__tile-img"
                  />
                </picture>
                <span className="ft__tile-scrim" aria-hidden="true" />
                <span className="ft__tile-icon" aria-hidden="true">
                  <InstagramIcon />
                </span>
              </a>
            </StaggerItem>
          ))}
        </Stagger>
      </Rise>

      {/* ================================================================
          LIVE FEED MOUNT POINT — inactive today, on purpose.

          RELATIONSHIP TO THE STATIC GRID ABOVE: that grid (.ft__gallery)
          is a today-only stand-in built from real Evora photography, not
          a preview of this widget. The two are independent siblings, so
          when a real embed eventually renders into the div below, nothing
          has to be wired together — whoever activates it can either:
            (a) delete the .ft__gallery block above, since the live feed
                now does the job the static grid was covering for, or
            (b) leave both — the static grid stays as a fast, always-on
                fallback above a live feed that depends on a third-party
                script actually loading (see the Jordan-reachability flag
                below), so visitors on a slow/blocked connection still see
                real imagery even if the widget never mounts.
          Either is fine layout-wise: .ft__gallery always reserves its own
          space, and the mount div below only grows when something has
          actually rendered into it (see :not(:empty) below), so stacking
          them never produces a double-height empty gap.

          The client wants a live "latest posts" grid, but wants it powered
          by a third-party embed widget (e.g. Behold.so, SnapWidget,
          Elfsight) rather than a hand-maintained image list or a custom
          Instagram Graph API integration. We cannot create that widget
          account or authenticate the client's Instagram ourselves — that
          requires the client's own login — so there is no embed snippet to
          ship yet. This div is the target element it will render into.

          TO ACTIVATE, once the client supplies their provider + embed
          snippet:
            1. Import `Script` from "next/script" at the top of this file.
            2. Add the provider's <script> tag as a <Script> element,
               placed as a sibling of the div below (order doesn't matter —
               these widgets query the DOM by id once loaded), e.g.:
                 <Script
                   src="<the provider's embed script URL>"
                   strategy="lazyOnload"
                 />
               Use strategy="lazyOnload" — this is a below-the-fold, purely
               decorative social feed, not part of the critical render path,
               so it should load only after the page is interactive/idle.
            3. Make sure the id below ("evora-ig-feed") matches whatever
               target the provider's dashboard/snippet expects — either
               rename this div's id to match their generated one, or point
               their widget config at "evora-ig-feed".
            4. Paste the snippet with the CLIENT'S OWN feed/widget ID from
               their provider dashboard — never a placeholder or someone
               else's ID.

          PROJECT-SPECIFIC CONSTRAINT TO CHECK BEFORE SHIPPING (not solved
          here, just flagged): this site is self-hosted for a Jordanian
          audience and already registers a service worker. Whoever wires
          the widget up must verify (a) the widget provider's CDN/script
          domain is actually reachable from Jordan — some third-party CDNs
          are blocked/throttled there — and (b) the existing service worker
          isn't intercepting/caching the widget's script or API requests in
          a way that serves stale or empty content.

          Until an embed is supplied, this div is rendered with no children
          and no reserved size — see .ft__feed-mount:not(:empty) above —
          so today it contributes nothing to the layout: no empty box, no
          placeholder frame, no loading skeleton.
         ================================================================ */}
      <div id="evora-ig-feed" className="ft__feed-mount" />
    </div>
  );
}
