import { prefersReducedMotion } from "./input.js";

export const PAGE_EXIT_KEY = "lloyd-page-exit";

export function isPageEnterTransition() {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(PAGE_EXIT_KEY) === "1";
}

export function clearPageEnterTransition() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(PAGE_EXIT_KEY);
  }
}

function normalizePath(path) {
  return path.replace(/\/index\.html$/i, "/").replace(/\.html$/i, "") || "/";
}

export function isInternalNavLink(anchor) {
  if (!anchor?.href) return false;
  if (anchor.target === "_blank" || anchor.hasAttribute("download")) return false;
  if (anchor.origin !== window.location.origin) return false;

  const path = normalizePath(anchor.pathname);
  const hash = anchor.hash;
  const current = normalizePath(window.location.pathname);

  if (path === current && hash) return false;
  if (path === current && !hash) return false;

  return path.startsWith("/");
}

export function navigateWithTransition(href, { delay = 480 } = {}) {
  if (prefersReducedMotion()) {
    window.location.href = href;
    return;
  }

  sessionStorage.setItem(PAGE_EXIT_KEY, "1");
  window.dispatchEvent(new CustomEvent("lloyd:page-exit"));

  window.setTimeout(() => {
    window.location.href = href;
  }, delay);
}

export function initPageTransitionLinks(root = document) {
  root.addEventListener("click", (event) => {
    const anchor = event.target.closest("a[href]");
    if (!anchor || !isInternalNavLink(anchor)) return;

    event.preventDefault();
    navigateWithTransition(anchor.href);
  });
}
