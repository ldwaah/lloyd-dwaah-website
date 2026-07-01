import { useEffect } from "react";
import SiteNav from "./SiteNav.jsx";
import SiteFooter from "./SiteFooter.jsx";
import AmbientBackground from "./AmbientBackground.jsx";
import { refreshScrollTriggersNow, scheduleScrollRefresh } from "../lib/gsap.js";

export default function PageShell({ children, ambient = "default" }) {
  useEffect(() => {
    requestAnimationFrame(() => refreshScrollTriggersNow());
    window.addEventListener("load", refreshScrollTriggersNow);

    return () => {
      window.removeEventListener("load", refreshScrollTriggersNow);
      scheduleScrollRefresh({ force: true });
    };
  }, []);
  return (
    <div className="relative min-h-screen bg-hq-deep">
      <AmbientBackground variant={ambient} />
      <SiteNav />
      <main className="relative z-10">{children}</main>
      <div className="relative z-10 shrink-0 bg-hq-deep">
        <SiteFooter />
      </div>
    </div>
  );
}
