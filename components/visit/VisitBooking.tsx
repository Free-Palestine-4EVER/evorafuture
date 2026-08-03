"use client";

import { useEffect, useRef, useState } from "react";
import { useT } from "@/lib/i18n";
import { Rise, RevealLines, motion, EASE } from "@/components/motion";
import { createLead } from "@/lib/portal/store";
import { WHATSAPP, PHONE_PRIMARY, PHONE_PRIMARY_TEL } from "@/lib/brand";

// The booking mechanism for /visit. This is a purpose-built visit-request
// form wired to the site's one real lead pipeline — createLead() posts to
// /api/portal/leads, the exact same endpoint StartProjectModal.tsx and
// DesignRequest.tsx already use in production. "Preferred day/time" and
// "what to see" get their own fields for a clear UX, then fold into the
// lead's `message` field so the portal — no schema change needed — still
// shows every detail.
// A prefilled WhatsApp deep link (same `${WHATSAPP}?text=` pattern as
// ConfiguratorScroll.tsx / KitchenEnquiry.tsx) and a tap-to-call number sit
// beside the form for anyone who'd rather not fill it in.
const T = {
  eyebrow: { en: "Plan Your Visit", ar: "خطّط لزيارتك" },
  title: { en: "Let's find you a time.", ar: "لنحدّد لك موعدًا." },
  lead: {
    en: "Leave your number and when you'd like to come, and we'll confirm it. Rather not wait? Walk in any day we're open.",
    ar: "اترك رقمك والوقت الذي يناسبك، وسنؤكده لك. تفضّل عدم الانتظار؟ تفضّل بزيارتنا في أي يوم نكون فيه مفتوحين.",
  },
  card_label: { en: "Visit request", ar: "طلب زيارة" },
  optional: { en: "Optional", ar: "اختياري" },
  name: { en: "Your name", ar: "اسمك" },
  name_ph: { en: "First and last name", ar: "الاسم الأول والعائلة" },
  name_err: { en: "Please tell us your name.", ar: "الرجاء إدخال اسمك." },
  phone: { en: "Phone / WhatsApp number", ar: "رقم الهاتف / واتساب" },
  phone_err:{ en: "Please enter a valid phone number.", ar: "الرجاء إدخال رقم هاتف صحيح." },
  when: { en: "Preferred day & time", ar: "اليوم والوقت المفضّل" },
  when_ph: { en: "e.g. Tuesday, around 6 PM", ar: "مثلاً: الثلاثاء، حوالي الساعة السادسة مساءً" },
  see: { en: "What would you like to see?", ar: "ماذا تودّ أن ترى؟" },
  see_ph: { en: "Sofas, a kitchen island, bedroom sets…", ar: "كنب، جزيرة مطبخ، غرف نوم…" },
  submit: { en: "Request my visit", ar: "أرسل طلب الزيارة" },
  sending: { en: "Sending…", ar: "جارٍ الإرسال…" },
  done_t: { en: "Got it — we'll confirm your visit.", ar: "تم — سنؤكد لك موعد الزيارة." },
  done_s: {
    en: "Our team will call the number you gave us to lock in the time.",
    ar: "سيتصل بك فريقنا على الرقم الذي تركته لتثبيت الموعد.",
  },
  again: { en: "Send another request", ar: "أرسل طلبًا آخر" },
  err: {
    en: "That didn't send. Please try again — or reach us directly:",
    ar: "لم يتم إرسال الطلب. حاول مرة أخرى — أو تواصل معنا مباشرة:",
  },
  err_wa: { en: "Open WhatsApp", ar: "افتح واتساب" },
  hours_k: { en: "We're open", ar: "أوقات العمل" },
  call_k: { en: "Call the showroom", ar: "اتصل بالمعرض" },
  wa_k: { en: "Message us", ar: "راسلنا" },
  wa_msg: {
    en: "Hi Evora! I'd like to book a visit to the Khalda showroom.",
    ar: "مرحبًا إيفورا! أودّ حجز زيارة لمعرض خلدا.",
  },
  pref_label: { en: "Preferred", ar: "الوقت المفضّل" },
  see_label: { en: "Wants to see", ar: "يريد رؤية" },
  fallback_msg: { en: "Showroom visit request", ar: "طلب زيارة المعرض" },
};

