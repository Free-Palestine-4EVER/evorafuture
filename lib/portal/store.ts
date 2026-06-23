// Unified data layer for the portal. Uses real Firebase when configured,
// otherwise the localStorage mock. Components only import from here.

import { firebaseConfigured, getFirebase, getSecondaryApp, phoneToEmail } from "../firebase";
import type { PortalUser, Project, Role } from "./types";
import { mockBackend } from "./mock";

export const isLive = firebaseConfigured;

// ---- Auth -----------------------------------------------------------------

export async function signIn(phone: string, password: string): Promise<PortalUser> {
  if (!isLive) return mockBackend.signIn(phone, password);
  const { auth, db } = getFirebase();
  const { signInWithEmailAndPassword } = await import("firebase/auth");
  const { doc, getDoc } = await import("firebase/firestore");
  const cred = await signInWithEmailAndPassword(auth!, phoneToEmail(phone), password);
  const snap = await getDoc(doc(db!, "users", cred.user.uid));
  const data = snap.data() || {};
  return {
    uid: cred.user.uid,
    phone: data.phone || phone,
    name: data.name || "",
    role: (data.role as Role) || "client",
  };
}

export async function signOutPortal(): Promise<void> {
  if (!isLive) return mockBackend.signOut();
  const { auth } = getFirebase();
  const { signOut } = await import("firebase/auth");
  await signOut(auth!);
}

// Subscribe to auth state. Returns an unsubscribe function. Calls cb with the
// resolved PortalUser (incl. role from Firestore) or null.
export function watchAuth(cb: (u: PortalUser | null) => void): () => void {
  if (!isLive) {
    cb(mockBackend.current());
    return () => {};
  }
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

// ---- Projects -------------------------------------------------------------

export async function listProjectsForUser(uid: string): Promise<Project[]> {
  if (!isLive) return mockBackend.listForUser(uid);
  const { db } = getFirebase();
  const { collection, query, where, getDocs } = await import("firebase/firestore");
  const q = query(collection(db!, "projects"), where("ownerUid", "==", uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Project, "id">) }))
    .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
}

export async function listAllProjects(): Promise<Project[]> {
  if (!isLive) return mockBackend.listAll();
  const { db } = getFirebase();
  const { collection, getDocs } = await import("firebase/firestore");
  const snap = await getDocs(collection(db!, "projects"));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Project, "id">) }))
    .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
}

export async function listClients(): Promise<PortalUser[]> {
  if (!isLive) return mockBackend.listClients();
  const { db } = getFirebase();
  const { collection, query, where, getDocs } = await import("firebase/firestore");
  const snap = await getDocs(query(collection(db!, "users"), where("role", "==", "client")));
  return snap.docs.map((d) => ({ uid: d.id, ...(d.data() as Omit<PortalUser, "uid">) }));
}

export async function saveProject(p: Project): Promise<Project> {
  if (!isLive) return mockBackend.saveProject(p);
  const { db } = getFirebase();
  const { doc, setDoc } = await import("firebase/firestore");
  const id = p.id || mockBackend.newId();
  const stamped = { ...p, id, updatedAt: Date.now(), createdAt: p.createdAt || Date.now() };
  const { id: _drop, ...payload } = stamped;
  await setDoc(doc(db!, "projects", id), payload, { merge: true });
  return stamped;
}

export async function deleteProject(id: string): Promise<void> {
  if (!isLive) return mockBackend.deleteProject(id);
  const { db } = getFirebase();
  const { doc, deleteDoc } = await import("firebase/firestore");
  await deleteDoc(doc(db!, "projects", id));
}

export async function approveProject(id: string): Promise<void> {
  if (!isLive) return mockBackend.approve(id);
  const { db } = getFirebase();
  const { doc, updateDoc } = await import("firebase/firestore");
  await updateDoc(doc(db!, "projects", id), { status: "approved", approvedByClient: true, updatedAt: Date.now() });
}

// Admin creates a client account (phone + password set here). Uses a secondary
// Firebase app so the admin's own session is not replaced.
export async function createClient(phone: string, name: string, password: string): Promise<PortalUser> {
  if (!isLive) return mockBackend.createClient(phone, name, password);
  const secondary = getSecondaryApp()!;
  const { getAuth, createUserWithEmailAndPassword, signOut } = await import("firebase/auth");
  const { getFirestore, doc, setDoc } = await import("firebase/firestore");
  const sAuth = getAuth(secondary);
  const cred = await createUserWithEmailAndPassword(sAuth, phoneToEmail(phone), password);
  const user: PortalUser = { uid: cred.user.uid, phone, name, role: "client" };
  await setDoc(doc(getFirestore(secondary), "users", cred.user.uid), {
    phone, name, role: "client", createdAt: Date.now(),
  });
  await signOut(sAuth);
  return user;
}

export function newId() { return mockBackend.newId(); }
