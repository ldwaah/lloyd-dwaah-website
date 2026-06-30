import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { menuNav, meta, avatarConfig } from "../data/site.js";
import { StackedLogo } from "./BrandMark.jsx";
import MenuToggle from "./MenuToggle.jsx";
import TopographicLines from "./TopographicLines.jsx";

const ease = [0.22, 1, 0.36, 1];

function isActive(href) {
  const path = window.location.pathname;
  const hash = window.location.hash;

  if (href === "/" || href === "/index.html") {
    return path === "/" || path.endsWith("/index.html");
  }
  if (href === "#contact") return hash === "#contact";
  if (href === "/#principles" || href === "#principles") {
    return (path === "/" || path.endsWith("/index.html")) && hash === "#principles";
  }
  return path.endsWith(href.replace(/^\//, "").split("#")[0]);
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

function handleNavClick(e, href, onClose) {
  const onHome =
    window.location.pathname === "/" || window.location.pathname.endsWith("/index.html");

  if (href === "#contact" && onHome) {
    e.preventDefault();
    onClose();
    requestAnimationFrame(() => {
      document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
    });
    return;
  }

  if ((href === "/#principles" || href === "#principles") && onHome) {
    e.preventDefault();
    onClose();
    requestAnimationFrame(() => {
      document.querySelector("#principles")?.scrollIntoView({ behavior: "smooth" });
    });
    return;
  }

  onClose();
}

export default function FullScreenMenu({ open, onClose }) {
  const panelRef = useRef(null);

  const trapFocus = useCallback(
    (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timer = window.setTimeout(() => {
      const first = panelRef.current?.querySelector("a[href]");
      first?.focus();
    }, 120);

    window.addEventListener("keydown", trapFocus);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", trapFocus);
      window.clearTimeout(timer);
    };
  }, [open, trapFocus]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease }}
          className="fixed inset-0 z-[200]"
        >
          {/* Backdrop — click outside nav content to close */}
          <motion.button
            type="button"
            aria-label="Close menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease }}
            onClick={onClose}
            className="absolute inset-0 bg-hq/70 backdrop-blur-md"
          />

          {/* Avatar atmosphere behind menu */}
          <motion.div
            initial={{ scale: 1.06, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.04, opacity: 0 }}
            transition={{ duration: 0.65, ease }}
            className="pointer-events-none absolute inset-0 overflow-hidden"
            aria-hidden="true"
          >
            <img
              src={avatarConfig.image}
              alt=""
              className="h-full w-full object-cover object-[center_20%] opacity-20 blur-md"
            />
            <div className="absolute inset-0 bg-hq/85" />
          </motion.div>
          <TopographicLines className="pointer-events-none opacity-[0.05]" />

          <div className="relative flex h-full flex-col pointer-events-none">
            <div className="pointer-events-auto flex items-center justify-between px-6 py-5 md:px-10">
              <StackedLogo />
              <MenuToggle open onClick={onClose} />
            </div>

            <nav
              className="pointer-events-auto relative flex flex-1 flex-col justify-end px-6 pb-16 md:justify-center md:px-10 md:pb-24"
              aria-label="Main menu"
            >
              <ul className="space-y-1 md:space-y-3">
                {menuNav.map((item, i) => {
                  const active = isActive(item.href);
                  return (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, y: 64 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 32 }}
                      transition={{
                        duration: 0.6,
                        delay: 0.12 + i * 0.08,
                        ease,
                      }}
                    >
                      <a
                        href={item.href}
                        onClick={(e) => handleNavClick(e, item.href, onClose)}
                        className={`group relative block overflow-hidden py-1 font-sans text-[clamp(2.5rem,9vw,5.25rem)] font-bold uppercase leading-[0.95] tracking-tight transition-all duration-300 ${
                          active
                            ? "text-ink"
                            : "text-ink/85 hover:text-accent hover:drop-shadow-[0_0_24px_rgba(94,234,255,0.35)]"
                        }`}
                      >
                        <span className="relative z-10 inline-block transition-transform duration-300 group-hover:scale-[1.02]">
                          {item.label}
                        </span>
                        {active && <ActiveStrike />}
                        {!active && (
                          <span className="pointer-events-none absolute bottom-2 left-0 h-[3px] w-0 bg-accent transition-all duration-500 group-hover:w-[40%]" />
                        )}
                      </a>
                    </motion.li>
                  );
                })}
              </ul>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.55, ease }}
                className="mt-12 text-[10px] font-semibold uppercase tracking-[0.28em] text-muted"
              >
                {meta.since}
              </motion.p>
            </nav>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
