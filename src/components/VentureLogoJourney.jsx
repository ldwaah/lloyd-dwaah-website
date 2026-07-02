import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap.js";
import { shouldAnimateScroll, scheduleScrollRefresh } from "../lib/gsap.js";
import { prefersReducedMotion } from "../lib/input.js";

export function LogoChip({ venture, className = "" }) {
  return (
    <span
      className={`grid place-items-center overflow-hidden rounded-2xl border border-line/80 bg-hq-deep/90 shadow-lift backdrop-blur-sm ${className}`}
    >
      {venture.logo ? (
        <img
          src={venture.logo}
          alt=""
          className={`h-full w-full ${
            venture.logoFit === "cover" ? "object-cover" : "object-contain p-3"
          }`}
        />
      ) : (
        <span className="font-serif text-2xl text-accent/50">{venture.title[0]}</span>
      )}
    </span>
  );
}

export default function VentureFlyingLogos({ dockRefs, sectionRefs, slotRefs, items }) {
  const logoRefs = useRef([]);
  const layerRef = useRef(null);
  const statesRef = useRef(items.map(() => "docked"));

  useEffect(() => {
    if (!shouldAnimateScroll()) return undefined;

    const logos = logoRefs.current.filter(Boolean);
    const sections = sectionRefs.current.filter(Boolean);
    const slots = slotRefs.current.filter(Boolean);
    const docks = dockRefs.current.filter(Boolean);

    if (
      logos.length !== items.length ||
      sections.length !== items.length ||
      slots.length !== items.length ||
      docks.length !== items.length
    ) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      const getSize = () => (window.innerWidth >= 768 ? 92 : 76);
      const travelStartRef = { current: items.map(() => null) };

      const measureDock = (index) => {
        const dock = docks[index];
        const rect = dock.getBoundingClientRect();
        return { x: rect.left, y: rect.top, size: rect.width || getSize() };
      };

      const setDocked = (index) => {
        const logo = logos[index];
        const dock = measureDock(index);
        const tilt = index === 0 ? -8 : 10;

        gsap.set(logo, {
          position: "fixed",
          left: dock.x,
          top: dock.y,
          width: dock.size,
          height: dock.size,
          x: 0,
          y: 0,
          z: 0,
          scale: 1,
          rotationZ: tilt,
          rotationY: index === 0 ? -12 : 14,
          transformPerspective: 900,
          autoAlpha: 1,
          zIndex: 40 + index,
        });
      };

      const lockLogo = (index) => {
        if (statesRef.current[index] === "locked") return;
        statesRef.current[index] = "locked";
        travelStartRef.current[index] = null;
        gsap.set(logos[index], { autoAlpha: 0, pointerEvents: "none" });
        slots[index].classList.remove("opacity-0", "invisible");
        slots[index].setAttribute("aria-hidden", "false");
      };

      const unlockLogo = (index) => {
        if (statesRef.current[index] !== "locked") return;
        statesRef.current[index] = "docked";
        travelStartRef.current[index] = null;
        gsap.set(logos[index], { autoAlpha: 1 });
        slots[index].classList.add("opacity-0", "invisible");
        slots[index].setAttribute("aria-hidden", "true");
        setDocked(index);
      };

      logos.forEach((_, index) => setDocked(index));

      sections.forEach((section, index) => {
        const logo = logos[index];
        const slot = slots[index];
        if (!logo || !slot) return;

        ScrollTrigger.create({
          trigger: section,
          start: "top 92%",
          end: "top 22%",
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (statesRef.current[index] === "locked") return;

            const p = self.progress;

            if (p <= 0) {
              statesRef.current[index] = "docked";
              travelStartRef.current[index] = null;
              setDocked(index);
              return;
            }

            if (!travelStartRef.current[index]) {
              travelStartRef.current[index] = measureDock(index);
            }

            statesRef.current[index] = "traveling";
            const start = travelStartRef.current[index];
            const slotRect = slot.getBoundingClientRect();
            const size = start.size;
            const endX = slotRect.left + slotRect.width / 2 - size / 2;
            const endY = slotRect.top + slotRect.height / 2 - size / 2;
            const tilt = index === 0 ? -10 : 10;
            const spin = index === 0 ? -1 : 1;
            const arc = Math.sin(p * Math.PI);

            gsap.set(logo, {
              position: "fixed",
              left: start.x + (endX - start.x) * p,
              top: start.y + (endY - start.y) * p,
              width: size,
              height: size,
              scale: 1 - p * 0.36,
              rotationZ: tilt * (1 - p),
              // 3D swoop: the chip yaws hard mid-flight, pitches back, and
              // dips away in z before settling flat into its slot.
              rotationY: spin * ((1 - p) * 16 + arc * 58),
              rotationX: arc * 26,
              z: -arc * 260,
              transformPerspective: 900,
              autoAlpha: 1,
            });

            if (p >= 0.995) lockLogo(index);
          },
          onLeaveBack: () => unlockLogo(index),
        });
      });

      const onRefresh = () => {
        logos.forEach((_, index) => {
          if (statesRef.current[index] === "docked") setDocked(index);
        });
        scheduleScrollRefresh({ force: true });
      };

      window.addEventListener("resize", onRefresh);
      window.addEventListener("load", onRefresh);
      requestAnimationFrame(onRefresh);

      return () => {
        window.removeEventListener("resize", onRefresh);
        window.removeEventListener("load", onRefresh);
      };
    }, layerRef);

    return () => {
      ctx.revert();
      scheduleScrollRefresh({ force: true });
    };
  }, [dockRefs, sectionRefs, slotRefs, items.length]);

  if (prefersReducedMotion()) return null;

  return (
    <div ref={layerRef} className="pointer-events-none fixed inset-0 z-40" aria-hidden="true">
      {items.map((venture, index) => (
        <div
          key={venture.title}
          ref={(node) => {
            logoRefs.current[index] = node;
          }}
          className="will-change-transform"
          style={{ transformStyle: "preserve-3d" }}
        >
          <LogoChip venture={venture} className="h-full w-full" />
        </div>
      ))}
    </div>
  );
}

