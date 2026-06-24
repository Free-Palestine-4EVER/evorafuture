# Puffer splat scan — Gaussian splat → furniture

Adds a third room-capture source to Puffer (alongside **LiDAR room scans** and
**2D plans**): a **3D Gaussian splat** of a room → detected furniture → true-size
slots in the editor and 3D dollhouse.

**In the app:** `📥 Import → ✦ Gaussian splat scan`
- **Load splat scan (room demo)** — loads the bundled `public/puffer/room-splat.json`
- **Upload detection (interactions.json)** — load your own

The detection supplies the *type + floor position*; Puffer supplies the *true mm
size* (see `lib/puffer/splatScan.ts → interactionsToScan`, then the existing
`scanToProject`). splat boxes are axis-aligned, so **orientation isn't recovered** —
nudge rotation in the inspector. Detected sizes are coarse and intentionally
ignored ("geometry is sacred"); canonical sizes live in `splatScan.ts`.

## interactions.json format

```json
{ "objects": [
  { "label": "couch", "position": {"x":-1.0,"y":2.2,"z":1.3}, "scale": {"x":2.5,"y":2.6,"z":2.7} }
] }
```
`y` = up axis; `x,z` = floor plane (projected to top-down). `scale` is ignored.
Unknown labels fall back to a generic box; the label→type+size map is in `splatScan.ts`.

## Generate your own — 100% local, no API

Uses **[splat_analyzer](https://github.com/nigelhartman/splat_analyzer)** (3DGS →
OWLv2 → 3D boxes), driven with a clean room **orbit** (its built-in density
camera-placement misfires badly on room splats — renders mostly void/floaters).

```bash
# 1. clone + install splat_analyzer (Apple Silicon / Metal)
git clone https://github.com/nigelhartman/splat_analyzer ~/dev/splat_analyzer
cd ~/dev/splat_analyzer && ./install_mac.sh
./.venv/bin/pip install ninja                 # REQUIRED — missing from requirements-mac.txt
export SPLAT_ANALYZER_DIR=~/dev/splat_analyzer

# 2. render a clean orbit, then detect (from this scripts/splat-detect dir)
PY="$SPLAT_ANALYZER_DIR/.venv/bin/python"
PATH="$SPLAT_ANALYZER_DIR/.venv/bin:$PATH" "$PY" orbit_render.py --ply room.ply --job_dir /tmp/job
WMD_DEVICE=cpu "$PY" detect_only.py /tmp/job "couch, television, table, chair, potted plant, vase, book shelf, rug"
# → /tmp/job/interactions.json  (deduped, upload-ready)
```

Upload `/tmp/job/interactions.json` via **Import → Gaussian splat scan → Upload**.

### Gotchas (verified on an M4, 16 GB)
- **`pip install ninja`** or the first render dies (`Ninja is required to load C++ extensions`) — the Metal kernel JIT-compiles at runtime.
- **`WMD_DEVICE=cpu`** for detection — OWLv2 hangs on MPS (memory pressure). Render still uses the Metal GPU.
- **Splat quality gates detection** — a rough phone/AI-video scan is too floater-heavy; use a clean capture (≥30k-iter train, good footage). A clean ~1M-gaussian real-photo room splat detects 8+ furniture types cleanly.
- Splats are **up-to-scale** — pass `--ply` of a roughly metric splat, or calibrate `metersPerUnit` in `interactionsToScan` (default 1).
