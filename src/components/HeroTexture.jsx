import TopographicLines from "./TopographicLines.jsx";

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

/**
 * Static Lando-style hero atmosphere: dark base + grain + faint contours.
 * Layer order: texture → cursor glow → portrait.
 */
export default function HeroTexture() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[0]" aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-b from-[#203140] via-[#1c2a36] to-[#16242f]" />

      <TopographicLines className="opacity-[0.05] text-accent" />

      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-soft-light"
        style={{
          backgroundImage: GRAIN,
          backgroundSize: "160px 160px",
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 15%, rgba(94,234,255,0.05), transparent 55%), radial-gradient(ellipse 50% 40% at 85% 25%, rgba(32,49,64,0.35), transparent 50%)",
        }}
      />
    </div>
  );
}
