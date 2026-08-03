"use client";

import Logo from "./Logo";
import { useT } from "@/lib/i18n";
import { Rise } from "@/components/motion";
import SocialFollow from "@/components/SocialFollow";

export default function Footer() {
  const { t, lang } = useT();
  const en = lang === "en";

  const explore: { href: string; en: string; ar: string }[] = [
    { href: "/shop", en: "Shop", ar: "تسوّق" },
    { href: "/shop/rooms", en: "Shop by Room", ar: "تسوّق حسب الغرفة" },
    { href: "/showroom", en: "Virtual Showroom", ar: "المعرض الافتراضي" },
    { href: "/kitchen", en: "Kitchen Islands", ar: "جزر المطبخ" },
    { href: "/how-it-works", en: "Design Service", ar: "خدمة التصميم" },
    { href: "/visit", en: "Visit Us", ar: "زورونا" },
  ];

  const social = [
    { label: "Instagram", href: "https://www.instagram.com/evorafuturehome/" },
    { label: "Facebook", href: "https://www.facebook.com/EvoraFutureHome/" },
    { label: "WhatsApp", href: "https://wa.me/962796364105" },
  ];

  return (
    <footer className="ft" lang={lang}>
      <style>{`
        .ft {
          background: var(--paper);
          color: var(--ink);
          padding-top: clamp(3.5rem, 7vw, 6rem);
          border-top: 1px solid var(--line);
        }

        /* ---- link columns ---- */
        .ft__cols {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1fr;
          gap: clamp(2rem, 4vw, 4rem);
          padding-block: clamp(2.5rem, 5vw, 4rem);
          border-bottom: 1px solid var(--line);
        }
        .ft__brand { max-width: 30ch; }
        .ft__rights {
          margin: 1.4rem 0 0;
          color: var(--ink-faint);
          font-family: var(--font-display);
          font-style: ${en ? "italic" : "normal"};
          font-size: 0.92rem;
          line-height: 1.6;
        }
        .ft__cap {
          display: block;
          font-size: 0.62rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--ink-faint);
          margin-bottom: 1.1rem;
        }
        html[lang="ar"] .ft__cap { letter-spacing: 0.05em; }
        .ft__list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.7rem; }
        .ft__link {
          color: var(--ink-soft);
          font-size: 0.92rem;
          transition: color 0.3s var(--ease);
        }
        .ft__link:hover { color: var(--ever); }
        .ft__addr { margin: 0; color: var(--ink-soft); font-size: 0.92rem; line-height: 1.7; }

        /* ---- legal bar ---- */
        .ft__legal {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
          padding-block: 1.6rem;
          font-size: 0.76rem;
          color: var(--ink-faint);
        }

        @media (max-width: 860px) {
          .ft__cols { grid-template-columns: 1fr 1fr; }
          .ft__brand { grid-column: 1 / -1; }
        }
        @media (max-width: 520px) {
          .ft__cols { grid-template-columns: 1fr; }
        }
        /* phone: make every link a comfortable 44px tap target (incl. the
           tel: numbers) */
        @media (max-width: 640px) {
          .ft__list { gap: 0.15rem; }
          .ft__link { display: inline-flex; align-items: center; min-height: 44px; }
          .ft__addr a.ft__link { min-height: 40px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ft__link { transition: none; }
        }
      `}</style>

      <div className="container">
        {/* follow band — replaces the old email-capture band. See SocialFollow.tsx. */}
        <SocialFollow />

        {/* columns */}
        <div className="ft__cols">
          <Rise className="ft__brand">
            <Logo tone="ink" size={1.25} />
            <p className="ft__rights">{t("footer_rights")}</p>
          </Rise>

          <Rise delay={0.06} as="nav">
            <span className="ft__cap">{en ? "Explore" : "استكشف"}</span>
            <ul className="ft__list">
              {explore.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="ft__link">{en ? l.en : l.ar}</a>
                </li>
              ))}
            </ul>
          </Rise>

          <Rise delay={0.12}>
            <span className="ft__cap">{en ? "Connect" : "تواصل"}</span>
            <ul className="ft__list">
              {social.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="ft__link">{s.label}</a>
                </li>
              ))}
            </ul>
          </Rise>

          <Rise delay={0.18}>
            <span className="ft__cap">{en ? "Visit" : "زورونا"}</span>
            <p className="ft__addr">
              {t("visit_addr")}
              <br />
              {t("visit_hours")}
            </p>
            <p className="ft__addr" style={{ marginTop: "0.7rem" }}>
              <a href="tel:+962791301444" className="ft__link">+962 79 130 1444</a>
              <br />
              <a href="tel:+962796364105" className="ft__link">+962 79 636 4105</a>
            </p>
          </Rise>
        </div>

        {/* legal */}
        <div className="ft__legal">
          <span>© {2026} Evora · {t("footer_tag")}</span>
        </div>
      </div>
    </footer>
  );
}
