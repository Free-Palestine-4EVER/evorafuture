"use client";

import { useRef, useState } from "react";
import { useT } from "@/lib/i18n";
import { createLead } from "@/lib/portal/store";

const T = {
  eyebrow: { en: "Start your future home", ar: "ابدأ منزل المستقبل" },
  title: { en: "Send us your 2D plan.\nWe'll design it in 3D.", ar: "أرسل لنا مخططك ثنائي الأبعاد.\nسنصممه ثلاثي الأبعاد." },
  sub: { en: "Upload your floor plan and leave your number. Our team will call you to understand your space, then turn it into a fully furnished 3D home — furniture, render, production and delivery.", ar: "ارفع مخطط منزلك واترك رقمك. سيتصل بك فريقنا لفهم مساحتك، ثم نحوّلها إلى منزل ثلاثي الأبعاد مفروش بالكامل — الأثاث والعرض والإنتاج والتسليم." },
  name: { en: "Your name", ar: "اسمك" },
  phone: { en: "Phone number", ar: "رقم الهاتف" },
  msg: { en: "Tell us about your space (optional)", ar: "أخبرنا عن مساحتك (اختياري)" },
  plan: { en: "Attach your 2D plan (optional)", ar: "أرفق مخططك ثنائي الأبعاد (اختياري)" },
  send: { en: "Request my 3D design", ar: "اطلب تصميمي ثلاثي الأبعاد" },
  sending: { en: "Sending…", ar: "جارٍ الإرسال…" },
  done_t: { en: "Got it — we'll call you soon.", ar: "تم — سنتصل بك قريبًا." },
  done_s: { en: "Our team will review your plan and reach out on the number you gave us.", ar: "سيراجع فريقنا مخططك ويتواصل معك على الرقم الذي أدخلته." },
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
  const fileRef = useRef<HTMLInputElement>(null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setPlanName(f.name);
    const r = new FileReader();
    r.onload = () => setPlanUrl(String(r.result || ""));
    r.readAsDataURL(f);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim()) return;
    setBusy(true);
    try { await createLead(name.trim(), phone.trim(), message.trim(), planUrl); setDone(true); }
    finally { setBusy(false); }
  }

  const field: React.CSSProperties = {
    width: "100%", padding: "1rem 1.1rem", border: "1px solid var(--line)", borderRadius: 12,
    background: "var(--paper)", fontFamily: "var(--f-sans)", fontSize: "1rem", color: "var(--ink)", outline: "none",
  };

  return (
    <section id="design-request" dir={dir} style={{ background: "var(--paper)", padding: "clamp(4rem,10vw,8rem) 0" }}>
      <div className="container" style={{ display: "grid", gap: "clamp(2rem,5vw,5rem)", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", alignItems: "center" }}>
        <div>
          <p style={{ fontSize: "0.74rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--clay)", margin: 0 }}>{t("eyebrow")}</p>
          <h2 className="display" style={{ fontSize: "clamp(2.2rem,5.5vw,4rem)", lineHeight: 1.04, color: "var(--ink)", margin: "1rem 0 1.2rem", whiteSpace: "pre-line" }}>{t("title")}</h2>
          <p style={{ color: "var(--ink-soft)", fontSize: "1.05rem", lineHeight: 1.65, maxWidth: 520 }}>{t("sub")}</p>
        </div>

        <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 20, padding: "clamp(1.5rem,3vw,2.4rem)", boxShadow: "0 30px 80px rgba(22,21,15,0.06)" }}>
          {done ? (
            <div style={{ textAlign: "center", padding: "2rem 0" }}>
              <div style={{ width: 56, height: 56, borderRadius: 999, background: "var(--clay)", color: "#fff", display: "grid", placeItems: "center", margin: "0 auto 1.2rem", fontSize: "1.5rem" }}>✓</div>
              <h3 className="display" style={{ fontSize: "1.6rem", color: "var(--ink)", margin: "0 0 0.6rem" }}>{t("done_t")}</h3>
              <p style={{ color: "var(--ink-faint)", lineHeight: 1.6 }}>{t("done_s")}</p>
            </div>
          ) : (
            <form onSubmit={submit} style={{ display: "grid", gap: "0.9rem" }}>
              <input style={field} placeholder={t("name")} value={name} onChange={(e) => setName(e.target.value)} />
              <input style={field} type="tel" placeholder={t("phone")} value={phone} onChange={(e) => setPhone(e.target.value)} required />
              <textarea style={{ ...field, minHeight: 84, resize: "vertical" }} placeholder={t("msg")} value={message} onChange={(e) => setMessage(e.target.value)} />
              <button type="button" onClick={() => fileRef.current?.click()}
                style={{ ...field, textAlign: "start", cursor: "pointer", color: planName ? "var(--ink)" : "var(--ink-faint)", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span style={{ color: "var(--clay)" }}>⤓</span> {planName || t("plan")}
              </button>
              <input ref={fileRef} type="file" accept="image/*,application/pdf" onChange={onFile} style={{ display: "none" }} />
              <button type="submit" disabled={busy}
                style={{ marginTop: "0.4rem", padding: "1.1rem", borderRadius: 12, border: "none", background: "var(--ink)", color: "#fff", fontWeight: 600, fontSize: "1rem", cursor: busy ? "default" : "pointer", opacity: busy ? 0.6 : 1 }}>
                {busy ? t("sending") : t("send")}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
