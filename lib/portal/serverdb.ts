// Server-side store backed by Firebase Realtime Database (Admin SDK).
// The single source of truth for the whole platform: staff/customer accounts,
// projects + their journey, timeline updates, and homepage leads. Realtime is
// driven both by our own writes and by an RTDB listener (so external changes
// also push to connected clients). Server-only — never import on the client.

import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { EventEmitter } from "events";
import { removeStoredFile, rtdb, storedFileSize } from "./admin";
import { notifyAdmins, notifyUsers } from "./notify";
import { stageByIndex, stageIndex } from "./journey";
import type { Lead, LeadStatus, PortalUser, Project, ProjectUpdate, Role, StoredUpload } from "./types";

type StoredUser = PortalUser & { password?: string };

const g = globalThis as unknown as { __evoraBus?: EventEmitter; __evoraWatch?: boolean };
function bus(): EventEmitter {
  if (!g.__evoraBus) { g.__evoraBus = new EventEmitter(); g.__evoraBus.setMaxListeners(500); }
  return g.__evoraBus;
}

// Any mutation: ping the in-process SSE bus AND bump a tiny public /meta/rev
// flag in RTDB. Clients subscribe to /meta/rev directly via Firebase → instant
// realtime everywhere (works on Vercel serverless, where held SSE does not).
function touched() {
  bus().emit("change");
  rtdb().ref("meta/rev").set(Date.now()).catch(() => {});
}

// Push to the studio: target admin accounts by uid (no segment setup needed),
// plus the "Admins" segment as a fallback.
async function notifyStaff(title: string, message: string, url = "/admindashboard") {
  try {
    const uids = (await allUsers()).filter((u) => u.role === "admin").map((u) => u.uid);
    if (uids.length) await notifyUsers(uids, title, message, url);
  } catch { /* ignore */ }
  notifyAdmins(title, message, url);
}

// ---- helpers --------------------------------------------------------------

const norm = (s: string) => { const d = (s || "").replace(/[^\d]/g, ""); return d.length ? d : (s || "").trim().toLowerCase(); };
const emailNorm = (s: string) => (s || "").trim().toLowerCase();

