"""
Post-production des images de la direction B (/v2) : recadrage, étalonnage
« Jour de club », grain, provenance. Même chaîne que la V1 (art/grade.py), dont
ce script réutilise la géométrie, le grain et l'écriture des métadonnées.

    python3 art/v2/grade.py <dossier-des-PNG-bruts> [--only id1,id2]

Une seule famille, « jour » : la lumière du jour reste celle de la prise. On ne
fait que tenir la série ensemble (noirs posés au même niveau, légère courbe,
verts et jaunes du kit gardés francs) et poser le même grain partout.
"""
from __future__ import annotations

import json
import sys
from dataclasses import dataclass
from pathlib import Path

import numpy as np
from PIL import Image

ART = Path(__file__).resolve().parent
sys.path.insert(0, str(ART.parent))
import grade as v1  # noqa: E402  (art/grade.py : géométrie, grain, XMP, prompt embarqué)

ROOT = ART.parent.parent
MODELS = {j["id"]: j["model"] for j in json.loads((ART / "manifest.json").read_text())["jobs"]}


@dataclass(frozen=True)
class Plate:
    master: str  # id du master (= nom du PNG brut et du prompt)
    size: tuple[int, int]  # taille livrée (2x)
    focal: tuple[float, float] = (0.5, 0.5)  # centre du recadrage, en fraction du master
    zoom: float = 1.0  # > 1 : recadrage plus serré (cadrage aligné sur le reste de la série)


SQUAD = ["alex-vance", "sarah-jenkins", "marcus-roy", "elena-rostova", "drake-torres"]
DISCIPLINES = ["force", "cross-training", "boxe", "mobilite", "cardio", "recuperation"]
PLATES = [
    # Alex est cadré plus large que les autres portraits : on resserre au même niveau.
    *[
        Plate(f"squad-{slug}", (960, 1200), (0.5, 0.37) if slug == "alex-vance" else (0.5, 0.5),
              1.3 if slug == "alex-vance" else 1.0)
        for slug in SQUAD
    ],
    Plate("squad-team-photo", (2880, 1222), (0.5, 0.52)),
    Plate("method-squat", (1280, 1600)),
    # La force est cadrée en pied, plus petite que les autres disciplines : on resserre.
    *[
        Plate(f"discipline-{slug}", (1200, 1500), (0.5, 0.55) if slug == "force" else (0.5, 0.5),
              1.1 if slug == "force" else 1.0)
        for slug in DISCIPLINES
    ],
    Plate("clubhouse-floor", (2400, 1350)),
    Plate("clubhouse-vestiaire", (1200, 1500)),
    Plate("clubhouse-accueil", (1200, 1500)),
    *[Plate(f"tribune-{slug}", (720, 720), (0.5, 0.45)) for slug in ["camille", "bernard", "yanis"]],
]


def grade_jour(img: np.ndarray) -> np.ndarray:
    """« Jour de club » : noirs posés à 3 %, courbe douce, couleurs du kit gardées."""
    lum = v1.luminance(img)
    lo, hi = np.percentile(lum, [0.5, 99.7])
    out = np.clip((img - lo) / max(hi - lo, 1e-6), 0, 1)
    out = 0.03 + out * 0.965
    return v1.s_curve(out, 1.05, 0.46)


def produce(plate: Plate, raw: Path, seed: int) -> dict:
    src = np.asarray(Image.open(raw / f"{plate.master}.png").convert("RGB"), dtype=np.float64) / 255
    h, w = src.shape[:2]
    inset = v1.rounded_corner_inset(src)
    ratio = plate.size[0] / plate.size[1]
    left, top, right, bottom = v1.crop_box(w, h, inset, ratio, plate.focal)
    if plate.zoom != 1.0:
        cw, ch = (right - left) / plate.zoom, (bottom - top) / plate.zoom
        cx, cy = plate.focal[0] * w, plate.focal[1] * h
        left, top = round(cx - cw / 2), round(cy - ch / 2)
        right, bottom = round(left + cw), round(top + ch)
    cropped = Image.fromarray((src[top:bottom, left:right] * 255).round().astype(np.uint8))
    out = np.asarray(cropped.resize(plate.size, Image.LANCZOS), dtype=np.float64) / 255
    out = v1.add_grain(grade_jour(out), seed)

    job = next(j for j in json.loads((ART / "manifest.json").read_text())["jobs"] if j["id"] == plate.master)
    target = ROOT / job["target"]
    target.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray((out * 255).round().astype(np.uint8)).save(
        target, "JPEG", quality=90, subsampling=2, optimize=True, progressive=True,
        xmp=v1.xmp_packet(MODELS[plate.master]),
    )
    v1.embed_prompt(target, ART / "prompts" / f"{plate.master}.prompt.txt")
    return {"target": job["target"], "size": plate.size, "crop": (left, top, right, bottom),
            "kb": round(target.stat().st_size / 1024)}


if __name__ == "__main__":
    raw = Path(sys.argv[1])
    only = set(sys.argv[sys.argv.index("--only") + 1].split(",")) if "--only" in sys.argv else None
    for index, plate in enumerate(PLATES):
        if only and plate.master not in only:
            continue
        report = produce(plate, raw, seed=1000 + index)
        print(f"{plate.master:28} → {report['target']}  {report['size']}  {report['kb']} Ko")
