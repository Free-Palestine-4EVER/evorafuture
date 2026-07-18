#!/usr/bin/env python3
"""Resize a Higgsfield product photo and stamp the Evora logo in the same
bottom-right position on every image, at a consistent size relative to the
image width — used for the 100-item Shop image catalogue.

Usage: watermark-shop.py <input.png> <output.jpg>
"""
import sys
from PIL import Image

LOGO_PATH = "public/textures/evora-logo.png"
TARGET_W = 1600  # matches other shop imagery; keeps files light
MARGIN_FRAC = 0.035  # margin from each edge, as a fraction of image width
LOGO_FRAC = 0.11     # logo width, as a fraction of image width
LOGO_OPACITY = 0.82   # slightly soft so it reads as a mark, not a sticker


def main():
    src, dst = sys.argv[1], sys.argv[2]
    img = Image.open(src).convert("RGB")
    w, h = img.size
    if w != TARGET_W:
        new_h = round(h * TARGET_W / w)
        img = img.resize((TARGET_W, new_h), Image.LANCZOS)
        w, h = img.size

    logo = Image.open(LOGO_PATH).convert("RGBA")
    logo_w = round(w * LOGO_FRAC)
    logo_h = round(logo_w * logo.height / logo.width)
    logo = logo.resize((logo_w, logo_h), Image.LANCZOS)

    if LOGO_OPACITY < 1:
        alpha = logo.split()[3].point(lambda a: int(a * LOGO_OPACITY))
        logo.putalpha(alpha)

    margin = round(w * MARGIN_FRAC)
    pos = (w - logo_w - margin, h - logo_h - margin)

    canvas = img.convert("RGBA")
    canvas.alpha_composite(logo, pos)
    canvas.convert("RGB").save(dst, "JPEG", quality=92)


if __name__ == "__main__":
    main()
