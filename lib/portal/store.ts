// Unified client data layer. Resolves a backend mode once, then dispatches:
//   firebase  — if NEXT_PUBLIC_FIREBASE_* keys are set
//   sync      — the live same-origin API (/api/portal/*) with realtime SSE;
//               shared across devices + with Puffer
//   mock      — localStorage demo data (offline / API unreachable)
// Components only import from here.

import { firebaseConfigured, getFirebase, getSecondaryApp, phoneToEmail } from "../firebase";
import type { PortalUser, Project, Role } from "./types";
import { mockBackend } from "./mock";

type Mode = "firebase" | "sync" | "mock";
let _mode: Mode | null = null;
const SESSION_KEY = "evora_sync_session";

async function mode(): Promise<Mode> {
  if (_mode) return _mode;
  if (firebaseConfigured) return (_mode = "firebase");
  try {
    const r = await fetch("/api/portal/health", { cache: "no-store" });
    _mode = r.ok ? "sync" : "mock";
  } catch {
    _mode = "mock";
  }
  return _mode;
}

export const isLive = firebaseConfigured;

const api = (p: string) => `/api/portal/${p}`;
const post = (p: string, body: unknown) =>
  fetch(api(p), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

// ---- Auth -----------------------------------------------------------------

export async function signIn(phone: string, password: string): Promise<PortalUser> {
  const m = await mode();
  if (m === "firebase") {
    const { auth, db } = getFirebase();
    const { signInWithEmailAndPassword } = await import("firebase/auth");
    const { doc, getDoc } = await import("firebase/firestore");
    const cred = await signInWithEmailAndPassword(auth!, phoneToEmail(phone), password);
    const snap = await getDoc(doc(db!, "users", cred.user.uid));
    const data = snap.data() || {};
    return { uid: cred.user.uid, phone: data.phone || phone, name: data.name || "", role: (data.role as Role) || "client" };
  }
  if (m === "sync") {
    const r = await post("signin", { phone, password });
    if (!r.ok) throw new Error("INVALID_CREDENTIALS");
    const u = (await r.json()) as PortalUser;
    localStorage.setItem(SESSION_KEY, JSON.stringify(u));
    return u;
  }
  return mockBackend.signIn(phone, password);
}

export async function signOutPortal(): Promise<void> {
  const m = await mode();
  if (m === "firebase") {
    const { auth } = getFirebase();
    const { signOut } = await import("firebase/auth");
    return void (await signOut(auth!));
  }
  if (m === "sync") return void localStorage.removeItem(SESSION_KEY);
  return mockBackend.signOut();
}

export function watchAuth(cb: (u: PortalUser | null) => void): () => void {
  if (firebaseConfigured) {
    const { auth, db } = getFirebase();
    let cancelled = false;
    let unsub = () => {};
    (async () => {
      const { onAuthStateChanged } = await import("firebase/auth");
      const { doc, getDoc } = await import("firebase/firestore");
      unsub = onAuthStateChanged(auth!, async (fbUser) => {
        if (cancelled) return;
        if (!fbUser) return cb(null);
        const snap = await getDoc(doc(db!, "users", fbUser.uid));
        const data = snap.data() || {};
        cb({ uid: fbUser.uid, phone: data.phone || "", name: data.name || "", role: (data.role as Role) || "client" });
      });
    })();
    return () => { cancelled = true; unsub(); };
  }
  // sync + mock both resolve synchronously from localStorage
  (async () => {
    const m = await mode();
    if (m === "sync") {
      try { cb(JSON.parse(localStorage.getItem(SESSION_KEY) || "null")); } catch { cb(null); }
    } else {
      cb(mockBackend.current());
    }
  })();
  return () => {};
}

// ---- Realtime -------------------------------------------------------------

// Subscribe to live data changes (sync mode only). Returns an unsubscribe fn.
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

// ---- Projects -------------------------------------------------------------

export async function listProjectsForUser(uid: string): Promise<Project[]> {
  const m = await mode();
  if (m === "firebase") {
    const { db } = getFirebase();
    const { collection, query, where, getDocs } = await import("firebase/firestore");
    const snap = await getDocs(query(collection(db!, "projects"), where("ownerUid", "==", uid)));
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Project, "id">) })).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  }
  if (m === "sync") return (await fetch(api(`projects?uid=${encodeURIComponent(uid)}`), { cache: "no-store" })).json();
  return mockBackend.listForUser(uid);
}

