import { useCallback, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Scene3D from "../components/Scene3D.jsx";
import SiteNav from "../components/SiteNav.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import Reveal, { RevealLines } from "../components/Reveal.jsx";
import HomeScrollLayers from "../components/HomeScrollLayers.jsx";
import Preloader, { hasSeenHomePreloader } from "../components/Preloader.jsx";
import { home, ethos } from "../data/site.js";
import { prefersReducedMotion } from "../lib/input.js";

function ScrollChevron() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.8 }}
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
  const [showPreloader, setShowPreloader] = useState(
    () => !hasSeenHomePreloader() && !prefersReducedMotion()
  );
  const [sceneReady, setSceneReady] = useState(false);
  const reduced = prefersReducedMotion();

  const heroTrackRef = useRef(null);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroTrackRef,
    offset: ["start start", "end start"],
  });

  const sceneOpacity = useTransform(heroProgress, [0, 0.55, 1], [1, 0.35, 0]);
  const sceneScale = useTransform(heroProgress, [0, 1], [1, reduced ? 1 : 0.96]);
  const chevronOpacity = useTransform(heroProgress, [0, 0.2], [1, 0]);

  const handlePreloaderComplete = useCallback(() => {
    setShowPreloader(false);
  }, []);

  const handlePortraitReady = useCallback(() => {
    setSceneReady(true);
  }, []);

  return (
    <div className="relative min-h-screen bg-hq">
      {/* Fixed cinematic hero — fades as you scroll past the track */}
      <motion.div
        style={{
          opacity: reduced ? 1 : sceneOpacity,
          scale: reduced ? 1 : sceneScale,
        }}
        className="pointer-events-none fixed inset-0 z-0 origin-center will-change-transform"
      >
        <Scene3D variant="hero" onPortraitReady={handlePortraitReady} />
        <HomeScrollLayers />
      </motion.div>

      <Preloader
        active={showPreloader}
        sceneReady={sceneReady}
        onComplete={handlePreloaderComplete}
      />

      <div
        className={`page-enter relative z-10 ${showPreloader ? "pointer-events-none" : ""}`}
      >
        <SiteNav transparent />

        {/* Scroll track — hero holds the viewport while scene fades */}
        <section ref={heroTrackRef} id="home" className="relative h-[115vh]">
          <div className="sticky top-0 h-screen">
            {!showPreloader && !reduced && (
              <motion.div style={{ opacity: chevronOpacity }} className="absolute inset-0">
                <ScrollChevron />
              </motion.div>
            )}
          </div>
        </section>

        {/* Name — solid panel so text always reads over the portrait */}
        <section className="relative z-20 bg-hq-deep">
          <div className="section-pad mx-auto flex min-h-screen max-w-4xl flex-col justify-center text-center">
            <RevealLines
              lines={[home.nameReveal]}
              lineClassName="font-serif text-statement text-ink text-balance"
              revealDelay={0.2}
            />
          </div>
        </section>

        {/* Ethos */}
        <section className="relative z-20 bg-hq-deep">
          <div className="section-pad mx-auto flex min-h-screen max-w-4xl flex-col justify-center text-center">
            <Reveal revealDelay={0.22} y={28} viewportMargin="0px 0px -40px 0px">
              <p className="font-serif text-statement text-ink text-balance">
                {home.ethosStatement}
              </p>
            </Reveal>
          </div>
        </section>

        {/* Core principles */}
        <section id="principles" className="relative z-20 border-t border-line bg-hq-deep">
          <div className="section-pad mx-auto max-w-4xl">
            <Reveal revealDelay={0.2} y={20}>
              <span className="eyebrow">{ethos.principlesHeading}</span>
            </Reveal>
            <Reveal revealDelay={0.2} delay={0.1} y={28}>
              <h2 className="mt-8 font-serif text-hero text-ink">{ethos.principlesIntro}</h2>
            </Reveal>

            <div className="mt-20 space-y-0">
              {ethos.principles.map((principle, i) => (
                <Reveal key={principle.id} revealDelay={0.15} delay={i * 0.08} y={20}>
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

        <SiteFooter minimal />
      </div>
    </div>
  );
}
