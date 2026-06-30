/** Native smooth scroll to an element — no Lenis dependency. */
export function scrollToTarget(target, { offset = -80 } = {}) {
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return;

  const top = el.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: "smooth" });
}
