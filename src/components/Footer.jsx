import { Link } from "react-router-dom";
import { meta, nav } from "../data/site.js";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line bg-white py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-sm">
            <Link to="/" className="flex items-center gap-3">
              <span className="grid h-8 w-8 place-items-center rounded-full border border-line text-[11px] font-semibold text-brand">
                {meta.initials}
              </span>
              <span className="text-sm font-medium text-ink">{meta.name}</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Building environments where people can flourish across education,
              sport, technology, coaching and writing.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-muted transition-colors hover:text-brand"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 sm:flex-row">
          <p className="text-xs text-muted">
            © {year} {meta.name}. All rights reserved.
          </p>
          <p className="text-xs text-muted/80">Designed to evolve.</p>
        </div>
      </div>
    </footer>
  );
}