export async function listAllProjects(): Promise<Project[]> {
  const m = await mode();
  if (m === "firebase") {
    const { db } = getFirebase();
    const { collection, getDocs } = await import("firebase/firestore");
    const snap = await getDocs(collection(db!, "projects"));
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Project, "id">) })).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  }
  if (m === "sync") return (await fetch(api("projects"), { cache: "no-store" })).json();
  return mockBackend.listAll();
}

export async function listClients(): Promise<PortalUser[]> {
  const m = await mode();
  if (m === "firebase") {
    const { db } = getFirebase();
    const { collection, query, where, getDocs } = await import("firebase/firestore");
    const snap = await getDocs(query(collection(db!, "users"), where("role", "==", "client")));
    return snap.docs.map((d) => ({ uid: d.id, ...(d.data() as Omit<PortalUser, "uid">) }));
  }
  if (m === "sync") return (await fetch(api("clients"), { cache: "no-store" })).json();
  return mockBackend.listClients();
}

export async function saveProject(p: Project): Promise<Project> {
  const m = await mode();
  if (m === "firebase") {
    const { db } = getFirebase();
    const { doc, setDoc } = await import("firebase/firestore");
    const id = p.id || mockBackend.newId();
    const stamped = { ...p, id, updatedAt: Date.now(), createdAt: p.createdAt || Date.now() };
    const { id: _drop, ...payload } = stamped;
    await setDoc(doc(db!, "projects", id), payload, { merge: true });
    return stamped;
  }
  if (m === "sync") return (await post("projects", p)).json();
  return mockBackend.saveProject(p);
}

export async function deleteProject(id: string): Promise<void> {
  const m = await mode();
  if (m === "firebase") {
    const { db } = getFirebase();
    const { doc, deleteDoc } = await import("firebase/firestore");
    return void (await deleteDoc(doc(db!, "projects", id)));
  }
  if (m === "sync") return void (await fetch(api(`projects/${id}`), { method: "DELETE" }));
  return mockBackend.deleteProject(id);
}

export async function approveProject(id: string): Promise<void> {
  const m = await mode();
  if (m === "firebase") {
    const { db } = getFirebase();
    const { doc, updateDoc } = await import("firebase/firestore");
    return void (await updateDoc(doc(db!, "projects", id), { status: "approved", approvedByClient: true, updatedAt: Date.now() }));
  }
  if (m === "sync") return void (await post("approve", { id }));
  return mockBackend.approve(id);
}

export async function createClient(phone: string, name: string, password: string): Promise<PortalUser> {
  const m = await mode();
  if (m === "firebase") {
    const secondary = getSecondaryApp()!;
    const { getAuth, createUserWithEmailAndPassword, signOut } = await import("firebase/auth");
    const { getFirestore, doc, setDoc } = await import("firebase/firestore");
    const sAuth = getAuth(secondary);
    const cred = await createUserWithEmailAndPassword(sAuth, phoneToEmail(phone), password);
    await setDoc(doc(getFirestore(secondary), "users", cred.user.uid), { phone, name, role: "client", createdAt: Date.now() });
    await signOut(sAuth);
    return { uid: cred.user.uid, phone, name, role: "client" };
  }
  if (m === "sync") {
    const r = await post("clients", { phone, name, password });
    if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || "FAILED");
    return r.json();
  }
  return mockBackend.createClient(phone, name, password);
}

export function newId() { return mockBackend.newId(); }
