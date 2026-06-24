"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useT } from "@/lib/i18n";
import { createLead, uploadFile } from "@/lib/portal/store";
import { START_PROJECT_EVENT } from "@/lib/startProject";

/* The global "Start a project" modal. Mounted once in the site layout.
 * Opens on the `evora:start-project` window event (fired by openStartProject()).
 * Captures name, email and phone, takes a REAL 2D-plan upload (stored to
 * Firebase Storage via uploadFile → served URL), and files a lead. */

const T = {
  eyebrow: { en: "Start your future home", ar: "ابدأ منزل المستقبل" },
  title: { en: "Send us your 2D plan", ar: "أرسل لنا مخططك" },
  sub: {
    en: "Leave your details and attach your floor plan. Our team will call you, then turn it into a fully furnished 3D home.",
    ar: "اترك بياناتك وأرفق مخططك. سيتصل بك فريقنا، ثم نحوّله إلى منزل ثلاثي الأبعاد مفروش بالكامل.",
  },
  name: { en: "Your name", ar: "اسمك" },
  email: { en: "Email address", ar: "البريد الإلكتروني" },
  phone: { en: "Phone / WhatsApp number", ar: "رقم الهاتف / واتساب" },
  msg: { en: "Tell us about your space (optional)", ar: "أخبرنا عن مساحتك (اختياري)" },
  plan: { en: "Upload your 2D plan", ar: "ارفع مخططك ثنائي الأبعاد" },
  planHint: { en: "PDF, JPG or PNG", ar: "PDF أو JPG أو PNG" },
  send: { en: "Request my 3D design", ar: "اطلب تصميمي ثلاثي الأبعاد" },
  sending: { en: "Sending…", ar: "جارٍ الإرسال…" },
  uploading: { en: "Uploading plan…", ar: "جارٍ رفع المخطط…" },
  done_t: { en: "Got it — we'll call you soon.", ar: "تم — سنتصل بك قريبًا." },
  done_s: { en: "Our team will review your plan and reach out on the details you gave us.", ar: "سيراجع فريقنا مخططك ويتواصل معك على البيانات التي أدخلتها." },
  close: { en: "Close", ar: "إغلاق" },
  err: { en: "Something went wrong. Please try again or WhatsApp us.", ar: "حدث خطأ ما. حاول مجددًا أو راسلنا عبر واتساب." },
};

