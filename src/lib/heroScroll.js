/** GSAP-scrubbed hero progress (0–1) shared with Scene3D on the homepage. */
export const heroScrollState = { 
  current: 0,
  target: 0,
  velocity: 0
};

export function setHeroScrollProgress(value) {
  const clamped = Math.max(0, Math.min(1, value));
  heroScrollState.target = clamped;
  
  // Update current with damping for smooth transitions
  const delta = heroScrollState.target - heroScrollState.current;
  const dampFactor = 0.15; // Smooth interpolation
  heroScrollState.current += delta * dampFactor;
  heroScrollState.velocity = delta;
}

export function resetHeroScrollProgress() {
  heroScrollState.current = 0;
  heroScrollState.target = 0;
  heroScrollState.velocity = 0;
}

// Smooth update function called from RAF
export function updateHeroScrollSmooth(deltaTime = 16) {
  const delta = heroScrollState.target - heroScrollState.current;
  if (Math.abs(delta) > 0.001) {
    // Adaptive damping based on velocity for snappy yet smooth feel
    const dampFactor = Math.min(0.22, 0.12 + Math.abs(heroScrollState.velocity) * 0.5);
    heroScrollState.current += delta * dampFactor;
    heroScrollState.velocity = delta;
  } else {
    heroScrollState.current = heroScrollState.target;
    heroScrollState.velocity = 0;
  }
}
