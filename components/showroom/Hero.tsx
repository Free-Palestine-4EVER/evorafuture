"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import ModelViewer, { type ViewerEl } from "./ModelViewer";
import { products } from "@/lib/products";

const featured = products[0]; // Oslo sofa

export default function Hero() {
  const [viewer, setViewer] = useState<ViewerEl | null>(null);
  const [arReady, setArReady] = useState(false);

  const onReady = useCallback((el: ViewerEl) => {
    setViewer(el);
    setArReady(Boolean(el.canActivateAR));
  }, []);

  const tryIt = () => {
    if (viewer && arReady) viewer.activateAR();
    else document.getElementById("showroom")?.scrollIntoView({ behavior: "smooth" });
  };

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
  };
  const rise = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
  };

  return (
    <header className="hero shell">
      <motion.div
        className="hero-copy"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        <motion.p variants={rise} className="eyebrow">
          Evora · Augmented showroom
        </motion.p>
        <motion.h1 variants={rise} className="display-xl hero-h1">
          See it
          <br />
          in your <span className="italic">home.</span>
        </motion.h1>
        <motion.p variants={rise} className="hero-lede">
          Walk the whole collection in 3D, then place any piece in your own room
          — at true scale, in real light — straight from your phone. No app, no
          guesswork.
        </motion.p>
        <motion.div variants={rise} className="hero-cta">
          <button className="btn btn-clay" onClick={tryIt}>
            Try the {featured.name} in your room
          </button>
          <a className="btn btn-ghost" href="#showroom">
            Browse the collection
          </a>
        </motion.div>
        <motion.p variants={rise} className="hero-note">
          {arReady
            ? "Your device supports AR — tap above to place it on your floor."
            : "On desktop? Open this page on your phone for full AR."}
        </motion.p>
      </motion.div>

      <motion.div
        className="hero-stage"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const, delay: 0.25 }}
      >
        <ModelViewer product={featured} onReady={onReady} autoRotate />
        <div className="hero-stage-tag">
          <span className="dot-live" /> Live 3D · drag to rotate
        </div>
      </motion.div>
    </header>
  );
}
