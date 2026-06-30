import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal, { RevealLines } from "./Reveal.jsx";
import { ethos } from "../data/site.js";

export default function Ethos() {
  const [expanded, setExpanded] = useState(null);

  return (
    <section id="ethos" className="section border-t border-line bg-white">
      <Reveal>
        <span className="eyebrow">{ethos.eyebrow}</span>
      </Reveal>

      <RevealLines
        lines={ethos.statementLines}
        className="mt-6 max-w-3xl text-statement"
        lineClassName="serif text-ink"
      />

      <Reveal delay={0.12}>
        <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted md:text-lg">
          {ethos.body}
        </p>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
        {ethos.principles.map((p, i) => (
          <Reveal
            key={p.title}
            delay={i * 0.06}
            className="rounded-2xl border border-line bg-canvas p-6"
          >
            <div className="font-serif text-2xl font-light text-brand/40">
              {String(i + 1).padStart(2, "0")}
            </div>
            <h3 className="mt-3 text-lg font-medium text-ink">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{p.text}</p>
          </Reveal>
        ))}
      </div>

      <div className="mt-14 border-t border-line pt-12">
        <Reveal>
          <h3 className="text-xl font-medium text-ink md:text-2xl">{ethos.disciplinesHeading}</h3>
          <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-muted md:text-base">
            {ethos.disciplinesIntro}
          </p>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2">
          {ethos.disciplines.map((d, i) => {
            const isOpen = expanded === d.id;
            return (
              <Reveal key={d.id} delay={i * 0.04}>
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : d.id)}
                  className="w-full rounded-2xl border border-line bg-canvas p-5 text-left transition hover:border-brand/25 hover:shadow-card"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="font-serif text-sm text-brand">{d.no}</span>
                      <h4 className="mt-1 text-base font-medium text-ink">{d.title}</h4>
                      <p className="mt-1 text-sm text-muted">{d.summary}</p>
                    </div>
                    <span className="text-lg text-brand/50">{isOpen ? "−" : "+"}</span>
                  </div>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="mt-4 text-sm leading-relaxed text-body">{d.detail}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {d.tags.map((t) => (
                            <span
                              key={t}
                              className="rounded-full border border-line bg-white px-2.5 py-1 text-[10px] text-muted"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
