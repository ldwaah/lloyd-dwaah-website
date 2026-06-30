import Reveal from "./Reveal.jsx";
import { highlights } from "../data/site.js";

export default function Highlights() {
  return (
    <section className="section-tight border-t border-line bg-white">
      <Reveal>
        <span className="eyebrow">{highlights.eyebrow}</span>
        <h2 className="mt-4 max-w-2xl text-2xl serif text-ink md:text-3xl">
          {highlights.heading}
        </h2>
      </Reveal>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
        {highlights.items.map((item, i) => (
          <Reveal
            key={item.label}
            delay={i * 0.06}
            className="rounded-2xl border border-line bg-canvas p-5 shadow-card md:p-6"
          >
            <p className="font-serif text-3xl text-brand md:text-4xl">{item.value}</p>
            <p className="mt-2 text-sm font-semibold text-ink">{item.label}</p>
            <p className="mt-2 text-xs leading-relaxed text-muted">{item.detail}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
