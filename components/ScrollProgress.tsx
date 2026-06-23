"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/* Thin brass line pinned to the top of the viewport that fills with scroll depth.
   A quiet, site-wide scroll cue — respects reduced-motion via the spring being skipped. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        insetInline: 0,
        height: 2,
        zIndex: 9998,
        transformOrigin: "left",
        scaleX,
        background: "linear-gradient(90deg, var(--brass), var(--brass-2))",
        pointerEvents: "none",
      }}
    />
  );
}
