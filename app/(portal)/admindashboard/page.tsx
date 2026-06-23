"use client";

import { useCallback, useEffect, useState } from "react";
import { useT } from "@/lib/i18n";
import { tp } from "@/lib/portal/strings";
import { usePortalAuth } from "@/lib/portal/auth";
import { createClient, deleteProject, isLive, listAllProjects, listClients, saveProject, subscribe } from "@/lib/portal/store";
import { STATUS_LABEL, type PortalUser, type Project } from "@/lib/portal/types";
import LoginForm from "@/components/portal/LoginForm";
import PortalHeader from "@/components/portal/PortalHeader";
import ProjectForm from "@/components/portal/ProjectForm";

export default function AdminPage() {
  const { lang } = useT();
  const { user, loading } = usePortalAuth();
  const [tab, setTab] = useState<"projects" | "clients">("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<PortalUser[]>([]);
  const [editing, setEditing] = useState<Project | null>(null);
  const [adding, setAdding] = useState(false);
  const [addingClient, setAddingClient] = useState(false);

  const load = useCallback(async () => {
    setProjects(await listAllProjects());
    setClients(await listClients());
  }, []);

  useEffect(() => { if (user?.role === "admin") load(); }, [user, load]);
  useEffect(() => { if (user?.role !== "admin") return; return subscribe(() => load()); }, [user, load]);

  if (loading) return <div style={{ minHeight: "100dvh", display: "grid", placeItems: "center", color: "var(--ink-faint)", fontFamily: "var(--f-display)" }}>EVORA</div>;
  if (!user || user.role !== "admin") return <LoginForm variant="admin" />;

  async function onSave(p: Project) { await saveProject(p); setEditing(null); setAdding(false); load(); }
  async function onDelete(id: string) { await deleteProject(id); load(); }

  const tabBtn = (key: "projects" | "clients"): React.CSSProperties => ({
    padding: "0.5rem 1.1rem", borderRadius: 999, cursor: "pointer", fontSize: "0.85rem", fontWeight: 500,
    border: "1px solid", borderColor: tab === key ? "var(--ink)" : "var(--line)",
    background: tab === key ? "var(--ink)" : "transparent", color: tab === key ? "#fff" : "var(--ink-soft)",
  });

  return (
    <main style={{ minHeight: "100dvh" }}>
      <PortalHeader name={user.name} admin />

      <section className="container" style={{ paddingTop: "2.2rem", paddingBottom: "5rem" }}>
        {!isLive && <p style={{ fontSize: "0.78rem", color: "var(--clay)", marginTop: 0 }}>{tp("demo_mode", lang)}</p>}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBottom: "1.8rem" }}>
          <div style={{ display: "flex", gap: "0.6rem" }}>
            <button style={tabBtn("projects")} onClick={() => setTab("projects")}>{tp("projects", lang)} · {projects.length}</button>
            <button style={tabBtn("clients")} onClick={() => setTab("clients")}>{tp("clients", lang)} · {clients.length}</button>
          </div>
          <div style={{ display: "flex", gap: "0.6rem" }}>
            {tab === "projects" && <button onClick={() => setAdding(true)} style={primaryBtn}>+ {tp("add_project", lang)}</button>}
            {tab === "clients" && <button onClick={() => setAddingClient(true)} style={primaryBtn}>+ {tp("add_client", lang)}</button>}
          </div>
        </div>

        {tab === "projects" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px,1fr))", gap: "1.2rem" }}>
            {projects.map((p) => (
              <div key={p.id} style={{ border: "1px solid var(--line)", borderRadius: 14, overflow: "hidden", background: "#fff" }}>
                <div style={{ aspectRatio: "16/9", background: "#f3f0ea" }}>
                  {p.thumbnailUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.thumbnailUrl} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  )}
                </div>
                <div style={{ padding: "1rem 1.1rem" }}>
                  <p style={{ fontSize: "0.7rem", color: "var(--ink-faint)", margin: 0 }}>{p.ownerName || p.ownerPhone} · {STATUS_LABEL[p.status][lang]}</p>
                  <h3 className="display" style={{ fontSize: "1.15rem", color: "var(--ink)", margin: "0.2rem 0 0.8rem" }}>{p.title}</h3>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button onClick={() => setEditing(p)} style={miniBtn}>{tp("edit", lang)}</button>
                    <button onClick={() => onDelete(p.id)} style={{ ...miniBtn, color: "var(--clay)", borderColor: "rgba(178,116,87,0.4)" }}>{tp("del", lang)}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "clients" && (
          <div style={{ border: "1px solid var(--line)", borderRadius: 14, overflow: "hidden" }}>
            {clients.map((c, i) => (
              <div key={c.uid} style={{ display: "flex", justifyContent: "space-between", padding: "1rem 1.2rem", borderTop: i ? "1px solid var(--line-soft)" : "none" }}>
                <span style={{ color: "var(--ink)", fontWeight: 500 }}>{c.name}</span>
                <span style={{ color: "var(--ink-faint)", fontFamily: "var(--f-sans)" }}>{c.phone}</span>
              </div>
            ))}
            {clients.length === 0 && <p style={{ padding: "1.2rem", color: "var(--ink-faint)" }}>—</p>}
          </div>
        )}
      </section>

      {(adding || editing) && (
        <ProjectForm initial={editing} clients={clients} onCancel={() => { setAdding(false); setEditing(null); }} onSave={onSave} />
      )}
      {addingClient && <AddClient onClose={() => setAddingClient(false)} onDone={() => { setAddingClient(false); load(); }} />}
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
