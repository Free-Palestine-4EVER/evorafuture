"use client";

import { useCallback, useEffect, useState } from "react";
import { useT } from "@/lib/i18n";
import { tp } from "@/lib/portal/strings";
import { usePortalAuth } from "@/lib/portal/auth";
import { createClient, deleteProject, listAllProjects, listClients, listLeads, saveProject, setLeadStatus, subscribe } from "@/lib/portal/store";
import { type Lead, type LeadStatus, type PortalUser, type Project } from "@/lib/portal/types";
import { JOURNEY, stageIndex } from "@/lib/portal/journey";
import LoginForm from "@/components/portal/LoginForm";
import PortalHeader from "@/components/portal/PortalHeader";
import ProjectForm from "@/components/portal/ProjectForm";
import ProjectManage from "@/components/portal/ProjectManage";
import ClientDetail from "@/components/portal/ClientDetail";
import NotifyPrompt from "@/components/portal/NotifyPrompt";

export default function AdminPage() {
  const { lang } = useT();
  const { user, loading } = usePortalAuth();
  const [tab, setTab] = useState<"projects" | "clients" | "leads">("projects");
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

  const load = useCallback(async () => {
    setProjects(await listAllProjects());
    setClients(await listClients());
    try { setLeads(await listLeads()); } catch { /* leads optional */ }
  }, []);

  useEffect(() => { if (user?.role === "admin") load(); }, [user, load]);
  useEffect(() => { if (user?.role !== "admin") return; return subscribe(() => load()); }, [user, load]);

  if (loading) return <div style={{ minHeight: "100dvh", display: "grid", placeItems: "center", color: "var(--ink-faint)", fontFamily: "var(--f-display)" }}>EVORA</div>;
  if (!user || user.role !== "admin") return <LoginForm variant="admin" />;

  async function onSave(p: Project) { await saveProject(p); setEditing(null); setAdding(false); load(); }
  async function onDelete(id: string) { await deleteProject(id); load(); }

  const tabBtn = (key: "projects" | "clients" | "leads"): React.CSSProperties => ({
    padding: "0.5rem 1.1rem", borderRadius: 999, cursor: "pointer", fontSize: "0.85rem", fontWeight: 500,
    border: "1px solid", borderColor: tab === key ? "var(--ink)" : "var(--line)",
    background: tab === key ? "var(--ink)" : "transparent", color: tab === key ? "#fff" : "var(--ink-soft)",
  });

  return (
    <main style={{ minHeight: "100dvh" }}>
      <PortalHeader name={user.name} admin />

      <section className="container" style={{ paddingTop: "2.2rem", paddingBottom: "5rem" }}>
        <NotifyPrompt />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          {[
            { label: lang === "ar" ? "المشاريع" : "Projects", value: projects.length },
            { label: lang === "ar" ? "العملاء" : "Clients", value: clients.length },
            { label: lang === "ar" ? "قيد التنفيذ" : "In production", value: projects.filter((p) => JOURNEY[stageIndex(p.stage || "blueprint")].phase === "production").length },
            { label: lang === "ar" ? "طلبات جديدة" : "New leads", value: leads.filter((l) => l.status === "new").length, accent: true },
          ].map((s) => (
            <div key={s.label} style={{ border: "1px solid var(--line)", borderRadius: 14, padding: "1.1rem 1.3rem", background: s.accent && s.value > 0 ? "var(--ink)" : "#fff" }}>
              <div className="display" style={{ fontSize: "2.1rem", lineHeight: 1, color: s.accent && s.value > 0 ? "#fff" : "var(--ink)" }}>{s.value}</div>
              <div style={{ fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: s.accent && s.value > 0 ? "rgba(255,255,255,0.7)" : "var(--ink-faint)", marginTop: "0.4rem" }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBottom: "1.8rem" }}>
          <div style={{ display: "flex", gap: "0.6rem" }}>
            <button style={tabBtn("projects")} onClick={() => setTab("projects")}>{tp("projects", lang)} · {projects.length}</button>
            <button style={tabBtn("clients")} onClick={() => setTab("clients")}>{tp("clients", lang)} · {clients.length}</button>
            <button style={tabBtn("leads")} onClick={() => setTab("leads")}>{tp("leads", lang)} · {leads.filter((l) => l.status === "new").length}</button>
          </div>
          <div style={{ display: "flex", gap: "0.6rem" }}>
            {tab === "projects" && <button onClick={() => setAdding(true)} style={primaryBtn}>+ {tp("add_project", lang)}</button>}
            {tab === "clients" && <button onClick={() => setAddingClient(true)} style={primaryBtn}>+ {tp("add_client", lang)}</button>}
          </div>
        </div>

        {tab === "projects" && (
          <>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={lang === "ar" ? "ابحث بالعنوان أو العميل أو الهاتف…" : "Search by title, client or phone…"}
            style={{ width: "100%", maxWidth: 420, padding: "0.7rem 1rem", border: "1px solid var(--line)", borderRadius: 999, fontSize: "0.9rem", color: "var(--ink)", marginBottom: "1.4rem", background: "#fff" }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px,1fr))", gap: "1.2rem" }}>
            {projects.filter((p) => { const s = query.trim().toLowerCase(); return !s || `${p.title} ${p.ownerName || ""} ${p.ownerPhone || ""} ${p.room || ""}`.toLowerCase().includes(s); }).map((p) => (
              <div key={p.id} style={{ border: "1px solid var(--line)", borderRadius: 14, overflow: "hidden", background: "#fff" }}>
                <div style={{ aspectRatio: "16/9", background: "#f3f0ea" }}>
                  {p.thumbnailUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.thumbnailUrl} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  )}
                </div>
                <div style={{ padding: "1rem 1.1rem" }}>
                  <p style={{ fontSize: "0.7rem", color: "var(--ink-faint)", margin: 0 }}>{p.ownerName || p.ownerPhone}</p>
                  <h3 className="display" style={{ fontSize: "1.15rem", color: "var(--ink)", margin: "0.2rem 0 0.5rem" }}>{p.title}</h3>
                  <p style={{ fontSize: "0.74rem", color: "var(--clay)", margin: "0 0 0.8rem", fontWeight: 600 }}>
                    {stageIndex(p.stage || "blueprint") + 1}/{JOURNEY.length} · {(lang === "ar" ? JOURNEY[stageIndex(p.stage || "blueprint")].ar : JOURNEY[stageIndex(p.stage || "blueprint")].en)}
                  </p>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    <button onClick={() => setManaging(p)} style={{ ...miniBtn, background: "var(--ink)", color: "#fff", border: "none" }}>{tp("manage", lang)}</button>
                    <button onClick={() => setEditing(p)} style={miniBtn}>{tp("edit", lang)}</button>
                    <button onClick={() => onDelete(p.id)} style={{ ...miniBtn, color: "var(--clay)", borderColor: "rgba(178,116,87,0.4)" }}>{tp("del", lang)}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          </>
        )}

        {tab === "clients" && (
          <div style={{ border: "1px solid var(--line)", borderRadius: 14, overflow: "hidden" }}>
            {clients.map((c, i) => {
              const count = projects.filter((p) => p.ownerUid === c.uid || (c.phone && p.ownerPhone && p.ownerPhone.replace(/\D/g, "") === c.phone.replace(/\D/g, ""))).length;
              return (
                <button key={c.uid} onClick={() => setViewClient(c)}
                  style={{ width: "100%", textAlign: "start", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", padding: "0.9rem 1.2rem", borderTop: i ? "1px solid var(--line-soft)" : "none", borderInline: "none", borderBottom: "none", background: "transparent", cursor: "pointer" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                    <span style={{ width: 38, height: 38, borderRadius: 999, background: "var(--ink)", color: "#fff", display: "grid", placeItems: "center", fontFamily: "var(--f-display)" }}>{(c.name || "?").trim().charAt(0).toUpperCase()}</span>
                    <span>
                      <span style={{ display: "block", color: "var(--ink)", fontWeight: 600 }}>{c.name || "—"}</span>
                      <span style={{ display: "block", color: "var(--ink-faint)", fontSize: "0.82rem" }}>{c.phone}</span>
                    </span>
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.8rem", color: "var(--ink-faint)", fontSize: "0.8rem" }}>
                    {count} {lang === "ar" ? "مشروع" : count === 1 ? "project" : "projects"} <span style={{ color: "var(--clay)" }}>→</span>
                  </span>
                </button>
              );
            })}
            {clients.length === 0 && <p style={{ padding: "1.2rem", color: "var(--ink-faint)" }}>—</p>}
          </div>
        )}

        {tab === "leads" && (
          <div style={{ display: "grid", gap: "0.9rem" }}>
            {leads.length === 0 && <p style={{ color: "var(--ink-faint)" }}>No design requests yet.</p>}
            {leads.map((l) => (
              <div key={l.id} style={{ border: "1px solid var(--line)", borderRadius: 14, padding: "1.1rem 1.3rem", background: "#fff", display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ minWidth: 200 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <h3 className="display" style={{ fontSize: "1.15rem", color: "var(--ink)", margin: 0 }}>{l.name || "—"}</h3>
                    <span style={{ fontSize: "0.66rem", padding: "0.2em 0.6em", borderRadius: 999, textTransform: "uppercase", letterSpacing: "0.06em", background: l.status === "new" ? "var(--ink)" : l.status === "qualified" ? "var(--clay)" : "var(--line)", color: l.status === "new" || l.status === "qualified" ? "#fff" : "var(--ink-soft)" }}>{l.status}</span>
                  </div>
                  <a href={`tel:${l.phone}`} style={{ color: "var(--clay)", fontWeight: 600, fontSize: "0.95rem" }}>{l.phone}</a>
                  {l.message && <p style={{ margin: "0.35rem 0 0", color: "var(--ink-soft)", fontSize: "0.88rem" }}>{l.message}</p>}
                  {l.planUrl && !l.planUrl.endsWith(".pdf") && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <a href={l.planUrl} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: "0.5rem" }}>
                      <img src={l.planUrl} alt="attached plan" style={{ maxHeight: 90, borderRadius: 8, border: "1px solid var(--line)" }} />
                    </a>
                  )}
                  {l.planUrl && l.planUrl.endsWith(".pdf") && <a href={l.planUrl} target="_blank" rel="noreferrer" style={{ fontSize: "0.8rem", color: "var(--clay)", display: "inline-block", marginTop: "0.4rem" }}>View attached plan (PDF) →</a>}
                </div>
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                  {(["called", "qualified", "rejected"] as LeadStatus[]).map((s) => (
                    <button key={s} onClick={async () => { await setLeadStatus(l.id, s); load(); }} style={{ ...miniBtn, ...(l.status === s ? { background: "var(--ink)", color: "#fff", border: "none" } : {}) }}>{s}</button>
                  ))}
                  <button onClick={async () => { await setLeadStatus(l.id, "converted"); setPrefillOwner({ uid: "", phone: l.phone, name: l.name, role: "client" }); setAdding(true); }}
                    style={{ ...miniBtn, background: "var(--clay)", color: "#fff", border: "none" }}>→ {lang === "ar" ? "إنشاء مشروع" : "Create project"}</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

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
    </main>
  );
}

function AddClient({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const { lang, dir } = useT();
  const [name, setName] = useState(""); const [phone, setPhone] = useState(""); const [pw, setPw] = useState("");
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  const field: React.CSSProperties = { width: "100%", padding: "0.7rem 0.85rem", marginTop: "0.35rem", border: "1px solid var(--line)", borderRadius: 10, fontSize: "0.92rem", color: "var(--ink)", background: "#fff" };

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setErr(""); setBusy(true);
    try { await createClient(phone.trim(), name.trim(), pw); onDone(); }
    catch (e) { setErr(String((e as Error).message)); }
    finally { setBusy(false); }
  }
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

const primaryBtn: React.CSSProperties = { padding: "0.5rem 1.1rem", borderRadius: 999, border: "none", background: "var(--clay)", color: "#fff", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" };
const miniBtn: React.CSSProperties = { padding: "0.4rem 0.9rem", borderRadius: 999, border: "1px solid var(--line)", background: "transparent", color: "var(--ink)", fontSize: "0.78rem", cursor: "pointer" };
