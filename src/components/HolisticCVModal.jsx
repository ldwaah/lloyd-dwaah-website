import { useEffect, useId, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

function formatPeriod(entry) {
  return `${entry.startDate} - ${entry.endDate}`;
}

function LinkIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
    </svg>
  );
}

function InstagramIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3h9A4.5 4.5 0 0121 7.5v9a4.5 4.5 0 01-4.5 4.5h-9A4.5 4.5 0 013 16.5v-9A4.5 4.5 0 017.5 3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75h.008v.008h-.008V6.75z" />
    </svg>
  );
}

function EntryLinkIcon({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ink/20 text-ink/70 transition-all duration-300 hover:border-accent/50 hover:text-accent hover:shadow-[0_0_16px_rgba(94,234,255,0.2)]"
    >
      {children}
    </a>
  );
}

function EntryLinks({ entry }) {
  if (!entry.href && !entry.instagram) return null;

  return (
    <div className="mt-2 flex items-center gap-2">
      {entry.href && (
        <EntryLinkIcon href={entry.href} label={`Visit ${entry.organisation} website`}>
          <LinkIcon />
        </EntryLinkIcon>
      )}
      {entry.instagram && (
        <EntryLinkIcon href={entry.instagram} label={`${entry.organisation} on Instagram`}>
          <InstagramIcon />
        </EntryLinkIcon>
      )}
    </div>
  );
}

export default function HolisticCVModal({ open, onClose, cv }) {
  const titleId = useId();
  const panelRef = useRef(null);
  const scrollRef = useRef(null);

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

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center sm:p-6"
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
            className="relative flex h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-line glass-panel sm:h-auto sm:max-h-[min(85dvh,720px)] sm:rounded-3xl"
          >
            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-line px-6 py-5 sm:px-8 sm:py-6">
              <div className="min-w-0 pr-2">
                <h2 id={titleId} className="font-serif text-2xl text-ink md:text-3xl">
                  My Holistic CV
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

            <div
              ref={scrollRef}
              className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-6 py-5 sm:px-8 sm:py-6"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              <ol className="space-y-0">
                {entries.map((entry) => (
                  <li
                    key={entry.id}
                    className="border-t border-line py-6 first:border-t-0 first:pt-0"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent/70">
                      {formatPeriod(entry)}
                    </p>
                    <h3 className="mt-3 font-serif text-xl text-ink">{entry.title}</h3>
                    <p className="mt-1 text-sm text-muted">{entry.organisation}</p>
                    <EntryLinks entry={entry} />
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
    </AnimatePresence>,
    document.body
  );
}
