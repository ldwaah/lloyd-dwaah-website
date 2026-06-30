import { meta } from "../data/site.js";

export function StackedLogo({ className = "", light = true }) {
  const [first, ...rest] = meta.name.toUpperCase().split(" ");
  const last = rest.join(" ") || "";

  return (
    <a
      href="/"
      className={`inline-flex flex-col leading-none transition-opacity hover:opacity-80 ${className}`}
      aria-label={meta.name}
    >
      <span
        className={`text-[11px] font-bold tracking-[0.22em] md:text-xs ${
          light ? "text-ink" : "text-ink"
        }`}
      >
        {first}
      </span>
      {last && (
        <span
          className={`mt-1 text-[11px] font-bold tracking-[0.22em] md:text-xs ${
            light ? "text-ink" : "text-ink"
          }`}
        >
          {last}
        </span>
      )}
    </a>
  );
}

export function CenterEmblem({ src, className = "" }) {
  return (
    <span
      className={`pointer-events-none absolute left-1/2 top-5 -translate-x-1/2 md:top-6 ${className}`}
      aria-hidden="true"
    >
      <span className="grid h-8 w-8 place-items-center overflow-hidden rounded-full border border-line/80 bg-hq-deep/50 backdrop-blur-sm md:h-9 md:w-9">
        <img src={src} alt="" className="h-full w-full object-cover opacity-90" />
      </span>
    </span>
  );
}
