"""
Tuile de grain de la V2 : 64 × 64, niveaux de gris, moyenne 0,5, écart type
0,03. Posée en CSS par-dessus les photos (mix-blend-mode: overlay, opacité 0,07)
au lieu d'être cuite dans les JPEG, qui se compressent ainsi bien mieux.

    python3 art/v2/grain.py
"""
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
TARGET = ROOT / "public/v2/grain.png"

rng = np.random.default_rng(2026)
tile = np.clip(rng.normal(0.5, 0.03, (64, 64)), 0, 1)
TARGET.parent.mkdir(parents=True, exist_ok=True)
Image.fromarray((tile * 255).round().astype(np.uint8), "L").save(TARGET, optimize=True)
print(f"{TARGET.relative_to(ROOT)} : {TARGET.stat().st_size} o")
