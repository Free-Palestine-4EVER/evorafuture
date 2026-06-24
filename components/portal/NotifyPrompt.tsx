"use client";

import { useEffect, useState } from "react";
import { useT } from "@/lib/i18n";
import { currentPermission, promptPush, pushConfigured } from "@/lib/portal/push";

// A clear, clickable banner to turn on push notifications. A real click is what
// browsers require to show the native permission prompt, so this is the reliable
// path (the auto slide-prompt may be blocked).
export default function NotifyPrompt() {
  const { lang } = useT();
  const [perm, setPerm] = useState<string>("loading");
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!pushConfigured) return;
    setPerm(currentPermission());
    const i = setInterval(() => setPerm(currentPermission()), 1500);
    return () => clearInterval(i);
  }, []);

  if (!pushConfigured || dismissed || perm !== "default") return null;

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "0.9rem", flexWrap: "wrap",
      background: "var(--ink)", color: "var(--paper)", borderRadius: 14,
      padding: "0.9rem 1.1rem", margin: "0 0 1.6rem",
    }}>
      <span style={{ fontSize: "1.2rem" }}>🔔</span>
      <span style={{ flex: 1, minWidth: 180, fontSize: "0.92rem", lineHeight: 1.45 }}>
        {lang === "ar" ? "فعّل الإشعارات لتصلك تحديثات مشروعك أولاً بأول." : "Turn on notifications to get updates on your project the moment they happen."}
      </span>
      <button onClick={() => { promptPush(); setTimeout(() => setPerm(currentPermission()), 800); }}
        style={{ background: "var(--clay)", color: "#fff", border: "none", borderRadius: 999, padding: "0.55em 1.1em", fontSize: "0.86rem", fontWeight: 600, cursor: "pointer" }}>
        {lang === "ar" ? "تفعيل" : "Enable"}
      </button>
      <button onClick={() => setDismissed(true)} aria-label="Dismiss"
        style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: "1.1rem" }}>✕</button>
    </div>
  );
}
