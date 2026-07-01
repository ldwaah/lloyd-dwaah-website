import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { avatarConfig } from "../data/site.js";
import { prefersReducedMotion } from "../lib/input.js";
import { resetScrollPosition } from "../lib/scrollReset.js";
import { splitElementChars } from "../lib/splitText.js";

const HOME_MIN_MS = 1200;
const HOME_MAX_MS = 3000;
const PAGE_MIN_MS = 0;
const PAGE_MAX_MS = 1200;
const ease = [0.22, 1, 0.36, 1];

const PRELOADER_TITLE = "LLOYD DWAAH";

/**
 * @param {"home" | "page"} variant — home waits for portrait asset; page is text + progress only
 */
export default function Preloader({ active, sceneReady, onComplete, variant = "home" }) {
  const rootRef = useRef(null);
  const titleRef = useRef(null);
  const portraitRef = useRef(null);
  const progressRef = useRef(null);
  const curtainRef = useRef(null);
  const timelineRef = useRef(null);
  const [visible, setVisible] = useState(true);
  const showPortrait = variant === "home";

  const finish = useRef(onComplete);
  finish.current = onComplete;

  useEffect(() => {
    if (!active) return;
    setVisible(true);
  }, [active]);

  useEffect(() => {
    if (!active || !visible) return;

    const reduced = prefersReducedMotion();
    if (reduced) {
      finish.current();
      return undefined;
    }

    let cancelled = false;
    let imageReady = !showPortrait;
    let minElapsed = false;
    let introPlayed = false;

    const tryPlayIntro = () => {
      if (cancelled || introPlayed || !minElapsed || !imageReady) return;
      introPlayed = true;

      const root = rootRef.current;
      const title = titleRef.current;
      const portrait = portraitRef.current;
      const progress = progressRef.current;
      const curtain = curtainRef.current;
      if (!root || !title || !progress || !curtain) {
        setVisible(false);
        return;
      }

      const chars = splitElementChars(title);
      gsap.set(chars, { y: "120%", opacity: 0, rotateX: -28, transformOrigin: "50% 100%" });
      if (portrait) gsap.set(portrait, { scale: 0.92, opacity: 0 });
      gsap.set(progress, { opacity: 0 });
      gsap.set(curtain, { y: "100%" });

      const progressObj = { value: 0 };
      const tl = gsap.timeline({
        onComplete: () => {
          if (!cancelled) setVisible(false);
        },
      });
      timelineRef.current = tl;

      const pageTimings = showPortrait
        ? null
        : {
            titleIn: 0.35,
            titleStagger: 0.016,
            progressIn: 0.2,
            progressFill: 0.38,
            fadeOut: 0.22,
            curtain: 0.34,
            lift: 0.38,
          };

      tl.to(chars, {
        y: "0%",
        opacity: 1,
        rotateX: 0,
        duration: pageTimings?.titleIn ?? 0.55,
        stagger: pageTimings?.titleStagger ?? 0.028,
        ease: "power3.out",
      });

      if (portrait) {
        tl.to(portrait, { scale: 1, opacity: 1, duration: 0.65, ease }, 0.15);
      }

      tl.to(progress, { opacity: 1, duration: pageTimings?.progressIn ?? 0.3 }, showPortrait ? 0.2 : 0.08)
        .to(
          progressObj,
          {
            value: 100,
            duration: pageTimings?.progressFill ?? (showPortrait ? 0.85 : 0.65),
            ease: "power1.inOut",
            onUpdate: () => {
              progress.textContent = `${Math.round(progressObj.value)}%`;
            },
          },
          showPortrait ? 0.25 : 0.1
        )
        .to({}, { duration: showPortrait ? 0.2 : 0.08 })
        .to(
          [chars, ...(portrait ? [portrait] : []), progress],
          {
            opacity: 0,
            y: -12,
            duration: pageTimings?.fadeOut ?? 0.35,
            stagger: 0.02,
            ease: "power2.in",
          },
          "+=0"
        )
        .to(
          curtain,
          { y: "0%", duration: pageTimings?.curtain ?? 0.55, ease: [0.76, 0, 0.24, 1] },
          "-=0.08"
        )
        .to(
          root,
          { y: "-100%", duration: pageTimings?.lift ?? 0.6, ease: [0.76, 0, 0.24, 1] },
          "-=0.28"
        );
    };

    if (showPortrait) {
      const img = new Image();
      img.onload = () => {
        imageReady = true;
        tryPlayIntro();
      };
      img.onerror = () => {
        imageReady = true;
        tryPlayIntro();
      };
      img.src = avatarConfig.portraitSvg || avatarConfig.image;
    }

    const minTimer = window.setTimeout(() => {
      minElapsed = true;
      tryPlayIntro();
    }, showPortrait ? HOME_MIN_MS : PAGE_MIN_MS);

    const maxTimer = window.setTimeout(() => {
      if (!cancelled && visible && !introPlayed) {
        imageReady = true;
        minElapsed = true;
        tryPlayIntro();
      }
    }, showPortrait ? HOME_MAX_MS : PAGE_MAX_MS);

    return () => {
      cancelled = true;
      timelineRef.current?.kill();
      window.clearTimeout(minTimer);
      window.clearTimeout(maxTimer);
    };
  }, [active, sceneReady, showPortrait, visible]);

  useEffect(() => {
    if (!active || visible) return undefined;
    const timer = window.setTimeout(() => {
      resetScrollPosition();
      document.body.style.overflow = "";
      finish.current();
    }, 80);
    return () => window.clearTimeout(timer);
  }, [active, visible]);

  useEffect(() => {
    if (!active || !visible) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [active, visible]);

  if (!active) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[300] flex flex-col items-center justify-center overflow-hidden bg-[#203140]"
      role="status"
      aria-live="polite"
      aria-label="Loading Lloyd Dwaah"
      style={{ visibility: visible ? "visible" : "hidden" }}
    >
      <div
        ref={curtainRef}
        className="pointer-events-none absolute inset-0 z-[2] bg-[#203140]"
        aria-hidden="true"
      />

      <div className="relative z-[1] flex flex-col items-center" style={{ perspective: "900px" }}>
        <p
          ref={titleRef}
          className="overflow-hidden font-sans text-[11px] font-medium uppercase tracking-[0.42em] text-ink/80 md:text-xs"
        >
          {PRELOADER_TITLE}
        </p>

        {showPortrait ? (
          <div ref={portraitRef} className="mt-10 flex flex-col items-center">
            <span className="relative grid h-[4.5rem] w-[4.5rem] place-items-center md:h-20 md:w-20">
              <span className="absolute inset-0 rounded-full bg-accent/20 blur-xl" />
              <span className="relative grid h-full w-full place-items-center overflow-hidden rounded-full border border-accent/30 bg-hq-deep/80 ring-1 ring-white/10">
                <img
                  src={avatarConfig.portraitSvg || avatarConfig.image}
                  alt=""
                  className="h-full w-full object-cover object-[center_20%]"
                />
              </span>
            </span>
            <p
              ref={progressRef}
              className="mt-6 font-sans text-[10px] font-light tabular-nums tracking-[0.28em] text-accent/70"
            >
              0%
            </p>
          </div>
        ) : (
          <p
            ref={progressRef}
            className="mt-8 font-sans text-[10px] font-light tabular-nums tracking-[0.28em] text-accent/70"
          >
            0%
          </p>
        )}
      </div>
    </div>
  );
}
