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
  User?: { PushSubscription?: { optIn?: () => Promise<unknown> } };
}

function withOneSignal(fn: (os: OneSignalLike) => void) {
  if (!APP_ID || typeof window === "undefined") return;
  const w = window as unknown as { OneSignalDeferred?: Array<(os: OneSignalLike) => void> };
  w.OneSignalDeferred = w.OneSignalDeferred || [];
  w.OneSignalDeferred.push(fn);
}

// MUST be called directly from a click handler. We invoke the NATIVE
// Notification.requestPermission() synchronously here so the browser keeps the
// user-gesture context (going through OneSignal's async queue loses it and the
// prompt is silently dropped). Then we tell OneSignal to subscribe.
export async function promptPush() {
  if (typeof window === "undefined") return;
  let perm: NotificationPermission = currentPermission() as NotificationPermission;
  try {
    if (typeof Notification !== "undefined" && Notification.requestPermission && perm === "default") {
      perm = await Notification.requestPermission(); // native prompt, in-gesture
    }
  } catch { /* ignore */ }
  // Hand off to OneSignal to register the worker + create the subscription.
  withOneSignal(async (OneSignal) => {
    try {
      await OneSignal.User?.PushSubscription?.optIn?.();
      if (perm !== "granted") await OneSignal.Notifications?.requestPermission?.();
    } catch { /* ignore */ }
  });
  return perm;
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
