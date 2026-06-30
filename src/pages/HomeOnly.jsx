import { useCallback, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Scene3D from "../components/Scene3D.jsx";
import SiteNav from "../components/SiteNav.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import Reveal, { RevealStagger } from "../components/Reveal.jsx";
import HomeScrollLayers from "../components/HomeScrollLayers.jsx";
import Preloader, { hasSeenHomePreloader } from "../components/Preloader.jsx";
import { meta, home, ethos } from "../data/site.js";
import { prefersReducedMotion } from "../lib/input.js";

function ScrollChevron() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2, duration: 1 }}
      className="absolute bottom-10 left-1/2 -translate-x-1/2"
      aria-label="Scroll down"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="h-8 w-8 animate-bounce text-accent/40"
        aria-hidden="true"
      >
        <path d="M12 5v14M7 12l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.div>
  );
}

export default function HomeOnly() {
  const [scrolled, setScrolled] = useState(false);
  const [showPreloader, setShowPreloader] = useState(
    () => !hasSeenHomePreloader() && !prefersReducedMotion()
  );
  const [sceneReady, setSceneReady] = useState(false);

  const { scrollYProgress } = useScroll();
  const contentY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, prefersReducedMotion() ? 0 : -48]
  );

  const handlePreloaderComplete = useCallback(() => {
    setShowPreloader(false);
  }, []);

  const handlePortraitReady = useCallback(() => {
    setSceneReady(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.15);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-hq">
      <Scene3D variant="hero" onPortraitReady={handlePortraitReady} />
      <HomeScrollLayers />

      <Preloader
        active={showPreloader}
        sceneReady={sceneReady}
        onComplete={handlePreloaderComplete}
      />

      <motion.div
        style={{ y: contentY }}
        className={`page-enter relative z-10 ${showPreloader ? "pointer-events-none" : ""}`}
      >
        <SiteNav transparent />

        {/* Image-first installation hero — no text until scroll */}
        <section id="home" className="relative min-h-screen">
          {!scrolled && !showPreloader && <ScrollChevron />}
        </section>

        {/* Revealed on scroll */}
        <section className="relative border-t border-line/30 bg-hq-deep/80 backdrop-blur-sm">
          <div className="section-pad mx-auto max-w-4xl text-center">
            <Reveal>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-accent/70">
                {meta.name}
              </p>
              <h1 className="mt-8 font-serif text-statement text-ink text-balance">
                {home.ethosStatement}
              </h1>
            </Reveal>
            <RevealStagger className="mt-12 flex flex-wrap items-center justify-center gap-4" stagger={0.1}>
              <a href={home.cta.href} className="btn-primary">
                {home.cta.label}
              </a>
              <a href={home.secondary.href} className="btn-ghost">
                {home.secondary.label}
              </a>
            </RevealStagger>
          </div>
        </section>

        {/* Core principles */}
        <section
          id="principles"
          className="relative border-t border-line bg-hq-deep/90 backdrop-blur-sm"
        >
          <div className="section-pad mx-auto max-w-4xl">
            <Reveal>
              <span className="eyebrow">{ethos.principlesHeading}</span>
              <h2 className="mt-8 font-serif text-hero text-ink">{ethos.principlesIntro}</h2>
            </Reveal>

            <div className="mt-20 space-y-0">
              {ethos.principles.map((principle, i) => (
                <Reveal key={principle.id} delay={i * 0.08} y={20}>
                  <article className="group border-t border-line py-10 transition-colors duration-500 hover:bg-white/[0.02] md:py-14">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-12">
                      <span className="font-serif text-sm tracking-widest text-accent/50">
                        {principle.no}
                      </span>
                      <div className="flex-1">
                        <h3 className="font-serif text-2xl text-ink md:text-3xl">
                          {principle.title}
                        </h3>
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

        <SiteFooter />
      </motion.div>
    </div>
  );
}
