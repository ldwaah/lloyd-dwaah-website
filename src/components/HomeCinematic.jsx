import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap.js";
import HeroPortrait from "./HeroPortrait.jsx";
import SiteNav from "./SiteNav.jsx";
import { avatarConfig, home } from "../data/site.js";
import { setHeroScrollProgress, resetHeroScrollProgress } from "../lib/heroScroll.js";
import { shouldAnimateScroll, refreshScrollTriggers } from "../lib/gsap.js";
import { prefersReducedMotion } from "../lib/input.js";

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
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-hq-deep via-hq-deep/85 to-transparent px-6 pb-10 pt-28 text-center md:px-10 md:pb-14 md:pt-32">
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
    const heroHint = heroHintRef.current;
    const ethosTrack = ethosTrackRef.current;
    const ethosPin = ethosPinRef.current;
    const ethosContent = ethosContentRef.current;
    const lines = lineRefs.current.filter(Boolean);

    if (!heroTrack || !heroPin || !heroContent || !ethosTrack || !ethosPin || !ethosContent) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      resetHeroScrollProgress();

      const heroTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: heroTrack,
          start: "top top",
          end: "+=88%",
          pin: heroPin,
          pinSpacing: true,
          scrub: 0.45,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => setHeroScrollProgress(self.progress),
          onLeave: () => setHeroScrollProgress(1),
          onLeaveBack: () => setHeroScrollProgress(0),
        },
      });

      heroTimeline.fromTo(
        heroContent,
        { y: 0, opacity: 1, scale: 1 },
        { y: -8, opacity: 1, scale: 0.998, ease: "none" },
        0
      );
      heroTimeline.to(
        heroContent,
        { y: -22, opacity: 0.94, scale: 0.996, ease: "power1.out" },
        0.55
      );

      if (heroHint) {
        heroTimeline.fromTo(heroHint, { opacity: 1, y: 0 }, { opacity: 0.9, y: -6, ease: "none" }, 0);
        heroTimeline.to(heroHint, { opacity: 0.82, y: -12, ease: "power1.out" }, 0.55);
      }

      gsap.set(lines, { y: 24, filter: "blur(4px)", opacity: 1 });
      gsap.set(ethosContent, { scale: 1.02, opacity: 1, y: 0 });

      const ethosTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ethosTrack,
          start: "top top",
          end: "+=80%",
          pin: ethosPin,
          pinSpacing: true,
          scrub: 0.45,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      ethosTimeline.to(ethosContent, { scale: 1, duration: 0.12, ease: "power2.out" }, 0);

      lines.forEach((line, index) => {
        ethosTimeline.to(
          line,
          { y: 0, filter: "blur(0px)", opacity: 1, duration: 0.14, ease: "power2.out" },
          0.06 + index * 0.12
        );
      });
    });

    requestAnimationFrame(refreshScrollTriggers);
    window.addEventListener("load", refreshScrollTriggers);

    return () => {
      window.removeEventListener("load", refreshScrollTriggers);
      ctx.revert();
      resetHeroScrollProgress();
      refreshScrollTriggers();
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
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-hq-deep via-hq-deep/85 to-transparent px-6 pb-10 pt-28 text-center md:px-10 md:pb-14 md:pt-32"
          >
            <p className="font-serif text-statement text-ink text-balance will-change-transform drop-shadow-[0_2px_24px_rgba(0,0,0,0.35)]">
              {home.nameReveal}
            </p>
            <p
              ref={heroHintRef}
              className="mx-auto mt-6 max-w-2xl text-sm uppercase tracking-[0.28em] text-accent/70 will-change-transform"
            >
              Scroll to explore
            </p>
          </div>
        </div>
      </section>

      <section ref={ethosTrackRef} className="relative z-10 border-t border-line bg-hq-deep">
        <div
          ref={ethosPinRef}
          className="flex min-h-[100svh] w-full items-center justify-center overflow-hidden px-6 md:px-10"
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
                className={`text-balance will-change-[transform,filter] ${line.className}`}
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
