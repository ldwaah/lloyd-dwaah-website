import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap.js";
import { shouldAnimateScroll, refreshScrollTriggersNow, scheduleScrollRefresh } from "../lib/gsap.js";
import { splitElementWords } from "../lib/splitText.js";
import { organisations } from "../data/site.js";
import { prefersReducedMotion } from "../lib/input.js";

function PartnerLogo({ partner }) {
  const content = (
    <img
      src={partner.logo}
      alt={partner.name}
      width={240}
      height={96}
      loading="lazy"
      decoding="async"
      className="h-10 w-auto max-h-10 object-contain opacity-[0.65] transition-all duration-300 hover:scale-105 hover:opacity-100 hover:drop-shadow-[0_0_24px_rgba(94,234,255,0.15)] focus-visible:scale-105 focus-visible:opacity-100 focus-visible:drop-shadow-[0_0_24px_rgba(94,234,255,0.15)] md:h-12 md:max-h-12"
    />
  );

  const shellClass =
    "inline-flex h-12 w-[12.5rem] shrink-0 items-center justify-center px-4 md:h-12 md:w-[14rem] md:px-5";

  if (partner.url) {
    return (
      <a
        href={partner.url}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={partner.name}
        className={shellClass}
      >
        {content}
      </a>
    );
  }

  return <span className={shellClass}>{content}</span>;
}

export default function PartnerMarquee() {
  const reduced = prefersReducedMotion();
  const trackRef = useRef(null);
  const pinRef = useRef(null);
  const headerRef = useRef(null);
  const eyebrowRef = useRef(null);
  const marqueeRef = useRef(null);
  const track = [...organisations.items, ...organisations.items];

  useEffect(() => {
    if (reduced || !shouldAnimateScroll()) return undefined;

    const trackEl = trackRef.current;
    const pin = pinRef.current;
    const header = headerRef.current;
    const eyebrow = eyebrowRef.current;
    const marquee = marqueeRef.current;

    if (!trackEl || !pin || !header || !eyebrow || !marquee) return undefined;

    const ctx = gsap.context(() => {
      const words = splitElementWords(eyebrow);
      gsap.set(words, { y: "100%", opacity: 0 });
      gsap.set(marquee, { opacity: 0.35, y: 28 });

      const chapter = gsap.timeline({
        scrollTrigger: {
          trigger: trackEl,
          start: "top top",
          end: "+=65%",
          pin,
          pinSpacing: true,
          scrub: 0.45,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      chapter.to(words, { y: "0%", opacity: 1, duration: 0.1, stagger: 0.03, ease: "power3.out" }, 0);
      chapter.to(marquee, { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" }, 0.06);

      chapter.to(
        marquee.querySelector(".partner-marquee-track"),
        { opacity: 1, duration: 0.15 },
        0.15
      );
    });

    requestAnimationFrame(() => refreshScrollTriggersNow());

    return () => {
      ctx.revert();
      scheduleScrollRefresh({ force: true });
    };
  }, [reduced]);

  const staticLayout = reduced || !shouldAnimateScroll();

  return (
    <section
      aria-label={organisations.eyebrow}
      className="relative z-10 overflow-hidden border-y border-line bg-hq-deep"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.09]"
        aria-hidden="true"
        style={{
          backgroundImage: "url(/assets/partners/marquee-backdrop.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(90deg, #16242f 0%, transparent 12%, transparent 88%, #16242f 100%)",
        }}
      />

      <div ref={trackRef} className={staticLayout ? "" : "relative"}>
        <div
          ref={pinRef}
          className={staticLayout ? "py-12 md:py-16" : "flex min-h-[70svh] flex-col justify-center py-12 md:py-16"}
        >
          <div
            ref={headerRef}
            className="relative mx-auto mb-8 max-w-2xl px-6 text-center md:mb-10 md:px-10"
          >
            <h2
              ref={eyebrowRef}
              className="eyebrow eyebrow-center mx-auto block max-w-fit overflow-hidden text-xs tracking-[0.24em] text-accent/80 md:text-sm"
            >
              {organisations.eyebrow}
            </h2>
          </div>

          <div ref={marqueeRef}>
            {staticLayout ? (
              <div className="relative mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-8 gap-y-8 px-6 md:gap-x-12 md:px-10">
                {organisations.items.map((partner) => (
                  <PartnerLogo key={partner.id} partner={partner} />
                ))}
              </div>
            ) : (
              <div className="partner-marquee relative">
                <div className="partner-marquee-track">
                  {track.map((partner, index) => (
                    <PartnerLogo key={`${partner.id}-${index}`} partner={partner} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
