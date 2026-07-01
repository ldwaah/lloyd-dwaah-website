import { ScrollTrigger } from "gsap/ScrollTrigger";

const DEBOUNCE_MS = 250;
const HEIGHT_THRESHOLD = 24;

let refreshTimer = null;
let lastBodyHeight = 0;
let userScrolling = false;
let scrollIdleTimer = null;

function isUserScrolling() {
  if (userScrolling) return true;
  const lenis = window.__lenis;
  return !!lenis?.isScrolling;
}

export function markUserScrolling() {
  userScrolling = true;
  if (scrollIdleTimer) clearTimeout(scrollIdleTimer);
  scrollIdleTimer = window.setTimeout(() => {
    scrollIdleTimer = null;
    userScrolling = false;
  }, 180);
}

function runScrollRefresh({ resizeLenis = true } = {}) {
  if (isUserScrolling()) return;

  if (resizeLenis && window.__lenis) {
    window.__lenis.resize();
  }

  // Safe refresh — recalculate triggers without forcing scroll position.
  ScrollTrigger.refresh(true);
}

/**
 * Debounced ScrollTrigger refresh — skips tiny layout shifts (carousel, etc.)
 * and batches resize events from ResizeObserver.
 */
export function scheduleScrollRefresh({ force = false, resizeLenis = true } = {}) {
  if (typeof window === "undefined") return;

  if (refreshTimer) clearTimeout(refreshTimer);

  refreshTimer = window.setTimeout(() => {
    refreshTimer = null;

    const height = document.body.scrollHeight;
    if (!force && Math.abs(height - lastBodyHeight) < HEIGHT_THRESHOLD) {
      return;
    }

    lastBodyHeight = height;
    runScrollRefresh({ resizeLenis });
  }, DEBOUNCE_MS);
}

/** Immediate refresh for first mount / route entry only. */
export function refreshScrollTriggersNow({ resizeLenis = true } = {}) {
  if (typeof window === "undefined") return;

  lastBodyHeight = document.body.scrollHeight;
  runScrollRefresh({ resizeLenis });
}

export function cancelScheduledScrollRefresh() {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
  if (scrollIdleTimer) {
    clearTimeout(scrollIdleTimer);
    scrollIdleTimer = null;
    userScrolling = false;
  }
}
