import { useEffect, useRef } from "react";

/**
 * Atmospheric depth for inner pages — soft gradients, subtle particles.
 * Home uses Scene3D instead.
 */
export default function AmbientBackground({ variant = "default" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    let w = 0;
    let h = 0;

    const particles = Array.from({ length: 48 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.4 + Math.random() * 1.2,
      vx: (Math.random() - 0.5) * 0.00015,
      vy: (Math.random() - 0.5) * 0.0001,
      a: 0.15 + Math.random() * 0.35,
    }));

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > 1) p.vx *= -1;
        if (p.y < 0 || p.y > 1) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(94, 234, 255, ${p.a})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const gradients = {
    default: "from-hq via-hq-deep to-hq-darker",
    experience: "from-hq-darker via-hq to-hq-light/20",
    ventures: "from-hq via-hq-deep to-hq-darker",
    publications: "from-[#1a2832] via-hq to-hq-darker",
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradients[variant] || gradients.default} animate-drift`}
      />
      <div className="absolute -left-1/4 top-0 h-[60vh] w-[60vw] rounded-full bg-accent/5 blur-[120px] animate-pulse-slow" />
      <div className="absolute -right-1/4 bottom-0 h-[50vh] w-[50vw] rounded-full bg-accent-dim/5 blur-[100px] animate-pulse-slow" />
      <canvas ref={canvasRef} className="absolute inset-0 opacity-40" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(94,234,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(94,234,255,0.5) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
    </div>
  );
}
