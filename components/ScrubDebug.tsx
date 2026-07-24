"use client";

/* Temporary on-screen diagnostic for the scroll films.
 *
 * Why this exists: the films work on every desktop browser and in Chromium's
 * mobile emulation, but reportedly not on real phones. Three fixes based on
 * inference all missed, because the environment available for testing here
 * simply does not reproduce the bug. This panel reports what the video element
 * is ACTUALLY doing on the real device, so one screenshot replaces another
 * round of guessing.
 *
 * Only renders when the URL contains ?vdebug=1 — invisible to real visitors.
 * Delete once the mobile issue is closed.
 */

import { useEffect, useState } from "react";

type Snap = {
  label: string;
  exists: boolean;
  src: string;
  readyState: number;
  networkState: number;
  errorCode: number | null;
  duration: string;
  currentTime: string;
  buffered: string;
  paused: boolean;
  seeking: boolean;
  painted: boolean;
  size: string;
};

const read = (label: string, stageSel: string): Snap => {
  const stage = document.querySelector(stageSel);
  const v = stage?.querySelector("video") as HTMLVideoElement | null;
  if (!v) {
    return {
      label, exists: false, src: "-", readyState: -1, networkState: -1, errorCode: null,
      duration: "-", currentTime: "-", buffered: "-", paused: true, seeking: false,
      painted: !!stage?.classList.contains("is-painted"), size: "-",
    };
  }
  let buffered = "none";
  try {
    const b = v.buffered;
    if (b.length) buffered = `${b.length} range(s) 0..${b.end(b.length - 1).toFixed(1)}s`;
  } catch { /* ignore */ }
  return {
    label,
    exists: true,
    src: (v.currentSrc || v.src || "-").replace(/^https?:\/\/[^/]+/, "").slice(0, 42),
    readyState: v.readyState,
    networkState: v.networkState,
    errorCode: v.error ? v.error.code : null,
    duration: Number.isFinite(v.duration) ? v.duration.toFixed(2) : String(v.duration),
    currentTime: v.currentTime.toFixed(2),
    buffered,
    paused: v.paused,
    seeking: v.seeking,
    painted: !!stage?.classList.contains("is-painted"),
    size: `${v.videoWidth}x${v.videoHeight}`,
  };
};

export default function ScrubDebug() {
  const [on, setOn] = useState(false);
  const [snaps, setSnaps] = useState<Snap[]>([]);
  const [ua, setUa] = useState("");

  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has("vdebug")) return;
    setOn(true);
    setUa(navigator.userAgent.slice(0, 80));
    const tick = () => setSnaps([read("HERO", ".hs__stage"), read("KITCHEN", ".cfg__stage")]);
    tick();
    const id = window.setInterval(tick, 400);
    return () => window.clearInterval(id);
  }, []);

  if (!on) return null;

  return (
    <div
      style={{
        position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 2147483647,
        background: "rgba(0,0,0,0.88)", color: "#0f0", font: "10px/1.35 ui-monospace,Menlo,monospace",
        padding: "8px 10px", maxHeight: "48vh", overflow: "auto", pointerEvents: "none",
        WebkitUserSelect: "text", userSelect: "text",
      }}
    >
      <div style={{ color: "#ff0" }}>{ua}</div>
      <div style={{ color: "#ff0" }}>
        dpr={typeof window !== "undefined" ? window.devicePixelRatio : "?"} vp=
        {typeof window !== "undefined" ? `${window.innerWidth}x${window.innerHeight}` : "?"}
      </div>
      {snaps.map((s) => (
        <div key={s.label} style={{ marginTop: 6, borderTop: "1px solid #333", paddingTop: 4 }}>
          <b style={{ color: "#fff" }}>{s.label}</b> exists={String(s.exists)} painted={String(s.painted)}
          <br />src={s.src}
          <br />readyState={s.readyState} networkState={s.networkState} err={String(s.errorCode)}
          <br />dur={s.duration} t={s.currentTime} size={s.size}
          <br />paused={String(s.paused)} seeking={String(s.seeking)}
          <br />buffered={s.buffered}
        </div>
      ))}
    </div>
  );
}
