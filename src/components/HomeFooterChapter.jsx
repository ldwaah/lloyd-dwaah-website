import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap.js";
import { shouldAnimateScroll, refreshScrollTriggersNow, scheduleScrollRefresh } from "../lib/gsap.js";
import { splitElementWords } from "../lib/splitText.js";
import { prefersReducedMotion } from "../lib/input.js";
import SiteFooter from "./SiteFooter.jsx";

/**
 * Footer as final homepage scroll chapter — scrubbed entrance before contact block.
 */
export default function HomeFooterChapter() {
  const reduced = prefersReducedMotion();
  const trackRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (reduced || !shouldAnimateScroll()) return undefined;

    const track = trackRef.current;
    const content = contentRef.current;
    if (!track || !content) return undefined;

    const ctx = gsap.context(() => {
      const heading = content.querySelector("[data-footer-heading]");
      const text = content.querySelector("[data-footer-text]");
      const headingWords = heading ? splitElementWords(heading) : [];

      gsap.set(headingWords, { y: "110%", opacity: 0 });
      if (text) gsap.set(text, { opacity: 0, y: 20 });

      gsap.timeline({
        scrollTrigger: {
          trigger: track,
          start: "top 88%",
          end: "top 45%",
          scrub: 0.45,
        },
      })
        .to(headingWords, { y: "0%", opacity: 1, duration: 0.12, stagger: 0.025, ease: "power3.out" }, 0)
        .to(text, { opacity: 1, y: 0, duration: 0.15, ease: "power2.out" }, 0.1);
    });

    requestAnimationFrame(() => refreshScrollTriggersNow());

    return () => {
      ctx.revert();
      scheduleScrollRefresh({ force: true });
    };
  }, [reduced]);

  if (reduced || !shouldAnimateScroll()) {
    return (
      <div className="relative z-10 shrink-0 bg-hq-deep">
        <SiteFooter />
      </div>
    );
  }

  return (
    <div ref={trackRef} className="relative z-10 shrink-0 bg-hq-deep">
      <div ref={contentRef}>
        <SiteFooter
          scrubMode
        />
      </div>
    </div>
  );
}