export default function StartProjectModal() {
  const { lang, dir } = useT();
  const t = (k: keyof typeof T) => T[k][lang];
  const ar = lang === "ar";

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [phase, setPhase] = useState<"idle" | "uploading" | "sending">("idle");
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const firstRef = useRef<HTMLInputElement>(null);

  // Open on the global event.
  useEffect(() => {
    const onOpen = () => {
      setDone(false);
      setError(false);
      setOpen(true);
    };
    window.addEventListener(START_PROJECT_EVENT, onOpen);
    return () => window.removeEventListener(START_PROJECT_EVENT, onOpen);
  }, []);

  // Lock scroll + ESC to close + focus first field while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const id = window.setTimeout(() => firstRef.current?.focus(), 80);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(id);
    };
  }, [open]);

  const busy = phase !== "idle";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim() || busy) return;
    setError(false);
    try {
      let served = "";
      if (file) {
        setPhase("uploading");
        served = await uploadFile(file);
      }
      setPhase("sending");
      await createLead(name.trim(), phone.trim(), message.trim(), served, email.trim());
      setDone(true);
    } catch {
      setError(true);
    } finally {
      setPhase("idle");
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="spm-backdrop"
          dir={dir}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <motion.div
            className="spm-card"
            role="dialog"
            aria-modal="true"
            aria-label={t("title")}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
          >
            <button className="spm-x" aria-label={t("close")} onClick={() => setOpen(false)}>×</button>

            {done ? (
              <div className="spm-done">
                <div className="spm-check">✓</div>
                <h3 className="spm-title">{t("done_t")}</h3>
                <p className="spm-sub">{t("done_s")}</p>
                <button className="spm-submit" onClick={() => setOpen(false)}>{t("close")}</button>
              </div>
            ) : (
              <>
                <span className="spm-eyebrow">{t("eyebrow")}</span>
                <h3 className="spm-title">{t("title")}</h3>
                <p className="spm-sub">{t("sub")}</p>

                <form onSubmit={submit} className="spm-form">
                  <input ref={firstRef} className="spm-field" placeholder={t("name")} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
                  <input className="spm-field" type="email" placeholder={t("email")} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
                  <input className="spm-field" type="tel" placeholder={t("phone")} value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" required />
                  <textarea className="spm-field spm-area" placeholder={t("msg")} value={message} onChange={(e) => setMessage(e.target.value)} />

                  <button type="button" className={`spm-upload ${file ? "has-file" : ""}`} onClick={() => fileRef.current?.click()}>
                    <span className="spm-upload-icon">⤓</span>
                    <span className="spm-upload-text">
                      <strong>{file ? file.name : t("plan")}</strong>
                      <em>{t("planHint")}</em>
                    </span>
                  </button>
                  <input ref={fileRef} type="file" accept="image/*,application/pdf" style={{ display: "none" }}
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)} />

                  {error && <p className="spm-error">{t("err")}</p>}

                  <button type="submit" className="spm-submit" disabled={busy || !phone.trim()}>
                    {phase === "uploading" ? t("uploading") : phase === "sending" ? t("sending") : t("send")}
                    {!busy && <span className="spm-arrow" aria-hidden>{ar ? "←" : "→"}</span>}
                  </button>
                </form>
              </>
            )}
          </motion.div>

          <style>{`
            .spm-backdrop {
              position: fixed; inset: 0; z-index: 1000;
              display: grid; place-items: center;
              padding: clamp(16px, 4vw, 40px);
              background: rgba(22,21,15,0.5);
              backdrop-filter: blur(6px);
            }
            .spm-card {
              position: relative;
              width: 100%; max-width: 520px;
              max-height: 92vh; overflow-y: auto;
              background: var(--paper, #f7f3ec);
              border: 1px solid var(--line, rgba(30,27,23,0.14));
              border-radius: 22px;
              padding: clamp(1.6rem, 4vw, 2.6rem);
              box-shadow: 0 50px 120px -40px rgba(22,21,15,0.6);
            }
            .spm-x {
              position: absolute; top: 14px; inset-inline-end: 16px;
              width: 34px; height: 34px; border-radius: 999px;
              border: 1px solid var(--line); background: #fff;
              font-size: 1.3rem; line-height: 1; color: var(--ink-soft);
              cursor: pointer; display: grid; place-items: center;
              transition: background .2s ease, color .2s ease;
            }
            .spm-x:hover { background: var(--ink); color: #fff; }
            .spm-eyebrow {
              font-family: var(--f-sans); font-size: 0.72rem; font-weight: 600;
              letter-spacing: 0.2em; text-transform: uppercase; color: var(--clay, #9c4f38);
            }
            .spm-title {
              font-family: var(--f-display), Georgia, serif;
              font-optical-sizing: auto;
              font-size: clamp(1.7rem, 4vw, 2.4rem);
              line-height: 1.05; letter-spacing: -0.015em;
              color: var(--ink); margin: 0.7rem 0 0.6rem;
            }
            .spm-sub {
              font-family: var(--f-sans); color: var(--ink-soft);
              font-size: 1rem; line-height: 1.6; margin: 0 0 1.4rem; max-width: 42ch;
            }
            .spm-form { display: grid; gap: 0.75rem; }
            .spm-field {
              width: 100%; padding: 0.95rem 1.05rem;
              border: 1px solid var(--line); border-radius: 12px;
              background: #fff; font-family: var(--f-sans); font-size: 1rem;
              color: var(--ink); outline: none;
              transition: border-color .2s ease, box-shadow .2s ease;
            }
            .spm-field:focus { border-color: var(--brass, #b08d57); box-shadow: 0 0 0 3px rgba(176,141,87,0.18); }
            .spm-area { min-height: 84px; resize: vertical; }
            .spm-upload {
              display: flex; align-items: center; gap: 0.85rem;
              padding: 0.9rem 1.05rem; border-radius: 12px; cursor: pointer;
              border: 1.5px dashed var(--line); background: #fff; text-align: start;
              transition: border-color .2s ease, background .2s ease;
            }
            .spm-upload:hover { border-color: var(--brass); background: #fffdf9; }
            .spm-upload.has-file { border-style: solid; border-color: var(--ever, #2f5d4a); }
            .spm-upload-icon {
              flex: none; width: 38px; height: 38px; border-radius: 10px;
              display: grid; place-items: center; font-size: 1.2rem;
              background: var(--bone, #efe8dc); color: var(--clay);
            }
            .spm-upload-text { display: flex; flex-direction: column; min-width: 0; }
            .spm-upload-text strong { font-family: var(--f-sans); font-size: 0.95rem; font-weight: 600; color: var(--ink); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            .spm-upload-text em { font-style: normal; font-size: 0.78rem; color: var(--ink-faint, #9a948b); }
            .spm-error { margin: 0; font-size: 0.85rem; color: var(--clay); font-family: var(--f-sans); }
            .spm-submit {
              margin-top: 0.4rem; padding: 1.05rem; border-radius: 12px; border: none;
              background: var(--ink); color: #fff; font-family: var(--f-sans);
              font-weight: 600; font-size: 1rem; cursor: pointer;
              display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
              transition: background .2s ease, transform .2s ease, opacity .2s ease;
            }
            .spm-submit:hover:not(:disabled) { background: var(--brass-2, #8a6d3f); transform: translateY(-1px); }
            .spm-submit:disabled { opacity: 0.55; cursor: default; }
            .spm-done { text-align: center; padding: 1.4rem 0 0.4rem; }
            .spm-check {
              width: 56px; height: 56px; border-radius: 999px; margin: 0 auto 1.1rem;
              background: var(--ever, #2f5d4a); color: #fff; display: grid; place-items: center; font-size: 1.5rem;
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
