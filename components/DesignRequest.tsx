"use client";

import { useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useT } from "@/lib/i18n";
import { createLead, uploadDataUrl } from "@/lib/portal/store";
import { Rise, motion, EASE } from "@/components/motion";

const T = {
  eyebrow: { en: "Start your future home", ar: "ابدأ منزل المستقبل" },
  title: { en: "Send us your 2D plan.\nWe'll design it in 3D.", ar: "أرسل لنا مخططك ثنائي الأبعاد.\nسنصممه ثلاثي الأبعاد." },
  sub: { en: "Upload your floor plan and leave your number. Our team will call you to understand your space, then turn it into a fully furnished 3D home — furniture, render, production and delivery.", ar: "ارفع مخطط منزلك واترك رقمك. سيتصل بك فريقنا لفهم مساحتك، ثم نحوّلها إلى منزل ثلاثي الأبعاد مفروش بالكامل — الأثاث والعرض والإنتاج والتسليم." },
  name: { en: "Your name", ar: "اسمك" },
  phone: { en: "Phone number", ar: "رقم الهاتف" },
  phone_err: { en: "Please enter a valid phone number.", ar: "الرجاء إدخال رقم هاتف صحيح." },
  msg: { en: "Tell us about your space (optional)", ar: "أخبرنا عن مساحتك (اختياري)" },
  plan: { en: "Attach your 2D plan (optional)", ar: "أرفق مخططك ثنائي الأبعاد (اختياري)" },
  remove: { en: "Remove file", ar: "إزالة الملف" },
  send: { en: "Request my 3D design", ar: "اطلب تصميمي ثلاثي الأبعاد" },
  sending: { en: "Sending…", ar: "جارٍ الإرسال…" },
  done_t: { en: "Got it — we'll call you soon.", ar: "تم — سنتصل بك قريبًا." },
  done_s: { en: "Our team will review your plan and reach out on the number you gave us.", ar: "سيراجع فريقنا مخططك ويتواصل معك على الرقم الذي أدخلته." },
  trust1: { en: "2,400+ homes designed", ar: "أكثر من 2,400 منزل صُمّم" },
  trust2: { en: "Complimentary design", ar: "تصميم مجاني" },
  trust3: { en: "We reply within a day", ar: "نرد عليك خلال يوم" },
};

