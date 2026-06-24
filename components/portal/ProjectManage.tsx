"use client";

import { useRef, useState } from "react";
import { useT } from "@/lib/i18n";
import { tp } from "@/lib/portal/strings";
import { JOURNEY, stageIndex } from "@/lib/portal/journey";
import { addUpdate, approveProject, deleteUpdate, saveProject, setStage, uploadFile } from "@/lib/portal/store";
import { STATUS_LABEL, type Project, type ProjectStatus } from "@/lib/portal/types";
import LiveScanner from "@/components/portal/LiveScanner";
import { scanToProject } from "@/lib/puffer/importScan";
import { buildRoomGlbBlob } from "@/lib/puffer/liveScan";
import type { ScanFile } from "@/lib/puffer/importScan";

// dataURL → File so the live-scan plan image can ride the normal upload path.
function dataUrlToFile(dataUrl: string, name: string): File {
  const [head, b64] = dataUrl.split(",");
  const mime = /data:([^;]+)/.exec(head)?.[1] || "image/png";
  const bin = atob(b64); const u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  return new File([u8], name, { type: mime });
}

const STATUSES: ProjectStatus[] = ["draft", "approved", "in_production", "delivered"];

export default function ProjectManage({ project, onClose, by }: { project: Project; onClose: () => void; by?: string }) {
  const { lang, dir } = useT();
  const t = (en: string, ar: string) => (lang === "ar" ? ar : en);

  // editable details
  const [title, setTitle] = useState(project.title);
  const [room, setRoom] = useState(project.room || "");
  const [status, setStatus] = useState<ProjectStatus>(project.status);
  const [notes, setNotes] = useState(project.notes || "");
  const [plan2dUrl, setPlan2d] = useState(project.plan2dUrl || "");
  const [model3dUrl, setModel3d] = useState(project.model3dUrl || "");
  const [savedFlash, setSavedFlash] = useState(false);

  // stage
  const [stage, setStageVal] = useState(project.stage || "blueprint");
  const cur = stageIndex(stage);

  // update composer
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [busy, setBusy] = useState(false);
  const photoRef = useRef<HTMLInputElement>(null);
  const plan2dRef = useRef<HTMLInputElement>(null);
  const modelRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);

  // live scanner
  const [scanning, setScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState("");

  async function onScanComplete(scan: ScanFile) {
    setScanning(false);
    setBusy(true);
    try {
      setScanStatus(t("Building plan…", "بناء المخطط…"));
      const pf = scanToProject(scan); // 2D plan image + walls + furniture rects
      if (!pf.planImage) throw new Error("no plan image");
      const planUrl = await uploadFile(dataUrlToFile(pf.planImage, "scan-plan.png"));
      setPlan2d(planUrl);

      setScanStatus(t("Building 3D room…", "بناء الغرفة ثلاثية الأبعاد…"));
      let glbUrl = model3dUrl;
      try {
        const glb = await buildRoomGlbBlob(scan);
        glbUrl = await uploadFile(new File([glb], "scan-room.glb", { type: "model/gltf-binary" }));
        setModel3d(glbUrl);
      } catch (e) { console.error("glb build failed", e); }

      await saveProject({
        ...project, plan2dUrl: planUrl, thumbnailUrl: project.thumbnailUrl || planUrl,
        model3dUrl: glbUrl, scanData: JSON.stringify(scan),
      });
      const n = (scan.objects?.length ?? 0);
      await addUpdate(project.id, t(`Room scanned on-site — ${scan.walls.length} walls, ${n} items detected.`, `تم مسح الغرفة في الموقع — ${scan.walls.length} جدار و${n} عنصر.`), stage, by);
      setScanStatus(t("Scan saved ✓", "تم حفظ المسح ✓"));
      setTimeout(() => setScanStatus(""), 2500);
    } catch (e) {
      console.error(e);
      setScanStatus(t("Scan failed — try again.", "فشل المسح — حاول مجدداً."));
    } finally { setBusy(false); }
  }

  const signupLink = typeof window !== "undefined" ? `${window.location.origin}/join?phone=${encodeURIComponent(project.ownerPhone || "")}` : "";

  async function saveDetails() {
    setBusy(true);
    await saveProject({ ...project, title, room, status, notes, plan2dUrl, thumbnailUrl: project.thumbnailUrl || plan2dUrl, model3dUrl, stage });
    setBusy(false); setSavedFlash(true); setTimeout(() => setSavedFlash(false), 1500);
  }
  async function changeStage(key: string) { setStageVal(key); await setStage(project.id, key); }
  async function post() {
    if (!text.trim() && !image) return;
    setBusy(true);
    await addUpdate(project.id, text.trim(), stage, by, image || undefined);
    setText(""); setImage(""); setBusy(false);
  }
  async function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    setBusy(true); try { setImage(await uploadFile(f)); } finally { setBusy(false); }
  }
  async function on2d(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    setBusy(true); try { const url = await uploadFile(f); setPlan2d(url); await saveProject({ ...project, plan2dUrl: url, thumbnailUrl: url }); } finally { setBusy(false); }
  }
  async function on3d(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    setBusy(true); try { const url = await uploadFile(f); setModel3d(url); await saveProject({ ...project, model3dUrl: url }); } finally { setBusy(false); }
  }

  const field: React.CSSProperties = { width: "100%", padding: "0.65rem 0.8rem", marginTop: "0.3rem", border: "1px solid var(--line)", borderRadius: 10, fontFamily: "var(--f-sans)", fontSize: "0.9rem", color: "var(--ink)", background: "#fff" };
  const label: React.CSSProperties = { fontSize: "0.66rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-faint)" };
  const sectionTitle: React.CSSProperties = { fontSize: "0.7rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-faint)", margin: "0 0 0.8rem", fontWeight: 600 };
  const upBtn: React.CSSProperties = { padding: "0.45rem 0.8rem", borderRadius: 8, border: "1px dashed var(--line)", background: "transparent", color: "var(--ink-soft)", fontSize: "0.78rem", cursor: "pointer" };

  return (
    <>
    {scanning && <LiveScanner onClose={() => setScanning(false)} onComplete={onScanComplete} />}
    <div onClick={onClose} dir={dir} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(22,21,15,0.55)", backdropFilter: "blur(6px)", display: "grid", placeItems: "center", padding: "1rem" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "min(620px,100%)", maxHeight: "94dvh", overflow: "auto", background: "var(--paper)", borderRadius: 18, padding: "1.8rem", boxShadow: "0 40px 120px rgba(0,0,0,0.3)" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
          <div>
            <p style={{ fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-faint)", margin: 0 }}>{project.ownerName || project.ownerPhone}</p>
            <h2 className="display" style={{ fontSize: "1.7rem", color: "var(--ink)", margin: "0.2rem 0 0" }}>{title || project.title}</h2>
            <p style={{ fontSize: "0.78rem", color: "var(--clay)", margin: "0.3rem 0 0", fontWeight: 600 }}>{cur + 1}/{JOURNEY.length} · {lang === "ar" ? JOURNEY[cur].ar : JOURNEY[cur].en}</p>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ width: 38, height: 38, borderRadius: 999, border: "1px solid var(--line)", background: "transparent", cursor: "pointer", color: "var(--ink)", fontSize: "1rem", flexShrink: 0 }}>✕</button>
        </header>

        {/* DETAILS */}
        <p style={sectionTitle}>{t("Details", "التفاصيل")}</p>
        <label style={label}>{t("Title", "العنوان")}<input style={field} value={title} onChange={(e) => setTitle(e.target.value)} /></label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem", marginTop: "0.8rem" }}>
          <label style={label}>{t("Room", "الغرفة")}<input style={field} value={room} onChange={(e) => setRoom(e.target.value)} /></label>
          <label style={label}>{t("Status", "الحالة")}
            <select style={field} value={status} onChange={(e) => setStatus(e.target.value as ProjectStatus)}>
              {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s][lang]}</option>)}
            </select>
          </label>
        </div>
        <label style={{ ...label, display: "block", marginTop: "0.8rem" }}>{t("Notes", "ملاحظات")}<textarea style={{ ...field, minHeight: 60, resize: "vertical" }} value={notes} onChange={(e) => setNotes(e.target.value)} /></label>
        <button onClick={saveDetails} disabled={busy} style={{ marginTop: "0.9rem", padding: "0.6rem 1.2rem", borderRadius: 10, border: "none", background: savedFlash ? "var(--clay)" : "var(--ink)", color: "#fff", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", opacity: busy ? 0.6 : 1 }}>
          {savedFlash ? t("Saved ✓", "تم الحفظ ✓") : t("Save details", "حفظ التفاصيل")}
        </button>

        {/* LIVE SCAN */}
        <p style={{ ...sectionTitle, marginTop: "1.8rem" }}>{t("Scan the room (live)", "مسح الغرفة (مباشر)")}</p>
        <div style={{ border: "1px solid rgba(178,116,87,0.25)", borderRadius: 14, padding: "1rem", background: "rgba(178,116,87,0.05)" }}>
          <p style={{ margin: "0 0 0.7rem", fontSize: "0.82rem", color: "var(--ink-soft)", lineHeight: 1.55 }}>
            {t("At the client's home, scan the room with the phone camera — it identifies the furniture and builds a 2D plan + 3D room automatically.",
               "في منزل العميل، امسح الغرفة بكاميرا الهاتف — يتعرّف على الأثاث ويبني مخططاً ثنائياً وغرفة ثلاثية الأبعاد تلقائياً.")}
          </p>
          <button onClick={() => setScanning(true)} disabled={busy}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.7rem 1.3rem", borderRadius: 999, border: "none", background: "var(--clay)", color: "#fff", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", opacity: busy ? 0.6 : 1 }}>
            ◎ {t("Start live scan", "ابدأ المسح المباشر")}
          </button>
          {scanStatus && <span style={{ marginInlineStart: "0.8rem", fontSize: "0.8rem", color: "var(--clay)", fontWeight: 600 }}>{scanStatus}</span>}
          {project.scanData && !scanStatus && <span style={{ marginInlineStart: "0.8rem", fontSize: "0.78rem", color: "var(--ink-faint)" }}>✓ {t("scan on file", "يوجد مسح محفوظ")}</span>}
        </div>

        {/* FILES */}
        <p style={{ ...sectionTitle, marginTop: "1.8rem" }}>{t("2D plan & 3D room", "المخطط والغرفة ثلاثية الأبعاد")}</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.9rem" }}>
          <div style={{ border: "1px solid var(--line)", borderRadius: 12, padding: "0.8rem", textAlign: "center" }}>
            <div style={{ aspectRatio: "4/3", borderRadius: 8, background: "#f3f0ea", overflow: "hidden", marginBottom: "0.6rem", display: "grid", placeItems: "center" }}>
              {plan2dUrl ? <img src={plan2dUrl} alt="2D" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ color: "var(--ink-faint)", fontSize: "0.8rem" }}>{t("No 2D plan", "لا يوجد مخطط")}</span>}
            </div>
            <button style={upBtn} onClick={() => plan2dRef.current?.click()}>⤓ {plan2dUrl ? t("Replace 2D", "استبدال المخطط") : t("Upload 2D plan", "رفع المخطط")}</button>
            <input ref={plan2dRef} type="file" accept="image/*,application/pdf" onChange={on2d} style={{ display: "none" }} />
          </div>
          <div style={{ border: "1px solid var(--line)", borderRadius: 12, padding: "0.8rem", textAlign: "center" }}>
            <div style={{ aspectRatio: "4/3", borderRadius: 8, background: "#f3f0ea", overflow: "hidden", marginBottom: "0.6rem", display: "grid", placeItems: "center", color: "var(--ink-faint)", fontSize: "0.8rem" }}>
              {model3dUrl ? <span style={{ color: "var(--clay)", fontWeight: 600 }}>✓ {t("3D room set", "الغرفة جاهزة")}</span> : <span>{t("No 3D room", "لا يوجد نموذج")}</span>}
            </div>
            <button style={upBtn} onClick={() => modelRef.current?.click()}>⤓ {model3dUrl ? t("Replace 3D (.glb)", "استبدال النموذج") : t("Upload 3D (.glb)", "رفع نموذج 3D")}</button>
            <input ref={modelRef} type="file" accept=".glb,model/gltf-binary" onChange={on3d} style={{ display: "none" }} />
          </div>
        </div>

        {/* JOURNEY */}
        <p style={{ ...sectionTitle, marginTop: "1.8rem" }}>{t("Journey — set the current step", "الرحلة — حدد المرحلة الحالية")}</p>
        <div style={{ display: "grid", gap: "0.4rem" }}>
          {JOURNEY.map((s, i) => {
            const done = i < cur, active = i === cur;
            return (
              <button key={s.key} onClick={() => changeStage(s.key)}
                style={{ display: "flex", alignItems: "center", gap: "0.7rem", textAlign: "start", padding: "0.6rem 0.8rem", borderRadius: 10, cursor: "pointer",
                  border: `1px solid ${active ? "var(--ink)" : "var(--line)"}`, background: active ? "var(--ink)" : done ? "rgba(178,116,87,0.08)" : "transparent", color: active ? "#fff" : "var(--ink)" }}>
                <span style={{ width: 20, height: 20, borderRadius: 999, flexShrink: 0, display: "grid", placeItems: "center", fontSize: "0.62rem", color: active || done ? "#fff" : "var(--ink-faint)", background: done ? "var(--clay)" : "transparent", border: done ? "none" : `1.5px solid ${active ? "#fff" : "var(--line)"}` }}>{done ? "✓" : i + 1}</span>
                <span style={{ fontSize: "0.88rem", fontWeight: active ? 600 : 500, flex: 1 }}>{lang === "ar" ? s.ar : s.en}</span>
                {active && <span style={{ fontSize: "0.66rem", opacity: 0.7 }}>{t("current", "الحالية")}</span>}
              </button>
            );
          })}
        </div>
        <button onClick={() => approveProject(project.id)} style={{ marginTop: "0.8rem", padding: "0.55rem 1.1rem", borderRadius: 999, border: "1px solid var(--clay)", background: project.approvedByClient ? "var(--clay)" : "transparent", color: project.approvedByClient ? "#fff" : "var(--clay)", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer" }}>
          {project.approvedByClient ? `✓ ${t("Approved", "تمت الموافقة")}` : t("Mark approved", "وضع علامة موافقة")}
        </button>

        {/* POST UPDATE */}
        <p style={{ ...sectionTitle, marginTop: "1.8rem" }}>{t("Post an update to the customer", "نشر تحديث للعميل")}</p>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={2} placeholder={t("e.g. 3D design ready — please review the kitchen.", "مثال: التصميم ثلاثي الأبعاد جاهز — يرجى مراجعة المطبخ.")}
          style={{ ...field, marginTop: 0, minHeight: 56, resize: "vertical" }} />
        <button type="button" onClick={() => photoRef.current?.click()} style={{ ...upBtn, marginTop: "0.5rem", width: "100%", textAlign: "start", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ color: "var(--clay)" }}>⤓</span> {image ? t("Photo attached ✓", "تم إرفاق صورة ✓") : t("Attach a photo (render, finishing…)", "إرفاق صورة")}
        </button>
        <input ref={photoRef} type="file" accept="image/*" onChange={onPhoto} style={{ display: "none" }} />
        {image && <img src={image} alt="" style={{ width: "100%", marginTop: "0.5rem", borderRadius: 10, maxHeight: 150, objectFit: "cover" }} />}
        <button onClick={post} disabled={busy} style={{ marginTop: "0.7rem", width: "100%", padding: "0.75rem", borderRadius: 10, border: "none", background: "var(--clay)", color: "#fff", fontWeight: 600, cursor: "pointer", opacity: busy ? 0.6 : 1 }}>{t("Post update", "نشر التحديث")}</button>

        {/* TIMELINE */}
        {project.updates && project.updates.length > 0 && (
          <>
            <p style={{ ...sectionTitle, marginTop: "1.8rem" }}>{t("Timeline", "السجل")}</p>
            {project.updates.map((u) => (
              <div key={u.id} style={{ padding: "0.7rem 0", borderTop: "1px solid var(--line-soft)", display: "flex", gap: "0.8rem" }}>
                {u.imageUrl && <img src={u.imageUrl} alt="" style={{ width: 56, height: 56, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />}
                <div style={{ flex: 1 }}>
                  {u.text && <p style={{ margin: 0, color: "var(--ink-soft)", fontSize: "0.86rem" }}>{u.text}</p>}
                  <p style={{ margin: "0.15rem 0 0", color: "var(--ink-faint)", fontSize: "0.68rem" }}>{new Date(u.at).toLocaleString()}</p>
                </div>
                <button onClick={() => deleteUpdate(project.id, u.id)} aria-label="Delete" style={{ background: "transparent", border: "none", color: "var(--ink-faint)", cursor: "pointer", fontSize: "0.9rem", flexShrink: 0 }}>✕</button>
              </div>
            ))}
          </>
        )}

        {/* SHARE LINK */}
        <div style={{ marginTop: "1.8rem", padding: "0.9rem 1rem", borderRadius: 12, background: "rgba(178,116,87,0.07)", border: "1px solid rgba(178,116,87,0.2)" }}>
          <p style={{ fontSize: "0.66rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--clay)", margin: "0 0 0.4rem" }}>{t("Customer sign-up link", "رابط تسجيل العميل")}</p>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <input readOnly value={signupLink} style={{ flex: 1, background: "transparent", border: "none", color: "var(--ink-soft)", fontSize: "0.74rem", outline: "none" }} />
            <button onClick={() => { navigator.clipboard?.writeText(signupLink); setCopied(true); setTimeout(() => setCopied(false), 1200); }}
              style={{ padding: "0.35rem 0.8rem", borderRadius: 999, border: "none", background: "var(--clay)", color: "#fff", fontSize: "0.74rem", cursor: "pointer" }}>{copied ? t("Copied", "تم النسخ") : t("Copy", "نسخ")}</button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
