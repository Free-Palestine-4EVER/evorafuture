// Firebase Admin (server-only) — full access to the Realtime Database via the
// service-account credentials. This is the real backend: cloud, persistent,
// shared across every device and Puffer. Never import from a client component.

import { getApps, initializeApp, cert, type App } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import { getStorage } from "firebase-admin/storage";
import { readFileSync, mkdirSync, writeFileSync } from "fs";
import path from "path";
import { localDb } from "./localdb";

// When EVORA_LOCAL_DB=1 the whole backend runs off a local JSON file (localdb.ts)
// and never touches Firebase — self-hosted on this Mac now, on the studio's PC
// later. Storage is independently local via EVORA_LOCAL_STORAGE.
const LOCAL_DB = process.env.EVORA_LOCAL_DB === "1";

// Structural type covering the tiny RTDB slice serverdb.ts uses. The Firebase
// Database is assignable to this, and so is our localDb.
type RefLike = {
  get(): Promise<{ val(): unknown }>;
  set(v: unknown): Promise<unknown>;
  update(v: Record<string, unknown>): Promise<unknown>;
  remove(): Promise<unknown>;
};
type DbLike = { ref(path: string): RefLike };

const DB_URL = process.env.FIREBASE_DB_URL || "https://evorafuture-bdb21-default-rtdb.firebaseio.com";
export const STORAGE_BUCKET = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "evorafuture-bdb21.firebasestorage.app";

let app: App | null = null;

function loadServiceAccount() {
  // Cloud (Vercel): the whole JSON in FIREBASE_SERVICE_ACCOUNT.
  // Local dev: the service-account.json file at the project root.
  const env = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (env) return JSON.parse(env);
  return JSON.parse(readFileSync(path.join(process.cwd(), "service-account.json"), "utf8"));
}

function ensure(): App {
  if (app) return app;
  app = getApps()[0] ?? initializeApp({ credential: cert(loadServiceAccount()), databaseURL: DB_URL, storageBucket: STORAGE_BUCKET });
  return app;
}

export function rtdb(): DbLike {
  if (LOCAL_DB) return localDb as unknown as DbLike;
  return getDatabase(ensure()) as unknown as DbLike;
}

// Upload bytes to Firebase Storage (serverless-safe, unlike local disk) and
// return a public URL. Used for Puffer's GLB + 2D plans + journey photos.
export async function uploadToStorage(name: string, buf: Buffer, contentType: string, publicBase?: string): Promise<string> {
  // Local-first mode: when EVORA_LOCAL_STORAGE=1, write the bytes into the app's
  // public/ dir and return a URL served by this same server. Bypasses Firebase
  // Storage entirely. `publicBase` (the incoming request origin) makes the URL
  // absolute so the phone app can fetch it, and keeps the whole thing portable
  // to any machine/IP with no config — falls back to EVORA_PUBLIC_BASE, then to
  // a same-origin relative URL for the web portal.
  if (process.env.EVORA_LOCAL_STORAGE === "1") {
    const rel = path.join("uploads", name.replace(/^uploads\//, ""));
    const abs = path.join(process.cwd(), "public", rel);
    mkdirSync(path.dirname(abs), { recursive: true });
    writeFileSync(abs, buf);
    const base = (publicBase || process.env.EVORA_PUBLIC_BASE || "").replace(/\/+$/, "");
    return `${base}/${rel}`;
  }
  const file = getStorage(ensure()).bucket().file(name);
  await file.save(buf, { contentType, resumable: false, metadata: { cacheControl: "public, max-age=31536000, immutable" } });
  await file.makePublic();
  return `https://storage.googleapis.com/${STORAGE_BUCKET}/${name}`;
}
