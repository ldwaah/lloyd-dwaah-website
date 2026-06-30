import PageShell from "../components/PageShell.jsx";
import { publications } from "../data/site.js";

export default function PublicationsPage() {
  return (
    <PageShell>
      <section className="section bg-white">
        <span className="eyebrow">{publications.eyebrow}</span>
        <h1 className="mt-5 max-w-2xl text-statement serif text-ink">{publications.heading}</h1>
      </section>

      <section className="border-t border-line bg-canvas">
        <div className="mx-auto max-w-3xl space-y-4 px-6 py-10 md:py-14">
          {publications.books.map((book) => {
            const hasLinks = book.amazon || book.trailer;
            return (
              <article
                key={book.slug}
                className="rounded-2xl border border-line bg-white p-5 shadow-card"
              >
                <div className="flex gap-4">
                  <div className="grid h-16 w-14 shrink-0 place-items-center rounded-lg border border-line bg-canvas text-center">
                    <span className="px-1 text-[7px] font-semibold uppercase tracking-widest text-brand">
                      {book.kind}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base font-medium text-ink">{book.title}</h2>
                      {book.status && (
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] ${
                            book.status === "Not Available"
                              ? "border-line bg-canvas text-muted"
                              : "border-brand/20 bg-brand/5 text-brand"
                          }`}
                        >
                          {book.status}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{book.description}</p>
                  </div>
                </div>

                {hasLinks && (
                  <div className="mt-3 flex flex-wrap gap-2 border-t border-line pt-3">
                    {book.amazon && (
                      <a
                        href={book.amazon}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex rounded-md bg-brand px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-dark"
                      >
                        Buy on Amazon
                      </a>
                    )}
                    {book.trailer && (
                      <a
                        href={book.trailer}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex rounded-md border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink hover:border-brand/30 hover:text-brand"
                      >
                        Trailer ↗
                      </a>
                    )}
                  </div>
                )}
              </article>
            );
          })}

          <p className="text-sm italic text-muted">{publications.note}</p>
        </div>
      </section>
    </PageShell>
  );
}
