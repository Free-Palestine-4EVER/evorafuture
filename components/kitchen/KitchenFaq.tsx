"use client";

import { useState } from "react";
import { useT } from "@/lib/i18n";
import { Rise, RevealLines, motion } from "@/components/motion";
import { AnimatePresence } from "framer-motion";
import { openStartProject } from "@/lib/startProject";

const EASE = [0.22, 1, 0.36, 1] as const;

// eyebrow/title reuse the shared "Good to Know" / "Questions, answered" keys
// (lib/i18n.tsx) — same section label the homepage FAQ uses, since this is
// genuinely the same kind of section. The questions themselves are new,
// kitchen-specific, and each answer is sourced from copy that already exists
// elsewhere in the repo:
//   q1 → ConfiguratorScroll cfg_lead / cfg-make step 2 (built to order, own workshop)
//   q2 → lib/configurator.ts SURFACES (the six real stone options)
//   q3 → ConfiguratorScroll cfg-make step 3 + lib/data.ts faqs (own delivery team)
//   q4 → lib/i18n fin_title / fin_body + lib/data.ts faqs (installments)
//   q5 → lib/i18n manifesto_body / pj_free / lib/data.ts faqs ("customised" answer)
//   q6 → lib/i18n visit_addr / visit_hours + lib/brand.ts (how to start)
const T = {
  cta: { en: "Book a kitchen consultation", ar: "احجز استشارة مطبخك" },
  q1: { en: "Is every kitchen island really made to order?", ar: "هل كل جزيرة مطبخ تُصنع فعلًا حسب الطلب؟" },
  a1: {
    en: "Yes. Every Evora island is built to order in our own workshop — one slab, measured and finished by hand, not a stock item off a shelf.",
    ar: "نعم. كل جزيرة من إيفورا تُصنع خصيصًا في ورشتنا — لوحٌ واحد، يُقاس ويُشطَّب يدويًا، وليست قطعة جاهزة من مخزن.",
  },
  q2: { en: "Which stones can I choose from?", ar: "من أي حجر يمكنني الاختيار؟" },
  a2: {
    en: "Six, so far — Patagonia, Calacatta Gold, Emperador, Nero Marquina, Verde Alpi and Travertine. Scroll up to preview each on the island live.",
    ar: "ستة حتى الآن — باتاغونيا، وكالاكاتا غولد، وإمبرادور، ونيرو مركينا، وفيردي ألبي، وترافرتين. عد إلى الأعلى لمعاينة كل واحد على الجزيرة مباشرة.",
  },
  q3: { en: "Do you install the island yourselves?", ar: "هل تركّبون الجزيرة بأنفسكم؟" },
  a3: {
    en: "Yes — our own team delivers and installs every island, so nothing is handed off to a third party between the workshop and your kitchen.",
    ar: "نعم — فريقنا نفسه يوصّل ويركّب كل جزيرة، فلا شيء يُسلَّم لطرف ثالث بين الورشة ومطبخك.",
  },
  q4: { en: "Can I pay in installments?", ar: "هل يمكنني التقسيط؟" },
  a4: {
    en: "Yes — buy at the cash price and spread it over up to 36 months through Safwa Islamic Bank, with no interest and no hidden cost.",
    ar: "نعم — اشترِ بسعر الكاش وقسّطه على مدى ٣٦ شهرًا عبر بنك صفوة الإسلامي، بدون فوائد وبدون أي تكلفة خفية.",
  },
  q5: { en: "Is design help included?", ar: "هل خدمة التصميم مشمولة؟" },
  a5: {
    en: "Yes — our design studio guides the marble, finish and proportions with you, as part of Evora's complimentary interior-design service.",
    ar: "نعم — يرافقك استوديو التصميم لدينا في اختيار الرخام والتشطيب والمقاسات، ضمن خدمة التصميم الداخلي المجانية من إيفورا.",
  },
  q6: { en: "How do I start?", ar: "كيف أبدأ؟" },
  a6: {
    en: "Book a consultation below, visit our Khalda showroom, or message us on WhatsApp — whichever is easiest for you.",
    ar: "احجز استشارة أدناه، أو زُر معرضنا في خلدا، أو راسلنا عبر واتساب — أيّهما أسهل لك.",
  },
};

