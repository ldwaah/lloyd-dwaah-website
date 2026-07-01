import { useEffect, useState } from "react";
import SiteFooter from "../components/SiteFooter.jsx";
import Preloader, { hasSeenHomePreloader } from "../components/Preloader.jsx";
import HomeCinematic from "../components/HomeCinematic.jsx";
import PartnerMarquee from "../components/PartnerMarquee.jsx";
import CorePrinciples from "../components/CorePrinciples.jsx";
import { resetScrollPosition } from "../lib/scrollReset.js";

export default function HomeOnly() {
  const [booted, setBooted] = useState(hasSeenHomePreloader());
  const [preloaderActive, setPreloaderActive] = useState(!hasSeenHomePreloader());
  const [sceneReady, setSceneReady] = useState(false);

  useEffect(() => {
    resetScrollPosition();
    if (hasSeenHomePreloader()) {
      setBooted(true);
      setPreloaderActive(false);
    }
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-hq-deep text-ink">
      <Preloader
        active={preloaderActive}
        sceneReady={sceneReady}
        onComplete={() => {
          resetScrollPosition();
          setPreloaderActive(false);
          setBooted(true);
        }}
      />

      <div className={booted ? "opacity-100" : "opacity-100"}>
        <HomeCinematic onPortraitReady={() => setSceneReady(true)} />
        <CorePrinciples />
        <PartnerMarquee />
        <div className="relative z-10 shrink-0 bg-hq-deep">
          <SiteFooter />
        </div>
      </div>
    </div>
  );
}
