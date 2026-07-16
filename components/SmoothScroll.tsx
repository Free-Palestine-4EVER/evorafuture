"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.2,
    });
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    // Only force back to the top on an actual back/forward navigation — that's
    // the one case scrollRestoration:"manual" needs help with (the browser
    // would otherwise auto-restore a stale position before Lenis's virtual
    // scroll state is established). On a FRESH navigation this used to fire
    // unconditionally, which on a slow connection snapped the page back to 0
    // out from under anyone who had already started scrolling natively (real
    // touch-scroll works before any JS loads) while the page was still
    // hydrating — a jarring "glitch" right as the site became interactive.
    const navEntry = performance.getEntriesByType?.("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    if (navEntry?.type === "back_forward") lenis.scrollTo(0, { immediate: true });
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // anchor links
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute("href");
      if (id && id.length > 1) {
        const el = document.querySelector(id);
        if (el) {
          e.preventDefault();
          lenis.scrollTo(el as HTMLElement, { offset: -10 });
        }
      }
    };
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, []);

  return null;
}
