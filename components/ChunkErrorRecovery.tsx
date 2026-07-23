"use client";

import { useEffect } from "react";

// Self-hosted Next.js gotcha: every rebuild mints a new build ID and new
// hashed chunk filenames, and the old ones get deleted from disk. Any tab
// left open from before a deploy that then tries to lazy-load a chunk (a
// route transition, a dynamic import) gets a 404 for a file that no longer
// exists — surfaces to the user as the page just crashing. The fix isn't to
// never rebuild; it's to catch that one specific failure and reload once so
// the tab silently picks up the new build instead of showing a broken page.
const CHUNK_ERROR = /ChunkLoadError|Loading chunk [\w-]+ failed|Failed to fetch dynamically imported module|error loading dynamically imported module/i;
const RELOAD_FLAG = "evora-chunk-reload";

function isChunkError(message?: string | null) {
  return !!message && CHUNK_ERROR.test(message);
}

function recover() {
  // Only ever auto-reload once per tab — if the fresh load hits the same
  // error, something else is wrong and we shouldn't loop forever.
  if (sessionStorage.getItem(RELOAD_FLAG)) return;
  sessionStorage.setItem(RELOAD_FLAG, "1");
  window.location.reload();
}

export default function ChunkErrorRecovery() {
  useEffect(() => {
    const onError = (e: ErrorEvent) => { if (isChunkError(e.message)) recover(); };
    const onRejection = (e: PromiseRejectionEvent) => { if (isChunkError(e.reason?.message)) recover(); };
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);
  return null;
}
