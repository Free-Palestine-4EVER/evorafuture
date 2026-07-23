/* ============================================================================
   EVORA — scroll-scrubbed <video> engine

   Replaces the frame-stack scrubber. The old approach decoded every frame of
   the sequence as a separate <img> and held them all alive:

       desktop hero  181 frames x 1920x1080x4B  ~= 1.50 GB decoded
       mobile  hero  125 frames x  720x1280x4B  ~=  461 MB decoded
       + configurator                            ~=  313 MB decoded

   iOS Safari's per-tab ceiling is a few hundred MB, so the phone evicted
   frames (blank flashes) or killed the tab outright. A <video> hands that
   problem to the platform decoder, which keeps a handful of frames alive
   instead of all of them, and turns 125-361 requests into one.

   Playback technique adapted from oso95/scroll-world's scrub-engine.js (MIT).
   We take ONLY the playback behaviours — this module never builds page DOM,
   never injects layout CSS, and never owns the scroll math. It attaches a
   single <video> to a container the caller already laid out, and asks the
   caller where the scrub is via progress(). Evora's sections, sticky
   containers and text overlays stay exactly as they are.

   The four behaviours that actually make this work on a phone:

     1. Blob source.   fetch() -> createObjectURL. A blob URL is always
                       seekable; a plain src depends on the origin honouring
                       HTTP range requests, and a partial/streaming response
                       makes currentTime seeks fail silently.
     2. Seek coalescing. Never assign currentTime while the decoder is still
                       `seeking`. A fast flick otherwise queues seeks faster
                       than they resolve and the clip freezes for good.
     3. Poster till paint. On iOS a muted video that has been seeked but never
                       played stays BLANK. So the still stays on top until the
                       first `seeked` actually fires.
     4. Gesture priming. iOS won't reliably decode a muted video until a user
                       gesture. On first touch we muted-play->pause every clip
                       so the first real seek paints instead of showing black.

   DELIBERATE DIVERGENCE FROM scroll-world: it skips loading clips entirely
   under prefers-reduced-motion. We must not. Chrome's Battery/Energy Saver
   forces prefers-reduced-motion:reduce on ordinary laptops regardless of what
   the user chose, and gating the film on it turned the hero into a dead poster
   for anyone on battery — a bug this site has already shipped and fixed once.
   A scroll-scrubbed film has no self-driven motion: it moves only when the
   user moves. So the scrub always runs; reduced-motion is honoured by killing
   the lerp (frames land exactly where the scroll is, no easing drift) and by
   the caller dropping its autoplaying copy animations.
   ========================================================================== */

export type VideoScrubOptions = {
  /** Element the <video> is appended to (position:relative/absolute container). */
  container: HTMLElement;
  /** Desktop clip URL. */
  src: string;
  /** Lighter portrait clip for phones. Falls back to `src` when absent. */
  srcMobile?: string;
  /** Media query deciding which source to use. */
  mobileQuery?: string;
  /** Returns scrub position 0..1. Caller owns the scroll math. */
  progress: () => number;
  /** class applied to the created <video>. */
  className?: string;
  /** Called once metadata is known and the clip can be scrubbed. */
  onReady?: () => void;
  /** Called once the first real frame has painted (hide your poster here). */
  onFirstFrame?: () => void;
  /** Called if the clip cannot be loaded at all (caller should keep its poster). */
  onError?: () => void;
  /** Honour reduced motion by disabling the easing lerp (default true). */
  reduce?: boolean;
  /** Per-frame easing toward the scroll target. */
  lerp?: number;
  /**
   * Download the whole clip as a Blob before scrubbing (default true). A blob
   * has the entire file buffered, so every seek is instant — which is what
   * scrubbing needs. Setting this false streams from a plain src, which reaches
   * metadata sooner but freezes the moment the user scrubs past the buffered
   * region (the seek never completes and the coalescing gate locks). Only turn
   * it off if you have measured that streaming scrubs cleanly for your assets.
   */
  useBlob?: boolean;
};

