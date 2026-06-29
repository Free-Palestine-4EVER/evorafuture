"use client";

import { useT } from "@/lib/i18n";
import { Rise, RevealLines, Magnetic } from "@/components/motion";
import { openStartProject } from "@/lib/startProject";
// Evora Future Home — Wasfi Al-Tal St., Khalda, Amman
const MAPS_DIR =
  "https://www.google.com/maps/dir/?api=1&destination=Evora+Future+Home%2C+Wasfi+Al-Tal+St%2C+Khalda%2C+Amman";
const MAPS_EMBED =
  "https://www.google.com/maps?q=Evora+Future+Home%2C+Wasfi+Al-Tal+St%2C+Khalda%2C+Amman&ll=31.9929926,35.8638714&z=16&output=embed";

// new strings live here (component-local dict, like DesignRequest.tsx)
const T = {
  expect_eyebrow: { en: "Before you come", ar: "قبل أن تأتي" },
  expect_title: { en: "What to expect on a visit", ar: "ماذا تتوقّع في زيارتك" },
  hours_label: { en: "Opening hours", ar: "ساعات العمل" },
  e1_t: { en: "Walk the full collection", ar: "تجوّل في المجموعة كاملة" },
  e1_d: {
    en: "Sofas, beds, dining and décor — styled in real room sets you can sit in.",
    ar: "كنب وأسرّة وسفرة وديكور — منسّقة في غرف حقيقية تستطيع الجلوس فيها.",
  },
  e2_t: { en: "Bring your floor plan", ar: "أحضِر مخططك" },
  e2_d: {
    en: "Hand us your 2D plan and we'll start your 3D home on the spot.",
    ar: "سلّمنا مخططك ثنائي الأبعاد ونبدأ منزلك ثلاثي الأبعاد على الفور.",
  },
  e3_t: { en: "Sit with a designer", ar: "اجلس مع مصمّم" },
  e3_d: {
    en: "A specialist walks you through finishes, fabrics and layout — no rush.",
    ar: "يأخذك مختص في التشطيبات والأقمشة والتوزيع — دون أي استعجال.",
  },
  e4_t: { en: "Free parking & coffee", ar: "موقف مجاني وقهوة" },
  e4_d: {
    en: "Easy parking right out front, and Arabic coffee on us while you browse.",
    ar: "موقف سهل أمام المعرض مباشرة، وقهوة عربية على حسابنا أثناء تجوّلك.",
  },
};

// split a title into two balanced lines for the masked reveal
function lines(text: string): string[] {
  const w = text.split(" ");
  if (w.length < 2) return [text];
  const c = Math.ceil(w.length / 2);
  return [w.slice(0, c).join(" "), w.slice(c).join(" ")];
}

