import { gsap } from "./gsap.js";
import { isTouchDevice, prefersReducedMotion } from "./input.js";

/**
 * Scroll-velocity skew: registered elements lean with Lenis velocity and
 * ease back upright as scrolling settles. One shared ticker drives all
 * targets; it detaches when idle-ish values converge and no targets remain.
 */
const targets = new Set();
let current = 0;
let tickerActive = false;

function apply() {
  const transform = `skewY(${current.toFixed(3)}deg)`;
  for (const el of targets) {
    el.style.transform = transform;
  }
}

function tick() {
  const lenis = window.__lenis;
  const velocity = lenis ? lenis.velocity : 0;
  const target = gsap.utils.clamp(-2.2, 2.2, velocity * 0.045);

  current += (target - current) * 0.1;

  if (Math.abs(current) < 0.01 && Math.abs(target) < 0.01) {
    if (current !== 0) {
      current = 0;
      apply();
    }
    return;
  }

  apply();
}

export function bindVelocitySkew(el) {
  if (prefersReducedMotion() || isTouchDevice()) return () => {};

  targets.add(el);
  el.style.willChange = "transform";

  if (!tickerActive) {
    gsap.ticker.add(tick);
    tickerActive = true;
  }

  return () => {
    targets.delete(el);
    el.style.transform = "";
    el.style.willChange = "";
    if (!targets.size && tickerActive) {
      gsap.ticker.remove(tick);
      tickerActive = false;
    }
  };
}