export function VentureSection({ venture, index, sectionRef, slotRef, hideLogo = false }) {
  const localRef = useRef(null);

  useEffect(() => {
    if (!shouldAnimateScroll() || prefersReducedMotion()) return undefined;

    const el = localRef.current;
    if (!el) return undefined;

    const ctx = gsap.context(() => {
      const num = el.querySelector("[data-venture-num]");
      const rises = el.querySelectorAll("[data-venture-rise]");

      // Chapter number drifts counter to the scroll for depth.
      if (num) {
        gsap.fromTo(
          num,
          { yPercent: 46, opacity: 0.4 },
          {
            yPercent: -46,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          }
        );
      }

      // Content blocks rise into place as the chapter takes the stage.
      if (rises.length) {
        gsap.fromTo(
          rises,
          { y: 64, opacity: 0.1 },
          {
            y: 0,
            opacity: 1,
            ease: "power1.out",
            stagger: 0.08,
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              end: "top 42%",
              scrub: 0.5,
            },
          }
        );
      }
    }, el);

    return () => ctx.revert();
  }, []);

  const setRefs = (node) => {
    localRef.current = node;
    if (typeof sectionRef === "function") sectionRef(node);
  };

  return (
    <section
      ref={setRefs}
      className={`relative overflow-hidden border-t border-line/40 ${index === 0 ? "min-h-[92vh]" : "min-h-[100vh]"} py-20 md:py-28`}
      aria-label={venture.title}
    >
      <p
        data-venture-num
        className="pointer-events-none absolute right-2 top-8 select-none font-serif text-[8rem] font-light leading-none text-ink/[0.04] md:right-8 md:text-[15rem]"
        aria-hidden="true"
      >
        {String(index + 1).padStart(2, "0")}
      </p>

      <div className="relative mx-auto w-full max-w-6xl px-6 md:px-10">
        <div className="mt-4 grid items-start gap-12 md:grid-cols-[auto,1fr] md:gap-16">
          <div
            ref={slotRef}
            data-venture-logo-slot
            className={`mx-auto md:mx-0 ${hideLogo ? "invisible opacity-0" : ""}`}
            aria-hidden={hideLogo}
          >
            <LogoChip venture={venture} className="h-28 w-28 md:h-36 md:w-36" />
          </div>

          <div className="min-w-0">
            <span data-venture-rise className="status-label">{venture.status}</span>
            <h2 data-venture-rise className="mt-5 font-serif text-4xl text-ink md:text-5xl">
              {venture.href ? (
                <a
                  href={venture.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-300 hover:text-accent"
                >
                  {venture.displayTitle || venture.title}
                </a>
              ) : (
                venture.displayTitle || venture.title
              )}
            </h2>
            <p data-venture-rise className="mt-3 text-[10px] font-light uppercase tracking-[0.28em] text-accent/60">
              {venture.field}
            </p>

            <div data-venture-rise className="mt-10 space-y-8 border-t border-line/60 pt-8">
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
            </div>

            {venture.href && (
              <a
                data-venture-rise
                href={venture.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-10 inline-flex"
              >
                Visit {(venture.displayTitle || venture.title).split(".")[0]} →
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
