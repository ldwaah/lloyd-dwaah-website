import { Link, Navigate, useParams } from "react-router-dom";
import { getBookBySlug } from "../data/site.js";

const alignClass = {
  left: "mr-auto text-left",
  right: "ml-auto text-right",
};

export default function BookPage() {
  const { slug } = useParams();
  const book = getBookBySlug(slug);

  if (!book) {
    return <Navigate to="/#writing" replace />;
  }

  const sections = book.sections || [];
  const zigzagAligns = ["left", "right", "left"];

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className="border-b border-line bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Link to="/" className="text-sm font-medium text-brand hover:text-brand-dark">
            ← Lloyd Dwaah
          </Link>
          <Link to="/#writing" className="text-sm text-muted hover:text-ink">
            All books
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-14 md:py-20">
        {/* Centered square hero */}
        <div className="flex flex-col items-center text-center">
          <div className="grid h-44 w-44 place-items-center rounded-2xl border border-line bg-white shadow-card md:h-52 md:w-52">
            <div className="px-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand">
                {book.kind}
              </p>
              <p className="mt-3 font-serif text-lg leading-snug text-ink">{book.title}</p>
            </div>
          </div>
          <h1 className="mt-8 max-w-2xl font-serif text-3xl text-ink md:text-4xl">{book.title}</h1>
          {book.status && (
            <span className="mt-3 rounded-full border border-brand/25 bg-brand/5 px-3 py-1 text-xs font-medium text-brand">
              {book.status}
            </span>
          )}
          <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted">
            {book.description}
          </p>
        </div>

        {/* Zigzag: left → right → left */}
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
