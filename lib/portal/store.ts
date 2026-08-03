// Client data layer. Talks to the live same-origin API (/api/portal/*), which
// is backed by Firebase Realtime Database server-side. Falls back to the
// localStorage mock only when the API is unreachable (fully offline).

import type { Lead, LeadStatus, License, PortalUser, Project, StoredUpload } from "./types";
import { mockBackend } from "./mock";
import { onRev, realtimeConfigured } from "./realtime";

type Mode = "sync" | "mock";
let _mode: Mode | null = null;
const SESSION_KEY = "evora_sync_session";
// Fired in-tab whenever the local session is established or dropped, so
// watchAuth re-reads immediately instead of waiting for a reload. (The native
// `storage` event only fires in OTHER tabs, never the one doing the writing.)
const AUTH_EVENT = "evora:auth";

// The portal backend base. Empty = same-origin (when the app itself serves the
// API, e.g. the self-hosted server). On Vercel, set NEXT_PUBLIC_PORTAL_API to the
// backend server URL (e.g. https://api.evorafuturehome.com) so all data +
// scan-storage calls hit the persistent server instead of Vercel's ephemeral
// filesystem. This server is the Firebase replacement.
const API_BASE = (process.env.NEXT_PUBLIC_PORTAL_API || "").replace(/\/+$/, "");
const api = (p: string) => `${API_BASE}/api/portal/${p}`;

async function mode(): Promise<Mode> {
  if (_mode) return _mode;
  try {
    const r = await fetch(api("health"), { cache: "no-store" });
    _mode = r.ok ? "sync" : "mock";
  } catch { _mode = "mock"; }
  return _mode;
}

export const isLive = true;
// `credentials: "include"` because the session is an httpOnly cookie. Same-origin
// fetch would send it by default, but NEXT_PUBLIC_PORTAL_API can point the portal
// at a different origin, and there the cookie would silently be dropped — giving
// a 401 that looks like "the button does nothing".
const rawPost = (p: string, body: unknown) =>
  fetch(api(p), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });

// THROWS on a non-2xx. It used to return the Response and every caller ignored
// it, so any failure was silent. That became visible the moment the write
// endpoints were gated on 2026-08-03: "Send to Studio" started returning 403,
// the helper swallowed it, the UI called load() and re-rendered the unchanged
// row — so the button simply appeared not to work, with nothing in the console.
// Same bug class as createLead reporting success for leads that were never
// stored. Callers that want to tolerate failure must catch explicitly.
const post = async (p: string, body: unknown) => {
  const r = await rawPost(p, body);
  if (!r.ok) {
    let detail = "";
    try { detail = ((await r.json()) as { error?: string }).error || ""; } catch { /* not json */ }
    throw new Error(`${p} failed: ${r.status}${detail ? ` ${detail}` : ""}`);
  }
  return r;
};
// The PII reads (clients / leads / projects) are now gated on an httpOnly
// session cookie issued at sign-in. A 401 therefore means "your local session
// predates the cookie, or it expired" — so drop the stale localStorage session
// and let the auth watcher fall back to the login form. Without this, an admin
// who was already signed in before the auth change would keep a local user
// object, call load(), and render a dashboard full of error objects.
const getJSON = async (p: string) => {
  const r = await fetch(api(p), { cache: "no-store" });
  if (r.status === 401) {
    try {
      localStorage.removeItem(SESSION_KEY);
      window.dispatchEvent(new Event(AUTH_EVENT));
    } catch { /* SSR / storage blocked */ }
    throw new Error("UNAUTHORIZED");
  }
  return r.json();
};

// ---- auth -----------------------------------------------------------------

export async function signIn(identifier: string, password: string): Promise<PortalUser> {
  if ((await mode()) === "mock") return mockBackend.signIn(identifier, password);
  // rawPost, not post: a wrong password is an expected 401 that this function
  // translates into INVALID_CREDENTIALS for the login form. Letting post()
  // throw its generic "signin failed: 401" first would lose that.
  const r = await rawPost("signin", { identifier, password });
  if (!r.ok) throw new Error("INVALID_CREDENTIALS");
  const u = (await r.json()) as PortalUser;
  localStorage.setItem(SESSION_KEY, JSON.stringify(u));
  try { window.dispatchEvent(new Event(AUTH_EVENT)); } catch { /* SSR */ }
  return u;
}

