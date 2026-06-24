"use client";

import { useCallback, useEffect, useState } from "react";
import { useT } from "@/lib/i18n";
import { tp } from "@/lib/portal/strings";
import { usePortalAuth } from "@/lib/portal/auth";
import { approveProject, listProjectsForUser, subscribe } from "@/lib/portal/store";
import { STATUS_LABEL, type Project } from "@/lib/portal/types";
import LoginForm from "@/components/portal/LoginForm";
import ProjectViewer from "@/components/portal/ProjectViewer";
import PortalHeader from "@/components/portal/PortalHeader";
import NotifyPrompt from "@/components/portal/NotifyPrompt";

export default function DashboardPage() {
  const { lang } = useT();
  const { user, loading } = usePortalAuth();
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [active, setActive] = useState<Project | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setProjects(await listProjectsForUser(user.uid));
  }, [user]);

  useEffect(() => { if (user) load(); }, [user, load]);
  // Live updates: refetch when an employee saves/edits in Puffer or the admin.
  useEffect(() => { if (!user) return; return subscribe(() => load()); }, [user, load]);

  if (loading) return <Splash />;
  if (!user) return <LoginForm variant="client" />;

  async function approve(p: Project) {
    await approveProject(p.id);
    setActive(null);
    load();
  }

  return (
    <main style={{ minHeight: "100dvh" }}>
      <PortalHeader name={user.name} />

      <section className="container" style={{ paddingTop: "2.8rem", paddingBottom: "5rem" }}>
        <NotifyPrompt />
        <p style={{ fontSize: "0.72rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--clay)", margin: 0 }}>
          {lang === "ar" ? `مرحبًا، ${user.name}` : `Welcome, ${user.name}`}
        </p>
        <h1 className="display" style={{ fontSize: "clamp(2.2rem,7vw,3.4rem)", color: "var(--ink)", margin: "0.4rem 0 2.2rem" }}>
          {tp("my_designs", lang)}
        </h1>

        {projects && projects.length === 0 && (
          <p style={{ color: "var(--ink-faint)", maxWidth: 460, lineHeight: 1.6 }}>{tp("no_projects", lang)}</p>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.4rem" }}>
          {projects?.map((p) => (
            <button key={p.id} onClick={() => setActive(p)}
              style={{ textAlign: "start", border: "1px solid var(--line)", borderRadius: 16, overflow: "hidden", background: "var(--paper)", cursor: "pointer", padding: 0, transition: "transform .45s var(--ease), box-shadow .45s var(--ease)", willChange: "transform" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 24px 60px rgba(22,21,15,0.12)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ position: "relative", aspectRatio: "4/3", background: "#f3f0ea", overflow: "hidden" }}>
                {p.thumbnailUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.thumbnailUrl} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                )}
                <span style={{ position: "absolute", top: 12, insetInlineStart: 12, padding: "0.35em 0.8em", borderRadius: 999, fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.03em", background: p.approvedByClient ? "var(--clay)" : "rgba(22,21,15,0.85)", color: "#fff" }}>
                  {STATUS_LABEL[p.status][lang]}
                </span>
              </div>
              <div style={{ padding: "1.1rem 1.2rem 1.3rem" }}>
                <p style={{ fontSize: "0.72rem", color: "var(--ink-faint)", margin: 0, letterSpacing: "0.04em" }}>{p.room}</p>
                <h3 className="display" style={{ fontSize: "1.25rem", color: "var(--ink)", margin: "0.25rem 0 0.5rem" }}>{p.title}</h3>
                <p style={{ fontSize: "0.8rem", color: "var(--clay)", margin: 0, fontWeight: 500 }}>{tp("view_3d", lang)} →</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {active && <ProjectViewer project={projects?.find((p) => p.id === active.id) || active} onClose={() => setActive(null)} onApprove={approve} />}
    </main>
  );
}

function Splash() {
  return <div style={{ minHeight: "100dvh", display: "grid", placeItems: "center", color: "var(--ink-faint)", fontFamily: "var(--f-display)" }}>EVORA</div>;
}
