import { motion } from "framer-motion";
import SiteNav from "./SiteNav.jsx";
import SiteFooter from "./SiteFooter.jsx";
import AmbientBackground from "./AmbientBackground.jsx";

export default function PageShell({
  children,
  ambient = "default",
  navTransparent = false,
}) {
  return (
    <div className="relative min-h-screen">
      <AmbientBackground variant={ambient} />
      <div className="page-enter relative z-10">
        <SiteNav transparent={navTransparent} />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="pt-20"
        >
          {children}
        </motion.main>
        <SiteFooter />
      </div>
    </div>
  );
}
