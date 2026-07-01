/** Keep first paint at the top of the page (hero), not a restored scroll offset. */
export function enableManualScrollRestoration() {
  if (typeof window === "undefined" || !("scrollRestoration" in history)) return;
  history.scrollRestoration = "manual";
}

export function resetScrollPosition() {
  if (typeof window === "undefined") return;

  enableManualScrollRestoration();
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  if (window.__lenis) {
    window.__lenis.scrollTo(0, { immediate: true });
  }
}
