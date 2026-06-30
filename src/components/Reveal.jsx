import { Children, isValidElement } from "react";
import { motion } from "framer-motion";
import { prefersReducedMotion } from "../lib/input.js";

const easing = [0.22, 1, 0.36, 1];

/** Default pause after entering viewport before fade-up begins (seconds). */
export const REVEAL_DEFAULT_DELAY = 0.22;

export default function Reveal({
  children,
  delay = 0,
  revealDelay = REVEAL_DEFAULT_DELAY,
  y = 24,
  className = "",
  once = true,
  duration = 0.85,
  viewportMargin = "-8% 0px",
}) {
  const reduced = prefersReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: viewportMargin }}
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
  viewportMargin = "-8% 0px",
}) {
  const reduced = prefersReducedMotion();
  const items = Children.toArray(children).filter(isValidElement);

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={className}>
      {items.map((child, i) => (
        <motion.div
          key={child.key ?? i}
          initial={{ opacity: 0, y }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once, margin: viewportMargin }}
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
    <div className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            className={`block ${lineClassName}`}
            initial={{ y: "110%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{
              duration: 1.1,
              delay: revealDelay + i * lineStagger,
              ease: easing,
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </div>
  );
}
