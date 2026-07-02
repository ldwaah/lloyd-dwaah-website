import { gsap, ScrollTrigger } from "./gsap.js";
import { splitElementWords } from "./splitText.js";

export const REVEAL_EASE = [0.22, 1, 0.36, 1];
export const REVEAL_START = "top 90%";

export function isAboveFold(el, margin = 60) {
  if (!el) return false;
  const { top, bottom } = el.getBoundingClientRect();
  return top < window.innerHeight - margin && bottom > 0;
}

/**
 * Play a paused timeline when el scrolls into view. ScrollTrigger drives it;
 * an IntersectionObserver backstops it so opacity-animated content can never
 * be stranded invisible if trigger positions drift.
 */
function playOnEnter(el, tl, start = REVEAL_START) {
  const trigger = ScrollTrigger.create({
    trigger: el,
    start,
    once: true,
    onEnter: () => tl.play(),
  });

  let io = null;
  if (typeof IntersectionObserver !== "undefined") {
    io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          tl.play();
          io?.disconnect();
          io = null;
        }
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
  }

  return () => {
    trigger.kill();
    io?.disconnect();
  };
}

/**
 * Lenis-synced fade-up reveal via ScrollTrigger.
 * Above-fold elements render immediately; others rise with a blur-fade.
 */
export function bindScrollReveal(
  el,
  {
    y = 24,
    delay = 0,
    revealDelay = 0.22,
    start = REVEAL_START,
    fade = true,
    blur = true,
    rotateY = 0,
  } = {}
) {
  gsap.set(el, { opacity: 1 });

  if (isAboveFold(el)) {
    gsap.set(el, { y: 0 });
    return () => {};
  }

  gsap.set(el, {
    y,
    opacity: fade ? 0 : 1,
    filter: blur ? "blur(8px)" : "none",
    ...(rotateY ? { rotateY, transformPerspective: 900 } : {}),
  });

  const tl = gsap.timeline({ paused: true }).to(el, {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    ...(rotateY ? { rotateY: 0 } : {}),
    duration: 0.9,
    ease: REVEAL_EASE,
    delay: revealDelay + delay,
  });

  const stop = playOnEnter(el, tl, start);

  return () => {
    stop();
    tl.kill();
  };
}

export function bindScrollRevealStagger(
  container,
  itemSelector,
  { stagger = 0.08, y = 20, start = REVEAL_START, fade = true } = {}
) {
  const items = [...container.querySelectorAll(itemSelector)];
  gsap.set(items, { opacity: 1 });

  if (isAboveFold(container)) {
    gsap.set(items, { y: 0 });
    return () => {};
  }

  gsap.set(items, { y, opacity: fade ? 0 : 1 });

  const tl = gsap.timeline({ paused: true }).to(items, {
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: REVEAL_EASE,
    stagger,
    delay: 0.12,
  });

  const stop = playOnEnter(container, tl, start);

  return () => {
    stop();
    tl.kill();
  };
}

export function bindScrollRevealLines(
  container,
  lineSelector,
  { stagger = 0.08, y = 16, start = REVEAL_START } = {}
) {
  const lines = [...container.querySelectorAll(lineSelector)];
  gsap.set(lines, { opacity: 1 });

  if (isAboveFold(container)) {
    gsap.set(lines, { y: 0 });
    return () => {};
  }

  gsap.set(lines, { y, opacity: 0 });

  const tl = gsap.timeline({ paused: true }).to(lines, {
    y: 0,
    opacity: 1,
    duration: 0.7,
    ease: REVEAL_EASE,
    stagger,
    delay: 0.1,
  });

  const stop = playOnEnter(container, tl, start);

  return () => {
    stop();
    tl.kill();
  };
}

/**
 * Masked line-by-line heading reveal: words are split, grouped into visual
 * lines, and each line rises out of an overflow-hidden mask. Waits for fonts
 * so line grouping matches final metrics. Above-fold headings play on bind,
 * giving page-top type a choreographed arrival.
 */
export function bindMaskedLineReveal(
  el,
  { stagger = 0.09, duration = 0.95, delay = 0, start = REVEAL_START } = {}
) {
  const original = el.textContent;
  let cancelled = false;
  let cleanup = null;

  gsap.set(el, { autoAlpha: 0 });

  const bind = () => {
    if (cancelled) return;

    const words = splitElementWords(el);
    if (!words.length) {
      gsap.set(el, { autoAlpha: 1 });
      return;
    }

    const lines = [];
    let lastTop = null;
    words.forEach((word) => {
      const top = word.offsetTop;
      if (lastTop === null || Math.abs(top - lastTop) > 2) {
        lines.push([]);
        lastTop = top;
      }
      lines[lines.length - 1].push(word);
    });

    const inners = lines.map((lineWords) => {
      const mask = document.createElement("span");
      mask.className = "reveal-line-mask";
      const inner = document.createElement("span");
      inner.className = "reveal-line";
      mask.appendChild(inner);
      el.insertBefore(mask, lineWords[0]);
      lineWords.forEach((word, i) => {
        inner.appendChild(word);
        if (i < lineWords.length - 1) inner.appendChild(document.createTextNode(" "));
      });
      return inner;
    });

    [...el.childNodes].forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) el.removeChild(node);
    });

    gsap.set(inners, { yPercent: 115 });
    gsap.set(el, { autoAlpha: 1 });

    const tl = gsap.timeline({ paused: true }).to(inners, {
      yPercent: 0,
      duration,
      ease: REVEAL_EASE,
      stagger,
      delay,
    });

    let stop = () => {};
    if (isAboveFold(el)) {
      tl.play();
    } else {
      stop = playOnEnter(el, tl, start);
    }

    cleanup = () => {
      stop();
      tl.kill();
    };
  };

  if (document.fonts?.status === "loaded" || !document.fonts) {
    bind();
  } else {
    document.fonts.ready.then(bind);
  }

  return () => {
    cancelled = true;
    cleanup?.();
    el.textContent = original;
    gsap.set(el, { clearProps: "visibility,opacity" });
    delete el.dataset.splitWords;
  };
}

/**
 * Image unclip + settle: the frame expands open while the image eases from
 * an overscaled crop down to rest. `el` is the overflow container; the inner
 * img/video is scaled.
 */
export function bindImageReveal(el, { delay = 0, start = REVEAL_START, radius = "0px" } = {}) {
  const media = el.querySelector("img, video") || el;

  gsap.set(el, { clipPath: `inset(14% 8% 14% 8% round ${radius})` });
  gsap.set(media, { scale: 1.22 });

  const tl = gsap
    .timeline({ paused: true, delay })
    .to(el, {
      clipPath: `inset(0% 0% 0% 0% round ${radius})`,
      duration: 1.1,
      ease: REVEAL_EASE,
    })
    .to(media, { scale: 1, duration: 1.4, ease: REVEAL_EASE }, "<");

  let stop = () => {};
  if (isAboveFold(el)) {
    tl.play();
  } else {
    stop = playOnEnter(el, tl, start);
  }

  return () => {
    stop();
    tl.kill();
  };
}

/**
 * Scrubbed parallax drift across the element's whole visible range.
 * Values are yPercent so they scale with the element.
 */
export function bindParallax(el, { from = -7, to = 7, scrub = 0.5, trigger = null } = {}) {
  const tween = gsap.fromTo(
    el,
    { yPercent: from },
    {
      yPercent: to,
      ease: "none",
      scrollTrigger: {
        trigger: trigger || el.closest("section") || el.parentElement || el,
        start: "top bottom",
        end: "bottom top",
        scrub,
        invalidateOnRefresh: true,
      },
    }
  );

  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
  };
}
