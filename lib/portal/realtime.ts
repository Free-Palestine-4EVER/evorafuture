"use client";

// Instant realtime via Firebase RTDB. Clients subscribe to a tiny public
// /meta/rev flag the server bumps on every write — so updates land instantly on
// every device (works on Vercel serverless, unlike held SSE). No PII is exposed:
// RTDB rules allow reading only /meta; all real data stays server-only.

import { initializeApp, getApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

// Dedicated named app so we never reuse another default Firebase app that was
// initialized without a databaseURL (which silently breaks realtime).
const APP_NAME = "evora-rt";

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const cfg = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || (projectId ? `https://${projectId}-default-rtdb.firebaseio.com` : undefined),
};

// EVORA_LOCAL forces the self-hosted path: no direct client→Firebase connection,
// realtime rides the server's SSE /api/portal/events stream instead (see
// store.ts subscribe fallback). Keeps browsers off Firebase entirely.
const LOCAL = process.env.NEXT_PUBLIC_EVORA_LOCAL === "1";
export const realtimeConfigured = !LOCAL && Boolean(cfg.apiKey && cfg.databaseURL);

function db() {
  if (!realtimeConfigured) return null;
  let app;
  try { app = getApp(APP_NAME); } catch { app = initializeApp(cfg, APP_NAME); }
  return getDatabase(app);
}

// Calls cb() on every server-side change (after the initial value). Returns an
// unsubscribe fn.
export function onRev(cb: () => void): () => void {
  const d = db();
  if (!d) return () => {};
  let last: number | null = null;
  return onValue(ref(d, "meta/rev"), (snap) => {
    const v = (snap.val() as number) ?? 0;
    if (last !== null && v !== last) cb(); // fire only on an actual change
    last = v;
  }, () => {});
}
