import { useLayoutEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { prefersReducedMotion } from "../lib/input.js";
import { easeOut } from "../lib/motion.js";

export const REVEAL_DEFAULT_DELAY = 0;

const VIEWPORT = {
  once: true,
  amount: 0.1,
  margin: "0px 0px -60px 0px",
};

function useRevealReady(ref) {
  const isInView = useInView(ref, VIEWPORT);
  const [ready, setReady] = useState(false);
  const [visibleOnMount, setVisibleOnMount] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) {
      setReady(true);
      return;
    }

    const { top, bottom } = el.getBoundingClientRect();
    const viewportCutoff = window.innerHeight - 60;
    setVisibleOnMount(top < viewportCutoff && bottom > 0);
    setReady(true);
  }, []);

  return {
    ready,
    revealed: isInView || visibleOnMount,
    visibleOnMount,
  };
}

export default function Reveal({
  children,
  className = "",
  delay = 0,
  y = 24,
  revealDelay = 0.22,
}) {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();
  const { ready, revealed, visibleOnMount } = useRevealReady(ref);

  if (!ready || prefersReducedMotion() || reducedMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 1, y: visibleOnMount ? 0 : y }}
      animate={{ opacity: 1, y: revealed ? 0 : y }}
      transition={{
        duration: 0.75,
        delay: visibleOnMount ? 0 : revealDelay + delay,
        ease: easeOut,
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealStagger({ children, className = "", stagger = 0.08, y = 20 }) {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();
  const { ready, revealed, visibleOnMount } = useRevealReady(ref);

  if (!ready || prefersReducedMotion() || reducedMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={revealed ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: stagger,
            delayChildren: visibleOnMount ? 0 : 0.12,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealStaggerItem({ children, className = "", y = 20 }) {
  const reducedMotion = useReducedMotion();

  if (prefersReducedMotion() || reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      data-reveal-item=""
      variants={{
        hidden: { opacity: 1, y },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, ease: easeOut },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealLines({ lines, className = "", lineClassName = "" }) {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();
  const { ready, revealed, visibleOnMount } = useRevealReady(ref);

  if (!ready || prefersReducedMotion() || reducedMotion) {
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
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={revealed ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.08,
            delayChildren: visibleOnMount ? 0 : 0.1,
          },
        },
      }}
    >
      {lines.map((line, i) => (
        <motion.span
          key={i}
          data-reveal-line=""
          className={`block ${lineClassName}`}
          variants={{
            hidden: { opacity: 1, y: 16 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.7, ease: easeOut },
            },
          }}
        >
          {line}
        </motion.span>
      ))}
    </motion.div>
  );
}
