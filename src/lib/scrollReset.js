const USER_SCROLL_THRESHOLD = 24;

/** Keep first paint at the top of the page (hero), not a restored scroll offset. */
export function enableManualScrollRestoration() {
  if (typeof window === "undefined" || !("scrollRestoration" in history)) return;
  history.scrollRestoration = "manual";
}

export function getScrollOffset() {
  if (typeof window === "undefined") return 0;
  if (window.__lenis) return window.__lenis.scroll;
  return window.scrollY || document.documentElement.scrollTop || 0;
}

/** True when the user has already moved away from the hero. */
export function hasUserScrolled() {
  return getScrollOffset() > USER_SCROLL_THRESHOLD;
}

/**
 * Reset scroll to top — only when safe (user has not scrolled yet).
 * Prevents preloader / route handoff from snapping the page back up.
 */
export function resetScrollPosition({ force = false } = {}) {
  if (typeof window === "undefined") return;
  if (!force && hasUserScrolled()) return;

  enableManualScrollRestoration();
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  if (window.__lenis) {
    window.__lenis.scrollTo(0, { immediate: true });
  }
}
