import { Link } from "react-router-dom";
import Reveal from "./Reveal.jsx";
import SectionIllustration from "./SectionIllustration.jsx";
import { writing, sectionIllustrations } from "../data/site.js";

export default function Writing() {
  const art = sectionIllustrations.writing;

  return (
    <section id="writing" className="section border-t border-line bg-white">
      <div className="grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
        <Reveal className="lg:sticky lg:top-24">
          <span className="eyebrow">{writing.eyebrow}</span>
          <h2 className="mt-5 max-w-xl text-statement serif text-ink">{writing.heading}</h2>
          <p className="mt-4 max-w-lg text-pretty leading-relaxed text-muted">{writing.intro}</p>
          <div className="mt-8">
            <SectionIllustration
              src={art.src}
              alt={art.alt}
              caption={art.caption}
              size="large"
              className="items-start"
            />
          </div>
        </Reveal>

        <div>
          <div className="grid grid-cols-1 gap-4">
            {writing.books.map((book, i) => (
              <BookCard key={book.slug} book={book} index={i} />
            ))}
          </div>

          <Reveal delay={0.1}>
            <p className="mt-6 text-sm italic text-muted">{writing.note}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function BookCard({ book, index }) {
  const hasLinks = book.amazon || book.trailer;
  return (
    <Reveal delay={index * 0.05}>
      <div className="group flex flex-col rounded-2xl border border-line bg-canvas p-5 shadow-card transition hover:border-brand/30 hover:shadow-lift">
        <Link to={`/writing/${book.slug}`} className="flex flex-1 gap-4">
          <div className="grid h-16 w-14 shrink-0 place-items-center rounded-lg border border-line bg-white text-center">
            <span className="px-1 text-[7px] font-semibold uppercase tracking-widest text-brand">
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
            <span className="mt-2 inline-block text-xs font-medium text-brand">View book →</span>
          </div>
        </Link>

        {hasLinks && (
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-line pt-3">
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
                className="inline-flex items-center gap-1.5 rounded-md border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink transition hover:border-brand/30 hover:text-brand"
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
