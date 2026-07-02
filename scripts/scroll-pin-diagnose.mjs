import { chromium } from "playwright";

const url = "http://localhost:5175/";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();

  await page.goto(url);
  await page.waitForFunction(() => window.__lenis != null);
  await page.waitForTimeout(3000);

  await page.addInitScript(() => {
    window.__pinLog = [];
  });

  await page.evaluate(() => {
    const { ScrollTrigger } = window.gsap?.plugins?.scrollTrigger
      ? { ScrollTrigger: window.gsap.plugins.scrollTrigger }
      : {};
    // Import from global after gsap loads
    import("/node_modules/gsap/ScrollTrigger.js").then(({ ScrollTrigger: ST }) => {
      const orig = ST.create.bind(ST);
      ST.create = (vars) => {
        const t = orig(vars);
        if (vars.pin) {
          t.vars.onUpdate = t.vars.onUpdate;
          const origUpdate = t.onUpdate;
          t.onUpdate = (self) => {
            window.__pinLog.push({
              t: performance.now(),
              scroll: window.__lenis?.scroll,
              progress: self.progress,
              direction: self.direction,
              pin: !!self.pin,
            });
            origUpdate?.(self);
          };
        }
        return t;
      };
    }).catch(() => {});
  }).catch(() => {});

  let prevY = 0;
  for (let i = 0; i < 12; i++) {
    await page.mouse.wheel(0, 150);
    await page.waitForTimeout(120);
    const info = await page.evaluate(() => {
      const ST = window.ScrollTrigger;
      const triggers = ST?.getAll?.() || [];
      return {
        scroll: window.__lenis?.scroll,
        actualScroll: window.__lenis?.actualScroll,
        targetScroll: window.__lenis?.targetScroll,
        windowScrollY: window.scrollY,
        docScrollTop: document.documentElement.scrollTop,
        bodyScrollTop: document.body.scrollTop,
        pins: triggers.filter((t) => t.pin).map((t) => ({
          progress: +t.progress.toFixed(3),
          start: t.start,
          end: t.end,
          isActive: t.isActive,
          pinActive: t.pin?.isActive,
        })),
      };
    });
    if (info.scroll < prevY - 100) {
      console.log(`\nBOUNCE step ${i}: ${Math.round(prevY)} -> ${Math.round(info.scroll)}`);
      console.log(JSON.stringify(info, null, 2));
    } else if (i % 3 === 0) {
      console.log(`step ${i}: scroll=${Math.round(info.scroll)} actual=${Math.round(info.actualScroll)} winY=${info.windowScrollY} pins=${info.pins.length} active=${info.pins.filter((p) => p.isActive).length}`);
    }
    prevY = info.scroll;
  }

  await browser.close();
}

main();
