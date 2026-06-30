import Reveal from "./Reveal.jsx";
import SectionIllustration from "./SectionIllustration.jsx";
import { ventures, sectionIllustrations } from "../data/site.js";

export default function Ventures() {
  const art = sectionIllustrations.ventures;

  return (
    <section id="ventures" className="section border-t border-line bg-canvas">
      <div className="grid items-start gap-10 lg:grid-cols-[1fr_0.75fr] lg:gap-12">
        <div>
          <Reveal>
            <span className="eyebrow">{ventures.eyebrow}</span>
            <h2 className="mt-5 max-w-2xl text-statement serif text-ink">
              {ventures.heading}
            </h2>
            <p className="mt-4 max-w-xl text-pretty leading-relaxed text-muted">
              {ventures.intro}
            </p>
          </Reveal>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {ventures.items.map((v, i) => (
              <VentureCard key={v.title} venture={v} index={i} />
            ))}
          </div>

          <Reveal delay={0.12}>
            <div className="mt-4 flex flex-col items-start justify-between gap-4 rounded-2xl border border-dashed border-line bg-white p-6 sm:flex-row sm:items-center">
              <div>
                <span className="eyebrow">{ventures.future.label}</span>
                <p className="mt-2 max-w-xl text-pretty text-sm text-muted">
                  {ventures.future.text}
                </p>
              </div>
              <span className="text-2xl font-light text-brand/30">+</span>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="flex justify-center lg:justify-end">
          <SectionIllustration
            src={art.src}
            alt={art.alt}
            caption={art.caption}
            size="large"
          />
        </Reveal>
      </div>
    </section>
  );
}

function VentureCard({ venture, index }) {
  return (
    <Reveal
      delay={index * 0.06}
      className="flex min-h-[220px] flex-col justify-between rounded-2xl border border-line bg-white p-6 shadow-card transition hover:border-brand/25 hover:shadow-lift"
    >
      <div>
        <div className="flex items-center justify-between">
          {venture.logo ? (
            <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-line bg-canvas">
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
          <span className="rounded-full border border-line px-2 py-0.5 text-[10px] text-muted">
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
