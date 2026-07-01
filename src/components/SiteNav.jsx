import { useState } from "react";
import { StackedLogo } from "./BrandMark.jsx";
import MenuToggle from "./MenuToggle.jsx";
import FullScreenMenu from "./FullScreenMenu.jsx";
import { linkedInUrl } from "../data/site.js";

function LinkedInIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.126 0 2.063 2.063 0 01-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export default function SiteNav({ overlay = false }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header
        className={
          overlay
            ? "absolute inset-x-0 top-0 z-20 bg-transparent"
            : "sticky top-0 z-[200] border-b border-line/40 bg-hq-deep/95 backdrop-blur-md"
        }
      >
        <nav className="relative mx-auto flex max-w-7xl items-center px-6 py-5 md:px-10 md:py-6">
          <StackedLogo
            className={`shrink-0 ${overlay ? "drop-shadow-[0_1px_12px_rgba(0,0,0,0.45)]" : ""}`}
          />

          {!overlay && (
            <a
              href={linkedInUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Lloyd Dwaah on LinkedIn"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-ink transition-colors duration-300 hover:text-accent"
            >
              <LinkedInIcon />
            </a>
          )}

          <div className="ml-auto shrink-0">
            <MenuToggle
              open={menuOpen}
              onClick={() => setMenuOpen((prev) => !prev)}
              className={
                overlay
                  ? "border-ink/35 bg-hq/25 backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.25)]"
                  : ""
              }
            />
          </div>
        </nav>
      </header>

      <FullScreenMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
