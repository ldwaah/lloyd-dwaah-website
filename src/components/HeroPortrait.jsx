import { useEffect, useRef } from "react";
import { heroScrollState } from "../lib/heroScroll.js";
import { usePointerRef, prefersReducedMotion, isTouchDevice } from "../lib/input.js";
import { useInlineAutoplayVideo } from "../lib/useInlineAutoplayVideo.js";
import { avatarConfig } from "../data/site.js";
import HeroTexture from "./HeroTexture.jsx";
import HeroCursorField from "./HeroCursorField.jsx";

/**
 * Scroll- and pointer-driven hero portrait.
 * Layer: texture → cursor field → portrait stage (SVG + optional masked video) → wash.
 *
 * Static portrait uses lloyd-portrait.svg (alpha cutout). Ambient video is H.264 without
 * an alpha channel — it is clipped to the same SVG silhouette so no rectangular frame shows.
 */
const PORTRAIT_MASK = `url("${avatarConfig.portraitSvg || "/assets/lloyd-portrait.svg"}")`;
const portraitMaskStyle = {
  maskImage: PORTRAIT_MASK,
  WebkitMaskImage: PORTRAIT_MASK,
  maskSize: "contain",
  WebkitMaskSize: "contain",
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
  maskPosition: "center top",
  WebkitMaskPosition: "center top",
};

const canUsePortraitVideo = () =>
  !prefersReducedMotion() && Boolean(avatarConfig.video);

export default function HeroPortrait({ src, onReady }) {
  const stageRef = useRef(null);
  const portraitRef = useRef(null);
  const washRef = useRef(null);
  const pointer = usePointerRef();
  const readyNotified = useRef(false);
  const { videoRef, playing: videoPlaying, mounted: mountVideo } = useInlineAutoplayVideo({
    enabled: canUsePortraitVideo(),
  });

  useEffect(() => {
    const notify = () => {
      if (readyNotified.current || !onReady) return;
      readyNotified.current = true;
      onReady();
    };

    const img = new Image();
    img.onload = notify;
    img.onerror = notify;
    img.src = src;

    const node = portraitRef.current;
    if (node?.complete) notify();
  }, [src, onReady]);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    const touch = isTouchDevice();
    let frame = 0;

    const tick = () => {
      const stage = stageRef.current;
      const wash = washRef.current;
      if (stage && !reduced) {
        const sp = heroScrollState.current;
        const p = pointer.current;
        const parallax = touch ? 0.35 : 1;
        const scale = 1 + sp * 0.012;
        const y = sp * -10 + p.y * 8 * parallax;
        const x = p.x * 12 * parallax;
        const opacity = Math.max(0.78, 1 - sp * 0.1);
        const transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;

        stage.style.transform = transform;
        stage.style.opacity = `${opacity}`;
      }

      if (wash && !reduced) {
        const sp = heroScrollState.current;
        wash.style.opacity = `${Math.min(0.5, 0.3 + sp * 0.15)}`;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [pointer]);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 flex items-start justify-center overflow-hidden px-5 pb-28 pt-14 md:px-10 md:pb-36 md:pt-16"
      aria-hidden="true"
    >
      <HeroTexture />
      <HeroCursorField />
      <div
        ref={stageRef}
        className="relative z-[2] inline-flex max-w-[min(92vw,680px)] items-start justify-center will-change-transform md:max-w-[min(78vw,760px)]"
      >
        <img
          ref={portraitRef}
          src={src}
          alt=""
          decoding="async"
          className="block max-h-[min(70svh,640px)] max-w-full object-contain object-top md:max-h-[min(76svh,720px)]"
          style={{ opacity: videoPlaying ? 0 : 1 }}
        />
        {mountVideo && (
          <video
            ref={videoRef}
            src={avatarConfig.video}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
            className="brand-video hero-portrait-video pointer-events-none absolute inset-0 h-full w-full object-contain object-top transition-opacity duration-700 ease-out"
            style={{
              opacity: videoPlaying ? 1 : 0,
              visibility: videoPlaying ? "visible" : "hidden",
              clipPath: videoPlaying ? "none" : "inset(100%)",
              ...portraitMaskStyle,
            }}
          />
        )}
      </div>
      <div
        ref={washRef}
        className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-b from-hq/15 via-transparent via-45% to-hq-deep"
      />
    </div>
  );
}
