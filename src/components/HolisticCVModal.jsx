import { useEffect, useId, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6"
          role="presentation"
        >
          <button
            type="button"
            className="absolute inset-0 bg-hq-darker/80 backdrop-blur-md"
            aria-label="Close CV"
            onClick={onClose}
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-line glass-panel sm:rounded-3xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-line px-8 py-6">
              <div>
                <span className="eyebrow">{cv.label}</span>
                <h2 id={titleId} className="mt-4 font-serif text-2xl text-ink md:text-3xl">
                  {cv.heading}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{cv.intro}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="btn-ghost shrink-0 px-4 py-2 text-xs"
                aria-label="Close"
              >
                Close
              </button>
            </div>

            <div className="overflow-y-auto px-8 py-6">
              <ol className="space-y-0">
                {entries.map((entry, i) => (
                  <li
                    key={entry.id}
                    className="border-t border-line py-6 first:border-t-0 first:pt-0"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent/70">
                      {formatPeriod(entry)}
                    </p>
                    <h3 className="mt-3 font-serif text-xl text-ink">{entry.title}</h3>
                    <p className="mt-1 text-sm text-muted">
                      {entry.href ? (
                        <a
                          href={entry.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent transition hover:underline"
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
                            className="text-accent transition hover:underline"
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
