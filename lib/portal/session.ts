/* ============================================================================
   EVORA — portal session tokens

   Why this exists: /api/portal/{clients,leads,projects} served every
   customer's name, phone, email and floor-plan URL to anyone on the internet,
   from any origin (the handler is CORS-open with Access-Control-Allow-Origin:
   *). There was no auth of any kind in the codebase — signIn() just returned
   the user object as JSON and the browser kept it in localStorage, which the
   server never sees.

   The design constraints that shaped this:

     - The EvoraScan iOS app is SHIPPED and can only be changed via an App
       Store resubmit. It POSTs `upload` and `projects` and never GETs any of
       the PII endpoints (verified against EvoraAPI.swift), so gating the READS
       cannot break it. Nothing here touches the POST paths it uses.
     - The three in-app callers (admin dashboard, CloudPanel, PufferImport) are
       all same-origin browser code going through lib/portal/store.ts, where
       API_BASE is empty on the self-hosted server. A same-origin fetch sends
       cookies by default, so an httpOnly cookie needs no client rewrite.
     - The public lead form (POST /leads) must stay open — that is the contact
       form on the marketing site.

   Tokens are stateless and HMAC-signed, so verifying one costs no DB read:
       base64url({uid,role,exp}) . base64url(HMAC-SHA256(payload, secret))
   ========================================================================== */

import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { rtdb } from "./admin";

export type Session = { uid: string; role: string; exp: number };

export const SESSION_COOKIE = "evora_session";
const MAX_AGE_SEC = 60 * 60 * 24 * 30; // 30 days

const b64url = (b: Buffer) => b.toString("base64url");

/* The signing secret. Prefer an env var; otherwise generate once and persist
   it in the JSON DB so it survives restarts. A hardcoded fallback would make
   every deployment forgeable, so there deliberately isn't one. */
let cachedSecret: string | null = null;
async function secret(): Promise<string> {
  if (cachedSecret) return cachedSecret;
  const fromEnv = process.env.EVORA_SESSION_SECRET;
  if (fromEnv && fromEnv.length >= 16) {
    cachedSecret = fromEnv;
    return cachedSecret;
  }
  // localdb's ref().get() resolves to a Firebase-style snapshot: { val() }.
  const ref = rtdb().ref("config/sessionSecret");
  const snap = await ref.get();
  const val = snap?.val();
  if (typeof val === "string" && val.length >= 16) {
    cachedSecret = val;
    return cachedSecret;
  }
  const generated = randomBytes(32).toString("hex");
  await ref.set(generated);
  cachedSecret = generated;
  return cachedSecret;
}

const sign = (payload: string, key: string) =>
  b64url(createHmac("sha256", key).update(payload).digest());

export async function issueToken(uid: string, role: string): Promise<string> {
  const key = await secret();
  const body: Session = { uid, role, exp: Math.floor(Date.now() / 1000) + MAX_AGE_SEC };
  const payload = b64url(Buffer.from(JSON.stringify(body)));
  return `${payload}.${sign(payload, key)}`;
}

export async function verifyToken(token: string | undefined | null): Promise<Session | null> {
  if (!token || typeof token !== "string") return null;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;
  const payload = token.slice(0, dot);
  const mac = token.slice(dot + 1);
  const key = await secret();
  const expected = sign(payload, key);
  // Constant-time compare — a length-varying early return would leak the MAC
  // one byte at a time to a patient attacker.
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const s = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as Session;
    if (!s || typeof s.uid !== "string" || typeof s.exp !== "number") return null;
    if (s.exp * 1000 < Date.now()) return null;
    return s;
  } catch {
    return null;
  }
}

/* Read the cookie straight off the request header. Deliberately not using
   next/headers cookies() so this stays usable from the plain Request the
   catch-all route handler already receives. */
export function tokenFromRequest(req: { headers: { get(name: string): string | null } }): string | null {
  const raw = req.headers.get("cookie");
  if (!raw) return null;
  for (const part of raw.split(";")) {
    const eq = part.indexOf("=");
    if (eq < 0) continue;
    if (part.slice(0, eq).trim() === SESSION_COOKIE) return decodeURIComponent(part.slice(eq + 1).trim());
  }
  return null;
}

export async function sessionFromRequest(req: {
  headers: { get(name: string): string | null };
}): Promise<Session | null> {
  return verifyToken(tokenFromRequest(req));
}

export function sessionCookie(token: string): string {
  // `Secure` is safe here: the live site is HTTPS-only behind Caddy. SameSite
  // Lax keeps the cookie off cross-site requests, which is what makes the
  // CORS-open handler safe to leave open for the POST paths EvoraScan needs.
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE_SEC}${secure}`;
}

export function clearCookie(): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`;
}
