import { motion } from "framer-motion";
import SiteNav from "./SiteNav.jsx";
import SiteFooter from "./SiteFooter.jsx";
import AmbientBackground from "./AmbientBackground.jsx";
import { prefersReducedMotion } from "../lib/input.js";

export default function PageShell({
  children,
  ambient = "default",
  navTransparent = false,
}) {
  const reduced = prefersReducedMotion();

  return (
    <div className="relative min-h-screen">
      <AmbientBackground variant={ambient} />
      <div className="page-enter relative z-10">
        <SiteNav transparent={navTransparent} />
        <motion.main
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0 : 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="pt-20"
        >
          {children}
        </motion.main>
        <SiteFooter />
      </div>
    </div>
  );
}
