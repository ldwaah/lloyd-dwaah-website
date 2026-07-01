import { useRef } from "react";
import PageShell from "../components/PageShell.jsx";
import Reveal from "../components/Reveal.jsx";
import VentureFlyingLogos, { LogoChip, VentureSection } from "../components/VentureLogoJourney.jsx";
import { ventures } from "../data/site.js";
import { prefersReducedMotion } from "../lib/input.js";

function VentureStaticPanel({ venture, index }) {
  return (
    <article className="border-t border-line py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <Reveal delay={index * 0.1}>
          <p className="text-[10px] font-light uppercase tracking-[0.32em] text-muted/50">
            {String(index + 1).padStart(2, "0")}
          </p>
          <div className="mt-8 flex flex-col gap-10 md:flex-row md:items-start md:gap-14">
            {venture.logo && (
              <span className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-2xl border border-line bg-hq-deep/50 md:h-28 md:w-28">
                <img
                  src={venture.logo}
                  alt=""
                  className={`h-full w-full ${
                    venture.logoFit === "cover" ? "object-cover" : "object-contain p-3"
                  }`}
                />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <span className="status-label">{venture.status}</span>
              <h2 className="mt-4 font-serif text-3xl text-ink md:text-4xl">
                {venture.displayTitle || venture.title}
              </h2>
              <p className="mt-2 text-[10px] font-light uppercase tracking-[0.28em] text-accent/60">
                {venture.field}
              </p>
              <p className="mt-6 text-lg leading-relaxed text-body">{venture.impact}</p>
              <p className="mt-4 text-base leading-relaxed text-muted">{venture.description}</p>
              {venture.href && (
                <a
                  href={venture.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary mt-8"
                >
                  Visit {(venture.displayTitle || venture.title).split(".")[0]} →
                </a>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </article>
  );
}

function HorizonSection() {
  return (
    <section className="border-t border-line bg-hq-deep">
      <div className="section-pad mx-auto max-w-3xl text-center">
        <Reveal y={20}>
          <span className="status-label-gold">{ventures.future.label}</span>
          <p className="mx-auto mt-8 max-w-xl font-serif text-2xl leading-relaxed text-ink/85 md:text-3xl">
            {ventures.future.text}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export default function VenturesPage() {
  const introRef = useRef(null);
  const dockRefs = useRef([]);
  const sectionRefs = useRef([]);
  const slotRefs = useRef([]);
  const animateLogos = !prefersReducedMotion();

  return (
    <PageShell ambient="ventures">
      <section ref={introRef} className="relative section-pad pb-12 md:pb-16">
        <Reveal revealDelay={0.24} y={16}>
          <span className="eyebrow">{ventures.eyebrow}</span>
        </Reveal>
        <Reveal revealDelay={0.24} delay={0.12} y={32}>
          <h1 className="mt-6 max-w-4xl font-serif text-display text-ink md:max-w-[62%]">
            {ventures.heading}
          </h1>
        </Reveal>
        <Reveal revealDelay={0.24} delay={0.24} y={24}>
          <p className="mt-5 max-w-2xl font-serif text-2xl text-accent/90 md:text-3xl md:max-w-[55%]">
            {ventures.intro}
          </p>
        </Reveal>
        <Reveal revealDelay={0.22} delay={0.32} y={20}>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted md:max-w-[55%]">
            {ventures.tagline}
          </p>
        </Reveal>

        {animateLogos && (
          <div
            className="pointer-events-none absolute right-4 top-[5.5rem] md:right-10 md:top-[6.5rem]"
            aria-hidden="true"
          >
            {ventures.items.map((venture, index) => (
              <div
                key={venture.title}
                ref={(node) => {
                  dockRefs.current[index] = node;
                }}
                data-venture-dock
                style={{ width: "4.5rem", height: "4.5rem" }}
                className={`absolute md:h-[5.75rem] md:w-[5.75rem] ${index === 0 ? "right-0 top-0 z-10" : "right-2 top-11 z-20 md:right-3 md:top-14"}`}
              >
                <LogoChip venture={venture} className="h-full w-full opacity-0" />
              </div>
            ))}
          </div>
        )}
      </section>

      {animateLogos && (
        <VentureFlyingLogos
          dockRefs={dockRefs}
          sectionRefs={sectionRefs}
          slotRefs={slotRefs}
          items={ventures.items}
        />
      )}

      <div className="relative">
        {ventures.items.map((venture, i) =>
          animateLogos ? (
            <VentureSection
              key={venture.title}
              venture={venture}
              index={i}
              hideLogo
              sectionRef={(node) => {
                sectionRefs.current[i] = node;
              }}
              slotRef={(node) => {
                slotRefs.current[i] = node;
              }}
            />
          ) : (
            <VentureStaticPanel key={venture.title} venture={venture} index={i} />
          )
        )}
      </div>

      <HorizonSection />
    </PageShell>
  );
}
