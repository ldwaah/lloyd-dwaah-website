import { Link, Navigate, useParams } from "react-router-dom";
import { getBookBySlug, publications } from "../data/site.js";

const alignClass = {
  left: "mr-auto text-left",
  right: "ml-auto text-right",
};

function getYouTubeId(url) {
  if (!url) return null;
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/);
  return m ? m[1] : null;
}

export default function BookPage() {
  const { slug } = useParams();
  const book = getBookBySlug(slug);

  if (!book) {
    return <Navigate to="/#publications" replace />;
  }

  const sections = book.sections || [];
  const zigzagAligns = ["left", "right", "left"];
  const ytId = getYouTubeId(book.trailer);

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className="border-b border-line bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Link to="/" className="text-sm font-medium text-brand hover:text-brand-dark">
            ← Lloyd Dwaah
          </Link>
          <Link to="/#publications" className="text-sm text-muted hover:text-ink">
            All publications
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-14 md:py-20">
        <div className="flex flex-col items-center text-center">
          <div className="h-44 w-44 overflow-hidden rounded-2xl border border-line bg-white shadow-card md:h-52 md:w-52">
            <img
              src={publications.portrait.src}
              alt={publications.portrait.alt}
              className="h-full w-full object-cover object-top"
            />
          </div>
          <h1 className="mt-8 max-w-2xl font-serif text-3xl text-ink md:text-4xl">{book.title}</h1>
          {book.status && (
            <span
              className={`mt-3 rounded-full border px-3 py-1 text-xs font-medium ${
                book.status === "Not Available"
                  ? "border-line bg-canvas text-muted"
                  : "border-brand/25 bg-brand/5 text-brand"
              }`}
            >
              {book.status}
            </span>
          )}
          <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted">
            {book.description}
          </p>

          {(book.amazon || book.trailer) && (
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              {book.amazon && (
                <a
                  href={book.amazon}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
                >
                  Buy on Amazon
                </a>
              )}
              {book.trailer && (
                <a
                  href={book.trailer}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-line bg-white px-5 py-2.5 text-sm font-medium text-ink transition hover:border-brand/30 hover:text-brand"
                >
                  Watch the trailer
                </a>
              )}
            </div>
          )}
        </div>

        {ytId && (
          <div className="mt-14 md:mt-20">
            <h2 className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              Book trailer
            </h2>
            <div className="mx-auto mt-6 max-w-3xl overflow-hidden rounded-2xl border border-line bg-black shadow-card">
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${ytId}`}
                  title={`${book.title} — book trailer`}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}

        <div className="mt-16 space-y-10 md:mt-20 md:space-y-14">
          {sections.map((section, index) => {
            const align = zigzagAligns[index % zigzagAligns.length];
            return (
              <article
                key={section.title}
                className={`max-w-lg rounded-2xl border border-line bg-white p-7 shadow-card md:p-8 ${alignClass[align]}`}
              >
                <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                  {section.title}
                </h2>
                <p className="mt-4 text-pretty text-base leading-relaxed text-body">{section.body}</p>
              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
}
