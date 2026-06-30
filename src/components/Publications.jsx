import Reveal from "./Reveal.jsx";
import { publications } from "../data/site.js";

export default function Publications() {
  const { portrait } = publications;

  return (
    <section id="publications" className="section-dark border-t border-white/10">
      <div className="section">
        <div className="grid items-start gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-12">
          <Reveal className="lg:sticky lg:top-24">
            <span className="eyebrow">{publications.eyebrow}</span>
            <h2 className="mt-5 max-w-xl text-statement serif text-white">
              {publications.heading}
            </h2>
            <p className="mt-4 max-w-lg text-pretty leading-relaxed text-white/70">
              {publications.intro}
            </p>
            <figure className="mt-8">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-card">
                <img
                  src={portrait.src}
                  alt={portrait.alt}
                  className="aspect-[4/5] w-full object-cover object-top"
                  loading="lazy"
                />
              </div>
              <figcaption className="mt-3 text-[11px] font-medium uppercase tracking-[0.16em] text-white/55">
                {portrait.caption}
              </figcaption>
            </figure>
          </Reveal>

          <div>
            <div className="grid grid-cols-1 gap-4">
              {publications.books.map((book, i) => (
                <BookCard key={book.slug} book={book} index={i} />
              ))}
            </div>

            <Reveal delay={0.1}>
              <p className="mt-6 text-sm italic text-white/55">{publications.note}</p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function BookCard({ book, index }) {
  const hasLinks = book.amazon || book.trailer;

  return (
    <Reveal delay={index * 0.05}>
      <div className="group flex flex-col rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-white/20 hover:bg-white/[0.07]">
        <div className="flex flex-1 gap-4">
          <div className="grid h-16 w-14 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5 text-center">
            <span className="px-1 text-[7px] font-semibold uppercase tracking-widest text-white/70">
              {book.kind}
            </span>
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-medium leading-snug text-white">{book.title}</h3>
              {book.status && (
                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] ${
                    book.status === "Not Available"
                      ? "border-white/15 bg-white/5 text-white/50"
                      : "border-white/20 bg-white/10 text-white/80"
                  }`}
                >
                  {book.status}
                </span>
              )}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-white/65">{book.description}</p>
          </div>
        </div>

        {hasLinks && (
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-white/10 pt-3">
            {book.amazon && (
              <a
                href={book.amazon}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md bg-brand px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-dark"
              >
                Buy on Amazon
              </a>
            )}
            {book.trailer && (
              <a
                href={book.trailer}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white transition hover:border-white/30"
              >
                Trailer ↗
              </a>
            )}
          </div>
        )}
      </div>
    </Reveal>
  );
}
