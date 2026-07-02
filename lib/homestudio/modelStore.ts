"use client";

// Offline storage for the user's imported 3D models (GLB/glTF bytes) in the
// browser's IndexedDB. This removes the last server dependency so Puffer can ship
// as a standalone, fully-offline app (no API routes, no uploads to disk).

const DB_NAME = "puffer-models";
const STORE = "models";

let dbp: Promise<IDBDatabase> | null = null;
function db(): Promise<IDBDatabase> {
  if (dbp) return dbp;
  dbp = new Promise((resolve, reject) => {
    const r = indexedDB.open(DB_NAME, 1);
    r.onupgradeneeded = () => { if (!r.result.objectStoreNames.contains(STORE)) r.result.createObjectStore(STORE); };
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
  return dbp;
}

export async function putModel(key: string, bytes: ArrayBuffer): Promise<void> {
  const d = await db();
  await new Promise<void>((resolve, reject) => {
    const tx = d.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(bytes, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function getBytes(key: string): Promise<ArrayBuffer | null> {
  const d = await db();
  return new Promise((resolve, reject) => {
    const tx = d.transaction(STORE, "readonly");
    const rq = tx.objectStore(STORE).get(key);
    rq.onsuccess = () => resolve((rq.result as ArrayBuffer) ?? null);
    rq.onerror = () => reject(rq.error);
  });
}

// object URLs are session-scoped; cache so we don't recreate per render
const urlCache = new Map<string, string>();
export async function getModelURL(key: string): Promise<string | null> {
  const cached = urlCache.get(key);
  if (cached) return cached;
  const bytes = await getBytes(key);
  if (!bytes) return null;
  const url = URL.createObjectURL(new Blob([bytes], { type: "model/gltf-binary" }));
  urlCache.set(key, url);
  return url;
}

export async function deleteModel(key: string): Promise<void> {
  const u = urlCache.get(key);
  if (u) { try { URL.revokeObjectURL(u); } catch {} urlCache.delete(key); }
  const d = await db();
  await new Promise<void>((resolve, reject) => {
    const tx = d.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
