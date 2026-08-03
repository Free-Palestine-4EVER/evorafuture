"use client";

import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import LookbookApp from "@/components/lookbook/LookbookApp";
import { useT } from "@/lib/i18n";

/* ============================================================
   /catalog — the ARGOS lookbook.

   DESKTOP gets the real flipbook, with a page-turn sound.
   MOBILE gets the PDF, and never mounts the flipbook at all.

   Why the split: the flipbook holds 66 page images in the DOM.
   Desktop Chrome copes; mobile Safari's per-tab memory ceiling
   is far tighter and the tab dies. `loading="lazy"` does not
   save it — that defers the initial fetch but does not unmount
   bitmaps once they have decoded. The client hit this crash
   again on 2026-08-03.

   The gate MUST be a real mount decision, not `display:none` —
   CSS-hiding still mounts the component and still decodes every
   image, so it would still crash. Hence a client component and
   a matchMedia check.

   `ready` starts false so the server render and the first client
   render agree (no hydration mismatch); the real choice is made
   one tick later. That first paint is just the header, which is
   identical either way.

   iOS Safari cannot usefully render a PDF in an <iframe> (inert
   grey box / one unscrollable page), so mobile gets a real link
   out to the system viewer instead of an embed.
   ============================================================ */

const PDF = "/evora/catalog.pdf";
const DESKTOP = "(min-width: 901px)";

const T = {
  eyebrow: { en: "ARGOS · Interior Design by Evora", ar: "أرغوس · تصميم داخلي من إيفورا" },
  title: { en: "The Lookbook", ar: "الكتالوج" },
  lead: {
    en: "Thirty-one pages of finished Evora interiors — bedrooms, dressing rooms, majlis, dining and lounges.",
    ar: "إحدى وثلاثون صفحة من مساحات إيفورا المكتملة — غرف نوم، غرف ملابس، مجالس، طعام وجلسات.",
  },
  open: { en: "Open the lookbook", ar: "افتح الكتالوج" },
  download: { en: "Download PDF", ar: "حمّل الملف" },
  note: { en: "PDF · 31 pages · 10.5 MB", ar: "PDF · ٣١ صفحة · ١٠٫٥ ميغابايت" },
};

export default function CatalogPage() {
  const { lang } = useT();
  const en = lang === "en";
  const tl = (k: keyof typeof T) => T[k][lang];

  const [ready, setReady] = useState(false);
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP);
    const apply = () => setDesktop(mq.matches);
    apply();
    setReady(true);
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <main>
      <Nav pinnedSolid />

      {ready && desktop ? (
        <LookbookApp />
      ) : (
        <section className="lb" aria-busy={!ready}>
          <div className="container lb__head">
            <span className="eyebrow lb__eyebrow">{tl("eyebrow")}</span>
            <h1 className="display lb__h">{tl("title")}</h1>
            <p className="lb__lead">{tl("lead")}</p>

            {/* Only shown once we know this is NOT desktop, so a desktop
                visitor never sees a flash of the mobile fallback. */}
            {ready && (
              <>
                <div className="lb__actions">
                  <a className="btn btn-solid lb__open" href={PDF} target="_blank" rel="noopener noreferrer">
                    {tl("open")} <span className="arrow">→</span>
                  </a>
                  <a className="lb__dl" href={PDF} download>
                    {tl("download")} <span aria-hidden>↓</span>
                  </a>
                </div>
                {/* Set expectations rather than letting a 10.5MB download feel
                    broken on a Jordanian mobile connection. */}
                <p className="lb__note">{tl("note")}</p>
              </>
            )}
          </div>
        </section>
      )}

      {(!ready || !desktop) && <Footer />}

      <style>{`
        .lb { background: var(--paper); padding-block: clamp(6.5rem, 12vh, 9rem) clamp(3rem, 7vw, 5rem); min-height: 60svh; }
        .lb__head { max-width: 70ch; text-align: start; }
        .lb__eyebrow { color: var(--brass); display: block; }
        .lb__h { font-size: clamp(2.4rem, 6vw, 4.6rem); line-height: 1.02; margin: 0.7rem 0 0; color: var(--ink); }
        .lb__lead { color: var(--ink-soft); font-size: clamp(1rem, 1.3vw, 1.15rem); line-height: 1.65; margin: 1.1rem 0 0; max-width: 60ch; }
        .lb__actions { display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; margin-top: 2rem; }
        .lb__open { width: 100%; justify-content: center; }
        .lb__dl {
          display: inline-flex; align-items: center; gap: 0.5em;
          font-size: 0.78rem; letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--ink); border-bottom: 1px solid var(--brass); padding-bottom: 0.3em;
        }
        .lb__note { color: var(--ink-faint); font-size: 0.78rem; margin: 0.9rem 0 0; letter-spacing: 0.04em; }
        @media (min-width: 560px) { .lb__open { width: fit-content; } }
      `}</style>
    </main>
  );
}
