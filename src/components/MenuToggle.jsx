import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1];

/** Square menu toggle — two unequal lines (closed) morph to X (open). */
export default function MenuToggle({ open, onClick, className = "" }) {
  return (
    <button
      type="button"
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      onClick={onClick}
      className={`group relative z-[1] flex h-11 w-11 items-center justify-center border border-ink/60 bg-hq-deep/80 transition-colors duration-300 hover:border-accent/50 hover:bg-white/[0.06] ${className}`}
    >
      <motion.span
        className="absolute block h-px origin-center bg-ink group-hover:bg-accent"
        animate={
          open
            ? { rotate: 45, y: 0, width: 20, right: "auto", left: "50%", x: "-50%", top: "50%" }
            : { rotate: 0, y: 0, width: "calc(100% - 20px)", right: 10, left: "auto", x: 0, top: 13 }
        }
        transition={{ duration: 0.35, ease }}
      />
      <motion.span
        className="absolute block h-px origin-center bg-ink group-hover:bg-accent"
        animate={
          open
            ? { rotate: -45, y: 0, width: 20, right: "auto", left: "50%", x: "-50%", top: "50%" }
            : { rotate: 0, y: 0, width: "62%", right: 10, left: "auto", x: 0, bottom: 13, top: "auto" }
        }
        transition={{ duration: 0.35, ease }}
      />
    </button>
  );
}
