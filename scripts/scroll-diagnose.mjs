import { chromium } from "playwright";

const url = "http://localhost:5175/";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();

  await page.goto(url);
  await page.waitForFunction(() => window.__lenis != null);
  await page.waitForTimeout(3000);

  await page.evaluate(() => {
    window.__scrollLog = [];
    const lenis = window.__lenis;
    const origRefresh = window.ScrollTrigger?.refresh?.bind(window.ScrollTrigger);
    if (origRefresh) {
      window.ScrollTrigger.refresh = (...args) => {
        window.__scrollLog.push({ t: performance.now(), type: "refresh", scroll: lenis.scroll });
        return origRefresh(...args);
      };
    }
    lenis.on("scroll", ({ scroll }) => {
      if (window.__scrollLog.length === 0 || performance.now() - window.__scrollLog.at(-1).t > 50) {
        window.__scrollLog.push({ t: performance.now(), type: "scroll", scroll });
      }
    });
  });

  let prevY = 0;
  for (let i = 0; i < 15; i++) {
    await page.mouse.wheel(0, 150);
    await page.waitForTimeout(100);
    const y = await page.evaluate(() => window.__lenis.scroll);
    if (y < prevY - 100) {
      const log = await page.evaluate(() => window.__scrollLog.slice(-15));
      console.log(`\n=== BOUNCE step ${i}: ${Math.round(prevY)} -> ${Math.round(y)} ===`);
      console.log(JSON.stringify(log, null, 2));
    }
    prevY = y;
  }

  await browser.close();
}

main();
