"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { useT } from "@/lib/i18n";
import ModelViewer, { type ViewerEl } from "./ModelViewer";
import { products } from "@/lib/products";

const featured = products[0]; // Laurel — the signature upholstered bed set

const T = {
  eyebrow: { en: "Evora · Augmented showroom", ar: "إيفورا · معرض الواقع المعزّز" },
  h1_a: { en: "The showroom,", ar: "المعرض،" },
  h1_b: { en: "in your ", ar: "في " },
  h1_em: { en: "home.", ar: "بيتك." },
  lede: {
    en: "The whole Evora floor, in your pocket. Explore every piece in 3D, walk the virtual showroom, then drop any item into your own room — straight from the browser, nothing to install.",
    ar: "كل معرض إيفورا في جيبك. استكشف كل قطعة بالأبعاد الثلاثية، وتجوّل في المعرض الافتراضي، ثم ضع أيّ قطعة في غرفتك — من المتصفح مباشرة، دون تثبيت أي تطبيق.",
  },
  try_pre: { en: "Try the ", ar: "جرّب " },
  try_post: { en: " in your room", ar: " في غرفتك" },
  browse: { en: "Browse the collection", ar: "تصفّح المجموعة" },
  note_ready: {
    en: "Your device supports AR — tap above to place it on your floor.",
    ar: "جهازك يدعم الواقع المعزّز — انقر بالأعلى لتضعها على أرضك.",
  },
  note_desktop: {
    en: "On desktop? Open this page on your phone for full AR.",
    ar: "على الحاسوب؟ افتح هذه الصفحة على هاتفك لتجربة الواقع المعزّز كاملة.",
  },
  stage_tag: { en: "Live 3D · drag to rotate", ar: "ثلاثي الأبعاد حيّ · اسحب للتدوير" },
};

export default function Hero() {
  const { lang } = useT();
  const t = (k: keyof typeof T) => T[k][lang];
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
          {t("eyebrow")}
        </motion.p>
        <motion.h1 variants={rise} className="display-xl hero-h1">
          {t("h1_a")}
          <br />
          {t("h1_b")}
          <span className="italic">{t("h1_em")}</span>
        </motion.h1>
        <motion.p variants={rise} className="hero-lede">
          {t("lede")}
        </motion.p>
        <motion.div variants={rise} className="hero-cta">
          <button className="btn btn-clay" onClick={tryIt}>
            {t("try_pre")}
            {featured.name}
            {t("try_post")}
          </button>
          <a className="btn btn-ghost" href="#showroom">
            {t("browse")}
          </a>
        </motion.div>
        <motion.p variants={rise} className="hero-note">
          {arReady ? t("note_ready") : t("note_desktop")}
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
          <span className="dot-live" /> {t("stage_tag")}
        </div>
      </motion.div>
    </header>
  );
}