export default function KitchenFaq() {
  const { t, lang, dir } = useT();
  const tl = (k: keyof typeof T) => T[k][lang];
  const [open, setOpen] = useState<number | null>(0);

  const items = [
    { q: tl("q1"), a: tl("a1") },
    { q: tl("q2"), a: tl("a2") },
    { q: tl("q3"), a: tl("a3") },
    { q: tl("q4"), a: tl("a4") },
    { q: tl("q5"), a: tl("a5") },
    { q: tl("q6"), a: tl("a6") },
  ];

  return (
    <section id="kitchen-faq" className="section kfaq" dir={dir} lang={lang}>
      <div className="container">
        <div className="kfaq__head">
          <Rise>
            <span className="eyebrow" style={{ color: "var(--brass)" }}>
              {t("faq_eyebrow")}
            </span>
          </Rise>
          <h2 className="kfaq__titlewrap">
            <RevealLines
              lines={[t("faq_title")]}
              className="display kfaq__title"
              delay={0.08}
            />
          </h2>
        </div>

        <Rise delay={0.1}>
          <div className="kfaq__list">
            {items.map((item, i) => {
              const isOpen = open === i;
              const panelId = `kfaq-panel-${i}`;
              const btnId = `kfaq-q-${i}`;
              return (
                <div className="kfaq__row" key={i}>
                  <h3 className="kfaq__qheading">
                    <button
                      type="button"
                      id={btnId}
                      className="kfaq__q"
                      data-cursor="hover"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpen(isOpen ? null : i)}
                    >
                      <span className="kfaq__qtext">{item.q}</span>
                      <motion.span
                        className="kfaq__icon"
                        aria-hidden="true"
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                      >
                        +
                      </motion.span>
                    </button>
                  </h3>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        role="region"
                        aria-labelledby={btnId}
                        className="kfaq__awrap"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                        style={{ overflow: "hidden" }}
                      >
                        <p className="kfaq__a">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </Rise>

        <Rise delay={0.16} className="kfaq__cta">
          <button type="button" className="btn btn-solid" onClick={openStartProject}>
            {tl("cta")} <span className="arrow">→</span>
          </button>
        </Rise>
      </div>

      <style>{`
        .kfaq { background: var(--paper); }
        .kfaq__head { text-align: center; max-width: 760px; margin: 0 auto clamp(2.4rem, 5vw, 3.4rem); }
        .kfaq__titlewrap { margin: 0; font-weight: inherit; }
        .kfaq__title { font-size: clamp(2rem, 4.5vw, 3.6rem); margin: 1rem 0 0; }

        .kfaq__list { max-width: 820px; margin: 0 auto; }
        .kfaq__row { border-block-end: 1px solid var(--line); }
        .kfaq__row:first-child { border-block-start: 1px solid var(--line); }
        .kfaq__qheading { margin: 0; }
        .kfaq__q {
          inline-size: 100%; display: flex; align-items: center; justify-content: space-between;
          gap: 1.5rem; padding: 1.5rem 0; background: none; border: 0; cursor: none;
          text-align: start; color: var(--ink); font-family: var(--font-display);
          font-size: 1.1rem; line-height: 1.3;
        }
        .kfaq__qtext { flex: 1 1 auto; }
        .kfaq__icon {
          flex: 0 0 auto; display: inline-flex; align-items: center; justify-content: center;
          inline-size: 1.4rem; block-size: 1.4rem; font-family: var(--font-display);
          font-size: 1.5rem; font-weight: 300; line-height: 1; color: var(--brass);
        }
        .kfaq__a {
          margin: 0; padding-block-end: 1.6rem; padding-inline-end: 2.9rem;
          max-width: 62ch; color: var(--ink-soft); font-size: 0.98rem; line-height: 1.65;
        }
        .kfaq__cta { display: flex; justify-content: center; margin-top: clamp(2.4rem, 5vw, 3.4rem); }
      `}</style>
    </section>
  );
}
