"""
Post-production des images de la V2 (maquette CAP Fitness) : recadrage,
étalonnage « nuit » en noir et blanc vrai, provenance. Brief : docs/brief/v2.md §3.

    python3 art/v2/grade.py <dossier-des-PNG-bruts> [--only id1,id2]
    python3 art/v2/grade.py --check

Réutilise art/grade.py (géométrie, prompt embarqué). Le grain n'est pas cuit :
il est posé en CSS (public/v2/grain.png), les fichiers se compressent mieux.

`--check` relit les plaques livrées et chaque recadrage servi (CROPS de
scripts/build-images.mjs) et vérifie : noir et blanc vrai (R = G = B), points
noir et blanc, médiane en clé basse, et la luminance sous chaque zone de texte
(p95 de Y linéaire ≤ max_y). Rapport : art/v2/grade-report.json ; sortie en
erreur si une cible est manquée.
"""
from __future__ import annotations

import json
import sys
from dataclasses import dataclass, field
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ART = Path(__file__).resolve().parent
sys.path.insert(0, str(ART.parent))
import grade as v1  # noqa: E402  (art/grade.py)

ROOT = ART.parent.parent
LUMA = np.array([0.2126, 0.7152, 0.0722])


def to_linear(c):
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def to_srgb(y):
    return np.where(y <= 0.0031308, 12.92 * y, 1.055 * np.power(np.clip(y, 0, 1), 1 / 2.4) - 0.055)


@dataclass(frozen=True)
class Zone:
    """Zone de texte, en fractions de la plaque (ou du recadrage) livrée."""

    name: str
    x0: float
    y0: float
    x1: float
    y1: float
    max_y: float  # p95 maximal de Y (luminance linéaire) sous la zone
    ev: float = 0.0  # assombrissement appliqué, plafonné à 0,6


@dataclass(frozen=True)
class Crop:
    """Recadrage servi aux écrans étroits (même définition que CROPS dans build-images.mjs)."""

    name: str
    aspect: float  # largeur / hauteur
    focal_x: float
    zones: tuple[Zone, ...] = ()


@dataclass(frozen=True)
class Burn:
    """Brûlage local (retouche) : une fenêtre trop claire sous une colonne de texte."""

    x0: float
    y0: float
    x1: float
    y1: float
    ev: float
    feather: float = 0.05


@dataclass(frozen=True)
class Plate:
    master: str
    size: tuple[int, int]
    focal: tuple[float, float] = (0.5, 0.5)
    zones: tuple[Zone, ...] = ()
    crops: tuple[Crop, ...] = field(default_factory=tuple)
    burns: tuple[Burn, ...] = ()

    @property
    def target(self) -> Path:
        return ROOT / "art/masters/v2" / f"{self.master}.jpg"


SCENE_TEXT = Zone("colonne de texte", 0, 0, 0.57, 1, 0.10, 0.6)

PLATES = [
    Plate(
        "cap-couverture", (2880, 1728), (0.80, 0.45),
        zones=(
            Zone("en-tête", 0, 0, 1, 0.09, 0.10, 0.3),
            Zone("titre", 0, 0.31, 0.81, 0.66, 0.12, 0.4),
            Zone("texte", 0.10, 0.68, 0.55, 0.98, 0.10, 0.4),
        ),
        # Haut des fenêtres sous l'en-tête transparent : brûlé, le plafond garde la nuit.
        burns=(Burn(0.5, 0.0, 1.0, 0.11, 2.6, 0.05),),
        crops=(
            Crop("cap-couverture-mobile", 1 / 2, 0.86, zones=(
                Zone("en-tête", 0, 0, 1, 0.08, 0.10),
                Zone("titre et texte", 0, 0.54, 1, 1, 0.12),
            )),
        ),
    ),
    Plate("cap-pound", (2880, 1800), (0.70, 0.5), zones=(SCENE_TEXT,),
          crops=(Crop("cap-pound-mobile", 4 / 5, 0.74),)),
    # Fenêtres de la rue sous la colonne de texte : brûlées (la nuit les assombrit déjà).
    Plate("cap-jump", (2880, 1800), (0.68, 0.5), zones=(SCENE_TEXT,),
          crops=(Crop("cap-jump-mobile", 4 / 5, 0.70),),
          burns=(Burn(0.30, 0.0, 0.52, 0.52, 2.6),)),
    Plate("cap-step", (2880, 1800), (0.66, 0.6), zones=(SCENE_TEXT,),
          crops=(Crop("cap-step-mobile", 4 / 5, 0.64),),
          burns=(Burn(0.0, 0.0, 0.62, 0.40, 2.0, 0.08), Burn(0.0, 0.36, 0.52, 1.0, 1.9, 0.12))),
    Plate("cap-force", (1240, 1654), (0.45, 0.45)),
    Plate("cap-calme", (960, 1200), (0.35, 0.6)),
    Plate(
        "cap-famille", (2880, 1620), (0.55, 0.4),
        zones=(Zone("bas", 0, 0.86, 1, 1, 0.12, 0.5),),
        crops=(Crop("cap-famille-mobile", 4 / 5, 0.55, zones=(Zone("bas", 0, 0.88, 1, 1, 0.12),)),),
    ),
    Plate(
        "cap-lieu", (2880, 1234), (0.55, 0.5),
        zones=(
            Zone("titre", 0, 0.52, 0.72, 0.96, 0.12, 0.55),
            Zone("bas du recadrage mobile", 0.229, 0.62, 0.571, 0.98, 0.12, 0.45),
        ),
        crops=(Crop("cap-lieu-mobile", 4 / 5, 0.40, zones=(Zone("bas", 0, 0.62, 1, 0.98, 0.10),)),),
    ),
]

