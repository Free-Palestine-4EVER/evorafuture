"use client";

import Wordmark from "./brand/Wordmark";

// Official EVORA — Future Home wordmark, now a crisp currentColor vector.
// `tone` picks the paper (white) mark for dark backgrounds (e.g. the nav over
// the hero) or the ink mark for light ones. API unchanged for Nav/Footer/Portal.
export default function Logo({ tone = "ink", size = 1 }: { tone?: "ink" | "paper"; size?: number }) {
  return (
    <Wordmark
      tone={tone}
      style={{
        height: `${2.4 * size}rem`,
        width: "auto",
        transition: "color .4s var(--ease)",
      }}
    />
  );
}
