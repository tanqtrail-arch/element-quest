#!/usr/bin/env python3
"""Split a 3x3 grid card image into 9 individual card images for Stage 1."""
import sys
from pathlib import Path
from PIL import Image

# Element symbols in grid order (left-to-right, top-to-bottom)
ELEMENTS = ["H", "O", "C", "N", "Ca", "P", "K", "Na", "Mg"]

# Crop coordinates for each cell (percentages of full image)
# These are tuned for the ornate frame layout
GRID = [
    # Row 0: top row
    (0.135, 0.055, 0.385, 0.340),   # H  - galaxy/rocket
    (0.395, 0.055, 0.645, 0.340),   # O  - underwater
    (0.655, 0.055, 0.905, 0.340),   # C  - crystals/diamond
    # Row 1: middle row
    (0.135, 0.350, 0.385, 0.645),   # N  - aurora
    (0.395, 0.350, 0.645, 0.645),   # Ca - bones/shells/milk
    (0.655, 0.350, 0.905, 0.645),   # P  - fire/red powder
    # Row 2: bottom row
    (0.135, 0.655, 0.385, 0.945),   # K  - potash/bananas
    (0.395, 0.655, 0.645, 0.945),   # Na - salt/lamp
    (0.655, 0.655, 0.905, 0.945),   # Mg - camera flash
]

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 split-cards.py <input-image>")
        print("Output: public/images/cards/H.png, O.png, C.png, ...")
        sys.exit(1)

    input_path = sys.argv[1]
    img = Image.open(input_path)
    w, h = img.size
    print(f"Source image: {w}x{h}")

    out_dir = Path(__file__).parent.parent / "public" / "images" / "cards"
    out_dir.mkdir(parents=True, exist_ok=True)

    for i, (symbol, (x1, y1, x2, y2)) in enumerate(zip(ELEMENTS, GRID)):
        box = (int(x1 * w), int(y1 * h), int(x2 * w), int(y2 * h))
        card = img.crop(box)
        # Resize to consistent square (400x400)
        card = card.resize((400, 400), Image.LANCZOS)
        out_path = out_dir / f"{symbol}.png"
        card.save(out_path, "PNG", optimize=True)
        print(f"  [{i+1}/9] {symbol}.png saved ({box[2]-box[0]}x{box[3]-box[1]} -> 400x400)")

    print(f"\nDone! Cards saved to {out_dir}")

if __name__ == "__main__":
    main()
