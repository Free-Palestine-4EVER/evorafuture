"use client";

import { useState } from "react";
import { useT } from "@/lib/i18n";
import { tp } from "@/lib/portal/strings";
import { newId } from "@/lib/portal/store";
import type { PortalUser, Project, ProjectStatus } from "@/lib/portal/types";

const STATUSES: ProjectStatus[] = ["draft", "approved", "in_production", "delivered"];

export default function ProjectForm({
  initial, clients, onCancel, onSave,
}: {
  initial?: Project | null;
  clients: PortalUser[];
  onCancel: () => void;
  onSave: (p: Project) => void;
}) {
  const { lang, dir } = useT();
  const [p, setP] = useState<Project>(
    initial ?? {
      id: newId(), ownerUid: "", ownerPhone: "", ownerName: "",
      title: "", room: "", status: "draft", stage: "blueprint", approvedByClient: false,
    }
  );

  const set = (k: keyof Project, v: unknown) => setP((prev) => ({ ...prev, [k]: v }));
  const norm = (s: string) => { const d = (s || "").replace(/[^\d]/g, ""); return d.length ? d : (s || "").trim().toLowerCase(); };
  // Editing the phone auto-links to an existing client if it matches, else
  // leaves it as a new customer (who self-registers via their sign-up link).
  const setPhone = (v: string) => {
    const match = clients.find((c) => c.phone && norm(c.phone) === norm(v));
    setP((prev) => ({ ...prev, ownerPhone: v, ownerUid: match?.uid || "", ownerName: match?.name || prev.ownerName }));
  };

  const field: React.CSSProperties = { width: "100%", padding: "0.7rem 0.85rem", marginTop: "0.35rem", border: "1px solid var(--line)", borderRadius: 10, fontFamily: "var(--f-sans)", fontSize: "0.92rem", color: "var(--ink)", background: "#fff" };
  const label: React.CSSProperties = { fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-faint)", display: "block" };

  return (
    <div onClick={onCancel} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(22,21,15,0.5)", backdropFilter: "blur(6px)", display: "grid", placeItems: "center", padding: "1rem" }}>
      <form dir={dir} onClick={(e) => e.stopPropagation()} onSubmit={(e) => { e.preventDefault(); onSave(p); }}
        style={{ width: "min(560px,100%)", maxHeight: "92dvh", overflow: "auto", background: "var(--paper)", borderRadius: 16, padding: "1.8rem", boxShadow: "0 40px 120px rgba(0,0,0,0.3)" }}>
        <h2 className="display" style={{ fontSize: "1.6rem", color: "var(--ink)", margin: "0 0 1.4rem" }}>
          {initial ? tp("edit", lang) : tp("add_project", lang)}
        </h2>

        {clients.length > 0 && (
          <>
            <label style={label}>{lang === "ar" ? "اختر عميلاً موجوداً (اختياري)" : "Pick an existing client (optional)"}
              <select style={field} value={p.ownerUid || ""}
                onChange={(e) => {
                  if (!e.target.value) { set("ownerUid", ""); return; }
                  const c = clients.find((x) => x.uid === e.target.value);
                  set("ownerUid", c?.uid || ""); set("ownerPhone", c?.phone || ""); set("ownerName", c?.name || "");
                }}>
                <option value="">{lang === "ar" ? "— عميل جديد بالهاتف —" : "— New customer by phone —"}</option>
                {clients.map((c) => <option key={c.uid} value={c.uid}>{c.name} · {c.phone}</option>)}
              </select>
            </label>
            <div style={{ height: "0.9rem" }} />
          </>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.9rem" }}>
          <label style={label}>{tp("assign_phone", lang)}<input style={field} value={p.ownerPhone || ""} onChange={(e) => setPhone(e.target.value)} placeholder="07_ _______" required /></label>
          <label style={label}>{tp("client_name", lang)}<input style={field} value={p.ownerName || ""} onChange={(e) => set("ownerName", e.target.value)} /></label>
        </div>
        <p style={{ fontSize: "0.74rem", color: "var(--ink-faint)", margin: "0.45rem 0 0", lineHeight: 1.5 }}>
          {p.ownerUid
            ? (lang === "ar" ? "مرتبط بحساب عميل موجود." : "Linked to an existing client account.")
            : (lang === "ar" ? "عميل جديد — سيرى المشروع عند تسجيله بهذا الرقم على /join." : "New customer — they'll see this project once they sign up with this number at /join.")}
        </p>

        <div style={{ height: "0.9rem" }} />
        <label style={label}>{tp("title", lang)}<input style={field} value={p.title} onChange={(e) => set("title", e.target.value)} required /></label>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.9rem", marginTop: "0.9rem" }}>
          <label style={label}>{tp("room", lang)}<input style={field} value={p.room || ""} onChange={(e) => set("room", e.target.value)} /></label>
          <label style={label}>{tp("status", lang)}
            <select style={field} value={p.status} onChange={(e) => set("status", e.target.value as ProjectStatus)}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
        </div>

        <div style={{ height: "0.9rem" }} />
        <label style={label}>{tp("thumb", lang)}<input style={field} value={p.thumbnailUrl || ""} onChange={(e) => { set("thumbnailUrl", e.target.value); if (!p.plan2dUrl) set("plan2dUrl", e.target.value); }} placeholder="/evora/p07.jpg" /></label>
        <div style={{ height: "0.9rem" }} />
        <label style={label}>{tp("viewer", lang)}<input style={field} value={p.viewerUrl || ""} onChange={(e) => set("viewerUrl", e.target.value)} placeholder="https://puffer.../viewer/..." /></label>
        <div style={{ height: "0.9rem" }} />
        <label style={label}>{tp("model", lang)}<input style={field} value={p.model3dUrl || ""} onChange={(e) => set("model3dUrl", e.target.value)} placeholder="https://.../scene.glb" /></label>
        <div style={{ height: "0.9rem" }} />
        <label style={label}>{tp("notes", lang)}<textarea style={{ ...field, minHeight: 80, resize: "vertical" }} value={p.notes || ""} onChange={(e) => set("notes", e.target.value)} /></label>

        <div style={{ display: "flex", gap: "0.7rem", marginTop: "1.6rem" }}>
          <button type="submit" style={{ flex: 1, padding: "0.85rem", borderRadius: 10, border: "none", background: "var(--ink)", color: "#fff", fontWeight: 600, cursor: "pointer" }}>{tp("save", lang)}</button>
          <button type="button" onClick={onCancel} style={{ padding: "0.85rem 1.4rem", borderRadius: 10, border: "1px solid var(--line)", background: "transparent", color: "var(--ink)", cursor: "pointer" }}>{tp("cancel", lang)}</button>
        </div>
      </form>
    </div>
  );
}
