import { useId } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import TopographicLines from "./TopographicLines.jsx";
import { prefersReducedMotion } from "../lib/input.js";

function FlowingContourLines({ className = "" }) {
  const uid = useId().replace(/:/g, "");
  const gradId = `flow-grad-${uid}`;

  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-[120%] w-full ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
          <stop offset="35%" stopColor="currentColor" stopOpacity="0.45" />
          <stop offset="65%" stopColor="currentColor" stopOpacity="0.45" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>

      <path
        d="M-80 180 C120 80, 280 260, 480 160 S760 40, 1040 140"
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth="0.75"
        className="text-accent"
      />
      <path
        d="M-60 320 C160 220, 340 380, 560 280 S880 180, 1120 260"
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth="0.6"
        className="text-accent"
      />
      <path
        d="M40 480 C200 400, 360 520, 520 440 S760 360, 980 420"
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth="0.5"
        className="text-accent/70"
      />
      <path
        d="M120 60 C300 120, 420 20, 600 80 S840 160, 1080 100"
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth="0.55"
        className="text-accent/60"
      />
    </svg>
  );
}

export default function HomeScrollLayers() {
  const reduced = prefersReducedMotion();
  const { scrollYProgress } = useScroll();

  const topoY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -140]);
  const flowY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -280]);
  const gradientY = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "18%"]);
  const topoOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.05, 0.04, 0.025]);
  const flowOpacity = useTransform(scrollYProgress, [0, 0.45, 1], [0.035, 0.05, 0.02]);

  return (
    <>
      <motion.div
        style={{ y: gradientY }}
        className="pointer-events-none fixed inset-0 z-[1] h-[115vh] overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-hq/30 via-transparent to-hq-deep/70" />
      </motion.div>

      <motion.div
        style={{ y: topoY, opacity: topoOpacity }}
        className="pointer-events-none fixed inset-0 z-[1] h-[120vh]"
        aria-hidden="true"
      >
        <TopographicLines className="h-full w-full opacity-100" />
      </motion.div>

      <motion.div
        style={{ y: flowY, opacity: flowOpacity }}
        className="pointer-events-none fixed inset-0 z-[1] h-[130vh]"
        aria-hidden="true"
      >
        <FlowingContourLines className="text-accent" />
      </motion.div>
    </>
  );
}