export type VideoScrubHandle = {
  /** The created element, or null before the blob resolves. */
  video: () => HTMLVideoElement | null;
  /** True once metadata is known. */
  ready: () => boolean;
  destroy: () => void;
};

const DEFAULT_MOBILE_QUERY = "(max-width: 768px)";

export function createVideoScrub(opts: VideoScrubOptions): VideoScrubHandle {
  const {
    container,
    src,
    srcMobile,
    mobileQuery = DEFAULT_MOBILE_QUERY,
    progress,
    className,
    onReady,
    onFirstFrame,
    onError,
    reduce = false,
    lerp = 0.18,
    useBlob = true,
  } = opts;

  const mq = typeof window !== "undefined" && window.matchMedia ? window.matchMedia(mobileQuery) : null;
  const isMobile = () => !!mq && mq.matches;

  let destroyed = false;
  let rafId = 0;
  let video: HTMLVideoElement | null = null;
  let objectUrl = "";
  let ready = false;
  let painted = false;
  let cur = 0;
  let seekStartedAt = 0; // when the in-flight seek was issued (for the stale-seek escape)
  let userReady = false;

  const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const perfNow = () =>
    typeof performance !== "undefined" && performance.now ? performance.now() : Date.now();

  /* ---- iOS gesture priming -------------------------------------------------
     A muted video on iOS will not reliably decode until the page has seen a
     user gesture. Priming it (play immediately followed by pause) on the first
     touch means the first seek paints a frame instead of black. Harmless
     elsewhere. */
  const prime = (v: HTMLVideoElement | null) => {
    if (!v || !isMobile()) return;
    try {
      const p = v.play();
      if (p && typeof p.then === "function") {
        p.then(() => { try { v.pause(); } catch { /* ignore */ } }).catch(() => { /* ignore */ });
      }
    } catch { /* ignore */ }
  };
  const onFirstGesture = () => {
    if (userReady) return;
    userReady = true;
    prime(video);
  };
  window.addEventListener("pointerdown", onFirstGesture, { once: true, passive: true });
  window.addEventListener("touchstart", onFirstGesture, { once: true, passive: true });

  /* ---- source strategy -----------------------------------------------------
     Load the clip as a Blob, which scroll-world does for a reason that turns
     out to be essential, not incidental: a blob has the WHOLE file buffered, so
     every seek resolves instantly. A streamed src only has part of the file
     buffered, and seeking to an un-buffered region leaves the element stuck in
     `seeking = true` until that region downloads — which permanently trips the
     seek-coalescing gate below (we never issue a seek while one is pending), so
     the scrub freezes on the last completed frame. Measured live: streaming
     froze the hero at currentTime 1.85s while the scroll ran to the end.

     The cost of the blob is the up-front download before anything can scrub.
     We pay it two ways: the clips were re-encoded small (hero-c 16MB -> 7.6MB,
     everything else 3-6MB) and immutably cached, so after the first visit it is
     instant; and the page never waits on it — the poster <img> (the film's
     first frame) stays up until the blob is ready, and the caller reveals on
     onFirstFrame. Nothing is blocked; only the scrub animation itself waits. */
  const url = isMobile() && srcMobile ? srcMobile : src;

  const attach = (objectSrc: string) => {
      if (destroyed) return;
      const v = document.createElement("video");
      if (className) v.className = className;
      v.muted = true;
      v.defaultMuted = true;
      v.playsInline = true;
      v.preload = "auto";
      v.controls = false;
      // The properties above are not enough on iOS — the ATTRIBUTES must be
      // present in the markup for inline muted playback to be permitted.
      v.setAttribute("muted", "");
      v.setAttribute("playsinline", "");
      v.setAttribute("webkit-playsinline", "");
      v.setAttribute("aria-hidden", "true");
      v.setAttribute("disableremoteplayback", "");

      v.src = objectSrc;

      v.addEventListener("loadedmetadata", () => {
        if (destroyed) return;
        ready = true;
        onReady?.();
        // Force ONE seek so a real frame paints. Without this the poster never
        // lifts at the top of the page: the scrub target there is 0 and
        // currentTime is already 0, so the loop never issues a seek, `seeked`
        // never fires, and the reveal never happens until the user scrolls.
        try { v.currentTime = Math.max(0.001, clamp(progress(), 0, 0.999) * (v.duration || 1)); }
        catch { /* not seekable yet — the rAF loop will retry */ }
      });

      // Clear the stale-seek timer as soon as a seek actually resolves, so the
      // escape hatch only ever triggers on a genuinely hung seek.
      v.addEventListener("seeked", () => { seekStartedAt = 0; });

      // Reveal only once a real frame has painted (see header note 3).
      v.addEventListener(
        "seeked",
        () => {
          if (destroyed || painted) return;
          painted = true;
          onFirstFrame?.();
        },
        { once: true },
      );

      v.addEventListener("loadeddata", () => {
        try { v.pause(); } catch { /* ignore */ }
        if (userReady) prime(v);
      });

      v.addEventListener("error", () => { if (!destroyed) onError?.(); });

      container.appendChild(v);
      video = v;
  };

  if (useBlob) {
    fetch(url)
      .then((r) => (r.ok ? r.blob() : Promise.reject(new Error(String(r.status)))))
      .then((blob) => {
        if (destroyed) return;
        objectUrl = URL.createObjectURL(blob);
        attach(objectUrl);
      })
      .catch(() => { if (!destroyed) onError?.(); });
  } else {
    attach(url);
  }

  /* ---- the scrub loop ------------------------------------------------------
     One rAF for this clip. Reads the caller's progress every frame so it is
     input-agnostic (wheel, touch, Lenis momentum) rather than listening for
     scroll events, which misreport under Lenis on phones. */
  const tick = () => {
    if (destroyed) return;
    const v = video;
    if (v && ready) {
      const target = clamp(progress());

      // Coarser seek step on phones: every seek is a decode, and a phone
      // decoder cannot service a desktop-density seek stream.
      const eps = isMobile() ? 0.02 : 0.008;

      // Keep lerping even while a seek is outstanding, so when the decoder
      // frees up we snap straight to the newest position rather than
      // replaying a backlog. Under reduced motion we skip the easing entirely
      // and track the scroll exactly.
      cur += (target - cur) * (reduce ? 1 : lerp);

      // Normally we never issue a seek while one is pending (coalescing — a
      // phone decoder can't service a pile-up). But if a seek has been pending
      // too long it has effectively hung (e.g. a seek into an un-buffered
      // region), and blindly waiting would freeze the scrub. After a stall we
      // let a fresh seek through; the browser supersedes the stuck one.
      const now = perfNow();
      const stalled = v.seeking && seekStartedAt && now - seekStartedAt > 400;
      if (!v.seeking || stalled) {
        const dur = v.duration;
        if (dur && isFinite(dur) && dur > 0) {
          // 0.999 not 1: seeking to exactly duration can land past the last
          // decodable frame and paint nothing on some decoders.
          const t = clamp(cur, 0, 0.999) * dur;
          if (Math.abs(v.currentTime - t) > eps) {
            try { v.currentTime = t; seekStartedAt = now; } catch { /* ignore */ }
          }
        }
      }
    }
    rafId = requestAnimationFrame(tick);
  };
  rafId = requestAnimationFrame(tick);

  return {
    video: () => video,
    ready: () => ready,
    destroy: () => {
      destroyed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointerdown", onFirstGesture);
      window.removeEventListener("touchstart", onFirstGesture);
      const v = video;
      if (v) {
        try { v.pause(); } catch { /* ignore */ }
        v.removeAttribute("src");
        try { v.load(); } catch { /* ignore */ }
        v.remove();
      }
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      video = null;
    },
  };
}
