"use client";

import { useState } from "react";
import { useT } from "@/lib/i18n";
import { JOURNEY, stageIndex } from "@/lib/portal/journey";
import { STATUS_LABEL, type PortalUser, type Project } from "@/lib/portal/types";

const norm = (s: string) => (s || "").replace(/[^\d]/g, "");

export default function ClientDetail({
  client, projects, onClose, onManage, onAddProject,
}: {
  client: PortalUser;
  projects: Project[];
  onClose: () => void;
  onManage: (p: Project) => void;
  onAddProject: (c: PortalUser) => void;
}) {
  const { lang, dir } = useT();
  const t = (en: string, ar: string) => (lang === "ar" ? ar : en);
  const [copied, setCopied] = useState(false);

  const mine = projects.filter((p) => p.ownerUid === client.uid || (client.phone && norm(p.ownerPhone || "") === norm(client.phone)));
  const phoneDigits = norm(client.phone);
  const link = typeof window !== "undefined" ? `${window.location.origin}/join?phone=${encodeURIComponent(client.phone)}` : "";

  const stat = (v: number | string, l: string) => (
    <div style={{ border: "1px solid var(--line)", borderRadius: 12, padding: "0.8rem 1rem" }}>
      <div className="display" style={{ fontSize: "1.6rem", lineHeight: 1, color: "var(--ink)" }}>{v}</div>
      <div style={{ fontSize: "0.66rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-faint)", marginTop: "0.3rem" }}>{l}</div>
    </div>
  );
  const pill: React.CSSProperties = { padding: "0.5em 1em", borderRadius: 999, fontSize: "0.8rem", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.4em", cursor: "pointer", border: "1px solid var(--line)", color: "var(--ink)" };

  return (
    <div onClick={onClose} dir={dir} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(22,21,15,0.55)", backdropFilter: "blur(6px)", display: "grid", placeItems: "center", padding: "1rem" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "min(640px,100%)", maxHeight: "94dvh", overflow: "auto", background: "var(--paper)", borderRadius: 18, padding: "1.8rem", boxShadow: "0 40px 120px rgba(0,0,0,0.3)" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.4rem" }}>
          <div style={{ display: "flex", gap: "0.9rem", alignItems: "center" }}>
            <div style={{ width: 52, height: 52, borderRadius: 999, background: "var(--ink)", color: "#fff", display: "grid", placeItems: "center", fontSize: "1.3rem", fontFamily: "var(--f-display)" }}>
              {(client.name || "?").trim().charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="display" style={{ fontSize: "1.6rem", color: "var(--ink)", margin: 0 }}>{client.name || t("Unnamed customer", "عميل بدون اسم")}</h2>
              <p style={{ margin: "0.15rem 0 0", color: "var(--ink-faint)", fontSize: "0.85rem" }}>{client.phone}</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ width: 38, height: 38, borderRadius: 999, border: "1px solid var(--line)", background: "transparent", cursor: "pointer", color: "var(--ink)", flexShrink: 0 }}>✕</button>
        </header>

        {/* contact + actions */}
        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginBottom: "1.4rem" }}>
          <a href={`tel:${client.phone}`} style={pill}>📞 {t("Call", "اتصال")}</a>
          <a href={`https://wa.me/${phoneDigits}`} target="_blank" rel="noreferrer" style={pill}>💬 WhatsApp</a>
          <button onClick={() => { navigator.clipboard?.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 1200); }} style={pill}>
            🔗 {copied ? t("Copied", "تم النسخ") : t("Sign-up link", "رابط التسجيل")}
          </button>
          <button onClick={() => onAddProject(client)} style={{ ...pill, background: "var(--clay)", color: "#fff", border: "none" }}>+ {t("New project", "مشروع جديد")}</button>
        </div>

        {/* stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.8rem", marginBottom: "1.6rem" }}>
          {stat(mine.length, t("Projects", "المشاريع"))}
          {stat(mine.filter((p) => p.approvedByClient).length, t("Approved", "موافق عليها"))}
          {stat(mine.filter((p) => JOURNEY[stageIndex(p.stage || "blueprint")].phase === "production").length, t("In production", "قيد التنفيذ"))}
        </div>

        {/* projects */}
        <p style={{ fontSize: "0.7rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-faint)", margin: "0 0 0.8rem", fontWeight: 600 }}>{t("Projects", "المشاريع")}</p>
        {mine.length === 0 && <p style={{ color: "var(--ink-faint)", fontSize: "0.9rem" }}>{t("No projects yet.", "لا توجد مشاريع بعد.")}</p>}
        <div style={{ display: "grid", gap: "0.7rem" }}>
          {mine.map((p) => {
            const ci = stageIndex(p.stage || "blueprint");
            const pct = Math.round(((ci + 1) / JOURNEY.length) * 100);
            return (
              <button key={p.id} onClick={() => onManage(p)} style={{ textAlign: "start", display: "flex", gap: "0.9rem", alignItems: "center", border: "1px solid var(--line)", borderRadius: 12, padding: "0.7rem 0.9rem", background: "#fff", cursor: "pointer" }}>
                <div style={{ width: 48, height: 48, borderRadius: 8, background: "#f3f0ea", overflow: "hidden", flexShrink: 0 }}>
                  {p.thumbnailUrl && <img src={p.thumbnailUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem" }}>
                    <span style={{ fontWeight: 600, color: "var(--ink)", fontSize: "0.95rem" }}>{p.title}</span>
                    <span style={{ fontSize: "0.7rem", color: "var(--ink-faint)" }}>{STATUS_LABEL[p.status][lang]}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.45rem" }}>
                    <div style={{ flex: 1, height: 4, borderRadius: 999, background: "var(--line)", overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: "var(--clay)" }} />
                    </div>
                    <span style={{ fontSize: "0.66rem", color: "var(--ink-faint)" }}>{ci + 1}/{JOURNEY.length}</span>
                  </div>
                </div>
                {p.model3dUrl && <span style={{ fontSize: "0.62rem", fontWeight: 700, color: "var(--clay)", flexShrink: 0 }}>3D</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
