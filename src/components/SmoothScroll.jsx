import { createContext, useContext, useEffect, useRef } from "react";
import Lenis from "lenis";
import { isTouchDevice, prefersReducedMotion } from "../lib/input.js";

const LenisContext = createContext(null);

export function useLenis() {
  return useContext(LenisContext);
}

/**
 * Smooth scroll on desktop pointer devices only.
 * Touch/coarse pointers keep native scroll so content and menus stay reliable.
 */
export function SmoothScrollProvider({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion() || isTouchDevice()) return undefined;

    document.documentElement.classList.add("lenis", "lenis-smooth");

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
    });

    lenisRef.current = lenis;
    window.__lenis = lenis;

    lenis.on("scroll", () => {
      window.dispatchEvent(new Event("scroll"));
    });

    let rafId = 0;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
      window.__lenis = null;
      document.documentElement.classList.remove("lenis", "lenis-smooth");
      document.body.style.overflow = "";
    };
  }, []);

  return <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>;
}

/** Scroll to anchor — uses Lenis when active. */
export function scrollToTarget(target, { offset = -80 } = {}) {
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return;

  const lenis = document.documentElement.classList.contains("lenis-smooth")
    ? window.__lenis
    : null;

  if (lenis?.scrollTo) {
    lenis.scrollTo(el, { offset, duration: 1.1 });
    return;
  }
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}
