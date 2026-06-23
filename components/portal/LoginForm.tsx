"use client";

import { useState } from "react";
import { useT } from "@/lib/i18n";
import { tp } from "@/lib/portal/strings";
import { usePortalAuth } from "@/lib/portal/auth";
import { isLive } from "@/lib/portal/store";

export default function LoginForm({ variant = "client" }: { variant?: "client" | "admin" }) {
  const { lang, dir } = useT();
  const { signIn } = usePortalAuth();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      const u = await signIn(phone.trim(), password);
      if (variant === "admin" && u.role !== "admin") {
        setErr(tp("not_admin", lang));
      }
    } catch {
      setErr(tp("bad_creds", lang));
    } finally {
      setBusy(false);
    }
  }

  const fieldStyle: React.CSSProperties = {
    width: "100%", padding: "0.95rem 1rem", marginTop: "0.4rem",
    border: "1px solid var(--line)", borderRadius: 12, background: "var(--paper)",
    fontFamily: "var(--f-sans)", fontSize: "1rem", color: "var(--ink)", outline: "none",
  };
  const labelStyle: React.CSSProperties = {
    fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-faint)",
  };

  return (
    <div dir={dir} style={{ minHeight: "100dvh", display: "grid", placeItems: "center", padding: "var(--gut)" }}>
      <div style={{ width: "min(420px, 100%)" }}>
        <a href="/" className="display" style={{ display: "block", fontSize: "1.6rem", letterSpacing: "0.02em", color: "var(--ink)", marginBottom: "2.2rem" }}>
          EVORA
        </a>
        <h1 className="display" style={{ fontSize: "clamp(2rem,6vw,2.8rem)", lineHeight: 1.05, color: "var(--ink)", margin: 0 }}>
          {tp("welcome", lang)}
        </h1>
        <p style={{ color: "var(--ink-faint)", marginTop: "0.6rem", marginBottom: "2rem", fontSize: "0.98rem" }}>
          {tp(variant === "admin" ? "admin_sub" : "signin_sub", lang)}
        </p>

        <form onSubmit={submit}>
          <label style={labelStyle}>{tp("phone", lang)}
            <input style={fieldStyle} value={phone} onChange={(e) => setPhone(e.target.value)}
              type="tel" inputMode="tel" autoComplete="username" placeholder="07_ _______" required />
          </label>
          <div style={{ height: "1.1rem" }} />
          <label style={labelStyle}>{tp("password", lang)}
            <input style={fieldStyle} value={password} onChange={(e) => setPassword(e.target.value)}
              type="password" autoComplete="current-password" required />
          </label>

          {err && <p style={{ color: "var(--clay)", fontSize: "0.88rem", marginTop: "1rem" }}>{err}</p>}

          <button type="submit" disabled={busy}
            style={{
              width: "100%", marginTop: "1.6rem", padding: "1rem", borderRadius: 12, border: "none",
              background: "var(--ink)", color: "var(--paper)", fontSize: "0.95rem", fontWeight: 600,
              letterSpacing: "0.02em", cursor: busy ? "default" : "pointer", opacity: busy ? 0.6 : 1,
              transition: "opacity .3s",
            }}>
            {busy ? tp("signing", lang) : tp("signin", lang)}
          </button>
        </form>

        <p style={{ color: "var(--ink-faint)", fontSize: "0.8rem", marginTop: "1.6rem", lineHeight: 1.5 }}>
          {tp("help", lang)}
        </p>

        {!isLive && (
          <div style={{ marginTop: "1.6rem", padding: "0.9rem 1rem", borderRadius: 12, background: "rgba(178,116,87,0.08)", border: "1px solid rgba(178,116,87,0.25)" }}>
            <p style={{ color: "var(--clay)", fontSize: "0.78rem", margin: 0, lineHeight: 1.5 }}>{tp("demo_mode", lang)}</p>
            <p style={{ color: "var(--ink-soft)", fontSize: "0.78rem", margin: "0.4rem 0 0", fontFamily: "var(--f-sans)" }}>
              {tp(variant === "admin" ? "demo_admin" : "demo_login", lang)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
