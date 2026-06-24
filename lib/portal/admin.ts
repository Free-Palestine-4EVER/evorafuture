// Firebase Admin (server-only) — full access to the Realtime Database via the
// service-account credentials. This is the real backend: cloud, persistent,
// shared across every device and Puffer. Never import from a client component.

import { getApps, initializeApp, cert, type App } from "firebase-admin/app";
import { getDatabase, type Database } from "firebase-admin/database";
import { readFileSync } from "fs";
import path from "path";

const DB_URL = process.env.FIREBASE_DB_URL || "https://evorafuture-bdb21-default-rtdb.firebaseio.com";

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
  app = getApps()[0] ?? initializeApp({ credential: cert(loadServiceAccount()), databaseURL: DB_URL });
  return app;
}

export function rtdb(): Database {
  return getDatabase(ensure());
}
