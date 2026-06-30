import Reveal from "./Reveal.jsx";
import { ventures } from "../data/site.js";

export default function Ventures() {
  return (
    <section id="ventures" className="section border-t border-line bg-white">
      <Reveal>
        <span className="eyebrow">{ventures.eyebrow}</span>
        <h2 className="mt-5 max-w-2xl text-statement serif text-ink">
          {ventures.heading}
        </h2>
        <p className="mt-4 max-w-xl text-pretty leading-relaxed text-muted">
          {ventures.intro}
        </p>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
        {ventures.items.map((v, i) => (
          <VentureCard key={v.title} venture={v} index={i} />
        ))}
      </div>

      <Reveal delay={0.1}>
        <div className="mt-4 rounded-2xl border border-dashed border-line bg-canvas p-6">
          <span className="eyebrow">{ventures.future.label}</span>
          <p className="mt-3 max-w-2xl text-pretty text-sm text-muted">{ventures.future.text}</p>
        </div>
      </Reveal>
    </section>
  );
}

function VentureCard({ venture, index }) {
  return (
    <Reveal
      delay={index * 0.06}
      className="flex min-h-[220px] flex-col justify-between rounded-2xl border border-line bg-canvas p-6 shadow-card transition hover:border-brand/25 hover:shadow-lift"
    >
      <div>
        <div className="flex items-center justify-between">
          {venture.logo ? (
            <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-line bg-white">
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
          <span className="rounded-full border border-line bg-white px-2 py-0.5 text-[10px] text-muted">
            {venture.status}
          </span>
        </div>
        <h3 className="mt-4 text-lg font-medium text-ink">{venture.title}</h3>
        {venture.logo && (
          <span className="mt-1 block text-[11px] font-semibold uppercase tracking-eyebrow text-brand/70">
            {venture.field}
          </span>
        )}
      </div>

      <p className="mt-3 text-sm leading-relaxed text-muted">{venture.description}</p>
    </Reveal>
  );
}
