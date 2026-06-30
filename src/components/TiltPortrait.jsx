import { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useTransform,
} from "framer-motion";
import { avatarConfig } from "../data/site.js";

// A lightweight, genuinely 3D portrait. The whole frame turns to follow the
// cursor: move right and the face looks right, move up and it looks up.
// CSS 3D transforms (perspective + rotateX/rotateY) — no canvas needed, so it
// stays fast and fits the light design.
export default function TiltPortrait() {
  // Normalised pointer across the viewport (-1..1)
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const sx = useSpring(px, { stiffness: 110, damping: 16, mass: 0.5 });
  const sy = useSpring(py, { stiffness: 110, damping: 16, mass: 0.5 });

  // Right edge recedes for a positive rotateY -> the face "looks right".
  const rotateY = useTransform(sx, [-1, 1], [-20, 20]);
  // Top edge recedes for a positive rotateX -> the face "looks up".
  const rotateX = useTransform(sy, [-1, 1], [-15, 15]);

  // Subtle feature parallax in the same direction as the turn.
  const imgX = useTransform(sx, [-1, 1], [-14, 14]);
  const imgY = useTransform(sy, [-1, 1], [14, -14]);

  // A soft highlight that tracks the cursor to sell the dimensionality.
  const sheenX = useTransform(sx, [-1, 1], [25, 75]);
  const sheenY = useTransform(sy, [-1, 1], [75, 25]);
  const sheen = useMotionTemplate`radial-gradient(circle at ${sheenX}% ${sheenY}%, rgba(255,255,255,0.22), transparent 55%)`;

  useEffect(() => {
    const onMove = (e) => {
      px.set((e.clientX / window.innerWidth) * 2 - 1);
      py.set(-((e.clientY / window.innerHeight) * 2 - 1));
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("pointermove", onMove);
    };
  }, [px, py]);

  return (
    <div className="mx-auto w-full max-w-sm" style={{ perspective: "1100px" }}>
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative aspect-square overflow-hidden rounded-2xl border border-line bg-canvas shadow-card"
      >
        {/* Soft drop shadow plate behind, for depth */}
        <div className="pointer-events-none absolute -inset-2 -z-10 rounded-3xl bg-brand/5 blur-xl" />

        <motion.img
          src={avatarConfig.image}
          alt="Lloyd Dwaah"
          style={{ x: imgX, y: imgY, scale: 1.14 }}
          className="h-full w-full object-cover"
          draggable={false}
        />

        {/* Cursor-tracking highlight */}
        <motion.div className="pointer-events-none absolute inset-0" style={{ background: sheen }} />

        {/* Quiet inner edge */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
      </motion.div>
    </div>
  );
}
