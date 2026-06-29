"use client";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { useT } from "@/lib/i18n";
import { ROOMS_HUB } from "@/lib/shopTaxonomy";
import { Rise, RevealLines, Stagger, StaggerItem } from "@/components/motion";

export default function ShopRoomsPage() {
  const { t, lang } = useT();
  const en = lang === "en";

  return (
    <main>
      <Nav pinnedSolid />
      <section className="section rooms-hub" style={{ paddingTop: "clamp(7rem, 13vh, 10rem)" }}>
        <div className="container">
          <div className="rooms-hub-head">
            <Rise as="span" className="eyebrow" style={{ color: "var(--brass)", display: "block" }}>
              {t("shop_rooms_eyebrow")}
            </Rise>
            <RevealLines
              lines={[t("shop_rooms_title")]}
              className="display"
              style={{ fontSize: "clamp(2.2rem, 5.4vw, 4.2rem)", margin: "1rem 0 0", maxWidth: "16ch" }}
            />
            <Rise delay={0.12}>
              <p style={{ color: "var(--ink-soft)", maxWidth: "56ch", marginTop: "1.2rem" }}>
                {t("shop_rooms_sub")}
              </p>
            </Rise>
          </div>

          <Stagger className="rooms-hub-grid" gap={0.06}>
            {ROOMS_HUB.map((node) => {
              const count = node.resolve().length;
              const label = en ? node.labelEN : node.labelAR;
              const note = en ? node.noteEN : node.noteAR;
              const meta =
                count > 0
                  ? `${count} ${t("shop_pieces")}`
                  : t("shop_showroom_cta");
              return (
                <StaggerItem key={node.slug} y={26}>
                  <a href={`/shop/${node.slug}`} className="rooms-hub-card" data-cursor="hover" aria-label={label}>
                    <div className="rooms-hub-img">
                      <img src={node.image} alt={label} loading="lazy" />
                      <span className="rooms-hub-scrim" />
                      <span className="rooms-hub-meta">{meta}</span>
                    </div>
                    <div className="rooms-hub-body">
                      <div>
                        <h2 className="display rooms-hub-name">{label}</h2>
                        <p className="rooms-hub-note">{note}</p>
                      </div>
                      <span className="rooms-hub-arrow" aria-hidden>↗</span>
                    </div>
                  </a>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>
      <Footer />

      <style>{`
        .rooms-hub-head { max-width: 760px; margin-bottom: clamp(2.6rem, 5vw, 4rem); }
        .rooms-hub-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(1.2rem, 2.4vw, 2rem); }
        .rooms-hub-card { display: flex; flex-direction: column; }
        .rooms-hub-img { position: relative; aspect-ratio: 4/5; overflow: hidden; border-radius: 6px; background: var(--bone); }
        .rooms-hub-img img { width: 100%; height: 100%; object-fit: cover; transform: scale(1.03); transition: transform 1.1s var(--ease); }
        .rooms-hub-card:hover .rooms-hub-img img { transform: scale(1.09); }
        .rooms-hub-scrim { position: absolute; inset: 0; background: linear-gradient(180deg, transparent 50%, rgba(16,15,13,0.42) 100%); }
        .rooms-hub-meta { position: absolute; top: 0.9rem; inset-inline-start: 1rem; background: rgba(251,247,240,0.92); backdrop-filter: blur(6px); color: var(--ink); font-size: 0.62rem; letter-spacing: 0.14em; text-transform: uppercase; font-weight: 600; padding: 0.4em 0.75em; border-radius: 100px; }
        .rooms-hub-body { display: flex; align-items: flex-end; justify-content: space-between; gap: 1rem; padding: 1rem 0.2rem 0; }
        .rooms-hub-name { font-size: clamp(1.4rem, 2vw, 1.8rem); color: var(--ink); line-height: 1.05; }
        .rooms-hub-note { font-size: 0.86rem; color: var(--ink-faint); margin: 0.3rem 0 0; }
        .rooms-hub-arrow { color: var(--brass); font-size: 1.2rem; transition: transform .5s var(--ease); }
        .rooms-hub-card:hover .rooms-hub-arrow { transform: translate(3px, -3px); }
        html[dir="rtl"] .rooms-hub-arrow { transform: scaleX(-1); }
        html[dir="rtl"] .rooms-hub-card:hover .rooms-hub-arrow { transform: translate(-3px, -3px) scaleX(-1); }

        @media (max-width: 880px) { .rooms-hub-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 560px) { .rooms-hub-grid { grid-template-columns: 1fr; } .rooms-hub-img { aspect-ratio: 4/3; } }
      `}</style>
    </main>
  );
}