export default function VisitBooking() {
  const { t, lang, dir } = useT();
  const tl = (k: keyof typeof T) => T[k][lang];

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [when, setWhen] = useState("");
  const [see, setSee] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);
  const [touched, setTouched] = useState({ name: false, phone: false });
  const doneRef = useRef<HTMLHeadingElement>(null);

  const nameValid = name.trim().length > 1;
  const phoneValid = phone.replace(/\D/g, "").length >= 7;
  const showNameErr = touched.name && !nameValid;
  const showPhoneErr = touched.phone && !phoneValid;

  const waHref = `${WHATSAPP}?text=${encodeURIComponent(tl("wa_msg"))}`;

  // Move focus to the confirmation so a screen-reader user is told the
  // request landed, instead of being left on a button that no longer exists.
  useEffect(() => {
    if (done) doneRef.current?.focus();
  }, [done]);

  function reset() {
    setName("");
    setPhone("");
    setWhen("");
    setSee("");
    setTouched({ name: false, phone: false });
    setError(false);
    setDone(false);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ name: true, phone: true });
    setError(false);
    if (!nameValid || !phoneValid || busy) return;
    setBusy(true);
    const bits = [
      when.trim() ? `${tl("pref_label")}: ${when.trim()}` : "",
      see.trim() ? `${tl("see_label")}: ${see.trim()}` : "",
    ]
      .filter(Boolean)
      .join(" — ");
    try {
      // createLead() in lib/portal/store.ts does `(await post(...)).json()` and
      // never checks res.ok — so a 4xx/5xx whose body happens to be JSON would
      // resolve and this form would show a confirmation for a lead that was
      // never stored. A created lead always comes back with a server-minted
      // `id` (see db.createLead in lib/portal/serverdb.ts), so verify that
      // instead of trusting the promise resolving. Local to this form: the
      // shared helper is used by StartProjectModal and DesignRequest too.
      const lead = await createLead(name.trim(), phone.trim(), bits || tl("fallback_msg"));
      if (!lead || typeof lead.id !== "string" || !lead.id) throw new Error("LEAD_NOT_CREATED");
      setDone(true);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section id="book" className="vbk" dir={dir} lang={lang}>
      <span className="vbk__glow" aria-hidden />

      <div className="container vbk__inner">
        <Rise as="div" className="vbk__side">
          <span className="eyebrow vbk__eyebrow">{tl("eyebrow")}</span>
          <RevealLines lines={[tl("title")]} className="display vbk__title" delay={0.06} />
          <p className="vbk__lead">{tl("lead")}</p>

          <dl className="vbk__quick">
            <div className="vbk__quickrow">
              <dt className="vbk__quickk">{tl("hours_k")}</dt>
              <dd className="vbk__quickv vbk__quickv--plain">{t("visit_hours")}</dd>
            </div>
            <div className="vbk__quickrow">
              <dt className="vbk__quickk">{tl("call_k")}</dt>
              <dd>
                <a className="vbk__quicklink" href={`tel:${PHONE_PRIMARY_TEL}`}>
                  {/* <bdi dir="ltr"> — an Arabic (RTL) paragraph would otherwise
                      reorder the number to "1444 130 79 962+". */}
                  <span className="vbk__quickv"><bdi dir="ltr">{PHONE_PRIMARY}</bdi></span>
                  <span className="vbk__arrow" aria-hidden>↗</span>
                </a>
              </dd>
            </div>
            <div className="vbk__quickrow">
              <dt className="vbk__quickk">{tl("wa_k")}</dt>
              <dd>
                <a
                  className="vbk__quicklink"
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="vbk__quickv">{t("wa_label")}</span>
                  <span className="vbk__arrow" aria-hidden>↗</span>
                </a>
              </dd>
            </div>
          </dl>
        </Rise>

        <Rise as="div" delay={0.12} className="vbk__card">
          <div className="vbk__cardhead">
            <span className="vbk__cardlabel">{tl("card_label")}</span>
            <span className="vbk__cardrule" aria-hidden />
          </div>

          {done ? (
            <div className="vbk__done" role="status">
              <motion.span
                className="vbk__check"
                aria-hidden
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 16 }}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <motion.path
                    d="M5 12.5l4.2 4.2L19 7"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, ease: EASE, delay: 0.16 }}
                  />
                </svg>
              </motion.span>
              <h3 className="vbk__donet" ref={doneRef} tabIndex={-1}>
                {tl("done_t")}
              </h3>
              <p className="vbk__dones">{tl("done_s")}</p>
              <button type="button" className="vbk__again" onClick={reset}>
                {tl("again")}
              </button>
            </div>
          ) : (
            <form className="vbk__form" onSubmit={submit} noValidate aria-busy={busy}>
              <fieldset className="vbk__set" disabled={busy}>
                <div className="vbk__row">
                  <div className="vbk__field">
                    <label htmlFor="vbk-name">{tl("name")}</label>
                    <input
                      id="vbk-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      autoCapitalize="words"
                      placeholder={tl("name_ph")}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onBlur={() => setTouched((s) => ({ ...s, name: true }))}
                      aria-invalid={showNameErr || undefined}
                      aria-describedby={showNameErr ? "vbk-name-err" : undefined}
                      className={showNameErr ? "is-invalid" : ""}
                      required
                    />
                    {showNameErr && (
                      <span id="vbk-name-err" className="vbk__err" role="alert">
                        {tl("name_err")}
                      </span>
                    )}
                  </div>

                  <div className="vbk__field">
                    <label htmlFor="vbk-phone">{tl("phone")}</label>
                    <input
                      id="vbk-phone"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      /* dir="ltr" so a number typed on the Arabic page reads
                         "+962 79 …" and not "… 79 962+"; the RTL rule below
                         keeps it flush with the other fields' start edge. */
                      dir="ltr"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onBlur={() => setTouched((s) => ({ ...s, phone: true }))}
                      aria-invalid={showPhoneErr || undefined}
                      aria-describedby={showPhoneErr ? "vbk-phone-err" : undefined}
                      className={showPhoneErr ? "is-invalid" : ""}
                      required
                    />
                    {showPhoneErr && (
                      <span id="vbk-phone-err" className="vbk__err" role="alert">
                        {tl("phone_err")}
                      </span>
                    )}
                  </div>
                </div>

                <div className="vbk__field">
                  <label htmlFor="vbk-when">
                    {tl("when")} <span className="vbk__opt">{tl("optional")}</span>
                  </label>
                  <input
                    id="vbk-when"
                    name="preferred"
                    type="text"
                    autoComplete="off"
                    placeholder={tl("when_ph")}
                    value={when}
                    onChange={(e) => setWhen(e.target.value)}
                  />
                </div>

                <div className="vbk__field">
                  <label htmlFor="vbk-see">
                    {tl("see")} <span className="vbk__opt">{tl("optional")}</span>
                  </label>
                  <textarea
                    id="vbk-see"
                    name="interest"
                    rows={3}
                    placeholder={tl("see_ph")}
                    value={see}
                    onChange={(e) => setSee(e.target.value)}
                  />
                </div>

                {error && (
                  <p className="vbk__formerr" role="alert">
                    {tl("err")}{" "}
                    <a href={waHref} target="_blank" rel="noopener noreferrer">
                      {tl("err_wa")}
                    </a>
                  </p>
                )}

                <button type="submit" className="btn btn-solid vbk__submit">
                  {busy ? (
                    <>
                      <span className="vbk__spin" aria-hidden />
                      {tl("sending")}
                    </>
                  ) : (
                    <>
                      {tl("submit")}
                      <span className="arrow" aria-hidden>→</span>
                    </>
                  )}
                </button>
              </fieldset>
            </form>
          )}
        </Rise>
      </div>

      <style>{css}</style>
    </section>
  );
}

