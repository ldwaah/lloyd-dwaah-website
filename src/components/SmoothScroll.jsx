import { createContext, useContext, useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";
import { isTouchDevice, prefersReducedMotion } from "../lib/input.js";
import { resetScrollPosition, enableManualScrollRestoration } from "../lib/scrollReset.js";
import {
  scheduleScrollRefresh,
  refreshScrollTriggersNow,
  cancelScheduledScrollRefresh,
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
      lerp: touch ? 0.14 : 0.11,
      duration: touch ? 0.55 : 0.6,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      syncTouch: touch,
      syncTouchLerp: touch ? 0.18 : 0.12,
      touchMultiplier: touch ? 1.1 : 1,
      wheelMultiplier: touch ? 1 : 1.05,
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

    const onLayoutReady = () => {
      refreshScrollTriggersNow();
    };

    requestAnimationFrame(onLayoutReady);
    window.addEventListener("load", onLayoutReady);

    const resizeObserver = new ResizeObserver(() => {
      scheduleScrollRefresh();
    });
    resizeObserver.observe(document.body);

    return () => {
      window.removeEventListener("load", onLayoutReady);
      cancelScheduledScrollRefresh();
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
