// Client data layer. Talks to the live same-origin API (/api/portal/*), which
// is backed by Firebase Realtime Database server-side. Falls back to the
// localStorage mock only when the API is unreachable (fully offline).

import type { Lead, LeadStatus, PortalUser, Project } from "./types";
import { mockBackend } from "./mock";

type Mode = "sync" | "mock";
let _mode: Mode | null = null;
const SESSION_KEY = "evora_sync_session";

async function mode(): Promise<Mode> {
  if (_mode) return _mode;
  try {
    const r = await fetch("/api/portal/health", { cache: "no-store" });
    _mode = r.ok ? "sync" : "mock";
  } catch { _mode = "mock"; }
  return _mode;
}

export const isLive = true;

const api = (p: string) => `/api/portal/${p}`;
const post = (p: string, body: unknown) =>
  fetch(api(p), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
const getJSON = (p: string) => fetch(api(p), { cache: "no-store" }).then((r) => r.json());

// ---- auth -----------------------------------------------------------------

export async function signIn(identifier: string, password: string): Promise<PortalUser> {
  if ((await mode()) === "mock") return mockBackend.signIn(identifier, password);
  const r = await post("signin", { identifier, password });
  if (!r.ok) throw new Error("INVALID_CREDENTIALS");
  const u = (await r.json()) as PortalUser;
  localStorage.setItem(SESSION_KEY, JSON.stringify(u));
  return u;
}

export async function registerCustomer(phone: string, name: string, password: string): Promise<PortalUser> {
  const r = await post("register", { phone, name, password });
  if (!r.ok) throw new Error(((await r.json().catch(() => ({}))) as { error?: string }).error || "FAILED");
  const u = (await r.json()) as PortalUser;
  localStorage.setItem(SESSION_KEY, JSON.stringify(u));
  return u;
}

export async function isRegistered(phone: string): Promise<boolean> {
  try { return (await getJSON(`registered?phone=${encodeURIComponent(phone)}`)).registered; } catch { return false; }
}

export async function signOutPortal(): Promise<void> {
  if ((await mode()) === "mock") return mockBackend.signOut();
  localStorage.removeItem(SESSION_KEY);
}

export function watchAuth(cb: (u: PortalUser | null) => void): () => void {
  (async () => {
    if ((await mode()) === "mock") return cb(mockBackend.current());
    try { cb(JSON.parse(localStorage.getItem(SESSION_KEY) || "null")); } catch { cb(null); }
  })();
  return () => {};
}

// ---- realtime -------------------------------------------------------------

export function subscribe(onChange: () => void): () => void {
  let es: EventSource | null = null;
  let closed = false;
  (async () => {
    if ((await mode()) !== "sync" || closed) return;
    es = new EventSource(api("events"));
    es.addEventListener("change", () => onChange());
  })();
  return () => { closed = true; es?.close(); };
}

// ---- projects -------------------------------------------------------------

export async function listProjectsForUser(uid: string): Promise<Project[]> {
  if ((await mode()) === "mock") return mockBackend.listForUser(uid);
  return getJSON(`projects?uid=${encodeURIComponent(uid)}`);
}
export async function listAllProjects(): Promise<Project[]> {
  if ((await mode()) === "mock") return mockBackend.listAll();
  return getJSON("projects");
}
export async function listClients(): Promise<PortalUser[]> {
  if ((await mode()) === "mock") return mockBackend.listClients();
  return getJSON("clients");
}
export async function saveProject(p: Project): Promise<Project> {
  if ((await mode()) === "mock") return mockBackend.saveProject(p);
  return (await post("projects", p)).json();
}
export async function deleteProject(id: string): Promise<void> {
  if ((await mode()) === "mock") return mockBackend.deleteProject(id);
  await fetch(api(`projects/${id}`), { method: "DELETE" });
}
export async function approveProject(id: string): Promise<void> {
  if ((await mode()) === "mock") return mockBackend.approve(id);
  await post("approve", { id });
}
export async function setStage(id: string, stage: string): Promise<void> {
  await post("stage", { id, stage });
}
export async function addUpdate(id: string, text: string, stageKey?: string, by?: string, imageUrl?: string): Promise<void> {
  await post("update", { id, text, stageKey, by, imageUrl });
}

export async function createClient(phone: string, name: string, password: string): Promise<PortalUser> {
  if ((await mode()) === "mock") return mockBackend.createClient(phone, name, password);
  const r = await post("clients", { phone, name, password });
  if (!r.ok) throw new Error(((await r.json().catch(() => ({}))) as { error?: string }).error || "FAILED");
  return r.json();
}

// ---- leads ----------------------------------------------------------------

// Upload a data-URL (e.g. an uploaded floor plan) and get back a served URL.
export async function uploadDataUrl(dataUrl: string): Promise<string> {
  const m = dataUrl.match(/^data:([^;]+);base64,(.*)$/);
  if (!m) return dataUrl;
  const mime = m[1];
  const ext = mime.includes("svg") ? "svg" : mime.includes("png") ? "png" : mime.includes("jpeg") || mime.includes("jpg") ? "jpg" : mime.includes("webp") ? "webp" : mime.includes("pdf") ? "pdf" : "bin";
  const r = await post("upload", { ext, dataBase64: m[2] });
  if (!r.ok) return dataUrl;
  return (await r.json()).url || dataUrl;
}

export async function listLeads(): Promise<Lead[]> { return getJSON("leads"); }
export async function createLead(name: string, phone: string, message?: string, planUrl?: string): Promise<Lead> {
  return (await post("leads", { name, phone, message, planUrl })).json();
}
export async function setLeadStatus(id: string, status: LeadStatus): Promise<void> {
  await post("lead-status", { id, status });
}

export function newId() { return mockBackend.newId(); }