export async function registerCustomer(phone: string, name: string, password: string): Promise<PortalUser> {
  // rawPost for the same reason as signIn — "phone already registered" is an
  // expected failure this function reports in its own words.
  const r = await rawPost("register", { phone, name, password });
  if (!r.ok) throw new Error(((await r.json().catch(() => ({}))) as { error?: string }).error || "FAILED");
  const u = (await r.json()) as PortalUser;
  localStorage.setItem(SESSION_KEY, JSON.stringify(u));
  try { window.dispatchEvent(new Event(AUTH_EVENT)); } catch { /* SSR */ }
  return u;
}

export async function isRegistered(phone: string): Promise<boolean> {
  try { return (await getJSON(`registered?phone=${encodeURIComponent(phone)}`)).registered; } catch { return false; }
}

export async function signOutPortal(): Promise<void> {
  if ((await mode()) === "mock") return mockBackend.signOut();
  localStorage.removeItem(SESSION_KEY);
  // Also drop the httpOnly cookie server-side — clearing only localStorage
  // would leave a valid session cookie behind on a shared machine.
  try { await post("signout", {}); } catch { /* offline — local session is gone regardless */ }
  try { window.dispatchEvent(new Event(AUTH_EVENT)); } catch { /* SSR */ }
}

/** Drop the local session and tell every watcher, so the UI falls back to the
 *  login form. Exported so other API layers (the Home Studio has its own fetch
 *  helper in lib/homestudio/cloud.ts) can react to a 401 the same way instead of
 *  surfacing a dead "unauthorized" error to the user. */
export function clearLocalSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
    window.dispatchEvent(new Event(AUTH_EVENT));
  } catch { /* SSR / storage blocked */ }
}

export function watchAuth(cb: (u: PortalUser | null) => void): () => void {
  const read = () => {
    try { cb(JSON.parse(localStorage.getItem(SESSION_KEY) || "null")); } catch { cb(null); }
  };
  let live = true;
  (async () => {
    if ((await mode()) === "mock") return cb(mockBackend.current());
    if (live) read();
  })();
  // Re-read when the session changes — either in another tab (`storage`) or in
  // this one (AUTH_EVENT, fired on sign-out and when a request comes back 401).
  const onChange = () => { if (live) read(); };
  window.addEventListener("storage", onChange);
  window.addEventListener(AUTH_EVENT, onChange);
  return () => {
    live = false;
    window.removeEventListener("storage", onChange);
    window.removeEventListener(AUTH_EVENT, onChange);
  };
}

// ---- realtime -------------------------------------------------------------

