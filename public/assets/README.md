# Avatar assets go here

Place your Lloyd Dwaah avatar files in THIS folder:

| File                | Used when `avatarConfig.mode =` | Notes |
|---------------------|---------------------------------|-------|
| `lloyd-avatar.png`  | `"image"` (default)             | Best result: a **front-facing head crop on a transparent background** (PNG with alpha). Square, ~1000×1000px. Use the front portrait from your reference sheet. |
| `lloyd-avatar.mp4`  | `"video"`                       | A short, seamless looping render / slow turntable of the head. Muted, ~3–6s, H.264 .mp4. Keep it small (<3 MB) for fast load. |

## How to get a transparent PNG from your reference image

1. Take the **front-facing portrait** (3rd panel of your reference sheet).
2. Remove the white background (any of):
   - https://www.remove.bg
   - Photoshop / Photopea → "Remove Background"
   - macOS Preview → Instant Alpha
3. Crop square, centred on the face.
4. Export as `lloyd-avatar.png` and drop it in this folder.

The circular glass frame in the UI will mask it into a clean holographic disc.

> Until you add a file, the avatar disc will simply show a broken-image area —
> that's expected. Add `lloyd-avatar.png` and refresh.
