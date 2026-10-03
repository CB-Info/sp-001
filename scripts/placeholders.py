"""Génère les visuels PROVISOIRES du site (v0.1), en attendant les images Higgsfield.

Chaque fichier reprend le format, le ratio et la famille d'étalonnage de l'image
finale (docs/analyse/00-synthese.md §11) : crimson velocity, teal night, mono et
warm film. Ce sont des champs abstraits sans personne, ni texte, ni marque.
Usage : python3 scripts/placeholders.py  (nécessite Pillow et numpy)
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent / "public" / "images"
RNG = np.random.default_rng(7)


def lerp(a, b, t):
    return a + (b - a) * t


def hexrgb(h):
    h = h.lstrip("#")
    return np.array([int(h[i : i + 2], 16) for i in (0, 2, 4)], dtype=float)


def streaks(w, h, strength=0.35, blur=60):
    """Bruit étiré horizontalement : l'équivalent d'un flou de bougé."""
    noise = Image.fromarray((RNG.random((h, max(8, w // 40))) * 255).astype("uint8"))
    noise = noise.resize((w, h), Image.BICUBIC).filter(ImageFilter.GaussianBlur((blur, 2)))
    return (np.asarray(noise, dtype=float) / 255 - 0.5) * strength


def field(w, h, stops, angle="diag"):
    y, x = np.mgrid[0:h, 0:w]
    t = (x / w * 0.6 + y / h * 0.4) if angle == "diag" else y / h
    cols = [hexrgb(c) for c in stops]
    seg = np.clip(t * (len(cols) - 1), 0, len(cols) - 1 - 1e-6)
    i = seg.astype(int)
    f = (seg - i)[..., None]
    a = np.stack([cols[k] for k in range(len(cols))])[i]
    b = np.stack([cols[k] for k in range(len(cols))])[i + 1]
    return lerp(a, b, f)


def save(img, rel):
    path = ROOT / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(np.clip(img, 0, 255).astype("uint8")).save(path, quality=86, optimize=True, progressive=True)
    print("écrit", path.relative_to(ROOT.parent.parent))


def crimson(w, h, fade="bottom"):
    img = field(w, h, ["#600405", "#8d0c0f", "#c9141b", "#8d0c0f", "#2b0101"])
    img *= 1 + streaks(w, h)[..., None]
    y, x = np.mgrid[0:h, 0:w]
    if fade == "bottom":
        k = np.clip((y / h - 0.6) / 0.2, 0, 1)
    else:
        k = np.clip((x / w - 0.18) / 0.5, 0, 1)
    return img * (1 - k[..., None])


def teal(w, h, lift=0.0):
    img = field(w, h, ["#1b2230", "#2d303c", "#0f1718", "#040f0e"], angle="v")
    img *= 1 + streaks(w, h, 0.2, 30)[..., None] + lift
    return img


def mono(w, h):
    g = field(w, h, ["#1a1a1a", "#6a6a6a", "#202020"])
    g *= 1 + streaks(w, h, 0.3, 20)[..., None]
    return g


def warm(w, h):
    img = field(w, h, ["#3a3020", "#725f41", "#a08a5c", "#4a3d28"])
    img *= 1 + streaks(w, h, 0.4, 40)[..., None]
    return img * 0.8 + 40


save(crimson(2880, 2204), "hero/hero-athlete.jpg")
save(crimson(2880, 1700, fade="right"), "footer/footer-pushup.jpg")
about = teal(1280, 736, 0.1)
about[300:736, 520:820] = hexrgb("#b0141c")
save(about, "about/coach-alex-vance.jpg")
for n, tone in enumerate(["#7a4c4b", "#5e3a32", "#8a5a48", "#6b4a40", "#4f3a34"], start=1):
    save(field(160, 160, [tone, "#2a1d1a"]), f"about/reviewer-0{n}.jpg")
for name in ["01-coaching", "02-force", "03-fonctionnel", "04-conditioning"]:
    save(mono(880, 496), f"services/service-{name}.jpg")
save(teal(1040, 1064), "programs/program-marcus-roy.jpg")
for name, h in [("01-alex-vance", 720), ("02-sarah-jenkins", 720), ("03-marcus-roy", 904), ("04-elena-rostova", 720), ("05-drake-torres", 720)]:
    save(teal(720, h, 0.15 if "03" in name else 0.0), f"team/team-{name}.jpg")
for name in ["01-jordan-tucker", "02-nadia-benali", "03-paul-mercier"]:
    save(warm(1600, 748), f"testimonials/testimonial-{name}.jpg")
