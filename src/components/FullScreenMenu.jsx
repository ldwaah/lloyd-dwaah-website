import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { menuNav, contact, linkedInUrl } from "../data/site.js";
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
  if (href === "/#principles" || href === "#principles") {
    return (path === "/" || path.endsWith("/index.html")) && hash === "#principles";
  }
  return path.endsWith(href.replace(/^\//, "").split("#")[0]);
}

function ActiveStrike() {
  return (
    <svg
      className="pointer-events-none absolute left-1/2 top-1/2 w-full max-w-[min(100%,28rem)] -translate-x-1/2 -translate-y-1/2 text-accent"
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

function EmailIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0l-7.5-4.615a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
}

function LinkedInIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.126 0 2.063 2.063 0 01-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function SocialIcon({ href, label, children, external = false }) {
  return (
    <a
      href={href}
      aria-label={label}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="group flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 text-ink/75 transition-all duration-300 hover:border-accent/50 hover:text-accent hover:shadow-[0_0_20px_rgba(94,234,255,0.25)]"
    >
      <span className="transition-transform duration-300 group-hover:scale-110">{children}</span>
    </a>
  );
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
          <motion.button
            type="button"
            aria-label="Close menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease }}
            onClick={onClose}
            className="absolute inset-0 bg-hq/75 backdrop-blur-md"
          />

          <TopographicLines className="pointer-events-none opacity-[0.05]" />

          <div className="relative flex h-full flex-col pointer-events-none">
            <div className="pointer-events-auto flex items-center justify-between px-6 py-5 md:px-10">
              <StackedLogo />
              <MenuToggle open onClick={onClose} />
            </div>

            <nav
              className="pointer-events-auto absolute inset-0 flex flex-col items-center justify-center px-6"
              aria-label="Main menu"
            >
              <ul className="space-y-1 text-center md:space-y-3">
                {menuNav.map((item, i) => {
                  const active = isActive(item.href);
                  return (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, y: 48 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 24 }}
                      transition={{
                        duration: 0.6,
                        delay: 0.12 + i * 0.08,
                        ease,
                      }}
                    >
                      <a
                        href={item.href}
                        onClick={(e) => handleNavClick(e, item.href, onClose)}
                        className={`group relative inline-block overflow-hidden px-2 py-1 font-sans text-[clamp(2.25rem,8vw,4.75rem)] font-bold uppercase leading-[0.95] tracking-tight transition-all duration-300 ${
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
                          <span className="pointer-events-none absolute bottom-2 left-1/2 h-[3px] w-0 -translate-x-1/2 bg-accent transition-all duration-500 group-hover:w-[40%]" />
                        )}
                      </a>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ delay: 0.55, duration: 0.5, ease }}
              className="pointer-events-auto absolute inset-x-0 bottom-10 flex justify-center gap-4 md:bottom-12"
            >
              <SocialIcon href={`mailto:${contact.email}`} label="Email Lloyd Dwaah">
                <EmailIcon />
              </SocialIcon>
              <SocialIcon href={linkedInUrl} label="Lloyd Dwaah on LinkedIn" external>
                <LinkedInIcon />
              </SocialIcon>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
