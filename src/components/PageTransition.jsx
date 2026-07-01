import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import {
  clearPageEnterTransition,
  isPageEnterTransition,
} from "../lib/pageTransition.js";
import { prefersReducedMotion } from "../lib/input.js";

const ease = [0.76, 0, 0.24, 1];

export default function PageTransition() {
  const [phase, setPhase] = useState(() =>
    isPageEnterTransition() && !prefersReducedMotion() ? "enter" : "idle"
  );

  useEffect(() => {
    if (phase !== "enter") return undefined;

    const root = document.getElementById("root");
    if (root) {
      gsap.fromTo(root, { scale: 1.015, opacity: 0.94 }, { scale: 1, opacity: 1, duration: 0.42, ease });
    }

    const timer = window.setTimeout(() => {
      clearPageEnterTransition();
      setPhase("idle");
    }, 400);

    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const onExit = () => setPhase("exit");
    window.addEventListener("lloyd:page-exit", onExit);
    return () => window.removeEventListener("lloyd:page-exit", onExit);
  }, []);

  if (prefersReducedMotion()) return null;

  return (
    <AnimatePresence>
      {phase !== "idle" && (
        <motion.div
          key={phase}
          initial={
            phase === "enter"
              ? { y: 0 }
              : { y: "100%" }
          }
          animate={
            phase === "enter"
              ? { y: "-100%" }
              : { y: 0 }
          }
          exit={{ y: "-100%" }}
          transition={{ duration: 0.38, ease }}
          className="pointer-events-none fixed inset-0 z-[400] bg-[#203140]"
          aria-hidden="true"
        >
          <div className="absolute inset-x-0 bottom-0 h-px bg-accent/30" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-sans text-[10px] uppercase tracking-[0.38em] text-ink/50">
            Lloyd Dwaah
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
