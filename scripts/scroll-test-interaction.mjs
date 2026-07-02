/**
 * Test scroll during ScrollTrigger.refresh and carousel interaction.
 */
import { chromium, devices } from "playwright";

const url = process.argv.find((a) => a.startsWith("http")) || "http://localhost:5175/";
const mobile = process.argv.includes("--mobile");

async function getScrollY(page) {
  return page.evaluate(() => (window.__lenis ? window.__lenis.scroll : window.scrollY));
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

  // Scroll to principles section
  for (let i = 0; i < 40; i++) {
    if (mobile) {
      await page.evaluate(() => window.__lenis?.scrollTo(window.__lenis.scroll + 100));
    } else {
      await page.mouse.wheel(0, 150);
    }
    await page.waitForTimeout(60);
  }
  await page.waitForTimeout(500);
  const beforeCarousel = await getScrollY(page);
  console.log(`At principles: scroll=${Math.round(beforeCarousel)}`);

  // Click carousel next several times
  const nextBtn = page.locator('button[aria-label^="Next principle"]');
  for (let i = 0; i < 4; i++) {
    const yBefore = await getScrollY(page);
    await nextBtn.click();
    await page.waitForTimeout(300);
    const yAfter = await getScrollY(page);
    if (Math.abs(yAfter - yBefore) > 20) {
      console.log(`CAROUSEL JUMP step ${i}: ${Math.round(yBefore)} -> ${Math.round(yAfter)}`);
    }
  }

  // Force refresh during scroll
  const y1 = await getScrollY(page);
  await page.evaluate(async () => {
    const { refreshScrollTriggersNow } = await import("/src/lib/scrollRefresh.js");
    refreshScrollTriggersNow();
  }).catch(() =>
    page.evaluate(() => {
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    })
  );
  await page.waitForTimeout(100);
  const y2 = await getScrollY(page);
  if (Math.abs(y2 - y1) > 30) {
    console.log(`REFRESH DRIFT: ${Math.round(y1)} -> ${Math.round(y2)}`);
  }

  // Scroll while refresh fires from resize
  for (let i = 0; i < 10; i++) {
    const yBefore = await getScrollY(page);
    await page.evaluate(() => {
      document.body.style.minHeight = `${document.body.scrollHeight + (Math.random() > 0.5 ? 20 : -20)}px`;
    });
    if (mobile) {
      await page.evaluate(() => window.__lenis?.scrollTo(window.__lenis.scroll + 80));
    } else {
      await page.mouse.wheel(0, 100);
    }
    await page.waitForTimeout(250);
    const yAfter = await getScrollY(page);
    if (yAfter < yBefore - 30) {
      console.log(`RESIZE+BOUNCE step ${i}: ${Math.round(yBefore)} -> ${Math.round(yAfter)}`);
    }
  }

  await browser.close();
  console.log(`\nDone (${mobile ? "mobile" : "desktop"})`);
}

main().catch(console.error);
