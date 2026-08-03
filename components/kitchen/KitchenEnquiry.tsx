"use client";

import { useT } from "@/lib/i18n";
import { Rise, Magnetic } from "@/components/motion";
import { openStartProject } from "@/lib/startProject";
import { WHATSAPP, PHONE_PRIMARY, PHONE_PRIMARY_TEL, PHONE_SECONDARY, PHONE_SECONDARY_TEL } from "@/lib/brand";

// The enquiry mechanism: this section deliberately does NOT roll its own
// form. It reuses the site's one real lead-capture flow —
// openStartProject() (components/StartProjectModal.tsx, backed by
// lib/portal/store → Firebase) — plus a WhatsApp deep link, exactly the
// pattern ConfiguratorScroll already uses for its own CTAs. A form that
// posted nowhere would be worse than none on a page shipping to the client
// today; this one is guaranteed to actually reach Evora.
const T = {
  eyebrow: { en: "Start your kitchen", ar: "ابدأ مطبخك" },
  heading: { en: "Let's design your kitchen.", ar: "لنصمّم مطبخك." },
  lead: {
    en: "Book a consultation at our Khalda showroom, or send us a message — we'll walk you through the stone, proportions and finish, then take it from your idea to installed.",
    ar: "احجز استشارة في معرضنا بخلدا، أو راسلنا مباشرة — نأخذك خطوة بخطوة في اختيار الحجر والمقاسات والتشطيب، ثم ننقل فكرتك من الورشة حتى التركيب.",
  },
  wa_msg: {
    en: "Hi Evora! I'd like to discuss a bespoke kitchen island for my home.",
    ar: "مرحبًا إيفورا! أودّ التحدث عن جزيرة مطبخ حسب الطلب لمنزلي.",
  },
  visit_label: { en: "Visit the showroom", ar: "زُر المعرض" },
  call_label: { en: "Call us", ar: "اتصل بنا" },
  wa_label2: { en: "Message us", ar: "راسلنا" },
  visit_link: { en: "Full showroom details", ar: "تفاصيل المعرض كاملة" },
};

export default function KitchenEnquiry() {
  const { t, lang, dir } = useT();
  const tl = (k: keyof typeof T) => T[k][lang];
  const waHref = `${WHATSAPP}?text=${encodeURIComponent(tl("wa_msg"))}`;

  const info = [
    {
      k: tl("visit_label"),
      v: t("visit_addr"),
      sub: t("visit_hours"),
      href: "https://www.google.com/maps/dir/?api=1&destination=Evora+Future+Home%2C+Wasfi+Al-Tal+St%2C+Khalda%2C+Amman",
    },
    {
      k: tl("call_label"),
      v: PHONE_PRIMARY,
      sub: PHONE_SECONDARY,
      href: `tel:${PHONE_PRIMARY_TEL}`,
    },
    {
      k: tl("wa_label2"),
      v: t("wa_label"),
      sub: PHONE_SECONDARY,
      href: waHref,
    },
  ];

  return (
    <section id="kitchen-enquiry" className="keq" dir={dir} lang={lang}>
      <div className="container keq__inner">
        <Rise as="header" className="keq__head">
          <span className="eyebrow keq__eyebrow">{tl("eyebrow")}</span>
          <h2 className="display keq__h">{tl("heading")}</h2>
          <p className="keq__lead">{tl("lead")}</p>

          <div className="keq__cta">
            <Magnetic strength={0.28}>
              <button type="button" className="btn keq__cta-1" onClick={openStartProject}>
                {t("cfg_cta")} <span className="arrow">→</span>
              </button>
            </Magnetic>
            <a href={waHref} target="_blank" rel="noopener noreferrer" className="keq__cta-wa">
              {t("wa_label")}
            </a>
          </div>
        </Rise>

        <Rise delay={0.12} as="ul" className="keq__info">
          {info.map((row, i) => (
            <li className="keq__row" key={i}>
              <a
                className="keq__rowlink"
                href={row.href}
                target={row.href.startsWith("http") ? "_blank" : undefined}
                rel={row.href.startsWith("http") ? "noopener noreferrer" : undefined}
              >
                <span className="keq__rowk">{row.k}</span>
                <span className="keq__rowv">{row.v}</span>
                <span className="keq__rowsub">{row.sub}</span>
              </a>
            </li>
          ))}
        </Rise>

        <Rise delay={0.18} className="keq__foot">
          <a href="/visit" className="keq__more">
            {tl("visit_link")} <span aria-hidden>↗</span>
          </a>
        </Rise>
      </div>

      <style>{css}</style>
    </section>
  );
}

