// Live portal backend — one catch-all handler for the whole sync API.
// Same-origin for the portal/admin UI; CORS-open so Puffer (a separate app on
// another port) can create clients + save designs into the same store.
//
// Routes:
//   GET    /api/portal/health
//   POST   /api/portal/signin            { phone, password }
//   GET    /api/portal/clients
//   POST   /api/portal/clients           { phone, name, password }
//   GET    /api/portal/projects?uid=...  (omit uid for all)
//   POST   /api/portal/projects          (Project)
//   DELETE /api/portal/projects/:id
//   POST   /api/portal/approve           { id }
//   GET    /api/portal/events            (text/event-stream — realtime)
//
//   Desktop-app licences (Evora Studio .exe / .dmg) — see lib/portal/licenses.ts
//   GET    /api/portal/licenses                    (admin)
//   POST   /api/portal/licenses          { label, note, expiresAt }   (admin)
//   POST   /api/portal/license-revoke    { key, on }                  (admin)
//   POST   /api/portal/license-unbind    { key }                      (admin)
//   DELETE /api/portal/licenses/:key                                  (admin)
//   POST   /api/portal/license-activate  { key, machineId, machineName, appVersion }
//   POST   /api/portal/license-verify    { token, machineId }

import { NextRequest } from "next/server";
import { randomBytes } from "crypto";
import * as db from "@/lib/portal/serverdb";
import * as lic from "@/lib/portal/licenses";
import { uploadToStorage } from "@/lib/portal/admin";
import { scanDataToGLB } from "@/lib/portal/roomglb";
import { sessionFromRequest, issueToken, sessionCookie, clearCookie } from "@/lib/portal/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIME: Record<string, string> = {
  glb: "model/gltf-binary", usdz: "model/vnd.usdz+zip", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp", svg: "image/svg+xml", gif: "image/gif", pdf: "application/pdf",
};

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const json = (data: unknown, status = 200, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS, ...extra },
  });

// ---- authorisation --------------------------------------------------------
// These endpoints return customer PII (names, phones, emails, floor plans) and
// used to be readable by anyone on the internet. They are now gated on the
// httpOnly session cookie issued at sign-in.
//
// Scope note: only the READS are gated. The POST paths stay open on purpose —
// POST /leads is the public contact form, and POST /upload + POST /projects are
// what the SHIPPED EvoraScan iOS app calls (verified against EvoraAPI.swift;
// it never GETs any of these). Gating those would brick an app that can only be
// fixed by an App Store resubmit.
const deny = () => json({ error: "unauthorized" }, 401);

// The absolute origin the *client* actually connected to (Host header), so local
// upload URLs are reachable from the phone. `req.nextUrl.origin` would give the
// server bind address (e.g. 0.0.0.0), which is not routable.
const clientOrigin = (req: NextRequest): string => {
  const host = req.headers.get("host");
  if (!host) return req.nextUrl.origin;
  const proto = req.headers.get("x-forwarded-proto") || req.nextUrl.protocol.replace(":", "") || "http";
  return `${proto}://${host}`;
};

/* ---- licence activation throttle -----------------------------------------
   `license-activate` is necessarily unauthenticated — it IS the front door of
   the desktop app. A 100-bit key space makes guessing hopeless, but an
   unbounded endpoint is still free CPU for anyone who finds it, so failures
   are capped per client IP over a rolling window. Successes don't count, so a
   real machine re-activating never gets locked out. In-memory on purpose:
   this is a single Node process (see localdb.ts) and losing the counters on
   restart is not a meaningful weakening. */
const FAILS = new Map<string, { n: number; until: number }>();
const FAIL_LIMIT = 10;
const FAIL_WINDOW_MS = 10 * 60 * 1000;

