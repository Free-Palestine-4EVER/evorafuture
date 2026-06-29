"use client";

import { useT } from "@/lib/i18n";
import { tp } from "@/lib/portal/strings";
import { usePortalAuth } from "@/lib/portal/auth";
import { promptPush, pushConfigured } from "@/lib/portal/push";
import Wordmark from "@/components/brand/Wordmark";

const BellIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

export default function PortalHeader({ name, admin = false }: { name?: string; admin?: boolean }) {
  const { lang, toggle } = useT();
  const { signOut } = usePortalAuth();

  const btn: React.CSSProperties = {
    background: "transparent", border: "1px solid var(--line)", borderRadius: 999,
    padding: "0.5em 0.95em", fontSize: "0.78rem", fontWeight: 500, color: "var(--ink)", cursor: "pointer",
  };

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(255,255,255,0.85)", backdropFilter: "blur(14px)", borderBottom: "1px solid var(--line)" }}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 68, gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "0.7rem" }}>
          <a href="/" aria-label="Evora — Future Home" style={{ display: "inline-flex" }}>
            <Wordmark tone="ink" tagline={false} style={{ height: "1.25rem", width: "auto" }} />
          </a>
          <span style={{ fontSize: "0.7rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-faint)" }}>
            {tp(admin ? "portal_admin" : "portal", lang)}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          {name && <span style={{ fontSize: "0.84rem", color: "var(--ink-soft)" }}>{name}</span>}
          {pushConfigured && (
            <button onClick={() => promptPush()} title={lang === "ar" ? "تفعيل الإشعارات" : "Enable notifications"}
              style={{ ...btn, padding: "0.5em 0.6em", display: "inline-flex", alignItems: "center" }} aria-label="Enable notifications">{BellIcon}</button>
          )}
          <button onClick={toggle} style={{ ...btn, fontFamily: lang === "en" ? "var(--f-ar)" : "var(--f-sans)" }}>
            {lang === "en" ? "العربية" : "EN"}
          </button>
          <button onClick={() => signOut()} style={btn}>{tp("signout", lang)}</button>
        </div>
      </div>
    </header>
  );
}
