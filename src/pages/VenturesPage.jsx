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
        <Reveal>
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
    [0, 0.38, 0.72],
    [fromLeft ? -100 : 100, 0, 0]
  );
  const logoY = useTransform(scrollYProgress, [0, 0.38], [36, 0]);
  const logoScale = useTransform(scrollYProgress, [0, 0.4], [0.82, 1]);
  const logoOpacity = useTransform(scrollYProgress, [0, 0.22], [0, 1]);
  const logoRotate = useTransform(scrollYProgress, [0, 0.4], [fromLeft ? -5 : 5, 0]);

  const glowOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7], [0, 0.55, 0.25]);

  const indexOpacity = useTransform(scrollYProgress, [0.05, 0.25], [0, 1]);
  const titleOpacity = useTransform(scrollYProgress, [0.14, 0.36], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0.14, 0.38], [52, 0]);

  const detailsOpacity = useTransform(scrollYProgress, [0.3, 0.52], [0, 1]);
  const detailsY = useTransform(scrollYProgress, [0.3, 0.54], [40, 0]);

  const ctaOpacity = useTransform(scrollYProgress, [0.48, 0.65], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.48, 0.65], [20, 0]);

  const exitOpacity = useTransform(scrollYProgress, [0.82, 1], [1, 0.35]);
  const exitScale = useTransform(scrollYProgress, [0.82, 1], [1, 0.96]);
  const scrollHintOpacity = useTransform(scrollYProgress, [0.7, 0.9], [0, 0.5]);

  if (reduced) {
    return <VentureStaticPanel venture={venture} index={index} />;
  }

  return (
    <section
      ref={ref}
      className="relative h-[190vh] border-t border-line md:h-[220vh]"
      aria-label={venture.title}
    >
      <motion.div
        style={{ opacity: exitOpacity, scale: exitScale }}
        className="sticky top-20 flex h-[calc(100vh-5rem)] items-center overflow-hidden"
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
          <motion.p
            style={{ opacity: indexOpacity }}
            className="absolute left-6 top-0 font-serif text-6xl font-light text-ink/[0.04] md:left-10 md:text-8xl"
            aria-hidden="true"
          >
            {String(index + 1).padStart(2, "0")}
          </motion.p>

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
                opacity: logoOpacity,
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
              <motion.div style={{ opacity: titleOpacity, y: titleY }}>
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

              <motion.div
                style={{ opacity: detailsOpacity, y: detailsY }}
                className="mt-10 space-y-8 border-t border-line/60 pt-8"
              >
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
                <motion.div style={{ opacity: ctaOpacity, y: ctaY }} className="mt-10">
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
    <section className="border-t border-line bg-hq-deep/40">
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
      <section className="section-pad pb-12 md:pb-16">
        <Reveal>
          <span className="eyebrow">{ventures.eyebrow}</span>
          <h1 className="mt-8 max-w-4xl font-serif text-display text-ink">{ventures.heading}</h1>
          <p className="mt-8 max-w-2xl text-xl leading-relaxed text-muted">{ventures.intro}</p>
        </Reveal>
      </section>

      <div className="relative">
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
