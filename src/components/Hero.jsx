import { motion } from "framer-motion";
import TiltPortrait from "./TiltPortrait.jsx";
import { home } from "../data/site.js";

const ease = [0.22, 1, 0.36, 1];

export default function Hero() {
  return (
    <section id="home" className="relative border-b border-line bg-white">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-20">
        <div className="max-w-xl">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="eyebrow"
          >
            {home.eyebrow}
          </motion.span>

          <h1 className="mt-6 text-hero text-ink">
            {home.headline.split(" ").map((word, i) => (
              <span key={i} className="inline-block overflow-hidden align-top">
                <motion.span
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.1 + i * 0.05, ease }}
                  className="serif inline-block pr-[0.25em]"
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease }}
            className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted md:text-lg"
          >
            {home.sub}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <a href={home.cta.href} className="btn-accent">
              {home.cta.label}
            </a>
            <a href={home.secondary.href} className="btn">
              {home.secondary.label}
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease }}
        >
          <TiltPortrait />
        </motion.div>
      </div>
    </section>
  );
}
