/* Evora Client Portal — offline service worker.
 *
 * Strategy: NETWORK-FIRST for everything, with a cache fallback.
 * - While online, every request goes to the network first, so the live dev
 *   server (and other Claude sessions working on the marketing site) are never
 *   served stale assets by this worker.
 * - Each successful same-origin GET is copied into the cache.
 * - When offline, requests fall back to whatever was cached on a previous
 *   online visit — so the portal, its chunks, fonts and images all keep working.
 */

const CACHE = "evora-portal-v2";
const PRECACHE = ["/portal.webmanifest", "/icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  // Only ever touch same-origin requests; let cross-origin (e.g. Firebase) pass.
  if (url.origin !== self.location.origin) return;
  // Never intercept the live API or SSE stream — buffering an event-stream
  // would break realtime. Let these go straight to the network.
  if (url.pathname.startsWith("/api/") || req.headers.get("accept") === "text/event-stream") return;
  // Don't interfere with Next.js HMR / dev websockets.
  if (url.pathname.startsWith("/_next/webpack-hmr") || url.pathname.includes("__nextjs")) return;

  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.ok && res.type === "basic") {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      })
      .catch(async () => {
        const cached = await caches.match(req, { ignoreSearch: true });
        if (cached) return cached;
        // Last resort for a navigation: serve the cached portal shell.
        if (req.mode === "navigate") {
          const shell = (await caches.match("/dashboard")) || (await caches.match("/admindashboard"));
          if (shell) return shell;
        }
        return new Response("Offline", { status: 503, statusText: "Offline" });
      })
  );
});
