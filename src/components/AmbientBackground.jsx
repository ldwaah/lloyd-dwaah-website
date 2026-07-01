import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap.js";
import { shouldAnimateScroll, refreshScrollTriggersNow } from "../lib/gsap.js";
import TopographicLines from "./TopographicLines.jsx";
import { prefersReducedMotion } from "../lib/input.js";

/**
 * Atmospheric depth for inner pages — scroll-linked parallax gradients (Lenis-synced).
 */
export default function AmbientBackground({ variant = "default" }) {
  const reduced = prefersReducedMotion();
  const rootRef = useRef(null);
  const gradRef = useRef(null);
  const topoRef = useRef(null);
  const glow1Ref = useRef(null);
  const glow2Ref = useRef(null);
  const gridRef = useRef(null);

  const gradients = {
    default: "from-hq via-hq-deep to-hq-darker",
    experience: "from-hq-darker via-hq to-hq-light/20",
    ventures: "from-hq via-hq-deep to-hq-darker",
    publications: "from-[#1a2832] via-hq to-hq-darker",
  };

  useEffect(() => {
    if (reduced || !shouldAnimateScroll()) return undefined;

    const root = rootRef.current;
    const grad = gradRef.current;
    const topo = topoRef.current;
    const glow1 = glow1Ref.current;
    const glow2 = glow2Ref.current;
    const grid = gridRef.current;
    if (!root || !grad || !topo || !glow1 || !glow2 || !grid) return undefined;

    const ctx = gsap.context(() => {
      gsap.to(grad, {
        y: "14%",
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.45,
        },
      });

      gsap.to(topo, {
        y: -100,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.45,
        },
      });

      gsap.to(glow1, {
        y: -80,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.45,
        },
      });

      gsap.to(glow2, {
        y: 60,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.45,
        },
      });

      gsap.fromTo(
        grid,
        { opacity: 0.03 },
        {
          opacity: 0.045,
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "center center",
            scrub: 0.45,
          },
        }
      );

      gsap.to(grid, {
        opacity: 0.025,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "center center",
          end: "bottom bottom",
          scrub: 0.45,
        },
      });
    }, root);

    requestAnimationFrame(() => refreshScrollTriggersNow());

    return () => ctx.revert();
  }, [reduced]);

  return (
    <div ref={rootRef} className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div
        ref={gradRef}
        className={`absolute inset-0 h-[115vh] bg-gradient-to-br ${gradients[variant] || gradients.default}`}
      />

      <div ref={topoRef} className="absolute inset-0 h-[120vh] opacity-[0.04]">
        <TopographicLines className="h-full w-full" />
      </div>

      <div
        ref={glow1Ref}
        className="absolute -left-1/4 top-0 h-[60vh] w-[60vw] rounded-full bg-accent/5 blur-[120px]"
      />
      <div
        ref={glow2Ref}
        className="absolute -right-1/4 bottom-0 h-[50vh] w-[50vw] rounded-full bg-accent-dim/5 blur-[100px]"
      />

      <div
        ref={gridRef}
        style={{
          opacity: reduced ? 0.03 : 0.03,
          backgroundImage:
            "linear-gradient(rgba(94,234,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(94,234,255,0.5) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
        className="absolute inset-0"
      />
    </div>
  );
}
