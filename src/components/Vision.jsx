import { motion } from "framer-motion";
import { vision } from "../data/site.js";

export default function Vision() {
  return (
    <section id="vision" className="section">
      {/* Big statement */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="relative mx-auto max-w-4xl text-center"
      >
        <span className="chip">Vision</span>
        <blockquote className="mt-7 text-balance text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
          “<span className="text-gradient">{vision.statement}</span>”
        </blockquote>
        <p className="mx-auto mt-7 max-w-2xl text-balance text-lg leading-relaxed text-slate-400">
          {vision.body}
        </p>
      </motion.div>

      {/* Pillars */}
      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
        {vision.pillars.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="glass relative overflow-hidden rounded-3xl p-7"
          >
            <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl border border-cyan-soft/20 bg-cyan-glow/10 text-cyan-soft shadow-glow-sm">
              <span className="text-lg font-bold">{i + 1}</span>
            </div>
            <h3 className="text-lg font-semibold text-white">{p.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              {p.text}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
