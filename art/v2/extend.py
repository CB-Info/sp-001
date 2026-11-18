"""
Agrandissement de la plaque de couverture par le haut (brief §3.2 : « sinon
régénérer l'image ») : le crâne de la coach passait sous l'en-tête et le bouton
« Réserve ta place » la coiffait.

    python3 art/v2/extend.py <dossier-des-PNG-bruts> [--recaler <ancienne-plaque.jpg>]
    python3 art/v2/grade.py <dossier-des-PNG-bruts> --only cap-couverture

`--recaler` recherche l'échelle et le décalage de l'extension sur l'ancienne
plaque (comparaison des gradients, de 1/4 à la pleine définition) et les affiche :
ce sont les constantes S, OX, OY ci-dessous.

Entrées, dans le dossier des bruts (non versionné, comme les autres bruts) :
- cap-couverture.png : le brut Higgsfield d'origine (5504 × 3072) ;
- cap-couverture.outpaint.png : la plaque livrée (art/masters/v2/cap-couverture.jpg,
  avant agrandissement) étendue par l'outpaint de Higgsfield, en deux passes :
  5:3 vers 4:3, puis 4:3 vers 16:9 (art/v2/manifest.json).

Sortie : cap-couverture.etendu.png, que grade.py lit à la place du brut. Les
pixels du brut sont gardés partout où il en a (y compris ses 300 px réels à gauche
de l'ancien cadre), sauf le plafond : à droite des fenêtres, l'extension ne
fournit que la bande ajoutée, fondue sur 96 px ; à gauche, tout le plafond vient
de l'extension, fondu dans le noir sous lui et dans la poutre avant les
fenêtres. L'extension est ramenée aux tons du brut (correspondance de quantiles
sur la zone commune). Le cadre final garde la plaque en 5:3 : 175 px de plafond en
haut, 292 px à gauche (unités de l'ancienne plaque 2880 × 1728), rien coupé en bas.
"""
from __future__ import annotations

import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

LUMA = np.array([0.2126, 0.7152, 0.0722])


def to_linear(c):
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def to_srgb(y):
    return np.where(y <= 0.0031308, 12.92 * y, 1.055 * np.power(np.clip(y, 0, 1), 1 / 2.4) - 0.055)


# Ancienne plaque dans le brut : crop_box(5504, 3072, inset 92, 5:3, focal (0,80 ; 0,45)).
OLD_BOX = (599, 92, 5412, 2980)
OLD_SIZE = (2880, 1728)
# Extension recalée sur l'ancienne plaque (--recaler, à 1 px près) :
# ext_x = OX + S · plaque_x, ext_y = OY + S · plaque_y.
S, OX, OY = 0.7426, 430, 179
# Ajouts, en pixels de l'ancienne plaque.
TOP, LEFT = 175, 292
# Fondu entre l'extension et le brut, en pixels du brut, au-dessus du cadre d'origine.
FEATHER = 96


def compose(raw_dir: Path) -> Path:
    raw = np.asarray(Image.open(raw_dir / "cap-couverture.png").convert("RGB"), dtype=np.float64) / 255
    ext_img = Image.open(raw_dir / "cap-couverture.outpaint.png").convert("L")
    rh, rw = raw.shape[:2]
    k = (OLD_BOX[2] - OLD_BOX[0]) / OLD_SIZE[0]  # pixels du brut par pixel de plaque

    # Cadre voulu, dans le brut, puis la marge que grade.py rognera (3 % du petit côté).
    fw = round((OLD_SIZE[0] + LEFT) * k)
    fh = round((OLD_SIZE[1] + TOP) * k)
    margin = round(0.03 * fh)
    while margin != round(0.03 * (fh + 2 * margin)):  # inset de grade.py sur le canevas
        margin = round(0.03 * (fh + 2 * margin))
    x0 = OLD_BOX[0] - round(LEFT * k) - margin
    y0 = OLD_BOX[1] - round(TOP * k) - margin
    cw, ch = fw + 2 * margin, fh + 2 * margin

    # Extension, rééchantillonnée dans la géométrie du canevas (unités du brut).
    # Canevas (cx, cy) → plaque ((x0 + cx − OLD_BOX[0]) / k, …) → extension.
    scale = S / k
    ex0 = OX + (x0 - OLD_BOX[0]) / k * S
    ey0 = OY + (y0 - OLD_BOX[1]) / k * S
    ext = ext_img.transform(
        (cw, ch), Image.AFFINE, (scale, 0, ex0, 0, scale, ey0), resample=Image.BICUBIC
    )
    ext = np.asarray(ext, dtype=np.float64) / 255

    # Brut dans le canevas (gris pour la correspondance des tons, couleur pour la sortie).
    canvas = np.zeros((ch, cw, 3))
    have = np.zeros((ch, cw), dtype=bool)
    sx0, sy0 = max(x0, 0), max(y0, 0)
    sx1, sy1 = min(x0 + cw, rw), min(y0 + ch, rh)
    canvas[sy0 - y0:sy1 - y0, sx0 - x0:sx1 - x0] = raw[sy0:sy1, sx0:sx1]
    have[sy0 - y0:sy1 - y0, sx0 - x0:sx1 - x0] = True

    # Tons : quantiles de l'extension ramenés à ceux du brut, sur l'ancienne plaque.
    oy0, oy1 = OLD_BOX[1] - y0, OLD_BOX[3] - y0
    ox0, ox1 = OLD_BOX[0] - x0, OLD_BOX[2] - x0
    raw_l = to_srgb(to_linear(canvas[oy0:oy1, ox0:ox1]) @ LUMA).ravel()  # comme grade_nuit
    ext_l = ext[oy0:oy1, ox0:ox1].ravel()
    qs = np.linspace(0, 100, 257)
    mapped = np.interp(ext, np.percentile(ext_l, qs), np.percentile(raw_l, qs))
    fill = np.repeat(mapped[..., None], 3, axis=2)

    # Le brut partout où il existe, l'extension au-dessus, fondue sur FEATHER px
    # depuis le haut du brut (sa première ligne réelle), et sur ses bords manquants.
    alpha = have.astype(np.float64)
    top_rows = np.clip((np.arange(ch) - (sy0 - y0)) / FEATHER, 0, 1)
    alpha *= top_rows[:, None]
    # À gauche des fenêtres, l'outpaint a redessiné la grille du plafond à ~20 px
    # de la vraie, même dans l'ancien cadre : un fondu y doublait les lignes. Tout
    # le plafond vient donc de l'extension, fondu dans le noir sous le plafond
    # (plaque y 300, où brut et extension diffèrent de 2/255 au plus), puis dans
    # la poutre sombre avant les fenêtres (plaque x 2050–2160).
    yc = margin + 300 * fh / OLD_SIZE[1]
    xc = margin + 2160 * fw / OLD_SIZE[0]
    below = np.clip((np.arange(ch) - yc) / 48, 0, 1)
    left = np.clip((xc - np.arange(cw)) / 110, 0, 1)
    alpha = left[None, :] * below[:, None] * have + (1 - left[None, :]) * alpha
    alpha = np.asarray(
        Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(2)),
        dtype=np.float64,
    ) / 255
    alpha = np.where(have, alpha, 0)[..., None]
    out = canvas * alpha + fill * (1 - alpha)

    target = raw_dir / "cap-couverture.etendu.png"
    Image.fromarray((np.clip(out, 0, 1) * 255).round().astype(np.uint8)).save(target)
    print(f"{target}  {cw} × {ch}  (cadre {fw} × {fh}, marge {margin})")
    return target


