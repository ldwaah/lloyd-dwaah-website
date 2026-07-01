import { useEffect, useRef, useState } from "react";

const MAX_PLAY_ATTEMPTS = 10;
const FAIL_MS = 5500;

/** Global registry — first user gesture unlocks all branded inline videos (iOS). */
const brandVideos = new Set();
let gestureListenerAdded = false;

export function armInlineAutoplay(video) {
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
  video.controls = false;
  video.removeAttribute("controls");
}

function unlockAllBrandVideos() {
  for (const video of brandVideos) {
    if (!video.paused) continue;
    armInlineAutoplay(video);
    video.play().catch(() => {});
  }
}

function ensureGestureUnlock() {
  if (gestureListenerAdded || typeof document === "undefined") return;
  gestureListenerAdded = true;

  const unlock = () => {
    unlockAllBrandVideos();
  };

  document.addEventListener("touchstart", unlock, { capture: true, passive: true, once: true });
  document.addEventListener("click", unlock, { capture: true, once: true });
}

/**
 * Muted inline autoplay with retry + gesture unlock.
 * Poster/static layer stays visible underneath; video fades in once frames advance.
 * Unmounts only after retries + gesture window when playback definitively fails.
 */
export function useInlineAutoplayVideo({ enabled = true, onDrop } = {}) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [mounted, setMounted] = useState(enabled);
  const onDropRef = useRef(onDrop);
  onDropRef.current = onDrop;

  useEffect(() => {
    setMounted(enabled);
    if (!enabled) setPlaying(false);
  }, [enabled]);

  useEffect(() => {
    if (!mounted) return undefined;

    const video = videoRef.current;
    if (!video) return undefined;

    brandVideos.add(video);
    ensureGestureUnlock();

    let cancelled = false;
    let playAttempts = 0;
    let inView = true;

    const markPlaying = () => {
      if (cancelled) return;
      if (!video.paused && video.currentTime > 0) setPlaying(true);
    };

    const dropVideo = () => {
      if (cancelled) return;
      setMounted(false);
      setPlaying(false);
      onDropRef.current?.();
    };

    const tryPlay = () => {
      if (cancelled || !video || !inView) return;
      if (!video.paused && video.currentTime > 0) {
        markPlaying();
        return;
      }
      playAttempts += 1;
      armInlineAutoplay(video);

      const playPromise = video.play();
      if (!playPromise) return;

      playPromise.then(markPlaying).catch(() => {
        if (cancelled) return;
        if (playAttempts >= MAX_PLAY_ATTEMPTS) return;
      });
    };

    const onPlaying = () => markPlaying();
    const onTimeUpdate = () => markPlaying();
    const onCanPlay = () => tryPlay();
    const onLoadedMetadata = () => tryPlay();
    const onCanPlayThrough = () => tryPlay();
    const onVisibility = () => {
      if (document.visibilityState === "visible" && video.paused) tryPlay();
    };

    armInlineAutoplay(video);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("canplaythrough", onCanPlayThrough);
    video.addEventListener("loadeddata", onCanPlay);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pageshow", onVisibility);

    const io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            ([entry]) => {
              inView = entry.isIntersecting;
              if (inView) tryPlay();
            },
            { threshold: 0.08 }
          )
        : null;
    io?.observe(video);

    tryPlay();

    const failTimer = window.setTimeout(() => {
      if (!cancelled && video.paused && playAttempts >= 3) dropVideo();
    }, FAIL_MS);

    return () => {
      cancelled = true;
      brandVideos.delete(video);
      window.clearTimeout(failTimer);
      io?.disconnect();
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("canplaythrough", onCanPlayThrough);
      video.removeEventListener("loadeddata", onCanPlay);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pageshow", onVisibility);
    };
  }, [mounted]);

  return { videoRef, playing, mounted };
}
