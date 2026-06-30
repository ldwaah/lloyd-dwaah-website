import { useState } from "react";
import PageShell from "../components/PageShell.jsx";
import HolisticCVModal from "../components/HolisticCVModal.jsx";
import { experience } from "../data/site.js";

export default function ExperiencePage() {
  const [cvOpen, setCvOpen] = useState(false);
  const { holisticCv } = experience;

  return (
    <PageShell>
      <section className="section bg-white">
        <span className="eyebrow">{experience.eyebrow}</span>
        <h1 className="mt-5 max-w-2xl text-statement serif text-ink">{experience.heading}</h1>
        <p className="mt-4 max-w-2xl text-pretty text-muted">{experience.intro}</p>
        <button
          type="button"
          onClick={() => setCvOpen(true)}
          className="btn-accent mt-8"
        >
          {holisticCv.label}
        </button>
      </section>

      <section className="border-t border-line bg-navy">
        <div className="section section-dark !text-white">
          <ol className="relative space-y-0 border-l border-white/15 pl-8">
            {experience.timeline.map((entry) => (
              <li key={entry.id} className="group relative pb-10 last:pb-0">
                <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-white transition group-hover:scale-125" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">
                  {entry.year}
                </p>
                <h2 className="mt-2 text-xl font-medium text-white">{entry.title}</h2>
                <p className="mt-1 text-sm text-white/60">{entry.role}</p>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/75">
                  {entry.summary}
                </p>
                <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-300 group-hover:grid-rows-[1fr] group-hover:opacity-100">
                  <div className="overflow-hidden">
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/55">
                      {entry.detail}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <button
            type="button"
            onClick={() => setCvOpen(true)}
            className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-white/70 transition hover:text-white"
          >
            <span className="h-px w-8 bg-white/30" />
            {holisticCv.label}
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>

      <HolisticCVModal open={cvOpen} onClose={() => setCvOpen(false)} cv={holisticCv} />
    </PageShell>
  );
}