MODELS = {j["id"]: j.get("model", "nano_banana_2") for j in
          json.loads((ART / "manifest.json").read_text()).get("jobs", [])} if (ART / "manifest.json").exists() else {}


def grade_nuit(img: np.ndarray, zones: tuple[Zone, ...], burns: tuple[Burn, ...] = ()) -> np.ndarray:
    """N&B vrai, clé basse, noirs denses, hautes lumières tenues. img : sRGB 0..1, HxWx3."""
    v = to_srgb(to_linear(img) @ LUMA)  # 1. N&B vrai (luminance Rec. 709 en linéaire)
    lo, hi = np.percentile(v, [0.5, 99.7])  # 2. niveaux
    v = np.clip((v - lo) / max(hi - lo, 1e-6), 0, 1)
    k, p = 3.0, 0.40  # 3. courbe en S logistique, pente ≈ 1,20 au pivot 0,40
    f = lambda x: 1 / (1 + np.exp(-k * (x - p)))  # noqa: E731
    v = (f(v) - f(0)) / (f(1) - f(0))
    v = 0.015 + v * (0.90 - 0.015)  # point noir #040404, point blanc #E6E6E6
    y = to_linear(v)
    h, w = y.shape  # 4. vignettage −0,35 IL aux coins, départ à 55 % de la demi-diagonale
    yy, xx = np.mgrid[0:h, 0:w]
    r = np.hypot((xx / w - 0.5) / 0.5, (yy / h - 0.5) / 0.5) / np.sqrt(2)
    t = np.clip((r - 0.55) / 0.45, 0, 1)
    y = y * 2 ** (-0.35 * t * t * (3 - 2 * t))
    for z in zones:  # 5. zones de texte : assombrissement en fondu sur 12 % de la largeur
        if z.ev:
            dx = np.maximum(np.maximum(z.x0 - xx / w, xx / w - z.x1), 0)
            dy = np.maximum(np.maximum(z.y0 - yy / h, yy / h - z.y1), 0)
            m = np.clip(1 - np.hypot(dx, dy) / 0.12, 0, 1)
            y = y * 2 ** (-min(z.ev, 0.6) * m)
    for b in burns:  # 6. brûlages locaux (retouche documentée, au-delà du plafond des zones)
        dx = np.maximum(np.maximum(b.x0 - xx / w, xx / w - b.x1), 0)
        dy = np.maximum(np.maximum(b.y0 - yy / h, yy / h - b.y1), 0)
        m = np.clip(1 - np.hypot(dx, dy) / b.feather, 0, 1)
        y = y * 2 ** (-b.ev * m * m * (3 - 2 * m))
    return to_srgb(y)


def xmp_packet_cap(model: str) -> bytes:
    """Même structure que v1.xmp_packet (IPTC trainedAlgorithmicMedia), description propre à la V2."""
    description = (
        f"Image générée par IA (Higgsfield, modèle {model}), étalonnée par art/v2/grade.py. "
        "Personnes fictives. Visuel d'illustration pour une maquette non officielle de CAP Fitness by EBC Sport."
    )
    original = v1.xmp_packet(model).decode("utf-8")
    start = original.index('<rdf:li xml:lang="fr">') + len('<rdf:li xml:lang="fr">')
    end = original.index("</rdf:li>", start)
    return (original[:start] + description + original[end:]).encode("utf-8")


