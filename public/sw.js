/* Evora Client Portal — offline service worker.
 *
 * SCOPE WARNING (this caused a real outage — read before changing):
 * This file lives at the site root, so its registration scope is "/" and it
 * therefore controls EVERY page on the domain, not just the portal it was
 * written for. That was never intended. Combined with the fetch handler below
 * manufacturing a 503 "Offline" response for any navigation it could neither
 * fetch nor find in cache, one failed navigation on the marketing site turned
 * into Chrome's "This page couldn't load" — a hard, unrecoverable-looking
 * error on a site that was actually up and serving 200s.
 *
 * So this worker now deliberately DOES NOTHING outside the portal:
 *   - it only handles /dashboard, /admindashboard, /portal, /login, /join
 *   - every other request (the whole marketing site) passes straight through,
 *     untouched, exactly as if no service worker were installed
 *   - it never manufactures an error response for a marketing-site navigation
 *
 * Strategy inside the portal: NETWORK-FIRST with a cache fallback, so the live
 * app is never served stale assets while online, but the portal still works
 * offline from whatever was cached on a previous online visit.
 */

const CACHE = "evora-portal-v3";
// Every entry must actually exist: cache.addAll() is all-or-nothing, so one
// 404 threw away the whole precache. "/icon.svg" was such a 404 (the icons live
// under /icons/), which meant NOTHING was ever precached — including the
// manifest this list exists to guarantee offline.
const PRECACHE = ["/portal.webmanifest", "/admin.webmanifest", "/icons/evora-192.png", "/icons/evora-512.png"];

// The only paths this worker is allowed to touch.
const PORTAL_PREFIXES = ["/dashboard", "/admindashboard", "/portal", "/login", "/join"];
const isPortalPath = (pathname) =>
  PORTAL_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(PRECACHE))
      .catch(() => {})           // a missing precache asset must never block activation
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      // Drop every older cache, including the v2 one that may still hold stale
      // marketing-site HTML pointing at build chunks that no longer exist.
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  let url;
  try { url = new URL(req.url); } catch { return; }

  // Same-origin only — never touch cross-origin (CDNs, OneSignal, fonts).
  if (url.origin !== self.location.origin) return;

  // Never intercept the live API or an SSE stream (buffering an event-stream
  // breaks realtime), and stay out of Next.js dev/HMR traffic.
  if (url.pathname.startsWith("/api/")) return;
  if (req.headers.get("accept") === "text/event-stream") return;
  if (url.pathname.startsWith("/_next/webpack-hmr") || url.pathname.includes("__nextjs")) return;

  // THE IMPORTANT PART: anything outside the portal is none of this worker's
  // business. Returning without calling respondWith() means the browser handles
  // the request exactly as it would with no service worker at all.
  let portalRequest = isPortalPath(url.pathname);
  if (!portalRequest && req.mode !== "navigate" && req.referrer) {
    // Sub-resources (chunks, images) requested BY a portal page.
    try { portalRequest = isPortalPath(new URL(req.referrer).pathname); } catch { /* ignore */ }
  }
  if (!portalRequest) return;

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
        if (req.mode === "navigate") {
          const shell = (await caches.match("/dashboard")) || (await caches.match("/admindashboard"));
          if (shell) return shell;
        }
        // Only ever reached for a genuinely offline PORTAL request now.
        return new Response("Offline", { status: 503, statusText: "Offline" });
      })
  );
});
