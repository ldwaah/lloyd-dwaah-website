import Reveal, { RevealLines } from "./Reveal.jsx";
import { ethos } from "../data/site.js";

export default function Ethos() {
  return (
    <section id="ethos" className="section border-t border-line bg-canvas">
      <Reveal>
        <span className="eyebrow">{ethos.eyebrow}</span>
      </Reveal>

      <RevealLines
        lines={ethos.statementLines}
        className="mt-8 text-statement"
        lineClassName="serif text-ink"
      />

      <Reveal delay={0.2}>
        <p className="mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-muted">
          {ethos.body}
        </p>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
        {ethos.principles.map((p, i) => (
          <Reveal
            key={p.title}
            delay={i * 0.1}
            className="rounded-2xl border border-line bg-white p-8 shadow-card"
          >
            <div className="font-serif text-2xl font-light text-brand/40">
              {String(i + 1).padStart(2, "0")}
            </div>
            <h3 className="mt-4 text-lg font-medium text-ink">{p.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{p.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
