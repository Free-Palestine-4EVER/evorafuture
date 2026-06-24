"use client";

// Trigger the OneSignal push-permission prompt. Safe to call anytime; no-ops if
// OneSignal isn't configured. A real user click is the most reliable trigger
// (browsers may ignore non-gesture permission requests).

const APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;

export const pushConfigured = !!APP_ID;

interface OneSignalLike {
  Notifications?: { permission?: boolean; requestPermission?: () => Promise<unknown> };
  Slidedown?: { promptPush?: () => Promise<unknown> };
}

export function promptPush() {
  if (!APP_ID || typeof window === "undefined") return;
  const w = window as unknown as { OneSignalDeferred?: Array<(os: OneSignalLike) => void> };
  w.OneSignalDeferred = w.OneSignalDeferred || [];
  w.OneSignalDeferred.push(async (OneSignal) => {
    try {
      // Native prompt first (most explicit); fall back to the slidedown.
      if (OneSignal.Notifications?.requestPermission) await OneSignal.Notifications.requestPermission();
      else await OneSignal.Slidedown?.promptPush?.();
    } catch {
      try { await OneSignal.Slidedown?.promptPush?.(); } catch { /* ignore */ }
    }
  });
}