def _grad(a: np.ndarray) -> np.ndarray:
    return np.abs(np.diff(a, axis=1))[:-1, :] + np.abs(np.diff(a, axis=0))[:, :-1]


def _search(old: Image.Image, ext: Image.Image, scales, oys, oxs, f: int, keep: int = 1):
    """Les `keep` meilleurs (erreur, s, ox, oy) : ext[oy:, ox:] ≈ old · s, comparés à 1/f."""
    eg = _grad(np.asarray(ext.resize((round(ext.width / f), round(ext.height / f)), Image.LANCZOS), dtype=np.float32))
    found = []
    for s in scales:
        w, h = round(old.width * s / f), round(old.height * s / f)
        og = _grad(np.asarray(old.resize((w, h), Image.LANCZOS), dtype=np.float32))
        og = og / (og.mean() + 1e-6)
        for oy in oys:
            for ox in oxs:
                y, x = round(oy / f), round(ox / f)
                if x < 0 or y < 0 or x + og.shape[1] > eg.shape[1] or y + og.shape[0] > eg.shape[0]:
                    continue
                p = eg[y:y + og.shape[0], x:x + og.shape[1]]
                found.append((float(np.mean(np.abs(p / (p.mean() + 1e-6) - og))), float(s), ox, oy))
    found.sort()
    # Un candidat par voisinage : les suivants doivent différer d'au moins 24 px ou 1 %.
    picked = []
    for c in found:
        if all(abs(c[2] - d[2]) > 24 or abs(c[3] - d[3]) > 24 or abs(c[1] - d[1]) > 0.01 for d in picked):
            picked.append(c)
        if len(picked) == keep:
            break
    return picked


def recaler(raw_dir: Path, old_plate: Path) -> tuple[float, int, int]:
    """Échelle et décalage de l'extension : grille grossière, puis affinage de 6 départs."""
    old = Image.open(old_plate).convert("L")
    ext = Image.open(raw_dir / "cap-couverture.outpaint.png").convert("L")
    s_max = min(ext.width / old.width, ext.height / old.height)
    starts = _search(old, ext, np.arange(s_max * 0.6, s_max, 0.004),
                     range(0, ext.height // 2, 8), range(0, ext.width // 2, 8), 8, keep=6)
    best = None
    for _, s, ox, oy in starts:
        (c,) = _search(old, ext, np.arange(s - 0.006, s + 0.0061, 0.002),
                       range(oy - 16, oy + 17, 4), range(ox - 16, ox + 17, 4), 4)
        _, s, ox, oy = c
        (c,) = _search(old, ext, np.arange(s - 0.002, s + 0.00201, 0.0005),
                       range(oy - 4, oy + 5, 2), range(ox - 4, ox + 5, 2), 2)
        _, s, ox, oy = c
        (c,) = _search(old, ext, np.arange(s - 0.0005, s + 0.00051, 0.00025),
                       range(oy - 2, oy + 3), range(ox - 2, ox + 3), 1)
        if best is None or c[0] < best[0]:
            best = c
    _, s, ox, oy = best
    print(f"S, OX, OY = {s:.4f}, {ox}, {oy}  (écart {best[0]:.3f})")
    return s, ox, oy


if __name__ == "__main__":
    if "--recaler" in sys.argv:
        recaler(Path(sys.argv[1]), Path(sys.argv[sys.argv.index("--recaler") + 1]))
    else:
        compose(Path(sys.argv[1]))
