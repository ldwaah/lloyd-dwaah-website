import { useEffect, useRef, useState } from "react";

const MAX_PLAY_ATTEMPTS = 6;
const FAIL_MS = 2800;

export function armInlineAutoplay(video) {
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
}

/**
 * Muted inline autoplay with retry — video stays hidden until `playing`.
 * Falls back (unmounts video) when autoplay is blocked so native play UI never shows.
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

    let cancelled = false;
    let playAttempts = 0;

    const dropVideo = () => {
      if (cancelled) return;
      setMounted(false);
      setPlaying(false);
      onDropRef.current?.();
    };

    const tryPlay = () => {
      if (cancelled || !video) return;
      playAttempts += 1;
      armInlineAutoplay(video);

      const playPromise = video.play();
      if (!playPromise) return;

      playPromise
        .then(() => {
          if (!cancelled) setPlaying(true);
        })
        .catch(() => {
          if (cancelled) return;
          if (playAttempts >= MAX_PLAY_ATTEMPTS) dropVideo();
        });
    };

    const onPlaying = () => {
      if (!cancelled) setPlaying(true);
    };

    const onCanPlay = () => tryPlay();
    const onLoadedData = () => tryPlay();
    const onVisibility = () => {
      if (document.visibilityState === "visible" && video.paused) tryPlay();
    };

    armInlineAutoplay(video);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("loadeddata", onLoadedData);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pageshow", onVisibility);

    tryPlay();

    const failTimer = window.setTimeout(() => {
      if (!cancelled && video.paused) dropVideo();
    }, FAIL_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(failTimer);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("loadeddata", onLoadedData);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pageshow", onVisibility);
    };
  }, [mounted]);

  return { videoRef, playing, mounted };
}
