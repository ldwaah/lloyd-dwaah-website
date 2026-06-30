import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { menuNav, meta, avatarConfig } from "../data/site.js";
import { StackedLogo } from "./BrandMark.jsx";
import MenuToggle from "./MenuToggle.jsx";
import TopographicLines from "./TopographicLines.jsx";

const ease = [0.22, 1, 0.36, 1];

function isActive(href) {
  const path = window.location.pathname;

  if (href === "/" || href === "/index.html") {
    return path === "/" || path.endsWith("/index.html");
  }
  return path.endsWith(href.replace(/^\//, ""));
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
          transition={{ duration: 0.5, ease }}
          className="fixed inset-0 z-[100]"
        >
          {/* Avatar backdrop */}
          <motion.div
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.05, opacity: 0 }}
            transition={{ duration: 0.7, ease }}
            className="absolute inset-0"
          >
            <img
              src={avatarConfig.image}
              alt=""
              className="h-full w-full object-cover object-[center_20%] opacity-25 blur-sm"
            />
            <div className="absolute inset-0 bg-hq/88" />
          </motion.div>
          <TopographicLines />

          <div className="relative flex h-full flex-col">
            <div className="flex items-center justify-between px-6 py-5 md:px-10">
              <StackedLogo />
              <MenuToggle open onClick={onClose} />
            </div>

            <nav className="flex flex-1 flex-col justify-end px-6 pb-16 md:justify-center md:px-10 md:pb-24">
              <ul className="space-y-2 md:space-y-4">
                {menuNav.map((item, i) => {
                  const active = isActive(item.href);
                  return (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, y: 72 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 40 }}
                      transition={{
                        duration: 0.65,
                        delay: 0.15 + i * 0.1,
                        ease,
                      }}
                    >
                      <a
                        href={item.href}
                        onClick={onClose}
                        className={`group relative block overflow-hidden py-1 font-sans text-[clamp(2.75rem,10vw,5.5rem)] font-bold uppercase leading-none tracking-tight transition-colors duration-300 ${
                          active ? "text-ink" : "text-ink/85 hover:text-accent"
                        }`}
                      >
                        <span className="relative z-10">{item.label}</span>
                        {active && <ActiveStrike />}
                        {!active && (
                          <span className="pointer-events-none absolute bottom-2 left-0 h-[3px] w-0 bg-accent transition-all duration-500 group-hover:w-[35%]" />
                        )}
                      </a>
                    </motion.li>
                  );
                })}
              </ul>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.6, ease }}
                className="mt-14 text-[10px] font-semibold uppercase tracking-[0.28em] text-muted"
              >
                {meta.since}
              </motion.p>
            </nav>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
