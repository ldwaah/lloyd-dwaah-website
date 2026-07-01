import gsap from "gsap";

/**
 * Lightweight word split for GSAP stagger (no SplitText plugin).
 * Returns span elements with class "split-word".
 */
export function splitElementWords(element) {
  if (!element) return [];

  if (element.dataset.splitWords === "1") {
    return [...element.querySelectorAll(".split-word")];
  }

  const text = element.textContent?.trim() ?? "";
  if (!text) return [];

  element.textContent = "";
  element.dataset.splitWords = "1";

  const words = text.split(/\s+/).filter(Boolean);
  const spans = [];

  words.forEach((word, index) => {
    const span = document.createElement("span");
    span.className = "split-word";
    span.style.display = "inline-block";
    span.textContent = word;
    element.appendChild(span);
    spans.push(span);
    if (index < words.length - 1) {
      element.appendChild(document.createTextNode(" "));
    }
  });

  return spans;
}

/**
 * Split text into per-character spans (preserves spaces as gap spans).
 */
export function splitElementChars(element) {
  if (!element) return [];

  if (element.dataset.splitChars === "1") {
    return [...element.querySelectorAll(".split-char")];
  }

  const text = element.textContent ?? "";
  element.textContent = "";
  element.dataset.splitChars = "1";

  const spans = [];
  for (const char of text) {
    const span = document.createElement("span");
    span.className = "split-char";
    span.style.display = "inline-block";
    span.textContent = char === " " ? "\u00A0" : char;
    element.appendChild(span);
    spans.push(span);
  }

  return spans;
}

export function resetSplitChars(element) {
  if (!element || element.dataset.splitChars !== "1") return;
  element.textContent = [...element.querySelectorAll(".split-char")]
    .map((span) => span.textContent?.replace(/\u00A0/g, " ") ?? "")
    .join("");
  delete element.dataset.splitChars;
}

export function resetSplitWords(element) {
  if (!element || element.dataset.splitWords !== "1") return;
  const text = [...element.querySelectorAll(".split-word")]
    .map((span) => span.textContent)
    .join(" ");
  element.textContent = text;
  delete element.dataset.splitWords;
}

/** Animate words in with GSAP timeline segment */
export function animateWordsIn(timeline, words, position = 0, stagger = 0.04) {
  if (!words.length) return;

  gsap.set(words, { y: "110%", opacity: 0, rotateX: -12, transformOrigin: "50% 100%" });

  timeline.to(
    words,
    {
      y: "0%",
      opacity: 1,
      rotateX: 0,
      duration: 0.12,
      stagger,
      ease: "power3.out",
    },
    position
  );
}