const css = `
  .keq { position: relative; background: #0d0b09; color: #fbf7f0; padding-block: clamp(4.5rem, 10vw, 8.5rem); }
  .keq__inner { display: flex; flex-direction: column; gap: clamp(2.4rem, 5vw, 3.6rem); }

  .keq__head { max-width: 62ch; }
  .keq__eyebrow { color: var(--brass-2); display: block; }
  .keq__h { font-size: clamp(2.4rem, 5.4vw, 4.4rem); line-height: 1.03; margin: 1rem 0 0; color: #fbf7f0; }
  .keq__lead { color: rgba(251,247,240,0.78); font-size: clamp(1rem, 1.3vw, 1.16rem);
    line-height: 1.65; margin: 1.2rem 0 0; max-width: 56ch; }

  .keq__cta { margin-top: clamp(1.6rem, 3vw, 2.2rem); display: flex; align-items: center; gap: 1.2rem; flex-wrap: wrap; }
  .keq__cta-1 { background: var(--brass-2, #c8a972); color: #16140f; border-color: var(--brass-2, #c8a972);
    display: inline-flex; align-items: center; gap: 0.6em; }
  .keq__cta-1:hover { transform: translateY(-2px); filter: brightness(1.05); }
  .keq__cta-wa { color: rgba(251,247,240,0.85); font-size: 0.95rem; text-decoration: none;
    border-bottom: 1px solid rgba(251,247,240,0.32); padding-bottom: 2px; min-height: 44px;
    display: inline-flex; align-items: center; transition: color 0.3s var(--ease), border-color 0.3s var(--ease); }
  .keq__cta-wa:hover { color: #fbf7f0; border-color: var(--brass-2, #c8a972); }

  /* keyboard focus on this dark band: the page's brass ring reads better here
     in the lighter on-dark brass, same convention as ConfiguratorScroll's panel */
  .keq .keq__cta-1:focus-visible,
  .keq .keq__cta-wa:focus-visible,
  .keq .keq__rowlink:focus-visible,
  .keq .keq__more:focus-visible {
    outline: 2px solid var(--brass-2, #c8a972); outline-offset: 3px;
  }

  .keq__info { list-style: none; margin: 0; padding: clamp(1.6rem, 3vw, 2.2rem) 0 0;
    border-top: 1px solid rgba(251,247,240,0.16);
    display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(1rem, 2.4vw, 2rem); }
  .keq__row { position: relative; }
  .keq__row + .keq__row::before {
    content: ""; position: absolute; inset-inline-start: calc(-1 * clamp(0.5rem, 1.2vw, 1rem));
    top: 8%; bottom: 8%; width: 1px; background: rgba(251,247,240,0.14);
  }
  .keq__rowlink { display: flex; flex-direction: column; gap: 0.35rem; padding: 0.4rem 0;
    border-radius: 6px; transition: opacity 0.3s var(--ease); }
  .keq__rowlink:hover { opacity: 0.78; }
  .keq__rowk { font-size: 0.62rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--brass-2); }
  html[dir="rtl"] .keq__rowk { letter-spacing: 0.05em; }
  .keq__rowv { font-family: var(--font-display); font-size: clamp(1.05rem, 1.5vw, 1.28rem);
    color: #fbf7f0; line-height: 1.25; }
  .keq__rowsub { font-size: 0.84rem; color: rgba(251,247,240,0.6); }

  .keq__foot { display: flex; }
  .keq__more { display: inline-flex; align-items: center; gap: 0.5em; color: rgba(251,247,240,0.72);
    font-size: 0.86rem; text-decoration: none; border-bottom: 1px solid rgba(251,247,240,0.26);
    padding-bottom: 2px; min-height: 44px; transition: color 0.3s var(--ease), border-color 0.3s var(--ease); }
  .keq__more:hover { color: #fbf7f0; border-color: var(--brass-2, #c8a972); }

  @media (max-width: 760px) {
    .keq__info { grid-template-columns: 1fr; gap: 1.3rem; }
    .keq__row + .keq__row::before { display: none; }
    .keq__row + .keq__row { padding-top: 1.1rem; border-top: 1px solid rgba(251,247,240,0.12); }
    .keq__cta { width: 100%; }
    .keq__cta-1 { width: 100%; justify-content: center; min-height: 46px; }
  }
`;
