"use client";

import { useT } from "@/lib/i18n";
import { usePortalAuth } from "@/lib/portal/auth";
import { promptPush, pushConfigured } from "@/lib/portal/push";

export interface NavItem { key: string; label: string; icon: React.ReactNode; badge?: number }

/* Premium portal shell — dark rail on desktop, bottom tab bar on mobile.
   Used by both the admin and client dashboards for one cohesive app feel. */
export default function PortalShell({
  nav, active, onNavigate, title, subtitle, actions, children, accentName,
}: {
  nav: NavItem[];
  active: string;
  onNavigate: (k: string) => void;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  accentName?: string;
}) {
  const { lang, toggle } = useT();
  const { user, signOut } = usePortalAuth();

  const railLink = (n: NavItem) => {
    const on = n.key === active;
    return (
      <button key={n.key} onClick={() => onNavigate(n.key)} className="ps-rail-link"
        style={{ background: on ? "rgba(255,255,255,0.10)" : "transparent", color: on ? "#fff" : "rgba(255,255,255,0.62)" }}>
        <span style={{ position: "relative", display: "grid", placeItems: "center", width: 22, height: 22 }}>
          {n.icon}
          {!!n.badge && <span style={{ position: "absolute", top: -6, insetInlineEnd: -8, minWidth: 16, height: 16, padding: "0 4px", borderRadius: 999, background: "var(--clay)", color: "#fff", fontSize: "0.6rem", fontWeight: 700, display: "grid", placeItems: "center" }}>{n.badge}</span>}
        </span>
        <span className="ps-rail-label">{n.label}</span>
        {on && <span className="ps-rail-active" />}
      </button>
    );
  };

  return (
    <div className="ps-root">
      {/* desktop rail */}
      <aside className="ps-rail">
        <a href="/" className="display ps-logo">EVORA</a>
        <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1, marginTop: "1.6rem" }}>
          {nav.map(railLink)}
        </nav>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          {pushConfigured && <button onClick={() => promptPush()} className="ps-rail-link" style={{ color: "rgba(255,255,255,0.62)" }}><span>🔔</span><span className="ps-rail-label">{lang === "ar" ? "الإشعارات" : "Notifications"}</span></button>}
          <button onClick={toggle} className="ps-rail-link" style={{ color: "rgba(255,255,255,0.62)" }}><span style={{ fontFamily: lang === "en" ? "var(--f-ar)" : "var(--f-sans)" }}>ع</span><span className="ps-rail-label">{lang === "en" ? "العربية" : "English"}</span></button>
          <button onClick={() => signOut()} className="ps-rail-link" style={{ color: "rgba(255,255,255,0.62)" }}><span>⏻</span><span className="ps-rail-label">{lang === "ar" ? "خروج" : "Sign out"}</span></button>
        </div>
      </aside>

      {/* content */}
      <main className="ps-main">
        <header className="ps-topbar">
          <div style={{ minWidth: 0 }}>
            {subtitle && <p style={{ margin: 0, fontSize: "0.72rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--clay)" }}>{subtitle}</p>}
            <h1 className="display" style={{ margin: "0.15rem 0 0", fontSize: "clamp(1.6rem,4vw,2.4rem)", color: "var(--ink)", lineHeight: 1.05, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", flexShrink: 0 }}>
            {actions}
            {accentName && <span className="ps-avatar">{accentName.trim().charAt(0).toUpperCase()}</span>}
          </div>
        </header>
        <div className="ps-content">{children}</div>
      </main>

      {/* mobile bottom bar */}
      <nav className="ps-tabbar">
        {nav.map((n) => {
          const on = n.key === active;
          return (
            <button key={n.key} onClick={() => onNavigate(n.key)} style={{ flex: 1, background: "transparent", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "0.5rem 0", color: on ? "#fff" : "rgba(255,255,255,0.5)", position: "relative" }}>
              <span style={{ position: "relative", display: "grid", placeItems: "center", width: 22, height: 22 }}>
                {n.icon}
                {!!n.badge && <span style={{ position: "absolute", top: -5, insetInlineEnd: -7, minWidth: 15, height: 15, borderRadius: 999, background: "var(--clay)", color: "#fff", fontSize: "0.56rem", fontWeight: 700, display: "grid", placeItems: "center" }}>{n.badge}</span>}
              </span>
              <span style={{ fontSize: "0.62rem", letterSpacing: "0.02em" }}>{n.label}</span>
            </button>
          );
        })}
      </nav>

      <style>{`
        .ps-root { min-height: 100dvh; background: #f6f3ee; }
        .ps-rail { position: fixed; inset-block: 0; inset-inline-start: 0; width: 240px; background: #16150F; display: flex; flex-direction: column; padding: 1.6rem 1rem; z-index: 40; }
        .ps-logo { color: #fff; font-size: 1.4rem; letter-spacing: 0.04em; padding: 0 0.6rem; }
        .ps-rail-link { display: flex; align-items: center; gap: 0.85rem; padding: 0.7rem 0.75rem; border-radius: 12px; border: none; cursor: pointer; font-size: 0.9rem; font-weight: 500; text-align: start; position: relative; transition: background .25s, color .25s; }
        .ps-rail-link:hover { color: #fff !important; background: rgba(255,255,255,0.06); }
        .ps-rail-active { position: absolute; inset-inline-start: -1rem; top: 50%; transform: translateY(-50%); width: 3px; height: 22px; background: var(--clay); border-radius: 0 3px 3px 0; }
        .ps-main { margin-inline-start: 240px; min-height: 100dvh; display: flex; flex-direction: column; }
        .ps-topbar { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: clamp(1.4rem,3vw,2.2rem) clamp(1.2rem,3.5vw,3rem) 1.2rem; background: #f6f3ee; }
        .ps-content { padding: 0 clamp(1.2rem,3.5vw,3rem) 4rem; flex: 1; }
        .ps-avatar { width: 40px; height: 40px; border-radius: 999px; background: var(--ink); color: #fff; display: grid; place-items: center; font-family: var(--f-display); font-size: 1.05rem; }
        .ps-tabbar { display: none; }
        @media (max-width: 860px) {
          .ps-rail { display: none; }
          .ps-main { margin-inline-start: 0; padding-bottom: 72px; }
          .ps-tabbar { display: flex; position: fixed; inset-inline: 0; bottom: 0; background: #16150F; padding: 0.3rem 0.4rem calc(0.3rem + env(safe-area-inset-bottom)); z-index: 50; }
          .ps-topbar { padding-top: max(1.2rem, env(safe-area-inset-top)); }
        }
      `}</style>
    </div>
  );
}

// Tiny line icons (stroke = currentColor)
const ic = (d: string) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{d.split("|").map((p, i) => <path key={i} d={p} />)}</svg>;
export const Icons = {
  overview: ic("M3 13h8V3H3z|M13 21h8V3h-8z|M3 21h8v-6H3z"),
  projects: ic("M3 7l9-4 9 4-9 4z|M3 7v10l9 4 9-4V7|M12 11v10"),
  clients: ic("M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2|M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8|M22 21v-2a4 4 0 0 0-3-3.87|M16 3.13a4 4 0 0 1 0 7.75"),
  leads: ic("M22 6l-10 7L2 6|M2 6h20v12H2z"),
  designs: ic("M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z|M9 22V12h6v10"),
  scan: ic("M3 7V5a2 2 0 0 1 2-2h2|M17 3h2a2 2 0 0 1 2 2v2|M21 17v2a2 2 0 0 1-2 2h-2|M7 21H5a2 2 0 0 1-2-2v-2|M7 12h10"),
};
