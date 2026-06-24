"use client";

import { useCallback, useEffect, useState } from "react";
import { useT } from "@/lib/i18n";
import { tp } from "@/lib/portal/strings";
import { usePortalAuth } from "@/lib/portal/auth";
import { approveProject, listProjectsForUser, newId, saveProject, subscribe, uploadFile } from "@/lib/portal/store";
import { STATUS_LABEL, type Project } from "@/lib/portal/types";
import { JOURNEY, stageIndex } from "@/lib/portal/journey";
import LoginForm from "@/components/portal/LoginForm";
import ProjectViewer from "@/components/portal/ProjectViewer";
import PortalHeader from "@/components/portal/PortalHeader";
import NotifyPrompt from "@/components/portal/NotifyPrompt";
import LiveScanner from "@/components/portal/LiveScanner";
import { scanToProject, type ScanFile } from "@/lib/puffer/importScan";
import { buildRoomGlbBlob } from "@/lib/puffer/liveScan";

function dataUrlToFile(dataUrl: string, name: string): File {
  const [head, b64] = dataUrl.split(",");
  const mime = /data:([^;]+)/.exec(head)?.[1] || "image/png";
  const bin = atob(b64); const u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  return new File([u8], name, { type: mime });
}

export default function DashboardPage() {
  const { lang } = useT();
  const { user, loading } = usePortalAuth();
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [active, setActive] = useState<Project | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState("");

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

  async function onScanComplete(scan: ScanFile) {
    if (!user) return;
    setScanning(false);
    try {
      setScanStatus(lang === "ar" ? "بناء المخطط…" : "Building plan…");
      const pf = scanToProject(scan);
      if (!pf.planImage) throw new Error("no plan image");
      const planUrl = await uploadFile(dataUrlToFile(pf.planImage, "scan-plan.png"));
      setScanStatus(lang === "ar" ? "بناء الغرفة ثلاثية الأبعاد…" : "Building 3D room…");
      let glbUrl: string | undefined;
      try {
        const glb = await buildRoomGlbBlob(scan);
        glbUrl = await uploadFile(new File([glb], "scan-room.glb", { type: "model/gltf-binary" }));
      } catch (e) { console.error(e); }
      const n = scan.objects?.length ?? 0;
      await saveProject({
        id: newId(), ownerUid: user.uid, ownerPhone: user.phone, ownerName: user.name,
        title: lang === "ar" ? "غرفة ممسوحة" : "Scanned room", room: lang === "ar" ? "مسح مباشر" : "Live scan",
        status: "draft", stage: "blueprint", approvedByClient: false,
        plan2dUrl: planUrl, thumbnailUrl: planUrl, model3dUrl: glbUrl, scanData: JSON.stringify(scan),
        notes: `Self-scan: ${scan.walls.length} walls, ${n} items.`,
      });
      setScanStatus(lang === "ar" ? "تم حفظ المسح ✓" : "Scan saved ✓");
      load();
      setTimeout(() => setScanStatus(""), 2500);
    } catch (e) {
      console.error(e);
      setScanStatus(lang === "ar" ? "فشل المسح" : "Scan failed");
    }
  }

  return (
    <main style={{ minHeight: "100dvh" }}>
      <PortalHeader name={user.name} />

      <section className="container" style={{ paddingTop: "2.8rem", paddingBottom: "5rem" }}>
        <NotifyPrompt />
        <p style={{ fontSize: "0.72rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--clay)", margin: 0 }}>
          {lang === "ar" ? `مرحبًا، ${user.name}` : `Welcome, ${user.name}`}
        </p>
        <h1 className="display" style={{ fontSize: "clamp(2.2rem,7vw,3.4rem)", color: "var(--ink)", margin: "0.4rem 0 1.1rem" }}>
          {tp("my_designs", lang)}
        </h1>

        <div style={{ display: "flex", alignItems: "center", gap: "0.9rem", flexWrap: "wrap", marginBottom: "1.8rem" }}>
          <button onClick={() => setScanning(true)}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.55rem", padding: "0.8rem 1.5rem", borderRadius: 999, border: "none", background: "var(--clay)", color: "#fff", fontWeight: 700, fontSize: "0.92rem", cursor: "pointer" }}>
            ◎ {lang === "ar" ? "امسح غرفتك" : "Scan my room"}
          </button>
          {scanStatus
            ? <span style={{ fontSize: "0.84rem", color: "var(--clay)", fontWeight: 600 }}>{scanStatus}</span>
            : <span style={{ fontSize: "0.82rem", color: "var(--ink-faint)" }}>{lang === "ar" ? "امسح غرفتك بالكاميرا لنبدأ تصميمها" : "Scan a room with your camera to start designing it"}</span>}
        </div>

        {projects && projects.length > 0 && (
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", padding: "1.1rem 1.4rem", border: "1px solid var(--line)", borderRadius: 14, marginBottom: "2.2rem", background: "#fff" }}>
            {[
              { v: projects.length, l: lang === "ar" ? "تصاميم" : "Designs" },
              { v: projects.filter((p) => p.approvedByClient).length, l: lang === "ar" ? "موافق عليها" : "Approved" },
              { v: projects.filter((p) => p.status === "delivered").length, l: lang === "ar" ? "تم تسليمها" : "Delivered" },
            ].map((s) => (
              <div key={s.l}>
                <div className="display" style={{ fontSize: "1.8rem", lineHeight: 1, color: "var(--ink)" }}>{s.v}</div>
                <div style={{ fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-faint)", marginTop: "0.3rem" }}>{s.l}</div>
              </div>
            ))}
          </div>
        )}

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
                {p.model3dUrl && (
                  <span style={{ position: "absolute", top: 12, insetInlineEnd: 12, padding: "0.3em 0.65em", borderRadius: 999, fontSize: "0.66rem", fontWeight: 700, letterSpacing: "0.05em", background: "rgba(255,255,255,0.92)", color: "var(--ink)" }}>3D</span>
                )}
              </div>
              <div style={{ padding: "1.1rem 1.2rem 1.3rem" }}>
                <p style={{ fontSize: "0.72rem", color: "var(--ink-faint)", margin: 0, letterSpacing: "0.04em" }}>{p.room}</p>
                <h3 className="display" style={{ fontSize: "1.25rem", color: "var(--ink)", margin: "0.25rem 0 0.7rem" }}>{p.title}</h3>
                {(() => {
                  const cur = stageIndex(p.stage || "blueprint");
                  const pct = Math.round(((cur + 1) / JOURNEY.length) * 100);
                  return (
                    <div style={{ margin: "0 0 0.7rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", color: "var(--ink-faint)", marginBottom: "0.3rem" }}>
                        <span>{lang === "ar" ? JOURNEY[cur].ar : JOURNEY[cur].en}</span>
                        <span>{cur + 1}/{JOURNEY.length}</span>
                      </div>
                      <div style={{ height: 4, borderRadius: 999, background: "var(--line)", overflow: "hidden" }}>
                        <div style={{ width: `${pct}%`, height: "100%", background: "var(--clay)", borderRadius: 999, transition: "width .6s var(--ease)" }} />
                      </div>
                    </div>
                  );
                })()}
                <p style={{ fontSize: "0.8rem", color: "var(--clay)", margin: 0, fontWeight: 500 }}>{tp("view_3d", lang)} →</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {active && <ProjectViewer project={projects?.find((p) => p.id === active.id) || active} onClose={() => setActive(null)} onApprove={approve} />}
      {scanning && <LiveScanner onClose={() => setScanning(false)} onComplete={onScanComplete} />}
    </main>
  );
}

function Splash() {
  return <div style={{ minHeight: "100dvh", display: "grid", placeItems: "center", color: "var(--ink-faint)", fontFamily: "var(--f-display)" }}>EVORA</div>;
}
