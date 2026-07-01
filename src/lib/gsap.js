import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "./input.js";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export function shouldAnimateScroll() {
  return !prefersReducedMotion();
}

export function refreshScrollTriggers() {
  window.__lenis?.resize();
  ScrollTrigger.refresh();
}
