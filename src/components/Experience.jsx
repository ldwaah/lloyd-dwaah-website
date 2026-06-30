import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "./Reveal.jsx";
import { experience, disciplineIllustrations } from "../data/site.js";

export default function Experience() {
  const [active, setActive] = useState(0);
  const current = experience.disciplines[active];
  const illustration = disciplineIllustrations[current.id];

  return (
    <section id="experience" className="section border-t border-line bg-white">
      <Reveal>
        <span className="eyebrow">{experience.eyebrow}</span>
        <h2 className="mt-5 max-w-2xl text-statement serif text-ink">
          {experience.heading}
        </h2>
        <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-muted">
          {experience.intro}
        </p>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
        <Reveal className="lg:border-r lg:border-line lg:pr-10">
          <div className="relative pl-8">
            <div className="absolute left-[5px] top-2 bottom-2 w-px bg-line" />

            <ul>
              {experience.disciplines.map((d, i) => {
                const isActive = i === active;
                return (
                  <li key={d.id} className="relative">
                    <span
                      className={`absolute -left-8 top-6 z-10 h-3 w-3 -translate-x-1/2 rounded-full border-2 transition-colors duration-200 ${
                        isActive
                          ? "border-brand bg-brand"
                          : "border-line bg-white"
                      }`}
                    />
                    <button
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      onClick={() => setActive(i)}
                      className="group flex w-full items-baseline gap-4 border-b border-line py-4 text-left transition-colors"
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
                          className={`block text-base font-medium transition-colors duration-200 md:text-lg ${
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

        <div className="relative min-h-[320px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-6 md:grid-cols-[0.9fr_1.1fr]"
            >
              <div className="overflow-hidden rounded-2xl border border-line bg-canvas shadow-card">
                <img
                  src={illustration}
                  alt={`${current.title} — Lloyd Dwaah`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="rounded-2xl border border-line bg-canvas p-6 shadow-card md:p-7">
                <div className="font-serif text-3xl font-light text-brand/25">
                  {current.no}
                </div>
                <h3 className="mt-2 text-xl text-ink md:text-2xl">{current.title}</h3>
                <p className="mt-4 text-pretty text-sm leading-relaxed text-body md:text-base">
                  {current.detail}
                </p>
                {current.note && (
                  <p className="mt-3 text-pretty text-sm leading-relaxed text-muted">
                    {current.note}
                  </p>
                )}
                {current.chipsLabel && (
                  <p className="mt-5 text-[11px] font-semibold uppercase tracking-eyebrow text-brand/70">
                    {current.chipsLabel}
                  </p>
                )}
                <div className="mt-2 flex flex-wrap gap-2">
                  {current.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-line bg-white px-2.5 py-1 text-[10px] text-muted"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
