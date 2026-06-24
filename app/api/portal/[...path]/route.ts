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

import { NextRequest } from "next/server";
import { randomBytes } from "crypto";
import * as db from "@/lib/portal/serverdb";
import { uploadToStorage } from "@/lib/portal/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIME: Record<string, string> = {
  glb: "model/gltf-binary", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp", svg: "image/svg+xml", gif: "image/gif", pdf: "application/pdf",
};

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json", ...CORS } });

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  const [head] = path;

  if (head === "health") return json({ ok: true });
  if (head === "clients") return json(await db.listClients());
  if (head === "leads") return json(await db.listLeads());
  if (head === "registered") return json({ registered: await db.isPhoneRegistered(req.nextUrl.searchParams.get("phone") || "") });
  if (head === "projects") {
    const uid = req.nextUrl.searchParams.get("uid");
    return json(uid ? await db.listForUser(uid) : await db.listAll());
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
    return u ? json(u) : json({ error: "invalid" }, 401);
  }
  if (head === "register") {
    try { return json(await db.registerCustomer(String(body.phone), String(body.name || ""), String(body.password || ""))); }
    catch (e) { return json({ error: (e as Error).message }, 409); }
  }
  if (head === "clients") {
    try { return json(await db.createClient(String(body.phone), String(body.name || ""), String(body.password || ""))); }
    catch (e) { return json({ error: (e as Error).message }, 409); }
  }
  if (head === "upload") {
    // body: { ext, dataBase64 } → stores in Firebase Storage, returns a public URL.
    const ext = String(body.ext || "bin").replace(/[^a-z0-9]/gi, "").toLowerCase();
    const name = `uploads/${randomBytes(8).toString("hex")}.${ext}`;
    try {
      const url = await uploadToStorage(name, Buffer.from(String(body.dataBase64 || ""), "base64"), MIME[ext] || "application/octet-stream");
      return json({ url });
    } catch (e) {
      return json({ error: "upload_failed", detail: (e as Error).message }, 500);
    }
  }
  if (head === "projects") return json(await db.upsertProject(body));
  if (head === "approve") { await db.approve(String(body.id)); return json({ ok: true }); }
  if (head === "stage") { await db.setStage(String(body.id), String(body.stage)); return json({ ok: true }); }
  if (head === "update") {
    await db.addUpdate(String(body.id), { text: String(body.text || ""), stageKey: body.stageKey, by: body.by, imageUrl: body.imageUrl });
    return json({ ok: true });
  }
  if (head === "update-delete") { await db.deleteUpdate(String(body.id), String(body.updateId)); return json({ ok: true }); }
  if (head === "leads") return json(await db.createLead({ name: String(body.name || ""), phone: String(body.phone || ""), message: body.message, planUrl: body.planUrl }));
  if (head === "lead-status") { await db.setLeadStatus(String(body.id), body.status); return json({ ok: true }); }
  if (head === "lead-to-puffer") { await db.sendLeadToPuffer(String(body.id), body.on !== false); return json({ ok: true }); }
  return json({ error: "not_found" }, 404);
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  if (path[0] === "projects" && path[1]) { await db.deleteProject(path[1]); return json({ ok: true }); }
  return json({ error: "not_found" }, 404);
}
