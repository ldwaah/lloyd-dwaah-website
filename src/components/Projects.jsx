import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { projects } from "../data/site.js";

export default function Projects() {
  return (
    <section id="projects" className="section">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="mb-14 max-w-2xl"
      >
        <span className="chip">Projects</span>
        <h2 className="mt-5 text-3xl font-bold text-white sm:text-4xl">
          {projects.heading}
        </h2>
        <p className="mt-4 text-lg text-slate-400">{projects.intro}</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {projects.items.map((p, i) => (
          <ProjectCard key={p.title} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project, index }) {
  const ref = useRef(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 150, damping: 20 });
  const sy = useSpring(py, { stiffness: 150, damping: 20 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-6, 6]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [6, -6]);

  const onMove = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000 }}
      className="group glass relative overflow-hidden rounded-3xl p-7 transition-colors duration-300 hover:border-cyan-soft/40"
    >
      {/* Hover glow that follows the card */}
      <div className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_50%_0%,rgba(94,234,255,0.15),transparent_60%)]" />
      </div>

      <div className="relative" style={{ transform: "translateZ(40px)" }}>
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-cyan-soft">
            {project.category}
          </span>
          <span className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-slate-400 transition-all group-hover:border-cyan-soft/40 group-hover:text-cyan-soft">
            ↗
          </span>
        </div>

        <h3 className="text-xl font-semibold text-white">{project.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">
          {project.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-slate-300"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
