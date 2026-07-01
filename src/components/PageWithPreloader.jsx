import { useEffect, useState } from "react";
import Preloader from "./Preloader.jsx";
import { isPageEnterTransition } from "../lib/pageTransition.js";
import { prefersReducedMotion } from "../lib/input.js";
import { resetScrollPosition } from "../lib/scrollReset.js";
import { refreshScrollTriggersNow } from "../lib/gsap.js";

function shouldSkipPreloader(variant) {
  if (prefersReducedMotion()) return true;
  if (!isPageEnterTransition()) return false;
  // Arrived via same-site nav — transition curtain already ran; skip repeat load.
  return variant === "page" || variant === "home";
}

/**
 * Wraps page content with cinematic preloader (direct load / refresh).
 * Skips on internal navigation — PageTransition handles the handoff.
 * @param {"home" | "page"} variant
 */
export default function PageWithPreloader({ children, variant = "page", sceneReady = true }) {
  const skip = shouldSkipPreloader(variant);
  const [booted, setBooted] = useState(skip);
  const [preloaderActive, setPreloaderActive] = useState(!skip);

  useEffect(() => {
    resetScrollPosition();
  }, []);

  return (
    <>
      <Preloader
        active={preloaderActive}
        variant={variant}
        sceneReady={sceneReady}
        onComplete={() => {
          setPreloaderActive(false);
          setBooted(true);
          requestAnimationFrame(() => refreshScrollTriggersNow());
        }}
      />
      <div className={booted ? "contents" : "pointer-events-none opacity-0"}>{children}</div>
    </>
  );
}
