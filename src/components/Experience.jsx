import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "./Reveal.jsx";
import { experience } from "../data/site.js";

export default function Experience() {
  const [active, setActive] = useState(0);
  const current = experience.disciplines[active];

  return (
    <section id="experience" className="section border-t border-line bg-white">
      <Reveal>
        <span className="eyebrow">{experience.eyebrow}</span>
        <h2 className="mt-8 max-w-2xl text-statement serif text-ink">
          {experience.heading}
        </h2>
        <p className="mt-6 max-w-xl text-pretty leading-relaxed text-muted">
          {experience.intro}
        </p>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-[0.95fr_1.05fr] md:gap-14">
        <Reveal className="md:border-r md:border-line md:pr-10">
          <div className="relative pl-8">
            <div className="absolute left-[5px] top-2 bottom-2 w-px bg-line" />

            <ul>
              {experience.disciplines.map((d, i) => {
                const isActive = i === active;
                return (
                  <li key={d.id} className="relative">
                    <span
                      className={`absolute -left-8 top-7 z-10 h-3 w-3 -translate-x-1/2 rounded-full border-2 transition-colors duration-200 ${
                        isActive
                          ? "border-brand bg-brand"
                          : "border-line bg-white"
                      }`}
                    />
                    <button
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      onClick={() => setActive(i)}
                      className="group flex w-full items-baseline gap-5 border-b border-line py-5 text-left transition-colors"
                    >
                      <span
                        className={`font-serif text-sm transition-colors ${
                          isActive ? "text-brand" : "text-muted"
                        }`}
                      >
                        {d.no}
                      </span>
                      <span className="flex-1">
                        <span
                          className={`block text-lg transition-colors duration-200 ${
                            isActive ? "text-ink" : "text-body group-hover:text-ink"
                          }`}
                        >
                          {d.title}
                        </span>
                        <span
                          className={`mt-1 block text-sm leading-snug text-muted transition-opacity duration-200 ${
                            isActive ? "opacity-100" : "opacity-70"
                          }`}
                        >
                          {d.summary}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </Reveal>

        <div className="relative min-h-[280px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-line bg-canvas p-8 shadow-card md:p-10"
            >
              <div className="font-serif text-4xl font-light text-brand/25">
                {current.no}
              </div>
              <h3 className="mt-4 text-2xl text-ink">{current.title}</h3>
              <p className="mt-5 text-pretty leading-relaxed text-body">
                {current.detail}
              </p>
              {current.note && (
                <p className="mt-4 text-pretty text-sm leading-relaxed text-muted">
                  {current.note}
                </p>
              )}
              {current.chipsLabel && (
                <p className="mt-7 text-[11px] font-semibold uppercase tracking-eyebrow text-brand/70">
                  {current.chipsLabel}
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                {current.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-line bg-white px-3 py-1 text-[11px] text-muted"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
