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

// MUST be called directly from a click handler. The OneSignal SDK is already
// loaded by the time the user clicks, so we call its requestPermission DIRECTLY
// (not via the async OneSignalDeferred queue, which would lose the gesture and
// silently drop the prompt). OneSignal's flow both shows the prompt AND
// registers the push subscription (so you appear as a user in OneSignal). We
// also explicitly optIn to be safe. Native prompt is only a fallback if the SDK
// hasn't loaded yet.
export async function promptPush() {
  if (typeof window === "undefined") return;
  // 1) NATIVE prompt first, synchronously in the gesture — this ALWAYS shows the
  //    browser popup, even if OneSignal's origin isn't configured yet.
  let perm = currentPermission();
  try {
    if (typeof Notification !== "undefined" && Notification.requestPermission && perm !== "granted") {
      perm = await Notification.requestPermission();
    }
  } catch { /* ignore */ }
  // 2) Then hand off to OneSignal to register the subscription/user (best effort;
  //    needs the Web Site URL configured in the OneSignal dashboard to stick).
  withOneSignal(async (OS) => {
    try { await OS.User?.PushSubscription?.optIn?.(); } catch { /* ignore */ }
    try { if (perm === "granted") await OS.Notifications?.requestPermission?.(); } catch { /* ignore */ }
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
