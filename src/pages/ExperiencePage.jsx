import { useEffect, useRef, useState } from "react";
import { gsap } from "../lib/gsap.js";
import { shouldAnimateScroll, refreshScrollTriggersNow } from "../lib/gsap.js";
import PageShell from "../components/PageShell.jsx";
import HolisticCVModal from "../components/HolisticCVModal.jsx";
import Reveal, { RevealHeading } from "../components/Reveal.jsx";
import { experience } from "../data/site.js";
import { prefersReducedMotion } from "../lib/input.js";

function CoachingSpotlight({ spotlight }) {
  const ref = useRef(null);
  const imageRef = useRef(null);
  const textRef = useRef(null);
  const reduced = prefersReducedMotion();

  useEffect(() => {
    if (reduced || !shouldAnimateScroll()) return undefined;

    const section = ref.current;
    const image = imageRef.current;
    const text = textRef.current;
    if (!section || !image || !text) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        image,
        { y: "-8%" },
        {
          y: "8%",
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "start end",
            end: "end start",
            scrub: 0.45,
          },
        }
      );

      gsap.fromTo(
        text,
        { y: 24 },
        {
          y: -24,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "start end",
            end: "end start",
            scrub: 0.45,
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <div
      ref={ref}
      className="relative mt-14 overflow-hidden rounded-2xl border border-line shadow-lift"
    >
      <div className="relative min-h-[420px] md:min-h-[520px]">
        <img
          ref={imageRef}
          src={spotlight.image}
          alt={spotlight.alt}
          className="absolute inset-0 h-[120%] w-full object-cover object-[center_15%] will-change-transform"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-hq-darker via-hq-darker/50 to-hq-darker/10" />
        <div
          ref={textRef}
          className="relative flex min-h-[420px] flex-col justify-end p-8 md:min-h-[520px] md:p-12"
        >
          <p className="text-[10px] font-light uppercase tracking-[0.28em] text-accent/80">
            {spotlight.eyebrow}
          </p>
          <RevealHeading className="mt-4 max-w-xl font-serif text-hero text-ink text-balance">
            {spotlight.title}
          </RevealHeading>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-muted md:text-lg">
            {spotlight.summary}
          </p>
        </div>
      </div>
    </div>
  );
}

function TimelineContent({ entry, index }) {
  return (
    <div className={`relative grid items-center gap-12 md:grid-cols-2 ${index % 2 === 1 ? "md:direction-rtl" : ""}`}>
      <div data-milestone-col className={index % 2 === 1 ? "md:order-2 md:text-right" : ""}>
        <p className="text-[11px] font-light uppercase tracking-[0.25em] text-accent/70">
          {entry.year}
        </p>
        <h2 className="mt-6 font-serif text-hero text-ink text-balance">{entry.title}</h2>
        <p className="mt-4 text-lg text-accent/80">{entry.role}</p>
      </div>

      <div
        data-milestone-col
        className={`glass-panel rounded-2xl p-8 md:p-10 ${index % 2 === 1 ? "md:order-1" : ""}`}
      >
        <p className="text-lg leading-relaxed text-body text-pretty">{entry.summary}</p>
        <p className="mt-6 text-base leading-relaxed text-muted">{entry.detail}</p>
      </div>
    </div>
  );
}

function TimelineMilestone({ entry, index, total }) {
  const reduced = prefersReducedMotion();
  const ref = useRef(null);

  useEffect(() => {
    if (reduced || !shouldAnimateScroll()) return undefined;

    const el = ref.current;
    if (!el) return undefined;

    const ctx = gsap.context(() => {
      const inner = el.querySelector("[data-milestone-inner]");
      const cols = el.querySelectorAll("[data-milestone-col]");
      const num = el.querySelector("[data-milestone-num]");

      // Enter: rise into place as the milestone approaches centre stage.
      gsap.fromTo(
        inner,
        { y: 84, opacity: 0.15 },
        {
          y: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top 92%",
            end: "top 50%",
            scrub: 0.45,
          },
        }
      );

      // Exit: drift up and recede so the next milestone takes the stage.
      gsap.fromTo(
        inner,
        { y: 0, opacity: 1 },
        {
          y: -64,
          opacity: 0.2,
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            trigger: el,
            start: "bottom 42%",
            end: "bottom 4%",
            scrub: 0.45,
          },
        }
      );

      // Depth: the two columns traverse at different rates.
      if (cols.length === 2) {
        const range = {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5,
        };
        gsap.fromTo(cols[0], { y: 26 }, { y: -26, ease: "none", scrollTrigger: { ...range } });
        gsap.fromTo(cols[1], { y: 56 }, { y: -56, ease: "none", scrollTrigger: { ...range } });
      }

      if (num) {
        gsap.fromTo(
          num,
          { yPercent: 42 },
          {
            yPercent: -42,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          }
        );
      }
    }, ref);

    return () => ctx.revert();
  }, [reduced]);

  if (reduced) {
    return (
      <li className="relative border-t border-line py-16 md:py-24">
        <Reveal delay={index * 0.1}>
          <TimelineContent entry={entry} index={index} />
        </Reveal>
      </li>
    );
  }

  return (
    <li
      ref={ref}
      className="relative min-h-[70vh] flex flex-col justify-center py-16 md:min-h-[80vh]"
    >
      <span
        data-milestone-num
        aria-hidden="true"
        className={`pointer-events-none absolute top-1/2 hidden -translate-y-1/2 select-none font-serif text-[11rem] leading-none text-ink/[0.035] md:block lg:text-[15rem] ${
          index % 2 === 1 ? "left-0" : "right-0"
        }`}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="absolute left-0 top-1/2 hidden h-px w-full -translate-y-1/2 bg-gradient-to-r from-transparent via-accent/20 to-transparent md:block" />

      <div data-milestone-inner className="relative">
        <TimelineContent entry={entry} index={index} />
      </div>

      {index < total - 1 && (
        <div className="absolute bottom-0 left-1/2 hidden h-16 w-px -translate-x-1/2 bg-gradient-to-b from-accent/30 to-transparent md:block" />
      )}
    </li>
  );
}

