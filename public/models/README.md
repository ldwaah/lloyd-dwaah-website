# 3D model goes here (future upgrade)

Drop a `lloyd-head.glb` file in this folder when you have one, then set
`avatarConfig.mode = "glb"` in `src/data/site.js`.

See the main project **README.md → "Upgrading to a true interactive 3D head"**
for the exact react-three-fiber code to render it.

### How to generate a GLB from your reference images
- **Higgsfield / image-to-3D** tools can turn a front portrait into a GLB mesh.
- **Luma AI**, **Meshy.ai**, **Tripo3D**, **Rodin** — upload the front face image, export GLB.
- A 3D artist can sculpt a stylised head from the 4-view reference sheet.

Keep the file optimised (Draco-compressed, < 5 MB) for fast web loading.
