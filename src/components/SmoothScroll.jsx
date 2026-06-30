import { createContext, useContext, useEffect, useRef } from "react";
import Lenis from "lenis";
import { prefersReducedMotion } from "../lib/input.js";

const LenisContext = createContext(null);

export function useLenis() {
  return useContext(LenisContext);
}

/**
 * Weighted smooth scroll (Lenis). Syncs with framer-motion useScroll and Scene3D.
 */
export function SmoothScrollProvider({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    document.documentElement.classList.add("lenis", "lenis-smooth");

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.15,
    });

    lenisRef.current = lenis;
    window.__lenis = lenis;

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
