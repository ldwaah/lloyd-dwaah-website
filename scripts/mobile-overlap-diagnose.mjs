/**
 * Mobile overlap diagnostic — checks portrait vs text bounding boxes at mid-scroll.
 */
import { chromium, devices } from "playwright";

const url = process.argv.find((a) => a.startsWith("http")) || "http://localhost:5175/";

async function getOverlapInfo(page) {
  return page.evaluate(() => {
    const portrait = document.querySelector(".hero-portrait-video, img[alt='']");
    const stage = portrait?.closest("[class*='will-change-transform']") || portrait?.parentElement;
    const ethosLines = [...document.querySelectorAll("section p")].filter((p) =>
      p.textContent?.includes("great leadership")
    );
    const heroText = document.querySelector("#home p.font-serif");

    const rect = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { top: r.top, bottom: r.bottom, left: r.left, right: r.right, h: r.height, w: r.width };
    };

    const overlaps = (a, b) => {
      if (!a || !b) return false;
      return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
    };

    const stageR = rect(stage);
    const heroR = rect(heroText);
    const ethosR = rect(ethosLines[0]);

    return {
      scroll: window.__lenis?.scroll ?? window.scrollY,
      stage: stageR,
      heroText: heroR,
      ethos: ethosR,
      stageHeroOverlap: overlaps(stageR, heroR),
      stageEthosOverlap: overlaps(stageR, ethosR),
      viewport: { w: window.innerWidth, h: window.innerHeight },
    };
  });
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ...devices["iPhone 14"] });
  const page = await context.newPage();

  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForFunction(() => window.__lenis != null, null, { timeout: 15000 }).catch(() => {});
  // Wait for preloader
  await page.waitForFunction(
    () => !document.querySelector('[class*="z-[300]"]') || document.querySelector('[class*="z-[300]"]')?.style?.display === "none",
    null,
    { timeout: 20000 }
  ).catch(() => {});
  await page.waitForTimeout(4000);

  const checkpoints = [0, 400, 800, 1200, 1600, 2000];
  console.log("\n=== Mobile overlap diagnostic (390x844) ===\n");

  for (const target of checkpoints) {
    await page.evaluate((y) => {
      window.__lenis?.scrollTo(y, { immediate: true });
    }, target);
    await page.waitForTimeout(400);
    const info = await getOverlapInfo(page);
    console.log(`scroll=${target} actual=${Math.round(info.scroll)}`);
    console.log(`  stage: ${info.stage ? `top=${Math.round(info.stage.top)} h=${Math.round(info.stage.h)}` : "none"}`);
    console.log(`  heroText: ${info.heroText ? `top=${Math.round(info.heroText.top)} bottom=${Math.round(info.heroText.bottom)}` : "none"}`);
    console.log(`  ethos: ${info.ethos ? `top=${Math.round(info.ethos.top)} bottom=${Math.round(info.ethos.bottom)}` : "none"}`);
    console.log(`  OVERLAP hero=${info.stageHeroOverlap} ethos=${info.stageEthosOverlap}`);
    if (info.stageHeroOverlap || info.stageEthosOverlap) {
      await page.screenshot({ path: `/tmp/overlap-${target}.png`, fullPage: false });
      console.log(`  screenshot: /tmp/overlap-${target}.png`);
    }
    console.log();
  }

  await browser.close();
}

main().catch(console.error);
