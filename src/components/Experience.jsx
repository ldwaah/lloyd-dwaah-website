import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "./Reveal.jsx";
import { experience } from "../data/site.js";

export default function Experience() {
  const [active, setActive] = useState(0);
  const current = experience.timeline[active];

  return (
    <section id="experience" className="section-dark border-t border-white/10">
      <div className="section">
        <Reveal>
          <span className="eyebrow">{experience.eyebrow}</span>
          <h2 className="mt-5 max-w-2xl text-statement serif text-white">
            {experience.heading}
          </h2>
          <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-white/70">
            {experience.intro}
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
          <Reveal className="lg:border-r lg:border-white/10 lg:pr-10">
            <div className="relative pl-8">
              <div className="absolute left-[5px] top-2 bottom-2 w-px bg-white/15" />

              <ul>
                {experience.timeline.map((entry, i) => {
                  const isActive = i === active;
                  return (
                    <li key={entry.id} className="relative">
                      <span
                        className={`absolute -left-8 top-6 z-10 h-3 w-3 -translate-x-1/2 rounded-full border-2 transition-colors duration-200 ${
                          isActive
                            ? "border-white bg-white"
                            : "border-white/30 bg-navy"
                        }`}
                      />
                      <button
                        type="button"
                        onMouseEnter={() => setActive(i)}
                        onFocus={() => setActive(i)}
                        onClick={() => setActive(i)}
                        className="group w-full border-b border-white/10 py-4 text-left transition-colors"
                      >
                        <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">
                          {entry.year}
                        </span>
                        <span
                          className={`mt-1 block text-base font-medium transition-colors md:text-lg ${
                            isActive ? "text-white" : "text-white/75 group-hover:text-white"
                          }`}
                        >
                          {entry.title}
                        </span>
                        <span className="mt-1 block text-sm text-white/55">{entry.role}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>

          <div className="relative min-h-[240px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm md:p-8"
              >
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">
                  {current.year}
                </span>
                <h3 className="mt-3 text-2xl text-white">{current.title}</h3>
                <p className="mt-1 text-sm font-medium text-white/60">{current.role}</p>
                <p className="mt-5 text-pretty leading-relaxed text-white/80">{current.summary}</p>
                <p className="mt-4 text-pretty text-sm leading-relaxed text-white/65">
                  {current.detail}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
