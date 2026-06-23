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
import * as db from "@/lib/portal/serverdb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
    const u = await db.signIn(String(body.phone || ""), String(body.password || ""));
    return u ? json(u) : json({ error: "invalid" }, 401);
  }
  if (head === "clients") {
    try {
      const u = await db.createClient(String(body.phone), String(body.name || ""), String(body.password || ""));
      return json(u);
    } catch (e) {
      return json({ error: (e as Error).message }, 409);
    }
  }
  if (head === "projects") return json(await db.upsertProject(body));
  if (head === "approve") { await db.approve(String(body.id)); return json({ ok: true }); }
  return json({ error: "not_found" }, 404);
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  if (path[0] === "projects" && path[1]) { await db.deleteProject(path[1]); return json({ ok: true }); }
  return json({ error: "not_found" }, 404);
}
