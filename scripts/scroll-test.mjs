/**
 * Playwright scroll drift test — detects bounce-back after scroll.
 * Usage: node scripts/scroll-test.mjs [url] [--mobile]
 */
import { chromium, devices } from "playwright";

const url = process.argv.find((a) => a.startsWith("http")) || "http://localhost:5175/";
const mobile = process.argv.includes("--mobile");

const PAGES = [
  { path: "/", name: "Home" },
  { path: "/experience.html", name: "Experience" },
  { path: "/ventures.html", name: "Ventures" },
  { path: "/publications.html", name: "Publications" },
];

async function waitForLenis(page) {
  await page.waitForFunction(() => window.__lenis != null, null, { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(2500);
}

async function getScrollY(page) {
  return page.evaluate(() => (window.__lenis ? window.__lenis.scroll : window.scrollY));
}

async function scrollBy(page, delta, steps = 8) {
  const step = delta / steps;
  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel(0, step);
    await page.waitForTimeout(40);
  }
  await page.waitForTimeout(600);
}

async function testPageScroll(page, pageInfo) {
  const fullUrl = new URL(pageInfo.path, url).href;
  await page.goto(fullUrl, { waitUntil: "domcontentloaded" });
  await waitForLenis(page);

  // Skip publications intro if present
  const skipBtn = page.locator('button:has-text("Skip")');
  if (await skipBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await skipBtn.click();
    await page.waitForTimeout(800);
  }

  const findings = [];

  // Slow scroll test
  const startY = await getScrollY(page);
  await scrollBy(page, 800, 16);
  const midY = await getScrollY(page);
  await page.waitForTimeout(400);
  const afterPauseY = await getScrollY(page);
  if (afterPauseY < midY - 30) {
    findings.push({
      type: "bounce-back",
      detail: `After slow scroll: mid=${Math.round(midY)} paused=${Math.round(afterPauseY)} (lost ${Math.round(midY - afterPauseY)}px)`,
    });
  }

  // Fast scroll test
  await scrollBy(page, 1200, 4);
  const fastY = await getScrollY(page);
  await page.waitForTimeout(500);
  const afterFastY = await getScrollY(page);
  if (afterFastY < fastY - 40) {
    findings.push({
      type: "bounce-back-fast",
      detail: `After fast scroll: peak=${Math.round(fastY)} settled=${Math.round(afterFastY)} (lost ${Math.round(fastY - afterFastY)}px)`,
    });
  }

  // Jump to top check
  if (afterFastY < startY + 100 && midY > 200) {
    findings.push({
      type: "jump-to-top",
      detail: `Scroll reset unexpectedly: start=${Math.round(startY)} end=${Math.round(afterFastY)} mid was ${Math.round(midY)}`,
    });
  }

  return { page: pageInfo.name, startY, midY, afterPauseY, fastY, afterFastY, findings };
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = mobile
    ? await browser.newContext({ ...devices["iPhone 14"] })
    : await browser.newContext({ viewport: { width: 1440, height: 900 } });

  const page = await context.newPage();
  const results = [];

  for (const p of PAGES) {
    try {
      results.push(await testPageScroll(page, p));
    } catch (err) {
      results.push({ page: p.name, error: String(err), findings: [] });
    }
  }

  await browser.close();

  console.log(`\n=== Scroll test (${mobile ? "mobile" : "desktop"}) — ${url} ===\n`);
  for (const r of results) {
    console.log(`## ${r.page}`);
    if (r.error) {
      console.log(`  ERROR: ${r.error}`);
      continue;
    }
    console.log(`  scroll: start=${Math.round(r.startY)} mid=${Math.round(r.midY)} pause=${Math.round(r.afterPauseY)} fast=${Math.round(r.fastY)} final=${Math.round(r.afterFastY)}`);
    if (r.findings.length === 0) {
      console.log("  OK — no bounce-back detected");
    } else {
      for (const f of r.findings) {
        console.log(`  BUG [${f.type}]: ${f.detail}`);
      }
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
