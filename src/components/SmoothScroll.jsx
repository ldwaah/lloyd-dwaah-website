import { createContext, useContext, useEffect, useRef } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
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

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
      content: document.body,
      autoResize: true,
    });

    lenisRef.current = lenis;
    window.__lenis = lenis;

    lenis.on("scroll", () => {
      window.dispatchEvent(new Event("scroll"));
    });

    const refreshScroll = () => lenis.resize();
    requestAnimationFrame(refreshScroll);
    window.addEventListener("load", refreshScroll);

    const resizeObserver = new ResizeObserver(refreshScroll);
    resizeObserver.observe(document.body);

    let rafId = 0;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("load", refreshScroll);
      resizeObserver.disconnect();
      lenis.destroy();
      lenisRef.current = null;
      window.__lenis = null;
      document.body.style.overflow = "";
    };
  }, []);

  return <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>;
}
