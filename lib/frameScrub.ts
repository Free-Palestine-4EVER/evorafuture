/* ============================================================================
   EVORA — canvas frame scrub. A direct port of LILITH's site/scrubfilm.js,
   which scrubs flawlessly on the same phones this site kept failing on.

   Why this replaces the <video> scrub: scrubbing `currentTime` means asking
   iOS's media stack to cooperate, and it kept refusing in ways that are
   invisible to every browser available for testing here (autoplay refusal
   killing the decoder wake-up, seeks that never resolve, a muted video that
   seeks but never paints). A canvas + <img> has none of that surface. There is
   no decoder to wake, no gesture to satisfy, no seek to hang. It draws.

   Why this is NOT the frame stack that crashed phones before: FRAME COUNT.
   The old hero held 125 mobile / 361 desktop frames and /catalog held its own
   stack on top, all live, all touched by the scrub — comfortably over 1 GB of
   decoded bitmaps against iOS Safari's few-hundred-MB ceiling. LILITH uses 56
   frames per film and is fine. So the rule here is a hard cap (FRAME_BUDGET):
   we subsample whatever is on disk down to a fixed budget instead of loading
   every file. Fewer, evenly-spaced frames — same scroll distance, a fraction
   of the memory, and less on the wire than the video it replaces.

   The other half of staying inside the budget is drawing exactly ONE frame per
   tick, as LILITH does, so the browser decodes lazily and can evict the rest.
   Never force-decode the stack.
   ========================================================================== */

export type FrameScrubOptions = {
  /** Element the <canvas> is appended to. */
  container: HTMLElement;
  /** Frame URLs, in scrub order. Keep the count at/below FRAME_BUDGET. */
  frames: string[];
  /** Returns scrub position 0..1. Caller owns the scroll math. */
  progress: () => number;
  className?: string;
  /** Fired once a real frame has painted (hide your poster here). */
  onFirstFrame?: () => void;
  /** 0..1 as frames arrive — drives the branded Loader. */
  onProgress?: (fraction: number) => void;
  /** Reduced motion: land exactly on the scroll position, no easing drift. */
  reduce?: boolean;
  /** Per-frame easing toward the target (LILITH uses 0.16). */
  lerp?: number;
};

export type FrameScrubHandle = {
  destroy: () => void;
  loaded: () => number;
};

/* Hard ceiling on live frames per scrub. 60 frames at 720x1280 is ~221 MB of
   bitmaps if every one were decoded at once — and they are not, because we draw
   one at a time. Over a 420svh hero that is a new frame every ~46px of finger
   travel, which reads as continuous motion. Raising this is how the old crash
   comes back. */
export const FRAME_BUDGET = 60;

/** Evenly subsample a physical frame list down to at most `budget` entries,
 *  always keeping the first and last so the film starts and ends where it should. */
export function budgetFrames(total: number, src: (i: number) => string, budget = FRAME_BUDGET): string[] {
  const n = Math.min(total, budget);
  if (n <= 1) return [src(1)];
  const out: string[] = [];
  for (let k = 0; k < n; k++) {
    out.push(src(1 + Math.round((k * (total - 1)) / (n - 1))));
  }
  return out;
}

export function createFrameScrub(opts: FrameScrubOptions): FrameScrubHandle {
  const { container, frames, progress, className, onFirstFrame, onProgress, reduce = false, lerp = 0.16 } = opts;
  const N = frames.length;

  const cv = document.createElement("canvas");
  if (className) cv.className = className;
  cv.setAttribute("aria-hidden", "true");
  container.appendChild(cv);
  const ctx = cv.getContext("2d", { alpha: false });

  const imgs: HTMLImageElement[] = new Array(N);
  let loadedCount = 0;
  let render = 0;      // eased position, in frame units
  let cur = -1;        // frame index currently on the canvas
  let painted = false;
  let destroyed = false;
  let rafId = 0;

  const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));

  function size() {
    // Cap DPR at 2 — a 3x backing store on a phone triples the fill cost for
    // no visible gain on footage this soft.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = cv.getBoundingClientRect();
    const w = Math.max(1, Math.round(r.width * dpr));
    const h = Math.max(1, Math.round(r.height * dpr));
    if (cv.width === w && cv.height === h) return;
    cv.width = w; cv.height = h;
    cur = -1;                      // backing store cleared — force a redraw
    draw(Math.round(render));
  }

  /** object-fit: cover, done by hand. */
  function cover(img: HTMLImageElement) {
    if (!ctx) return;
    const cw = cv.width, ch = cv.height;
    const ir = img.naturalWidth / img.naturalHeight, cr = cw / ch;
    let dw: number, dh: number, dx: number, dy: number;
    if (cr > ir) { dw = cw; dh = cw / ir; dx = 0; dy = (ch - dh) / 2; }
    else { dh = ch; dw = ch * ir; dy = 0; dx = (cw - dw) / 2; }
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  const isReady = (i: number) => {
    const im = imgs[i];
    return !!im && im.complete && im.naturalWidth > 0;
  };

  /** Nearest loaded frame to `i`, so an early scroll shows the closest real
   *  frame instead of nothing. Returns -1 if the stack is still empty. */
  function nearestReady(i: number): number {
    if (isReady(i)) return i;
    for (let d = 1; d < N; d++) {
      if (i - d >= 0 && isReady(i - d)) return i - d;
      if (i + d < N && isReady(i + d)) return i + d;
    }
    return -1;
  }

  function draw(i: number) {
    if (destroyed || !ctx) return;
    const want = clamp(i, 0, N - 1);
    const use = nearestReady(want);
    if (use < 0 || use === cur) return;
    cur = use;
    cover(imgs[use]);
    if (!painted) { painted = true; onFirstFrame?.(); }
  }

  // ---- preload. Encoded bytes only; decoding happens on first draw. ----
  for (let i = 0; i < N; i++) {
    const im = new Image();
    im.decoding = "async";
    imgs[i] = im;
    im.onload = () => {
      loadedCount++;
      onProgress?.(loadedCount / N);
      // First frame in hand: size the canvas and paint immediately so the
      // hero is live long before the whole stack has landed.
      if (i === 0 || !painted) { size(); draw(Math.round(render)); }
    };
    im.onerror = () => { loadedCount++; onProgress?.(loadedCount / N); };
    im.src = frames[i];
  }

  // ---- the loop: one rAF, one drawn frame (LILITH's tick) ----
  const tick = () => {
    if (destroyed) return;
    const t = clamp(progress(), 0, 1) * (N - 1);
    if (reduce) render = t;
    else {
      render += (t - render) * lerp;
      if (Math.abs(t - render) < 0.01) render = t;
    }
    draw(Math.round(render));
    rafId = requestAnimationFrame(tick);
  };
  rafId = requestAnimationFrame(tick);

  const onResize = () => size();
  window.addEventListener("resize", onResize);
  window.addEventListener("orientationchange", onResize);
  size();

  return {
    loaded: () => loadedCount,
    destroy: () => {
      destroyed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      // Drop the decoded bitmaps promptly rather than waiting for GC.
      for (const im of imgs) { if (im) { im.onload = null; im.onerror = null; im.src = ""; } }
      imgs.length = 0;
      cv.remove();
    },
  };
}
