import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { nav, meta, avatarConfig } from "../data/site.js";
import { StackedLogo } from "./BrandMark.jsx";
import MenuToggle from "./MenuToggle.jsx";
import TopographicLines from "./TopographicLines.jsx";

const ease = [0.22, 1, 0.36, 1];

const COLLAGE = [
  { src: avatarConfig.image, tall: true },
  { src: "/assets/illustrations/business.svg", tall: false },
  { src: "/assets/illustrations/writing.svg", tall: false },
  { src: "/assets/illustrations/defi.svg", tall: true },
];

function isActive(href) {
  const path = window.location.pathname;
  const hash = window.location.hash;

  if (href === "/" || href === "/index.html") {
    return path === "/" || path.endsWith("/index.html");
  }
  if (href === "/#principles" || href === "#principles") {
    const onHome = path === "/" || path.endsWith("/index.html");
    return onHome && hash === "#principles";
  }
  if (href === "#contact" || href === "/#contact") {
    return hash === "#contact";
  }
  return path.endsWith(href.replace(/^\//, ""));
}

function resolveHref(href) {
  const path = window.location.pathname;
  const onHome = path === "/" || path.endsWith("/index.html");

  if (href === "/#principles" && onHome) return "#principles";
  if (href === "#contact") return "#contact";
  return href;
}

function ActiveStrike() {
  return (
    <svg
      className="pointer-events-none absolute left-0 top-1/2 w-full -translate-y-1/2 text-accent"
      viewBox="0 0 200 12"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0 6 C30 2, 50 10, 80 6 S130 2, 160 6 S190 10, 200 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function FullScreenMenu({ open, onClose }) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease }}
          className="fixed inset-0 z-[100]"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-hq"
          />
          <TopographicLines />

          <div className="relative flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 md:px-10">
              <StackedLogo />
              <MenuToggle open onClick={onClose} />
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col gap-10 overflow-y-auto px-6 pb-12 md:flex-row md:gap-16 md:px-10 md:pb-16">
              {/* Left collage */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease }}
                className="hidden w-full max-w-md shrink-0 md:grid md:grid-cols-2 md:gap-3"
              >
                {COLLAGE.map((item, i) => (
                  <div
                    key={item.src}
                    className={`overflow-hidden rounded-sm border border-line/40 bg-hq-deep/40 ${
                      item.tall ? "row-span-2 min-h-[200px]" : "min-h-[120px]"
                    } ${i % 2 === 1 ? "mt-8" : ""}`}
                  >
                    <img
                      src={item.src}
                      alt=""
                      className="h-full w-full object-cover opacity-80 grayscale-[30%] transition duration-500 hover:opacity-100 hover:grayscale-0"
                    />
                  </div>
                ))}
              </motion.div>

              {/* Right nav */}
              <nav className="flex flex-1 flex-col justify-center">
                <ul className="space-y-1 md:space-y-2">
                  {nav.map((item, i) => {
                    const active = isActive(item.href);
                    return (
                      <motion.li
                        key={item.href}
                        initial={{ opacity: 0, x: 32 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 16 }}
                        transition={{ duration: 0.5, delay: 0.12 + i * 0.07, ease }}
                      >
                        <a
                          href={resolveHref(item.href)}
                          onClick={onClose}
                          className={`group relative inline-block py-1 font-sans text-[clamp(2.25rem,7vw,4.5rem)] font-bold uppercase tracking-tight transition-colors duration-300 ${
                            active ? "text-ink" : "text-ink/90 hover:text-accent"
                          }`}
                        >
                          <span className="relative z-10">{item.label}</span>
                          {active && <ActiveStrike />}
                          {!active && (
                            <span className="pointer-events-none absolute left-0 top-1/2 h-[2px] w-0 max-w-full -translate-y-1/2 bg-accent transition-all duration-500 group-hover:w-[40%]" />
                          )}
                        </a>
                      </motion.li>
                    );
                  })}
                </ul>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.55, duration: 0.6 }}
                  className="mt-12 text-[10px] font-semibold uppercase tracking-[0.25em] text-muted"
                >
                  {meta.since} · {meta.name}
                </motion.p>
              </nav>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
