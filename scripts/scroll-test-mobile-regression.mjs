/**
 * Mobile scroll regression — hero → ethos → principles → partners → footer.
 * Fails on ghost overlap, large jumps, or snap-to-top.
 */
import { chromium, devices } from "playwright";

const url = process.argv.find((a) => a.startsWith("http")) || "http://localhost:5175/";

async function getScrollY(page) {
  return page.evaluate(() => (window.__lenis ? window.__lenis.scroll : window.scrollY));
}

async function inspectState(page) {
  return page.evaluate(() => {
    const principles = document.getElementById("principles");
    const header = principles?.querySelector("h2");
    const slide = principles?.querySelector("[aria-live] h3");
    const marquee = document.querySelector(".partner-marquee-track");
    const hero = document.querySelector("#home p.font-serif");
    const footer = document.querySelector("[data-footer-heading]");

    const op = (el) => (el ? parseFloat(getComputedStyle(el).opacity) : 1);
    const visible = (el) => {
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return r.top < innerHeight && r.bottom > 0;
    };

    const triggers = [];
    try {
      const ST = window.gsap?.core?.globals()?.ScrollTrigger;
      if (ST?.getAll) {
        ST.getAll().forEach((t) => {
          if (t.pin) triggers.push({ active: t.isActive, progress: +t.progress.toFixed(2) });
        });
      }
    } catch {
      /* gsap not exposed */
    }

    return {
      scroll: Math.round(window.__lenis?.scroll ?? scrollY),
      headerOp: op(header),
      slideOp: op(slide),
      marqueeOp: op(marquee),
      principlesVisible: visible(header),
      marqueeVisible: visible(marquee),
      heroVisible: visible(hero),
      footerVisible: visible(footer),
      activePins: triggers.filter((t) => t.active).length,
    };
  });
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await (
    await browser.newContext({ ...devices["iPhone 14"] })
  ).newPage();

  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForFunction(() => window.__lenis != null, null, { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(4500);

  const failures = [];
  let prevY = 0;
  let maxY = 0;
  let ghostCount = 0;

  for (let i = 0; i < 70; i++) {
    await page.evaluate(() => {
      window.__lenis?.scrollTo(window.__lenis.scroll + 55, { immediate: false });
    });
    await page.waitForTimeout(70);

    const y = await getScrollY(page);
    const state = await inspectState(page);
    const delta = y - prevY;

    if (delta < -120 && prevY > 300) {
      failures.push({ type: "JUMP_BACK", step: i, from: Math.round(prevY), to: Math.round(y) });
    }
    if (y < 50 && prevY > 800) {
      failures.push({ type: "SNAP_TO_TOP", step: i, from: Math.round(prevY), to: Math.round(y) });
    }
    if (
      state.principlesVisible &&
      state.marqueeVisible &&
      (state.headerOp < 0.95 || state.slideOp < 0.95)
    ) {
      ghostCount++;
      if (ghostCount <= 3) {
        failures.push({
          type: "GHOST",
          step: i,
          scroll: Math.round(y),
          headerOp: state.headerOp,
          slideOp: state.slideOp,
          marqueeOp: state.marqueeOp,
        });
      }
    }
    if (state.activePins > 1) {
      failures.push({ type: "OVERLAPPING_PINS", step: i, count: state.activePins });
    }

    maxY = Math.max(maxY, y);
    prevY = y;
  }

  await page.waitForTimeout(600);
  const finalY = await getScrollY(page);
  const finalState = await inspectState(page);

  if (finalY < maxY - 150 && maxY > 1000) {
    failures.push({ type: "SETTLE_BOUNCE", maxY: Math.round(maxY), finalY: Math.round(finalY) });
  }
  if (finalState.heroVisible && maxY > 1500 && finalY < 200) {
    failures.push({ type: "STUCK_ON_HERO", maxY: Math.round(maxY), finalY: Math.round(finalY) });
  }

  console.log("\n=== Mobile scroll regression (390×844) ===");
  console.log(`URL: ${url}`);
  console.log(`Max scroll: ${Math.round(maxY)} | Final: ${Math.round(finalY)}`);
  console.log(`Footer reached: ${finalState.footerVisible || maxY > 1800}`);
  console.log(`Failures: ${failures.length}`);

  if (failures.length) {
    failures.forEach((f) => console.log(" ", JSON.stringify(f)));
    await browser.close();
    process.exit(1);
  }

  console.log("PASS — no ghost, jump, or snap-to-top detected.");
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
