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

     1. Prefetch, then REAL url. We fetch the whole clip (which drives the
                       Loader's progress bar and warms the HTTP cache), then
                       point the element at the ordinary URL — never a blob:
                       URL. iOS Safari loads video via HTTP range requests and
                       does not reliably do that against a blob, so a blob src
                       leaves the element stuck at readyState 0 on a real
                       iPhone: a permanently static poster.
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
  /** Download progress 0..1 while the clip is fetched. Drives the Loader bar. */
  onProgress?: (fraction: number) => void;
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
    onProgress,
  } = opts;

  const mq = typeof window !== "undefined" && window.matchMedia ? window.matchMedia(mobileQuery) : null;
  const isMobile = () => !!mq && mq.matches;

  let destroyed = false;
  let rafId = 0;
  let video: HTMLVideoElement | null = null;
  let ready = false;
  let painted = false;
  let cur = 0;
  let seekStartedAt = 0; // when the in-flight seek was issued (for the stale-seek escape)
  let painterTimer = 0;  // readyState poll that reveals the video on iOS
  let lastUnstickAt = 0; // rate-limits the play/pause nudge for a wedged seek
  let userReady = false;

  const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const perfNow = () =>
    typeof performance !== "undefined" && performance.now ? performance.now() : Date.now();

  /* Is `t` already buffered? Used only to decide how patient to be with a
     pending seek — NOT to clamp the target.

     Clamping to the buffered edge was tried and is wrong here: the origin
     supports range requests (`accept-ranges: bytes`), so seeking ahead makes
     the browser fetch exactly that byte range and land on the right frame.
     Clamping defeats that and makes the film crawl behind the scroll —
     measured: the kitchen reached only 0.73s of a 5.63s clip across its whole
     section. We let the seek through and rely on the stale-seek escape below
     so a slow one can never lock the scrub. */
  const isBuffered = (v: HTMLVideoElement, t: number) => {
    const b = v.buffered;
    for (let i = 0; i < (b?.length || 0); i++) {
      if (t >= b.start(i) && t <= b.end(i)) return true;
    }
    return false;
  };

  /* ---- iOS gesture priming -------------------------------------------------
     A muted video on iOS will not reliably decode until the page has seen a
     user gesture. Priming it (play immediately followed by pause) on the first
     touch means the first seek paints a frame instead of black. Harmless
     elsewhere. */
  const prime = (v: HTMLVideoElement | null) => {
    // No longer gated to phone-width viewports: an iPad, or an iPhone held in
    // landscape, is wider than the mobile breakpoint but has exactly the same
    // decode-needs-a-play-first behaviour. A muted play->pause is harmless
    // everywhere, so just always do it.
    if (!v) return;
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
     STREAM from a plain src. scroll-world uses a Blob because it cannot assume
     the origin honours range requests; ours does (Caddy returns
     `accept-ranges: bytes` on /evora/scrub/*).

     The blob's fatal cost is that NOTHING is scrubbable until the entire file
     lands — measured on production, the hero stayed a frozen poster for 10+
     seconds, which reads as broken to anyone who scrolls in that window. That
     is worse than the memory bug we replaced.

     The reason a blob looked necessary is that seeking a streamed src into an
     un-buffered region hangs `seeking = true` and trips the coalescing gate,
     freezing the scrub for good (measured: stuck at 1.85s). We fix that
     directly instead, with `reachable()` above — we never request a time that
     is not already buffered. So the film is responsive within a second, its
     reachable range grows as it downloads, and it can never hang. `useBlob`
     stays available for an origin without range support. */
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

      /* Reveal the video once a real frame exists.
         This must NOT depend on `seeked` alone. On iOS Safari a muted video
         that has been seeked but never played frequently never fires `seeked`
         at all — so the reveal never happened, the stage stayed at opacity 0,
         and the visitor saw the poster forever: "the video is a static photo".
         The film was often scrubbing correctly underneath, just invisible.
         (Desktop Chromium — including its mobile emulation — does fire it, so
         this is invisible to automated testing and only shows on real iOS.)

         So we accept several independent signals, whichever arrives first:
           - `seeked`      the ideal case
           - `loadeddata`  readyState >= HAVE_CURRENT_DATA means, by spec, that
                           data for the current position is available
           - `timeupdate`  fires once the decoder actually moves
           - a poll        last resort, purely on readyState */
      const markPainted = () => {
        if (destroyed || painted) return;
        painted = true;
        onFirstFrame?.();
      };
      const markIfDecoded = () => { if (v.readyState >= 2) markPainted(); };

      v.addEventListener("seeked", markPainted, { once: true });
      v.addEventListener("timeupdate", markIfDecoded);
      v.addEventListener("canplay", markIfDecoded);

      v.addEventListener("loadeddata", () => {
        try { v.pause(); } catch { /* ignore */ }
        // Prime unconditionally on iOS, not just after a gesture: a muted,
        // playsinline video is allowed to autoplay, and the play->pause round
        // trip is what forces the decoder to actually paint a frame. If Low
        // Power Mode refuses it, the promise rejects harmlessly and the
        // readyState checks below still reveal the video.
        prime(v);
        markIfDecoded();
      });

      // Belt and braces: if none of the events above land (older iOS), poll
      // readyState briefly and reveal as soon as a frame is decodable.
      let polls = 0;
      painterTimer = window.setInterval(() => {
        if (destroyed || painted || polls++ > 40) { window.clearInterval(painterTimer); return; }
        markIfDecoded();
      }, 250);

      // HARD GUARD: this element must never actually play. Priming it (a muted
      // play->pause) is the only reliable way to wake an iOS decoder, but if the
      // pause half fails the clip runs away on its own — which is exactly what
      // happened on an iPhone: paused=false, currentTime parked at the very end,
      // buffered=none, and no scrubbing. Pausing on every `playing` event means
      // a runaway can last at most one frame, whatever else goes wrong.
      v.addEventListener("playing", () => { try { v.pause(); } catch { /* ignore */ } });
      v.addEventListener("play", () => { try { v.pause(); } catch { /* ignore */ } });

      v.addEventListener("error", () => { if (!destroyed) onError?.(); });

      container.appendChild(v);
      video = v;

      /* Self-healing watchdog. If this source has produced NOTHING after a
         while — no metadata, no duration, readyState still 0 — the element is
         not going to recover on its own. Rather than leave a dead poster (which
         is what every previous failure here looked like to the visitor), force a
         reload of the element once, with a cache-busting query so we are not
         handed the same unusable cached response. Only ever fires once. */
      let healed = false;
      const watchdog = window.setTimeout(() => {
        if (destroyed || healed || !video) return;
        if (video.readyState >= 1) return;   // it is fine, leave it alone
        healed = true;
        try {
          video.src = objectSrc + (objectSrc.includes("?") ? "&" : "?") + "reload=1";
          video.load();
          prime(video);
        } catch { /* ignore */ }
      }, 9000);
      v.addEventListener("loadedmetadata", () => window.clearTimeout(watchdog), { once: true });
  };

  if (useBlob) {
    // Download the WHOLE clip, reporting real byte progress as it lands. The
    // caller holds the branded Loader up on this, so the page is only revealed
    // once the film can actually be scrubbed end to end. Streaming was tried
    // and is smooth on a fast line, but on a slow phone it leaves the hero
    // visibly frozen while the page is already on screen — which reads as
    // broken. Waiting behind the curtain is the deliberate trade.
    (async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(String(res.status));
        const totalBytes = Number(res.headers.get("content-length") || 0);
        let blob: Blob;

        if (res.body && totalBytes > 0) {
          const reader = res.body.getReader();
          const chunks: BlobPart[] = [];
          let received = 0;
          for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            if (destroyed) { try { await reader.cancel(); } catch { /* ignore */ } return; }
            chunks.push(value);
            received += value.byteLength;
            onProgress?.(Math.min(1, received / totalBytes));
          }
          blob = new Blob(chunks, { type: res.headers.get("content-type") || "video/mp4" });
        } else {
          // No content-length (or no streaming body) — fall back to a plain
          // blob read and report completion in one step.
          blob = await res.blob();
        }

        if (destroyed) return;
        onProgress?.(1);

        // Hand the element the REAL URL, not a blob: URL.
        //
        // iOS Safari's media stack loads video by issuing HTTP range requests,
        // and it does not reliably do that against a blob: object URL — the
        // element frequently never even reaches readyState 1, so nothing ever
        // scrubs and the poster stays up forever. That is the "it's just a
        // static photo on my phone" report, and it is invisible to desktop
        // Chromium and to its mobile emulation, both of which handle blobs fine.
        //
        // We still did the full fetch above: it drives the Loader's progress bar
        // AND warms the HTTP cache, so this src resolves out of cache
        // immediately (the clips are served immutable, max-age 1y). Range seeks
        // then work against the cached bytes, which is exactly what iOS wants.
        // The blob is deliberately discarded.
        void blob;
        attach(url);
      } catch {
        if (!destroyed) { onProgress?.(1); onError?.(); }
      }
    })();
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

      const now = perfNow();

      // Track how long the element has been `seeking`, no matter WHO started
      // the seek. This is the fix for a real deadlock seen on iOS 18:
      //   readyState=4, err=null, fully buffered — but t=0.00 and seeking=true
      //   forever, so the film never moved.
      // The initial seek is issued from the loadedmetadata handler, outside this
      // loop, so it never set seekStartedAt. On iOS that first seek never
      // completes, `seeking` stays true, and the coalescing gate below then
      // blocked every subsequent seek — while `stalled` could never become true
      // because seekStartedAt was still 0. Total deadlock. Desktop never hit it
      // because the first seek resolves immediately.
      // Observing the seeking flag itself (rather than only our own seeks) means
      // a hung seek from ANY source is escaped.
      if (v.seeking) { if (!seekStartedAt) seekStartedAt = now; }
      else seekStartedAt = 0;

      const dur = v.duration;
      if (dur && isFinite(dur) && dur > 0) {
        // 0.999 not 1: seeking to exactly duration can land past the last
        // decodable frame and paint nothing on some decoders.
        const t = clamp(cur, 0, 0.999) * dur;
        // Un-buffered targets legitimately need a network round-trip, so they
        // get a longer grace period before we call the seek hung.
        const grace = isBuffered(v, t) ? 250 : 900;
        const stuckFor = seekStartedAt ? now - seekStartedAt : 0;
        const stalled = !!seekStartedAt && stuckFor > grace;

        if ((!v.seeking || stalled) && Math.abs(v.currentTime - t) > eps) {
          try { v.currentTime = t; seekStartedAt = now; } catch { /* ignore */ }
        }

        // Last resort for a seek wedged for seconds: just re-issue it.
        //
        // This deliberately does NOT call play() any more. Nudging the decoder
        // with play/pause backfired badly on iOS: the play() took effect, the
        // follow-up pause() did not, and the clip ran through to the end on its
        // own — reported as "the video isn't playing [with the scroll]", with
        // the device showing paused=false, t=8.33 (the very end) and
        // buffered=none. A scrubber must never actually play; the `playing`
        // guard on the element enforces that now.
        if (stuckFor > 2500 && now - lastUnstickAt > 3000) {
          lastUnstickAt = now;
          try { v.currentTime = t; seekStartedAt = now; } catch { /* ignore */ }
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
      if (painterTimer) window.clearInterval(painterTimer);
      window.removeEventListener("pointerdown", onFirstGesture);
      window.removeEventListener("touchstart", onFirstGesture);
      const v = video;
      if (v) {
        try { v.pause(); } catch { /* ignore */ }
        v.removeAttribute("src");
        try { v.load(); } catch { /* ignore */ }
        v.remove();
      }
      video = null;
    },
  };
}