const clientIp = (req: NextRequest) =>
  (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
  req.headers.get("x-real-ip") ||
  "unknown";

function throttled(ip: string): boolean {
  const e = FAILS.get(ip);
  if (!e) return false;
  if (e.until < Date.now()) { FAILS.delete(ip); return false; }
  return e.n >= FAIL_LIMIT;
}
function noteFailure(ip: string) {
  const now = Date.now();
  const e = FAILS.get(ip);
  if (!e || e.until < now) FAILS.set(ip, { n: 1, until: now + FAIL_WINDOW_MS });
  else e.n += 1;
  // Bound the map so a spray of spoofed X-Forwarded-For values can't grow it
  // without limit.
  if (FAILS.size > 5000) for (const [k, v] of FAILS) if (v.until < now) FAILS.delete(k);
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  const [head] = path;

  if (head === "health") return json({ ok: true });

  const session = await sessionFromRequest(req);
  const isAdmin = session?.role === "admin";

  if (head === "me") return session ? json({ uid: session.uid, role: session.role }) : deny();
  if (head === "clients") return isAdmin ? json(await db.listClients()) : deny();
  if (head === "licenses") return isAdmin ? json(await lic.listLicenses()) : deny();
  if (head === "leads") return isAdmin ? json(await db.listLeads()) : deny();
  if (head === "subscribers") return isAdmin ? json(await db.listSubscribers()) : deny();
  if (head === "registered") return json({ registered: await db.isPhoneRegistered(req.nextUrl.searchParams.get("phone") || "") });
  if (head === "projects") {
    const uid = req.nextUrl.searchParams.get("uid");
    // Admins see everything. A signed-in client sees only their OWN projects —
    // without this check anyone could enumerate uids and read other people's
    // rooms and scans.
    if (!uid) return isAdmin ? json(await db.listAll()) : deny();
    if (!session || (!isAdmin && session.uid !== uid)) return deny();
    return json(await db.listForUser(uid));
  }
  if (head === "events") {
    const stream = new ReadableStream({
      start(controller) {
        const enc = new TextEncoder();
        const send = (ev: string) => { try { controller.enqueue(enc.encode(`event: ${ev}\ndata: {}\n\n`)); } catch {} };
        send("ready");
        const off = db.onChange(() => send("change"));
        const ka = setInterval(() => { try { controller.enqueue(enc.encode(`: keepalive\n\n`)); } catch {} }, 25000);
        req.signal.addEventListener("abort", () => { off(); clearInterval(ka); try { controller.close(); } catch {} });
      },
    });
    return new Response(stream, {
      headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache, no-transform", Connection: "keep-alive", ...CORS },
    });
  }
  return json({ error: "not_found" }, 404);
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  const [head] = path;
  const body = await req.json().catch(() => ({}));

  if (head === "signin") {
    const u = await db.signIn(String(body.phone || body.identifier || ""), String(body.password || ""));
    if (!u) return json({ error: "invalid" }, 401);
    // Issue the httpOnly session the PII reads are gated on. The browser
    // callers are same-origin, so this cookie rides along automatically with
    // no client-side change.
    const token = await issueToken(u.uid, u.role || "client");
    return json(u, 200, { "Set-Cookie": sessionCookie(token) });
  }
  if (head === "signout") return json({ ok: true }, 200, { "Set-Cookie": clearCookie() });
  // Public on purpose — the newsletter form on the marketing site, same as
  // POST /leads. Validation + de-duplication happen in addSubscriber.
  if (head === "subscribe") {
    const r = await db.addSubscriber(String(body.email || ""));
    return r.ok ? json(r) : json({ error: "invalid_email" }, 400);
  }
  if (head === "register") {
    try {
      const u = await db.registerCustomer(String(body.phone), String(body.name || ""), String(body.password || ""));
      // Same session cookie as signin — without it a freshly-registered client
      // would hold a localStorage session with no cookie, get 401 on their very
      // first /dashboard projects call, and be bounced straight back to login.
      const token = await issueToken(u.uid, u.role || "client");
      return json(u, 200, { "Set-Cookie": sessionCookie(token) });
    }
    catch (e) { return json({ error: (e as Error).message }, 409); }
  }
  if (head === "clients") {
    // Staff-only: this mints an account with a password. Left open, anyone on
    // the internet could create client records. Customer SELF-registration is
    // the separate, deliberately-public `register` route above.
    if ((await sessionFromRequest(req))?.role !== "admin") return deny();
    try { return json(await db.createClient(String(body.phone), String(body.name || ""), String(body.password || ""))); }
    catch (e) { return json({ error: (e as Error).message }, 409); }
  }
  // ---- desktop-app licences ---------------------------------------------
  // Minting, revoking and unbinding are admin-only. Activation and
  // verification are open (the app has no staff session — it has a key), and
  // are throttled above.
  if (head === "licenses") {
    const s = await sessionFromRequest(req);
    if (s?.role !== "admin") return deny();
    if (!String(body.label || "").trim()) return json({ error: "label_required" }, 400);
    return json(await lic.createLicense({
      label: String(body.label),
      note: body.note ? String(body.note) : undefined,
      expiresAt: body.expiresAt ? Number(body.expiresAt) : null,
      by: s.uid,
    }));
  }
  if (head === "license-revoke") {
    if ((await sessionFromRequest(req))?.role !== "admin") return deny();
    const ok = await lic.setRevoked(String(body.key || ""), body.on !== false);
    return ok ? json({ ok: true }) : json({ error: "not_found" }, 404);
  }
  if (head === "license-unbind") {
    if ((await sessionFromRequest(req))?.role !== "admin") return deny();
    const ok = await lic.unbind(String(body.key || ""));
    return ok ? json({ ok: true }) : json({ error: "not_found" }, 404);
  }
  if (head === "license-activate" || head === "license-verify") {
    const ip = clientIp(req);
    if (throttled(ip)) return json({ ok: false, reason: "too_many_attempts" }, 429);
    const r = head === "license-activate"
      ? await lic.activate({
          key: String(body.key || ""),
          machineId: String(body.machineId || ""),
          machineName: body.machineName ? String(body.machineName) : undefined,
          appVersion: body.appVersion ? String(body.appVersion) : undefined,
        })
      : await lic.verify({ token: String(body.token || ""), machineId: String(body.machineId || "") });
    if (!r.ok) { noteFailure(ip); return json(r, 403); }
    return json(r);
  }

  if (head === "upload") {
    // body: { ext, dataBase64 } → stores in Firebase Storage, returns a public URL.
    // Deliberately unauthenticated: the shipped EvoraScan iOS app POSTs here and
    // can only be changed via an App Store resubmit. Bounded instead by a size
    // and type limit, which evoraproj.md lists as an open risk ("no upload size
    // limits — a stray huge upload could exhaust disk/memory").
    const ext = String(body.ext || "bin").replace(/[^a-z0-9]/gi, "").toLowerCase();
    const b64 = String(body.dataBase64 || "");
    const MAX_UPLOAD = 25 * 1024 * 1024; // 25MB decoded — a LiDAR USDZ can be large
    if (b64.length * 0.75 > MAX_UPLOAD) return json({ error: "too_large", max: MAX_UPLOAD }, 413);
    if (!MIME[ext]) return json({ error: "unsupported_type", ext }, 415);
    const name = `uploads/${randomBytes(8).toString("hex")}.${ext}`;
    try {
      const url = await uploadToStorage(name, Buffer.from(String(body.dataBase64 || ""), "base64"), MIME[ext] || "application/octet-stream", clientOrigin(req));
      return json({ url });
    } catch (e) {
      return json({ error: "upload_failed", detail: (e as Error).message }, 500);
    }
  }
  if (head === "projects") {
    // A LiDAR scan uploads a .usdz (great for iOS AR) but that can't render
    // inline in a browser. When we have room geometry but no web model yet,
    // build a .glb from the scan so the 3D tab shows a spinnable room anywhere.
    if (body && typeof body.scanData === "string" && !body.model3dUrl) {
      try {
        const scan = JSON.parse(body.scanData);
        if (scan && Array.isArray(scan.walls) && scan.walls.length) {
          const glb = scanDataToGLB(scan);
          const name = `uploads/${randomBytes(8).toString("hex")}.glb`;
          body.model3dUrl = await uploadToStorage(name, glb, MIME.glb, clientOrigin(req));
        }
      } catch { /* non-fatal — falls back to usdz / AR-only */ }
    }
    return json(await db.upsertProject(body));
  }
  if (head === "approve") { await db.approve(String(body.id)); return json({ ok: true }); }
  if (head === "stage") { await db.setStage(String(body.id), String(body.stage)); return json({ ok: true }); }
  if (head === "update") {
    await db.addUpdate(String(body.id), { text: String(body.text || ""), stageKey: body.stageKey, by: body.by, imageUrl: body.imageUrl });
    return json({ ok: true });
  }
  if (head === "update-delete") { await db.deleteUpdate(String(body.id), String(body.updateId)); return json({ ok: true }); }
  if (head === "leads") return json(await db.createLead({ name: String(body.name || ""), phone: String(body.phone || ""), email: body.email, message: body.message, planUrl: body.planUrl }));
  if (head === "lead-status") { await db.setLeadStatus(String(body.id), body.status); return json({ ok: true }); }
  if (head === "lead-to-puffer") { await db.sendLeadToPuffer(String(body.id), body.on !== false); return json({ ok: true }); }
  return json({ error: "not_found" }, 404);
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  if (path[0] === "projects" && path[1]) { await db.deleteProject(path[1]); return json({ ok: true }); }
  if (path[0] === "licenses" && path[1]) {
    if ((await sessionFromRequest(req))?.role !== "admin") return deny();
    const ok = await lic.deleteLicense(decodeURIComponent(path[1]));
    return ok ? json({ ok: true }) : json({ error: "not_found" }, 404);
  }
  return json({ error: "not_found" }, 404);
}
