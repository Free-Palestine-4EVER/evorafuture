"use client";

/* ============================================================
   EVORA — vector wordmark
   A clean, currentColor-driven recreation of the brass
   "EVORA · FUTURE HOME" lockup: geometric monoline caps with
   the signature chevron "A". Because it is pure stroke vector
   it themes to ink / paper / brass, scales crisply to any size,
   and can stroke-draw (set `draw`) for the branded loader.
   ============================================================ */

import { useId, type CSSProperties } from "react";

const TONE: Record<"ink" | "paper" | "brass", string> = {
  ink: "var(--ink)",
  paper: "var(--paper)",
  brass: "var(--brass-2)",
};

export default function Wordmark({
  tone,
  tagline = true,
  draw = false,
  drawMs = 900,
  title = "EVORA — Future Home",
  className,
  style,
}: {
  /** Theme colour. Omit to inherit `currentColor` from the caller. */
  tone?: "ink" | "paper" | "brass";
  /** Render the "FUTURE HOME" sub-lockup beneath the wordmark. */
  tagline?: boolean;
  /** Stroke-draw the marks in on mount (used by the loader). */
  draw?: boolean;
  drawMs?: number;
  title?: string;
  className?: string;
  style?: CSSProperties;
}) {
  const id = useId().replace(/[:]/g, "");
  const color = tone ? TONE[tone] : "currentColor";
  // viewBox 730×316 keeps the same footprint as the original raster lockup.
  const vb = tagline ? "0 0 730 316" : "0 0 730 186";

  return (
    <svg
      viewBox={vb}
      role="img"
      aria-label={title}
      className={className}
      style={{ display: "block", color, overflow: "visible", ...style }}
      data-draw={draw ? "on" : undefined}
    >
      <title>{title}</title>
      {draw && (
        <style>{`
          [data-draw="on"] .ev-p {
            stroke-dasharray: 1;
            stroke-dashoffset: 1;
            animation: ev-draw-${id} ${drawMs}ms cubic-bezier(0.22,1,0.36,1) forwards;
          }
          @keyframes ev-draw-${id} { to { stroke-dashoffset: 0; } }
          @media (prefers-reduced-motion: reduce) {
            [data-draw="on"] .ev-p { stroke-dasharray: none; stroke-dashoffset: 0; animation: none; }
          }
        `}</style>
      )}

      {/* EVORA — primary mark */}
      <g
        fill="none"
        stroke={color}
        strokeWidth={15}
        strokeLinecap="square"
        strokeLinejoin="miter"
      >
        <path className="ev-p" pathLength={1} d="M30 28 L30 158" />
        <path className="ev-p" pathLength={1} d="M30 28 L118 28" />
        <path className="ev-p" pathLength={1} d="M30 93 L104 93" />
        <path className="ev-p" pathLength={1} d="M30 158 L118 158" />
        <path className="ev-p" pathLength={1} d="M152 28 L214 158 L276 28" />
        <path className="ev-p" pathLength={1} d="M363 28 A65 65 0 0 1 363 158 A65 65 0 0 1 363 28 Z" />
        <path className="ev-p" pathLength={1} d="M452 28 L452 158" />
        <path className="ev-p" pathLength={1} d="M452 28 L512 28 A33 33 0 0 1 512 94 L452 94" />
        <path className="ev-p" pathLength={1} d="M502 94 L548 158" />
        <path className="ev-p" pathLength={1} d="M580 158 L640 28 L700 158" />
      </g>

      {/* FUTURE HOME — sub-lockup */}
      {tagline && (
        <g
          transform="translate(178 222)"
          fill="none"
          stroke={color}
          strokeWidth={7}
          strokeLinecap="square"
          strokeLinejoin="miter"
        >
          <path className="ev-p" pathLength={1} transform="translate(0 0)" d="M0 0 L0 30 M0 0 L20 0 M0 14 L16 14" />
          <path className="ev-p" pathLength={1} transform="translate(34 0)" d="M0 0 L0 19 A11 11 0 0 0 22 19 L22 0" />
          <path className="ev-p" pathLength={1} transform="translate(70 0)" d="M0 0 L24 0 M12 0 L12 30" />
          <path className="ev-p" pathLength={1} transform="translate(108 0)" d="M0 0 L0 19 A11 11 0 0 0 22 19 L22 0" />
          <path className="ev-p" pathLength={1} transform="translate(144 0)" d="M0 0 L0 30 M0 0 L16 0 A8 8 0 0 1 16 16 L0 16 M11 16 L22 30" />
          <path className="ev-p" pathLength={1} transform="translate(180 0)" d="M0 0 L0 30 M0 0 L18 0 M0 14 L15 14 M0 30 L18 30" />
          <path className="ev-p" pathLength={1} transform="translate(244 0)" d="M0 0 L0 30 M22 0 L22 30 M0 15 L22 15" />
          <path className="ev-p" pathLength={1} transform="translate(280 0)" d="M12 0 A12 15 0 0 1 12 30 A12 15 0 0 1 12 0 Z" />
          <path className="ev-p" pathLength={1} transform="translate(318 0)" d="M0 30 L0 0 L12 18 L24 0 L24 30" />
          <path className="ev-p" pathLength={1} transform="translate(356 0)" d="M0 0 L0 30 M0 0 L18 0 M0 14 L15 14 M0 30 L18 30" />
        </g>
      )}
    </svg>
  );
}
