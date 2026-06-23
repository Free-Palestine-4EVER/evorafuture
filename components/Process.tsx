"use client";

import { useT } from "@/lib/i18n";
import { processSteps } from "@/lib/data";
import { Rise, RevealLines, Stagger, StaggerItem, motion } from "@/components/motion";

const EASE_SOFT = [0.22, 1, 0.36, 1] as const;

export default function Process() {
  const { t, lang } = useT();

  return (
    <section id="process" className="section container">
      {/* ---------- Header ---------- */}
      <header className="proc-head" style={{ maxWidth: "52ch" }}>
        <Rise>
          <span className="eyebrow" style={{ color: "var(--brass)" }}>
            {t("process_eyebrow")}
          </span>
        </Rise>

        <RevealLines
          lines={[t("process_title")]}
          delay={0.08}
          className="display"
          style={{
            fontSize: "clamp(2.2rem, 5vw, 4.2rem)",
            lineHeight: 1.08,
            fontWeight: 360,
            margin: "1.2rem 0 0",
          }}
        />

        <Rise
          delay={0.16}
          as="p"
          style={{
            maxWidth: "52ch",
            marginTop: "1.6rem",
            color: "var(--ink-soft)",
            fontSize: "1.02rem",
            lineHeight: 1.7,
          }}
        >
          {t("process_sub")}
        </Rise>
      </header>

      {/* ---------- Steps ---------- */}
      <div className="proc-rail" style={{ position: "relative", marginTop: "4.5rem" }}>
        {/* hairline that draws in on scroll */}
        <motion.div
          aria-hidden
          className="proc-line"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "0px 0px -12% 0px" }}
          transition={{ duration: 1.1, ease: EASE_SOFT }}
          style={{
            position: "absolute",
            insetInlineStart: 0,
            insetInlineEnd: 0,
            top: 0,
            height: 1,
            background: "var(--line)",
            transformOrigin: lang === "ar" ? "right" : "left",
          }}
        />

        <Stagger
          className="proc-grid"
          gap={0.12}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "2.5rem",
          }}
        >
          {processSteps.map((s) => (
            <StaggerItem key={s.n}>
              <div className="proc-step" style={{ paddingTop: "1.6rem" }}>
                <span
                  className="proc-num"
                  style={{
                    display: "block",
                    fontFamily: "var(--font-display)",
                    fontSize: "2.5rem",
                    lineHeight: 1,
                    fontWeight: 400,
                    color: "var(--brass-2)",
                  }}
                >
                  {s.n}
                </span>

                <h3
                  className="display"
                  style={{
                    fontSize: "1.5rem",
                    lineHeight: 1.2,
                    fontWeight: 380,
                    margin: "1rem 0 0.6rem",
                  }}
                >
                  {s.title[lang]}
                </h3>

                <p
                  style={{
                    color: "var(--ink-soft)",
                    fontSize: "0.95rem",
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {s.body[lang]}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .proc-grid { grid-template-columns: repeat(2, 1fr) !important; row-gap: 3rem !important; }
        }
        @media (max-width: 560px) {
          .proc-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
