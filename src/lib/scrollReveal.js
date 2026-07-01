import { gsap, ScrollTrigger } from "./gsap.js";

export const REVEAL_EASE = [0.22, 1, 0.36, 1];
export const REVEAL_START = "top 90%";

export function isAboveFold(el, margin = 60) {
  if (!el) return false;
  const { top, bottom } = el.getBoundingClientRect();
  return top < window.innerHeight - margin && bottom > 0;
}

/**
 * Lenis-synced fade-up reveal via ScrollTrigger.
 * Above-fold elements render immediately; others animate on enter.
 */
export function bindScrollReveal(
  el,
  { y = 24, delay = 0, revealDelay = 0.22, start = REVEAL_START } = {}
) {
  gsap.set(el, { opacity: 1 });

  if (isAboveFold(el)) {
    gsap.set(el, { y: 0 });
    return () => {};
  }

  gsap.set(el, { y });

  const tl = gsap.timeline({ paused: true }).to(el, {
    y: 0,
    duration: 0.75,
    ease: REVEAL_EASE,
    delay: revealDelay + delay,
  });

  const trigger = ScrollTrigger.create({
    trigger: el,
    start,
    once: true,
    onEnter: () => tl.play(),
  });

  return () => {
    trigger.kill();
    tl.kill();
  };
}

export function bindScrollRevealStagger(
  container,
  itemSelector,
  { stagger = 0.08, y = 20, start = REVEAL_START } = {}
) {
  const items = [...container.querySelectorAll(itemSelector)];
  gsap.set(items, { opacity: 1 });

  if (isAboveFold(container)) {
    gsap.set(items, { y: 0 });
    return () => {};
  }

  gsap.set(items, { y });

  const tl = gsap.timeline({ paused: true }).to(items, {
    y: 0,
    duration: 0.7,
    ease: REVEAL_EASE,
    stagger,
    delay: 0.12,
  });

  const trigger = ScrollTrigger.create({
    trigger: container,
    start,
    once: true,
    onEnter: () => tl.play(),
  });

  return () => {
    trigger.kill();
    tl.kill();
  };
}

export function bindScrollRevealLines(
  container,
  lineSelector,
  { stagger = 0.08, y = 16, start = REVEAL_START } = {}
) {
  const lines = [...container.querySelectorAll(lineSelector)];
  gsap.set(lines, { opacity: 1 });

  if (isAboveFold(container)) {
    gsap.set(lines, { y: 0 });
    return () => {};
  }

  gsap.set(lines, { y });

  const tl = gsap.timeline({ paused: true }).to(lines, {
    y: 0,
    duration: 0.7,
    ease: REVEAL_EASE,
    stagger,
    delay: 0.1,
  });

  const trigger = ScrollTrigger.create({
    trigger: container,
    start,
    once: true,
    onEnter: () => tl.play(),
  });

  return () => {
    trigger.kill();
    tl.kill();
  };
}
