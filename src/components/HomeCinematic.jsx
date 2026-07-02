import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap.js";
import { shouldAnimateScroll, refreshScrollTriggersNow, scheduleScrollRefresh } from "../lib/gsap.js";
import { splitElementWords } from "../lib/splitText.js";
import HeroPortrait from "./HeroPortrait.jsx";
import SiteNav from "./SiteNav.jsx";
import { avatarConfig, home } from "../data/site.js";
import { setHeroScrollProgress, resetHeroScrollProgress } from "../lib/heroScroll.js";
import { prefersReducedMotion, isMobile } from "../lib/input.js";

const PORTRAIT = avatarConfig.portraitSvg || avatarConfig.image;

const ETHOS_LINES = [
  { text: "I believe that", className: "font-serif text-statement text-ink/65" },
  { text: "great leadership", className: "font-serif text-hero font-medium text-ink" },
  { text: "creates environments", className: "font-serif text-statement text-ink/80" },
  {
    text: "where people can flourish.",
    className: "font-serif text-hero font-medium text-accent/95",
  },
];

function StaticHero({ onPortraitReady }) {
  return (
    <>
      <section id="home" className="relative isolate min-h-[100svh] overflow-hidden">
        <HeroPortrait src={PORTRAIT} onReady={onPortraitReady} />
        <SiteNav overlay />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-hq-deep via-hq-deep/90 to-transparent px-6 pb-10 pt-24 text-center max-md:pt-28 md:px-10 md:pb-14 md:pt-32">
          <p className="font-serif text-statement text-ink text-balance drop-shadow-[0_2px_24px_rgba(0,0,0,0.35)]">
            {home.nameReveal}
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-sm uppercase tracking-[0.28em] text-accent/70">
            Scroll to explore
          </p>
        </div>
      </section>

      <section className="relative z-10 border-t border-line bg-hq-deep">
        <div className="section-pad mx-auto flex min-h-[60svh] max-w-4xl flex-col justify-center gap-2 text-center md:gap-3">
          {ETHOS_LINES.map((line) => (
            <p key={line.text} className={`text-balance ${line.className}`}>
              {line.text}
            </p>
          ))}
        </div>
      </section>
    </>
  );
}

