import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import PageShell from "../components/PageShell.jsx";
import HolisticCVModal from "../components/HolisticCVModal.jsx";
import Reveal from "../components/Reveal.jsx";
import { experience } from "../data/site.js";
import { prefersReducedMotion } from "../lib/input.js";

function TimelineContent({ entry, index }) {
  return (
    <div className={`relative grid items-center gap-12 md:grid-cols-2 ${index % 2 === 1 ? "md:direction-rtl" : ""}`}>
      <div className={index % 2 === 1 ? "md:order-2 md:text-right" : ""}>
        <p className="text-[11px] font-light uppercase tracking-[0.25em] text-accent/70">
          {entry.year}
        </p>
        <h2 className="mt-6 font-serif text-hero text-ink text-balance">{entry.title}</h2>
        <p className="mt-4 text-lg text-accent/80">{entry.role}</p>
      </div>

      <div className={`glass-panel rounded-2xl p-8 md:p-10 ${index % 2 === 1 ? "md:order-1" : ""}`}>
        <p className="text-lg leading-relaxed text-body text-pretty">{entry.summary}</p>
        <p className="mt-6 text-base leading-relaxed text-muted">{entry.detail}</p>
      </div>
    </div>
  );
}

function TimelineMilestone({ entry, index, total }) {
  const reduced = prefersReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.4, 1], [0, 1, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [80, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.96, 1]);

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
    <motion.li
      ref={ref}
      style={{ opacity, y, scale }}
      className="relative min-h-[70vh] flex flex-col justify-center py-16 md:min-h-[80vh]"
    >
      <div className="absolute left-0 top-1/2 hidden h-px w-full -translate-y-1/2 bg-gradient-to-r from-transparent via-accent/20 to-transparent md:block" />

      <TimelineContent entry={entry} index={index} />

      {index < total - 1 && (
        <div className="absolute bottom-0 left-1/2 hidden h-16 w-px -translate-x-1/2 bg-gradient-to-b from-accent/30 to-transparent md:block" />
      )}
    </motion.li>
  );
}

export default function ExperiencePage() {
  const [cvOpen, setCvOpen] = useState(false);
  const { holisticCv } = experience;
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <PageShell ambient="experience">
      <section className="section-pad pb-16">
        <Reveal y={20}>
          <span className="eyebrow">{experience.eyebrow}</span>
        </Reveal>
        <Reveal delay={0.08} y={40}>
          <h1 className="mt-8 max-w-4xl font-serif text-display text-ink text-balance">
            {experience.heading}
          </h1>
        </Reveal>
        <Reveal delay={0.16} y={28}>
          <p className="mt-8 max-w-2xl text-xl leading-relaxed text-muted">{experience.intro}</p>
        </Reveal>
        <Reveal delay={0.22} y={24}>
          <div className="mt-12 max-w-3xl overflow-hidden rounded-2xl border border-line shadow-lift">
            <img
              src="/assets/experience/coaching-hero.jpg"
              alt="Lloyd Dwaah coaching and mentoring"
              className="aspect-[16/10] w-full object-cover object-[center_20%]"
              loading="lazy"
            />
          </div>
        </Reveal>
      </section>

      <section ref={containerRef} className="relative border-t border-line">
        <div className="absolute left-6 top-0 hidden h-full w-px bg-line md:left-10 md:block">
          <motion.div
            className="w-full bg-gradient-to-b from-accent via-accent/50 to-transparent"
            style={{ height: lineHeight }}
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
