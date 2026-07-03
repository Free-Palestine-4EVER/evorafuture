// One-time: snapshot the entire cloud Realtime Database into the local JSON
// store (data/evora-db.json), so going fully local keeps every client, project,
// scan and the admin login. This is the LAST Firebase read; after it, set
// EVORA_LOCAL_DB=1 and nothing touches Firebase again.

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import path from "path";

const root = process.cwd();
const sa = JSON.parse(readFileSync(path.join(root, "service-account.json"), "utf8"));
const DB_URL = process.env.FIREBASE_DB_URL || "https://evorafuture-bdb21-default-rtdb.firebaseio.com";

const app = getApps()[0] ?? initializeApp({ credential: cert(sa), databaseURL: DB_URL });
const snap = await getDatabase(app).ref("/").get();
const data = snap.val() || {};

const outDir = path.join(root, "data");
mkdirSync(outDir, { recursive: true });
const outFile = process.env.EVORA_DB_FILE || path.join(outDir, "evora-db.json");
writeFileSync(outFile, JSON.stringify(data));

const counts = Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v && typeof v === "object" ? Object.keys(v).length : 1]));
console.log("Migrated cloud → local:", outFile);
console.log("Top-level nodes:", counts);
process.exit(0);
