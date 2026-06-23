"use client";

/* ============================================================
   EVORA — quiet-luxury motion system
   Built on framer-motion. Restrained, slow, expensive.
   Every primitive respects prefers-reduced-motion.
   ============================================================ */

import {
  motion,
  useInView,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
  animate,
  type Variants,
} from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  Children,
  type ReactNode,
  type ElementType,
  type CSSProperties,
} from "react";

export const EASE = [0.22, 1, 0.36, 1] as const;
const VIEWPORT = { once: true, margin: "0px 0px -12% 0px" } as const;

/* ---------- Rise: the workhorse fade + lift on scroll-in ---------- */
export function Rise({
  children,
  delay = 0,
  y = 44,
  blur = true,
  as = "div",
  className,
  style,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  blur?: boolean;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
}) {
  const reduce = useReducedMotion();
  const M = motion[as as keyof typeof motion] as typeof motion.div;
  return (
    <M
      className={className}
      style={style}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y, filter: blur ? "blur(10px)" : "blur(0px)" }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={VIEWPORT}
      transition={{ duration: 1.05, ease: EASE, delay }}
    >
      {children}
    </M>
  );
}

/* ---------- Stagger: container that cascades its children ---------- */
export function Stagger({
  children,
  delay = 0,
  gap = 0.09,
  className,
  style,
}: {
  children: ReactNode;
  delay?: number;
  gap?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: gap, delayChildren: delay } },
  };
  return (
    <motion.div
      className={className}
      style={style}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  y = 28,
  className,
  style,
}: {
  children: ReactNode;
  y?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const reduce = useReducedMotion();
  const item: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y, filter: "blur(8px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1.0, ease: EASE } },
  };
  return (
    <motion.div className={className} style={style} variants={item}>
      {children}
    </motion.div>
  );
}

/* ---------- RevealLines: line-by-line masked heading reveal ---------- */
export function RevealLines({
  lines,
  className,
  style,
  delay = 0,
  italicIndex,
  italicColor,
}: {
  lines: string[];
  className?: string;
  style?: CSSProperties;
  delay?: number;
  italicIndex?: number;
  italicColor?: string;
}) {
  const reduce = useReducedMotion();
  // The IntersectionObserver must live on the OUTER, untranslated container — the
  // inner line spans are translated out of their overflow:hidden mask, so an
  // observer on them would never register as in-view. Drive the lines via variants.
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: delay } },
  };
  const line: Variants = {
    hidden: reduce ? { opacity: 0 } : { y: "110%" },
    show: { y: "0%", opacity: 1, transition: { duration: 1.0, ease: EASE } },
  };
  return (
    <motion.span
      className={className}
      style={{ display: "block", ...style }}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
    >
      {lines.map((l, i) => (
        <span key={i} style={{ display: "block", overflow: "hidden", paddingBottom: "0.08em" }}>
          <motion.span variants={line} style={{ display: "inline-block", willChange: "transform" }}>
            {i === italicIndex ? (
              <span className="serif-i" style={{ color: italicColor }}>
                {l}
              </span>
            ) : (
              l
            )}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/* ---------- RevealWords: word-by-word reveal for body/lead copy ---------- */
export function RevealWords({
  text,
  className,
  style,
  delay = 0,
}: {
  text: string;
  className?: string;
  style?: CSSProperties;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.018, delayChildren: delay } },
  };
  const word: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: "0.5em" },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
  };
  return (
    <motion.span
      className={className}
      style={style}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
    >
      {words.map((w, i) => (
        <motion.span key={i} variants={word} style={{ display: "inline-block", whiteSpace: "pre" }}>
          {w + (i < words.length - 1 ? " " : "")}
        </motion.span>
      ))}
    </motion.span>
  );
}

/* ---------- Parallax: scroll-linked vertical drift ---------- */
export function Parallax({
  children,
  amount = 60,
  className,
  style,
}: {
  children: ReactNode;
  amount?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yRaw = useTransform(scrollYProgress, [0, 1], [amount, -amount]);
  const y = useSpring(yRaw, { stiffness: 90, damping: 30, mass: 0.4 });
  return (
    <div ref={ref} className={className} style={{ ...style }}>
      <motion.div style={{ y: reduce ? 0 : y, height: "100%", willChange: "transform" }}>
        {children}
      </motion.div>
    </div>
  );
}

/* ---------- ParallaxImage: image that drifts/zooms inside a fixed frame ---------- */
export function ParallaxImage({
  src,
  alt = "",
  amount = 12,
  className,
  style,
}: {
  src: string;
  alt?: string;
  amount?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yRaw = useTransform(scrollYProgress, [0, 1], [`-${amount}%`, `${amount}%`]);
  const y = useSpring(yRaw, { stiffness: 80, damping: 30, mass: 0.5 });
  return (
    <div ref={ref} className={className} style={{ position: "relative", overflow: "hidden", ...style }}>
      <motion.img
        src={src}
        alt={alt}
        style={{
          position: "absolute",
          inset: `-${amount + 4}% 0`,
          width: "100%",
          height: `${100 + (amount + 4) * 2}%`,
          objectFit: "cover",
          y: reduce ? 0 : y,
          willChange: "transform",
        }}
      />
    </div>
  );
}

/* ---------- CountUp: animate a formatted stat from 0 when in view ---------- */
export function CountUp({
  value,
  className,
  style,
}: {
  value: string;
  className?: string;
  style?: CSSProperties;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const [display, setDisplay] = useState(reduce ? value : "");

  // parse: leading number (with commas / decimal) + trailing suffix (K, +, %, ★ …)
  const match = value.match(/^([\d.,]+)(.*)$/);
  const numStr = match ? match[1] : value;
  const suffix = match ? match[2] : "";
  const hasComma = numStr.includes(",");
  const target = parseFloat(numStr.replace(/,/g, "")) || 0;
  const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;

  const format = (n: number) => {
    const fixed = n.toFixed(decimals);
    if (!hasComma) return fixed + suffix;
    const [int, dec] = fixed.split(".");
    const withSep = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return (dec ? `${withSep}.${dec}` : withSep) + suffix;
  };

  useEffect(() => {
    if (reduce || !inView || !match) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, target, {
      duration: 1.6,
      ease: EASE,
      onUpdate: (v) => setDisplay(format(v)),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, value]);

  return (
    <span ref={ref} className={className} style={style}>
      {display || (reduce ? value : format(0))}
    </span>
  );
}

/* ---------- Magnetic: child gently follows the cursor (buttons/handles) ---------- */
export function Magnetic({
  children,
  strength = 0.35,
  className,
  style,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 200, damping: 18, mass: 0.4 });
  const y = useSpring(0, { stiffness: 200, damping: 18, mass: 0.4 });

  if (reduce) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ display: "inline-flex", x, y, ...style }}
      onMouseMove={onMove}
      onMouseLeave={reset}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Counter helper for progress line under sticky sections ---------- */
export function useSectionProgress() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end start"] });
  return { ref, scrollYProgress };
}

/* re-export so sections can grab motion bits from one place */
export { motion, useScroll, useTransform, useSpring, useInView, useReducedMotion, Children };
