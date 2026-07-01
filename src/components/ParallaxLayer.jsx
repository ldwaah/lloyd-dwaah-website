import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { prefersReducedMotion } from "../lib/input.js";

/**
 * Subtle scroll-linked motion. Opacity stays at 1 — only translate/scale shifts.
 */
export default function ParallaxLayer({
  children,
  className = "",
  yRange = [24, -24],
  opacityRange = null,
  offset = ["start end", "end start"],
}) {
  const ref = useRef(null);
  const reduced = prefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset,
  });

  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : yRange);
  const opacity = opacityRange
    ? useTransform(scrollYProgress, [0, 0.5, 1], reduced ? [1, 1, 1] : opacityRange)
    : 1;

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div ref={ref} style={{ y, opacity }} className={className}>
      {children}
    </motion.div>
  );
}
