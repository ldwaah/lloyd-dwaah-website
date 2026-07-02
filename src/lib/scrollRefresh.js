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
  }, 400);
}

function runScrollRefresh({ resizeLenis = true } = {}) {
  if (isUserScrolling()) return;

  const scrollY = window.__lenis?.scroll ?? window.scrollY;

  if (resizeLenis && window.__lenis) {
    window.__lenis.resize();
  }

  // Safe refresh — never force-reset scroll position (avoids snap-to-top at page bottom).
  ScrollTrigger.refresh(true);

  if (window.__lenis) {
    const maxScroll = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight
    );
    const clamped = Math.min(scrollY, maxScroll);
    if (Math.abs(window.__lenis.scroll - clamped) > 2) {
      window.__lenis.scrollTo(clamped, { immediate: true });
    }
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
  if (scrollIdleTimer) {
    clearTimeout(scrollIdleTimer);
    scrollIdleTimer = null;
    userScrolling = false;
  }
}
