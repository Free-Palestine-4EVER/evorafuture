#!/usr/bin/env python3
"""
Run splat_analyzer's OWLv2 detection + 3D clustering on a pre-rendered job dir
(frames/ + transforms.json from orbit_render.py), then dedupe to the best box per
label and write an upload-ready interactions.json.  See ./README.md.

  WMD_DEVICE=cpu $SPLAT_ANALYZER_DIR/.venv/bin/python detect_only.py \
      /tmp/job "couch, television, table, chair, potted plant, vase, book shelf, rug" \
      [min_votes=3] [min_peak=0.30] [score_thr=0.10]
"""
import sys, os, json
from pathlib import Path
os.environ.setdefault("PYTORCH_ENABLE_MPS_FALLBACK", "1")
REPO = os.environ.get("SPLAT_ANALYZER_DIR") or os.path.expanduser("~/dev/splat_analyzer")
sys.path.insert(0, REPO)
import numpy as np
import pipeline

job = Path(sys.argv[1]); prompt = sys.argv[2]
min_votes = int(sys.argv[3]) if len(sys.argv) > 3 else 3
min_peak = float(sys.argv[4]) if len(sys.argv) > 4 else 0.30
score_thr = float(sys.argv[5]) if len(sys.argv) > 5 else 0.10

tr = json.load(open(job / "transforms.json"))
cam_pos = np.array([f["transform_matrix"] for f in tr["frames"]])[:, :3, 3]
scene_radius = float(np.linalg.norm(cam_pos, axis=1).mean())
labels = [l.strip() for l in prompt.split(",") if l.strip()]

print(f"[detect] {len(tr['frames'])} frames · {len(labels)} labels · "
      f"votes>={min_votes} peak>={min_peak} score>={score_thr}")
raw = pipeline._run_owlv2(job / "frames", labels, tr, scene_radius, score_threshold=score_thr)
clustered = pipeline._cluster_detections(
    raw, eps_m=tr.get("scene_radius", scene_radius) * 0.20,
    max_per_label=3, min_votes=min_votes, min_peak_score=min_peak)

# best cluster per label (most votes, then highest peak score) → clean, upload-ready
best = {}
for label, pos, scale, members in clustered:
    peak = max((m["score"] for m in members), default=0.0)
    rank = (len(members), peak)
    if label not in best or rank > best[label][0]:
        best[label] = (rank, pos, scale)

objects = [{
    "label": label,
    "position": {"x": float(pos[0]), "y": float(pos[1]), "z": float(pos[2])},
    "scale": {"x": float(s[0]), "y": float(s[1]), "z": float(s[2])},
} for label, (_, pos, s) in best.items()]

json.dump({"source": "splat_analyzer (orbit + OWLv2)", "objects": objects},
          open(job / "interactions.json", "w"), indent=2)
print(f"[detect] => {len(objects)} objects: {[o['label'] for o in objects]}")
print("[detect] wrote", job / "interactions.json", "— upload via Import → Gaussian splat scan")
