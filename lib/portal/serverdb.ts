// Server-side shared store for the portal — a tiny file-backed "database" plus
// an in-process event bus for realtime (SSE). Runs inside the Next server
// (`next start`), so the Evora portal, the admin dashboard and Puffer all read
// and write the SAME data, and every client gets live updates. Swap for
// Firebase later by changing lib/portal/store.ts.
//
// NOTE: server-only. Never import this from a client component.

import { promises as fs } from "fs";
import path from "path";
import { EventEmitter } from "events";
import type { PortalUser, Project } from "./types";

const FILE = path.join(process.cwd(), ".evora-data.json");

type StoredUser = PortalUser & { password: string };
interface DB { users: StoredUser[]; projects: Project[] }

// Survive dev/HMR module reloads by hanging the bus + cache off globalThis.
const g = globalThis as unknown as { __evoraBus?: EventEmitter; __evoraCache?: DB };

function bus(): EventEmitter {
  if (!g.__evoraBus) { g.__evoraBus = new EventEmitter(); g.__evoraBus.setMaxListeners(200); }
  return g.__evoraBus;
}

function seed(): DB {
  const now = Date.now();
  return {
    users: [
      { uid: "demo-client", phone: "client", name: "Rana Haddad", role: "client", password: "client" },
      { uid: "demo-admin", phone: "admin", name: "Evora Studio", role: "admin", password: "admin" },
    ],
    projects: [
      { id: "p1", ownerUid: "demo-client", ownerPhone: "client", ownerName: "Rana Haddad",
        title: "Khalda Apartment — Living Room", room: "Living room", status: "approved",
        thumbnailUrl: "/evora/p07.jpg", plan2dUrl: "/evora/p07.jpg",
        notes: "Cream Chesterfield sofa, walnut console, brass accents.",
        approvedByClient: true, createdAt: now - 86400000 * 9, updatedAt: now - 86400000 * 2 },
      { id: "p2", ownerUid: "demo-client", ownerPhone: "client", ownerName: "Rana Haddad",
        title: "Master Bedroom Suite", room: "Master bedroom", status: "in_production",
        thumbnailUrl: "/evora/p03.jpg", plan2dUrl: "/evora/p03.jpg",
        notes: "Built-in wardrobe wall + upholstered headboard.",
        approvedByClient: true, createdAt: now - 86400000 * 6, updatedAt: now - 86400000 },
    ],
  };
}

async function read(): Promise<DB> {
  if (g.__evoraCache) return g.__evoraCache;
  try {
    g.__evoraCache = JSON.parse(await fs.readFile(FILE, "utf8")) as DB;
  } catch {
    g.__evoraCache = seed();
    await fs.writeFile(FILE, JSON.stringify(g.__evoraCache, null, 2)).catch(() => {});
  }
  return g.__evoraCache;
}

async function write(db: DB): Promise<void> {
  g.__evoraCache = db;
  await fs.writeFile(FILE, JSON.stringify(db, null, 2)).catch(() => {});
  bus().emit("change");
}

const norm = (s: string) => { const d = s.replace(/[^\d]/g, ""); return d.length ? d : s.trim().toLowerCase(); };
const strip = (u: StoredUser): PortalUser => ({ uid: u.uid, phone: u.phone, name: u.name, role: u.role });

export async function signIn(phone: string, password: string): Promise<PortalUser | null> {
  const db = await read();
  const u = db.users.find((x) => norm(x.phone) === norm(phone) && x.password === password);
  return u ? strip(u) : null;
}

export async function listClients(): Promise<PortalUser[]> {
  return (await read()).users.filter((u) => u.role === "client").map(strip);
}

export async function listAll(): Promise<Project[]> {
  return [...(await read()).projects].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
}

export async function listForUser(uid: string): Promise<Project[]> {
  return (await read()).projects.filter((p) => p.ownerUid === uid).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
}

export async function upsertProject(p: Project): Promise<Project> {
  const db = await read();
  const id = p.id || "p" + Math.abs(Date.now()).toString(36);
  const stamped: Project = { ...p, id, updatedAt: Date.now(), createdAt: p.createdAt || Date.now() };
  const i = db.projects.findIndex((x) => x.id === id);
  if (i >= 0) db.projects[i] = stamped; else db.projects.unshift(stamped);
  await write(db);
  return stamped;
}

export async function deleteProject(id: string): Promise<void> {
  const db = await read();
  db.projects = db.projects.filter((p) => p.id !== id);
  await write(db);
}

export async function approve(id: string): Promise<void> {
  const db = await read();
  const i = db.projects.findIndex((x) => x.id === id);
  if (i >= 0) { db.projects[i] = { ...db.projects[i], status: "approved", approvedByClient: true, updatedAt: Date.now() }; await write(db); }
}

export async function createClient(phone: string, name: string, password: string): Promise<PortalUser> {
  const db = await read();
  if (db.users.some((u) => norm(u.phone) === norm(phone))) throw new Error("PHONE_EXISTS");
  const u: StoredUser = { uid: "c" + norm(phone), phone, name, role: "client", password };
  db.users.push(u);
  await write(db);
  return strip(u);
}

export function onChange(cb: () => void): () => void {
  const b = bus();
  b.on("change", cb);
  return () => b.off("change", cb);
}
