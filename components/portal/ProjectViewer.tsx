"use client";

import { useEffect, useState } from "react";
import { useT } from "@/lib/i18n";
import { tp } from "@/lib/portal/strings";
import { STATUS_LABEL, type Project } from "@/lib/portal/types";

export default function ProjectViewer({
  project, onClose, onApprove,
}: {
  project: Project;
  onClose: () => void;
  onApprove?: (p: Project) => void;
}) {
  const { lang } = useT();
  const [tab, setTab] = useState<"3d" | "2d">(project.viewerUrl || project.model3dUrl ? "3d" : "2d");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  // Self-hosted model-viewer (registers the <model-viewer> custom element) so
  // the 3D tab works fully offline — no CDN fetch. Only loaded when a .glb is
  // actually shown.
  useEffect(() => {
    if (project.model3dUrl && !project.viewerUrl && !customElements.get("model-viewer")) {
      import("@google/model-viewer").catch(() => {});
    }
  }, [project.model3dUrl, project.viewerUrl]);

  const has3d = Boolean(project.viewerUrl || project.model3dUrl);

  return (
    <div onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 200, background: "rgba(22,21,15,0.55)",
        backdropFilter: "blur(6px)", display: "grid", placeItems: "center", padding: "clamp(0.5rem,3vw,2rem)",
      }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(1040px, 100%)", maxHeight: "92dvh", overflow: "auto", background: "var(--paper)",
          borderRadius: 18, boxShadow: "0 40px 120px rgba(0,0,0,0.35)", display: "flex", flexDirection: "column",
        }}>
        <header style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "1.4rem 1.6rem 1rem", gap: "1rem", borderBottom: "1px solid var(--line-soft)" }}>
          <div>
            <p style={{ fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-faint)", margin: 0 }}>
              {project.room || "Evora"} · {STATUS_LABEL[project.status][lang]}
            </p>
            <h2 className="display" style={{ fontSize: "clamp(1.4rem,4vw,2rem)", color: "var(--ink)", margin: "0.3rem 0 0" }}>{project.title}</h2>
          </div>
          <button onClick={onClose} aria-label={tp("close", lang)}
            style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 999, border: "1px solid var(--line)", background: "transparent", cursor: "pointer", fontSize: "1.1rem", color: "var(--ink)" }}>✕</button>
        </header>

        <div style={{ display: "flex", gap: "0.5rem", padding: "0.9rem 1.6rem 0" }}>
          {has3d && <Tab active={tab === "3d"} onClick={() => setTab("3d")}>{tp("view_3d", lang)}</Tab>}
          {project.plan2dUrl && <Tab active={tab === "2d"} onClick={() => setTab("2d")}>{tp("view_2d", lang)}</Tab>}
        </div>

        <div style={{ padding: "1rem 1.6rem", flex: 1 }}>
          <div style={{ position: "relative", width: "100%", aspectRatio: "16/10", background: "#f3f0ea", borderRadius: 12, overflow: "hidden" }}>
            {tab === "3d" && project.viewerUrl && (
              <iframe src={project.viewerUrl} title={project.title} allow="fullscreen; xr-spatial-tracking"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }} />
            )}
            {tab === "3d" && !project.viewerUrl && project.model3dUrl && (
              // model-viewer custom element, self-hosted (see useEffect import)
              <model-viewer src={project.model3dUrl} camera-controls auto-rotate ar tone-mapping="neutral" shadow-intensity="1"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", background: "#f3f0ea" }} />
            )}
            {tab === "2d" && project.plan2dUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={project.plan2dUrl} alt={project.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            )}
          </div>

          {project.notes && <p style={{ color: "var(--ink-soft)", marginTop: "1.2rem", lineHeight: 1.6 }}>{project.notes}</p>}
        </div>

        {onApprove && project.status === "draft" && (
          <footer style={{ padding: "0 1.6rem 1.6rem" }}>
            <button onClick={() => onApprove(project)}
              style={{ width: "100%", padding: "1rem", borderRadius: 12, border: "none", background: "var(--clay)", color: "#fff", fontWeight: 600, fontSize: "0.95rem", cursor: "pointer" }}>
              {tp("approve", lang)}
            </button>
          </footer>
        )}
        {project.approvedByClient && (
          <footer style={{ padding: "0 1.6rem 1.6rem", color: "var(--ink-faint)", fontSize: "0.85rem" }}>
            ✓ {tp("approved_badge", lang)}
          </footer>
        )}
      </div>
    </div>
  );
}

function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      style={{
        padding: "0.55rem 1rem", borderRadius: 999, border: "1px solid", cursor: "pointer", fontSize: "0.82rem", fontWeight: 500,
        borderColor: active ? "var(--ink)" : "var(--line)", background: active ? "var(--ink)" : "transparent",
        color: active ? "var(--paper)" : "var(--ink-soft)", transition: "all .25s var(--ease)",
      }}>
      {children}
    </button>
  );
}
