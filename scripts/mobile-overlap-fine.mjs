/**
 * Fine-grained mobile overlap scan — every 100px through hero + ethos.
 */
import { chromium, devices } from "playwright";

const url = process.argv.find((a) => a.startsWith("http")) || "http://localhost:5175/";

async function scan(page) {
  return page.evaluate(() => {
    const stage = document.querySelector("[class*='will-change-transform']");
    const stageR = stage?.getBoundingClientRect();
    if (!stageR) return { overlaps: [] };

    const texts = [...document.querySelectorAll("p, h1, h2, h3")].filter((el) => {
      const r = el.getBoundingClientRect();
      return r.height > 0 && r.width > 0 && r.bottom > 0 && r.top < window.innerHeight;
    });

    const overlaps = [];
    for (const el of texts) {
      const r = el.getBoundingClientRect();
      const hit =
        stageR.right > r.left &&
        stageR.left < r.right &&
        stageR.bottom > r.top &&
        stageR.top < r.bottom;
      if (hit) {
        overlaps.push({
          text: el.textContent?.slice(0, 50),
          textTop: Math.round(r.top),
          textBottom: Math.round(r.bottom),
          stageTop: Math.round(stageR.top),
          stageBottom: Math.round(stageR.bottom),
        });
      }
    }
    return {
      scroll: Math.round(window.__lenis?.scroll ?? window.scrollY),
      stageTop: Math.round(stageR.top),
      stageBottom: Math.round(stageR.bottom),
      overlaps,
    };
  });
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await (await browser.newContext({ ...devices["iPhone 14"] })).newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForFunction(() => window.__lenis != null, null, { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(5000);

  console.log("\n=== Fine overlap scan ===\n");
  for (let y = 0; y <= 2500; y += 100) {
    await page.evaluate((yy) => window.__lenis?.scrollTo(yy, { immediate: true }), y);
    await page.waitForTimeout(200);
    const { scroll, stageTop, stageBottom, overlaps } = await scan(page);
    if (overlaps.length) {
      console.log(`scroll=${scroll} stage=[${stageTop},${stageBottom}] OVERLAPS:`);
      overlaps.forEach((o) => console.log(`  "${o.text}" text=[${o.textTop},${o.textBottom}]`));
    }
  }
  await browser.close();
}

main().catch(console.error);
