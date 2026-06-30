import { motion } from "framer-motion";
import PageShell from "../components/PageShell.jsx";
import Reveal from "../components/Reveal.jsx";
import { ventures } from "../data/site.js";

function VenturePanel({ venture, index }) {
  return (
    <Reveal delay={index * 0.1}>
      <motion.article
        whileHover={{ y: -4 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="group relative overflow-hidden rounded-3xl border border-line glass-panel p-10 md:p-14"
      >
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/5 blur-3xl transition group-hover:bg-accent/10" />

        <div className="relative flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-center gap-5">
            {venture.logo && (
              <span className="grid h-14 w-14 place-items-center overflow-hidden rounded-2xl border border-line bg-hq-deep/50">
                <img
                  src={venture.logo}
                  alt=""
                  className={`h-full w-full ${
                    venture.logoFit === "cover" ? "object-cover" : "object-contain p-2"
                  }`}
                />
              </span>
            )}
            <div>
              <span className="live-badge">{venture.status}</span>
              <h2 className="mt-4 font-serif text-3xl text-ink md:text-4xl">
                {venture.href ? (
                  <a
                    href={venture.href}
                    target="_blank"
                    rel="noreferrer"
                    className="transition hover:text-accent"
                  >
                    {venture.title}
                  </a>
                ) : (
                  venture.title
                )}
              </h2>
            </div>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-eyebrow text-accent/60">
            {venture.field}
          </span>
        </div>

        <div className="relative mt-12 grid gap-8 border-t border-line pt-10 sm:grid-cols-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-eyebrow text-muted">Role</p>
            <p className="mt-2 text-lg text-ink">{venture.role || "Founder"}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-[10px] font-semibold uppercase tracking-eyebrow text-muted">Impact</p>
            <p className="mt-2 text-lg leading-relaxed text-body">{venture.impact}</p>
          </div>
        </div>

        <p className="relative mt-8 max-w-2xl text-base leading-relaxed text-muted">
          {venture.description}
        </p>

        {venture.href && (
          <a
            href={venture.href}
            target="_blank"
            rel="noreferrer"
            className="btn-primary relative mt-10"
          >
            Visit {venture.title.split(".")[0]} →
          </a>
        )}
      </motion.article>
    </Reveal>
  );
}

export default function VenturesPage() {
  return (
    <PageShell ambient="ventures">
      <section className="section-pad">
        <Reveal>
          <span className="eyebrow">{ventures.eyebrow}</span>
          <h1 className="mt-8 max-w-4xl font-serif text-display text-ink">{ventures.heading}</h1>
          <p className="mt-8 max-w-2xl text-xl leading-relaxed text-muted">{ventures.intro}</p>
        </Reveal>
      </section>

      <section className="border-t border-line">
        <div className="section-pad mx-auto max-w-5xl space-y-12 !pt-16">
          {ventures.items.map((venture, i) => (
            <VenturePanel key={venture.title} venture={venture} index={i} />
          ))}

          <Reveal>
            <div className="rounded-3xl border border-dashed border-line p-10 text-center md:p-14">
              <span className="gold-badge">{ventures.future.label}</span>
              <p className="mx-auto mt-6 max-w-xl font-serif text-xl text-ink/80">
                {ventures.future.text}
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
