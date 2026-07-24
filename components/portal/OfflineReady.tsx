"use client";

import { useEffect } from "react";

/* Registers the portal service worker so /dashboard and /admindashboard work
 * offline and can be installed as a PWA. Mounted only inside the (portal)
 * layout, so the rest of the site is unaffected until a portal page is opened. */
export default function OfflineReady() {
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
    // Both workers can coexist now: OneSignal's is scoped to /onesignal/ (see
    // OneSignalInit) and this one passes through everything outside the portal
    // (see public/sw.js). Previously this bailed out entirely whenever OneSignal
    // was configured, which handed root scope to OneSignal's worker and left the
    // portal with no offline support at all.
    const onLoad = () => navigator.serviceWorker.register("/sw.js").catch(() => {});
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
    return () => window.removeEventListener("load", onLoad);
  }, []);
  return null;
}
