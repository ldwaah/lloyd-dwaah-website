import { chromium } from "playwright";

const url = "http://localhost:5175/";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();

  await page.goto(url);
  await page.waitForFunction(() => window.__lenis != null);
  await page.waitForTimeout(3500); // wait past preloader

  await page.evaluate(() => {
    window.__resetLog = [];
    const lenis = window.__lenis;
    const origScrollTo = lenis.scrollTo.bind(lenis);
    lenis.scrollTo = (target, opts) => {
      const val = typeof target === "number" ? target : String(target);
      if (val === "0" || val === 0 || val === "top") {
        window.__resetLog.push({ t: performance.now(), target: val, opts, stack: new Error().stack?.split("\n").slice(1, 6) });
      }
      return origScrollTo(target, opts);
    };
  });

  let prevY = 0;
  for (let i = 0; i < 12; i++) {
    await page.mouse.wheel(0, 150);
    await page.waitForTimeout(120);
    const y = await page.evaluate(() => window.__lenis.scroll);
    if (y < prevY - 100) {
      const log = await page.evaluate(() => window.__resetLog);
      console.log(`\nBOUNCE step ${i}: ${Math.round(prevY)} -> ${Math.round(y)}`);
      console.log("scrollTo(0) calls:", JSON.stringify(log, null, 2));
    }
    prevY = y;
  }

  await browser.close();
}

main();
