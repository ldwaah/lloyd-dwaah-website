import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { prefersReducedMotion } from "../lib/input.js";

const SESSION_KEY = "lloyd-publications-intro-seen";
const INTRO_VIDEO = "/assets/publications/intro.mp4";
const INTRO_POSTER = "/assets/publications/intro-poster.jpg";
/** Start crossfade this many seconds before the video ends */
const FADE_LEAD_S = 0.75;
const EXIT_MS = 900;
const MAX_MS = 10000;

const ease = [0.22, 1, 0.36, 1];

export function hasSeenPublicationsIntro() {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(SESSION_KEY) === "1";
}

export function markPublicationsIntroSeen() {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(SESSION_KEY, "1");
  }
}

export default function PublicationsIntro({ onComplete, onFadeStart }) {
  const videoRef = useRef(null);
  const fadeStarted = useRef(false);
  const [visible, setVisible] = useState(true);

  const beginCrossfade = () => {
    if (fadeStarted.current) return;
    fadeStarted.current = true;
    onFadeStart?.();
    setVisible(false);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || fadeStarted.current || !Number.isFinite(video.duration)) return;
    const remaining = video.duration - video.currentTime;
    if (remaining <= FADE_LEAD_S) beginCrossfade();
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const maxTimer = window.setTimeout(beginCrossfade, MAX_MS);

    return () => {
      window.clearTimeout(maxTimer);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence
      onExitComplete={() => {
        markPublicationsIntroSeen();
        document.body.style.overflow = "";
        onComplete?.();
      }}
    >
      {visible && (
        <motion.div
          key="publications-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: EXIT_MS / 1000, ease }}
          className="fixed inset-0 z-[250] flex items-center justify-center bg-[#203140]"
          role="dialog"
          aria-modal="true"
          aria-label="Publications introduction"
        >
          <video
            ref={videoRef}
            src={INTRO_VIDEO}
            poster={INTRO_POSTER}
            muted
            playsInline
            autoPlay
            preload="auto"
            onTimeUpdate={handleTimeUpdate}
            onEnded={beginCrossfade}
            onError={beginCrossfade}
            className="h-full w-full object-cover object-center"
          />

          <button
            type="button"
            onClick={beginCrossfade}
            className="absolute bottom-8 right-8 text-[10px] font-light uppercase tracking-[0.22em] text-ink/45 transition-colors duration-300 hover:text-accent"
          >
            Skip
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function shouldPlayPublicationsIntro() {
  return !prefersReducedMotion() && !hasSeenPublicationsIntro();
}
