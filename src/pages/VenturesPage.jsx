import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import PageShell from "../components/PageShell.jsx";
import Reveal from "../components/Reveal.jsx";
import TopographicLines from "../components/TopographicLines.jsx";
import { ventures } from "../data/site.js";
import { prefersReducedMotion } from "../lib/input.js";

const ease = [0.22, 1, 0.36, 1];

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
              <h2 className="mt-4 font-serif text-3xl text-ink md:text-4xl">{venture.title}</h2>
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
                  Visit {venture.title.split(".")[0]} →
                </a>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </article>
  );
}

function VentureScrollMoment({ venture, index, total }) {
  const ref = useRef(null);
  const reduced = prefersReducedMotion();
  const fromLeft = index % 2 === 0;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const logoX = useTransform(
    scrollYProgress,
    [0, 0.28, 0.68],
    [fromLeft ? -80 : 80, 0, 0]
  );
  const logoY = useTransform(scrollYProgress, [0, 0.28], [24, 0]);
  const logoScale = useTransform(scrollYProgress, [0, 0.28], [0.88, 1]);
  const logoRotate = useTransform(scrollYProgress, [0, 0.28], [fromLeft ? -5 : 5, 0]);

  const glowOpacity = useTransform(scrollYProgress, [0, 0.22, 0.65], [0, 0.55, 0.25]);

  const titleY = useTransform(scrollYProgress, [0.08, 0.24], [24, 0]);
  const detailsY = useTransform(scrollYProgress, [0.18, 0.38], [20, 0]);
  const ctaY = useTransform(scrollYProgress, [0.32, 0.48], [12, 0]);

  const exitScale = useTransform(scrollYProgress, [0.78, 1], [1, 0.98]);
  const scrollHintOpacity = useTransform(scrollYProgress, [0.62, 0.85], [0, 0.5]);

  if (reduced) {
    return <VentureStaticPanel venture={venture} index={index} />;
  }

  return (
    <section
      ref={ref}
      className={`relative border-t border-line ${
        index === 0 ? "h-[95vh] md:h-[105vh]" : "h-[115vh] md:h-[130vh]"
      }`}
      aria-label={venture.title}
    >
      <motion.div
        style={{ scale: exitScale }}
        className="sticky top-16 flex h-[calc(100vh-4rem)] items-center overflow-hidden"
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]" aria-hidden="true">
          <TopographicLines className="h-full w-full" />
        </div>

        <motion.div
          style={{ opacity: glowOpacity }}
          className={`pointer-events-none absolute top-1/2 h-[min(70vw,28rem)] w-[min(70vw,28rem)] -translate-y-1/2 rounded-full bg-accent/10 blur-3xl ${
            fromLeft ? "-left-24" : "-right-24"
          }`}
          aria-hidden="true"
        />

        <div className="relative mx-auto w-full max-w-6xl px-6 md:px-10">
          <p
            className="absolute left-6 top-0 font-serif text-6xl font-light text-ink/[0.04] md:left-10 md:text-8xl"
            aria-hidden="true"
          >
            {String(index + 1).padStart(2, "0")}
          </p>

          <div
            className={`grid items-center gap-12 md:grid-cols-2 md:gap-16 ${
              fromLeft ? "" : "md:[&>*:first-child]:order-2"
            }`}
          >
            <motion.div
              style={{
                x: logoX,
                y: logoY,
                scale: logoScale,
                rotate: logoRotate,
              }}
              className="flex justify-center md:justify-center"
            >
              {venture.logo ? (
                <span className="relative grid h-36 w-36 place-items-center overflow-hidden rounded-3xl border border-line bg-hq-deep/60 shadow-lift backdrop-blur-sm md:h-48 md:w-48 lg:h-56 lg:w-56">
                  <span className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" />
                  <img
                    src={venture.logo}
                    alt=""
                    className={`relative h-full w-full ${
                      venture.logoFit === "cover" ? "object-cover" : "object-contain p-5"
                    }`}
                  />
                </span>
              ) : (
                <span className="grid h-36 w-36 place-items-center rounded-3xl border border-line bg-hq-deep/60 md:h-48 md:w-48">
                  <span className="font-serif text-4xl text-accent/40">{venture.title[0]}</span>
                </span>
              )}
            </motion.div>

            <div className={`min-w-0 ${fromLeft ? "md:pl-4" : "md:pr-4"}`}>
              <motion.div style={{ y: titleY }}>
                <span className="status-label">{venture.status}</span>
                <h2 className="mt-5 font-serif text-4xl text-ink md:text-5xl lg:text-[3.25rem]">
                  {venture.href ? (
                    <a
                      href={venture.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors duration-300 hover:text-accent"
                    >
                      {venture.title}
                    </a>
                  ) : (
                    venture.title
                  )}
                </h2>
                <p className="mt-3 text-[10px] font-light uppercase tracking-[0.28em] text-accent/60">
                  {venture.field}
                </p>
              </motion.div>

              <motion.div style={{ y: detailsY }} className="mt-10 space-y-8 border-t border-line/60 pt-8">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="meta-label">Role</p>
                    <p className="mt-2 text-lg text-ink">{venture.role || "Founder"}</p>
                  </div>
                  <div>
                    <p className="meta-label">Impact</p>
                    <p className="mt-2 text-base leading-relaxed text-body">{venture.impact}</p>
                  </div>
                </div>
                <p className="max-w-xl text-base leading-relaxed text-muted">{venture.description}</p>
              </motion.div>

              {venture.href && (
                <motion.div style={{ y: ctaY }} className="mt-10">
                  <a
                    href={venture.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    Visit {venture.title.split(".")[0]} →
                  </a>
                </motion.div>
              )}
            </div>
          </div>

          {index < total - 1 && (
            <motion.div
              style={{ opacity: scrollHintOpacity }}
              className="absolute bottom-2 left-1/2 hidden -translate-x-1/2 md:block"
              aria-hidden="true"
            >
              <span className="block h-10 w-px bg-gradient-to-b from-accent/40 to-transparent" />
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
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
  return (
    <PageShell ambient="ventures">
      <section className="section-pad pb-6 md:pb-8">
        <Reveal revealDelay={0.24} y={16}>
          <span className="eyebrow">{ventures.eyebrow}</span>
        </Reveal>
        <Reveal revealDelay={0.24} delay={0.12} y={32}>
          <h1 className="mt-6 max-w-4xl font-serif text-display text-ink">{ventures.heading}</h1>
        </Reveal>
        <Reveal revealDelay={0.24} delay={0.24} y={24}>
          <p className="mt-5 max-w-2xl font-serif text-2xl text-accent/90 md:text-3xl">
            {ventures.intro}
          </p>
        </Reveal>
        <Reveal revealDelay={0.22} delay={0.32} y={20}>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{ventures.tagline}</p>
        </Reveal>
      </section>

      <div className="relative -mt-2">
        {ventures.items.map((venture, i) => (
          <VentureScrollMoment
            key={venture.title}
            venture={venture}
            index={i}
            total={ventures.items.length}
          />
        ))}
      </div>

      <HorizonSection />
    </PageShell>
  );
}
