"""
Post-production des images CLUSEM : recadrage, étalonnage par famille, grain,
métadonnées de provenance.

    python3 art/grade.py <dossier-des-masters> [--only id1,id2]

- Les masters bruts (PNG Higgsfield) ne sont pas versionnés : ils se
  retrouvent par leur job_id (art/manifest.json). Ce script produit les masters
  étalonnés (JPEG) dans art/masters/, aux tailles attendues par app/data/home.ts ;
  scripts/build-images.mjs en tire ensuite les variantes web (AVIF, WebP, JPEG).
- Une famille d'étalonnage = une même courbe, une même teinte d'ombre et un
  même grain pour toutes ses images (cohérence que le prompt seul ne garantit
  pas). Familles : crimson (hero, footer), teal (équipe, programme, About),
  mono (services ; l'état actif rouge est fait en CSS), warm (témoignages, avis).
- Provenance : XMP IPTC « trainedAlgorithmicMedia » (image générée par IA)
  écrit ici, puis le prompt exact embarqué par `impeccable embed-prompt` si la
  variable IMPECCABLE pointe vers son lanceur.

Dépendances (outillage, pas le site) : Pillow ≥ 11, numpy.
"""
from __future__ import annotations

import json
import os
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
MANIFEST = json.loads((ROOT / "art" / "manifest.json").read_text())
MODELS = {j["id"]: j["model"] for j in MANIFEST["production"]["jobs"]}


@dataclass(frozen=True)
class Plate:
    master: str  # id du master (= nom du PNG brut et du prompt)
    target: str  # chemin livré, relatif à la racine
    size: tuple[int, int]  # taille livrée (2x)
    family: str
    focal: tuple[float, float] = (0.5, 0.5)  # centre du recadrage, en fraction du master
    fade_bottom: bool = False  # fondu vers le fond de section (#040F0E), portraits d'équipe


TEAM = ["alex-vance", "sarah-jenkins", "marcus-roy", "elena-rostova", "drake-torres"]
PLATES = [
    Plate("hero-athlete--take-1", "art/masters/hero/hero-athlete.jpg", (2880, 2204), "crimson", (0.57, 0.33)),
    Plate("footer-pushup", "art/masters/footer/footer-pushup.jpg", (2880, 1700), "crimson", (0.45, 0.4)),
    Plate("about-coach-alex-vance", "art/masters/about/coach-alex-vance.jpg", (1280, 736), "teal", (0.5, 0.35)),
    *[
        Plate(f"about-reviewer-0{i}", f"art/masters/about/reviewer-0{i}.jpg", (160, 160), "warm")
        for i in range(1, 6)
    ],
    *[
        Plate(f"service-0{i}-{slug}", f"art/masters/services/service-0{i}-{slug}.jpg", (880, 496), "mono")
        for i, slug in enumerate(["coaching", "force", "fonctionnel", "conditioning"], start=1)
    ],
    Plate("program-marcus-roy", "art/masters/programs/program-marcus-roy.jpg", (1040, 1064), "teal", (0.5, 0.45)),
    *[
        Plate(f"team-0{i}-{slug}", f"art/masters/team/team-0{i}-{slug}.jpg", (720, 904), "teal", fade_bottom=True)
        for i, slug in enumerate(TEAM, start=1)
    ],
    *[
        Plate(f"testimonial-0{i}-{slug}", f"art/masters/testimonials/testimonial-0{i}-{slug}.jpg", (1600, 748), "warm")
        for i, slug in enumerate(["jordan-tucker", "nadia-benali", "paul-mercier"], start=1)
    ],
]

# ── Géométrie ──────────────────────────────────────────────────────────────────


SAFETY_INSET = 0.03  # fraction du petit côté rognée sur tous les bords


