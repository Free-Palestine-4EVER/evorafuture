"use client";

import {
  useEffect,
  useRef,
  useState,
  type VideoHTMLAttributes,
} from "react";
import { useReducedMotion } from "framer-motion";

/**
 * ResponsiveVideo — a full-bleed background <video> that automatically prefers
 * a portrait, phone-optimised source on small screens.
 *
 * Convention: for a desktop source at "/path/name.mp4", the mobile portrait
 * version is expected at "/path/name-mobile.mp4". On viewports ≤768px we swap
 * to that file on mount; if it 404s (not supplied yet) the onError handler
 * falls back to the desktop `src` exactly once, so nothing ever breaks.
 *
 * Respects prefers-reduced-motion: shows the poster (or a paused first frame)
 * with no autoplay.
 */

const MOBILE_QUERY = "(max-width: 768px)";

/** "/evora/hero-c.mp4" -> "/evora/hero-c-mobile.mp4" (only swaps a trailing .mp4) */
export function toMobileSrc(src: string): string {
  return src.replace(/\.mp4(\?.*)?$/i, "-mobile.mp4$1");
}

type Props = {
  src: string;
  poster?: string;
  className?: string;
} & Omit<VideoHTMLAttributes<HTMLVideoElement>, "src" | "poster" | "className">;

export default function ResponsiveVideo({
  src,
  poster,
  className,
  style,
  ...videoProps
}: Props) {
  const reduce = useReducedMotion();
  // Start from the desktop src so SSR + first client render agree (no hydration
  // mismatch); the effect upgrades to the -mobile source on phones.
  const [activeSrc, setActiveSrc] = useState(src);
  const fellBack = useRef(false);

  useEffect(() => {
    fellBack.current = false;
    if (typeof window === "undefined" || !window.matchMedia) {
      setActiveSrc(src);
      return;
    }
    const isMobile = window.matchMedia(MOBILE_QUERY).matches;
    setActiveSrc(isMobile ? toMobileSrc(src) : src);
  }, [src]);

  const handleError = () => {
    // The -mobile file isn't there yet → fall back to the desktop file once.
    if (!fellBack.current && activeSrc !== src) {
      fellBack.current = true;
      setActiveSrc(src);
    }
  };

  const fill: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    ...style,
  };

  // Reduced motion: never autoplay — present a still poster frame instead.
  if (reduce) {
    if (poster) {
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={poster} alt="" className={className} style={fill} />;
    }
    return (
      <video
        {...videoProps}
        className={className}
        style={fill}
        src={activeSrc}
        poster={poster}
        muted
        playsInline
        preload="metadata"
        autoPlay={false}
      />
    );
  }

  return (
    <video
      {...videoProps}
      className={className}
      style={fill}
      src={activeSrc}
      poster={poster}
      onError={handleError}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
    />
  );
}