export default function ExperiencePage() {
  const [cvOpen, setCvOpen] = useState(false);
  const { holisticCv } = experience;
  const containerRef = useRef(null);
  const lineRef = useRef(null);
  const reduced = prefersReducedMotion();

  useEffect(() => {
    if (reduced || !shouldAnimateScroll()) return undefined;

    const container = containerRef.current;
    const line = lineRef.current;
    if (!container || !line) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        line,
        { height: "0%" },
        {
          height: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom bottom",
            scrub: 0.45,
          },
        }
      );
    }, container);

    requestAnimationFrame(() => refreshScrollTriggersNow());

    return () => ctx.revert();
  }, [reduced]);

  return (
    <PageShell ambient="experience">
      <section className="section-pad pb-16">
        <Reveal revealDelay={0.24} y={20}>
          <span className="eyebrow">{experience.eyebrow}</span>
        </Reveal>
        <RevealHeading
          as="h1"
          delay={0.15}
          className="mt-8 max-w-4xl font-serif text-display text-ink text-balance"
        >
          {experience.heading}
        </RevealHeading>
        <Reveal revealDelay={0.24} delay={0.24} y={28}>
          <p className="mt-8 max-w-2xl text-xl leading-relaxed text-muted">{experience.intro}</p>
        </Reveal>
        {experience.spotlight && (
          <Reveal revealDelay={0.22} delay={0.34} y={24}>
            <CoachingSpotlight spotlight={experience.spotlight} />
          </Reveal>
        )}
      </section>

      <section ref={containerRef} className="relative border-t border-line">
        <div className="absolute left-6 top-0 hidden h-full w-px bg-line md:left-10 md:block">
          <div
            ref={lineRef}
            className="w-full bg-gradient-to-b from-accent via-accent/50 to-transparent"
          />
        </div>

        <ol className="section-pad !pt-8">
          {experience.timeline.map((entry, i) => (
            <TimelineMilestone
              key={entry.id}
              entry={entry}
              index={i}
              total={experience.timeline.length}
            />
          ))}
        </ol>

        <div className="section-pad-tight border-t border-line text-center">
          <Reveal y={16}>
            <button
              type="button"
              onClick={() => setCvOpen(true)}
              className="btn-ghost"
            >
              {holisticCv.label} →
            </button>
          </Reveal>
        </div>
      </section>

      <HolisticCVModal open={cvOpen} onClose={() => setCvOpen(false)} cv={holisticCv} />
    </PageShell>
  );
}
