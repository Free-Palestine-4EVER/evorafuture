"use client";

// Official EVORA — Future Home wordmark. `tone` picks the white mark (for dark
// backgrounds, e.g. the nav over the hero) or the ink mark (for light ones).
export default function Logo({ tone = "ink", size = 1 }: { tone?: "ink" | "paper"; size?: number }) {
  const src = tone === "paper" ? "/textures/evora-wordmark-paper.png" : "/textures/evora-wordmark-ink.png";
  return (
    <img
      src={src}
      alt="Evora — Future Home"
      draggable={false}
      style={{
        display: "block",
        height: `${2.4 * size}rem`,
        width: "auto",
        objectFit: "contain",
        transition: "opacity .4s var(--ease)",
      }}
    />
  );
}
