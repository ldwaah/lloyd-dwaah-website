import { useState } from "react";
import { nav, meta, avatarConfig } from "../data/site.js";

function isActive(href) {
  const path = window.location.pathname;
  const hash = window.location.hash;

  if (href === "/" || href === "/index.html") {
    return path === "/" || path.endsWith("/index.html");
  }
  if (href === "#contact") {
    return hash === "#contact";
  }
  return path.endsWith(href.replace(/^\//, ""));
}

export default function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-white/95 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="/" className="group flex items-center gap-3">
          <img
            src={avatarConfig.image}
            alt=""
            aria-hidden="true"
            className="h-8 w-8 rounded-full border border-line object-cover"
          />
          <span className="text-sm font-medium text-ink">{meta.name}</span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className={`text-[13px] transition-colors ${
                  isActive(item.href)
                    ? "font-medium text-brand"
                    : "text-muted hover:text-ink"
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span className={`h-px w-6 bg-ink transition-all ${open ? "translate-y-[7px] rotate-45" : ""}`} />
          <span className={`h-px w-6 bg-ink transition-all ${open ? "opacity-0" : ""}`} />
          <span className={`h-px w-6 bg-ink transition-all ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
        </button>
      </nav>

      {open && (
        <ul className="border-t border-line bg-white px-6 md:hidden">
          {nav.map((item) => (
            <li key={item.href} className="border-b border-line last:border-0">
              <a
                href={item.href}
                onClick={() => setOpen(false)}
                className="block py-4 text-sm text-muted hover:text-brand"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
