// Backend data + storage layer (server-only). The platform is fully self-hosted:
// data lives in a local JSON file (localdb.ts) and scan/plan files on the local
// disk. Firebase has been removed entirely — no firebase-admin dependency, which
// also keeps the serverless function well under Vercel's size limit. Never import
// from a client component.

import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import { localDb } from "./localdb";

// Structural type covering the tiny RTDB-style slice serverdb.ts uses; localDb
// implements it.
type RefLike = {
  get(): Promise<{ val(): unknown }>;
  set(v: unknown): Promise<unknown>;
  update(v: Record<string, unknown>): Promise<unknown>;
  remove(): Promise<unknown>;
};
type DbLike = { ref(path: string): RefLike };

export const STORAGE_BUCKET = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "";

export function rtdb(): DbLike {
  return localDb as unknown as DbLike;
}

// Write bytes to the app's public/ dir and return a URL served by this same
// server. `publicBase` (the incoming request origin) makes the URL absolute so
// the phone app can fetch it, and keeps it portable to any machine/IP with no
// config — falls back to EVORA_PUBLIC_BASE, then to a same-origin relative URL.
export async function uploadToStorage(name: string, buf: Buffer, _contentType: string, publicBase?: string): Promise<string> {
  const rel = path.join("uploads", name.replace(/^uploads\//, ""));
  const abs = path.join(process.cwd(), "public", rel);
  mkdirSync(path.dirname(abs), { recursive: true });
  writeFileSync(abs, buf);
  const base = (publicBase || process.env.EVORA_PUBLIC_BASE || "").replace(/\/+$/, "");
  return `${base}/${rel}`;
}
