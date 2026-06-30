import Reveal, { RevealLines } from "./Reveal.jsx";
import SectionIllustration from "./SectionIllustration.jsx";
import { ethos, sectionIllustrations } from "../data/site.js";

export default function Ethos() {
  const art = sectionIllustrations.ethos;

  return (
    <section id="ethos" className="section border-t border-line bg-canvas">
      <div className="grid items-start gap-10 lg:grid-cols-[1fr_0.85fr] lg:gap-14">
        <div>
          <Reveal>
            <span className="eyebrow">{ethos.eyebrow}</span>
          </Reveal>

          <RevealLines
            lines={ethos.statementLines}
            className="mt-6 text-statement"
            lineClassName="serif text-ink"
          />

          <Reveal delay={0.15}>
            <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted md:text-lg">
              {ethos.body}
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="flex justify-center lg:justify-end">
          <SectionIllustration
            src={art.src}
            alt={art.alt}
            caption={art.caption}
            size="large"
          />
        </Reveal>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
        {ethos.principles.map((p, i) => (
          <Reveal
            key={p.title}
            delay={i * 0.08}
            className="rounded-2xl border border-line bg-white p-6 shadow-card md:p-7"
          >
            <div className="font-serif text-2xl font-light text-brand/40">
              {String(i + 1).padStart(2, "0")}
            </div>
            <h3 className="mt-3 text-lg font-medium text-ink">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{p.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
