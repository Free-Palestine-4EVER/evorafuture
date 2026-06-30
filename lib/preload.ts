/* ============================================================
   EVORA — preload bus
   A tiny module-level singleton that lets a page's hero (or any
   heavy above-the-fold component) tell the branded Loader exactly
   how many critical assets it must buffer, and how many have
   landed. The Loader subscribes and holds the curtain until the
   critical set is ready — so the page is genuinely smooth the
   instant it's revealed, instead of revealing onto a stuttering,
   still-downloading hero.

   Usage:
     preload.add(60)   // "I have 60 critical assets to load"
     preload.done()    // call once per asset as it finishes
     preload.subscribe(({ loaded, total }) => { ... })

   Only the *critical* (must-show-before-reveal) assets should be
   registered — not every frame of a long scroll film. The rest
   stream in lazily behind the curtain.
   ============================================================ */

export type PreloadSnapshot = { loaded: number; total: number };

let loaded = 0;
let total = 0;
const subscribers = new Set<(s: PreloadSnapshot) => void>();

const emit = () => {
  const snap: PreloadSnapshot = { loaded, total };
  subscribers.forEach((fn) => fn(snap));
};

export const preload = {
  /** Register `n` critical assets the Loader should wait for. */
  add(n = 1) {
    if (n <= 0) return;
    total += n;
    emit();
  },
  /** Mark `n` of those assets as loaded (clamped to `total`). */
  done(n = 1) {
    loaded = Math.min(total, loaded + n);
    emit();
  },
  /** Current snapshot. */
  get(): PreloadSnapshot {
    return { loaded, total };
  },
  /** Subscribe to progress; fires immediately with the current snapshot. Returns an unsubscribe. */
  subscribe(fn: (s: PreloadSnapshot) => void) {
    subscribers.add(fn);
    fn({ loaded, total });
    return () => {
      subscribers.delete(fn);
    };
  },
};
