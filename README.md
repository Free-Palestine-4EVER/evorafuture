# The Grove — Furniture & Beyond (concept site)

A bilingual (English / Arabic + RTL) concept website built for **The Grove Furniture & Beyond**
(@thegrovejo, Khilda — Amman). Same quality bar / stack as the Plexus Workshop site.

## How to open it

```bash
cd ~/Desktop/Projects/TheGrove/grove-site
npm run dev
```

Then open the URL it prints (usually **http://localhost:3000**, or 3001 if 3000 is busy).

## What's inside (the "expensive technology")

| Section | What it does |
|---|---|
| **Cinematic hero** | Full-screen, smooth-scroll, slow zoom, staggered headline reveal |
| **360° Virtual Showroom** | Drag to look around a real Grove room in 3D, with clickable product hotspots (Three.js) |
| **3D + AR product viewer** | Spin a sofa/chair in 3D; "View in your room" places it in AR on a phone (model-viewer) |
| **Shop the Look** | Hover hotspots on a styled room to price each piece |
| **Concept → Delivered** | Before/after slider for the design & execution service |
| **Collections, Services, Visit, Footer** | Editorial grid, The Grove Promise, contact, bilingual everywhere |

Toggle **العربية / EN** in the top-right — the whole site flips to right-to-left Arabic.

## What is real vs. placeholder

- **Real:** The Grove logo, their actual product/room photography (pulled from their Instagram),
  their categories, handle (103k), location, hours, and real offerings (Safwa installments, care service).
- **Placeholder (swap for the paid build):** product names + JOD prices, the two 3D models
  (royalty-free stand-ins — final would 3D-scan their real pieces), the 360° room
  (a single photo wrapped into a panorama — final would use a real 360° camera capture of their showroom),
  the **testimonials + stats** (2,400+ homes, 4.9★, "since 2017" — sample content; replace with their real
  reviews/numbers), and the **WhatsApp number** in `components/WhatsappCTA.tsx` (`PHONE` constant — swap for
  The Grove's real business line).

## Research-driven conversion features (added after benchmarking Minotti, Roche Bobois, Maiden Home, Aati)

- Sticky **WhatsApp** button (MENA-native lead channel) + **"Book a Design Consultation"** as the primary Visit CTA.
- **Social-proof section**: heritage "since" line, stats row, named client testimonials.
- Quiet/editorial CTAs, 2–3 colour discipline, serif headlines, heavy whitespace — all per luxury-furniture best practice.

## Stack
Next.js 16 · React 19 · Tailwind 4 · Framer Motion · Lenis · Three.js / R3F · @google/model-viewer.
Fonts: Fraunces (display) · Hanken Grotesk (Latin) · IBM Plex Sans Arabic.
# evorafuture
