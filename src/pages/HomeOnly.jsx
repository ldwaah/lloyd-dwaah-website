import Scene3D from "../components/Scene3D.jsx";
import SiteNav from "../components/SiteNav.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import Reveal from "../components/Reveal.jsx";
import { avatarConfig, home, ethos } from "../data/site.js";
import { isMobile, isTouchDevice, prefersReducedMotion } from "../lib/input.js";

function HeroBackground() {
  const use3D = !isMobile() && !isTouchDevice() && !prefersReducedMotion();

  if (use3D) {
    return (
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <Scene3D variant="hero" />
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <img
        src={avatarConfig.image}
        alt=""
        className="h-full w-full scale-105 object-cover object-[center_18%]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-hq/30 via-hq/55 to-hq-deep" />
    </div>
  );
}

export default function HomeOnly() {
  return (
    <div className="relative min-h-screen bg-hq-deep text-ink">
      {/* Hero — portrait + first line visible without scrolling */}
      <section id="home" className="relative isolate min-h-[100svh]">
        <HeroBackground />

        <div className="relative z-10 flex min-h-[100svh] flex-col">
          <SiteNav />

          <div className="mt-auto bg-gradient-to-t from-hq-deep via-hq-deep/95 to-transparent px-6 pb-10 pt-24 text-center md:px-10 md:pb-14">
            <p className="font-serif text-statement text-ink text-balance">{home.nameReveal}</p>
            <p className="mx-auto mt-6 max-w-2xl text-sm uppercase tracking-[0.28em] text-accent/70">
              Scroll to explore
            </p>
          </div>
        </div>
      </section>

      {/* Ethos */}
      <section className="relative z-10 border-t border-line bg-hq-deep">
        <Reveal y={20} className="section-pad mx-auto flex min-h-[70svh] max-w-4xl flex-col justify-center text-center">
          <p className="font-serif text-statement text-ink text-balance">{home.ethosStatement}</p>
        </Reveal>
      </section>

      {/* Core principles */}
      <section id="principles" className="relative z-10 border-t border-line bg-hq-deep">
        <div className="section-pad mx-auto max-w-4xl">
          <Reveal y={20}>
            <span className="eyebrow">{ethos.principlesHeading}</span>
          </Reveal>
          <Reveal delay={0.08} y={24}>
            <h2 className="mt-8 font-serif text-hero text-ink">{ethos.principlesIntro}</h2>
          </Reveal>

          <div className="mt-20 space-y-0">
            {ethos.principles.map((principle, index) => (
              <Reveal key={principle.id} delay={index * 0.06} y={20}>
                <article className="group border-t border-line py-10 transition-colors duration-500 hover:bg-white/[0.02] md:py-14">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-12">
                    <span className="font-serif text-sm tracking-widest text-accent/50">
                      {principle.no}
                    </span>
                    <div className="flex-1">
                      <h3 className="font-serif text-2xl text-ink md:text-3xl">{principle.title}</h3>
                      <p className="mt-3 text-lg text-muted">{principle.summary}</p>
                      <p className="mt-0 max-h-0 overflow-hidden text-base leading-relaxed text-body opacity-0 transition-all duration-500 group-hover:mt-4 group-hover:max-h-40 group-hover:opacity-100">
                        {principle.detail}
                      </p>
                      <p className="mt-4 text-[10px] font-light uppercase tracking-[0.18em] text-muted/70 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                        {principle.tags.join(" · ")}
                      </p>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="relative z-10 shrink-0 bg-hq-deep">
        <SiteFooter />
      </div>
    </div>
  );
}
