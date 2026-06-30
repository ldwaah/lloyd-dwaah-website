import Reveal, { RevealLines } from "./Reveal.jsx";
import { horizon } from "../data/site.js";

function chunk(text, perLine) {
  const words = text.split(" ");
  const lines = [];
  for (let i = 0; i < words.length; i += perLine) {
    lines.push(words.slice(i, i + perLine).join(" "));
  }
  return lines;
}

export default function Horizon() {
  const lines = chunk(horizon.statement, 6);

  return (
    <section className="border-t border-line bg-white py-16 md:py-20">
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <span className="eyebrow justify-center">{horizon.eyebrow}</span>
        <RevealLines
          lines={lines}
          className="mt-8 text-statement"
          lineClassName="serif text-ink"
        />
        <Reveal delay={0.15}>
          <p className="mt-8 text-pretty text-muted">{horizon.sub}</p>
        </Reveal>
      </div>
    </section>
  );
}
