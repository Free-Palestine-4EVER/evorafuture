# Mobile (portrait) videos — drop-in guide

Every full-screen / full-bleed background video on the site now goes through
`components/ResponsiveVideo.tsx`. On phones (viewport **≤ 768px**) it automatically
prefers a **portrait, phone-optimised** copy of each clip and falls back to the
existing desktop file if the mobile copy isn't there yet.

## The convention

For a desktop source at:

```
/evora/NAME.mp4
```

the mobile portrait version is expected at:

```
/evora/NAME-mobile.mp4
```

- On screens ≤ 768px, `ResponsiveVideo` swaps the `src` to the `-mobile.mp4` file.
- If that file 404s (not supplied yet), it falls back to the desktop file **once**
  via `onError` — so nothing breaks today. You can ship the mobile files whenever.
- `prefers-reduced-motion` users see the poster still (no autoplay).

## What to produce

- **Orientation:** portrait. Target **9:16** (e.g. 1080×1920). 9:19.5 (1080×2340)
  also fine — clips are `object-fit: cover` and fill the phone.
- **Format:** H.264 MP4, `-movflags +faststart`, muted, looping-friendly
  (seamless first/last frame). Keep them lean (aim < 4–6 MB each) for mobile data.
- Just drop each file next to its desktop sibling in `public/evora/` using the
  exact name below.

## Expected filenames

### Hero (full-screen scroll/landing hero — `components/HeroScroll.tsx`)

On phones the heavy frame-scrub canvas is replaced by a single portrait video.
The hero uses the variant that the page passes in (`a` / `b` / `c`; the live home
hero is variant **c**). Provide whichever variants you use:

| Desktop file        | Mobile portrait file        |
| ------------------- | --------------------------- |
| `/evora/hero-a.mp4` | `/evora/hero-a-mobile.mp4`  |
| `/evora/hero-b.mp4` | `/evora/hero-b-mobile.mp4`  |
| `/evora/hero-c.mp4` | `/evora/hero-c-mobile.mp4`  |

> `hero-c-mobile.mp4` is the important one for the live homepage. It is **also**
> reused by the "Six worlds" intro showroom film in `components/Collections.tsx`.

### World films (the four cinematic category panels — `components/Collections.tsx`)

| Desktop file               | Mobile portrait file              |
| -------------------------- | --------------------------------- |
| `/evora/vid-coffee.mp4`    | `/evora/vid-coffee-mobile.mp4`    |
| `/evora/vid-sofa.mp4`      | `/evora/vid-sofa-mobile.mp4`      |
| `/evora/vid-armchair.mp4`  | `/evora/vid-armchair-mobile.mp4`  |
| `/evora/vid-bed.mp4`       | `/evora/vid-bed-mobile.mp4`       |

### Room films (`room-*.mp4`)

These follow the same convention wherever they are used as full-bleed
backgrounds. Provide portrait copies when ready:

| Desktop file                | Mobile portrait file               |
| --------------------------- | ---------------------------------- |
| `/evora/room-living.mp4`    | `/evora/room-living-mobile.mp4`    |
| `/evora/room-sofas.mp4`     | `/evora/room-sofas-mobile.mp4`     |
| `/evora/room-bedrooms.mp4`  | `/evora/room-bedrooms-mobile.mp4`  |
| `/evora/room-dining.mp4`    | `/evora/room-dining-mobile.mp4`    |
| `/evora/room-kitchen.mp4`   | `/evora/room-kitchen-mobile.mp4`   |
| `/evora/room-garden.mp4`    | `/evora/room-garden-mobile.mp4`    |

---

Nothing else to wire up — once a `-mobile.mp4` file exists at the path above,
phones pick it up automatically on next load.
