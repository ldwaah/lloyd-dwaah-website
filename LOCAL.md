# Lloyd Dwaah — local preview (new motion build)

## Two folders

| Folder | Purpose | Dev port |
|--------|---------|----------|
| `../Lloyd website-default` | Frozen reference site (commit `00bedc0`). **Do not edit.** | 5173 |
| `../Lloyd website-new` | Immersive rebuild (Lenis + GSAP + 3D hero). **Work here.** | 5174 |

## Run the default (frozen) site

```bash
cd "../Lloyd website-default"
npm install
npm run dev
```

Open http://localhost:5173

## Run the new site

```bash
cd "../Lloyd website-new"
npm install
npm run dev
```

Open http://localhost:5174

## Build (new site only)

```bash
npm run build
npm run preview
```

## Motion system (new site)

1. **Preloader** — first homepage visit per session (`sessionStorage`), ~550ms minimum, curtain exit
2. **Page transitions** — MPA curtain wipe on internal nav (`PageTransition.jsx` + `lib/pageTransition.js`)
3. **Lenis + GSAP ScrollTrigger** — desktop smooth scroll with `scrollerProxy`, `gsap.ticker` + `lenis.raf`
4. **Homepage cinematic** — pinned hero fade + GSAP-scrubbed SVG portrait (`HeroPortrait.jsx` + `public/assets/lloyd-portrait.svg`), not WebGL overlay
5. **Core principles** — interactive grid with SVG icons and hover detail (`CorePrinciples.jsx`)

## Git / deploy

This project is **local only**. No push to GitHub, no Netlify deploy from this folder unless you choose to later.
