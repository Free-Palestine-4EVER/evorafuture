"use client";

/* ============================================================
   EVORA — 'E' monogram
   The compact mark derived from the wordmark's geometric "E".
   currentColor / themeable, for the Studio header, portal rail,
   login lockups, favicon and PWA marks.
   ============================================================ */

import { useId, type CSSProperties } from "react";

const TONE: Record<"ink" | "paper" | "brass", string> = {
  ink: "var(--ink)",
  paper: "var(--paper)",
  brass: "var(--brass-2)",
};

export default function Monogram({
  tone,
  draw = false,
  drawMs = 700,
  title = "EVORA",
  className,
  style,
}: {
  tone?: "ink" | "paper" | "brass";
  draw?: boolean;
  drawMs?: number;
  title?: string;
  className?: string;
  style?: CSSProperties;
}) {
  const id = useId().replace(/[:]/g, "");
  const color = tone ? TONE[tone] : "currentColor";

  return (
    <svg
      viewBox="0 0 100 100"
      role="img"
      aria-label={title}
      className={className}
      style={{ display: "block", color, overflow: "visible", ...style }}
      data-draw={draw ? "on" : undefined}
    >
      <title>{title}</title>
      {draw && (
        <style>{`
          [data-draw="on"] .ev-m {
            stroke-dasharray: 1; stroke-dashoffset: 1;
            animation: ev-mono-${id} ${drawMs}ms cubic-bezier(0.22,1,0.36,1) forwards;
          }
          @keyframes ev-mono-${id} { to { stroke-dashoffset: 0; } }
          @media (prefers-reduced-motion: reduce) {
            [data-draw="on"] .ev-m { stroke-dasharray: none; stroke-dashoffset: 0; animation: none; }
          }
        `}</style>
      )}
      <g
        fill="none"
        stroke={color}
        strokeWidth={9}
        strokeLinecap="square"
        strokeLinejoin="miter"
      >
        <path className="ev-m" pathLength={1} d="M30 22 L30 78" />
        <path className="ev-m" pathLength={1} d="M30 22 L70 22" />
        <path className="ev-m" pathLength={1} d="M30 50 L64 50" />
        <path className="ev-m" pathLength={1} d="M30 78 L70 78" />
      </g>
    </svg>
  );
}
