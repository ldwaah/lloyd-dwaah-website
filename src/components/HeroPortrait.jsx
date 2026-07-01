import { useEffect, useRef } from "react";
import { heroScrollState } from "../lib/heroScroll.js";
import { usePointerRef, prefersReducedMotion, isTouchDevice } from "../lib/input.js";
import HeroTexture from "./HeroTexture.jsx";
import HeroCursorField from "./HeroCursorField.jsx";

/**
 * Scroll- and pointer-driven hero portrait from user SVG asset.
 * Layer: texture → cursor field → portrait → wash.
 */
export default function HeroPortrait({ src, onReady }) {
  const portraitRef = useRef(null);
  const washRef = useRef(null);
  const pointer = usePointerRef();
  const readyNotified = useRef(false);

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
      const portrait = portraitRef.current;
      const wash = washRef.current;
      if (portrait && !reduced) {
        const sp = heroScrollState.current;
        const p = pointer.current;
        const parallax = touch ? 0 : 1;
        const scale = 1 + sp * 0.012;
        const y = sp * -10 + p.y * 8 * parallax;
        const x = p.x * 12 * parallax;
        const opacity = Math.max(0.78, 1 - sp * 0.1);

        portrait.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
        portrait.style.opacity = `${opacity}`;
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
      <div className="relative z-[2] flex w-full max-w-[min(92vw,680px)] items-start justify-center md:max-w-[min(78vw,760px)]">
        <img
          ref={portraitRef}
          src={src}
          alt=""
          decoding="async"
          className="max-h-[min(70svh,640px)] max-w-full object-contain object-top will-change-transform md:max-h-[min(76svh,720px)]"
          style={{ opacity: 1 }}
        />
      </div>
      <div
        ref={washRef}
        className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-b from-hq/15 via-transparent via-45% to-hq-deep"
      />
    </div>
  );
}
