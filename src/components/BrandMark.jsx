import { meta } from "../data/site.js";

export function StackedLogo({ className = "" }) {
  const [first, ...rest] = meta.name.split(" ");
  const last = rest.join(" ");

  return (
    <a
      href="/"
      className={`group inline-flex flex-col leading-[0.95] transition-opacity hover:opacity-85 ${className}`}
      aria-label={meta.name}
    >
      <span className="font-serif text-[13px] font-light tracking-[0.18em] text-ink/90 md:text-sm">
        {first.toUpperCase()}
      </span>
      <span className="mt-1.5 block h-px w-0 bg-accent/60 transition-all duration-500 group-hover:w-full" />
      <span className="mt-1.5 font-sans text-[10px] font-bold tracking-[0.32em] text-ink/90 md:text-[11px]">
        {last.toUpperCase()}
      </span>
    </a>
  );
}

export function CenterEmblem({ src, className = "" }) {
  return (
    <span
      className={`pointer-events-none absolute left-1/2 top-5 -translate-x-1/2 md:top-6 ${className}`}
      aria-hidden="true"
    >
      <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-full md:h-10 md:w-10">
        <span className="absolute inset-0 rounded-full bg-accent/20 blur-md" />
        <span className="relative grid h-full w-full place-items-center overflow-hidden rounded-full border border-accent/30 bg-hq-deep/60 backdrop-blur-sm ring-1 ring-white/10">
          <img src={src} alt="" className="h-full w-full object-cover" />
        </span>
      </span>
    </span>
  );
}
