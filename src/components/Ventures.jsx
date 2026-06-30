import Reveal from "./Reveal.jsx";
import { ventures } from "../data/site.js";

export default function Ventures() {
  return (
    <section id="ventures" className="section border-t border-line bg-canvas">
      <Reveal>
        <span className="eyebrow">{ventures.eyebrow}</span>
        <h2 className="mt-8 max-w-2xl text-statement serif text-ink">
          {ventures.heading}
        </h2>
        <p className="mt-6 max-w-xl text-pretty leading-relaxed text-muted">
          {ventures.intro}
        </p>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
        {ventures.items.map((v, i) => (
          <VentureCard key={v.title} venture={v} index={i} />
        ))}
      </div>

      <Reveal delay={0.15}>
        <div className="mt-5 flex flex-col items-start justify-between gap-4 rounded-2xl border border-dashed border-line bg-white p-8 sm:flex-row sm:items-center">
          <div>
            <span className="eyebrow">{ventures.future.label}</span>
            <p className="mt-3 max-w-xl text-pretty text-muted">{ventures.future.text}</p>
          </div>
          <span className="text-2xl font-light text-brand/30">+</span>
        </div>
      </Reveal>
    </section>
  );
}

function VentureCard({ venture, index }) {
  return (
    <Reveal
      delay={index * 0.08}
      className="flex min-h-[240px] flex-col justify-between rounded-2xl border border-line bg-white p-7 shadow-card transition hover:border-brand/25 hover:shadow-lift"
    >
      <div>
        <div className="flex items-center justify-between">
          {venture.logo ? (
            <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-full border border-line bg-canvas">
              <img
                src={venture.logo}
                alt={`${venture.title} logo`}
                className={`h-full w-full ${
                  venture.logoFit === "cover" ? "object-cover" : "object-contain p-1.5"
                }`}
                draggable={false}
              />
            </span>
          ) : (
            <span className="text-[11px] font-semibold uppercase tracking-eyebrow text-brand/80">
              {venture.field}
            </span>
          )}
          <span className="rounded-full border border-line px-2.5 py-1 text-[10px] text-muted">
            {venture.status}
          </span>
        </div>
        <h3 className="mt-5 text-lg font-medium text-ink">{venture.title}</h3>
        {venture.logo && (
          <span className="mt-1 block text-[11px] font-semibold uppercase tracking-eyebrow text-brand/70">
            {venture.field}
          </span>
        )}
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted">{venture.description}</p>
    </Reveal>
  );
}
