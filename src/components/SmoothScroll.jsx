import { createContext, useContext, useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";
import { isTouchDevice, prefersReducedMotion } from "../lib/input.js";
import { resetScrollPosition, enableManualScrollRestoration } from "../lib/scrollReset.js";
import {
  refreshScrollTriggersNow,
  cancelScheduledScrollRefresh,
  markUserScrolling,
} from "../lib/scrollRefresh.js";

gsap.registerPlugin(ScrollTrigger);

const LenisContext = createContext(null);

export function useLenis() {
  return useContext(LenisContext);
}

/**
 * Lenis + GSAP ScrollTrigger — desktop wheel and mobile touch.
 */
export function SmoothScrollProvider({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    enableManualScrollRestoration();
    resetScrollPosition();

    const touch = isTouchDevice();

    const lenis = new Lenis({
      lerp: touch ? 0.16 : 0.12,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1,
      wheelMultiplier: touch ? 1 : 0.85,
      overscroll: false,
      autoResize: true,
    });

    lenisRef.current = lenis;
    window.__lenis = lenis;

    const onScroll = () => {
      markUserScrolling();
      ScrollTrigger.update();
      window.dispatchEvent(new Event("scroll"));
    };
    lenis.on("scroll", onScroll);

    const lenisRaf = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(lenisRaf);
    gsap.ticker.lagSmoothing(0);

    const onLayoutReady = () => {
      refreshScrollTriggersNow();
    };

    requestAnimationFrame(onLayoutReady);
    window.addEventListener("load", onLayoutReady);

    return () => {
      window.removeEventListener("load", onLayoutReady);
      cancelScheduledScrollRefresh();
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(lenisRaf);
      lenis.destroy();
      lenisRef.current = null;
      window.__lenis = null;
      document.body.style.overflow = "";
    };
  }, []);

  return <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>;
}
