import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { nav, meta, avatarConfig } from "../data/site.js";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const location = useLocation();
  const onHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!onHome) return;
    const ids = nav.map((n) => n.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [onHome]);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-line bg-white/95 shadow-sm backdrop-blur-sm"
          : "border-b border-transparent bg-white/80 backdrop-blur-sm"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="group flex items-center gap-3">
          <img
            src={avatarConfig.image}
            alt=""
            aria-hidden="true"
            className="h-8 w-8 rounded-full border border-line object-cover transition-colors group-hover:border-brand/40"
          />
          <span className="text-sm font-medium text-ink">{meta.name}</span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {nav.map((item) => {
            const id = item.href.slice(1);
            const isActive = onHome && active === id;
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`text-[13px] transition-colors duration-200 ${
                    isActive ? "font-medium text-brand" : "text-muted hover:text-ink"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span className={`h-px w-6 bg-ink transition-all duration-300 ${open ? "translate-y-[7px] rotate-45" : ""}`} />
          <span className={`h-px w-6 bg-ink transition-all duration-300 ${open ? "opacity-0" : ""}`} />
          <span className={`h-px w-6 bg-ink transition-all duration-300 ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-line bg-white px-6 md:hidden"
          >
            {nav.map((item) => (
              <li key={item.href} className="border-b border-line last:border-0">
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-4 text-sm text-muted transition-colors hover:text-brand"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