export default function DesignRequest() {
  const { lang, dir } = useT();
  const t = (k: keyof typeof T) => T[k][lang];
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [planUrl, setPlanUrl] = useState("");
  const [planName, setPlanName] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Inline phone validation — accept +, spaces, dashes, parens; need ≥ 7 digits.
  const phoneValid = phone.replace(/\D/g, "").length >= 7;
  const showPhoneErr = phoneTouched && phone.trim().length > 0 && !phoneValid;

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setPlanName(f.name);
    const r = new FileReader();
    r.onload = () => setPlanUrl(String(r.result || ""));
    r.readAsDataURL(f);
  }

  function clearFile() {
    setPlanName("");
    setPlanUrl("");
    if (fileRef.current) fileRef.current.value = "";
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setPhoneTouched(true);
    if (!phoneValid) return;
    setBusy(true);
    try {
      // Upload the plan so it's a served URL (a data-URL link is blocked by browsers).
      const served = planUrl.startsWith("data:") ? await uploadDataUrl(planUrl) : planUrl;
      await createLead(name.trim(), phone.trim(), message.trim(), served);
      setDone(true);
    } finally { setBusy(false); }
  }

  const field: React.CSSProperties = {
    width: "100%", padding: "1rem 1.1rem", border: "1px solid var(--line)", borderRadius: 12,
    background: "var(--paper)", fontFamily: "var(--f-sans)", fontSize: "1rem", color: "var(--ink)", outline: "none",
  };

  return (
    <section id="design-request" dir={dir} style={{ background: "var(--paper)", padding: "clamp(4rem,10vw,8rem) 0" }}>
      {/* Scoped focus rings — inline styles can't express :focus / :focus-visible. */}
      <style>{`
        .ev-dr-field { transition: border-color .2s ease, box-shadow .2s ease; }
        .ev-dr-field:focus-visible {
          border-color: var(--clay);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--clay) 24%, transparent);
        }
        .ev-dr-field.is-invalid { border-color: #C0492F; }
        .ev-dr-field.is-invalid:focus-visible {
          box-shadow: 0 0 0 3px rgba(192,73,47,0.20);
        }
      `}</style>

      <div className="container" style={{ display: "grid", gap: "clamp(2rem,5vw,5rem)", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", alignItems: "center" }}>
        <Rise as="div">
          <p style={{ fontSize: "0.74rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--clay)", margin: 0 }}>{t("eyebrow")}</p>
          <h2 className="display" style={{ fontSize: "clamp(2.2rem,5.5vw,4rem)", lineHeight: 1.04, color: "var(--ink)", margin: "1rem 0 1.2rem", whiteSpace: "pre-line" }}>{t("title")}</h2>
          <p style={{ color: "var(--ink-soft)", fontSize: "1.05rem", lineHeight: 1.65, maxWidth: 520 }}>{t("sub")}</p>
        </Rise>

        <Rise as="div" delay={0.12} style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 20, padding: "clamp(1.5rem,3vw,2.4rem)", boxShadow: "0 30px 80px rgba(22,21,15,0.06)" }}>
            {done ? (
              <div style={{ textAlign: "center", padding: "2rem 0" }}>
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 220, damping: 15 }}
                  style={{ width: 56, height: 56, borderRadius: 999, background: "var(--clay)", color: "#fff", display: "grid", placeItems: "center", margin: "0 auto 1.2rem" }}
                >
                  <motion.svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <motion.path
                      d="M5 12.5l4.2 4.2L19 7"
                      stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, ease: EASE, delay: 0.18 }}
                    />
                  </motion.svg>
                </motion.div>
                <h3 className="display" style={{ fontSize: "1.6rem", color: "var(--ink)", margin: "0 0 0.6rem" }}>{t("done_t")}</h3>
                <p style={{ color: "var(--ink-faint)", lineHeight: 1.6 }}>{t("done_s")}</p>
              </div>
            ) : (
              <form onSubmit={submit} style={{ display: "grid", gap: "0.9rem" }} noValidate>
                <input className="ev-dr-field" style={field} placeholder={t("name")} value={name} onChange={(e) => setName(e.target.value)} />
                <div>
                  <input
                    className={`ev-dr-field${showPhoneErr ? " is-invalid" : ""}`}
                    style={field}
                    type="tel"
                    inputMode="tel"
                    placeholder={t("phone")}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onBlur={() => setPhoneTouched(true)}
                    aria-invalid={showPhoneErr}
                    required
                  />
                  <AnimatePresence initial={false}>
                    {showPhoneErr && (
                      <motion.p
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 6 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.25, ease: EASE }}
                        style={{ fontSize: "0.82rem", color: "#C0492F", margin: 0, overflow: "hidden" }}
                      >
                        {t("phone_err")}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
                <textarea className="ev-dr-field" style={{ ...field, minHeight: 84, resize: "vertical" }} placeholder={t("msg")} value={message} onChange={(e) => setMessage(e.target.value)} />

                <button type="button" onClick={() => fileRef.current?.click()}
                  className="ev-dr-field"
                  style={{ ...field, textAlign: "start", cursor: "pointer", color: "var(--ink-faint)", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <span style={{ color: "var(--clay)" }}>⤓</span> {t("plan")}
                </button>
                <input ref={fileRef} type="file" accept="image/*,application/pdf" onChange={onFile} style={{ display: "none" }} />

                <AnimatePresence initial={false}>
                  {planName && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.28, ease: EASE }}
                      style={{ overflow: "hidden" }}
                    >
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: "0.55rem", maxWidth: "100%",
                        padding: "0.5rem 0.5rem 0.5rem 0.85rem", borderRadius: 999,
                        background: "color-mix(in srgb, var(--clay) 12%, transparent)",
                        border: "1px solid color-mix(in srgb, var(--clay) 30%, transparent)",
                        color: "var(--ink)", fontSize: "0.86rem",
                      }}>
                        <span style={{ color: "var(--clay)" }}>◆</span>
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{planName}</span>
                        <button type="button" onClick={clearFile} aria-label={t("remove")} title={t("remove")}
                          style={{
                            flexShrink: 0, width: 22, height: 22, borderRadius: 999, border: "none",
                            background: "color-mix(in srgb, var(--clay) 22%, transparent)", color: "var(--clay)",
                            cursor: "pointer", display: "grid", placeItems: "center", fontSize: "0.8rem", lineHeight: 1,
                          }}>
                          ✕
                        </button>
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button type="submit" disabled={busy}
                  style={{ marginTop: "0.4rem", padding: "1.1rem", borderRadius: 12, border: "none", background: "var(--ink)", color: "#fff", fontWeight: 600, fontSize: "1rem", cursor: busy ? "default" : "pointer", opacity: busy ? 0.6 : 1 }}>
                  {busy ? t("sending") : t("send")}
                </button>
              </form>
            )}
          </div>

          {/* Trust strip */}
          <div style={{
            display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center",
            gap: "0.45rem 0.85rem", marginTop: "1.15rem", fontSize: "0.82rem", color: "var(--ink-faint)",
          }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
              <span style={{ color: "var(--clay)" }}>✦</span>{t("trust1")}
            </span>
            <span aria-hidden style={{ opacity: 0.4 }}>·</span>
            <span>{t("trust2")}</span>
            <span aria-hidden style={{ opacity: 0.4 }}>·</span>
            <span>{t("trust3")}</span>
          </div>
        </Rise>
      </div>
    </section>
  );
}
