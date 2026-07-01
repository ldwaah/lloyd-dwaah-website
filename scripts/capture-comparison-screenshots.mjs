/**
 * Capture comparison screenshots for Lando vs Lloyd analysis.
 * Usage: node scripts/capture-comparison-screenshots.mjs
 */
import { chromium, devices } from "playwright";
import { mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "../docs/comparison/screenshots");

const LLOYD = "https://lloyddwaah.com";
const LANDO = "https://landonorris.com";

async function waitForSettle(page, ms = 1200) {
  await page.waitForTimeout(ms);
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
}

async function dismissLloydPreloader(page) {
  try {
    await page.waitForSelector("#root > *", { timeout: 15000 });
    await waitForSettle(page, 2800);
  } catch {
    await waitForSettle(page, 2000);
  }
}

async function dismissLandoOverlays(page) {
  await waitForSettle(page, 3500);
  const cookieSelectors = [
    'button:has-text("Accept")',
    'button:has-text("I agree")',
    'button:has-text("Agree")',
    '[data-iub="accept"]',
  ];
  for (const sel of cookieSelectors) {
    const btn = page.locator(sel).first();
    if (await btn.isVisible({ timeout: 500 }).catch(() => false)) {
      await btn.click().catch(() => {});
      await waitForSettle(page, 800);
      break;
    }
  }
}

async function scrollToPercent(page, percent) {
  await page.evaluate((p) => {
    const max = Math.max(
      document.documentElement.scrollHeight - window.innerHeight,
      0
    );
    window.scrollTo({ top: (max * p) / 100, behavior: "instant" });
  }, percent);
  await waitForSettle(page, 1500);
}

async function scrollToSelector(page, selector) {
  const el = page.locator(selector).first();
  if (await el.count()) {
    await el.scrollIntoViewIfNeeded();
    await waitForSettle(page, 1500);
    return true;
  }
  return false;
}

async function captureDesktop(browser, site, baseName, opts) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  await page.goto(site.url, { waitUntil: "domcontentloaded", timeout: 60000 });
  if (site.key === "lloyd") await dismissLloydPreloader(page);
  else await dismissLandoOverlays(page);

  for (const shot of opts.shots) {
    if (shot.percent != null) await scrollToPercent(page, shot.percent);
    else if (shot.selector) {
      const ok = await scrollToSelector(page, shot.selector);
      if (!ok && shot.fallbackPercent != null) await scrollToPercent(page, shot.fallbackPercent);
    }
    const file = path.join(OUT_DIR, `${baseName}-${shot.name}.png`);
    await page.screenshot({ path: file, fullPage: false });
    console.log("saved", file);
  }
  await page.close();
}

async function captureMobile(browser, site, baseName) {
  const iphone = devices["iPhone 13"];
  const page = await browser.newPage({
    ...iphone,
    deviceScaleFactor: 2,
  });
  await page.goto(site.url, { waitUntil: "domcontentloaded", timeout: 60000 });
  if (site.key === "lloyd") await dismissLloydPreloader(page);
  else await dismissLandoOverlays(page);

  const file = path.join(OUT_DIR, `${baseName}-mobile-hero.png`);
  await page.screenshot({ path: file, fullPage: false });
  console.log("saved", file);
  await page.close();
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const lloydShots = {
    shots: [
      { name: "hero", percent: 0 },
      { name: "mid", percent: 40 },
      { name: "deep", percent: 70 },
      {
        name: "principles",
        selector: "#principles",
        fallbackPercent: 55,
      },
    ],
  };

  const landoShots = {
    shots: [
      { name: "hero", percent: 0 },
      { name: "mid", percent: 35 },
      { name: "deep", percent: 65 },
      { name: "content-chapter", percent: 45 },
    ],
  };

  const browser = await chromium.launch({ headless: true });

  try {
    await captureDesktop(browser, { key: "lloyd", url: LLOYD }, "lloyd", lloydShots);
    await captureDesktop(browser, { key: "lando", url: LANDO }, "lando", landoShots);
    await captureMobile(browser, { key: "lloyd", url: LLOYD }, "lloyd");
    await captureMobile(browser, { key: "lando", url: LANDO }, "lando");
  } finally {
    await browser.close();
  }

  console.log("done");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
