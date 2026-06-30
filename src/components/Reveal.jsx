import { Children, isValidElement } from "react";
import { motion } from "framer-motion";
import { prefersReducedMotion } from "../lib/input.js";

const easing = [0.22, 1, 0.36, 1];

/** Default pause before optional motion begins (seconds). */
export const REVEAL_DEFAULT_DELAY = 0.22;

/**
 * Content is always visible — opacity is never used to hide elements.
 * Optional fade-up only when motion is allowed and the block enters view.
 */
export default function Reveal({
  children,
  delay = 0,
  revealDelay = REVEAL_DEFAULT_DELAY,
  y = 16,
  className = "",
  once = true,
  duration = 0.75,
}) {
  const reduced = prefersReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 1, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.05, margin: "0px 0px -40px 0px" }}
      transition={{ duration, delay: revealDelay + delay, ease: easing }}
    >
      {children}
    </motion.div>
  );
}

export function RevealStagger({
  children,
  className = "",
  stagger = 0.12,
  revealDelay = REVEAL_DEFAULT_DELAY,
  y = 14,
  once = true,
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
          initial={{ opacity: 1, y }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once, amount: 0.05, margin: "0px 0px -40px 0px" }}
          transition={{
            duration: 0.7,
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
  lineStagger = 0.12,
}) {
  if (prefersReducedMotion()) {
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
        <motion.span
          key={i}
          className={`block ${lineClassName}`}
          initial={{ opacity: 1, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05, margin: "0px 0px -40px 0px" }}
          transition={{
            duration: 0.8,
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
