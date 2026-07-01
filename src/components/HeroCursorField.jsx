import { useEffect, useRef } from "react";
import { isTouchDevice, prefersReducedMotion, usePointerRef } from "../lib/input.js";

/**
 * Subtle cursor-reactive studio lighting for the hero (desktop only).
 */
export default function HeroCursorField() {
  const fieldRef = useRef(null);
  const pointer = usePointerRef();

  useEffect(() => {
    if (prefersReducedMotion() || isTouchDevice()) return undefined;

    let frame = 0;
    const tick = () => {
      const el = fieldRef.current;
      if (el) {
        const p = pointer.current;
        const x = 50 + p.x * 18;
        const y = 42 + p.y * 14;
        el.style.setProperty("--cursor-x", `${x}%`);
        el.style.setProperty("--cursor-y", `${y}%`);
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [pointer]);

  if (prefersReducedMotion() || isTouchDevice()) {
    return (
      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-40"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(94,234,255,0.08), transparent 55%), linear-gradient(180deg, rgba(32,49,64,0.2), rgba(22,36,47,0.85))",
        }}
      />
    );
  }

  return (
    <div
      ref={fieldRef}
      className="pointer-events-none absolute inset-0 z-[1] opacity-100"
      aria-hidden="true"
      style={{
        "--cursor-x": "50%",
        "--cursor-y": "42%",
        background: `
          radial-gradient(circle at var(--cursor-x) var(--cursor-y), rgba(94,234,255,0.14) 0%, transparent 28%),
          radial-gradient(circle at calc(var(--cursor-x) + 12%) calc(var(--cursor-y) - 8%), rgba(56,182,255,0.06) 0%, transparent 32%),
          linear-gradient(rgba(94,234,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(94,234,255,0.03) 1px, transparent 1px),
          linear-gradient(180deg, rgba(32,49,64,0.15), rgba(22,36,47,0.92))
        `,
        backgroundSize: "auto, auto, 64px 64px, 64px 64px, auto",
      }}
    />
  );
}
