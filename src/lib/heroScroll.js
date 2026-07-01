/** GSAP-scrubbed hero progress (0–1) shared with Scene3D on the homepage. */
export const heroScrollState = { current: 0 };

export function setHeroScrollProgress(value) {
  heroScrollState.current = Math.max(0, Math.min(1, value));
}

export function resetHeroScrollProgress() {
  heroScrollState.current = 0;
}
