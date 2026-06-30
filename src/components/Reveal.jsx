import { motion } from "framer-motion";

// Cinematic fade-up reveal used across sections. Slow and intentional.
const easing = [0.22, 1, 0.36, 1];

export default function Reveal({
  children,
  delay = 0,
  y = 28,
  className = "",
  once = true,
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-90px" }}
      transition={{ duration: 1, delay, ease: easing }}
    >
      {children}
    </motion.div>
  );
}

// Word/line-by-line reveal for editorial statements.
export function RevealLines({ lines, className = "", lineClassName = "" }) {
  return (
    <div className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            className={`block ${lineClassName}`}
            initial={{ y: "110%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.1, delay: i * 0.12, ease: easing }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </div>
  );
}
