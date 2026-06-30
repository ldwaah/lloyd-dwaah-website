import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { avatarConfig } from "../data/site.js";
import { prefersReducedMotion } from "../lib/input.js";

const MIN_MS = 1200;
const MAX_MS = 4200;
const SESSION_KEY = "lloyd-home-preloaded";

const ease = [0.22, 1, 0.36, 1];

export function hasSeenHomePreloader() {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(SESSION_KEY) === "1";
}

export function markHomePreloaderSeen() {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(SESSION_KEY, "1");
  }
}

export default function Preloader({ active, sceneReady, onComplete }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!active) return;
    setVisible(true);
  }, [active]);

  useEffect(() => {
    if (!active || !visible) return;

    const reduced = prefersReducedMotion();
    if (reduced) {
      markHomePreloaderSeen();
      onComplete();
      return;
    }

    let cancelled = false;
    let imageReady = false;
    let minElapsed = false;

    const tryExit = () => {
      if (cancelled || !visible) return;
      if (minElapsed && imageReady && sceneReady) {
        setVisible(false);
      }
    };

    const img = new Image();
    img.onload = () => {
      imageReady = true;
      tryExit();
    };
    img.onerror = () => {
      imageReady = true;
      tryExit();
    };
    img.src = avatarConfig.image;

    const minTimer = window.setTimeout(() => {
      minElapsed = true;
      tryExit();
    }, MIN_MS);

    const maxTimer = window.setTimeout(() => {
      if (!cancelled && visible) setVisible(false);
    }, MAX_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(minTimer);
      window.clearTimeout(maxTimer);
    };
  }, [active, onComplete, sceneReady, visible]);

  useEffect(() => {
    if (!active || !visible) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [active, visible]);

  if (!active) return null;

  return (
    <AnimatePresence onExitComplete={() => {
      markHomePreloaderSeen();
      document.body.style.overflow = "";
      onComplete();
    }}>
      {visible && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "-100%" }}
          transition={{ duration: 0.85, ease }}
          className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-[#203140]"
          role="status"
          aria-live="polite"
          aria-label="Loading Lloyd Dwaah"
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, ease }}
            className="flex flex-col items-center"
          >
            <span className="relative grid h-[4.5rem] w-[4.5rem] place-items-center md:h-20 md:w-20">
              <span className="absolute inset-0 rounded-full bg-accent/15 blur-xl" />
              <span className="relative grid h-full w-full place-items-center overflow-hidden rounded-full border border-accent/25 bg-hq-deep/80 ring-1 ring-white/10">
                <img
                  src={avatarConfig.image}
                  alt=""
                  className="h-full w-full object-cover object-[center_20%]"
                />
              </span>
              <span className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full border border-accent/30 bg-hq-deep/90 font-sans text-[9px] font-bold tracking-[0.2em] text-ink/90">
                LD
              </span>
            </span>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.7, ease }}
              className="mt-8 font-sans text-[11px] font-light uppercase tracking-[0.38em] text-ink/70"
            >
              Loading Lloyd
            </motion.p>

            <motion.span
              className="mt-6 block h-px w-12 bg-accent/30"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 1.1, ease }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
