import { useEffect, useId, useMemo, useRef } from "react";

function formatPeriod(entry) {
  return `${entry.startDate} - ${entry.endDate}`;
}

export default function HolisticCVModal({ open, onClose, cv }) {
  const titleId = useId();
  const panelRef = useRef(null);

  const entries = useMemo(
    () => [...cv.entries].sort((a, b) => a.sortStart.localeCompare(b.sortStart)),
    [cv.entries]
  );

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-navy/70 backdrop-blur-sm"
        aria-label="Close CV"
        onClick={onClose}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border border-line bg-white shadow-card sm:rounded-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
          <div>
            <p className="eyebrow">{cv.label}</p>
            <h2 id={titleId} className="mt-3 font-serif text-2xl text-ink md:text-3xl">
              {cv.heading}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{cv.intro}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg border border-line px-3 py-2 text-sm font-medium text-ink transition hover:border-brand/30 hover:text-brand"
            aria-label="Close"
          >
            Close
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5">
          <ol className="space-y-0 divide-y divide-line border-y border-line">
            {entries.map((entry) => (
              <li key={entry.id} className="py-5 first:pt-5 last:pb-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand/70">
                  {formatPeriod(entry)}
                </p>
                <h3 className="mt-2 text-lg font-medium text-ink">{entry.title}</h3>
                <p className="mt-1 text-sm text-muted">
                  {entry.href ? (
                    <a
                      href={entry.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand transition hover:underline"
                    >
                      {entry.organisation}
                    </a>
                  ) : (
                    entry.organisation
                  )}
                  {entry.instagram && (
                    <>
                      {" · "}
                      <a
                        href={entry.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand transition hover:underline"
                      >
                        Instagram
                      </a>
                    </>
                  )}
                </p>
                {entry.note && (
                  <p className="mt-2 text-sm leading-relaxed text-body">{entry.note}</p>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
