"use client";

import { useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useT } from "@/lib/i18n";
import { tp } from "@/lib/portal/strings";
import { usePortalAuth } from "@/lib/portal/auth";
import { registerCustomer } from "@/lib/portal/store";
import { WHATSAPP } from "@/lib/brand";
import Wordmark from "@/components/brand/Wordmark";
import Monogram from "@/components/brand/Monogram";

/* ============================================================
   Branded split-screen sign-in.
   LEFT  — a slow room film with an --ink scrim + the SVG Wordmark
           and the "Your Future Home" tagline (hidden < 820px).
   RIGHT — the form on --paper with a Framer Motion staggered
           entrance (lockup → heading → fields → button).
   variant='client' reads in --ever (Client Portal door),
   variant='admin'  reads in --brass-2 (Evora Future Studio · Team).
   Shared by /login, /join and the unauth states of the client and
   admin dashboards so everyone lands in the right door.
   ============================================================ */

// A different room beyond each door, so staff and clients feel distinct.
const FILM: Record<"client" | "admin", { src: string; poster: string }> = {
  client: { src: "/evora/room-living.mp4", poster: "/evora/room-living.jpg" },
  admin: { src: "/evora/room-dining.mp4", poster: "/evora/room-dining.jpg" },
};

export default function LoginForm({
  variant = "client", prefillPhone = "", startMode = "signin",
}: {
  variant?: "client" | "admin";
  prefillPhone?: string;
  startMode?: "signin" | "register";
}) {
  const { lang, dir } = useT();
  const reduce = useReducedMotion();
  const { signIn, refresh } = usePortalAuth();
  const [reg, setReg] = useState(startMode === "register");
  const [identifier, setIdentifier] = useState(prefillPhone);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [shake, setShake] = useState(0);

  const admin = variant === "admin";
  // Focus ring + button accent: --ever (client) / --brass (admin, AA on white).
  const accent = admin ? "var(--brass)" : "var(--ever)";
  // Lockup mark: green Client Portal / on-dark brass Team lockup.
  const lockupColor = admin ? "var(--brass-2)" : "var(--ever)";
  const film = FILM[variant];

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      if (reg) {
        await registerCustomer(identifier.trim(), name.trim(), password);
        refresh();
      } else {
        const u = await signIn(identifier.trim(), password);
        if (admin && u.role !== "admin") { setErr(tp("not_admin", lang)); setShake((s) => s + 1); }
      }
    } catch (e) {
      const m = (e as Error).message;
      setErr(m === "ALREADY_REGISTERED" ? tp("already_registered", lang) : tp("bad_creds", lang));
      setShake((s) => s + 1);
    } finally { setBusy(false); }
  }

  const waHref = `${WHATSAPP}?text=${encodeURIComponent(tp("wa_help_prefill", lang))}`;

  // Staggered entrance — lockup, heading, each field, then the button.
  const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.08 } } };
  const item: Variants = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.4 } } }
    : { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } };

  const label: React.CSSProperties = { display: "block", fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-faint)" };

  return (
    <div className="lf-root" dir={dir} style={{ ["--lf-accent" as string]: accent }}>
      {/* LEFT — cinematic film panel */}
      <aside className="lf-film" aria-hidden="true">
        <video className="lf-video" autoPlay muted loop playsInline preload="metadata" poster={film.poster}>
          <source src={film.src} type="video/mp4" />
        </video>
        <span className="lf-scrim" />
        <div className="lf-film-mark">
          <Wordmark tone="paper" tagline={false} style={{ height: "3.1rem", width: "auto" }} />
          <p className="lf-film-tag">{tp("tagline", lang)}</p>
        </div>
        <a href="/" className="lf-film-back">{tp("back_site", lang)}</a>
      </aside>

      {/* RIGHT — the form */}
      <main className="lf-pane">
        <motion.div className="lf-card" variants={container} initial="hidden" animate="show">
          {/* lockup */}
          <motion.a href="/" variants={item} className="lf-lockup" style={{ color: lockupColor }}>
            <Monogram style={{ height: "1.6rem", width: "1.6rem" }} />
            <span className="lf-lockup-text">{tp(admin ? "team_lockup" : "portal", lang)}</span>
          </motion.a>

          {/* heading */}
          <motion.h1 variants={item} className="display lf-h1">
            {reg ? tp("create_account", lang) : tp("welcome_home", lang)}
          </motion.h1>
          <motion.p variants={item} className="lf-sub">
            {reg ? tp("register_sub", lang) : tp(admin ? "team_sub" : "signin_sub", lang)}
          </motion.p>

          <form onSubmit={submit} className="lf-form">
            {reg && (
              <motion.div variants={item} className="lf-field-wrap">
                <label style={label}>{tp("full_name", lang)}</label>
                <input className="lf-field" value={name} onChange={(e) => setName(e.target.value)} required />
              </motion.div>
            )}

            <motion.div variants={item} className="lf-field-wrap">
              <label style={label}>{admin ? tp("admin_id_label", lang) : tp("phone", lang)}</label>
              <input className="lf-field" value={identifier} onChange={(e) => setIdentifier(e.target.value)}
                type="text" inputMode={admin ? "text" : "tel"} autoCapitalize="none" autoCorrect="off" spellCheck={false}
                autoComplete="username" placeholder={admin ? "bakri@evorafuture.com" : "07_ _______"} required />
            </motion.div>

            <motion.div variants={item} className="lf-field-wrap">
              <label style={label}>{tp("password", lang)}</label>
              <input className="lf-field" value={password} onChange={(e) => setPassword(e.target.value)}
                type="password" autoComplete={reg ? "new-password" : "current-password"} required />
            </motion.div>

            {err && (
              <motion.p key={shake} role="alert" className="lf-err"
                animate={reduce ? { opacity: 1 } : { x: [0, -9, 8, -6, 4, 0] }}
                transition={{ duration: 0.5, ease: "easeInOut" }}>
                {err}
              </motion.p>
            )}

            <motion.button variants={item} type="submit" disabled={busy} className="lf-btn" data-busy={busy ? "on" : undefined}>
              <span className="lf-btn-text">
                {busy ? (reg ? tp("creating", lang) : tp("signing", lang)) : (reg ? tp("create_account", lang) : tp("signin", lang))}
              </span>
              {busy && <span className="lf-btn-shimmer" aria-hidden="true" />}
            </motion.button>
          </form>

          <motion.div variants={item} className="lf-foot">
            {variant === "client" && (
              <button type="button" onClick={() => { setErr(""); setReg((r) => !r); }} className="lf-toggle">
                {reg ? tp("have_account", lang) : tp("first_time", lang)}
              </button>
            )}
            {!reg && (
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="lf-wa">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
                <span>{tp("login_help_wa", lang)}</span>
              </a>
            )}
          </motion.div>
        </motion.div>
      </main>

      <style>{`
        .lf-root {
          min-height: 100dvh; display: grid; grid-template-columns: 1fr; background: var(--paper);
        }
        .lf-film { display: none; }
        .lf-pane {
          display: grid; place-items: center; padding: clamp(1.5rem, 5vw, 3.2rem);
          min-height: 100dvh;
        }
        .lf-card { width: min(420px, 100%); }
        .lf-lockup { display: inline-flex; align-items: center; gap: 0.6rem; text-decoration: none; margin-bottom: 2.4rem; }
        .lf-lockup-text { font-size: 0.7rem; letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; }
        .lf-h1 { font-size: clamp(2rem, 6vw, 2.9rem); line-height: 1.04; color: var(--ink); margin: 0; }
        .lf-sub { color: var(--ink-faint); margin: 0.7rem 0 2.2rem; font-size: 1rem; line-height: 1.55; max-width: 38ch; }
        .lf-form { display: flex; flex-direction: column; gap: 1.1rem; }
        .lf-field-wrap { display: flex; flex-direction: column; gap: 0.4rem; }
        .lf-field {
          width: 100%; padding: 0.95rem 1rem; border: 1px solid var(--line); border-radius: 12px;
          background: var(--paper); font-family: var(--f-sans); font-size: 1rem; color: var(--ink);
          outline: none; transition: border-color .25s var(--ease), box-shadow .25s var(--ease);
        }
        .lf-field::placeholder { color: var(--ink-faint); opacity: 0.65; }
        .lf-field:focus {
          border-color: var(--lf-accent);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--lf-accent) 22%, transparent);
        }
        .lf-err { color: var(--clay); font-size: 0.88rem; margin: 0.2rem 0 0; }
        .lf-btn {
          position: relative; overflow: hidden; width: 100%; margin-top: 0.6rem; padding: 1.05rem;
          border-radius: 12px; border: none; background: var(--ink); color: var(--paper);
          font-family: var(--f-sans); font-size: 0.95rem; font-weight: 600; letter-spacing: 0.02em;
          cursor: pointer; transition: transform .3s var(--ease), background .3s var(--ease), opacity .3s;
        }
        .lf-btn:hover:not([data-busy]) { transform: translateY(-2px); background: var(--lf-accent); }
        .lf-btn[data-busy] { cursor: default; opacity: 0.85; }
        .lf-btn-text { position: relative; z-index: 1; }
        .lf-btn-shimmer {
          position: absolute; inset: 0; z-index: 0;
          background: linear-gradient(100deg, transparent 20%, color-mix(in srgb, var(--lf-accent) 60%, transparent) 50%, transparent 80%);
          transform: translateX(-100%); animation: lf-shimmer 1.15s linear infinite;
        }
        @keyframes lf-shimmer { to { transform: translateX(100%); } }
        .lf-foot { display: flex; flex-direction: column; gap: 1rem; margin-top: 1.8rem; align-items: flex-start; }
        .lf-toggle { background: none; border: none; padding: 0; color: var(--lf-accent); font-family: var(--f-sans); font-size: 0.9rem; font-weight: 600; cursor: pointer; }
        .lf-toggle:hover { text-decoration: underline; text-underline-offset: 4px; }
        .lf-wa { display: inline-flex; align-items: center; gap: 0.5rem; color: var(--ink-soft); font-size: 0.86rem; text-decoration: none; }
        .lf-wa:hover { color: var(--ink); }
        .lf-wa svg { color: var(--ever-2); }

        .lf-video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transform: scale(1.06); animation: lf-drift 28s ease-in-out infinite alternate; }
        .lf-scrim { position: absolute; inset: 0; background:
          linear-gradient(180deg, rgba(22,21,15,0.30) 0%, rgba(22,21,15,0.18) 38%, rgba(22,21,15,0.78) 100%); }
        .lf-film-mark { position: absolute; inset-block-end: clamp(2.2rem, 5vw, 3.4rem); inset-inline-start: clamp(2.2rem, 5vw, 3.4rem); inset-inline-end: clamp(2.2rem, 5vw, 3.4rem); }
        .lf-film-tag { margin: 0.9rem 0 0; color: var(--brass-2); font-family: var(--f-display); font-size: clamp(1.05rem, 1.7vw, 1.35rem); letter-spacing: 0.01em; }
        html[dir="rtl"] .lf-film-tag { font-family: var(--f-ar); }
        .lf-film-back { position: absolute; inset-block-start: clamp(1.6rem, 3vw, 2.4rem); inset-inline-start: clamp(2.2rem, 5vw, 3.4rem); color: rgba(255,255,255,0.78); font-size: 0.78rem; letter-spacing: 0.04em; text-decoration: none; }
        .lf-film-back:hover { color: #fff; }
        @keyframes lf-drift { from { transform: scale(1.06) translate3d(0,0,0); } to { transform: scale(1.14) translate3d(-1.5%, -1.5%, 0); } }
        @media (prefers-reduced-motion: reduce) {
          .lf-video { animation: none; transform: none; }
          .lf-btn-shimmer { animation: none; }
        }

        @media (min-width: 820px) {
          .lf-root { grid-template-columns: 1.05fr 1fr; }
          .lf-film { position: relative; display: block; overflow: hidden; background: var(--ink); }
          .lf-pane { min-height: 100dvh; }
        }
      `}</style>
    </div>
  );
}
