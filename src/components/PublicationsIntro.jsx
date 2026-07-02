import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { prefersReducedMotion } from "../lib/input.js";
import { useInlineAutoplayVideo } from "../lib/useInlineAutoplayVideo.js";
import { refreshScrollTriggersNow } from "../lib/gsap.js";
import { resetScrollPosition } from "../lib/scrollReset.js";

const SESSION_KEY = "lloyd-publications-intro-seen";
const INTRO_VIDEO = "/assets/publications/intro.mp4";
const INTRO_POSTER = "/assets/publications/intro-poster.jpg";
/** Start crossfade this many seconds before the video ends */
const FADE_LEAD_S = 0.5;
const EXIT_MS = 550;
const MAX_MS = 9000;

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
  const fadeStarted = useRef(false);
  const [visible, setVisible] = useState(true);

  const beginCrossfade = () => {
    if (fadeStarted.current) return;
    fadeStarted.current = true;
    onFadeStart?.();
    setVisible(false);
  };

  const { videoRef, playing, mounted } = useInlineAutoplayVideo({
    enabled: !prefersReducedMotion(),
  });

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || fadeStarted.current || !Number.isFinite(video.duration)) return;
    const remaining = video.duration - video.currentTime;
    if (remaining <= FADE_LEAD_S) beginCrossfade();
  };

  useEffect(() => {
    const lenis = window.__lenis;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    const maxTimer = window.setTimeout(beginCrossfade, MAX_MS);

    return () => {
      window.clearTimeout(maxTimer);
      lenis?.start();
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence
      onExitComplete={() => {
        markPublicationsIntroSeen();
        document.body.style.overflow = "";
        window.__lenis?.start();
        resetScrollPosition();
        requestAnimationFrame(() => refreshScrollTriggersNow());
        onComplete?.();
      }}
    >
      {visible && (
        <motion.div
          key="publications-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: EXIT_MS / 1000, ease }}
          className="fixed inset-0 z-[250] overflow-hidden bg-[#203140]"
          style={{
            width: "100vw",
            height: "100dvh",
            minHeight: "100vh",
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Publications introduction"
        >
          <img
            src={INTRO_POSTER}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-full w-full min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover"
            style={{ objectPosition: "center center" }}
          />

          {mounted && (
            <video
              ref={videoRef}
              src={INTRO_VIDEO}
              muted
              playsInline
              autoPlay
              preload="auto"
              disablePictureInPicture
              disableRemotePlayback
              onTimeUpdate={handleTimeUpdate}
              onEnded={beginCrossfade}
              onError={beginCrossfade}
              controlsList="nodownload nofullscreen noremoteplayback"
              className="brand-video pointer-events-none absolute left-1/2 top-1/2 z-[1] h-full w-full min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover transition-opacity duration-500 ease-out"
              style={{
                objectPosition: "center center",
                opacity: playing ? 1 : 0,
              }}
            />
          )}

          <button
            type="button"
            onClick={beginCrossfade}
            className="absolute bottom-[max(2rem,env(safe-area-inset-bottom))] right-[max(2rem,env(safe-area-inset-right))] text-[10px] font-light uppercase tracking-[0.22em] text-ink/45 transition-colors duration-300 hover:text-accent"
          >
            Skip
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function shouldPlayPublicationsIntro() {
  // Plays on every visit (owner preference); reduced motion still skips it.
  return !prefersReducedMotion();
}
