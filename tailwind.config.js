/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#f4f6f9",
        brand: {
          DEFAULT: "#1f4e79",
          dark: "#163a5c",
          light: "#2d6a9f",
        },
        ink: "#1f2933",
        body: "#334155",
        muted: "#64748b",
        line: "#d6dde5",
        // Legacy tokens kept for gradual migration
        platinum: "#1f2933",
        mist: "#475569",
        slate2: "#64748b",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Fraunces", "Georgia", "serif"],
      },
      letterSpacing: {
        eyebrow: "0.22em",
      },
      fontSize: {
        display: ["clamp(2.75rem, 7vw, 6rem)", { lineHeight: "1.02", letterSpacing: "-0.03em" }],
        hero: ["clamp(2.25rem, 5.5vw, 4.5rem)", { lineHeight: "1.05", letterSpacing: "-0.025em" }],
        statement: ["clamp(1.75rem, 4vw, 3.25rem)", { lineHeight: "1.18", letterSpacing: "-0.015em" }],
      },
      boxShadow: {
        card: "0 1px 3px rgba(15, 23, 42, 0.06), 0 8px 24px rgba(15, 23, 42, 0.06)",
        lift: "0 4px 20px rgba(15, 23, 42, 0.1)",
      },
    },
  },
  plugins: [],
};
