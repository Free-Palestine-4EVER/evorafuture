"use client";

// OneSignal web-push init for the portal. Inert unless NEXT_PUBLIC_ONESIGNAL_APP_ID
// is set. Identifies the signed-in user by their portal uid (external_id) so the
// server can target them, tags their role, and asks permission once.
// Web push only works over https (your domain) — not over plain http/LAN.

import { useEffect } from "react";
import { usePortalAuth } from "@/lib/portal/auth";
import { softPrompt } from "@/lib/portal/push";

const APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;

declare global {
  interface Window { OneSignalDeferred?: Array<(os: unknown) => void> }
}

export default function OneSignalInit() {
  const { user } = usePortalAuth();

  useEffect(() => {
    if (!APP_ID || typeof window === "undefined") return;
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    if (!document.getElementById("onesignal-sdk")) {
      const s = document.createElement("script");
      s.id = "onesignal-sdk";
      s.src = "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js";
      s.defer = true;
      document.head.appendChild(s);
    }
    window.OneSignalDeferred.push(async (os) => {
      const OneSignal = os as { __inited?: boolean; init: (c: object) => Promise<void> };
      if (OneSignal.__inited) return;
      OneSignal.__inited = true;
      await OneSignal.init({ appId: APP_ID, allowLocalhostAsSecureOrigin: true });
    });
  }, []);

  useEffect(() => {
    if (!APP_ID || !user || typeof window === "undefined") return;
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async (os) => {
      const OneSignal = os as {
        login: (id: string) => Promise<void>;
        User?: { addTag: (k: string, v: string) => void };
        Slidedown?: { promptPush: () => Promise<void> };
      };
      try {
        await OneSignal.login(user.uid);
        OneSignal.User?.addTag("role", user.role);
      } catch { /* ignore */ }
    });
    // Soft slide-prompt after login (gesture-free). The header bell / banner
    // does the native prompt on click.
    const t = setTimeout(() => softPrompt(), 1800);
    return () => clearTimeout(t);
  }, [user]);

  return null;
}
