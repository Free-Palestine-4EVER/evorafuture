#!/usr/bin/env python3
"""Slice the dining-room hero into per-object crops for Meshy image-to-3D."""
from PIL import Image
import os

SRC = os.path.expanduser("~/Downloads/p06-2.jpg")
OUT = os.path.join(os.path.dirname(__file__), "crops")
os.makedirs(OUT, exist_ok=True)

img = Image.open(SRC).convert("RGB")
W, H = img.size  # 2048 x 1365

# (name, left, upper, right, lower) — generous boxes; refine after viewing
BOXES = {
    "table":             (560, 600, 1450, 1210),
    "chair-boucle-front":(285, 615, 790, 1265),
    "chair-boucle-right":(1120, 615, 1530, 990),
    "chair-oak":         (1225, 625, 1670, 1275),
    "sideboard":         (1410, 535, 2048, 985),
    "chandelier":        (675, 105, 1325, 385),
    "lamp":              (1295, 345, 1505, 645),
    "artwork":           (1465, 65, 2005, 485),
    "rug":               (225, 1055, 1790, 1365),
    "vases":             (865, 455, 1145, 765),
}

def clamp(b):
    l, u, r, lo = b
    return (max(0, l), max(0, u), min(W, r), min(H, lo))

for name, box in BOXES.items():
    crop = img.crop(clamp(box))
    path = os.path.join(OUT, f"{name}.png")
    crop.save(path)
    print(f"{name:20s} {crop.size[0]}x{crop.size[1]}  -> {path}")

print(f"\nDone. {len(BOXES)} crops in {OUT}")