def rounded_corner_inset(img: np.ndarray) -> int:
    """
    Les modèles rendent parfois l'image avec des coins arrondis, blancs ou noirs
    (bruités, donc indétectables à coup sûr). On rogne toujours une marge de
    sécurité, et davantage quand un coin blanc mesurable est plus grand.
    """
    h, w = img.shape[:2]
    inset = round(SAFETY_INSET * min(w, h))
    white = img.min(axis=2) > 0.92
    if all(white[y, x] for y, x in [(0, 0), (0, w - 1), (h - 1, 0), (h - 1, w - 1)]):
        radius = 0
        while radius < w // 4 and white[0, radius]:
            radius += 1
        # Le coin arrondi ne déborde pas au-delà de r·(1 − 1/√2) sur la diagonale.
        inset = max(inset, int(np.ceil(radius * (1 - 1 / np.sqrt(2)))) + 8)
    return inset


def crop_box(w: int, h: int, inset: int, ratio: float, focal: tuple[float, float]) -> tuple[int, int, int, int]:
    """Plus grand cadre au ratio cible dans le master (moins l'inset), centré sur le point focal."""
    aw, ah = w - 2 * inset, h - 2 * inset
    cw, ch = (aw, round(aw / ratio)) if aw / ah < ratio else (round(ah * ratio), ah)
    cx = min(max(focal[0] * w, inset + cw / 2), w - inset - cw / 2)
    cy = min(max(focal[1] * h, inset + ch / 2), h - inset - ch / 2)
    left, top = round(cx - cw / 2), round(cy - ch / 2)
    return left, top, left + cw, top + ch


# ── Étalonnage (images en flottants 0..1, sRGB) ────────────────────────────────


def luminance(img: np.ndarray) -> np.ndarray:
    return img @ np.array([0.2126, 0.7152, 0.0722])


def gradient_map(lum: np.ndarray, stops: list[tuple[float, str]]) -> np.ndarray:
    xs = np.array([s for s, _ in stops])
    rgb = np.array([[int(c[i : i + 2], 16) / 255 for i in (1, 3, 5)] for _, c in stops])
    return np.stack([np.interp(lum, xs, rgb[:, k]) for k in range(3)], axis=-1)


def s_curve(x: np.ndarray, contrast: float, pivot: float = 0.5) -> np.ndarray:
    return np.clip(pivot + (x - pivot) * contrast, 0, 1)


def grade_crimson(img: np.ndarray) -> np.ndarray:
    """Monochrome cramoisi de la référence (validé sur le pilote) : carte de dégradé à 85 %."""
    mapped = gradient_map(
        luminance(img),
        [(0.0, "#000000"), (0.10, "#290101"), (0.25, "#600305"), (0.42, "#8d0c0f"),
         (0.62, "#c9141b"), (0.85, "#f4a096"), (1.0, "#fff8f4")],
    )
    return 0.85 * mapped + 0.15 * img


def grade_teal(img: np.ndarray) -> np.ndarray:
    """« Teal night » : bas en clés, fond désaturé, ombres tirées vers #040F0E, peau naturelle."""
    lum = luminance(img)[..., None]
    out = lum + (img - lum) * 0.85  # désaturation légère
    shadow = np.clip(1 - lum / 0.45, 0, 1) ** 1.5 * 0.35
    out = out * (1 - shadow) + np.array([4, 15, 14]) / 255 * shadow
    return s_curve(out, 1.06, 0.42)


def grade_mono(img: np.ndarray) -> np.ndarray:
    """N&B vrai (saturation nulle), contraste fort, noirs denses."""
    lum = luminance(img)
    lo, hi = np.percentile(lum, [1.5, 99.5])
    lum = s_curve(np.clip((lum - lo) / (hi - lo), 0, 1), 1.18)
    return np.repeat(lum[..., None], 3, axis=-1)


def grade_warm(img: np.ndarray) -> np.ndarray:
    """« Film chaud » : noirs relevés, hautes lumières chaudes, ombres poussées au jaune."""
    lum = luminance(img)[..., None]
    out = 0.09 + img * 0.89  # noirs relevés (p5 ≈ 0,10)
    out = out + (1 - lum) * np.array([0.018, 0.012, -0.012])  # ombres jaunes
    out = out * (1 + lum * np.array([0.035, 0.0, -0.06]))  # hautes lumières chaudes
    return np.clip(out, 0, 1)


GRADES = {"crimson": grade_crimson, "teal": grade_teal, "mono": grade_mono, "warm": grade_warm}


