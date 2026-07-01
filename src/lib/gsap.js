import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "./input.js";
import {
  scheduleScrollRefresh,
  refreshScrollTriggersNow,
  cancelScheduledScrollRefresh,
} from "./scrollRefresh.js";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export function shouldAnimateScroll() {
  return !prefersReducedMotion();
}

/** @deprecated Prefer scheduleScrollRefresh or refreshScrollTriggersNow */
export function refreshScrollTriggers() {
  scheduleScrollRefresh({ force: true });
}

export { scheduleScrollRefresh, refreshScrollTriggersNow, cancelScheduledScrollRefresh };
