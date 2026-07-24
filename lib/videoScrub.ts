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

     1. STREAM from the real url. One download, scrubbable within ~200ms.
                       Neither prefetching-then-reattaching nor a blob: URL is
                       used, and both were measured to be actively worse — see
                       "SOURCE STRATEGY" below for the numbers.
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
   * Gate deciding when the clip may start downloading. Polled until it first
   * returns true, at which point the <video> is attached and streaming starts.
   * Use it for a film well below the fold so it does not race the hero for a
   * phone's bandwidth. Omit to start immediately (the right choice above the
   * fold). A caller that defers MUST NOT also hold the page's loader on this
   * clip, or the page would wait for a film nobody has scrolled to yet.
   */
  shouldLoad?: () => boolean;
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
    onProgress,
    shouldLoad,
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
  let priming = false;   // a prime() play->pause is in flight; runaway guard stands down
  let primed = false;    // set only once a play() has actually been ALLOWED
  let primeTries = 0;    // reported via ?vdebug=1 — how many attempts iOS refused

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
    //
    // `priming` exists because the runaway guard below (pause on every `play`)
    // used to fire the instant prime() called play() — the guard was added last
    // and silently cancelled the only mechanism that wakes an iOS decoder, so
    // the clip could still come up blank. The flag lets exactly one play->pause
    // round trip through, long enough for the decoder to paint one frame, and
    // the guard re-arms immediately after.
    if (!v || primed) return;
    priming = true;
    // `primed` is set ONLY on success. This matters more than it looks: the
    // first prime() attempt happens on `loadeddata`, which on a real iPhone is
    // usually BEFORE any user gesture. iOS may reject that play() outright
    // (Low Power Mode, or Settings > Safari auto-play). Marking primed
    // up-front would then permanently disable the gesture retry below — i.e.
    // the one mechanism that wakes an iOS decoder would be dead, and the clip
    // stays a static poster forever. Desktop WebKit (including Playwright's,
    // which is otherwise the best proxy for iOS available) permits muted
    // autoplay with no gesture, so it always succeeds there and never exposes
    // this. Retry on every gesture until one actually takes.
    primeTries++;
    const settle = (ok: boolean) => {
      priming = false;
      if (ok) { primed = true; detachGestures(); }
      // Surfaced on the element so the ?vdebug=1 panel can report, from a real
      // phone, whether the decoder was ever successfully woken. Costs nothing.
      try { v.dataset.prime = `${ok ? "ok" : "refused"}:${primeTries}:${userReady ? "gesture" : "auto"}`; }
      catch { /* ignore */ }
      try { v.pause(); } catch { /* ignore */ }
    };
    // Belt and braces: however the promise behaves, priming is over quickly.
    window.setTimeout(() => { if (priming) settle(!v.paused); }, 220);
    try {
      const p = v.play();
      if (p && typeof p.then === "function") {
        p.then(() => requestAnimationFrame(() => settle(true))).catch(() => settle(false));
      } else {
        // Legacy no-promise play(): if it took, the element is no longer paused.
        requestAnimationFrame(() => settle(!v.paused));
      }
    } catch { settle(false); }
  };
  // NOT `{ once: true }`. A single attempt is not enough — the first gesture can
  // land while the element is still loading, or iOS can refuse it once and allow
  // it a moment later. Keep trying on every gesture until one succeeds, then
  // unbind. `userReady` still gates priming a clip that attaches later (the
  // deferred configurator film), which must not be primed before any gesture.
  const onGesture = () => {
    userReady = true;
    prime(video);
  };
  function detachGestures() {
    window.removeEventListener("pointerdown", onGesture);
    window.removeEventListener("touchstart", onGesture);
    window.removeEventListener("touchend", onGesture);
  }
  window.addEventListener("pointerdown", onGesture, { passive: true });
  window.addEventListener("touchstart", onGesture, { passive: true });
  window.addEventListener("touchend", onGesture, { passive: true });

  /* ---- source strategy -----------------------------------------------------
     STREAM from a plain src. One request, scrubbable almost immediately, and
     the decoder pulls exactly the byte ranges the scrub asks for.

     All three candidates were measured in real WebKit (Playwright's, which is
     the same engine as iOS Safari — desktop Chromium and its device emulation
     are BLIND to every bug in this file). iPhone 13 viewport, the real
     hero-shared-mobile.mp4, served same-origin with range support:

       throttled to 1.5 MB/s, user waits for the page to settle
         stream           first frame   170ms    3.87 MB on the wire
         prefetch+reattach first frame  2704ms    7.74 MB  <- every byte twice
         blob             first frame  2666ms    3.87 MB

       throttled to 400 KB/s, user starts scrolling after 500ms (the real case)
         stream           tracked the scroll perfectly, 0 blank samples of 16
         prefetch+reattach 16 of 16 samples BLANK — no <video> element existed
         blob              16 of 16 samples BLANK

     The prefetch-then-reattach strategy this replaces was built on the
     assumption that `fetch()`-ing the clip warms the HTTP cache so the media
     element then resolves out of it. That is FALSE in WebKit: its media loader
     runs on a separate cache path (and production's `etag: W/"..."` is weak, so
     it cannot validate a range request against a cached entry either). Verified
     against production — every clip was pulled down twice, 13.64 MB of MP4 for
     7.3 MB of assets, all of it behind a blocking loader curtain. On a slow
     phone that is precisely the "the scroll video is just a static photo"
     report: the element is not merely un-painted, it does not exist yet.

     The fear that motivated the blob — that seeking a streamed src into an
     un-buffered region hangs `seeking = true` forever and trips the coalescing
     gate — is real but is already handled below by the stale-seek escape, which
     re-issues a seek that outlives its grace period. That is why streaming
     measured a perfect 0.00 tracking error while downloading. */
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

      /* Loader bar. Previously this was byte progress from our own fetch(); the
         fetch is gone, so report what the element has actually buffered. Note
         the caller releases the loader outright on `onReady` (metadata), which
         now lands in ~200ms — this only fills the bar in the short window
         before that, so it never gates the reveal on a full download. Holding
         the curtain until 100% was the old design's answer to a hero that was
         frozen while streaming; a streamed src is scrubbable immediately, so
         there is nothing left to wait behind. */
      const reportBuffered = () => {
        if (destroyed || !onProgress) return;
        const dur = v.duration;
        if (!dur || !isFinite(dur) || dur <= 0) return;
        const b = v.buffered;
        onProgress(b.length ? Math.min(1, b.end(b.length - 1) / dur) : 0);
      };
      v.addEventListener("progress", reportBuffered);
      v.addEventListener("canplaythrough", () => onProgress?.(1));

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
      // (`priming` is the one sanctioned exception — see prime() above. The rAF
      // loop also force-pauses any unsanctioned playback, so a runaway that
      // slips past these events still dies within a single frame.)
      v.addEventListener("playing", () => { if (!priming) { try { v.pause(); } catch { /* ignore */ } } });
      v.addEventListener("play", () => { if (!priming) { try { v.pause(); } catch { /* ignore */ } } });

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

  // Attach immediately. There is no download-then-attach phase any more, so the
  // element exists from the first tick and the poster is only ever standing in
  // for a frame that is milliseconds away rather than megabytes away.
  let gateTimer = 0;
  if (shouldLoad) {
    const openGate = () => {
      if (destroyed) return;
      if (shouldLoad()) { attach(url); return; }
      gateTimer = window.setTimeout(openGate, 200);
    };
    openGate();
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
      // A scrubber must never actually play. prime() is the one sanctioned
      // play->pause; anything else (an iOS decoder nudging itself, a stray
      // gesture) is caught here within a single frame, whatever the element's
      // own `play`/`playing` handlers did or didn't fire.
      if (!priming && !v.paused) { try { v.pause(); } catch { /* ignore */ } }

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
      if (gateTimer) window.clearTimeout(gateTimer);
      detachGestures();
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
