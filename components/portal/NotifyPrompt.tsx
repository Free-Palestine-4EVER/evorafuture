"use client";

import { useEffect, useState } from "react";
import { useT } from "@/lib/i18n";
import { currentPermission, promptPush, pushConfigured } from "@/lib/portal/push";

// Turn on push. Handles the iOS quirk: Safari tabs can't do web push — the user
// must Add to Home Screen and open the installed app first (iOS 16.4+).
function isIOS() {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1); // iPadOS
}
function isStandalone() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(display-mode: standalone)").matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true;
}

export default function NotifyPrompt() {
  const { lang } = useT();
  const [perm, setPerm] = useState<string>("loading");
  const [dismissed, setDismissed] = useState(false);
  const [showIOS, setShowIOS] = useState(false);

  useEffect(() => {
    if (!pushConfigured) return;
    setPerm(currentPermission());
    const i = setInterval(() => setPerm(currentPermission()), 1500);
    return () => clearInterval(i);
  }, []);

  if (!pushConfigured || dismissed || perm === "granted" || perm === "unsupported") return null;

  const iosNeedsInstall = isIOS() && !isStandalone();

  const bar: React.CSSProperties = {
    display: "flex", alignItems: "center", gap: "0.9rem", flexWrap: "wrap",
    background: "var(--ink)", color: "var(--paper)", borderRadius: 14, padding: "0.9rem 1.1rem", margin: "0 0 1.6rem",
  };
  const xBtn = (
    <button onClick={() => setDismissed(true)} aria-label="Dismiss"
      style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: "1.1rem" }}>✕</button>
  );

  // iOS Safari tab: must install to Home Screen first.
  if (iosNeedsInstall) {
    return (
      <div style={bar}>
        <span style={{ fontSize: "1.2rem" }}>📲</span>
        <span style={{ flex: 1, minWidth: 200, fontSize: "0.9rem", lineHeight: 1.5 }}>
          {lang === "ar"
            ? <>لتفعيل الإشعارات على الآيفون: اضغط زر المشاركة <b>􀈂</b> ثم <b>«إضافة إلى الشاشة الرئيسية»</b>، وافتح التطبيق من الأيقونة وفعّل الإشعارات.</>
            : <>To get notifications on iPhone/iPad: tap the <b>Share</b> button, then <b>“Add to Home Screen,”</b> open the app from the new icon, and enable notifications there.</>}
        </span>
        {xBtn}
      </div>
    );
  }

  // Tapping the install button on iOS standalone, or any desktop/Android browser.
  return (
    <div style={bar}>
      <span style={{ fontSize: "1.2rem" }}>🔔</span>
      <span style={{ flex: 1, minWidth: 180, fontSize: "0.92rem", lineHeight: 1.45 }}>
        {lang === "ar" ? "فعّل الإشعارات لتصلك تحديثات مشروعك أولاً بأول." : "Turn on notifications to get updates on your project the moment they happen."}
      </span>
      <button onClick={() => { promptPush(); setTimeout(() => setPerm(currentPermission()), 800); }}
        style={{ background: "var(--clay)", color: "#fff", border: "none", borderRadius: 999, padding: "0.55em 1.1em", fontSize: "0.86rem", fontWeight: 600, cursor: "pointer" }}>
        {lang === "ar" ? "تفعيل" : "Enable"}
      </button>
      {xBtn}
    </div>
  );
}
