// Backend data + storage layer (server-only). The platform is fully self-hosted:
// data lives in a local JSON file (localdb.ts) and scan/plan files on the local
// disk. Firebase has been removed entirely — no firebase-admin dependency, which
// also keeps the serverless function well under Vercel's size limit. Never import
// from a client component.

import { lstatSync, mkdirSync, unlinkSync, writeFileSync } from "fs";
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

/* ---- deleting stored files ------------------------------------------------
   Until now nothing ever removed a byte from public/uploads, so the admin
   Files drawer is the first feature that turns a request parameter into an
   `unlink()`. That makes it the first place in this codebase where a crafted
   value could try to escape the uploads directory ("../../.env.local",
   "/etc/passwd", "uploads/../data/evora-db.json", a URL-encoded variant, or a
   symlink planted inside the directory pointing anywhere).

   The rule is deny-by-default, in four independent layers, any one of which is
   sufficient on its own:
     1. `path.basename` throws away every directory component, on both / and \.
     2. A strict charset test — a stored name is server-generated hex plus a
        short extension, so anything with a slash, a dot-dot, a NUL or a
        non-ASCII byte is not one of ours and is refused outright.
     3. The resolved absolute path must still sit directly inside the uploads
        directory (`path.relative` back to it must equal the bare filename).
     4. `lstat` (not `stat`) must report a regular file, so a symlink is never
        followed and is never unlinked.
   Anything that fails returns false; only a real file inside the directory is
   ever removed. */
const UPLOADS_DIR = () => path.join(process.cwd(), "public", "uploads");
const SAFE_NAME = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;

/** Absolute path of a stored upload, or null when `name` is not a plain file
 *  name sitting directly inside public/uploads. */
export function resolveStoredFile(name: string): string | null {
  const raw = String(name || "");
  if (!raw || raw.includes("\0")) return null;
  const base = path.basename(raw.replace(/\\/g, "/"));
  if (!SAFE_NAME.test(base) || base === "." || base === ".." || base.includes("..")) return null;
  const dir = UPLOADS_DIR();
  const abs = path.resolve(dir, base);
  const rel = path.relative(dir, abs);
  if (rel !== base || rel.startsWith("..") || path.isAbsolute(rel)) return null;
  return abs;
}

/** Size in bytes of a stored upload, or -1 when it is not a regular file
 *  inside public/uploads. Doubles as the existence check, and is read off the
 *  disk rather than taken from the client so a record can never claim a size
 *  the file does not have. */
export function storedFileSize(name: string): number {
  const abs = resolveStoredFile(name);
  if (!abs) return -1;
  try { const st = lstatSync(abs); return st.isFile() ? st.size : -1; } catch { return -1; }
}

/** True when the named file really exists on disk as a regular file. Used to
 *  refuse recording an upload that never landed. */
export function storedFileExists(name: string): boolean {
  return storedFileSize(name) >= 0;
}

/** Remove a stored upload from disk. Returns true when a file was deleted,
 *  false when the name is not a legal stored name or nothing was there (an
 *  already-missing file must not block the DB row from being cleaned up).
 *  Any OTHER filesystem error (permissions, read-only disk) is thrown so the
 *  route answers 500 and the row survives — a silent failure here would leave
 *  the byte on disk with nothing left pointing at it. */
export function removeStoredFile(name: string): boolean {
  const abs = resolveStoredFile(name);
  if (!abs) return false;
  try {
    if (!lstatSync(abs).isFile()) return false; // symlink / directory → never touch
    unlinkSync(abs);
    return true;
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return false;
    throw e;
  }
}
