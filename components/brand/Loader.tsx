"use client";

/* ============================================================
   EVORA — shared branded loader
   A fixed full-screen --ink field that plays the brass
   "EVORA · FUTURE HOME" light-sweep film (portrait or landscape
   source picked by orientation), then lifts like a curtain into
   the page. Shows once per session. prefers-reduced-motion shows
   the poster still and fades only. Dwell is capped so it never
   blocks the user.

   Mounted by the site / Studio / portal layouts.
   ============================================================ */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useT } from "@/lib/i18n";
import { preload } from "@/lib/preload";

const SESSION_KEY = "evora_loader_seen";
const MIN_DWELL = 900; // hold the brand beat at least this long
const HARD_CAP = 9000; // …and never block the user longer than this, even mid-download
const GRACE_MS = 700; // wait this long for a hero to register critical assets
const LIFT_MS = 640; // curtain-lift duration

const COPY = {
  en: "EVORA — Your Future Home",
  ar: "إيفورا — بيت المستقبل",
} as const;

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function Loader() {
  const { lang } = useT();
  // SSR renders the overlay visible so the page never flashes before it.
  const [phase, setPhase] = useState<"show" | "lift" | "gone">("show");
  const [portrait, setPortrait] = useState(false);
  const [armed, setArmed] = useState(false); // client knows orientation -> mount media
  const [progress, setProgress] = useState(0); // 0..1 real asset-load progress (eased)
  const startRef = useRef(0);
  const liftedRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  // Decide instantly (before paint) whether this session has already seen it.
  useIsoLayoutEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      /* sessionStorage may be unavailable */
    }
    if (seen) {
      setPhase("gone");
      return;
    }
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
    setPortrait(window.innerHeight > window.innerWidth);
    setArmed(true);
    startRef.current = performance.now();
  }, []);

  // Orchestrate the lift once armed — gated on the hero's REAL asset progress
  // (via the preload bus) so the page is smooth the instant it's revealed.
  useEffect(() => {
    if (!armed) return;

    const lift = () => {
      if (liftedRef.current) return;
      liftedRef.current = true;
      setProgress(1); // snap the bar to full as the curtain goes
      setPhase("lift");
      window.setTimeout(() => setPhase("gone"), LIFT_MS);
    };
    const liftRespectingMin = () => {
      const elapsed = performance.now() - startRef.current;
      if (elapsed >= MIN_DWELL) lift();
      else window.setTimeout(lift, MIN_DWELL - elapsed);
    };

    // Reduced motion: poster only, brief fade — no progress theatre.
    if (reduce) {
      const t = window.setTimeout(lift, Math.min(MIN_DWELL, HARD_CAP));
      return () => window.clearTimeout(t);
    }

    let sawAssets = false;
    let targetP = 0; // real progress (loaded/total)
    let shownP = 0; // eased value pushed to state

    // Subscribe to the hero's critical-asset progress.
    const unsub = preload.subscribe(({ loaded, total }) => {
      if (total > 0) {
        sawAssets = true;
        targetP = loaded / total;
        if (loaded >= total) liftRespectingMin(); // every critical asset is buffered
      }
    });

    // Ease the displayed bar toward the real figure so bursty loads read smooth.
    let raf = 0;
    const animate = () => {
      shownP += (targetP - shownP) * 0.14;
      // hold just under full until we actually lift, so 100% always means "go"
      if (!liftedRef.current) setProgress(Math.min(0.985, shownP));
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    // If no hero registered assets within the grace window (e.g. a light route),
    // fall back to the classic "lift when the page is interactive" behaviour.
    const onLoad = () => liftRespectingMin();
    const grace = window.setTimeout(() => {
      if (sawAssets) return;
      if (document.readyState === "complete") liftRespectingMin();
      else window.addEventListener("load", onLoad, { once: true });
    }, GRACE_MS);

    const cap = window.setTimeout(lift, HARD_CAP); // never block the user

    return () => {
      cancelAnimationFrame(raf);
      unsub();
      window.clearTimeout(grace);
      window.clearTimeout(cap);
      window.removeEventListener("load", onLoad);
    };
  }, [armed, reduce]);

  // Try to start playback (autoplay can be blocked; the cap still lifts us).
  useEffect(() => {
    if (!armed || reduce) return;
    videoRef.current?.play().catch(() => {});
  }, [armed, reduce]);

  if (phase === "gone") return null;

  const base = portrait ? "/evora/loader/evora-loader-9x16" : "/evora/loader/evora-loader-16x9";
  const lifting = phase === "lift";

  return (
    <div
      aria-hidden={lifting}
      role="status"
      aria-label={COPY[lang] ?? COPY.en}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "var(--ink, #16150F)",
        overflow: "hidden",
        pointerEvents: lifting ? "none" : "auto",
        transform: lifting ? "translateY(-101%)" : "translateY(0)",
        opacity: lifting ? 0 : 1,
        transition: `transform ${LIFT_MS}ms cubic-bezier(0.76,0,0.24,1), opacity ${LIFT_MS}ms ease`,
        willChange: "transform, opacity",
      }}
    >
      {armed && !reduce ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={`${base}.jpg`}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        >
          <source src={`${base}.mp4`} type="video/mp4" />
        </video>
      ) : (
        // Reduced-motion / pre-arm: the poster still on the ink field.
        <img
          src={`${base}.jpg`}
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      )}

      {/* real asset-load progress — a slim brass seam across the foot of the curtain */}
      {!reduce && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 2,
            background: "rgba(197,160,106,0.16)",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${Math.round(progress * 100)}%`,
              background: "var(--brass-2, #C5A06A)",
              boxShadow: "0 0 14px rgba(197,160,106,0.65)",
              transition: "width 140ms linear",
              willChange: "width",
            }}
          />
        </div>
      )}
    </div>
  );
}
