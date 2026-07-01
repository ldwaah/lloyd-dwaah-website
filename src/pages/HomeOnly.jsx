import { useEffect, useState } from "react";
import PageWithPreloader from "../components/PageWithPreloader.jsx";
import HomeCinematic from "../components/HomeCinematic.jsx";
import CorePrinciples from "../components/CorePrinciples.jsx";
import PartnerMarquee from "../components/PartnerMarquee.jsx";
import HomeFooterChapter from "../components/HomeFooterChapter.jsx";
import { resetScrollPosition } from "../lib/scrollReset.js";

export default function HomeOnly() {
  const [sceneReady, setSceneReady] = useState(false);

  useEffect(() => {
    resetScrollPosition();
  }, []);

  return (
    <PageWithPreloader variant="home" sceneReady={sceneReady}>
      <div className="relative min-h-screen overflow-x-hidden bg-hq-deep text-ink">
        <HomeCinematic onPortraitReady={() => setSceneReady(true)} />
        <CorePrinciples />
        <PartnerMarquee />
        <HomeFooterChapter />
      </div>
    </PageWithPreloader>
  );
}
