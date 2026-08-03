/* ============================================================================
   EVORA — desktop licences (server-only)

   The Evora Studio desktop app (the Windows .exe / macOS .dmg shell around
   /evora3dstudio) is distributed to staff and partners, so it needs a gate of
   its own: a licence key, minted by an admin in /admindashboard, bound to one
   machine on first activation.

   This does NOT replace the studio's admin sign-in. The key unlocks the app
   shell; the page inside still asks for the normal Evora staff credentials.
   Two independent gates, deliberately — a leaked .exe plus a leaked key still
   gets you nothing without a real account, and revoking a machine does not
   disturb anyone's login.

   Storage is the same local JSON DB everything else uses, under `licenses/`.

   Activation returns a stateless HMAC-signed token
       base64url({kid,mid,exp}) . base64url(HMAC-SHA256(payload, secret))
   which the app re-verifies on every launch. Verification is cheap but DOES
   read the record, because the whole point is that revoking a key on the
   server kills the app on the next launch (or the next successful check, if
   it has been running offline — see the app's grace window).
   ========================================================================== */

import { createHmac, randomBytes, timingSafeEqual, createHash } from "crypto";
import { rtdb } from "./admin";
import type { License, LicenseTokenPayload } from "./types";

const TOKEN_TTL_SEC = 60 * 60 * 24 * 30; // 30 days, refreshed on every check

const b64url = (b: Buffer) => b.toString("base64url");

/* Signing secret — same pattern as the portal session secret: env var first,
   otherwise generated once and persisted in the DB. No hardcoded fallback, so
   a deployment can never ship a forgeable key. Kept separate from the session
   secret so rotating one does not sign everybody out of the other. */
let cachedSecret: string | null = null;
async function secret(): Promise<string> {
  if (cachedSecret) return cachedSecret;
  const fromEnv = process.env.EVORA_LICENSE_SECRET;
  if (fromEnv && fromEnv.length >= 16) return (cachedSecret = fromEnv);
  const ref = rtdb().ref("config/licenseSecret");
  const val = (await ref.get())?.val();
  if (typeof val === "string" && val.length >= 16) return (cachedSecret = val);
  const generated = randomBytes(32).toString("hex");
  await ref.set(generated);
  return (cachedSecret = generated);
}

/* ---- key format ---------------------------------------------------------
   EVRA-XXXXX-XXXXX-XXXXX-XXXXX over Crockford's base32 alphabet, which drops
   I, L, O and U — the characters people mistype when reading a key off a
   screen or a printed handover sheet. 20 random symbols ≈ 100 bits.        */
const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

function generateKey(): string {
  const bytes = randomBytes(20);
  let out = "";
  for (let i = 0; i < 20; i++) {
    out += ALPHABET[bytes[i] % ALPHABET.length];
    if (i % 5 === 4 && i < 19) out += "-";
  }
  return `EVRA-${out}`;
}

/* Normalise anything a human might paste — lowercase, spaces, missing or
   extra dashes, the O/0 and I/1 confusions — into the canonical form used as
   the storage id. Without this, "evra 1a2b3c…" pasted from WhatsApp fails
   against a key that is genuinely correct. */
