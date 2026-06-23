// Firebase client init for the Evora Client Portal.
// Reads NEXT_PUBLIC_FIREBASE_* env vars. If they are not set yet, the portal
// transparently falls back to a local mock (see lib/portal/store.ts) so the UI
// is fully usable before the employee wires real keys.
//
// The same Firebase project is shared with the Puffer 2D→3D software, which
// writes client accounts + saved projects. This site mostly reads them, and
// the admin dashboard can also create/update.

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseConfigured = Boolean(config.apiKey && config.projectId);

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;

export function getFirebase() {
  if (!firebaseConfigured) return { app: null, auth: null, db: null };
  if (!_app) {
    _app = getApps().length ? getApp() : initializeApp(config);
    _auth = getAuth(_app);
    _db = getFirestore(_app);
  }
  return { app: _app, auth: _auth!, db: _db! };
}

// A throwaway secondary app so the admin can create client accounts without
// being signed out of their own session (Firebase signs you in as the newly
// created user on the primary app instance otherwise).
export function getSecondaryApp(): FirebaseApp | null {
  if (!firebaseConfigured) return null;
  const name = "evora-admin-secondary";
  const existing = getApps().find((a) => a.name === name);
  return existing ?? initializeApp(config, name);
}

// Clients log in with their phone number + a password set by an employee in
// Puffer. Under the hood we use Firebase email/password auth with a synthetic
// email derived from the normalized phone number.
export function phoneToEmail(phone: string): string {
  const digits = phone.replace(/[^\d]/g, "").replace(/^0+/, "");
  return `c${digits}@clients.evora`;
}
