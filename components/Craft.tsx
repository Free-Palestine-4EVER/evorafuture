"use client";

/* ============================================================
   EVORA — Craftsmanship & Materials
   A light section to vary the rhythm against neighbouring
   dark sections. Slow, restrained, expensive.
   ============================================================ */

import { useT } from "@/lib/i18n";
import { materials } from "@/lib/data";
import {
  Rise,
  RevealLines,
  RevealWords,
  Stagger,
  StaggerItem,
} from "@/components/motion";

const EASE_SOFT = [0.22, 1, 0.36, 1] as const;

export default function Craft() {
  const { t, lang } = useT();

  return (
    <section
      id="craft"
      className="section"
      style={{ background: "var(--paper)", color: "var(--ink)" }}
    >
      <div className="container">
        {/* ---- Header ---- */}
        <header className="craft-head">
          <Rise>
            <span className="eyebrow" style={{ color: "var(--brass)" }}>
              {t("craft_eyebrow")}
            </span>
          </Rise>

          <RevealLines
            lines={[t("craft_title")]}
            delay={0.08}
            className="display"
            style={{
              fontSize: "clamp(2.2rem, 5vw, 4.2rem)",
              lineHeight: 1.08,
              fontWeight: 360,
              margin: "1.2rem 0 0",
            }}
          />

          <RevealWords
            text={t("craft_sub")}
            delay={0.16}
            style={{
              display: "block",
              maxWidth: "50ch",
              marginTop: "1.6rem",
              color: "var(--ink-soft)",
              fontSize: "1.02rem",
              lineHeight: 1.7,
            }}
          />
        </header>

        {/* ---- Material cards ---- */}
        <Stagger className="craft-grid" gap={0.12} delay={0.1}>
          {materials.map((m, i) => (
            <StaggerItem key={i} className="craft-card">
              <div className="craft-frame">
                <img src={m.img} alt={m.name[lang]} className="craft-img" />
              </div>

              <h3
                className="display"
                style={{
                  fontSize: "1.4rem",
                  fontWeight: 380,
                  lineHeight: 1.2,
                  marginTop: "1rem",
                  marginBottom: 0,
                }}
              >
                {m.name[lang]}
              </h3>

              <p
                style={{
                  marginTop: "0.5rem",
                  marginBottom: 0,
                  color: "var(--ink-faint)",
                  fontSize: "0.9rem",
                  lineHeight: 1.6,
                  maxWidth: "32ch",
                }}
              >
                {m.note[lang]}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      <style>{`
        #craft .craft-head {
          max-width: 64ch;
        }
        #craft .craft-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(1.4rem, 3vw, 2.6rem);
          margin-top: clamp(2.6rem, 6vw, 4.5rem);
        }
        #craft .craft-card {
          /* logical inline-end so it reads correctly in RTL */
          padding-inline-end: 0;
        }
        #craft .craft-frame {
          position: relative;
          overflow: hidden;
          transform: translateZ(0);
          transition: transform 0.9s cubic-bezier(0.22, 1, 0.36, 1),
                      box-shadow 0.9s cubic-bezier(0.22, 1, 0.36, 1);
          box-shadow: 0 1px 0 var(--line-soft);
          border-radius: 3px;
        }
        #craft .craft-img {
          display: block;
          width: 100%;
          aspect-ratio: 4 / 5;
          object-fit: cover;
          object-position: center;
        }
        #craft .craft-frame img {
          filter: brightness(0.96) saturate(0.98);
          transition: filter 0.9s cubic-bezier(0.22, 1, 0.36, 1),
                      transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
        }
        #craft .craft-card:hover .craft-frame {
          transform: translateY(-6px);
          box-shadow: 0 22px 48px -28px rgba(0, 0, 0, 0.32);
        }
        #craft .craft-card:hover .craft-frame img {
          filter: brightness(1.04) saturate(1.02);
        }

        @media (max-width: 860px) {
          #craft .craft-grid {
            grid-template-columns: 1fr;
            gap: clamp(2rem, 8vw, 3rem);
            max-width: 420px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          #craft .craft-frame,
          #craft .craft-frame img {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}
