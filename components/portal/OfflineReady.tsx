"use client";

import { useEffect } from "react";

/* Registers the portal service worker so /dashboard and /admindashboard work
 * offline and can be installed as a PWA. Mounted only inside the (portal)
 * layout, so the rest of the site is unaffected until a portal page is opened. */
export default function OfflineReady() {
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
    // When OneSignal is configured it owns the service worker (push); don't
    // register our offline worker too — two root-scope workers would conflict.
    if (process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID) return;
    const onLoad = () => navigator.serviceWorker.register("/sw.js").catch(() => {});
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
    return () => window.removeEventListener("load", onLoad);
  }, []);
  return null;
}
