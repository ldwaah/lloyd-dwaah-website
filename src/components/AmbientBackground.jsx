import { motion, useScroll, useTransform } from "framer-motion";
import TopographicLines from "./TopographicLines.jsx";
import { prefersReducedMotion } from "../lib/input.js";

/**
 * Atmospheric depth for inner pages — scroll-linked parallax gradients.
 */
export default function AmbientBackground({ variant = "default" }) {
  const reduced = prefersReducedMotion();
  const { scrollYProgress } = useScroll();

  const gradY = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "14%"]);
  const glowY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -80]);
  const glowY2 = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 60]);
  const gridOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.03, 0.045, 0.025]);
  const topoY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -100]);

  const gradients = {
    default: "from-hq via-hq-deep to-hq-darker",
    experience: "from-hq-darker via-hq to-hq-light/20",
    ventures: "from-hq via-hq-deep to-hq-darker",
    publications: "from-[#1a2832] via-hq to-hq-darker",
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <motion.div
        style={{ y: gradY }}
        className={`absolute inset-0 h-[115vh] bg-gradient-to-br ${gradients[variant] || gradients.default}`}
      />

      <motion.div style={{ y: topoY }} className="absolute inset-0 h-[120vh] opacity-[0.04]">
        <TopographicLines className="h-full w-full" />
      </motion.div>

      <motion.div
        style={{ y: glowY }}
        className="absolute -left-1/4 top-0 h-[60vh] w-[60vw] rounded-full bg-accent/5 blur-[120px]"
      />
      <motion.div
        style={{ y: glowY2 }}
        className="absolute -right-1/4 bottom-0 h-[50vh] w-[50vw] rounded-full bg-accent-dim/5 blur-[100px]"
      />

      <motion.div
        style={{
          opacity: reduced ? 0.03 : gridOpacity,
          backgroundImage:
            "linear-gradient(rgba(94,234,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(94,234,255,0.5) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
        className="absolute inset-0"
      />
    </div>
  );
}
