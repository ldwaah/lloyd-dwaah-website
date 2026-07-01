import { createContext, useContext, useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";
import { isTouchDevice, prefersReducedMotion } from "../lib/input.js";
import { resetScrollPosition, enableManualScrollRestoration } from "../lib/scrollReset.js";

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
      duration: touch ? 0.9 : 0.8,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      syncTouch: touch,
      syncTouchLerp: 0.08,
      touchMultiplier: 1.35,
      wheelMultiplier: touch ? 1 : 1.2,
      content: document.body,
      autoResize: true,
    });

    lenisRef.current = lenis;
    window.__lenis = lenis;

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: document.body.style.transform ? "transform" : "fixed",
    });

    const onScroll = () => {
      ScrollTrigger.update();
      window.dispatchEvent(new Event("scroll"));
    };
    lenis.on("scroll", onScroll);

    const lenisRaf = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(lenisRaf);
    gsap.ticker.lagSmoothing(0);

    const refreshScroll = () => {
      resetScrollPosition();
      lenis.resize();
      ScrollTrigger.refresh();
    };

    requestAnimationFrame(refreshScroll);
    window.addEventListener("load", refreshScroll);

    const resizeObserver = new ResizeObserver(() => {
      lenis.resize();
      ScrollTrigger.refresh();
    });
    resizeObserver.observe(document.body);

    return () => {
      window.removeEventListener("load", refreshScroll);
      lenis.off("scroll", onScroll);
      resizeObserver.disconnect();
      gsap.ticker.remove(lenisRaf);
      lenis.destroy();
      lenisRef.current = null;
      window.__lenis = null;
      ScrollTrigger.scrollerProxy(document.documentElement, {});
      document.body.style.overflow = "";
    };
  }, []);

  return <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>;
}
