import gsap from "gsap";
import { prefersReducedMotion } from "./input.js";

const ease = [0.76, 0, 0.24, 1];

/**
 * Expand a clicked nav link rect to fullscreen, then run callback (navigate).
 */
export function zoomFromNavLink(anchor, onComplete) {
  if (prefersReducedMotion() || !(anchor instanceof HTMLElement)) {
    onComplete();
    return;
  }

  const rect = anchor.getBoundingClientRect();
  const label = anchor.textContent?.trim() || "Navigate";

  const overlay = document.createElement("div");
  overlay.setAttribute("aria-hidden", "true");
  overlay.className =
    "fixed z-[450] flex items-center justify-center overflow-hidden bg-[#203140] text-ink";

  const labelEl = document.createElement("span");
  labelEl.className =
    "pointer-events-none font-sans text-[clamp(2.25rem,9vw,5rem)] font-bold uppercase leading-none tracking-tight";
  labelEl.textContent = label;

  overlay.style.left = `${rect.left}px`;
  overlay.style.top = `${rect.top}px`;
  overlay.style.width = `${Math.max(rect.width, 2)}px`;
  overlay.style.height = `${Math.max(rect.height, 2)}px`;
  overlay.style.transformOrigin = "center center";

  overlay.appendChild(labelEl);
  document.body.appendChild(overlay);

  gsap.to(overlay, {
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight,
    borderRadius: 0,
    duration: 0.18,
    ease,
    onComplete: () => {
      onComplete();
      gsap.to(labelEl, {
        scale: 1.04,
        opacity: 0,
        duration: 0.06,
        ease: "power2.in",
        onComplete: () => overlay.remove(),
      });
    },
  });
}
