import { Link } from "react-router-dom";
import Reveal from "./Reveal.jsx";
import { writing } from "../data/site.js";

export default function Writing() {
  return (
    <section id="writing" className="section border-t border-line bg-white">
      <Reveal>
        <span className="eyebrow">{writing.eyebrow}</span>
        <h2 className="mt-8 max-w-2xl text-statement serif text-ink">{writing.heading}</h2>
        <p className="mt-6 max-w-xl text-pretty leading-relaxed text-muted">{writing.intro}</p>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {writing.books.map((book, i) => (
          <BookCard key={book.slug} book={book} index={i} />
        ))}
      </div>

      <Reveal delay={0.15}>
        <p className="mt-10 text-sm italic text-muted">{writing.note}</p>
      </Reveal>
    </section>
  );
}

function BookCard({ book, index }) {
  return (
    <Link
      to={`/writing/${book.slug}`}
      className="group flex gap-5 rounded-2xl border border-line bg-canvas p-6 shadow-card transition hover:border-brand/30 hover:shadow-lift"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="grid h-20 w-16 shrink-0 place-items-center rounded-lg border border-line bg-white text-center">
        <span className="px-1 text-[8px] font-semibold uppercase tracking-widest text-brand">
          {book.kind}
        </span>
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base font-medium leading-snug text-ink group-hover:text-brand">
            {book.title}
          </h3>
          {book.status && (
            <span className="rounded-full border border-brand/20 bg-brand/5 px-2 py-0.5 text-[10px] text-brand">
              {book.status}
            </span>
          )}
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted">{book.description}</p>
        <span className="mt-3 inline-block text-xs font-medium text-brand">View book →</span>
      </div>
    </Link>
  );
}
