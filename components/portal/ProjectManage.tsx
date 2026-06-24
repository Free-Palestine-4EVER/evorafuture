"use client";

import { useRef, useState } from "react";
import { useT } from "@/lib/i18n";
import { tp } from "@/lib/portal/strings";
import { JOURNEY, stageIndex } from "@/lib/portal/journey";
import { addUpdate, setStage } from "@/lib/portal/store";
import type { Project } from "@/lib/portal/types";

export default function ProjectManage({ project, onClose, by }: { project: Project; onClose: () => void; by?: string }) {
  const { lang, dir } = useT();
  const [stage, setStageVal] = useState(project.stage || "blueprint");
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [imageName, setImageName] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const cur = stageIndex(stage);

  async function changeStage(key: string) {
    setStageVal(key);
    await setStage(project.id, key);
  }
  function onImage(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setImageName(f.name);
    const r = new FileReader();
    r.onload = () => setImage(String(r.result || ""));
    r.readAsDataURL(f);
  }
  async function post() {
    if (!text.trim() && !image) return;
    setBusy(true);
    await addUpdate(project.id, text.trim(), stage, by, image || undefined);
    setText(""); setImage(""); setImageName(""); setBusy(false);
  }

  return (
    <div onClick={onClose} dir={dir} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(22,21,15,0.5)", backdropFilter: "blur(6px)", display: "grid", placeItems: "center", padding: "1rem" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "min(520px,100%)", maxHeight: "92dvh", overflow: "auto", background: "var(--paper)", borderRadius: 16, padding: "1.8rem", boxShadow: "0 40px 120px rgba(0,0,0,0.3)" }}>
        <p style={{ fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-faint)", margin: 0 }}>{project.ownerName || project.ownerPhone}</p>
        <h2 className="display" style={{ fontSize: "1.7rem", color: "var(--ink)", margin: "0.2rem 0 1.4rem" }}>{project.title}</h2>

        <p style={{ ...labelS }}>{tp("current_stage", lang)}</p>
        <div style={{ display: "grid", gap: "0.4rem", marginTop: "0.6rem" }}>
          {JOURNEY.map((s, i) => {
            const done = i < cur, active = i === cur;
            return (
              <button key={s.key} onClick={() => changeStage(s.key)}
                style={{ display: "flex", alignItems: "center", gap: "0.7rem", textAlign: "start", padding: "0.6rem 0.8rem", borderRadius: 10, cursor: "pointer",
                  border: `1px solid ${active ? "var(--ink)" : "var(--line)"}`, background: active ? "var(--ink)" : done ? "rgba(178,116,87,0.08)" : "transparent", color: active ? "#fff" : "var(--ink)" }}>
                <span style={{ width: 18, height: 18, borderRadius: 999, display: "grid", placeItems: "center", fontSize: "0.6rem", color: active || done ? "#fff" : "var(--ink-faint)", background: done ? "var(--clay)" : active ? "transparent" : "transparent", border: done ? "none" : `1.5px solid ${active ? "#fff" : "var(--line)"}` }}>{done ? "✓" : i + 1}</span>
                <span style={{ fontSize: "0.9rem", fontWeight: active ? 600 : 500 }}>{lang === "ar" ? s.ar : s.en}</span>
              </button>
            );
          })}
        </div>

        <p style={{ ...labelS, marginTop: "1.6rem" }}>{tp("post_update", lang)}</p>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={2}
          placeholder={lang === "ar" ? "مثال: تم الانتهاء من تصميم الأثاث وبانتظار موافقتك" : "e.g. Furniture design done — awaiting your approval"}
          style={{ width: "100%", marginTop: "0.5rem", padding: "0.7rem 0.85rem", border: "1px solid var(--line)", borderRadius: 10, fontFamily: "var(--f-sans)", fontSize: "0.92rem", color: "var(--ink)", resize: "vertical" }} />
        <button type="button" onClick={() => fileRef.current?.click()}
          style={{ width: "100%", marginTop: "0.5rem", padding: "0.65rem 0.85rem", border: "1px dashed var(--line)", borderRadius: 10, background: "transparent", textAlign: "start", cursor: "pointer", color: imageName ? "var(--ink)" : "var(--ink-faint)", fontSize: "0.86rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ color: "var(--clay)" }}>⤓</span> {imageName || (lang === "ar" ? "أرفق صورة (عرض، تشطيب…)" : "Attach a photo (render, finishing…)")}
        </button>
        <input ref={fileRef} type="file" accept="image/*" onChange={onImage} style={{ display: "none" }} />
        {image && <img src={image} alt="" style={{ width: "100%", marginTop: "0.5rem", borderRadius: 10, maxHeight: 160, objectFit: "cover" }} />}
        <div style={{ display: "flex", gap: "0.7rem", marginTop: "1rem" }}>
          <button onClick={post} disabled={busy} style={{ flex: 1, padding: "0.8rem", borderRadius: 10, border: "none", background: "var(--clay)", color: "#fff", fontWeight: 600, cursor: "pointer", opacity: busy ? 0.6 : 1 }}>{tp("post", lang)}</button>
          <button onClick={onClose} style={{ padding: "0.8rem 1.3rem", borderRadius: 10, border: "1px solid var(--line)", background: "transparent", color: "var(--ink)", cursor: "pointer" }}>{tp("close", lang)}</button>
        </div>

        {project.updates && project.updates.length > 0 && (
          <div style={{ marginTop: "1.4rem" }}>
            {project.updates.map((u) => (
              <div key={u.id} style={{ padding: "0.6rem 0", borderTop: "1px solid var(--line-soft)" }}>
                {u.imageUrl && <img src={u.imageUrl} alt="" style={{ width: "100%", borderRadius: 8, marginBottom: "0.4rem", maxHeight: 180, objectFit: "cover" }} />}
                {u.text && <p style={{ margin: 0, color: "var(--ink-soft)", fontSize: "0.88rem" }}>{u.text}</p>}
                <p style={{ margin: "0.15rem 0 0", color: "var(--ink-faint)", fontSize: "0.7rem" }}>{new Date(u.at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const labelS: React.CSSProperties = { fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-faint)", margin: 0 };
