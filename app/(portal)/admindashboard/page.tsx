"use client";

import { useCallback, useEffect, useState } from "react";
import { useT } from "@/lib/i18n";
import { tp } from "@/lib/portal/strings";
import { usePortalAuth } from "@/lib/portal/auth";
import { createClient, deleteProject, listAllProjects, listClients, listLeads, saveProject, sendLeadToPuffer, setLeadStatus, subscribe } from "@/lib/portal/store";
import { type Lead, type LeadStatus, type PortalUser, type Project } from "@/lib/portal/types";
import { JOURNEY, stageIndex } from "@/lib/portal/journey";
import LoginForm from "@/components/portal/LoginForm";
import ProjectForm from "@/components/portal/ProjectForm";
import ProjectManage from "@/components/portal/ProjectManage";
import ClientDetail from "@/components/portal/ClientDetail";
import NotifyPrompt from "@/components/portal/NotifyPrompt";
import PortalShell, { Icons } from "@/components/portal/PortalShell";
import Monogram from "@/components/brand/Monogram";

// Brass studio identity lockup — the Team door's antique-brass counterpart to
// the client portal's green 'Client Portal' mark. Sits above the working area
// on every section so staff always read 'this is Evora, at work'.
function StudioLockup({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0 0 1rem", marginBottom: "1.6rem", borderBottom: "1px solid var(--line-soft)" }}>
      <Monogram tone="brass" style={{ height: "1.15rem", width: "1.15rem", flexShrink: 0 }} />
      <span style={{ fontSize: "0.66rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, color: "var(--brass)" }}>{label}</span>
    </div>
  );
}

// Small line phone glyph (stroke = currentColor) — replaces the 📞 emoji
// affordance the rebrand bans on branded surfaces.
const PhoneIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const timeAgo = (t?: number, ar?: boolean) => {
  if (!t) return "";
  const s = Math.floor((Date.now() - t) / 1000);
  if (s < 60) return ar ? "الآن" : "just now";
  const m = Math.floor(s / 60); if (m < 60) return ar ? `قبل ${m} د` : `${m}m ago`;
  const h = Math.floor(m / 60); if (h < 24) return ar ? `قبل ${h} س` : `${h}h ago`;
  const d = Math.floor(h / 24); return ar ? `قبل ${d} ي` : `${d}d ago`;
};

export default function AdminPage() {
  const { lang } = useT();
  const t = (en: string, ar: string) => (lang === "ar" ? ar : en);
  const { user, loading } = usePortalAuth();
  const [section, setSection] = useState("overview");
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<PortalUser[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [editing, setEditing] = useState<Project | null>(null);
  const [managing, setManaging] = useState<Project | null>(null);
  const [adding, setAdding] = useState(false);
  const [addingClient, setAddingClient] = useState(false);
  const [query, setQuery] = useState("");
  const [viewClient, setViewClient] = useState<PortalUser | null>(null);
  const [prefillOwner, setPrefillOwner] = useState<PortalUser | null>(null);
  const [viewPlan, setViewPlan] = useState<string | null>(null);

  const load = useCallback(async () => {
    setProjects(await listAllProjects());
    setClients(await listClients());
    try { setLeads(await listLeads()); } catch { /* leads optional */ }
  }, []);
  useEffect(() => { if (user?.role === "admin") load(); }, [user, load]);
  useEffect(() => { if (user?.role !== "admin") return; return subscribe(() => load()); }, [user, load]);

  if (loading) return <Splash />;
  if (!user || user.role !== "admin") return <LoginForm variant="admin" />;

  async function onSave(p: Project) { await saveProject(p); setEditing(null); setAdding(false); load(); }
  async function onDelete(id: string) { await deleteProject(id); load(); }
  const newLeads = leads.filter((l) => l.status === "new").length;
  const inProd = projects.filter((p) => JOURNEY[stageIndex(p.stage || "blueprint")].phase === "production").length;
  const ci = (p: Project) => stageIndex(p.stage || "blueprint");

  const nav = [
    { key: "overview", label: t("Overview", "نظرة عامة"), icon: Icons.overview },
    { key: "projects", label: t("Projects", "المشاريع"), icon: Icons.projects },
    { key: "clients", label: t("Clients", "العملاء"), icon: Icons.clients },
    { key: "leads", label: t("Leads", "الطلبات"), icon: Icons.leads, badge: newLeads || undefined },
  ];
  const titles: Record<string, [string, string]> = {
    overview: [t("Studio overview", "نظرة عامة على الاستوديو"), `${t("Welcome back", "أهلًا بعودتك")}، ${user.name}`],
    projects: [t("Projects", "المشاريع"), `${projects.length} ${t("total", "إجمالي")}`],
    clients: [t("Clients", "العملاء"), `${clients.length} ${t("total", "إجمالي")}`],
    leads: [t("Design requests", "طلبات التصميم"), `${newLeads} ${t("new", "جديد")}`],
  };
  const actions = (section === "overview" || section === "projects")
    ? <button onClick={() => setAdding(true)} style={primaryBtn}>+ {tp("add_project", lang)}</button>
    : section === "clients" ? <button onClick={() => setAddingClient(true)} style={primaryBtn}>+ {tp("add_client", lang)}</button> : null;

  return (
    <PortalShell nav={nav} active={section} onNavigate={setSection} title={titles[section][0]} subtitle={titles[section][1]} actions={actions} accentName={user.name}>
      <StudioLockup label={tp("team_lockup", lang)} />
      <NotifyPrompt />

      {section === "overview" && (
        <div style={{ display: "grid", gap: "1.6rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: "1rem" }}>
            {[
              { l: t("Projects", "المشاريع"), v: projects.length, sub: `${projects.filter((p) => p.status === "delivered").length} ${t("delivered", "مسلّم")}` },
              { l: t("Clients", "العملاء"), v: clients.length },
              { l: t("In production", "قيد الإنتاج"), v: inProd },
              { l: t("New leads", "طلبات جديدة"), v: newLeads, accent: newLeads > 0 },
            ].map((s) => (
              <div key={s.l} style={{ ...card, padding: "1.3rem 1.4rem", background: s.accent ? "var(--ink)" : "#fff" }}>
                <div className="display" style={{ fontSize: "2.4rem", lineHeight: 1, color: s.accent ? "#fff" : "var(--ink)" }}>{s.v}</div>
                <div style={{ fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: s.accent ? "rgba(255,255,255,0.7)" : "var(--ink-faint)", marginTop: "0.5rem" }}>{s.l}</div>
                {s.sub && <div style={{ fontSize: "0.72rem", color: "var(--ink-faint)", marginTop: "0.2rem" }}>{s.sub}</div>}
              </div>
            ))}
          </div>

          {/* pipeline */}
          <div style={{ ...card, padding: "1.4rem 1.6rem" }}>
            <p style={sectTitle}>{t("Pipeline by stage", "المراحل")}</p>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${JOURNEY.length}, 1fr)`, gap: "0.5rem", marginTop: "0.5rem" }}>
              {JOURNEY.map((st, i) => {
                const n = projects.filter((p) => ci(p) === i).length;
                return (
                  <div key={st.key} style={{ textAlign: "center" }}>
                    <div style={{ height: 60, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                      <div style={{ height: `${Math.min(100, n ? 20 + n * 16 : 6)}%`, background: n ? "var(--clay)" : "var(--line)", borderRadius: "6px 6px 0 0", display: "grid", placeItems: "start center", color: "#fff", fontSize: "0.7rem", fontWeight: 700, paddingTop: 3 }}>{n || ""}</div>
                    </div>
                    <div style={{ fontSize: "0.58rem", color: "var(--ink-faint)", marginTop: "0.4rem", lineHeight: 1.2 }}>{(lang === "ar" ? st.ar : st.en).split(" ")[0]}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1.4rem" }}>
            {/* recent activity */}
            <div style={{ ...card, padding: "1.4rem 1.6rem" }}>
              <p style={sectTitle}>{t("Recent activity", "آخر النشاطات")}</p>
              {[...projects].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)).slice(0, 5).map((p) => (
                <button key={p.id} onClick={() => setManaging(p)} style={{ width: "100%", display: "flex", alignItems: "center", gap: "0.8rem", padding: "0.6rem 0", borderTop: "1px solid var(--line-soft)", background: "transparent", border: "none", cursor: "pointer", textAlign: "start" }}>
                  <span style={{ width: 36, height: 36, borderRadius: 8, background: "#f3f0ea", overflow: "hidden", flexShrink: 0 }}>{p.thumbnailUrl && <img src={p.thumbnailUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}</span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: "block", fontWeight: 600, color: "var(--ink)", fontSize: "0.88rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</span>
                    <span style={{ display: "block", fontSize: "0.72rem", color: "var(--clay)" }}>{lang === "ar" ? JOURNEY[ci(p)].ar : JOURNEY[ci(p)].en}</span>
                  </span>
                  <span style={{ fontSize: "0.68rem", color: "var(--ink-faint)", flexShrink: 0 }}>{timeAgo(p.updatedAt, lang === "ar")}</span>
                </button>
              ))}
              {projects.length === 0 && <p style={{ color: "var(--ink-faint)", fontSize: "0.88rem" }}>{t("No projects yet.", "لا مشاريع.")}</p>}
            </div>
            {/* new leads */}
            <div style={{ ...card, padding: "1.4rem 1.6rem" }}>
              <p style={sectTitle}>{t("New requests", "طلبات جديدة")}</p>
              {leads.filter((l) => l.status === "new").slice(0, 5).map((l) => (
                <div key={l.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.6rem", padding: "0.6rem 0", borderTop: "1px solid var(--line-soft)" }}>
                  <span style={{ minWidth: 0 }}><span style={{ display: "block", fontWeight: 600, color: "var(--ink)", fontSize: "0.88rem" }}>{l.name || "—"}</span><span style={{ fontSize: "0.76rem", color: "var(--ink-faint)" }}>{l.phone}</span></span>
                  <a href={`tel:${l.phone}`} style={{ ...miniBtn, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}><PhoneIcon /> {t("Call", "اتصال")}</a>
                </div>
              ))}
              {newLeads === 0 && <p style={{ color: "var(--ink-faint)", fontSize: "0.88rem" }}>{t("No new requests.", "لا طلبات جديدة.")}</p>}
            </div>
          </div>
        </div>
      )}

      {section === "projects" && (
        <>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("Search by title, client or phone…", "ابحث بالعنوان أو العميل أو الهاتف…")}
            style={{ width: "100%", maxWidth: 460, padding: "0.8rem 1.1rem", border: "1px solid var(--line)", borderRadius: 999, fontSize: "0.9rem", color: "var(--ink)", marginBottom: "1.6rem", background: "#fff" }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: "1.3rem" }}>
            {projects.filter((p) => { const s = query.trim().toLowerCase(); return !s || `${p.title} ${p.ownerName || ""} ${p.ownerPhone || ""} ${p.room || ""}`.toLowerCase().includes(s); }).map((p) => {
              const pct = Math.round(((ci(p) + 1) / JOURNEY.length) * 100);
              return (
                <div key={p.id} style={{ ...card, overflow: "hidden" }}>
                  <div style={{ position: "relative", aspectRatio: "16/10", background: "#f3f0ea" }}>
                    {p.thumbnailUrl && <img src={p.thumbnailUrl} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                    {p.model3dUrl && <span style={{ position: "absolute", top: 10, insetInlineEnd: 10, padding: "0.25em 0.6em", borderRadius: 999, background: "rgba(255,255,255,0.92)", color: "var(--ink)", fontSize: "0.62rem", fontWeight: 700 }}>3D</span>}
                  </div>
                  <div style={{ padding: "1rem 1.1rem" }}>
                    <p style={{ fontSize: "0.7rem", color: "var(--ink-faint)", margin: 0 }}>{p.ownerName || p.ownerPhone}</p>
                    <h3 className="display" style={{ fontSize: "1.15rem", color: "var(--ink)", margin: "0.2rem 0 0.6rem" }}>{p.title}</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.8rem" }}>
                      <div style={{ flex: 1, height: 4, borderRadius: 999, background: "var(--line)", overflow: "hidden" }}><div style={{ width: `${pct}%`, height: "100%", background: "var(--clay)" }} /></div>
                      <span style={{ fontSize: "0.66rem", color: "var(--ink-faint)" }}>{ci(p) + 1}/{JOURNEY.length}</span>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      <button onClick={() => setManaging(p)} style={{ ...miniBtn, background: "var(--ink)", color: "#fff", border: "none" }}>{tp("manage", lang)}</button>
                      <button onClick={() => setEditing(p)} style={miniBtn}>{tp("edit", lang)}</button>
                      <button onClick={() => onDelete(p.id)} style={{ ...miniBtn, color: "var(--clay)", borderColor: "rgba(178,116,87,0.4)" }}>{tp("del", lang)}</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {section === "clients" && (
        <div style={{ ...card, overflow: "hidden", padding: 0 }}>
          {clients.map((c, i) => {
            const count = projects.filter((p) => p.ownerUid === c.uid || (c.phone && p.ownerPhone && p.ownerPhone.replace(/\D/g, "") === c.phone.replace(/\D/g, ""))).length;
            return (
              <button key={c.uid} onClick={() => setViewClient(c)} style={{ width: "100%", textAlign: "start", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", padding: "1rem 1.3rem", borderTop: i ? "1px solid var(--line-soft)" : "none", borderInline: "none", borderBottom: "none", background: "transparent", cursor: "pointer" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}>
                  <span style={{ width: 42, height: 42, borderRadius: 999, background: "var(--ink)", color: "#fff", display: "grid", placeItems: "center", fontFamily: "var(--f-display)", fontSize: "1.1rem" }}>{(c.name || "?").trim().charAt(0).toUpperCase()}</span>
                  <span><span style={{ display: "block", color: "var(--ink)", fontWeight: 600 }}>{c.name || "—"}</span><span style={{ display: "block", color: "var(--ink-faint)", fontSize: "0.82rem" }}>{c.phone}</span></span>
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "0.8rem", color: "var(--ink-faint)", fontSize: "0.8rem" }}>{count} {lang === "ar" ? "مشروع" : count === 1 ? "project" : "projects"} <span style={{ color: "var(--clay)" }}>→</span></span>
              </button>
            );
          })}
          {clients.length === 0 && <p style={{ padding: "1.4rem", color: "var(--ink-faint)" }}>{t("No clients yet.", "لا عملاء.")}</p>}
        </div>
      )}

      {section === "leads" && (
        <div style={{ display: "grid", gap: "0.9rem" }}>
          {leads.length === 0 && <p style={{ color: "var(--ink-faint)" }}>{t("No design requests yet.", "لا توجد طلبات.")}</p>}
          {leads.map((l) => (
            <div key={l.id} style={{ ...card, padding: "1.1rem 1.3rem", display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ minWidth: 200 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <h3 className="display" style={{ fontSize: "1.15rem", color: "var(--ink)", margin: 0 }}>{l.name || "—"}</h3>
                  <span style={{ fontSize: "0.62rem", padding: "0.2em 0.6em", borderRadius: 999, textTransform: "uppercase", letterSpacing: "0.06em", background: l.status === "new" ? "var(--ink)" : l.status === "qualified" ? "var(--clay)" : "var(--line)", color: l.status === "new" || l.status === "qualified" ? "#fff" : "var(--ink-soft)" }}>{l.status}</span>
                </div>
                <a href={`tel:${l.phone}`} style={{ color: "var(--clay)", fontWeight: 600, fontSize: "0.95rem" }}>{l.phone}</a>
                {l.message && <p style={{ margin: "0.35rem 0 0", color: "var(--ink-soft)", fontSize: "0.88rem" }}>{l.message}</p>}
                {l.planUrl && !l.planUrl.endsWith(".pdf") && (
                  <button onClick={() => setViewPlan(l.planUrl!)} title={t("Open plan", "افتح المخطط")} style={{ display: "inline-block", marginTop: "0.5rem", padding: 0, border: "none", background: "transparent", cursor: "zoom-in" }}>
                    <img src={l.planUrl} alt="plan" style={{ maxHeight: 90, borderRadius: 8, border: "1px solid var(--line)" }} />
                  </button>
                )}
                {l.planUrl && l.planUrl.endsWith(".pdf") && <a href={l.planUrl} target="_blank" rel="noreferrer" style={{ fontSize: "0.8rem", color: "var(--clay)", display: "inline-block", marginTop: "0.4rem" }}>{t("View plan (PDF) →", "عرض المخطط →")}</a>}
              </div>
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                {(["called", "qualified", "rejected"] as LeadStatus[]).map((s) => (
                  <button key={s} onClick={async () => { await setLeadStatus(l.id, s); load(); }} style={{ ...miniBtn, ...(l.status === s ? { background: "var(--ink)", color: "#fff", border: "none" } : {}) }}>{s}</button>
                ))}
                {l.planUrl && (
                  <button onClick={async () => { await sendLeadToPuffer(l.id, !l.sentToPuffer); load(); }}
                    style={{ ...miniBtn, ...(l.sentToPuffer ? { background: "var(--clay)", color: "#fff", border: "none" } : { borderColor: "var(--clay)", color: "var(--clay)" }) }}>
                    {l.sentToPuffer ? `✓ ${t("In the Studio", "في الاستوديو")}` : `↗ ${t("Send to Studio", "أرسل إلى الاستوديو")}`}
                  </button>
                )}
                <button onClick={async () => { await setLeadStatus(l.id, "converted"); setPrefillOwner({ uid: "", phone: l.phone, name: l.name, role: "client" }); setAdding(true); }} style={{ ...miniBtn, background: "var(--ink)", color: "#fff", border: "none" }}>→ {t("Create project", "إنشاء مشروع")}</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(adding || editing) && (
        <ProjectForm initial={editing} clients={clients} prefillOwner={prefillOwner}
          onCancel={() => { setAdding(false); setEditing(null); setPrefillOwner(null); }}
          onSave={(p) => { onSave(p); setPrefillOwner(null); }} />
      )}
      {viewClient && (
        <ClientDetail client={viewClient} projects={projects} onClose={() => setViewClient(null)}
          onManage={(p) => { setViewClient(null); setManaging(p); }}
          onAddProject={(c) => { setViewClient(null); setPrefillOwner(c); setAdding(true); }} />
      )}
      {addingClient && <AddClient onClose={() => setAddingClient(false)} onDone={() => { setAddingClient(false); load(); }} />}
      {managing && <ProjectManage project={projects.find((p) => p.id === managing.id) || managing} by={user.name} onClose={() => setManaging(null)} />}
      {viewPlan && (
        <div onClick={() => setViewPlan(null)} style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(13,13,13,0.92)", display: "grid", placeItems: "center", padding: "1.5rem", cursor: "zoom-out" }}>
          <img src={viewPlan} alt="2D plan" style={{ maxWidth: "100%", maxHeight: "92dvh", objectFit: "contain", borderRadius: 8, background: "#fff" }} />
          <a href={viewPlan} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} style={{ position: "fixed", top: 18, insetInlineEnd: 18, background: "rgba(255,255,255,0.15)", color: "#fff", padding: "0.5em 1em", borderRadius: 999, fontSize: "0.82rem", textDecoration: "none" }}>{t("Open original ↗", "الأصل ↗")}</a>
        </div>
      )}
    </PortalShell>
  );
}

// Branded auth-resolving splash — the brass 'E' monogram breathing on the
// midnight-atelier field, not a bare 'EVORA' text.
function Splash() {
  return (
    <div style={{ minHeight: "100dvh", display: "grid", placeItems: "center", background: "var(--ink)" }}>
      <Monogram tone="brass" style={{ height: "2.6rem", width: "2.6rem", animation: "ev-splash-pulse 1.6s var(--ease) infinite" }} />
      <style>{`@keyframes ev-splash-pulse { 0%,100% { opacity: 0.45; } 50% { opacity: 1; } } @media (prefers-reduced-motion: reduce) { [style*="ev-splash-pulse"] { animation: none !important; opacity: 0.85; } }`}</style>
    </div>
  );
}

function AddClient({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const { lang, dir } = useT();
  const [name, setName] = useState(""); const [phone, setPhone] = useState(""); const [pw, setPw] = useState("");
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  const field: React.CSSProperties = { width: "100%", padding: "0.7rem 0.85rem", marginTop: "0.35rem", border: "1px solid var(--line)", borderRadius: 10, fontSize: "0.92rem", color: "var(--ink)", background: "#fff" };
  async function submit(e: React.FormEvent) { e.preventDefault(); setErr(""); setBusy(true); try { await createClient(phone.trim(), name.trim(), pw); onDone(); } catch (e) { setErr(String((e as Error).message)); } finally { setBusy(false); } }
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(22,21,15,0.5)", backdropFilter: "blur(6px)", display: "grid", placeItems: "center", padding: "1rem" }}>
      <form dir={dir} onClick={(e) => e.stopPropagation()} onSubmit={submit} style={{ width: "min(420px,100%)", background: "var(--paper)", borderRadius: 16, padding: "1.8rem", boxShadow: "0 40px 120px rgba(0,0,0,0.3)" }}>
        <h2 className="display" style={{ fontSize: "1.5rem", color: "var(--ink)", margin: "0 0 1.3rem" }}>{tp("add_client", lang)}</h2>
        <label style={{ fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-faint)" }}>{tp("client_name", lang)}<input style={field} value={name} onChange={(e) => setName(e.target.value)} required /></label>
        <div style={{ height: "0.9rem" }} />
        <label style={{ fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-faint)" }}>{tp("phone", lang)}<input style={field} value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" required /></label>
        <div style={{ height: "0.9rem" }} />
        <label style={{ fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-faint)" }}>{tp("password", lang)}<input style={field} value={pw} onChange={(e) => setPw(e.target.value)} type="text" minLength={6} required /></label>
        {err && <p style={{ color: "var(--clay)", fontSize: "0.85rem", marginTop: "0.9rem" }}>{err}</p>}
        <div style={{ display: "flex", gap: "0.7rem", marginTop: "1.5rem" }}>
          <button type="submit" disabled={busy} style={{ flex: 1, padding: "0.85rem", borderRadius: 10, border: "none", background: "var(--ink)", color: "#fff", fontWeight: 600, cursor: "pointer", opacity: busy ? 0.6 : 1 }}>{tp("save", lang)}</button>
          <button type="button" onClick={onClose} style={{ padding: "0.85rem 1.4rem", borderRadius: 10, border: "1px solid var(--line)", background: "transparent", color: "var(--ink)", cursor: "pointer" }}>{tp("cancel", lang)}</button>
        </div>
      </form>
    </div>
  );
}

const card: React.CSSProperties = { background: "#fff", border: "1px solid var(--line)", borderRadius: 16 };
const sectTitle: React.CSSProperties = { fontSize: "0.7rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-faint)", margin: 0, fontWeight: 600 };
const primaryBtn: React.CSSProperties = { padding: "0.6rem 1.2rem", borderRadius: 999, border: "none", background: "var(--clay)", color: "#fff", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" };
const miniBtn: React.CSSProperties = { padding: "0.4rem 0.9rem", borderRadius: 999, border: "1px solid var(--line)", background: "transparent", color: "var(--ink)", fontSize: "0.78rem", cursor: "pointer" };
