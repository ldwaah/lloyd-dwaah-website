import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { prefersReducedMotion } from "../lib/input.js";
import { shouldAnimateScroll } from "../lib/gsap.js";
import {
  bindScrollReveal,
  bindScrollRevealLines,
  bindScrollRevealStagger,
} from "../lib/scrollReveal.js";

export const REVEAL_DEFAULT_DELAY = 0;

export default function Reveal({
  children,
  className = "",
  delay = 0,
  y = 24,
  revealDelay = 0.22,
}) {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!shouldAnimateScroll() || prefersReducedMotion() || reducedMotion) return undefined;

    const el = ref.current;
    if (!el) return undefined;

    return bindScrollReveal(el, { y, delay, revealDelay });
  }, [delay, y, revealDelay, reducedMotion]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export function RevealStagger({ children, className = "", stagger = 0.08, y = 20 }) {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!shouldAnimateScroll() || prefersReducedMotion() || reducedMotion) return undefined;

    const el = ref.current;
    if (!el) return undefined;

    return bindScrollRevealStagger(el, "[data-reveal-item]", { stagger, y });
  }, [stagger, y, reducedMotion]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export function RevealStaggerItem({ children, className = "", y = 20 }) {
  const reducedMotion = useReducedMotion();

  if (prefersReducedMotion() || reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={className} data-reveal-item="">
      {children}
    </div>
  );
}

export function RevealLines({ lines, className = "", lineClassName = "" }) {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!shouldAnimateScroll() || prefersReducedMotion() || reducedMotion) return undefined;

    const el = ref.current;
    if (!el) return undefined;

    return bindScrollRevealLines(el, "[data-reveal-line]", { y: 16 });
  }, [reducedMotion]);

  return (
    <div ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} data-reveal-line="" className={`block ${lineClassName}`}>
          {line}
        </span>
      ))}
    </div>
  );
}
