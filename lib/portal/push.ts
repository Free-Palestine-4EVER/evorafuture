"use client";

// OneSignal push helpers. Browsers only show the NATIVE permission prompt from a
// real user gesture (a click) — so promptPush() is for the bell/banner button.
// softPrompt() uses OneSignal's in-page slidedown, which can show without a
// gesture (the user then clicks "Allow" inside it). Both no-op if unconfigured.

const APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;

export const pushConfigured = !!APP_ID;

interface OneSignalLike {
  Notifications?: { permission?: boolean; requestPermission?: () => Promise<unknown> };
  Slidedown?: { promptPush?: (o?: { force?: boolean }) => Promise<unknown> };
}

function withOneSignal(fn: (os: OneSignalLike) => void) {
  if (!APP_ID || typeof window === "undefined") return;
  const w = window as unknown as { OneSignalDeferred?: Array<(os: OneSignalLike) => void> };
  w.OneSignalDeferred = w.OneSignalDeferred || [];
  w.OneSignalDeferred.push(fn);
}

// From a user click — native browser prompt (most reliable). Falls back to slidedown.
export function promptPush() {
  withOneSignal(async (OneSignal) => {
    try {
      if (OneSignal.Notifications?.requestPermission) await OneSignal.Notifications.requestPermission();
      else await OneSignal.Slidedown?.promptPush?.({ force: true });
    } catch {
      try { await OneSignal.Slidedown?.promptPush?.({ force: true }); } catch { /* ignore */ }
    }
  });
}

// Auto (no gesture) — OneSignal's own slide prompt.
export function softPrompt() {
  withOneSignal(async (OneSignal) => {
    try { await OneSignal.Slidedown?.promptPush?.(); } catch { /* ignore */ }
  });
}

export function currentPermission(): NotificationPermission | "unsupported" {
  if (typeof window === "undefined" || typeof Notification === "undefined") return "unsupported";
  return Notification.permission;
}
