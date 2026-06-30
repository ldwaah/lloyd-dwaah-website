import { Children, isValidElement, useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { prefersReducedMotion } from "../lib/input.js";

const easing = [0.22, 1, 0.36, 1];

/** Default pause after entering viewport before fade-up begins (seconds). */
export const REVEAL_DEFAULT_DELAY = 0.22;

/** Trigger earlier — negative margins were hiding content with Lenis smooth scroll. */
const DEFAULT_MARGIN = "0px 0px -80px 0px";

function useRevealVisible(ref, { once, margin, amount }) {
  const inView = useInView(ref, { once, amount, margin });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (inView) {
      setVisible(true);
      return undefined;
    }

    const el = ref.current;
    if (!el) return undefined;

    const check = () => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
        setVisible(true);
      }
    };

    check();
    window.addEventListener("scroll", check, { passive: true });
    const timer = window.setTimeout(check, 1200);

    return () => {
      window.removeEventListener("scroll", check);
      window.clearTimeout(timer);
    };
  }, [inView]);

  return inView || visible;
}

export default function Reveal({
  children,
  delay = 0,
  revealDelay = REVEAL_DEFAULT_DELAY,
  y = 24,
  className = "",
  once = true,
  duration = 0.85,
  viewportMargin,
}) {
  const reduced = prefersReducedMotion();
  const ref = useRef(null);
  const show = useRevealVisible(ref, {
    once,
    amount: 0.12,
    margin: viewportMargin ?? DEFAULT_MARGIN,
  });

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration, delay: revealDelay + delay, ease: easing }}
    >
      {children}
    </motion.div>
  );
}

/** Stagger child elements with incremental reveal delays. */
export function RevealStagger({
  children,
  className = "",
  stagger = 0.12,
  revealDelay = REVEAL_DEFAULT_DELAY,
  y = 20,
  once = true,
  viewportMargin,
}) {
  const reduced = prefersReducedMotion();
  const ref = useRef(null);
  const show = useRevealVisible(ref, {
    once,
    amount: 0.1,
    margin: viewportMargin ?? DEFAULT_MARGIN,
  });
  const items = Children.toArray(children).filter(isValidElement);

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={className}>
      {items.map((child, i) => (
        <motion.div
          key={child.key ?? i}
          initial={{ opacity: 0, y }}
          animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y }}
          transition={{
            duration: 0.8,
            delay: revealDelay + i * stagger,
            ease: easing,
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}

export function RevealLines({
  lines,
  className = "",
  lineClassName = "",
  revealDelay = REVEAL_DEFAULT_DELAY,
  lineStagger = 0.14,
}) {
  const reduced = prefersReducedMotion();
  const ref = useRef(null);
  const show = useRevealVisible(ref, {
    once: true,
    amount: 0.15,
    margin: "0px 0px -60px 0px",
  });

  if (reduced) {
    return (
      <div className={className}>
        {lines.map((line, i) => (
          <span key={i} className={`block ${lineClassName}`}>
            {line}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      {lines.map((line, i) => (
        <motion.span
          key={i}
          className={`block ${lineClassName}`}
          initial={{ opacity: 0, y: 28 }}
          animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          transition={{
            duration: 0.95,
            delay: revealDelay + i * lineStagger,
            ease: easing,
          }}
        >
          {line}
        </motion.span>
      ))}
    </div>
  );
}
