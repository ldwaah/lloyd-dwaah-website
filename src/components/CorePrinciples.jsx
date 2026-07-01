import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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

function CarouselArrow({ direction, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseDown={preventFocusScroll}
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
            onClick={() => onSelect(index)}
            onMouseDown={preventFocusScroll}
            className={`h-1 rounded-full transition-all duration-300 ${
              isActive ? "w-5 bg-accent/60" : "w-1 bg-line hover:bg-muted/50"
            }`}
          />
        );
      })}
    </div>
  );
}

function PrincipleContent({ principle }) {
  return (
    <>
      <h3 className="font-serif text-statement text-ink text-balance">{principle.title}</h3>
      <p className="mx-auto mt-4 max-w-lg text-pretty text-base leading-relaxed text-body md:text-lg">
        {principleExcerpt(principle)}
      </p>
    </>
  );
}

export default function CorePrinciples() {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef(null);
  const sectionRef = useRef(null);
  const reduced = prefersReducedMotion();

  const goTo = useCallback((index) => {
    const len = principles.length;
    setActiveIndex(((index % len) + len) % len);
  }, []);

  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

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
        <span className="eyebrow eyebrow-center mx-auto max-w-fit">{ethos.principlesHeading}</span>
        <h2 className="mt-6 font-serif text-hero text-ink text-balance">{ethos.principlesIntro}</h2>

        <div className="mt-14 md:mt-20">
          <div className="flex items-center justify-center gap-4 md:gap-8">
            <CarouselArrow
              direction="left"
              onClick={goPrev}
              label={`Previous principle: ${principles[(activeIndex - 1 + principles.length) % principles.length].title}`}
            />

            <div
              className="relative min-h-[14rem] w-full max-w-xl touch-pan-y md:min-h-[12rem]"
              style={{ overflowAnchor: "none" }}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
              aria-live="polite"
              aria-atomic="true"
            >
              {reduced ? (
                <div className="px-2">
                  <PrincipleContent principle={active} />
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-x-0 top-0 px-2"
                  >
                    <PrincipleContent principle={active} />
                  </motion.div>
                </AnimatePresence>
              )}
            </div>

            <CarouselArrow
              direction="right"
              onClick={goNext}
              label={`Next principle: ${principles[(activeIndex + 1) % principles.length].title}`}
            />
          </div>

          <DotIndicators count={principles.length} activeIndex={activeIndex} onSelect={goTo} />
        </div>
      </div>
    </section>
  );
}