const css = `
  .vbk {
    position: relative; isolation: isolate; overflow: hidden;
    background: #0d0b09; color: #fbf7f0;
    padding-block: clamp(4.5rem, 10vw, 8.5rem);
    scroll-margin-top: calc(var(--nav-h, 78px) + 12px);
  }
  /* one warm brass bloom so the band is lit, not a flat black rectangle */
  .vbk__glow {
    position: absolute; inset: 0; z-index: -1; pointer-events: none;
    background:
      radial-gradient(58% 48% at 8% 0%, rgba(197,160,106,0.16), transparent 62%),
      radial-gradient(52% 52% at 100% 100%, rgba(54,65,47,0.30), transparent 64%);
  }
  .vbk__inner {
    display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1fr);
    gap: clamp(2.4rem, 5vw, 5rem); align-items: start;
  }

  .vbk__side { display: flex; flex-direction: column; text-align: start; }
  .vbk__eyebrow { display: inline-flex; align-items: center; gap: 0.7rem; color: var(--brass-2); align-self: flex-start; }
  .vbk__eyebrow::before { content: ""; width: 26px; height: 1px; background: var(--brass-2); }
  .vbk__title {
    font-size: clamp(2.2rem, 4.6vw, 3.6rem); line-height: 1.03; color: #fbf7f0;
    margin: 1.1rem 0 0; font-weight: 360; letter-spacing: -0.018em;
  }
  html[dir="rtl"] .vbk__title { line-height: 1.24; letter-spacing: 0; }
  .vbk__lead {
    color: rgba(251,247,240,0.76); font-size: clamp(1rem, 1.2vw, 1.1rem);
    line-height: 1.7; margin: 1.2rem 0 0; max-width: 52ch;
  }

  /* contact rail — a definition list, not a pile of links */
  .vbk__quick {
    margin: clamp(2rem, 4vw, 2.8rem) 0 0; padding: 0;
    display: flex; flex-direction: column;
  }
  .vbk__quickrow {
    display: grid; grid-template-columns: minmax(0, 10.5rem) minmax(0, 1fr);
    gap: 0.4rem 1.2rem; align-items: baseline;
    padding-block: clamp(0.75rem, 1.5vw, 1rem);
    border-top: 1px solid rgba(251,247,240,0.14);
  }
  .vbk__quickrow:last-child { border-bottom: 1px solid rgba(251,247,240,0.14); }
  .vbk__quickrow dd { margin: 0; min-width: 0; }
  .vbk__quickk {
    font-size: 0.64rem; letter-spacing: 0.2em; text-transform: uppercase;
    color: rgba(251,247,240,0.52);
  }
  html[dir="rtl"] .vbk__quickk { letter-spacing: 0.05em; }
  .vbk__quicklink {
    display: inline-flex; align-items: baseline; gap: 0.5rem;
    min-height: 44px; color: inherit; text-decoration: none;
  }
  .vbk__quickv {
    font-family: var(--font-display); font-size: clamp(1rem, 1.3vw, 1.16rem);
    color: #fbf7f0; transition: color 0.3s var(--ease);
  }
  .vbk__quickv--plain { display: block; line-height: 1.45; }
  .vbk__arrow { color: var(--brass-2); font-size: 0.8rem; display: inline-block; transition: transform 0.4s var(--ease); }
  html[dir="rtl"] .vbk__arrow { transform: scaleX(-1); }
  .vbk__quicklink:hover .vbk__quickv { color: var(--brass-2); }
  .vbk__quicklink:hover .vbk__arrow { transform: translate(2px, -2px); }
  html[dir="rtl"] .vbk__quicklink:hover .vbk__arrow { transform: translate(-2px, -2px) scaleX(-1); }

  /* ---- the card ---- */
  .vbk__card {
    background: var(--paper); border-radius: 14px;
    padding: clamp(1.5rem, 2.8vw, 2.4rem);
    box-shadow:
      0 0 0 1px rgba(197,160,106,0.30),
      0 44px 100px -48px rgba(0,0,0,0.75);
  }
  .vbk__cardhead {
    display: flex; align-items: center; gap: 1rem;
    margin-bottom: clamp(1.2rem, 2.4vw, 1.8rem);
  }
  .vbk__cardlabel {
    flex: none; font-size: 0.62rem; letter-spacing: 0.24em; text-transform: uppercase;
    color: var(--brass);
  }
  html[dir="rtl"] .vbk__cardlabel { letter-spacing: 0.07em; }
  .vbk__cardrule { flex: 1 1 auto; height: 1px; background: var(--line); }

  .vbk__form { display: block; }
  .vbk__set { border: 0; margin: 0; padding: 0; min-width: 0; display: grid; gap: clamp(0.9rem, 1.6vw, 1.15rem); }
  /* dim only the inputs while sending — the button keeps its full ink so the
     spinner + "Sending…" stay the clearest thing on the card */
  .vbk__set[disabled] .vbk__field { opacity: 0.55; }
  .vbk__row { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: clamp(0.9rem, 1.6vw, 1.15rem); }

  .vbk__field { display: flex; flex-direction: column; gap: 0.45rem; text-align: start; min-width: 0; }
  .vbk__field label {
    font-size: 0.64rem; letter-spacing: 0.16em; text-transform: uppercase;
    color: var(--ink-faint); display: flex; align-items: baseline; gap: 0.5rem;
  }
  html[dir="rtl"] .vbk__field label { letter-spacing: 0.04em; }
  .vbk__opt {
    font-size: 0.56rem; letter-spacing: 0.12em; color: var(--brass);
    border: 1px solid rgba(138,106,60,0.32); border-radius: 100px;
    padding: 0.15em 0.6em; text-transform: uppercase; white-space: nowrap;
  }
  html[dir="rtl"] .vbk__opt { letter-spacing: 0.02em; }

  .vbk__field input, .vbk__field textarea {
    width: 100%; padding: 0.9rem 1rem;
    border: 1px solid var(--line); border-radius: 10px;
    background: var(--paper-2);
    font-family: var(--font-sans); font-size: 1rem; line-height: 1.45; color: var(--ink);
    outline: none; text-align: start;
    transition: border-color 0.25s var(--ease), box-shadow 0.25s var(--ease), background 0.25s var(--ease);
  }
  html[dir="rtl"] .vbk__field input, html[dir="rtl"] .vbk__field textarea { font-family: var(--font-ar); }
  /* the tel field is dir="ltr" so the digits read correctly; align it to the
     RTL column's edge anyway so it doesn't look knocked out of the stack */
  html[dir="rtl"] .vbk__field input[type="tel"] { text-align: right; }
  html[dir="rtl"] .vbk__field input[type="tel"]::placeholder { text-align: right; }
  .vbk__field input::placeholder, .vbk__field textarea::placeholder { color: color-mix(in srgb, var(--ink-faint) 62%, transparent); }
  .vbk__field textarea { min-height: 92px; resize: vertical; }
  .vbk__field input:hover, .vbk__field textarea:hover { border-color: rgba(22,21,15,0.24); }
  .vbk__field input:focus-visible, .vbk__field textarea:focus-visible {
    background: var(--paper);
    border-color: var(--brass);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--brass) 20%, transparent);
    outline: none;
  }
  .vbk__field input.is-invalid, .vbk__field textarea.is-invalid { border-color: #A83A22; background: rgba(168,58,34,0.04); }
  .vbk__field input.is-invalid:focus-visible { border-color: #A83A22; box-shadow: 0 0 0 3px rgba(168,58,34,0.18); }

  .vbk__err { font-size: 0.8rem; line-height: 1.4; color: #A83A22; }
  .vbk__formerr {
    margin: 0; padding: 0.85rem 1rem; border-radius: 10px;
    background: rgba(168,58,34,0.07); border: 1px solid rgba(168,58,34,0.28);
    font-size: 0.86rem; line-height: 1.5; color: #7E2B18;
  }
  .vbk__formerr a { text-decoration: underline; text-underline-offset: 3px; white-space: nowrap; }

  .vbk__submit { width: 100%; justify-content: center; margin-top: 0.35rem; }
  .vbk__submit:disabled { cursor: default; transform: none; }
  .vbk__spin {
    width: 14px; height: 14px; border-radius: 50%; flex: none;
    border: 2px solid rgba(255,255,255,0.28); border-top-color: #fff;
    animation: vbkSpin 0.75s linear infinite;
  }
  @keyframes vbkSpin { to { transform: rotate(360deg); } }

  /* ---- confirmation ---- */
  .vbk__done { text-align: center; padding: clamp(1.4rem, 3vw, 2.4rem) 0.4rem 1rem; }
  .vbk__check {
    display: inline-grid; place-items: center; width: 56px; height: 56px; border-radius: 999px;
    background: var(--ever); color: #fff; margin-bottom: 1.2rem;
  }
  .vbk__donet {
    font-family: var(--font-display); font-weight: 400;
    font-size: clamp(1.3rem, 2vw, 1.6rem); line-height: 1.25;
    color: var(--ink); margin: 0 0 0.6rem; outline: none;
  }
  .vbk__donet:focus-visible { outline: 2px solid var(--brass); outline-offset: 4px; border-radius: 4px; }
  .vbk__dones { color: var(--ink-faint); line-height: 1.65; margin: 0 auto; max-width: 42ch; }
  .vbk__again {
    margin-top: 1.4rem; background: none; border: 0; padding: 0.4rem 0;
    font: inherit; font-size: 0.84rem; color: var(--brass);
    border-bottom: 1px solid rgba(138,106,60,0.4); cursor: pointer; min-height: 44px;
    transition: color 0.3s var(--ease), border-color 0.3s var(--ease);
  }
  .vbk__again:hover { color: var(--ink); border-color: var(--ink); }

  /* focus rings on the dark band's own controls read better in the on-dark
     brass, same convention as KitchenEnquiry's .keq */
  .vbk .vbk__quicklink:focus-visible { outline: 2px solid var(--brass-2); outline-offset: 3px; border-radius: 4px; }
  .vbk .vbk__submit:focus-visible { outline: 2px solid var(--brass); outline-offset: 3px; }

  @media (max-width: 900px) {
    .vbk__inner { grid-template-columns: 1fr; gap: 2.4rem; }
    .vbk__lead { max-width: none; }
  }
  @media (max-width: 560px) {
    .vbk__row { grid-template-columns: 1fr; }
    .vbk__quickrow { grid-template-columns: 1fr; gap: 0.15rem; }
  }
  @media (prefers-reduced-motion: reduce) {
    .vbk__quickv, .vbk__arrow, .vbk__again, .vbk__field input, .vbk__field textarea { transition: none; }
    .vbk__spin { animation: none; border-top-color: rgba(255,255,255,0.6); }
  }
`;