export default function Visit() {
  const { t, lang } = useT();
  const en = lang === "en";
  const x = (k: keyof typeof T) => T[k][lang];

  const expect = [
    { t: x("e1_t"), d: x("e1_d") },
    { t: x("e2_t"), d: x("e2_d") },
    { t: x("e3_t"), d: x("e3_d") },
    { t: x("e4_t"), d: x("e4_d") },
  ];

  const registry = [
    {
      n: "01",
      label: en ? "The Showroom" : "المعرض",
      value: t("visit_addr"),
      sub: en ? "By appointment & walk-in" : "بموعد أو زيارة مباشرة",
      href: MAPS_DIR,
    },
    {
      n: "02",
      label: en ? "Opening Hours" : "ساعات العمل",
      value: t("visit_hours"),
      sub: en ? "Friday — by appointment" : "الجمعة — بموعد مسبق",
      href: undefined as string | undefined,
    },
    {
      n: "03",
      label: en ? "Call the Showroom" : "اتصل بالمعرض",
      value: "+962 79 130 1444",
      sub: en ? "Or +962 79 636 4105 · tap to call" : "أو ٤١٠٥ ٦٣٦ ٧٩ ٩٦٢+ · اضغط للاتصال",
      href: "tel:+962791301444",
    },
    {
      n: "04",
      label: en ? "Find Us" : "تابعونا",
      value: "@evorafuturehome",
      sub: en ? "Instagram · Facebook · WhatsApp" : "إنستغرام · فيسبوك · واتساب",
      href: "https://instagram.com/evorafuturehome",
    },
  ];

  return (
    <section id="visit" className="vst" lang={lang}>
      <span className="vst__edge" aria-hidden>
        {en ? "Amman — Jordan" : "عمّان — الأردن"}
      </span>

      <div className="container vst__inner">
        {/* header */}
        <div className="vst__head">
          <Rise as="span" className="eyebrow vst__eyebrow">
            {t("visit_eyebrow")}
          </Rise>
          <Rise as="span" delay={0.06} className="vst__coords">
            31.99° N · 35.84° E
          </Rise>
        </div>

        {/* ── ONE section: storefront photo (with the title on it) + live map ── */}
        <div className="vst__stage">
          {/* photo with "Come find your space" overlaid */}
          <Rise className="vst__store">
            <img
              src="/evora/storefront.webp"
              alt={en ? "Evora Future Home showroom — Khalda, Amman" : "معرض إيفورا فيوتشر هوم — خلدا، عمّان"}
              className="vst__store-img"
              loading="lazy"
            />
            <span className="vst__store-overlay" aria-hidden />
            <span className="vst__store-grain" aria-hidden />
            <div className="vst__store-cap">
              <span className="vst__store-badge">{en ? "Our Showroom · Evora Future Home" : "معرضنا · إيفورا فيوتشر هوم"}</span>
              <RevealLines
                lines={lines(t("visit_title"))}
                className="display vst__store-title"
                delay={0.08}
              />
              <span className="vst__store-addr">
                {en
                  ? "Wasfi Al-Tal St · Khalda · Amman — opposite Paradise Bakeries"
                  : "شارع وصفي التل · خلدا · عمّان — مقابل أفران الجنّة"}
              </span>
              <div className="vst__store-actions">
                <Magnetic strength={0.3}>
                  <button type="button" onClick={openStartProject} className="btn vst__btn-solid">
                    {t("consult")} <span className="arrow">→</span>
                  </button>
                </Magnetic>
                <a href="tel:+962791301444" className="vst__store-dir">
                  {en ? "Call us" : "اتصل بنا"} <span aria-hidden>↗</span>
                </a>
                <a href={MAPS_DIR} target="_blank" rel="noopener noreferrer" className="vst__store-dir">
                  {en ? "Get directions" : "احصل على الاتجاهات"} <span aria-hidden>↗</span>
                </a>
              </div>
            </div>
          </Rise>

          {/* live map — same frame, same height = one unit */}
          <Rise delay={0.14} className="vst__plate">
            <div className="vst__map">
              <iframe
                className="vst__iframe"
                src={MAPS_EMBED}
                title={en ? "Evora — Khalda, Amman" : "إيفورا — خلدا، عمّان"}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <span className="vst__tint" aria-hidden />
              <a
                href={MAPS_DIR}
                target="_blank"
                rel="noopener noreferrer"
                className="vst__plaque"
              >
                <span className="vst__plaque-pin">
                  <span className="vst__plaque-pulse" />
                </span>
                <span className="vst__plaque-text">
                  <span>{en ? "Khalda · Amman" : "خلدا · عمّان"}</span>
                  <span className="vst__plaque-cta">
                    {en ? "Open in Maps" : "افتح في الخرائط"} ↗
                  </span>
                </span>
              </a>
            </div>
          </Rise>
        </div>

        {/* details strip under the unified stage */}
        <ul className="vst__details">
          {registry.map((r) => {
            const inner = (
              <>
                <span className="vst__n">{r.n}</span>
                <span className="vst__entry-body">
                  <span className="vst__label">{r.label}</span>
                  <span className="vst__value">{r.value}</span>
                  <span className="vst__sub">
                    {r.sub}
                    {r.href && <span className="vst__go" aria-hidden> ↗</span>}
                  </span>
                </span>
              </>
            );
            return (
              <li className="vst__entry" key={r.n}>
                {r.href ? (
                  <a
                    className="vst__entry-in vst__entry-in--link"
                    href={r.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="hover"
                  >
                    {inner}
                  </a>
                ) : (
                  <div className="vst__entry-in">{inner}</div>
                )}
              </li>
            );
          })}
        </ul>

        {/* compact "what to expect / opening hours" card */}
        <Rise className="vst__expect">
          <div className="vst__expect-aside">
            <span className="eyebrow vst__expect-eyebrow">{x("expect_eyebrow")}</span>
            <RevealLines
              lines={lines(x("expect_title"))}
              className="display vst__expect-title"
              delay={0.06}
            />
            <div className="vst__expect-hours">
              <span className="vst__expect-hours-label">{x("hours_label")}</span>
              <span className="vst__expect-hours-val">{t("visit_hours")}</span>
            </div>
          </div>
          <ul className="vst__expect-list">
            {expect.map((e, i) => (
              <li className="vst__expect-item" key={i}>
                <span className="vst__expect-n">{String(i + 1).padStart(2, "0")}</span>
                <span className="vst__expect-body">
                  <span className="vst__expect-h">{e.t}</span>
                  <span className="vst__expect-d">{e.d}</span>
                </span>
              </li>
            ))}
          </ul>
        </Rise>
      </div>

      <style>{`
        .vst {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          background: var(--paper);
          color: var(--ink);
          padding-block: clamp(5rem, 11vw, 11rem);
        }
        /* warm atmosphere, never flat */
        .vst::before {
          content: "";
          position: absolute; inset: 0; z-index: -1; pointer-events: none;
          background:
            radial-gradient(55% 45% at 100% 0%, rgba(197,160,106,0.12), transparent 60%),
            radial-gradient(60% 60% at 0% 100%, rgba(54,65,47,0.07), transparent 60%);
        }
        .vst__edge {
          position: absolute;
          top: 50%; inset-inline-end: clamp(0.4rem, 1.5vw, 1.4rem);
          transform: translateY(-50%) rotate(180deg);
          writing-mode: vertical-rl;
          font-size: 0.66rem; letter-spacing: 0.42em; text-transform: uppercase;
          color: var(--ink-faint); opacity: 0.5;
          pointer-events: none; user-select: none;
        }
        html[dir="rtl"] .vst__edge { inset-inline-end: auto; inset-inline-start: clamp(0.4rem,1.5vw,1.4rem); letter-spacing: 0.1em; }

        .vst__inner { position: relative; z-index: 1; }
        .vst__head {
          display: flex; align-items: baseline; justify-content: space-between;
          gap: 1rem; flex-wrap: wrap;
          padding-bottom: clamp(2rem, 4vw, 3.2rem);
          border-bottom: 1px solid var(--line);
        }
        .vst__eyebrow {
          display: inline-flex; align-items: center; gap: 0.7rem;
          color: var(--brass);
        }
        .vst__eyebrow::before { content: ""; width: 34px; height: 1px; background: var(--brass); }
        .vst__coords {
          font-family: var(--font-display);
          font-style: italic;
          font-size: 0.92rem;
          color: var(--ink-faint);
          letter-spacing: 0.02em;
        }
        html[dir="rtl"] .vst__coords { font-style: normal; }

        .vst__entry {
          position: relative;
          display: grid;
          grid-template-columns: auto 1fr;
          gap: clamp(1rem, 2vw, 1.6rem);
          padding: clamp(1.1rem, 2vw, 1.5rem) 0;
        }
        .vst__entry:first-child { padding-top: 0; }
        .vst__n {
          font-family: var(--font-display);
          font-size: clamp(1.5rem, 2.4vw, 2.1rem);
          line-height: 1;
          color: var(--brass);
          padding-top: 0.1rem;
          letter-spacing: 0.02em;
        }
        .vst__entry-body { display: flex; flex-direction: column; gap: 0.3rem; }
        .vst__label {
          font-size: 0.66rem; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--ink-faint);
        }
        html[dir="rtl"] .vst__label { letter-spacing: 0.05em; }
        .vst__value {
          font-family: var(--font-display);
          font-weight: 400;
          font-size: clamp(1.15rem, 1.6vw, 1.42rem);
          line-height: 1.3;
          color: var(--ink);
        }
        .vst__sub { font-size: 0.84rem; color: var(--ink-faint); }
        .vst__btn-solid {
          background: var(--ever); color: var(--paper); border-color: var(--ever);
        }
        .vst__btn-solid:hover { background: var(--ink); border-color: var(--ink); transform: translateY(-2px); }

        /* ── unified stage: photo + map framed as one section ── */
        .vst__stage {
          display: grid;
          grid-template-columns: minmax(0, 1.3fr) minmax(0, 0.95fr);
          gap: 9px;
          margin-top: clamp(2.4rem, 5vw, 4rem);
          padding: 9px;
          border-radius: 7px;
          background: var(--paper);
          box-shadow:
            0 0 0 1px rgba(169,130,76,0.40),
            0 0 0 8px rgba(169,130,76,0.16),
            0 50px 100px -54px rgba(27,25,22,0.55);
        }
        .vst__stage > * { min-height: clamp(440px, 58vh, 680px); }

        /* photo cell with the title on it */
        .vst__store {
          position: relative; overflow: hidden; border-radius: 3px;
        }
        .vst__store-img {
          position: absolute; inset: 0;
          width: 100%; height: 100%; object-fit: cover;
          transform: scale(1.03);
          transition: transform 1.6s var(--ease);
        }
        .vst__store:hover .vst__store-img { transform: scale(1.08); }
        .vst__store-overlay {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background:
            linear-gradient(180deg, rgba(16,15,13,0.12) 0%, rgba(16,15,13,0) 28%),
            linear-gradient(90deg, rgba(16,15,13,0.55) 0%, rgba(16,15,13,0.12) 46%, rgba(16,15,13,0) 72%),
            linear-gradient(0deg, rgba(16,15,13,0.80) 0%, rgba(16,15,13,0) 58%);
        }
        .vst__store-grain {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          opacity: 0.22; mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 160px;
        }
        .vst__store-cap {
          position: absolute; z-index: 2;
          inset-inline-start: clamp(1.4rem, 3vw, 2.8rem);
          inset-inline-end: clamp(1.4rem, 3vw, 2.8rem);
          bottom: clamp(1.5rem, 3.5vw, 2.8rem);
          display: flex; flex-direction: column; gap: 0.65rem;
          color: var(--paper);
        }
        .vst__store-badge {
          align-self: flex-start;
          font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--ink);
          background: rgba(251,247,240,0.92);
          padding: 0.42em 0.9em; border-radius: 100px;
        }
        html[dir="rtl"] .vst__store-badge { letter-spacing: 0.05em; }
        .vst__store-title {
          font-size: clamp(2rem, 4.4vw, 3.7rem); line-height: 1.0; color: var(--paper);
          font-weight: 360; letter-spacing: -0.01em; margin: 0.15rem 0 0.1rem;
          text-shadow: 0 2px 28px rgba(0,0,0,0.5);
        }
        html[dir="rtl"] .vst__store-title { line-height: 1.18; letter-spacing: 0; }
        .vst__store-addr {
          font-size: clamp(0.86rem, 1.2vw, 1.02rem); color: rgba(251,247,240,0.88);
          letter-spacing: 0.02em; text-shadow: 0 1px 10px rgba(0,0,0,0.45);
        }
        .vst__store-actions { display: flex; flex-wrap: wrap; gap: 0.7rem; margin-top: 0.7rem; }
        .vst__store-dir {
          display: inline-flex; align-items: center; gap: 0.4rem;
          font-size: 0.86rem; font-weight: 600; color: var(--ink);
          background: rgba(251,247,240,0.95);
          backdrop-filter: blur(7px); -webkit-backdrop-filter: blur(7px);
          padding: 0.85rem 1.2rem; border-radius: 100px;
          transition: transform 0.4s var(--ease), background 0.4s var(--ease);
        }
        .vst__store-dir:hover { transform: translateY(-2px); background: var(--brass-2); }

        /* details strip under the stage */
        .vst__details {
          list-style: none; margin: clamp(1.8rem,3.5vw,2.6rem) 0 0; padding: clamp(1.4rem,3vw,2rem) 0 0;
          display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(0.4rem, 1.2vw, 1.2rem);
          border-top: 1px solid var(--line);
        }
        .vst__details .vst__entry { padding: 0; }
        .vst__entry-in {
          display: grid; grid-template-columns: auto 1fr; align-items: start;
          gap: clamp(0.9rem, 1.8vw, 1.5rem); height: 100%;
          padding: clamp(1rem, 1.8vw, 1.5rem) clamp(0.9rem, 1.6vw, 1.4rem);
          border-radius: 8px;
          transition: background 0.4s var(--ease), transform 0.4s var(--ease);
        }
        a.vst__entry-in--link:hover { background: rgba(138,106,60,0.07); transform: translateY(-3px); }
        .vst__entry + .vst__entry .vst__entry-in { position: relative; }
        .vst__entry + .vst__entry .vst__entry-in::before {
          content: ""; position: absolute; inset-inline-start: calc(-1 * clamp(0.2rem, 0.6vw, 0.6rem));
          top: 14%; bottom: 14%; width: 1px; background: var(--line);
        }
        .vst__go { color: var(--brass); display: inline-block; transition: transform 0.4s var(--ease); }
        html[dir="rtl"] .vst__go { transform: scaleX(-1); }
        a.vst__entry-in--link:hover .vst__go { transform: translate(2px, -2px); }
        html[dir="rtl"] a.vst__entry-in--link:hover .vst__go { transform: translate(-2px, -2px) scaleX(-1); }

        /* ── what to expect / opening hours card ── */
        .vst__expect {
          display: grid;
          grid-template-columns: minmax(0, 0.82fr) minmax(0, 1.18fr);
          gap: clamp(1.6rem, 4vw, 4rem);
          margin-top: clamp(2rem, 4vw, 3.4rem);
          padding: clamp(1.8rem, 3.5vw, 3rem);
          border-radius: 10px;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.55), rgba(255,255,255,0)) var(--bone);
          box-shadow:
            0 0 0 1px rgba(169,130,76,0.28),
            0 36px 80px -56px rgba(27,25,22,0.45);
        }
        .vst__expect-aside { display: flex; flex-direction: column; }
        .vst__expect-eyebrow {
          display: inline-flex; align-items: center; gap: 0.7rem; color: var(--brass);
          align-self: flex-start;
        }
        .vst__expect-eyebrow::before { content: ""; width: 26px; height: 1px; background: var(--brass); }
        .vst__expect-title {
          font-size: clamp(1.7rem, 3.2vw, 2.6rem);
          line-height: 1.04; font-weight: 360; letter-spacing: -0.01em;
          color: var(--ink); margin: 0.9rem 0 0;
        }
        html[dir="rtl"] .vst__expect-title { line-height: 1.22; letter-spacing: 0; }
        .vst__expect-hours {
          margin-top: auto; padding-top: clamp(1.2rem, 2.4vw, 1.8rem);
          display: flex; flex-direction: column; gap: 0.35rem;
        }
        .vst__expect-hours-label {
          font-size: 0.62rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--ink-faint);
        }
        html[dir="rtl"] .vst__expect-hours-label { letter-spacing: 0.05em; }
        .vst__expect-hours-val {
          font-family: var(--font-display); font-size: clamp(1rem, 1.5vw, 1.22rem);
          line-height: 1.4; color: var(--ink);
        }
        .vst__expect-list {
          list-style: none; margin: 0; padding: 0;
          display: grid; grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: clamp(1.1rem, 2.4vw, 1.8rem) clamp(1.6rem, 3vw, 2.6rem);
        }
        .vst__expect-item { display: grid; grid-template-columns: auto 1fr; gap: 0.9rem; align-items: start; }
        .vst__expect-n {
          font-family: var(--font-display); font-size: 0.92rem; line-height: 1.5;
          color: var(--brass); letter-spacing: 0.04em;
        }
        .vst__expect-body { display: flex; flex-direction: column; gap: 0.3rem; }
        .vst__expect-h { font-weight: 600; font-size: 1.02rem; color: var(--ink); line-height: 1.3; }
        .vst__expect-d { font-size: 0.88rem; line-height: 1.55; color: var(--ink-soft); }

        @media (max-width: 860px) {
          .vst__stage { grid-template-columns: 1fr; }
          .vst__stage > * { min-height: 0; }
          .vst__store { aspect-ratio: 16 / 11; }
          .vst__details { grid-template-columns: 1fr; gap: 0.4rem; }
          .vst__entry + .vst__entry .vst__entry-in::before { display: none; }
          .vst__entry + .vst__entry .vst__entry-in { border-top: 1px solid var(--line); }
          .vst__expect { grid-template-columns: 1fr; gap: clamp(1.4rem, 5vw, 2rem); }
          .vst__expect-hours { margin-top: 1rem; }
        }
        @media (max-width: 560px) {
          .vst__expect-list { grid-template-columns: 1fr; }
          /* taller photo so the badge + title + address + actions never clip */
          .vst__store { aspect-ratio: 4 / 5; }
          .vst__store-actions { gap: 0.55rem; }
          /* keep each call/directions chip a comfortable tap target */
          .vst__store-dir { min-height: 44px; }
        }

        /* ── map plate ── */
        .vst__plate { display: block; }
        .vst__map {
          position: relative;
          height: 100%;
          min-height: clamp(440px, 60vh, 720px);
          overflow: hidden;
          border-radius: 3px;
          background: var(--bone);
          box-shadow:
            0 0 0 1px rgba(169,130,76,0.45),
            0 0 0 7px var(--paper),
            0 0 0 8px rgba(169,130,76,0.22),
            0 44px 90px -50px rgba(27,25,22,0.5);
        }
        .vst__iframe {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          border: 0;
          /* tint Google's default palette toward the brand */
          filter: grayscale(0.45) sepia(0.18) saturate(0.78) contrast(1.02) brightness(0.98);
        }
        .vst__tint {
          position: absolute; inset: 0; z-index: 2; pointer-events: none;
          mix-blend-mode: multiply;
          background:
            radial-gradient(120% 120% at 50% 0%, transparent 55%, rgba(54,65,47,0.16)),
            linear-gradient(180deg, rgba(54,65,47,0.05), rgba(27,25,22,0.12));
        }
        .vst__plaque {
          position: absolute; z-index: 3;
          bottom: 1.1rem; inset-inline-start: 1.1rem;
          display: inline-flex; align-items: center; gap: 0.7rem;
          background: rgba(251,247,240,0.95);
          backdrop-filter: blur(7px); -webkit-backdrop-filter: blur(7px);
          padding: 0.7rem 1rem; border-radius: 3px;
          box-shadow: 0 10px 30px -16px rgba(27,25,22,0.5);
          transition: transform 0.4s var(--ease), box-shadow 0.4s var(--ease);
        }
        .vst__plaque:hover { transform: translateY(-2px); box-shadow: 0 16px 36px -16px rgba(27,25,22,0.55); }
        .vst__plaque-pin { position: relative; flex: none; width: 9px; height: 9px; border-radius: 50%; background: var(--clay); }
        .vst__plaque-pulse {
          position: absolute; inset: 0; border-radius: 50%;
          box-shadow: 0 0 0 0 rgba(178,116,87,0.5);
          animation: vstPulse 2.4s var(--ease) infinite;
        }
        .vst__plaque-text { display: flex; flex-direction: column; gap: 0.1rem; line-height: 1.25; }
        .vst__plaque-text > span:first-child { font-size: 0.86rem; font-weight: 600; color: var(--ink); }
        .vst__plaque-cta { font-size: 0.7rem; letter-spacing: 0.04em; color: var(--brass); }

        @keyframes vstPulse {
          0%   { box-shadow: 0 0 0 0 rgba(178,116,87,0.5); }
          70%  { box-shadow: 0 0 0 13px rgba(178,116,87,0); }
          100% { box-shadow: 0 0 0 0 rgba(178,116,87,0); }
        }

        @media (max-width: 860px) {
          .vst__plate { order: -1; }
          .vst__map { min-height: 0; aspect-ratio: 16 / 11; }
          .vst__edge { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .vst__plaque-pulse { animation: none; }
          .vst__plaque, .vst__btn-solid { transition: none; }
        }
      `}</style>
    </section>
  );
}
