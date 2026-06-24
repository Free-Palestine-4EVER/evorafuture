"use client";

import { useRef } from "react";
import { useT } from "@/lib/i18n";
import { collections } from "@/lib/data";
import { Rise, RevealLines } from "@/components/motion";

// The SMALLER carousel — sits right under the big pinned category rail and reads
// as the same block (shared --paper background, no seam). Draggable + snap +
// arrow buttons, with compact cards so it contrasts the big rail above.
export default function Collections() {
  const { t, lang } = useT();
  const trackRef = useRef<HTMLDivElement>(null);

  const nudge = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".scoll-card");
    const step = card ? card.offsetWidth + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step * 2, behavior: "smooth" });
  };

  return (
    <section id="collections" className="scoll">
      <div className="container">
        <div className="scoll-head">
          <div>
            <Rise><span className="eyebrow" style={{ color: "var(--brass)" }}>{t("collections_eyebrow")}</span></Rise>
            <RevealLines
              lines={[t("collections_title")]}
              delay={0.08}
              className="display scoll-title"
            />
          </div>
          <div className="scoll-headside">
            <Rise delay={0.12}>
              <span className="scoll-note">
                {lang === "en" ? "Six worlds, one address in Khalda." : "ستة عوالم، عنوان واحد في خلدا."}
              </span>
            </Rise>
            <div className="scoll-nav" aria-hidden>
              <button type="button" className="scoll-btn" onClick={() => nudge(-1)} aria-label="Previous">
                <span>‹</span>
              </button>
              <button type="button" className="scoll-btn" onClick={() => nudge(1)} aria-label="Next">
                <span>›</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div ref={trackRef} className="scoll-track" lang={lang}>
        {collections.map((c) => (
          <a key={c.id} href="/shop" className="scoll-card" data-cursor="hover" draggable={false}>
            <div className="scoll-imgwrap">
              <img src={c.img} alt={c.name[lang]} className="scoll-img" loading="lazy" draggable={false} />
              <div className="scoll-scrim" />
            </div>
            <div className="scoll-meta">
              <div>
                <span className="scoll-count">{c.count[lang]}</span>
                <span className="display scoll-name">{c.name[lang]}</span>
              </div>
              <span className="scoll-arrow" aria-hidden>↗</span>
            </div>
          </a>
        ))}
        <span className="scoll-pad" aria-hidden />
      </div>

      <style>{`
        /* shared background with the rail above = the two carousels feel bound */
        .scoll { position: relative; background: var(--paper);
          padding-block: clamp(1.5rem, 4vw, 3rem) clamp(4rem, 8vw, 7rem); }
        .scoll-head { display: flex; justify-content: space-between; align-items: flex-end;
          flex-wrap: wrap; gap: 1rem 2rem; margin-bottom: clamp(1.6rem, 3vw, 2.6rem); }
        .scoll-title { font-size: clamp(1.9rem, 4.4vw, 3.4rem); margin: 0.6rem 0 0; line-height: 1; }
        .scoll-headside { display: flex; align-items: center; gap: 1.6rem; }
        .scoll-note { font-size: 0.85rem; color: var(--ink-faint); max-width: 24ch; display: block; }
        .scoll-nav { display: flex; gap: 0.55rem; }
        .scoll-btn { width: 44px; height: 44px; border-radius: 50%; cursor: pointer;
          border: 1px solid color-mix(in srgb, var(--ink) 22%, transparent);
          background: transparent; color: var(--ink); font-size: 1.5rem; line-height: 1;
          display: grid; place-items: center; transition: background .35s var(--ease), color .35s var(--ease), transform .35s var(--ease); }
        .scoll-btn:hover { background: var(--ink); color: var(--paper); transform: translateY(-1px); }

        /* the smaller carousel track */
        .scoll-track {
          display: flex; gap: 16px; overflow-x: auto; overflow-y: hidden;
          padding-inline: var(--gut); scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch; scrollbar-width: none; scroll-padding-inline: var(--gut);
        }
        .scoll-track::-webkit-scrollbar { display: none; }
        .scoll-pad { flex: 0 0 1px; }

        .scoll-card {
          position: relative; flex: 0 0 auto; scroll-snap-align: start;
          width: clamp(208px, 20vw, 290px); display: block;
          border-radius: 4px; overflow: hidden;
        }
        .scoll-imgwrap { position: relative; aspect-ratio: 4 / 5; overflow: hidden; }
        .scoll-img { width: 100%; height: 100%; object-fit: cover; transform: scale(1.03);
          transition: transform 1.1s var(--ease), filter 1.1s var(--ease); filter: saturate(0.98); }
        .scoll-card:hover .scoll-img { transform: scale(1.1); }
        .scoll-scrim { position: absolute; inset: 0; background: linear-gradient(180deg, transparent 42%, rgba(16,15,13,0.66) 100%); }
        .scoll-meta { position: absolute; inset-inline: 0; bottom: 0; padding: 1rem 1.1rem;
          display: flex; align-items: flex-end; justify-content: space-between; gap: 0.8rem; }
        .scoll-count { display: block; font-size: 0.62rem; letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(251,247,240,0.78); margin-bottom: 5px; }
        html[dir="rtl"] .scoll-count { letter-spacing: 0.06em; }
        .scoll-name { font-size: clamp(1.15rem, 1.6vw, 1.5rem); color: var(--paper); line-height: 1.05; }
        .scoll-arrow { color: var(--paper); font-size: 1rem; opacity: 0; transition: opacity .5s var(--ease), transform .5s var(--ease); }
        .scoll-card:hover .scoll-arrow { opacity: 1; transform: translateY(-3px); }
        html[dir="rtl"] .scoll-arrow { transform: scaleX(-1); }

        @media (max-width: 720px) {
          .scoll-card { width: clamp(168px, 64vw, 240px); }
          .scoll-headside { width: 100%; justify-content: space-between; }
          .scoll-nav { display: none; }
        }
      `}</style>
    </section>
  );
}