export default function HomeCinematic({ onPortraitReady }) {
  const heroTrackRef = useRef(null);
  const heroPinRef = useRef(null);
  const heroContentRef = useRef(null);
  const heroNameRef = useRef(null);
  const heroHintRef = useRef(null);
  const ethosTrackRef = useRef(null);
  const ethosPinRef = useRef(null);
  const ethosContentRef = useRef(null);
  const lineRefs = useRef([]);

  useEffect(() => {
    if (!shouldAnimateScroll()) {
      resetHeroScrollProgress();
      return undefined;
    }

    const heroTrack = heroTrackRef.current;
    const heroPin = heroPinRef.current;
    const heroContent = heroContentRef.current;
    const heroName = heroNameRef.current;
    const heroHint = heroHintRef.current;
    const ethosTrack = ethosTrackRef.current;
    const ethosPin = ethosPinRef.current;
    const ethosContent = ethosContentRef.current;
    const lineEls = lineRefs.current.filter(Boolean);

    if (!heroTrack || !heroPin || !heroContent || !ethosTrack || !ethosPin || !ethosContent) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      resetHeroScrollProgress();

      const mobile = isMobile();
      const heroPinEnd = mobile ? "+=62%" : "+=88%";
      const ethosPinEnd = mobile ? "+=70%" : "+=85%";

      const heroTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: heroTrack,
          start: "top top",
          end: heroPinEnd,
          pin: heroPin,
          pinSpacing: true,
          scrub: mobile ? 0.4 : 0.6, // Slightly more scrub for smoother feel
          anticipatePin: 0,
          invalidateOnRefresh: true,
          onUpdate: (self) => setHeroScrollProgress(self.progress),
          onLeave: () => setHeroScrollProgress(1),
          onLeaveBack: () => setHeroScrollProgress(0),
          onRefresh: (self) => setHeroScrollProgress(self.progress),
        },
      });

      // Act 1: hint dissolves, name drifts up and tracks out as the portrait
      // scales/darkens (HeroPortrait reads the same progress each frame).
      if (heroHint) {
        heroTimeline.to(heroHint, { opacity: 0, y: -26, ease: "power1.out", duration: 0.26 }, 0.04);
      }

      if (heroName) {
        // Transform/opacity only — letter-spacing or filter tweens would
        // force layout/paint on every scrub frame and jank the pin.
        gsap.set(heroName, { willChange: "transform, opacity", force3D: true });
        heroTimeline.to(
          heroName,
          { scale: 1.05, y: mobile ? -14 : -30, ease: "none", duration: 0.55 },
          0
        );
        // Act 2: name exits upward, stretching slightly as it goes.
        heroTimeline.to(
          heroName,
          {
            y: mobile ? -60 : -120,
            opacity: 0,
            scale: 1.1,
            ease: "power1.in",
            duration: 0.38,
          },
          0.55
        );
      }

      heroTimeline.to(
        heroContent,
        { opacity: 0, ease: "power1.in", duration: 0.32 },
        0.64
      );

      const allWords = [];
      lineEls.forEach((line) => {
        allWords.push(...splitElementWords(line));
      });

      gsap.set(allWords, { y: "120%", opacity: 0, filter: "blur(6px)" });
      gsap.set(ethosContent, { scale: 1.03, opacity: 1 });

      const ethosTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ethosTrack,
          start: "top top",
          end: ethosPinEnd,
          pin: ethosPin,
          pinSpacing: true,
          scrub: mobile ? 0.35 : 0.55,
          anticipatePin: 0,
          invalidateOnRefresh: true,
        },
      });

      ethosTimeline.to(ethosContent, { scale: 1, duration: 0.1, ease: "power2.out" }, 0);

      let wordOffset = 0.04;
      lineEls.forEach((line) => {
        const words = [...line.querySelectorAll(".split-word")];
        words.forEach((word, wi) => {
          ethosTimeline.to(
            word,
            {
              y: "0%",
              opacity: 1,
              filter: "blur(0px)",
              duration: 0.08,
              ease: "power3.out",
            },
            wordOffset + wi * 0.035
          );
        });
        wordOffset += words.length * 0.035 + 0.06;
      });

      // Statement breathes at full presence, then hands off to the next
      // chapter by drifting up and receding as the pin releases.
      ethosTimeline.to(
        ethosContent,
        { yPercent: -16, opacity: 0.12, scale: 0.965, ease: "power1.in", duration: 0.2 },
        0.8
      );
    });

    requestAnimationFrame(() => refreshScrollTriggersNow());
    window.addEventListener("load", refreshScrollTriggersNow);

    return () => {
      window.removeEventListener("load", refreshScrollTriggersNow);
      ctx.revert();
      lineEls.forEach((line) => {
        if (line?.dataset?.splitWords) {
          const text = [...line.querySelectorAll(".split-word")]
            .map((s) => s.textContent)
            .join(" ");
          line.textContent = text;
          delete line.dataset.splitWords;
        }
      });
      resetHeroScrollProgress();
      scheduleScrollRefresh({ force: true });
    };
  }, []);

  if (!shouldAnimateScroll()) {
    return <StaticHero onPortraitReady={onPortraitReady} />;
  }

  return (
    <>
      <section ref={heroTrackRef} id="home" className="relative isolate">
        <div ref={heroPinRef} className="relative h-[100svh] w-full overflow-hidden">
          <HeroPortrait src={PORTRAIT} onReady={onPortraitReady} />
          <SiteNav overlay />
          <div
            ref={heroContentRef}
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-hq-deep from-25% via-hq-deep/95 to-transparent px-6 pb-10 pt-24 text-center max-md:pt-28 md:px-10 md:pb-14 md:pt-32"
          >
            <p
              ref={heroNameRef}
              className="font-serif text-statement text-ink text-balance drop-shadow-[0_2px_24px_rgba(0,0,0,0.35)]"
            >
              {home.nameReveal}
            </p>
            <p
              ref={heroHintRef}
              className="mx-auto mt-6 max-w-2xl text-sm uppercase tracking-[0.28em] text-accent/70"
            >
              Scroll to explore
            </p>
          </div>
        </div>
      </section>

      <section ref={ethosTrackRef} className="relative z-20 border-t border-line bg-hq-deep">
        <div
          ref={ethosPinRef}
          className="flex min-h-[100svh] w-full items-center justify-center overflow-hidden bg-hq-deep px-6 md:px-10"
          style={{ perspective: "800px" }}
        >
          <div
            ref={ethosContentRef}
            className="mx-auto flex w-full max-w-[56rem] flex-col items-center justify-center gap-2 text-center md:gap-3"
          >
            {ETHOS_LINES.map((line, index) => (
              <p
                key={line.text}
                ref={(node) => {
                  lineRefs.current[index] = node;
                }}
                className={`text-balance overflow-hidden ${line.className}`}
              >
                {line.text}
              </p>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
