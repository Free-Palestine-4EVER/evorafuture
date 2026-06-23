"use client";

import { useState } from "react";
import { useT } from "@/lib/i18n";
import { faqs } from "@/lib/data";
import { Rise, RevealLines, motion } from "@/components/motion";
import { AnimatePresence } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Faq() {
  const { t, lang } = useT();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="section" style={{ background: "var(--bone)" }}>
      <div className="container">
        <div style={{ textAlign: "center", maxWidth: 760, margin: "0 auto 3rem" }}>
          <Rise>
            <span className="eyebrow" style={{ color: "var(--brass)" }}>
              {t("faq_eyebrow")}
            </span>
          </Rise>
          <RevealLines
            lines={[t("faq_title")]}
            className="display"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.6rem)", margin: "1rem 0 0" }}
            delay={0.08}
          />
        </div>

        <Rise delay={0.1}>
          <div className="faq-list">
            {faqs.map((item, i) => {
              const isOpen = open === i;
              return (
                <div className="faq-row" key={i}>
                  <button
                    type="button"
                    className="faq-q"
                    data-cursor="hover"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span className="faq-q-text">{item.q[lang]}</span>
                    <motion.span
                      className="faq-icon"
                      aria-hidden="true"
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.4, ease: EASE }}
                    >
                      +
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        className="faq-a-wrap"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                        style={{ overflow: "hidden" }}
                      >
                        <p className="faq-a">{item.a[lang]}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </Rise>
      </div>

      <style>{`
        .faq-list {
          max-width: 820px;
          margin: 0 auto;
        }
        .faq-row {
          border-block-end: 1px solid var(--line);
        }
        .faq-row:first-child {
          border-block-start: 1px solid var(--line);
        }
        .faq-q {
          inline-size: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          padding: 1.5rem 0;
          background: none;
          border: 0;
          cursor: none;
          text-align: start;
          color: var(--ink);
          font-family: var(--font-display);
          font-size: 1.15rem;
          line-height: 1.3;
        }
        .faq-q-text {
          flex: 1 1 auto;
        }
        .faq-icon {
          flex: 0 0 auto;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          inline-size: 1.4rem;
          block-size: 1.4rem;
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 300;
          line-height: 1;
          color: var(--brass);
        }
        .faq-a-wrap {
          will-change: height;
        }
        .faq-a {
          margin: 0;
          padding-block-end: 1.6rem;
          padding-inline-end: 2.9rem;
          max-width: 60ch;
          color: var(--ink-soft);
          font-size: 0.98rem;
          line-height: 1.65;
        }
      `}</style>
    </section>
  );
}