export function subscribe(onChange: () => void): () => void {
  // Instant path: Firebase RTDB /meta/rev (works on Vercel). Falls back to SSE.
  if (realtimeConfigured) return onRev(onChange);
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
// Admin-only and irreversible server-side. Throws on a rejected delete (401 /
// 403 / 404) so the dashboard shows its "delete failed" banner instead of
// silently no-op'ing and leaving the row to reappear on the next load — same
// contract as deleteLead below.
export async function deleteProject(id: string): Promise<void> {
  if ((await mode()) === "mock") return mockBackend.deleteProject(id);
  const r = await fetch(api(`projects/${encodeURIComponent(id)}`), { method: "DELETE" });
  if (!r.ok) throw new Error("FAILED");
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
export async function deleteUpdate(id: string, updateId: string): Promise<void> {
  await post("update-delete", { id, updateId });
}

export async function createClient(phone: string, name: string, password: string): Promise<PortalUser> {
  if ((await mode()) === "mock") return mockBackend.createClient(phone, name, password);
  // rawPost: this reports the server's own wording (e.g. phone already taken).
  const r = await rawPost("clients", { phone, name, password });
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
  // post() throws on failure. The old code returned the original data: URL
  // here, which silently wrote megabytes of base64 into data/evora-db.json
  // instead of a link — a failed upload must be a failure, not a fake success.
  const r = await post("upload", { ext, dataBase64: m[2] });
  return (await r.json()).url || dataUrl;
}

// Upload any File (2D plan, .glb model, photo) → served Storage URL.
export async function uploadFile(file: File): Promise<string> {
  return (await uploadFileRaw(file)).url;
}

/* The same upload, but handing back the server-generated on-disk name as well
   as the URL. The Files drawer needs it to index the file it just stored; every
   other caller only ever wanted the URL, which is what uploadFile still gives
   them. One pipeline, two shapes of answer — not two pipelines.
   Uses rawPost, not post, deliberately: post() throws a generic message and
   discards the Response, and this is the one caller that needs the STATUS —
   413 vs 415 vs 401 is the difference between "your file is too big", "that
   type isn't allowed" and "sign in again", and the drop zone says which. */
export async function uploadFileRaw(file: File): Promise<{ url: string; file: string }> {
  const buf = await file.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  const ext = (file.name.split(".").pop() || "bin").toLowerCase();
  const r = await rawPost("upload", { ext, dataBase64: btoa(bin) });
  if (!r.ok) throw new Error(r.status === 413 ? "TOO_LARGE" : r.status === 415 ? "UNSUPPORTED_TYPE" : r.status === 401 || r.status === 403 ? "UNAUTHORIZED" : "UPLOAD_FAILED");
  const out = (await r.json()) as { url?: string; file?: string };
  // A 200 with no url would mean the bytes never landed — never report success
  // for a file the server did not confirm it stored.
  if (!out.url || !out.file) throw new Error("UPLOAD_FAILED");
  return { url: out.url, file: out.file };
}

/* ---- the studio's file drawer (admin only) ------------------------------
   /admindashboard → Files. Two calls per upload on purpose: uploadFileRaw()
   stores the bytes through the shared pipeline, then recordUpload() indexes
   what actually landed. Every one of these throws on a non-ok response — a
   drawer that shows a file the server never stored is worse than an error. */
export async function listUploads(): Promise<StoredUpload[]> { return getJSON("uploads"); }

export async function recordUpload(u: { file: string; name: string; type?: string }): Promise<StoredUpload> {
  const r = await rawPost("uploads", u);
  if (!r.ok) throw new Error("RECORD_FAILED");
  const rec = (await r.json()) as StoredUpload;
  // A 200 that carried no row would mean nothing was indexed. Never let the
  // drawer report a file as added on the strength of a status code alone.
  if (!rec?.id) throw new Error("RECORD_FAILED");
  return rec;
}

/** Removes the row AND the file from disk. Throws on 401/403/404/500 so the
 *  panel shows its failure banner instead of dropping a card that is still
 *  there on the next load. */
export async function deleteUpload(id: string): Promise<void> {
  const r = await fetch(api(`uploads/${encodeURIComponent(id)}`), { method: "DELETE", credentials: "include" });
  if (!r.ok) throw new Error("FAILED");
}

export async function listLeads(): Promise<Lead[]> { return getJSON("leads"); }

// Newsletter signup from the public marketing footer. Throws on a rejected
// address so the form can show a real error instead of a fake success.
export async function subscribeEmail(email: string): Promise<void> {
  const r = await rawPost("subscribe", { email });
  if (!r.ok) throw new Error("INVALID_EMAIL");
}
export async function createLead(name: string, phone: string, message?: string, planUrl?: string, email?: string): Promise<Lead> {
  return (await post("leads", { name, phone, message, planUrl, email })).json();
}
export async function setLeadStatus(id: string, status: LeadStatus): Promise<void> {
  await post("lead-status", { id, status });
}
// Admin-only, irreversible. Throws on a rejected delete so the dashboard shows
// the failure banner instead of optimistically dropping the row from the UI.
export async function deleteLead(id: string): Promise<void> {
  const r = await fetch(api(`leads/${encodeURIComponent(id)}`), { method: "DELETE" });
  if (!r.ok) throw new Error("FAILED");
}
export async function sendLeadToPuffer(id: string, on = true): Promise<void> {
  await post("lead-to-puffer", { id, on });
}

/* ---- desktop-app licences (admin only) ----------------------------------
   Keys for the Evora Studio desktop app (.exe / .dmg). No mock fallback: an
   offline dashboard must not pretend to mint a key that the server has never
   seen, because the number it showed would never work in the app. */
export async function listLicenses(): Promise<License[]> { return getJSON("licenses"); }

export async function createLicense(label: string, note?: string, expiresAt?: number | null): Promise<License> {
  const r = await post("licenses", { label, note, expiresAt });
  if (!r.ok) throw new Error(((await r.json().catch(() => ({}))) as { error?: string }).error || "FAILED");
  return r.json();
}
export async function setLicenseRevoked(key: string, on: boolean): Promise<void> {
  const r = await post("license-revoke", { key, on });
  if (!r.ok) throw new Error("FAILED");
}
export async function unbindLicense(key: string): Promise<void> {
  const r = await post("license-unbind", { key });
  if (!r.ok) throw new Error("FAILED");
}
export async function deleteLicense(key: string): Promise<void> {
  const r = await fetch(api(`licenses/${encodeURIComponent(key)}`), { method: "DELETE" });
  if (!r.ok) throw new Error("FAILED");
}

export function newId() { return mockBackend.newId(); }
