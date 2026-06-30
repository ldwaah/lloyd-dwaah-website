/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./experience.html",
    "./ventures.html",
    "./publications.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hq: {
          DEFAULT: "#203140",
          deep: "#16242f",
          darker: "#0f1b24",
          light: "#2a4254",
        },
        accent: {
          DEFAULT: "#5eeaff",
          dim: "#38b6ff",
          glow: "#8fe6ff",
        },
        gold: {
          DEFAULT: "#c9a962",
          dim: "#a88b4a",
        },
        ink: "#f8fafc",
        body: "#cbd5e1",
        muted: "#94a3b8",
        line: "rgba(148, 163, 184, 0.15)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Fraunces", "Georgia", "serif"],
      },
      letterSpacing: {
        eyebrow: "0.22em",
        wide: "0.08em",
      },
      fontSize: {
        display: [
          "clamp(3rem, 8vw, 7rem)",
          { lineHeight: "0.95", letterSpacing: "-0.04em" },
        ],
        hero: [
          "clamp(2.5rem, 6vw, 5rem)",
          { lineHeight: "1", letterSpacing: "-0.03em" },
        ],
        statement: [
          "clamp(1.75rem, 4vw, 3.5rem)",
          { lineHeight: "1.12", letterSpacing: "-0.02em" },
        ],
        manifesto: [
          "clamp(2rem, 5vw, 4.25rem)",
          { lineHeight: "1.15", letterSpacing: "-0.025em" },
        ],
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255,255,255,0.06)",
        glow: "0 0 60px rgba(94, 234, 255, 0.12)",
        lift: "0 24px 80px rgba(0, 0, 0, 0.45)",
      },
      animation: {
        "pulse-slow": "pulse-slow 8s ease-in-out infinite",
        drift: "drift 20s ease-in-out infinite",
        shimmer: "shimmer 12s linear infinite",
      },
      keyframes: {
        "pulse-slow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.7" },
        },
        drift: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(-2%, 1%) scale(1.03)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
      },
    },
  },
  plugins: [],
};
