/** Square menu toggle — two unequal lines (closed) or X (open). */
export default function MenuToggle({ open, onClick, className = "" }) {
  return (
    <button
      type="button"
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      onClick={onClick}
      className={`group relative flex h-11 w-11 items-center justify-center border border-ink/25 bg-transparent transition-all duration-300 hover:border-accent/50 hover:bg-white/[0.04] ${className}`}
    >
      {open ? (
        <>
          <span className="absolute block h-px w-5 rotate-45 bg-ink transition-colors group-hover:bg-accent" />
          <span className="absolute block h-px w-5 -rotate-45 bg-ink transition-colors group-hover:bg-accent" />
        </>
      ) : (
        <>
          <span className="absolute right-2.5 top-[13px] block h-px w-[calc(100%-20px)] bg-ink/90 transition-colors group-hover:bg-accent" />
          <span className="absolute bottom-[13px] right-2.5 block h-px w-[62%] bg-ink/90 transition-colors group-hover:bg-accent" />
        </>
      )}
    </button>
  );
}
