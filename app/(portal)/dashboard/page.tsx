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
import NotifyPrompt from "@/components/portal/NotifyPrompt";
import LiveScanner from "@/components/portal/LiveScanner";
import PortalShell, { Icons } from "@/components/portal/PortalShell";
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
  const t = (en: string, ar: string) => (lang === "ar" ? ar : en);
  const { user, loading } = usePortalAuth();
  const [section, setSection] = useState("designs");
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [active, setActive] = useState<Project | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState("");

  const load = useCallback(async () => { if (user) setProjects(await listProjectsForUser(user.uid)); }, [user]);
  useEffect(() => { if (user) load(); }, [user, load]);
  useEffect(() => { if (!user) return; return subscribe(() => load()); }, [user, load]);

  if (loading) return <Splash />;
  if (!user) return <LoginForm variant="client" />;

  async function approve(p: Project) { await approveProject(p.id); setActive(null); load(); }
  const ci = (p: Project) => stageIndex(p.stage || "blueprint");

  async function onScanComplete(scan: ScanFile) {
    if (!user) return;
    setScanning(false); setSection("designs");
    try {
      setScanStatus(t("Building plan…", "بناء المخطط…"));
      const pf = scanToProject(scan);
      if (!pf.planImage) throw new Error("no plan image");
      const planUrl = await uploadFile(dataUrlToFile(pf.planImage, "scan-plan.png"));
      setScanStatus(t("Building 3D room…", "بناء الغرفة ثلاثية الأبعاد…"));
      let glbUrl: string | undefined;
      try { glbUrl = await uploadFile(new File([await buildRoomGlbBlob(scan)], "scan-room.glb", { type: "model/gltf-binary" })); } catch (e) { console.error(e); }
      await saveProject({
        id: newId(), ownerUid: user.uid, ownerPhone: user.phone, ownerName: user.name,
        title: t("Scanned room", "غرفة ممسوحة"), room: t("Live scan", "مسح مباشر"), status: "draft", stage: "blueprint", approvedByClient: false,
        plan2dUrl: planUrl, thumbnailUrl: planUrl, model3dUrl: glbUrl, scanData: JSON.stringify(scan),
        notes: `Self-scan: ${scan.walls.length} walls, ${scan.objects?.length ?? 0} items.`,
      });
      setScanStatus(t("Scan saved ✓", "تم حفظ المسح ✓")); load(); setTimeout(() => setScanStatus(""), 2500);
    } catch (e) { console.error(e); setScanStatus(t("Scan failed", "فشل المسح")); }
  }

  const list = projects || [];
  const latest = [...list].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))[0];
  const nav = [
    { key: "designs", label: t("Designs", "تصاميمي"), icon: Icons.designs },
    { key: "scan", label: t("Scan room", "مسح غرفة"), icon: Icons.scan },
  ];

  return (
    <PortalShell nav={nav} active={section} onNavigate={(k) => { setSection(k); if (k === "scan") setScanning(true); }}
      title={section === "scan" ? t("Scan your room", "امسح غرفتك") : tp("my_designs", lang)}
      subtitle={`${t("Welcome", "مرحبًا")}, ${user.name}`} accentName={user.name}>
      <NotifyPrompt />

      {section === "designs" && (
        <>
          {list.length > 0 && (
            <div style={{ display: "flex", gap: "2.4rem", flexWrap: "wrap", padding: "1.2rem 1.6rem", ...card, marginBottom: "1.6rem" }}>
              {[
                { v: list.length, l: t("Designs", "تصاميم") },
                { v: list.filter((p) => p.approvedByClient).length, l: t("Approved", "موافق عليها") },
                { v: list.filter((p) => p.status === "delivered").length, l: t("Delivered", "تم تسليمها") },
              ].map((s) => (
                <div key={s.l}><div className="display" style={{ fontSize: "2rem", lineHeight: 1, color: "var(--ink)" }}>{s.v}</div><div style={{ fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-faint)", marginTop: "0.35rem" }}>{s.l}</div></div>
              ))}
            </div>
          )}

          {/* latest highlight */}
          {latest && (
            <button onClick={() => setActive(latest)} style={{ ...card, width: "100%", textAlign: "start", display: "flex", gap: "1.2rem", padding: "1rem", marginBottom: "2rem", cursor: "pointer", alignItems: "center", overflow: "hidden" }}>
              <div style={{ width: 120, height: 90, borderRadius: 12, background: "#f3f0ea", overflow: "hidden", flexShrink: 0 }}>{latest.thumbnailUrl && <img src={latest.thumbnailUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--clay)" }}>{t("Latest update", "آخر تحديث")}</p>
                <h3 className="display" style={{ margin: "0.2rem 0 0.5rem", fontSize: "1.4rem", color: "var(--ink)" }}>{latest.title}</h3>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", maxWidth: 360 }}>
                  <div style={{ flex: 1, height: 5, borderRadius: 999, background: "var(--line)", overflow: "hidden" }}><div style={{ width: `${Math.round(((ci(latest) + 1) / JOURNEY.length) * 100)}%`, height: "100%", background: "var(--clay)" }} /></div>
                  <span style={{ fontSize: "0.74rem", color: "var(--ink-soft)" }}>{lang === "ar" ? JOURNEY[ci(latest)].ar : JOURNEY[ci(latest)].en}</span>
                </div>
              </div>
              <span style={{ color: "var(--clay)", fontSize: "1.4rem", flexShrink: 0, paddingInlineEnd: "0.6rem" }}>→</span>
            </button>
          )}

          {scanStatus && <p style={{ color: "var(--clay)", fontWeight: 600, marginBottom: "1.2rem" }}>{scanStatus}</p>}
          {projects && list.length === 0 && <p style={{ color: "var(--ink-faint)", maxWidth: 460, lineHeight: 1.6 }}>{tp("no_projects", lang)}</p>}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.4rem" }}>
            {list.map((p) => {
              const pct = Math.round(((ci(p) + 1) / JOURNEY.length) * 100);
              return (
                <button key={p.id} onClick={() => setActive(p)}
                  style={{ ...card, textAlign: "start", overflow: "hidden", cursor: "pointer", padding: 0, transition: "transform .45s var(--ease), box-shadow .45s var(--ease)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 24px 60px rgba(22,21,15,0.12)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                  <div style={{ position: "relative", aspectRatio: "4/3", background: "#f3f0ea", overflow: "hidden" }}>
                    {p.thumbnailUrl && <img src={p.thumbnailUrl} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                    <span style={{ position: "absolute", top: 12, insetInlineStart: 12, padding: "0.35em 0.8em", borderRadius: 999, fontSize: "0.7rem", fontWeight: 600, background: p.approvedByClient ? "var(--clay)" : "rgba(22,21,15,0.85)", color: "#fff" }}>{STATUS_LABEL[p.status][lang]}</span>
                    {p.model3dUrl && <span style={{ position: "absolute", top: 12, insetInlineEnd: 12, padding: "0.3em 0.65em", borderRadius: 999, fontSize: "0.66rem", fontWeight: 700, background: "rgba(255,255,255,0.92)", color: "var(--ink)" }}>3D</span>}
                  </div>
                  <div style={{ padding: "1.1rem 1.2rem 1.3rem" }}>
                    <p style={{ fontSize: "0.72rem", color: "var(--ink-faint)", margin: 0 }}>{p.room}</p>
                    <h3 className="display" style={{ fontSize: "1.2rem", color: "var(--ink)", margin: "0.25rem 0 0.7rem" }}>{p.title}</h3>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", color: "var(--ink-faint)", marginBottom: "0.3rem" }}>
                      <span>{lang === "ar" ? JOURNEY[ci(p)].ar : JOURNEY[ci(p)].en}</span><span>{ci(p) + 1}/{JOURNEY.length}</span>
                    </div>
                    <div style={{ height: 4, borderRadius: 999, background: "var(--line)", overflow: "hidden" }}><div style={{ width: `${pct}%`, height: "100%", background: "var(--clay)" }} /></div>
                    <p style={{ fontSize: "0.8rem", color: "var(--clay)", margin: "0.8rem 0 0", fontWeight: 500 }}>{tp("view_3d", lang)} →</p>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}

      {section === "scan" && (
        <div style={{ ...card, padding: "clamp(1.6rem,5vw,3rem)", textAlign: "center", maxWidth: 560, margin: "1rem auto" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.8rem" }}>◎</div>
          <h2 className="display" style={{ fontSize: "1.8rem", color: "var(--ink)", margin: "0 0 0.8rem" }}>{t("Scan your room in 3D", "امسح غرفتك ثلاثي الأبعاد")}</h2>
          <p style={{ color: "var(--ink-soft)", lineHeight: 1.6, margin: "0 0 1.6rem" }}>{t("Walk around your room with your phone camera. Evora turns it into a 2D plan and a 3D model — then our designers furnish it for you.", "تجول في غرفتك بكاميرا هاتفك. تحوّلها إيفورا إلى مخطط ثنائي ونموذج ثلاثي الأبعاد، ثم يفرشها مصممونا لك.")}</p>
          <button onClick={() => setScanning(true)} style={{ padding: "1rem 2rem", borderRadius: 999, border: "none", background: "var(--clay)", color: "#fff", fontWeight: 700, fontSize: "1rem", cursor: "pointer" }}>◎ {t("Start scanning", "ابدأ المسح")}</button>
          {scanStatus && <p style={{ color: "var(--clay)", fontWeight: 600, marginTop: "1.2rem" }}>{scanStatus}</p>}
        </div>
      )}

      {active && <ProjectViewer project={projects?.find((p) => p.id === active.id) || active} onClose={() => setActive(null)} onApprove={approve} />}
      {scanning && <LiveScanner onClose={() => { setScanning(false); if (section === "scan") setSection("designs"); }} onComplete={onScanComplete} />}
    </PortalShell>
  );
}

const card: React.CSSProperties = { background: "#fff", border: "1px solid var(--line)", borderRadius: 16 };
function Splash() { return <div style={{ minHeight: "100dvh", display: "grid", placeItems: "center", color: "var(--ink-faint)", fontFamily: "var(--f-display)" }}>EVORA</div>; }