function hashPw(pw: string): string {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(pw, salt, 32).toString("hex")}`;
}
function verifyPw(pw: string, stored?: string): boolean {
  if (!stored || !stored.includes(":")) return false;
  const [salt, hash] = stored.split(":");
  const a = Buffer.from(hash, "hex");
  const b = scryptSync(pw, salt, 32);
  return a.length === b.length && timingSafeEqual(a, b);
}
const strip = (u: StoredUser): PortalUser => ({ uid: u.uid, phone: u.phone, email: u.email, name: u.name, role: u.role });
// RTDB rejects `undefined` values — drop them (and any functions) before writing.
const clean = <T>(o: T): T => JSON.parse(JSON.stringify(o));

async function allUsers(): Promise<StoredUser[]> {
  const snap = await rtdb().ref("users").get();
  const v = snap.val() || {};
  return Object.values(v) as StoredUser[];
}
async function allProjects(): Promise<Project[]> {
  const snap = await rtdb().ref("projects").get();
  const v = snap.val() || {};
  return Object.values(v) as Project[];
}

// NOTE: we deliberately do NOT attach persistent RTDB `.on("value")` listeners
// on the full projects/leads/users nodes anymore. On Vercel every serverless
// instance is its own process, so each cold start attached three new listeners
// that re-downloaded the entire dataset on every change and never got torn
// down — billable RTDB egress for no benefit. Realtime is already handled by
// `touched()` bumping the tiny public /meta/rev flag, which every client
// subscribes to directly via Firebase (see lib/portal/realtime.ts onRev). The
// in-process `bus` still serves same-instance SSE clients (the fallback path).
function ensureWatch() {
  g.__evoraWatch = true; // kept for callers; no RTDB listeners attached
}

// ---- bootstrap ------------------------------------------------------------

const ADMIN_EMAIL = "bakri@evorahome.online";
const ADMIN_UID = "staff-bakri";

/* First-run seed of the studio's admin account.
   This used to bake a literal password into source. The GitHub repo is public,
   so that string was world-readable AND authenticated against production —
   anyone who read the file owned the dashboard. It is gone; there is no
   fallback literal on purpose.

   Now:
     - `EVORA_ADMIN_BOOTSTRAP_PASSWORD` (>= 8 chars) is used if set;
     - otherwise a strong random password is generated and printed to the
       server console ONCE, for the operator to copy out of the service log.

   The seed still only fires when no account with ADMIN_EMAIL exists, so a
   deployment that already has the account (i.e. production) is never touched
   and nobody is locked out. Rotating an EXISTING password is a separate,
   deliberate act — see scripts/rotate-admin-password.mjs. */
export async function bootstrap(): Promise<void> {
  ensureWatch();
  const users = await allUsers();
  // Account already exists → leave it completely alone. Never reset a live
  // password as a side effect of a process start.
  if (users.some((u) => emailNorm(u.email || "") === ADMIN_EMAIL)) return;

  const fromEnv = (process.env.EVORA_ADMIN_BOOTSTRAP_PASSWORD || "").trim();
  const useEnv = fromEnv.length >= 8;
  const pw = useEnv ? fromEnv : randomBytes(18).toString("base64url");

  await rtdb().ref(`users/${ADMIN_UID}`).set(clean({
    uid: ADMIN_UID, phone: "", email: ADMIN_EMAIL, name: "Bakri", role: "admin", password: hashPw(pw),
  }));

  if (useEnv) {
    console.warn(`[evora] Seeded admin ${ADMIN_EMAIL} from EVORA_ADMIN_BOOTSTRAP_PASSWORD.`);
  } else {
    if (fromEnv.length) console.warn("[evora] EVORA_ADMIN_BOOTSTRAP_PASSWORD is set but shorter than 8 characters — ignored.");
    console.warn(
      `\n[evora] ================= ONE-TIME ADMIN PASSWORD =================\n` +
      `[evora]   ${ADMIN_EMAIL}\n` +
      `[evora]   ${pw}\n` +
      `[evora] Shown ONCE. Store it in a password manager, then rotate it.\n` +
      `[evora] Set EVORA_ADMIN_BOOTSTRAP_PASSWORD to choose it yourself.\n` +
      `[evora] ===========================================================\n`
    );
  }
}

// ---- auth -----------------------------------------------------------------

export async function signIn(identifier: string, password: string): Promise<PortalUser | null> {
  await bootstrap();
  const id = identifier.trim();
  const users = await allUsers();
  const u = users.find((x) =>
    (x.email && emailNorm(x.email) === emailNorm(id)) || (x.phone && norm(x.phone) === norm(id))
  );
  if (!u || !verifyPw(password, u.password)) return null;
  return strip(u);
}

// Customer self-registration via the link an employee shares. Links any
// projects already assigned to this phone number to the new account.
export async function registerCustomer(phone: string, name: string, password: string): Promise<PortalUser> {
  await bootstrap();
  const users = await allUsers();
  const existing = users.find((x) => x.phone && norm(x.phone) === norm(phone));
  if (existing?.password) throw new Error("ALREADY_REGISTERED");
  const uid = existing?.uid || "u" + norm(phone);
  const user: StoredUser = { uid, phone, name: name || existing?.name || "", role: "client", password: hashPw(password) };
  await rtdb().ref(`users/${uid}`).set(clean(user));
  // back-link existing projects assigned by phone
  const projects = await allProjects();
  await Promise.all(projects.filter((p) => norm(p.ownerPhone || "") === norm(phone) && p.ownerUid !== uid)
    .map((p) => rtdb().ref(`projects/${p.id}/ownerUid`).set(uid)));
  touched();
  return strip(user);
}

// Staff creates a client account directly (from Puffer / admin).
export async function createClient(phone: string, name: string, password: string): Promise<PortalUser> {
  return registerCustomer(phone, name, password);
}

export async function isPhoneRegistered(phone: string): Promise<boolean> {
  const users = await allUsers();
  return users.some((x) => x.phone && norm(x.phone) === norm(phone) && !!x.password);
}

// ---- people ---------------------------------------------------------------

export async function listClients(): Promise<PortalUser[]> {
  return (await allUsers()).filter((u) => u.role === "client").map(strip);
}

// ---- projects -------------------------------------------------------------

export async function listAll(): Promise<Project[]> {
  return (await allProjects()).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
}

export async function listForUser(uid: string): Promise<Project[]> {
  const users = await allUsers();
  const me = users.find((u) => u.uid === uid);
  const phone = me?.phone ? norm(me.phone) : null;
  return (await allProjects())
    .filter((p) => p.ownerUid === uid || (phone && norm(p.ownerPhone || "") === phone))
    .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
}

export async function upsertProject(p: Project): Promise<Project> {
  const id = p.id || "p" + randomBytes(6).toString("hex");
  const existing = (await rtdb().ref(`projects/${id}`).get()).val() as Project | null;
  const stamped: Project = {
    ...existing, ...p, id,
    stage: p.stage || existing?.stage || "blueprint",
    status: p.status || existing?.status || "draft",
    updates: p.updates || existing?.updates || [],
    createdAt: existing?.createdAt || p.createdAt || Date.now(),
    updatedAt: Date.now(),
  };
  await rtdb().ref(`projects/${id}`).set(clean(stamped));
  touched();
  // New project saved (e.g. from Puffer) → tell the studio.
  if (!existing) notifyStaff("New design saved", `${stamped.title || "Untitled"} for ${stamped.ownerName || stamped.ownerPhone || "a customer"}`);
  return stamped;
}

export async function getProject(id: string): Promise<Project | null> {
  if (!id) return null;
  return ((await rtdb().ref(`projects/${id}`).get()).val() as Project | null) || null;
}

/* Does this (non-admin) user own the project? Mirrors listForUser: a project is
   theirs by ownerUid, or by phone number when staff assigned it before the
   customer registered. Used to gate the one mutation a customer is allowed to
   make on their own record — approving a design. */
export async function userOwnsProject(uid: string, p: Project): Promise<boolean> {
  if (p.ownerUid && p.ownerUid === uid) return true;
  if (!p.ownerPhone) return false;
  const me = (await allUsers()).find((u) => u.uid === uid);
  return !!(me?.phone && norm(me.phone) === norm(p.ownerPhone));
}

export async function deleteProject(id: string): Promise<boolean> {
  const ref = rtdb().ref(`projects/${id}`);
  if (!(await ref.get()).val()) return false;
  await ref.remove();
  touched();
  return true;
}

/* NOTE on the `false` returns below: `update()` on a path that does not exist
   CREATES it (both in RTDB and in localdb.ts). Without a read first, a request
   naming a bogus id minted a phantom `projects/NOPE` / `leads/NOPE` row that
   then rendered as a ghost card in the dashboard. Every one of these now reads
   before it writes and the route turns `false` into a 404. */
export async function approve(id: string): Promise<boolean> {
  const ref = rtdb().ref(`projects/${id}`);
  if (!(await ref.get()).val()) return false;
  await ref.update({ approvedByClient: true, updatedAt: Date.now() });
  touched();
  return true;
}

export async function setStage(id: string, stage: string): Promise<boolean> {
  const ref = rtdb().ref(`projects/${id}`);
  const proj = (await ref.get()).val() as Project | null;
  if (!proj) return false;
  await ref.update({ stage, updatedAt: Date.now() });
  touched();
  if (proj.ownerUid) {
    const label = stageByIndex(stageIndex(stage)).en;
    notifyUsers([proj.ownerUid], proj.title || "Your Evora project", `Moved to: ${label}`);
  }
  return true;
}

export async function addUpdate(id: string, u: Omit<ProjectUpdate, "id" | "at">): Promise<boolean> {
  const ref = rtdb().ref(`projects/${id}`);
  const proj = (await ref.get()).val() as Project | null;
  if (!proj) return false;
  const updates = proj.updates || [];
  updates.unshift({ id: randomBytes(5).toString("hex"), at: Date.now(), ...u });
  await ref.update(clean({ updates, updatedAt: Date.now() }));
  touched();
  if (proj.ownerUid) notifyUsers([proj.ownerUid], proj.title || "Your Evora project", u.text || "New update", "/dashboard");
  return true;
}

export async function deleteUpdate(id: string, updateId: string): Promise<boolean> {
  const ref = rtdb().ref(`projects/${id}`);
  const proj = (await ref.get()).val() as Project | null;
  if (!proj) return false;
  await ref.update(clean({ updates: (proj.updates || []).filter((u) => u.id !== updateId), updatedAt: Date.now() }));
  touched();
  return true;
}

// ---- leads ----------------------------------------------------------------

export async function createLead(lead: Omit<Lead, "id" | "status" | "createdAt">): Promise<Lead> {
  const id = "l" + randomBytes(6).toString("hex");
  const full: Lead = { ...lead, id, status: "new", createdAt: Date.now() };
  await rtdb().ref(`leads/${id}`).set(clean(full));
  touched();
  notifyStaff("New design request 🏠", `${full.name || "Someone"} · ${full.phone}`);
  return full;
}

export async function listLeads(): Promise<Lead[]> {
  const snap = await rtdb().ref("leads").get();
  return (Object.values(snap.val() || {}) as Lead[]).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

// Newsletter subscribers. Keyed by a hash of the email so re-subscribing the
// same address is idempotent (no duplicate rows) rather than piling up.
export async function addSubscriber(email: string): Promise<{ ok: boolean }> {
  const e = (email || "").trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) return { ok: false };
  const key = scryptSync(e, "evora-sub", 8).toString("hex");
  const existing = (await rtdb().ref(`subscribers/${key}`).get()).val();
  await rtdb().ref(`subscribers/${key}`).set(clean({
    email: e,
    createdAt: (existing as { createdAt?: number } | null)?.createdAt || Date.now(),
  }));
  touched();
  if (!existing) notifyStaff("New newsletter subscriber ✉️", e);
  return { ok: true };
}

export async function listSubscribers(): Promise<{ email: string; createdAt: number }[]> {
  const snap = await rtdb().ref("subscribers").get();
  return (Object.values(snap.val() || {}) as { email: string; createdAt: number }[])
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

// Remove a request for good. The studio needs this to clear out spam and the
// junk rows left by testing — without it the leads board is unusable as a
// to-do list, because "New" never goes away and the badge always lies.
export async function deleteLead(id: string): Promise<void> {
  await rtdb().ref(`leads/${id}`).remove();
  touched();
}

export async function setLeadStatus(id: string, status: LeadStatus): Promise<boolean> {
  const ref = rtdb().ref(`leads/${id}`);
  if (!(await ref.get()).val()) return false;
  await ref.update({ status, updatedAt: Date.now() });
  touched();
  return true;
}

export async function sendLeadToPuffer(id: string, on = true): Promise<boolean> {
  const ref = rtdb().ref(`leads/${id}`);
  if (!(await ref.get()).val()) return false;
  await ref.update({ sentToPuffer: on, updatedAt: Date.now() });
  touched();
  if (on) notifyStaff("2D plan queued for Puffer", "A design request is ready to import in /evora3dstudio");
  return true;
}

/* ---- the studio's file drawer --------------------------------------------
   /admindashboard → Files. Bakri keeps anything here — catalogues, price
   sheets, contracts, renders, CAD, video — and hands a customer the link.
   The bytes themselves already went through POST /api/portal/upload (the same
   pipeline as every other attachment); these rows are just the index that
   makes them findable, copyable and — the part that did not exist before —
   deletable. */

/* Ids are minted right here — "f" + 12 hex — and every id that comes back in
   over the wire is checked against that shape before it is interpolated into a
   DB path. Without this a crafted id containing "/" or ".." would be split by
   localdb's `segs()` into a multi-segment path and address a node OUTSIDE
   uploads/ (`uploads/../users/staff-bakri`). It happens to be harmless today
   because `getAt()` bails on the first missing key and ".." is never a real
   key — but that is an accident of the traversal implementation, not a
   guarantee, and this is the one endpoint that deletes things. */
const UPLOAD_ID = /^f[0-9a-f]{12}$/;

export async function listUploads(): Promise<StoredUpload[]> {
  const snap = await rtdb().ref("uploads").get();
  return (Object.values(snap.val() || {}) as StoredUpload[])
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

export async function getUpload(id: string): Promise<StoredUpload | null> {
  if (!UPLOAD_ID.test(id || "")) return null;
  return ((await rtdb().ref(`uploads/${id}`).get()).val() as StoredUpload | null) || null;
}

/* Record a file that has ALREADY landed on disk. `file` is verified against
   public/uploads before anything is written: without that check a caller could
   mint a row for a file that was never stored, and the drawer would show a card
   whose link 404s — the same phantom-record class as the bogus-id `update()`
   calls above. Returns null when the file isn't there, and the route turns that
   into a 400 rather than a fake success. */
export async function createUpload(u: {
  name: string; file: string; url: string; type?: string; by?: string;
}): Promise<StoredUpload | null> {
  // Size comes off the disk, never from the caller — a record must not be able
  // to claim a size the file does not have.
  const size = storedFileSize(u.file);
  if (size < 0) return null;
  const id = "f" + randomBytes(6).toString("hex");
  const full: StoredUpload = {
    id,
    name: (u.name || u.file).slice(0, 200),
    file: u.file,
    url: u.url,
    type: (u.type || "application/octet-stream").slice(0, 120),
    size,
    by: u.by,
    createdAt: Date.now(),
  };
  await rtdb().ref(`uploads/${id}`).set(clean(full));
  touched();
  return full;
}

/* Delete the row AND the bytes. Read-before-write, so an unknown id is a 404
   instead of a no-op that reports success. The disk delete happens FIRST and is
   allowed to throw (→ 500, row intact): dropping the row while the file
   survived would orphan those bytes forever, with nothing left in the UI that
   could ever remove them. A file that is already gone is not an error. */
export async function deleteUpload(id: string): Promise<StoredUpload | null> {
  if (!UPLOAD_ID.test(id || "")) return null;
  const ref = rtdb().ref(`uploads/${id}`);
  const row = (await ref.get()).val() as StoredUpload | null;
  if (!row) return null;
  removeStoredFile(row.file);
  await ref.remove();
  touched();
  return row;
}

// ---- realtime -------------------------------------------------------------

export function onChange(cb: () => void): () => void {
  ensureWatch();
  const b = bus();
  b.on("change", cb);
  return () => b.off("change", cb);
}
