import PageShell from "../components/PageShell.jsx";
import { ventures } from "../data/site.js";

export default function VenturesPage() {
  return (
    <PageShell>
      <section className="section border-b border-line bg-white">
        <span className="eyebrow">{ventures.eyebrow}</span>
        <h1 className="mt-5 max-w-2xl text-statement serif text-ink">{ventures.heading}</h1>
        <p className="mt-4 max-w-xl text-pretty text-muted">{ventures.intro}</p>
      </section>

      <section className="bg-canvas">
        <div className="mx-auto max-w-6xl space-y-4 px-6 py-10 md:py-14">
          {ventures.items.map((venture) => (
            <article
              key={venture.title}
              className="rounded-2xl border border-line bg-white p-8 shadow-card md:p-10"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                {venture.logo ? (
                  <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-full border border-line bg-canvas">
                    <img
                      src={venture.logo}
                      alt=""
                      className={`h-full w-full ${
                        venture.logoFit === "cover" ? "object-cover" : "object-contain p-1.5"
                      }`}
                    />
                  </span>
                ) : null}
                <span className="rounded-full border border-line px-3 py-1 text-[10px] text-muted">
                  {venture.status}
                </span>
              </div>
              <h2 className="mt-5 text-2xl font-medium text-ink">{venture.title}</h2>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-eyebrow text-brand/70">
                {venture.field}
              </p>
              <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-muted">
                {venture.description}
              </p>
            </article>
          ))}

          <article className="rounded-2xl border border-dashed border-line bg-white/60 p-8">
            <span className="eyebrow">{ventures.future.label}</span>
            <p className="mt-3 max-w-2xl text-sm text-muted">{ventures.future.text}</p>
          </article>
        </div>
      </section>
    </PageShell>
  );
}
