// Server-side store backed by Firebase Realtime Database (Admin SDK).
// The single source of truth for the whole platform: staff/customer accounts,
// projects + their journey, timeline updates, and homepage leads. Realtime is
// driven both by our own writes and by an RTDB listener (so external changes
// also push to connected clients). Server-only — never import on the client.

import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { EventEmitter } from "events";
import { rtdb } from "./admin";
import { notifyAdmins, notifyUsers } from "./notify";
import { stageByIndex, stageIndex } from "./journey";
import type { Lead, LeadStatus, PortalUser, Project, ProjectUpdate, Role } from "./types";

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

// Attach a single RTDB listener so changes from anywhere push to SSE clients.
function ensureWatch() {
  if (g.__evoraWatch) return;
  g.__evoraWatch = true;
  rtdb().ref("projects").on("value", () => bus().emit("change"));
  rtdb().ref("leads").on("value", () => bus().emit("change"));
  rtdb().ref("users").on("value", () => bus().emit("change"));
}

// ---- bootstrap ------------------------------------------------------------

export async function bootstrap(): Promise<void> {
  ensureWatch();
  const users = await allUsers();
  if (!users.some((u) => emailNorm(u.email || "") === "bakri@evorafuture.com")) {
    const uid = "staff-bakri";
    await rtdb().ref(`users/${uid}`).set(clean({
      uid, phone: "", email: "bakri@evorafuture.com", name: "Bakri", role: "admin", password: hashPw("alhamdulillah"),
    }));
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

export async function deleteProject(id: string): Promise<void> {
  await rtdb().ref(`projects/${id}`).remove();
  touched();
}

export async function approve(id: string): Promise<void> {
  await rtdb().ref(`projects/${id}`).update({ approvedByClient: true, updatedAt: Date.now() });
  touched();
}

export async function setStage(id: string, stage: string): Promise<void> {
  const proj = (await rtdb().ref(`projects/${id}`).get()).val() as Project | null;
  await rtdb().ref(`projects/${id}`).update({ stage, updatedAt: Date.now() });
  touched();
  if (proj?.ownerUid) {
    const label = stageByIndex(stageIndex(stage)).en;
    notifyUsers([proj.ownerUid], proj.title || "Your Evora project", `Moved to: ${label}`);
  }
}

export async function addUpdate(id: string, u: Omit<ProjectUpdate, "id" | "at">): Promise<void> {
  const ref = rtdb().ref(`projects/${id}`);
  const proj = (await ref.get()).val() as Project | null;
  if (!proj) return;
  const updates = proj.updates || [];
  updates.unshift({ id: randomBytes(5).toString("hex"), at: Date.now(), ...u });
  await ref.update(clean({ updates, updatedAt: Date.now() }));
  touched();
  if (proj.ownerUid) notifyUsers([proj.ownerUid], proj.title || "Your Evora project", u.text || "New update", "/dashboard");
}

export async function deleteUpdate(id: string, updateId: string): Promise<void> {
  const ref = rtdb().ref(`projects/${id}`);
  const proj = (await ref.get()).val() as Project | null;
  if (!proj) return;
  await ref.update(clean({ updates: (proj.updates || []).filter((u) => u.id !== updateId), updatedAt: Date.now() }));
  touched();
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

export async function setLeadStatus(id: string, status: LeadStatus): Promise<void> {
  await rtdb().ref(`leads/${id}`).update({ status, updatedAt: Date.now() });
  touched();
}

export async function sendLeadToPuffer(id: string, on = true): Promise<void> {
  await rtdb().ref(`leads/${id}`).update({ sentToPuffer: on, updatedAt: Date.now() });
  touched();
  if (on) notifyStaff("2D plan queued for Puffer", "A design request is ready to import in /pufferweb");
}

// ---- realtime -------------------------------------------------------------

export function onChange(cb: () => void): () => void {
  ensureWatch();
  const b = bus();
  b.on("change", cb);
  return () => b.off("change", cb);
}
