#!/usr/bin/env python3
"""
Render a clean inward-looking room ORBIT from a Gaussian splat, reusing
splat_analyzer's gsplat-metal renderer (its built-in density camera sampler
misfires on room splats). Writes frames/ + transforms.json + a contact sheet,
in the exact format pipeline._run_owlv2 expects.  See ./README.md.

  SPLAT_ANALYZER_DIR=~/dev/splat_analyzer \
  $SPLAT_ANALYZER_DIR/.venv/bin/python orbit_render.py --ply room.ply --job_dir /tmp/job
"""
import sys, os, math, json, argparse
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

REPO = os.environ.get("SPLAT_ANALYZER_DIR") or os.path.expanduser("~/dev/splat_analyzer")
sys.path.insert(0, REPO)
import numpy as np
import torch
from render_cameras import _load_ply_arrays, _lookat, _write_frame, _depth_to_vis
from renderers import get_renderer


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ply", required=True)
    ap.add_argument("--job_dir", required=True)
    ap.add_argument("--n_az", type=int, default=12)
    ap.add_argument("--cam_r_frac", type=float, default=1.05)   # camera ring radius / content_r
    ap.add_argument("--content_pct", type=float, default=38)    # percentile of dist for content_r
    ap.add_argument("--fov", type=float, default=75)
    ap.add_argument("--up", type=float, default=1.0)            # +1 or -1 (vertical axis sign)
    ap.add_argument("--heights", type=str, default="-0.05,0.28")  # ring heights, frac of content_r above centre
    ap.add_argument("--target_dy", type=float, default=-0.05)  # look this far below centre (frac content_r)
    ap.add_argument("--w", type=int, default=512)
    ap.add_argument("--h", type=int, default=512)
    a = ap.parse_args()

    job = Path(a.job_dir); frames = job / "frames"; frames.mkdir(parents=True, exist_ok=True)
    arrays = _load_ply_arrays(a.ply)
    means = arrays["means"].astype(np.float64)
    renderer = get_renderer("auto"); g = renderer.prepare(arrays); device = renderer.device

    center = np.median(means, axis=0)
    dist = np.linalg.norm(means - center, axis=1)
    content_r = float(np.percentile(dist, a.content_pct))
    cam_r = content_r * a.cam_r_frac
    up = np.array([0.0, a.up, 0.0], dtype=np.float32)
    target = (center + np.array([0, a.target_dy * content_r, 0])).astype(np.float32)
    hfracs = [float(x) for x in a.heights.split(",")]
    azs = np.linspace(0, 2 * math.pi, a.n_az, endpoint=False)

    poses, pidx = [], []
    for hi, hf in enumerate(hfracs):
        for az in azs:
            eye = center + np.array([cam_r * math.cos(az), hf * content_r, cam_r * math.sin(az)])
            poses.append(_lookat(eye.astype(np.float32), target, up)); pidx.append(hi)
    total = len(poses)

    fov = math.radians(a.fov); fl = a.w / (2 * math.tan(fov / 2)); cx, cy = a.w / 2, a.h / 2
    K = torch.tensor([[fl, 0, cx], [0, fl, cy], [0, 0, 1]], dtype=torch.float32, device=device)
    all_w2c = torch.linalg.inv(torch.tensor(np.stack(poses), device=device, dtype=torch.float32))

    transforms = {"fl_x": fl, "fl_y": fl, "cx": cx, "cy": cy, "w": a.w, "h": a.h,
                  "scene_center": center.tolist(), "scene_radius": content_r, "frames": []}
    with ThreadPoolExecutor(max_workers=4) as pool:
        futs = []
        for b0 in range(0, total, 24):
            b1 = min(b0 + 24, total)
            rgb = renderer.render_rgb(g, all_w2c[b0:b1].contiguous(), K, a.w, a.h)
            dep = renderer.render_depth(g, all_w2c[b0:b1].contiguous(), K, a.w, a.h)
            for bi, idx in enumerate(range(b0, b1)):
                futs.append(pool.submit(_write_frame, frames, idx, rgb[bi], dep[bi], _depth_to_vis(dep[bi])))
                transforms["frames"].append({
                    "file_path": f"frames/frame_{idx:04d}.png",
                    "depth_path": f"frames/depth_{idx:04d}.png",
                    "transform_matrix": poses[idx].tolist(), "position_idx": int(pidx[idx])})
        for f in as_completed(futs):
            f.result()
    json.dump(transforms, open(job / "transforms.json", "w"), indent=2)

    from PIL import Image, ImageDraw
    fs = sorted(frames.glob("frame_*.png")); cols = a.n_az; th = 150
    rows = (len(fs) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * th, rows * th), (25, 25, 28)); dr = ImageDraw.Draw(sheet)
    for i, fp in enumerate(fs):
        sheet.paste(Image.open(fp).convert("RGB").resize((th, th)), ((i % cols) * th, (i // cols) * th))
        dr.text(((i % cols) * th + 3, (i // cols) * th + 3), str(i), fill=(0, 255, 120))
    sheet.save(job / "contact.png")
    print(f"center={center.round(2)} content_r={content_r:.2f} cam_r={cam_r:.2f} total={total}")
    print("inspect:", job / "contact.png", "— if mostly void/floaters, tune --content_pct/--cam_r_frac/--up")


if __name__ == "__main__":
    main()
