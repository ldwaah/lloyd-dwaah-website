import Reveal from "./Reveal.jsx";
import { highlights } from "../data/site.js";

export default function Highlights() {
  return (
    <section className="section-dark border-t border-white/10">
      <div className="section !py-12 md:!py-16">
        <Reveal>
          <span className="eyebrow">{highlights.eyebrow}</span>
          <h2 className="mt-4 max-w-2xl text-2xl serif text-white md:text-3xl">
            {highlights.heading}
          </h2>
        </Reveal>

        <div className="mt-10 divide-y divide-white/10 md:mt-12 md:grid md:grid-cols-5 md:divide-x md:divide-y-0">
          {highlights.items.map((item, i) => (
            <Reveal
              key={item.label}
              delay={i * 0.05}
              className="px-0 py-6 first:pt-0 last:pb-0 md:px-6 md:py-0 md:first:pl-0 md:last:pr-0"
            >
              <p className="stat-value">{item.value}</p>
              <p className="stat-label">{item.label}</p>
              <p className="stat-detail">{item.detail}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
