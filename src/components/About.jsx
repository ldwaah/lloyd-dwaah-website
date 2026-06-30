import { motion } from "framer-motion";
import { about } from "../data/site.js";

const reveal = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function About() {
  return (
    <section id="about" className="section">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-10">
        {/* Heading column */}
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="md:col-span-4"
        >
          <span className="chip">About</span>
          <h2 className="mt-5 text-3xl font-bold leading-tight text-white sm:text-4xl">
            {about.lead}
          </h2>
        </motion.div>

        {/* Body column */}
        <div className="md:col-span-8">
          <div className="space-y-5">
            {about.body.map((para, i) => (
              <motion.p
                key={i}
                custom={i + 1}
                variants={reveal}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                className="text-lg leading-relaxed text-slate-300"
              >
                {para}
              </motion.p>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-3 gap-4">
            {about.stats.map((s, i) => (
              <motion.div
                key={s.label}
                custom={i}
                variants={reveal}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="glass rounded-2xl p-5 text-center transition-colors hover:border-cyan-soft/30"
              >
                <div className="text-2xl font-bold text-gradient sm:text-3xl">
                  {s.value}
                </div>
                <div className="mt-1 text-xs uppercase tracking-wider text-slate-400">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
