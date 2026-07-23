"use client";

import {
  useEffect,
  useRef,
  useState,
  type VideoHTMLAttributes,
} from "react";

/**
 * ResponsiveVideo — a full-bleed background <video> that automatically prefers
 * a portrait, phone-optimised source on small screens.
 *
 * Convention: for a desktop source at "/path/name.mp4", the mobile portrait
 * version is expected at "/path/name-mobile.mp4". On viewports ≤768px we swap
 * to that file on mount; if it 404s (not supplied yet) the onError handler
 * falls back to the desktop `src` exactly once, so nothing ever breaks.
 *
 * These films are CONTENT, not decoration, so they are NOT gated on
 * prefers-reduced-motion. That gate used to swap every one of them for a still
 * poster — and because Chrome's Battery/Energy Saver forces
 * prefers-reduced-motion: reduce on any laptop it kicks in on, ordinary
 * visitors on battery saw a completely frozen site. They stay muted, looping
 * and inert (no flashing, no parallax); genuine motion-sensitivity concerns are
 * handled by the reduced-motion rules in globals.css, which still disable the
 * site's autoplaying entrance/parallax animations.
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
  // Start from the desktop src so SSR + first client render agree (no hydration
  // mismatch); the effect upgrades to the -mobile source on phones.
  const [activeSrc, setActiveSrc] = useState(src);
  const fellBack = useRef(false);
  // The <video> gets NO src until it nears the viewport. Six of these mount
  // on the homepage (~28MB of MP4s) — with autoplay they all streamed from
  // hydration, fighting the loader-gated hero frames on every cold visit.
  const [near, setNear] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    fellBack.current = false;
    if (typeof window === "undefined" || !window.matchMedia) {
      setActiveSrc(src);
      return;
    }
    const isMobile = window.matchMedia(MOBILE_QUERY).matches;
    setActiveSrc(isMobile ? toMobileSrc(src) : src);
  }, [src]);

  // fetch + play only within ~800px of the viewport; pause when far off-screen
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { rootMargin: "800px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // the src attaches on the render after `near` flips — start playback then
  useEffect(() => {
    if (!near) return;
    videoRef.current?.play().catch(() => {});
  }, [near, activeSrc]);

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

  return (
    <video
      {...videoProps}
      ref={videoRef}
      className={className}
      style={fill}
      // The poster attribute isn't lazy like an <img> — browsers fetch it the
      // instant it's on a <video>, same priority as any eager image. Six of
      // these mount on the homepage; withholding it until "near" (same gate
      // as src, ~800px out) stops all six posters competing with the hero's
      // own critical frames + JS bundle on a cold, bandwidth-constrained load.
      src={near ? activeSrc : undefined}
      poster={near ? poster : undefined}
      onError={handleError}
      autoPlay={near}
      muted
      loop
      playsInline
      preload={near ? "auto" : "none"}
    />
  );
}