def fade_to_section(img: np.ndarray) -> np.ndarray:
    """Fondu du bas vers le fond de la section Why (#040F0E), comme la référence."""
    h = img.shape[0]
    t = np.clip((np.arange(h) / h - 0.78) / 0.22, 0, 1)
    t = (t * t * (3 - 2 * t) * 0.65)[:, None, None]
    return img * (1 - t) + np.array([4, 15, 14]) / 255 * t


def add_grain(img: np.ndarray, seed: int) -> np.ndarray:
    """Un seul grain pour toutes les familles : même taille (1 px livré), même intensité."""
    rng = np.random.default_rng(seed)
    noise = rng.normal(0, 0.011, img.shape[:2])[..., None]
    return np.clip(img + noise, 0, 1)


# ── Provenance ─────────────────────────────────────────────────────────────────


def xmp_packet(model: str) -> bytes:
    description = (
        f"Image générée par IA (Higgsfield, modèle {model}), étalonnée par art/grade.py. "
        "Personne fictive. Projet conceptuel CLUSEM pour un portfolio."
    )
    return (
        '<?xpacket begin="﻿" id="W5M0MpCehiHzreSzNTczkc9d"?>'
        '<x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">'
        '<rdf:Description rdf:about="" xmlns:Iptc4xmpExt="http://iptc.org/std/Iptc4xmpExt/2008-02-29/" '
        'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:xmp="http://ns.adobe.com/xap/1.0/">'
        "<Iptc4xmpExt:DigitalSourceType>"
        "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
        "</Iptc4xmpExt:DigitalSourceType>"
        f"<xmp:CreatorTool>Higgsfield {model}</xmp:CreatorTool>"
        f'<dc:description><rdf:Alt><rdf:li xml:lang="fr">{description}</rdf:li></rdf:Alt></dc:description>'
        '</rdf:Description></rdf:RDF></x:xmpmeta><?xpacket end="w"?>'
    ).encode("utf-8")


def embed_prompt(target: Path, prompt_file: Path) -> None:
    launcher = os.environ.get("IMPECCABLE")
    if not launcher:
        print(f"  ! IMPECCABLE non défini : prompt non embarqué dans {target.name}")
        return
    subprocess.run([launcher, "embed-prompt", str(target), "--prompt-file", str(prompt_file)], check=True,
                   capture_output=True)


# ── Pipeline ───────────────────────────────────────────────────────────────────


def produce(plate: Plate, masters: Path, seed: int) -> dict:
    src = np.asarray(Image.open(masters / f"{plate.master}.png").convert("RGB"), dtype=np.float64) / 255
    h, w = src.shape[:2]
    inset = rounded_corner_inset(src)
    box = crop_box(w, h, inset, plate.size[0] / plate.size[1], plate.focal)
    cropped = Image.fromarray((src[box[1] : box[3], box[0] : box[2]] * 255).round().astype(np.uint8))
    out = np.asarray(cropped.resize(plate.size, Image.LANCZOS), dtype=np.float64) / 255

    out = GRADES[plate.family](out)
    if plate.fade_bottom:
        out = fade_to_section(out)
    out = add_grain(out, seed)

    target = ROOT / plate.target
    target.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray((out * 255).round().astype(np.uint8)).save(
        target, "JPEG", quality=90, subsampling=0 if plate.family == "crimson" else 2,
        optimize=True, progressive=True, xmp=xmp_packet(MODELS[plate.master]),
    )
    embed_prompt(target, ROOT / "art" / "prompts" / f"{plate.master}.prompt.txt")
    return {
        "target": plate.target, "size": plate.size, "inset": inset, "crop": box,
        "kb": round(target.stat().st_size / 1024),
    }


if __name__ == "__main__":
    masters = Path(sys.argv[1])
    only = set(sys.argv[sys.argv.index("--only") + 1].split(",")) if "--only" in sys.argv else None
    for index, plate in enumerate(PLATES):
        if only and plate.master not in only:
            continue
        report = produce(plate, masters, seed=index)
        print(f"{plate.master:32} → {report['target']}  {report['size']}  inset {report['inset']}  "
              f"{report['kb']} Ko")
