"use client";

import { useEffect, useState } from "react";
import { useT } from "@/lib/i18n";
import { tp } from "@/lib/portal/strings";
import { STATUS_LABEL, type Project } from "@/lib/portal/types";
import { JOURNEY, stageIndex } from "@/lib/portal/journey";

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

        <style>{`@keyframes evoraSpin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ padding: "1rem 1.6rem", flex: 1 }}>
          <div style={{ position: "relative", width: "100%", aspectRatio: "16/10", background: "radial-gradient(120% 120% at 50% 30%, #faf8f4 0%, #ece7df 100%)", borderRadius: 12, overflow: "hidden" }}>
            {tab === "3d" && project.viewerUrl && (
              <iframe src={project.viewerUrl} title={project.title} allow="fullscreen; xr-spatial-tracking"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }} />
            )}
            {tab === "3d" && !project.viewerUrl && project.model3dUrl && (
              <>
                {/* spinnable furnished room, self-hosted model-viewer */}
                <model-viewer src={project.model3dUrl} camera-controls auto-rotate ar ar-modes="webxr scene-viewer quick-look"
                  tone-mapping="neutral" shadow-intensity="1.1" shadow-softness="0.8" exposure="1.05"
                  camera-orbit="40deg 68deg 105%" min-camera-orbit="auto 0deg auto" max-camera-orbit="auto 95deg auto"
                  rotation-per-second="22deg" auto-rotate-delay="600" interaction-prompt="none"
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", "--poster-color": "transparent" } as React.CSSProperties} />
                <span style={{ position: "absolute", bottom: 12, insetInlineStart: 12, padding: "0.4em 0.85em", borderRadius: 999, background: "rgba(22,21,15,0.7)", color: "#fff", fontSize: "0.72rem", letterSpacing: "0.04em", pointerEvents: "none", display: "flex", alignItems: "center", gap: "0.4em" }}>
                  <span style={{ display: "inline-block", animation: "evoraSpin 3s linear infinite" }}>↻</span> {lang === "ar" ? "اسحب لتدوير الغرفة" : "Drag to spin your room"}
                </span>
              </>
            )}
            {tab === "3d" && !project.viewerUrl && !project.model3dUrl && (
              <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center", padding: "1.5rem", color: "var(--ink-faint)" }}>
                <div>
                  <div style={{ fontSize: "2rem", marginBottom: "0.5rem", opacity: 0.5 }}>◳</div>
                  <p style={{ margin: 0, fontSize: "0.9rem" }}>{lang === "ar" ? "نموذجك ثلاثي الأبعاد قيد التحضير" : "Your 3D room is being prepared"}</p>
                </div>
              </div>
            )}
            {tab === "2d" && (project.plan2dUrl
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={project.plan2dUrl} alt={project.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", background: "#fff" }} />
              : <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "var(--ink-faint)", fontSize: "0.9rem" }}>{lang === "ar" ? "لم يُرفع مخطط بعد" : "No 2D plan uploaded yet"}</div>
            )}
          </div>

          {project.notes && <p style={{ color: "var(--ink-soft)", marginTop: "1.2rem", lineHeight: 1.6 }}>{project.notes}</p>}

          {/* live journey */}
          <div style={{ marginTop: "1.8rem", paddingTop: "1.6rem", borderTop: "1px solid var(--line-soft)" }}>
            <p style={{ fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-faint)", margin: "0 0 1.1rem" }}>{tp("journey", lang)}</p>
            <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "0.1rem" }}>
              {JOURNEY.map((s, i) => {
                const cur = stageIndex(project.stage || "blueprint");
                const done = i < cur, active = i === cur;
                return (
                  <li key={s.key} style={{ display: "flex", gap: "0.85rem", alignItems: "flex-start", paddingBottom: i < JOURNEY.length - 1 ? "0.9rem" : 0 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", alignSelf: "stretch" }}>
                      <span style={{ width: 18, height: 18, borderRadius: 999, flexShrink: 0, display: "grid", placeItems: "center", fontSize: "0.6rem", color: "#fff",
                        background: done ? "var(--clay)" : active ? "var(--ink)" : "transparent", border: done || active ? "none" : "1.5px solid var(--line)" }}>
                        {done ? "✓" : active ? "●" : ""}
                      </span>
                      {i < JOURNEY.length - 1 && <span style={{ width: 1.5, flex: 1, background: done ? "var(--clay)" : "var(--line)", marginTop: 2 }} />}
                    </div>
                    <div style={{ paddingBottom: "0.2rem" }}>
                      <p style={{ margin: 0, fontWeight: active ? 600 : 500, color: done || active ? "var(--ink)" : "var(--ink-faint)", fontSize: "0.96rem" }}>
                        {lang === "ar" ? s.ar : s.en}
                      </p>
                      {active && <p style={{ margin: "0.15rem 0 0", fontSize: "0.82rem", color: "var(--ink-faint)", lineHeight: 1.5 }}>{lang === "ar" ? s.hint_ar : s.hint_en}</p>}
                    </div>
                  </li>
                );
              })}
            </ol>

            {project.updates && project.updates.length > 0 && (
              <div style={{ marginTop: "1.4rem" }}>
                <p style={{ fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-faint)", margin: "0 0 0.7rem" }}>{tp("updates", lang)}</p>
                {project.updates.map((u) => (
                  <div key={u.id} style={{ padding: "0.7rem 0", borderTop: "1px solid var(--line-soft)" }}>
                    {u.imageUrl && <img src={u.imageUrl} alt="" style={{ width: "100%", borderRadius: 10, marginBottom: "0.5rem", maxHeight: 280, objectFit: "cover" }} />}
                    {u.text && <p style={{ margin: 0, color: "var(--ink-soft)", fontSize: "0.9rem", lineHeight: 1.5 }}>{u.text}</p>}
                    <p style={{ margin: "0.2rem 0 0", color: "var(--ink-faint)", fontSize: "0.72rem" }}>{new Date(u.at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
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