def produce(plate: Plate, raw: Path) -> dict:
    src = np.asarray(Image.open(raw / f"{plate.master}.png").convert("RGB"), dtype=np.float64) / 255
    h, w = src.shape[:2]
    inset = v1.rounded_corner_inset(src)
    left, top, right, bottom = v1.crop_box(w, h, inset, plate.size[0] / plate.size[1], plate.focal)
    cropped = Image.fromarray((src[top:bottom, left:right] * 255).round().astype(np.uint8))
    out = np.asarray(cropped.resize(plate.size, Image.LANCZOS), dtype=np.float64) / 255
    v = grade_nuit(out, plate.zones, plate.burns)
    gray = Image.fromarray((np.clip(v, 0, 1) * 255).round().astype(np.uint8), "L")
    gray = gray.filter(ImageFilter.UnsharpMask(radius=0.6, percent=40, threshold=0))
    plate.target.parent.mkdir(parents=True, exist_ok=True)
    gray.save(plate.target, "JPEG", quality=90, optimize=True, progressive=True,
              xmp=xmp_packet_cap(MODELS.get(plate.master, "nano_banana_2")))
    v1.embed_prompt(plate.target, ART / "prompts" / f"{plate.master}.prompt.txt")
    return {"target": str(plate.target.relative_to(ROOT)), "size": plate.size,
            "kb": round(plate.target.stat().st_size / 1024)}


def crop_array(arr: np.ndarray, aspect: float, focal_x: float) -> np.ndarray:
    """Même calcul que processCrop (scripts/build-images.mjs) : pleine hauteur, centrée sur focal_x."""
    h, w = arr.shape[:2]
    cw = round(h * aspect)
    left = min(max(round(w * focal_x - cw / 2), 0), w - cw)
    return arr[:, left:left + cw]


def measure(v: np.ndarray, zones: tuple[Zone, ...], channels_equal: bool) -> dict:
    h, w = v.shape
    y = to_linear(v)
    report = {
        "gris_vrai": channels_equal,
        "p5": round(float(np.percentile(v, 5)), 4),
        "mediane": round(float(np.median(v)), 4),
        "p99": round(float(np.percentile(v, 99)), 4),
        "zones": {},
    }
    # Clé basse voulue (70 % de noir dans plusieurs prompts) : la médiane n'a qu'un plafond.
    ok = channels_equal and report["p5"] <= 0.03 and report["mediane"] <= 0.28 and report["p99"] >= 0.66
    for z in zones:
        region = y[int(z.y0 * h):max(int(z.y1 * h), int(z.y0 * h) + 1), int(z.x0 * w):max(int(z.x1 * w), int(z.x0 * w) + 1)]
        p95 = float(np.percentile(region, 95))
        report["zones"][z.name] = {"p95_Y": round(p95, 4), "max_y": z.max_y, "ok": p95 <= z.max_y}
        ok = ok and p95 <= z.max_y
    report["ok"] = bool(ok)
    return report


def check() -> int:
    results = {}
    failed = False
    for plate in PLATES:
        if not plate.target.exists():
            results[plate.master] = {"ok": False, "erreur": "plaque absente"}
            failed = True
            continue
        image = Image.open(plate.target)
        rgb = np.asarray(image.convert("RGB"), dtype=np.int16)
        equal = bool(np.all(rgb[..., 0] == rgb[..., 1]) and np.all(rgb[..., 1] == rgb[..., 2]))
        v = rgb[..., 0].astype(np.float64) / 255
        results[plate.master] = measure(v, plate.zones, equal)
        failed |= not results[plate.master]["ok"]
        for crop in plate.crops:
            cv = crop_array(v, crop.aspect, crop.focal_x)
            report = measure(cv, crop.zones, equal)
            # Le recadrage hérite des points noir et blanc de la plaque : seules ses zones comptent.
            report["ok"] = all(z["ok"] for z in report["zones"].values()) and equal
            results[crop.name] = report
            failed |= not report["ok"]
    (ART / "grade-report.json").write_text(json.dumps(results, indent=2, ensure_ascii=False) + "\n")
    for name, report in results.items():
        status = "ok " if report.get("ok") else "ÉCHEC"
        zones = ", ".join(f"{k} {z['p95_Y']}/{z['max_y']}" for k, z in report.get("zones", {}).items())
        print(f"{status} {name:24} p5 {report.get('p5')} méd {report.get('mediane')} p99 {report.get('p99')} {zones}")
    return 1 if failed else 0


if __name__ == "__main__":
    if "--check" in sys.argv:
        sys.exit(check())
    raw = Path(sys.argv[1])
    only = set(sys.argv[sys.argv.index("--only") + 1].split(",")) if "--only" in sys.argv else None
    for plate in PLATES:
        if only and plate.master not in only:
            continue
        if not (raw / f"{plate.master}.png").exists():
            print(f"  ! brut absent : {plate.master}")
            continue
        report = produce(plate, raw)
        print(f"{plate.master:18} → {report['target']}  {report['size']}  {report['kb']} Ko")
