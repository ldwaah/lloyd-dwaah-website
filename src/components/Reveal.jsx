import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { prefersReducedMotion } from "../lib/input.js";
import { shouldAnimateScroll } from "../lib/gsap.js";
import {
  bindScrollReveal,
  bindScrollRevealLines,
  bindScrollRevealStagger,
  bindMaskedLineReveal,
  bindImageReveal,
  bindParallax,
} from "../lib/scrollReveal.js";
import { bindVelocitySkew } from "../lib/velocity.js";

export const REVEAL_DEFAULT_DELAY = 0;

export default function Reveal({
  children,
  className = "",
  delay = 0,
  y = 24,
  revealDelay = 0.22,
  fade = true,
  blur = true,
  rotateY = 0,
}) {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!shouldAnimateScroll() || prefersReducedMotion() || reducedMotion) return undefined;

    const el = ref.current;
    if (!el) return undefined;

    return bindScrollReveal(el, { y, delay, revealDelay, fade, blur, rotateY });
  }, [delay, y, revealDelay, fade, blur, rotateY, reducedMotion]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/**
 * Display type entrance: masked line-by-line rise, plus scroll-velocity skew.
 * Children must be plain text (it is split into words for line grouping).
 */
export function RevealHeading({
  as: Tag = "h2",
  children,
  className = "",
  delay = 0,
  stagger = 0.09,
  skew = true,
}) {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!shouldAnimateScroll() || prefersReducedMotion() || reducedMotion) return undefined;

    const el = ref.current;
    if (!el) return undefined;

    const cleanups = [bindMaskedLineReveal(el, { delay, stagger })];
    if (skew) cleanups.push(bindVelocitySkew(el));

    return () => cleanups.forEach((fn) => fn());
  }, [delay, stagger, skew, reducedMotion]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/** Image unclip + settle. Wrap an overflow container holding an img/video. */
export function RevealImage({ children, className = "", delay = 0, radius = "0px" }) {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!shouldAnimateScroll() || prefersReducedMotion() || reducedMotion) return undefined;

    const el = ref.current;
    if (!el) return undefined;

    return bindImageReveal(el, { delay, radius });
  }, [delay, radius, reducedMotion]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** Scrubbed parallax drift over the wrapped content's visible range. */
export function Parallax({ children, className = "", from = -7, to = 7 }) {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!shouldAnimateScroll() || prefersReducedMotion() || reducedMotion) return undefined;

    const el = ref.current;
    if (!el) return undefined;

    return bindParallax(el, { from, to });
  }, [from, to, reducedMotion]);

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
