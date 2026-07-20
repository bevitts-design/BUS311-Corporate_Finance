#!/usr/bin/env python3
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
HEROES = ROOT / "assets" / "lesson-media" / "heroes"

for track in ("foundations", "valuation", "decisions"):
    source = HEROES / f"{track}-source.png"
    target = HEROES / f"{track}.webp"
    with Image.open(source) as image:
        image = image.convert("RGB")
        if image.width > 1920:
            height = round(image.height * 1920 / image.width)
            image = image.resize((1920, height), Image.Resampling.LANCZOS)
        image.save(target, "WEBP", quality=82, method=6)
    print(f"Prepared {target.relative_to(ROOT)}")
