import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { menuNav, contact } from "../data/site.js";
import { StackedLogo } from "./BrandMark.jsx";
import MenuToggle from "./MenuToggle.jsx";
import TopographicLines from "./TopographicLines.jsx";
import { scrollToTarget } from "../lib/scroll.js";
import { navigateWithTransition, isInternalNavLink } from "../lib/pageTransition.js";
import { zoomFromNavLink } from "../lib/navZoomTransition.js";
import { splitElementChars, resetSplitChars } from "../lib/splitText.js";
import { EmailIcon, LinkedInIcon, SocialIconLink } from "./SocialIcons.jsx";

const ease = [0.22, 1, 0.36, 1];

function normalizePath(path) {
  return path.replace(/\/index\.html$/i, "/").replace(/\.html$/i, "") || "/";
}

function isActive(href) {
  const path = normalizePath(window.location.pathname);
  const hash = window.location.hash;
  const target = href.split("#")[0] || "/";
  const targetPath = normalizePath(target === "" ? "/" : target);
  const targetHash = href.includes("#") ? `#${href.split("#")[1]}` : "";

  if (targetPath === "/" && !targetHash) {
    return path === "/";
  }
  if (targetHash === "#principles" || href === "/#principles" || href === "#principles") {
    return path === "/" && hash === "#principles";
  }
  return path === targetPath;
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

function MenuNavLink({ item, index, open, onClose }) {
  const labelRef = useRef(null);
  const linkRef = useRef(null);

  useEffect(() => {
    const label = labelRef.current;
    if (!label) return undefined;

    if (!open) {
      resetSplitChars(label);
      label.textContent = item.label;
      return undefined;
    }

    resetSplitChars(label);
    label.textContent = item.label;
    const chars = splitElementChars(label);
    gsap.set(chars, { y: "115%", opacity: 0, rotateX: -42, transformOrigin: "50% 100%" });
    gsap.to(chars, {
      y: "0%",
      opacity: 1,
      rotateX: 0,
      duration: 0.55,
      stagger: 0.022,
      delay: 0.1 + index * 0.09,
      ease: [0.22, 1, 0.36, 1],
    });

    return () => {
      gsap.killTweensOf(chars);
    };
  }, [open, index, item.label]);

  const handleClick = (e) => {
    const onHome = normalizePath(window.location.pathname) === "/";

    if ((item.href === "/#principles" || item.href === "#principles") && onHome) {
      e.preventDefault();
      onClose();
      requestAnimationFrame(() => {
        scrollToTarget("#principles", { offset: -72 });
      });
      return;
    }

    const anchor = linkRef.current;
    if (anchor && isInternalNavLink(anchor)) {
      e.preventDefault();
      onClose();
      zoomFromNavLink(anchor, () => {
        navigateWithTransition(anchor.href, { delay: 60 });
      });
      return;
    }

    onClose();
  };

  const active = isActive(item.href);

  return (
    <li>
      <a
        ref={linkRef}
        href={item.href}
        onClick={handleClick}
        className={`group relative inline-block overflow-hidden px-2 py-1 font-sans text-[clamp(2.25rem,8vw,4.75rem)] font-bold uppercase leading-[0.95] tracking-tight transition-colors duration-300 ${
          active
            ? "text-ink"
            : "text-ink/85 hover:text-accent hover:drop-shadow-[0_0_24px_rgba(94,234,255,0.35)]"
        }`}
      >
        <span
          ref={labelRef}
          className="relative z-10 inline-block overflow-hidden"
          style={{ perspective: "600px" }}
        >
          {item.label}
        </span>
        {active && <ActiveStrike />}
        {!active && (
          <span className="pointer-events-none absolute bottom-2 left-1/2 h-[3px] w-0 -translate-x-1/2 bg-accent transition-all duration-500 group-hover:w-[40%]" />
        )}
      </a>
    </li>
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
    }, 200);

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
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.99 }}
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
                {menuNav.map((item, i) => (
                  <MenuNavLink key={item.href} item={item} index={i} open={open} onClose={onClose} />
                ))}
              </ul>
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ delay: 0.55, duration: 0.5, ease }}
              className="pointer-events-auto absolute inset-x-0 bottom-10 flex justify-center gap-4 md:bottom-12"
            >
              <SocialIconLink href={`mailto:${contact.email}`} label="Email Lloyd Dwaah">
                <EmailIcon />
              </SocialIconLink>
              <SocialIconLink href={contact.linkedin} label="Lloyd Dwaah on LinkedIn" external>
                <LinkedInIcon />
              </SocialIconLink>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
