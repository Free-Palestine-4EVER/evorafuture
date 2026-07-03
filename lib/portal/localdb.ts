// Self-hosted local database — a drop-in replacement for the Firebase Realtime
// Database that stores everything in a single JSON file on disk. Implements only
// the slice of the RTDB Reference API that serverdb.ts uses:
//   ref(path).get() -> { val() }, .set(v), .update(partial), .remove()
//
// Why: the whole platform (clients, projects, journey, leads) can then run with
// ZERO Firebase — on this Mac now, and later on the studio's own PC. Flip on
// with EVORA_LOCAL_DB=1. Realtime still works: mutations emit to the in-process
// bus that the SSE /api/portal/events endpoint already serves.
//
// Concurrency: this backend assumes a single Node process (the self-hosted
// server). Writes are serialized through a promise chain and flushed atomically
// (temp file + rename) so a crash mid-write never corrupts the store.

import { readFileSync, writeFileSync, renameSync, mkdirSync } from "fs";
import path from "path";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Json = any;

const FILE = process.env.EVORA_DB_FILE || path.join(process.cwd(), "data", "evora-db.json");

let cache: Record<string, Json> | null = null;
let writeChain: Promise<void> = Promise.resolve();

function root(): Record<string, Json> {
  if (cache) return cache;
  try { cache = JSON.parse(readFileSync(FILE, "utf8")); } catch { cache = {}; }
  return cache!;
}

function flush(): Promise<void> {
  const snapshot = JSON.stringify(cache ?? {});
  writeChain = writeChain.then(() => {
    mkdirSync(path.dirname(FILE), { recursive: true });
    const tmp = `${FILE}.tmp`;
    writeFileSync(tmp, snapshot);
    renameSync(tmp, FILE);
  }).catch(() => { /* keep the chain alive on a failed flush */ });
  return writeChain;
}

const segs = (p: string): string[] => p.split("/").filter(Boolean);
const clone = <T>(v: T): T => (v == null ? v : JSON.parse(JSON.stringify(v)));

function getAt(p: string): Json {
  let cur: Json = root();
  for (const s of segs(p)) {
    if (cur == null || typeof cur !== "object") return null;
    cur = cur[s];
  }
  return cur === undefined ? null : cur;
}

function setAt(p: string, val: Json) {
  const parts = segs(p);
  let cur: Json = root();
  for (let i = 0; i < parts.length - 1; i++) {
    const k = parts[i];
    if (cur[k] == null || typeof cur[k] !== "object") cur[k] = {};
    cur = cur[k];
  }
  cur[parts[parts.length - 1]] = val;
}

function removeAt(p: string) {
  const parts = segs(p);
  let cur: Json = root();
  for (let i = 0; i < parts.length - 1; i++) {
    const k = parts[i];
    if (cur[k] == null || typeof cur[k] !== "object") return;
    cur = cur[k];
  }
  delete cur[parts[parts.length - 1]];
}

function ref(p: string) {
  return {
    async get() { const v = getAt(p); return { val: () => clone(v) }; },
    async set(v: Json) { setAt(p, clone(v)); await flush(); },
    async update(partial: Record<string, Json>) {
      const cur = getAt(p);
      const merged = cur && typeof cur === "object" ? { ...cur, ...partial } : { ...partial };
      setAt(p, clone(merged));
      await flush();
    },
    async remove() { removeAt(p); await flush(); },
  };
}

export const localDb = { ref };

// Migration helpers: overwrite the whole store (used once to import the existing
// cloud data) and read it back.
export async function localDbReplaceAll(data: Record<string, Json>): Promise<void> {
  cache = data || {};
  await flush();
}
export function localDbDump(): Record<string, Json> {
  return clone(root());
}
