import { useEffect, useRef, useState } from "react";
import SiteNav from "../components/SiteNav.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import { meta, avatarConfig, home, ethos } from "../data/site.js";

function ScrollSection({ children, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

function ScrollChevron() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6 animate-bounce text-muted"
      aria-hidden="true"
    >
      <path d="M12 5v14" />
      <path d="m6 13 6 6 6-6" />
    </svg>
  );
}

export default function HomeOnly() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.08);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="bg-white">
      <SiteNav />

      <section id="home" className="flex min-h-screen flex-col items-center justify-center px-6 pb-16 pt-24 text-center">
        <div className="overflow-hidden rounded-2xl border border-line bg-canvas shadow-card">
          <img
            src={avatarConfig.image}
            alt={meta.name}
            className="h-48 w-48 object-cover md:h-56 md:w-56"
          />
        </div>

        <h1 className="mt-10 font-serif text-4xl tracking-tight text-ink md:text-5xl">
          {meta.name}
        </h1>

        <p className="mt-6 max-w-xl text-pretty font-serif text-xl leading-relaxed text-ink md:text-2xl">
          {home.ethosStatement}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a href={home.cta.href} className="btn-accent">
            {home.cta.label}
          </a>
          <a href={home.secondary.href} className="btn">
            {home.secondary.label}
          </a>
        </div>

        {!scrolled && (
          <div className="mt-12" aria-label="Scroll down">
            <ScrollChevron />
          </div>
        )}
      </section>

      <section id="principles" className="border-t border-line bg-canvas">
        <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
          <ScrollSection>
            <h2 className="font-serif text-3xl text-ink md:text-4xl">
              {ethos.principlesHeading}
            </h2>
            <p className="mt-3 text-lg text-muted">{ethos.principlesIntro}</p>
          </ScrollSection>

          <div className="mt-10 space-y-0 divide-y divide-line border-y border-line bg-white">
            {ethos.principles.map((principle) => (
              <ScrollSection key={principle.id}>
                <article className="group px-5 py-6 transition-colors hover:bg-canvas md:px-6 md:py-7">
                  <div className="flex items-baseline gap-4">
                    <span className="font-serif text-sm text-brand/60">{principle.no}</span>
                    <h3 className="text-lg font-medium text-ink">{principle.title}</h3>
                  </div>
                  <p className="mt-2 pl-9 text-sm text-muted">{principle.summary}</p>
                  <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-300 group-hover:grid-rows-[1fr] group-hover:opacity-100">
                    <div className="overflow-hidden">
                      <p className="mt-3 pl-9 text-sm leading-relaxed text-body">
                        {principle.detail}
                      </p>
                    </div>
                  </div>
                </article>
              </ScrollSection>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
