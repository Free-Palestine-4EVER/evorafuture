"use client";

import { useState } from "react";
import { useT } from "@/lib/i18n";
import { tp } from "@/lib/portal/strings";
import { usePortalAuth } from "@/lib/portal/auth";
import { registerCustomer } from "@/lib/portal/store";

export default function LoginForm({
  variant = "client", prefillPhone = "", startMode = "signin",
}: {
  variant?: "client" | "admin";
  prefillPhone?: string;
  startMode?: "signin" | "register";
}) {
  const { lang, dir } = useT();
  const { signIn, refresh } = usePortalAuth();
  const [reg, setReg] = useState(startMode === "register");
  const [identifier, setIdentifier] = useState(prefillPhone);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      if (reg) {
        await registerCustomer(identifier.trim(), name.trim(), password);
        refresh();
      } else {
        const u = await signIn(identifier.trim(), password);
        if (variant === "admin" && u.role !== "admin") setErr(tp("not_admin", lang));
      }
    } catch (e) {
      const m = (e as Error).message;
      setErr(m === "ALREADY_REGISTERED" ? tp("already_registered", lang) : tp("bad_creds", lang));
    } finally { setBusy(false); }
  }

  const field: React.CSSProperties = {
    width: "100%", padding: "0.95rem 1rem", marginTop: "0.4rem",
    border: "1px solid var(--line)", borderRadius: 12, background: "var(--paper)",
    fontFamily: "var(--f-sans)", fontSize: "1rem", color: "var(--ink)", outline: "none",
  };
  const label: React.CSSProperties = { fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-faint)" };

  return (
    <div dir={dir} style={{ minHeight: "100dvh", display: "grid", placeItems: "center", padding: "var(--gut)" }}>
      <div style={{ width: "min(420px, 100%)" }}>
        <a href="/" className="display" style={{ display: "block", fontSize: "1.6rem", letterSpacing: "0.02em", color: "var(--ink)", marginBottom: "2.2rem" }}>EVORA</a>
        <h1 className="display" style={{ fontSize: "clamp(2rem,6vw,2.8rem)", lineHeight: 1.05, color: "var(--ink)", margin: 0 }}>
          {reg ? tp("create_account", lang) : tp("welcome", lang)}
        </h1>
        <p style={{ color: "var(--ink-faint)", marginTop: "0.6rem", marginBottom: "2rem", fontSize: "0.98rem" }}>
          {reg ? tp("register_sub", lang) : tp(variant === "admin" ? "admin_sub" : "signin_sub", lang)}
        </p>

        <form onSubmit={submit}>
          {reg && (
            <>
              <label style={label}>{tp("full_name", lang)}
                <input style={field} value={name} onChange={(e) => setName(e.target.value)} required />
              </label>
              <div style={{ height: "1.1rem" }} />
            </>
          )}
          <label style={label}>{variant === "admin" ? "Email / phone" : tp("phone", lang)}
            <input style={field} value={identifier} onChange={(e) => setIdentifier(e.target.value)}
              type="text" inputMode="text" autoCapitalize="none" autoCorrect="off" spellCheck={false}
              autoComplete="username" placeholder={variant === "admin" ? "bakri@evorafuture.com" : "07_ _______"} required />
          </label>
          <div style={{ height: "1.1rem" }} />
          <label style={label}>{tp("password", lang)}
            <input style={field} value={password} onChange={(e) => setPassword(e.target.value)}
              type="password" autoComplete={reg ? "new-password" : "current-password"} required />
          </label>

          {err && <p style={{ color: "var(--clay)", fontSize: "0.88rem", marginTop: "1rem" }}>{err}</p>}

          <button type="submit" disabled={busy}
            style={{ width: "100%", marginTop: "1.6rem", padding: "1rem", borderRadius: 12, border: "none",
              background: "var(--ink)", color: "var(--paper)", fontSize: "0.95rem", fontWeight: 600,
              letterSpacing: "0.02em", cursor: busy ? "default" : "pointer", opacity: busy ? 0.6 : 1, transition: "opacity .3s" }}>
            {busy ? (reg ? tp("creating", lang) : tp("signing", lang)) : (reg ? tp("create_account", lang) : tp("signin", lang))}
          </button>
        </form>

        {variant === "client" && (
          <button onClick={() => { setErr(""); setReg((r) => !r); }}
            style={{ marginTop: "1.4rem", background: "none", border: "none", color: "var(--clay)", fontSize: "0.88rem", fontWeight: 500, cursor: "pointer", padding: 0 }}>
            {reg ? tp("have_account", lang) : tp("first_time", lang)}
          </button>
        )}
        {variant === "admin" && (
          <p style={{ color: "var(--ink-faint)", fontSize: "0.8rem", marginTop: "1.6rem" }}>{tp("staff_hint", lang)}</p>
        )}
        {variant === "client" && !reg && (
          <p style={{ color: "var(--ink-faint)", fontSize: "0.8rem", marginTop: "1.6rem", lineHeight: 1.5 }}>{tp("help", lang)}</p>
        )}
      </div>
    </div>
  );
}
