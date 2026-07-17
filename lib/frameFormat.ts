"use client";

/* ============================================================
   Frame-sequence format resolution.

   Every scroll-scrub sequence (hero + configurator) ships twice:
     frame_XXXX.avif  — primary, ~1/4 the bytes
     frame_XXXX.webp  — fallback for browsers that can't decode AVIF
                        (old Safari / older Android devices)

   We probe AVIF support ONCE, asynchronously, then every loader
   builds its frame URLs with the resolved extension. The probe is
   a tiny 1x1 AVIF (the canonical Modernizr test image) — decoding
   it succeeds only where the browser really supports AVIF.
   ============================================================ */

const AVIF_PROBE =
  "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=";

export type FrameExt = "avif" | "webp";

let cached: Promise<FrameExt> | null = null;

/** Resolve the best frame extension this browser can decode. Cached. */
export function resolveFrameExt(): Promise<FrameExt> {
  if (cached) return cached;
  cached = new Promise<FrameExt>((resolve) => {
    if (typeof window === "undefined" || typeof Image === "undefined") {
      resolve("webp");
      return;
    }
    let settled = false;
    const finish = (ext: FrameExt) => {
      if (settled) return;
      settled = true;
      resolve(ext);
    };
    const img = new Image();
    img.onload = () => finish(img.width > 0 && img.height > 0 ? "avif" : "webp");
    img.onerror = () => finish("webp");
    img.src = AVIF_PROBE;
    // Some old Safari builds never fire load/error on a data-URI probe; without
    // this the whole frame-stack loader (which runs inside this promise) would
    // never release its slots and the branded curtain would hang to its hard cap.
    window.setTimeout(() => finish("webp"), 1500);
  });
  return cached;
}

/** Synchronous best-guess for first render (static posters). Defaults to the
 *  universally-safe webp; the live scrub upgrades to avif once resolved. */
export const SAFE_FRAME_EXT: FrameExt = "webp";
