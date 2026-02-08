#!/usr/bin/env python3
"""Generate placeholder card images for Stage 1 elements."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

out_dir = Path(__file__).parent.parent / "public" / "images" / "cards"
out_dir.mkdir(parents=True, exist_ok=True)

# Each element: (symbol, theme colors [top, bottom], emoji representation, theme label)
CARDS = [
    ("H",  [(60, 20, 120), (120, 50, 180)],  "rocket + galaxy", "宇宙"),
    ("O",  [(30, 100, 180), (60, 160, 220)],  "underwater", "海"),
    ("C",  [(80, 60, 40), (50, 40, 30)],       "crystals + diamond", "鉱物"),
    ("N",  [(30, 80, 60), (60, 20, 100)],      "aurora", "大気"),
    ("Ca", [(180, 160, 120), (140, 120, 80)],  "bones + milk", "骨"),
    ("P",  [(180, 50, 30), (140, 30, 20)],     "fire + red", "炎"),
    ("K",  [(180, 160, 40), (140, 100, 30)],   "banana + potash", "果実"),
    ("Na", [(160, 160, 140), (120, 120, 100)], "salt + lamp", "塩"),
    ("Mg", [(200, 140, 40), (160, 100, 30)],   "flash + camera", "光"),
]

SIZE = 400

for symbol, (c_top, c_bot), desc, label in CARDS:
    img = Image.new("RGB", (SIZE, SIZE))
    draw = ImageDraw.Draw(img)

    # Gradient background
    for y in range(SIZE):
        t = y / SIZE
        r = int(c_top[0] * (1 - t) + c_bot[0] * t)
        g = int(c_top[1] * (1 - t) + c_bot[1] * t)
        b = int(c_top[2] * (1 - t) + c_bot[2] * t)
        draw.line([(0, y), (SIZE, y)], fill=(r, g, b))

    # Decorative border
    border = 12
    draw.rounded_rectangle(
        [border, border, SIZE - border, SIZE - border],
        radius=24,
        outline=(255, 255, 255, 100),
        width=3,
    )

    # Inner glow rectangle
    draw.rounded_rectangle(
        [border + 8, border + 8, SIZE - border - 8, SIZE - border - 8],
        radius=20,
        outline=(255, 255, 200, 60),
        width=2,
    )

    # Element symbol (large, centered)
    try:
        font_big = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 120)
        font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 36)
    except OSError:
        font_big = ImageFont.load_default()
        font_small = ImageFont.load_default()

    # Draw symbol with shadow
    bbox = draw.textbbox((0, 0), symbol, font=font_big)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    x = (SIZE - tw) // 2
    y = (SIZE - th) // 2 - 30
    # Shadow
    draw.text((x + 3, y + 3), symbol, fill=(0, 0, 0, 180), font=font_big)
    # Main text
    draw.text((x, y), symbol, fill=(255, 255, 255), font=font_big)

    # Theme label at bottom
    bbox2 = draw.textbbox((0, 0), label, font=font_small)
    tw2 = bbox2[2] - bbox2[0]
    draw.text(((SIZE - tw2) // 2, SIZE - 80), label, fill=(255, 255, 255, 200), font=font_small)

    # Corner decorations
    for cx, cy in [(30, 30), (SIZE - 30, 30), (30, SIZE - 30), (SIZE - 30, SIZE - 30)]:
        draw.ellipse([cx - 4, cy - 4, cx + 4, cy + 4], fill=(255, 255, 200, 120))

    out_path = out_dir / f"{symbol}.png"
    img.save(out_path, "PNG", optimize=True)
    print(f"  {symbol}.png -> {out_path}")

print(f"\nDone! {len(CARDS)} cards saved to {out_dir}")
