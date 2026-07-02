/**
 * Deeper home-page scroll test through pinned sections.
 */
import { chromium, devices } from "playwright";

const url = process.argv.find((a) => a.startsWith("http")) || "http://localhost:5175/";
const mobile = process.argv.includes("--mobile");

async function getScrollY(page) {
  return page.evaluate(() => (window.__lenis ? window.__lenis.scroll : window.scrollY));
}

async function getScrollTriggerInfo(page) {
  return page.evaluate(() => {
    const triggers = window.ScrollTrigger?.getAll?.() || [];
    return triggers.map((t) => ({
      pin: !!t.pin,
      progress: t.progress?.toFixed?.(3),
      start: t.start,
      end: t.end,
      isActive: t.isActive,
    }));
  });
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = mobile
    ? await browser.newContext({ ...devices["iPhone 14"] })
    : await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => window.__lenis != null, null, { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(3000);

  const samples = [];
  let prevY = await getScrollY(page);

  // Heavy scroll through home
  for (let i = 0; i < 60; i++) {
    if (mobile) {
      await page.evaluate(() => {
        window.__lenis?.scrollTo(window.__lenis.scroll + 80, { immediate: false });
      });
    } else {
      await page.mouse.wheel(0, 120);
    }
    await page.waitForTimeout(80);
    const y = await getScrollY(page);
    if (i % 5 === 0) samples.push({ i, y, delta: y - prevY });
    // Detect bounce back
    if (y < prevY - 50 && i > 3) {
      console.log(`BOUNCE at step ${i}: ${Math.round(prevY)} -> ${Math.round(y)}`);
    }
    prevY = y;
  }

  await page.waitForTimeout(800);
  const finalY = await getScrollY(page);
  if (finalY < prevY - 40) {
    console.log(`SETTLE BOUNCE: peak ${Math.round(prevY)} -> final ${Math.round(finalY)}`);
  }

  const triggers = await getScrollTriggerInfo(page);
  console.log(`\n=== Home deep scroll (${mobile ? "mobile" : "desktop"}) ===`);
  console.log(`Final scroll: ${Math.round(finalY)}`);
  console.log("Samples:", samples.map((s) => `step${s.i}=${Math.round(s.y)}(+${Math.round(s.delta)})`).join(", "));
  console.log(`Pinned triggers: ${triggers.filter((t) => t.pin).length}`);
  triggers.filter((t) => t.pin).forEach((t, i) => console.log(`  pin${i}: progress=${t.progress} active=${t.isActive}`));

  await browser.close();
}

main().catch(console.error);
