/** Scroll to anchor — uses Lenis when active. */
export function scrollToTarget(target, { offset = -80 } = {}) {
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return;

  const lenis = window.__lenis;
  if (lenis?.scrollTo) {
    lenis.scrollTo(el, { offset, duration: 1.1 });
    return;
  }

  const top = el.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: "smooth" });
}
