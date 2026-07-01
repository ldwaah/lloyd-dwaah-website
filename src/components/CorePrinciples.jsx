import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap.js";
import {
  shouldAnimateScroll,
  refreshScrollTriggersNow,
  cancelScheduledScrollRefresh,
} from "../lib/gsap.js";
import { ethos } from "../data/site.js";
import { prefersReducedMotion } from "../lib/input.js";

const principles = ethos.principles;
const SWIPE_THRESHOLD = 48;

function trimSummary(text, maxSentences = 2) {
  const sentences = text.match(/[^.!?]+[.!?]+/g);
  if (!sentences || sentences.length <= maxSentences) return text;
  return sentences.slice(0, maxSentences).join(" ").trim();
}

function principleExcerpt(principle) {
  return trimSummary(principle.body || principle.summary, 2);
}

/** Prevent click-focus from scrolling the page (Lenis + pinned ScrollTriggers). */
function preventFocusScroll(event) {
  event.preventDefault();
}

function wrapIndex(index) {
  const len = principles.length;
  return ((index % len) + len) % len;
}

function CarouselArrow({ direction, onClick, label }) {
  const handleClick = (event) => {
    event.currentTarget.blur();
    onClick();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseDown={preventFocusScroll}
      onPointerDown={preventFocusScroll}
      aria-label={label}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line/70 text-muted/80 transition-colors hover:border-line hover:text-ink md:h-10 md:w-10"
    >
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
        {direction === "left" ? (
          <path d="M10 3 5 8l5 5" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M6 3l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </button>
  );
}

function DotIndicators({ count, activeIndex, onSelect }) {
  return (
    <div className="mt-10 flex justify-center gap-2" role="tablist" aria-label="Principle slides">
      {Array.from({ length: count }, (_, index) => {
        const isActive = index === activeIndex;
        return (
          <button
            key={index}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={`Go to principle ${index + 1} of ${count}`}
            onClick={(event) => {
              event.currentTarget.blur();
              onSelect(index);
            }}
            onMouseDown={preventFocusScroll}
            onPointerDown={preventFocusScroll}
            className={`h-1 rounded-full transition-all duration-300 ${
              isActive ? "w-5 bg-accent/60" : "w-1 bg-line hover:bg-muted/50"
            }`}
          />
        );
      })}
    </div>
  );
}

export default function CorePrinciples() {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef(null);
  const sectionRef = useRef(null);
  const headerBlockRef = useRef(null);
  const carouselRef = useRef(null);
  const slideRef = useRef(null);
  const reduced = prefersReducedMotion();

  const animateSlideIn = useCallback(() => {
    const slide = slideRef.current;
    if (!slide) return;

    gsap.killTweensOf(slide);

    if (reduced || !shouldAnimateScroll()) {
      gsap.set(slide, { opacity: 1, y: 0 });
      return;
    }

    gsap.fromTo(
      slide,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.45, ease: [0.22, 1, 0.36, 1] }
    );
  }, [reduced]);

  const navigateTo = useCallback((index) => {
    cancelScheduledScrollRefresh();
    setActiveIndex(wrapIndex(index));
  }, []);

  const goPrev = useCallback(() => navigateTo(activeIndex - 1), [activeIndex, navigateTo]);
  const goNext = useCallback(() => navigateTo(activeIndex + 1), [activeIndex, navigateTo]);

  useEffect(() => {
    requestAnimationFrame(() => animateSlideIn());
  }, [activeIndex, animateSlideIn]);

  useEffect(() => {
    if (reduced || !shouldAnimateScroll()) return undefined;

    const section = sectionRef.current;
    const headerBlock = headerBlockRef.current;
    const carousel = carouselRef.current;
    if (!section || !headerBlock || !carousel) return undefined;

    let removeScrollListener = () => {};
    let retryTimer = null;
    let retryInterval = null;

    const ctx = gsap.context(() => {
      gsap.set([headerBlock, carousel], { opacity: 1, y: 0 });

      const tl = gsap
        .timeline({ paused: true })
        .fromTo(
          headerBlock,
          { y: 28 },
          { y: 0, duration: 0.7, ease: [0.22, 1, 0.36, 1] }
        )
        .fromTo(
          carousel,
          { y: 28 },
          { y: 0, duration: 0.65, ease: [0.22, 1, 0.36, 1] },
          0.12
        );

      const playEntrance = () => {
        if (tl.progress() < 1) tl.play();
      };

      ScrollTrigger.create({
        trigger: section,
        start: "top 85%",
        once: true,
        onEnter: playEntrance,
      });

      const revealIfVisible = () => {
        const { top, bottom } = section.getBoundingClientRect();
        if (top < window.innerHeight * 0.9 && bottom > 0) {
          tl.progress(1);
        }
      };

      requestAnimationFrame(() => {
        refreshScrollTriggersNow();
        revealIfVisible();
      });

      window.addEventListener("scroll", revealIfVisible, { passive: true });
      removeScrollListener = () => window.removeEventListener("scroll", revealIfVisible);
      retryInterval = window.setInterval(revealIfVisible, 400);
      retryTimer = window.setTimeout(() => {
        if (retryInterval) window.clearInterval(retryInterval);
      }, 4000);
    });

    return () => {
      removeScrollListener();
      if (retryInterval) window.clearInterval(retryInterval);
      if (retryTimer) window.clearTimeout(retryTimer);
      ctx.revert();
    };
  }, [reduced]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (!sectionRef.current?.contains(document.activeElement) && document.activeElement !== document.body) {
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goPrev, goNext]);

  const onTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const onTouchEnd = (event) => {
    if (touchStartX.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX.current;
    if (delta > SWIPE_THRESHOLD) goPrev();
    else if (delta < -SWIPE_THRESHOLD) goNext();
    touchStartX.current = null;
  };

  const active = principles[activeIndex];

  return (
    <section
      id="principles"
      ref={sectionRef}
      className="relative z-10 overflow-hidden border-t border-line bg-hq-deep"
      aria-roledescription="carousel"
      aria-label={ethos.principlesHeading}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(94,234,255,0.08), transparent 70%)",
        }}
      />

      <div className="section-pad relative mx-auto max-w-4xl text-center">
        <div ref={headerBlockRef}>
          <span className="eyebrow eyebrow-center mx-auto max-w-fit">{ethos.principlesHeading}</span>
          <h2 className="mt-6 font-serif text-hero text-ink text-balance">{ethos.principlesIntro}</h2>
        </div>

        <div ref={carouselRef} className="mt-14 md:mt-20">
          <div className="flex items-center justify-center gap-4 md:gap-8">
            <CarouselArrow
              direction="left"
              onClick={goPrev}
              label={`Previous principle: ${principles[wrapIndex(activeIndex - 1)].title}`}
            />

            <div
              className="relative min-h-[15rem] w-full max-w-xl touch-pan-y md:min-h-[13rem]"
              style={{ overflowAnchor: "none", contain: "layout style" }}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
              aria-live="polite"
              aria-atomic="true"
            >
              <div ref={slideRef} className="px-2">
                <h3 className="font-serif text-statement text-ink text-balance">
                  {active.title}
                </h3>
                <p className="mx-auto mt-4 max-w-lg text-pretty text-base leading-relaxed text-body md:text-lg">
                  {principleExcerpt(active)}
                </p>
              </div>
            </div>

            <CarouselArrow
              direction="right"
              onClick={goNext}
              label={`Next principle: ${principles[wrapIndex(activeIndex + 1)].title}`}
            />
          </div>

          <DotIndicators count={principles.length} activeIndex={activeIndex} onSelect={navigateTo} />
        </div>
      </div>
    </section>
  );
}