export function normalizeKey(raw: string): string {
  const cleaned = String(raw || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .replace(/O/g, "0")
    .replace(/[IL]/g, "1")
    .replace(/U/g, "V");
  // Strip the prefix ONLY when doing so leaves exactly a full body. Every
  // letter of "EVRA" is in the key alphabet, so a body can legitimately begin
  // with those four characters — an unconditional slice would corrupt roughly
  // one key in a million into a permanent "invalid key".
  const body = cleaned.length === 24 && cleaned.startsWith("EVRA") ? cleaned.slice(4) : cleaned;
  if (body.length !== 20) return "";
  return `EVRA-${body.slice(0, 5)}-${body.slice(5, 10)}-${body.slice(10, 15)}-${body.slice(15, 20)}`;
}

// The DB path segment. Dashes are fine in a JSON key, but the store splits on
// "/" so the id must not contain one — it can't, given the alphabet.
const pathFor = (key: string) => `licenses/${key}`;

/* ---- machine identity ---------------------------------------------------
   The app sends a fingerprint it derives locally; we only ever store a hash
   of it, so the DB never holds a raw MAC address. */
const hashMachine = (mid: string) =>
  createHash("sha256").update(`evora-machine:${String(mid || "")}`).digest("hex").slice(0, 32);

/* ---- admin operations --------------------------------------------------- */

export async function listLicenses(): Promise<License[]> {
  const all = (await rtdb().ref("licenses").get())?.val() as Record<string, License> | null;
  if (!all) return [];
  return Object.values(all).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

export async function createLicense(input: {
  label: string;
  note?: string;
  expiresAt?: number | null;
  by?: string;
}): Promise<License> {
  const key = generateKey();
  const lic: License = {
    key,
    label: String(input.label || "").trim() || "Evora Studio",
    note: String(input.note || "").trim() || undefined,
    createdAt: Date.now(),
    createdBy: input.by,
    expiresAt: input.expiresAt || undefined,
    revoked: false,
  };
  await rtdb().ref(pathFor(key)).set(lic);
  return lic;
}

async function get(key: string): Promise<License | null> {
  const norm = normalizeKey(key);
  if (!norm) return null;
  const v = (await rtdb().ref(pathFor(norm)).get())?.val() as License | null;
  return v || null;
}

export async function setRevoked(key: string, revoked: boolean): Promise<boolean> {
  const lic = await get(key);
  if (!lic) return false;
  await rtdb().ref(pathFor(lic.key)).update({ revoked, updatedAt: Date.now() });
  return true;
}

/* Free the bound machine so the same key can be re-activated on a different
   PC — the normal "Bakri got a new laptop" path. Deliberately an explicit
   admin action rather than something the app can do for itself, otherwise
   one-key-one-machine means nothing. */
export async function unbind(key: string): Promise<boolean> {
  const lic = await get(key);
  if (!lic) return false;
  await rtdb().ref(pathFor(lic.key)).update({
    machineHash: null,
    machineName: null,
    activatedAt: null,
    updatedAt: Date.now(),
  });
  return true;
}

export async function deleteLicense(key: string): Promise<boolean> {
  const lic = await get(key);
  if (!lic) return false;
  await rtdb().ref(pathFor(lic.key)).remove();
  return true;
}

/* ---- tokens ------------------------------------------------------------- */

async function issueToken(key: string, machineHash: string): Promise<string> {
  const body: LicenseTokenPayload = {
    kid: key,
    mid: machineHash,
    exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SEC,
  };
  const payload = b64url(Buffer.from(JSON.stringify(body)));
  const mac = b64url(createHmac("sha256", await secret()).update(payload).digest());
  return `${payload}.${mac}`;
}

async function readToken(token: string): Promise<LicenseTokenPayload | null> {
  if (!token || typeof token !== "string") return null;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;
  const payload = token.slice(0, dot);
  const expected = b64url(createHmac("sha256", await secret()).update(payload).digest());
  const a = Buffer.from(token.slice(dot + 1));
  const b = Buffer.from(expected);
  // Constant-time — a length-varying early return leaks the MAC byte by byte.
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const p = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as LicenseTokenPayload;
    if (!p || typeof p.kid !== "string" || typeof p.mid !== "string" || typeof p.exp !== "number") return null;
    if (p.exp * 1000 < Date.now()) return null;
    return p;
  } catch {
    return null;
  }
}

/* ---- app-facing operations ---------------------------------------------- */

export type LicenseFailure =
  | "invalid_key"
  | "revoked"
  | "expired"
  | "machine_mismatch"
  | "invalid_token";

export type LicenseResult =
  | { ok: true; token: string; license: PublicLicense }
  | { ok: false; reason: LicenseFailure };

// What the desktop app is allowed to see — never the whole record.
export type PublicLicense = {
  label: string;
  expiresAt?: number;
  activatedAt?: number;
  machineName?: string;
};

const publicView = (l: License): PublicLicense => ({
  label: l.label,
  expiresAt: l.expiresAt,
  // `?? undefined` because unbind() writes nulls to clear the binding.
  activatedAt: l.activatedAt ?? undefined,
  machineName: l.machineName ?? undefined,
});

function check(lic: License): LicenseFailure | null {
  if (lic.revoked) return "revoked";
  if (lic.expiresAt && lic.expiresAt < Date.now()) return "expired";
  return null;
}

/** First run on a machine: bind the key to it and hand back a token. */
export async function activate(input: {
  key: string;
  machineId: string;
  machineName?: string;
  appVersion?: string;
}): Promise<LicenseResult> {
  const lic = await get(input.key);
  if (!lic) return { ok: false, reason: "invalid_key" };
  const bad = check(lic);
  if (bad) return { ok: false, reason: bad };

  const mid = hashMachine(input.machineId);
  if (!input.machineId) return { ok: false, reason: "machine_mismatch" };
  if (lic.machineHash && lic.machineHash !== mid) return { ok: false, reason: "machine_mismatch" };

  const now = Date.now();
  const patch: Partial<License> = {
    machineHash: mid,
    machineName: String(input.machineName || "").slice(0, 80) || lic.machineName,
    activatedAt: lic.activatedAt || now,
    lastSeenAt: now,
    appVersion: String(input.appVersion || "").slice(0, 24) || lic.appVersion,
    updatedAt: now,
  };
  await rtdb().ref(pathFor(lic.key)).update(patch as Record<string, unknown>);
  return { ok: true, token: await issueToken(lic.key, mid), license: publicView({ ...lic, ...patch }) };
}

/** Every launch: re-check a stored token against the live record. */
export async function verify(input: { token: string; machineId: string }): Promise<LicenseResult> {
  const p = await readToken(input.token);
  if (!p) return { ok: false, reason: "invalid_token" };
  if (hashMachine(input.machineId) !== p.mid) return { ok: false, reason: "machine_mismatch" };

  const lic = await get(p.kid);
  if (!lic) return { ok: false, reason: "invalid_key" };
  const bad = check(lic);
  if (bad) return { ok: false, reason: bad };
  if (lic.machineHash && lic.machineHash !== p.mid) return { ok: false, reason: "machine_mismatch" };

  await rtdb().ref(pathFor(lic.key)).update({ lastSeenAt: Date.now() });
  // Rolling renewal: a machine that checks in at least monthly never expires.
  return { ok: true, token: await issueToken(lic.key, p.mid), license: publicView(lic) };
}
