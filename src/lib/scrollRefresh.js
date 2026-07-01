import { ScrollTrigger } from "gsap/ScrollTrigger";

const DEBOUNCE_MS = 200;
const HEIGHT_THRESHOLD = 12;
const SCROLL_DRIFT_THRESHOLD = 2;

let refreshTimer = null;
let lastBodyHeight = 0;

function getScrollY() {
  if (window.__lenis) return window.__lenis.scroll;
  return window.scrollY;
}

function setScrollY(y) {
  if (window.__lenis) {
    window.__lenis.scrollTo(y, { immediate: true });
  } else {
    window.scrollTo(0, y);
  }
}

function runScrollRefresh({ resizeLenis = true } = {}) {
  const savedScroll = getScrollY();

  if (resizeLenis && window.__lenis) {
    window.__lenis.resize();
  }

  ScrollTrigger.refresh();

  if (Math.abs(getScrollY() - savedScroll) > SCROLL_DRIFT_THRESHOLD) {
    setScrollY(savedScroll);
  }
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
}
