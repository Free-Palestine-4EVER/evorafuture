# Evora "Explore by room" — asset generation handoff (Higgsfield MCP)

**Goal:** generate 11 stills + 5 videos via the **higgsfield** MCP and drop them into
`public/evora/` with the exact names below. The section component is already built:
`components/Collections.tsx` (5 cinematic scroll-reveal room films + 6 slide-in "finishing pieces" cards).

## MCP status
- Server added at USER scope: `higgsfield → https://mcp.higgsfield.ai/mcp` (HTTP, OAuth). Already authenticated + ✔ Connected.
- If tools aren't callable, the session started before auth — **restart Claude Code**, then run `/mcp` to confirm, then proceed.

## Models / settings
- Stills → **Nano Banana** (set **Unlimited** mode if available; it's free on plan).
- Videos → **Seedance 2.0 Mini** (the Unlimited one), **720p · 3 seconds**, seeded from the matching poster still.

## Shared style suffix (append to every Nano Banana prompt)
> Evora Future Home, Khalda Amman. Editorial interior photo, photoreal, medium-format. Warm low-afternoon light through sheer linen, long soft shadows. Paper-cream walls #FBF7F0, aged brass, deep emerald, walnut/oak. Calm, expensive, lived-in, no people, no text, gentle film grain.

## 11 stills — Nano Banana (filename = save target in public/evora/)

### Posters (16:9) — also used as Seedance start frame
1. `room-living.jpg` — sunlit living room, low sculpted bouclé sofa in sand, aged-brass coffee table, tall olive tree, floor-to-ceiling linen windows
2. `room-bedrooms.jpg` — serene bedroom, oak platform bed in rumpled white linen, linen nightstands, glowing amber glass lamp, morning light
3. `room-dining.jpg` — long solid-walnut table for ten, sculptural chairs, linear brass pendant, figs + lit taper candles
4. `room-sofas.jpg` — deep curved emerald-velvet modular sofa, plush cushions, marble-brass side table, tactile rug, dusk lamplight
5. `room-garden.jpg` — golden-hour terrace, teak lounge seating with cream cushions, low fire feature, potted olives, Amman skyline

### Cards (3:4 portrait) — OVERWRITE these existing files
6. `p11.jpg` — styled vignette: stacked art books, brass bowl, ceramic vase with pampas on walnut console
7. `p10.jpg` — single statement aged-brass + opal-glass pendant glowing against dim cream wall
8. `p09.jpg` — layered textiles top-down: hand-knotted wool rug in sand/rust, folded linen throws
9. `p02.jpg` — built-in floor-to-ceiling oak wardrobe, one door ajar, soft interior light, brass handles
10. `p04.jpg` — sculptural travertine-and-brass coffee table on rug, design books + lit candle
11. `ig-chesterfield.jpg` — single emerald-velvet channel-tufted armchair, brass legs, in window light

## 5 videos — Seedance 2.0 Mini 720p · 3s (start frame = poster of same name)
1. `room-living.mp4` — slow lateral dolly left→right, soft sun flare at the end
2. `room-bedrooms.mp4` — slow push-in toward the bed, dust motes drifting in the light beam
3. `room-dining.mp4` — slow trucking glide along the table, candle flames flickering
4. `room-sofas.mp4` — slow orbit around the sofa, reflections sliding across the velvet
5. `room-garden.mp4` — slow crane up revealing the terrace and skyline, lanterns glowing

## After download
- Put all files in `~/Desktop/evorafuture/public/evora/`.
- `git add public/evora/room-*.mp4 public/evora/room-*.jpg public/evora/p11.jpg public/evora/p10.jpg public/evora/p09.jpg public/evora/p02.jpg public/evora/p04.jpg public/evora/ig-chesterfield.jpg`
- Commit + push. Refresh `/` — the "Explore by room" section is live with real films + photos.
