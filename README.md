# Lloyd Dwaah — Personal Brand Site

A cinematic, genuinely 3D personal brand experience. The portrait lives inside a
real Three.js "digital studio": cursor-driven camera parallax, dynamic lighting,
floating glass panels, particles, reflections, and a camera that glides through
the space as you scroll. Built to evolve for decades.

**Stack:** React 18 · Vite · Tailwind CSS · Framer Motion · React Three Fiber
(Three.js) · drei · postprocessing. Deploys on Netlify.

---

## 1. How the 3D works

The whole background is one fixed `<Canvas>` ([src/components/Scene3D.jsx](src/components/Scene3D.jsx)),
rendered behind the content (`pointer-events-none`). It contains:

- **The portrait**, placed on a glass panel with real depth, a glowing rim and a
  gentle float — it exists *in* the scene, not over a flat image.
- **A camera rig** that parallaxes toward the cursor and dollies back as you scroll
  (each section feels like moving deeper into the space).
- **A cursor-following key light**, plus a procedural studio environment
  (`Lightformer`s) that creates reflections with no external HDRI download.
- **A particle field** that drifts and reacts to the mouse.
- **Floating glass shards** at different depths.
- **A reflective floor** (`MeshReflectorMaterial`).
- **Bloom + vignette** post-processing for the premium glow (desktop only; auto-off
  on mobile for performance).

Global mouse + scroll are read through refs in [src/lib/input.js](src/lib/input.js)
so the 3D reacts even though the DOM content sits above the canvas.

The scene is **code-split** (`React.lazy`) so the content paints instantly and the
heavy Three.js chunk loads in behind it.

---

## 2. The portrait source — one switch

In [src/data/site.js](src/data/site.js):

```js
avatarConfig.mode = "image"  // PNG portrait        ← works today, recommended
                  // "video"  // looping .mp4 render
                  // "glb"    // a real 3D head model (see §6)
```

| Mode    | File                          | Notes |
|---------|-------------------------------|-------|
| image   | `public/assets/lloyd-avatar.png` | **Best: a transparent-background PNG.** It floats in the 3D scene, so a cut-out portrait (no white box) looks far more premium. Front-facing, ~1000×1250px. |
| video   | `public/assets/lloyd-avatar.mp4` | A short, seamless loop. |
| glb     | `public/models/lloyd-head.glb`   | A real 3D head — see §6. |

Until you add a PNG, the scene shows a tasteful placeholder panel automatically.

**Removing the white background:** [remove.bg](https://www.remove.bg), Photopea,
or macOS Preview's Instant Alpha. Then save as `public/assets/lloyd-avatar.png`.

---

## 3. Install & run

```bash
npm install
npm run dev        # → http://localhost:5173
npm run build      # → /dist
npm run preview    # preview the production build
```

Node 18+ (Node 20 matches the Netlify config).

---

## 4. Editing content

Everything — the narrative, the six disciplines, ventures, books, contact — lives
in [src/data/site.js](src/data/site.js). Add a venture, a book or a principle by
editing one object; no component changes needed. Brand colours, fonts and motion
live in [tailwind.config.js](tailwind.config.js).

**Sections:** Home (who) → Ethos (what he believes) → Experience (the six
disciplines, on a holographic timeline) → Ventures (what he's building) → Writing
(Books & Anthologies) → Horizon (where he's going) → Contact.

---

## 5. File structure

```
src/
├── App.jsx                  # lazy-loads Scene3D, lays out the sections
├── lib/input.js             # global pointer + scroll refs, device helpers
├── data/site.js             # ALL content + avatar config
└── components/
    ├── Scene3D.jsx          # ⭐ the real 3D studio (camera, lights, portrait…)
    ├── ScrollProgress.jsx
    ├── Navbar.jsx           # active-section tracking
    ├── Hero.jsx             # copy left, 3D portrait right (in the scene)
    ├── Reveal.jsx           # shared cinematic reveals
    ├── Ethos.jsx
    ├── Experience.jsx       # six disciplines + holographic timeline
    ├── Ventures.jsx
    ├── Writing.jsx
    ├── Horizon.jsx
    ├── Contact.jsx
    └── Footer.jsx
public/
├── assets/   (lloyd-avatar.png / .mp4)
└── models/   (lloyd-head.glb)
```

---

## 6. Upgrading to a real 3D head (GLB)

The 3D scene is already here, so adding a model is now a drop-in. When you have a
`lloyd-head.glb` (generate one from your portrait with Meshy.ai, Luma, Tripo3D or
Rodin — see `public/models/README.md`):

1. Put the file at `public/models/lloyd-head.glb`.
2. Add a small component:

```jsx
// src/components/HeadGLB.jsx
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Float } from "@react-three/drei";
import * as THREE from "three";
import { avatarConfig } from "../data/site.js";

export default function HeadGLB({ pointer, scroll, mobile }) {
  const group = useRef();
  const { scene } = useGLTF(avatarConfig.glb);
  useFrame((state, dt) => {
    const g = group.current; if (!g) return;
    const p = pointer.current, sp = scroll.current;
    g.position.x = THREE.MathUtils.damp(g.position.x, mobile ? 0 : 1.75, 3, dt);
    g.position.y = THREE.MathUtils.damp(g.position.y, (mobile ? 1.1 : 0.15) - sp * 5, 3, dt);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, p.x * 0.5, 3, dt);
    g.visible = sp < 0.2;
  });
  return (
    <group ref={group} scale={mobile ? 1.4 : 1.8}>
      <Float speed={1.1} rotationIntensity={0.15} floatIntensity={0.4}>
        <primitive object={scene} />
      </Float>
    </group>
  );
}
useGLTF.preload(avatarConfig.glb);
```

3. In `Scene3D.jsx`, render `<HeadGLB .../>` instead of `<PortraitStage .../>`
   when `avatarConfig.mode === "glb"`.
4. Set `avatarConfig.mode = "glb"`.

The head now rotates toward the cursor, lit by the same studio environment.

---

## 7. Deploy to Netlify

- **Drag & drop:** `npm run build`, then drop the `dist/` folder onto
  <https://app.netlify.com/drop>.
- **Git:** push to GitHub, then Netlify → Add new site → Import from Git. The
  included [netlify.toml](netlify.toml) sets the build command, publish dir and an
  SPA redirect automatically.

---

Built to grow alongside the work — across leadership, education, sport, technology
and writing.
