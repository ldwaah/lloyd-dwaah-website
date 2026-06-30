export default function TopographicLines({ className = "" }) {
  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full opacity-[0.07] ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <pattern id="contour" width="120" height="120" patternUnits="userSpaceOnUse">
          <path
            d="M0 60 Q30 20 60 60 T120 60 M0 90 Q40 50 80 90 T160 90"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.75"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#contour)" className="text-accent" />
      <ellipse cx="30%" cy="40%" rx="45%" ry="35%" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-accent" />
      <ellipse cx="70%" cy="65%" rx="40%" ry="30%" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-accent" />
      <path
        d="M-10 200 Q200 80 400 200 T800 200 M-10 350 Q250 180 500 350 T900 350"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.6"
        className="text-accent"
      />
    </svg>
  );
}
