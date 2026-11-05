"""
Logo CAP FITNESS by EBC Sport, reconstruit en vectoriel pour la maquette /v2.

Mesuré sur les supports fournis (logo carré et bannière) et reconstruit avec des
polices libres : Montserrat 900 pour CAP (au contour), Exo 2 Black pour FITNESS
(plein, avec ses fentes), Montserrat 500 italique pour la signature, et le tracé
ECG canonique de app/utils/ecg.ts. Toute la géométrie est livrée en surfaces
remplies : ni masque ni identifiant, le SVG peut être inséré plusieurs fois
dans la page.

    PYTHONPATH=<site-packages avec skia-pathops> python3 art/v2/logo/build_logo.py

Dépendances (hors dépôt) : fontTools ≥ 4.68, brotli, skia-pathops. Les polices
viennent de node_modules (devDependencies exactes du dépôt).

Sorties : app/assets/brand/cap-{horizontal,reduit,carre,monogramme,ecg}.svg,
public/v2/favicon.svg et art/v2/logo/og.svg (rastérisé par scripts/build-og.mjs).
Si le club fournit ses fichiers vectoriels officiels, ils remplacent ceux-ci.
"""
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

import pathops
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.ttLib.removeOverlaps import removeOverlaps
from fontTools.varLib import instancer

ROOT = Path(__file__).resolve().parents[3]
NM = ROOT / "node_modules"
BRAND = ROOT / "app/assets/brand"
PUBLIC = ROOT / "public/v2"
HERE = Path(__file__).resolve().parent

CITRON = "#CCD52F"
BLANC = "#FFFFFF"
CRAIE = "#F2F1EC"
NOIR = "#0C0C0B"

# Complexe ECG canonique (identique à app/utils/ecg.ts) : x en fraction de
# l'empan, y en fraction de l'amplitude R, vers le haut positif.
ECG = [(0, 0), (0.115, 0.435), (0.30, -0.375), (0.54, 1), (0.59, -0.92), (0.85, 0.295), (1, 0)]

# Pointes vives, comme le logo fourni : le pic R (≈ 10°) demande un onglet de
# 11,3 ; à 4, il était coupé à plat. Les lettres gardent l'onglet de 4.
ECG_MITER = 20.0
# Tube : deux parois fines qui se rejoignent en aiguille aux pics (logo fourni).
TUBE, WALL = 8.0, 2.2


# ── Polices ───────────────────────────────────────────────────────────────────
def load(path: Path, axes: dict | None = None) -> TTFont:
    font = TTFont(path)
    if axes:
        font = instancer.instantiateVariableFont(font, axes)
    return font


def clean(font: TTFont, text: str) -> TTFont:
    """Contours sans chevauchement : un contour tracé ne montre aucune ligne intérieure."""
    cmap = font.getBestCmap()
    removeOverlaps(font, [cmap[ord(c)] for c in set(text) if c != " "])
    return font


MONT_900 = clean(load(NM / "@fontsource/montserrat/files/montserrat-latin-900-normal.woff2"), "CAP")
MONT_500I = clean(load(NM / "@fontsource/montserrat/files/montserrat-latin-500-italic.woff2"), "BY EBC SPORT")
EXO_900 = clean(load(NM / "@fontsource-variable/exo-2/files/exo-2-latin-wght-normal.woff2", {"wght": 900}), "FITNESS")
FIGTREE_600 = clean(
    load(NM / "@fontsource-variable/figtree/files/figtree-latin-wght-normal.woff2", {"wght": 600}),
    "Maquette non officielle",
)


@dataclass
class Word:
    path: pathops.Path
    glyphs: list[pathops.Path]
    x0: float
    x1: float


def word(font: TTFont, text: str, cap: float, x0: float, baseline: float, sx: float = 1.0,
         track_em: float = 0.0, slant: float = 0.0) -> Word:
    """Un mot en surfaces : capitale `cap`, compression horizontale `sx`, approche en em."""
    glyph_set = font.getGlyphSet()
    cmap = font.getBestCmap()
    scale = cap / font["OS/2"].sCapHeight
    em = font["head"].unitsPerEm * scale
    x = x0
    glyphs: list[pathops.Path] = []
    for char in text:
        name = cmap[ord(char)]
        glyph = glyph_set[name]
        if char != " ":
            path = pathops.Path()
            pen = TransformPen(path.getPen(glyph_set), (scale * sx, 0, -scale * slant, -scale, x, baseline))
            glyph.draw(pen)
            glyphs.append(path)
        x += glyph.width * scale * sx + track_em * em
    total = pathops.Path()
    for path in glyphs:
        total.addPath(path)
    total.simplify()
    x1 = max(p.bounds[2] for p in glyphs)
    x_start = min(p.bounds[0] for p in glyphs)
    return Word(total, glyphs, x_start, x1)


def fit(font: TTFont, text: str, cap: float, x0: float, baseline: float, width: float,
        sx: float = 1.0, track_em: float = 0.0, slant: float = 0.0) -> Word:
    """Même mot, compression ajustée pour tenir exactement `width` (de x0 à x0 + width)."""
    probe = word(font, text, cap, 0, baseline, sx, track_em, slant)
    sx *= width / (probe.x1 - probe.x0)
    probe = word(font, text, cap, 0, baseline, sx, track_em, slant)
    return word(font, text, cap, x0 - probe.x0, baseline, sx, track_em, slant)


# ── Géométrie ─────────────────────────────────────────────────────────────────
def polyline(points: list[tuple[float, float]]) -> pathops.Path:
    path = pathops.Path()
    path.moveTo(*points[0])
    for point in points[1:]:
        path.lineTo(*point)
    return path


def stroked(path: pathops.Path, width: float, miter: float = 4.0) -> pathops.Path:
    out = pathops.Path()
    out.addPath(path)
    out.stroke(width, pathops.LineCap.BUTT_CAP, pathops.LineJoin.MITER_JOIN, miter)
    out.simplify()
    return out


def union(*paths: pathops.Path) -> pathops.Path:
    out = pathops.Path()
    for path in paths:
        out = pathops.op(out, path, pathops.PathOp.UNION)
    return out


def difference(a: pathops.Path, b: pathops.Path) -> pathops.Path:
    return pathops.op(a, b, pathops.PathOp.DIFFERENCE)


def complex_points(x_start: float, baseline: float, span: float, amp: float) -> list[tuple[float, float]]:
    return [(x_start + fx * span, baseline - fy * amp) for fx, fy in ECG]


def trace_solid(points, width: float, taper_from: float | None = None) -> pathops.Path:
    """Tracé plein ; départ en pointe effilée (largeur 0 → `width` sur 3 × `width`)."""
    if taper_from is None:
        return stroked(polyline(points), width, miter=ECG_MITER)
    x0, y = points[0]
    body = stroked(polyline([(x0 + 3 * width, y), *points[1:]]), width, miter=ECG_MITER)
    tip = polyline([(x0, y), (x0 + 3 * width, y - width / 2), (x0 + 3 * width, y + width / 2)])
    tip.close()
    return union(body, tip)


def trace_tube(points, width: float, wall: float) -> pathops.Path:
    """Tube : le trait large moins le trait intérieur. L'intérieur est réellement vide."""
    outer = stroked(polyline(points), width, miter=ECG_MITER)
    inner = stroked(polyline(points), width - 2 * wall, miter=ECG_MITER)
    return difference(outer, inner)


def fit_amp(make, view: str, hi: float = 110.0, margin: float = 1.0) -> float:
    """
    La plus grande amplitude (≤ `hi`) dont le tracé tient dans la viewBox : l'onglet
    vif prolonge chaque pic au-delà de son sommet, la viewBox (donc la mise en page)
    ne change pas.
    """
    x, y, w, h = (float(v) for v in view.split())
    lo, best = 20.0, 20.0
    for _ in range(30):
        mid = (lo + hi) / 2
        bx0, by0, bx1, by1 = make(mid).bounds
        if by0 >= y + margin and by1 <= y + h - margin and bx0 >= x - 1e-6 and bx1 <= x + w + 1e-6:
            best, lo = mid, mid
        else:
            hi = mid
    return round(best, 1)


def wedge(edge_x: float, y: float, direction: int, depth: float, opening: float) -> pathops.Path:
    """Fente effilée : ouverte de `opening` sur le bord du glyphe, pointe vers l'intérieur, en léger biais."""
    tip_x = edge_x + direction * depth
    path = polyline([
        (edge_x - direction * 2, y - opening / 2),
        (edge_x - direction * 2, y + opening / 2),
        (tip_x, y - opening * 0.6),
    ])
    path.close()
    return path


def fitness_cuts(w: Word, cap: float, baseline: float) -> pathops.Path:
    """Les fentes de FITNESS, lettre par lettre (relevées sur la bannière)."""
    # (indice du glyphe, côté, hauteur en fraction de la capitale depuis la ligne de base)
    plan = [(0, "left", 0.72), (1, "full", 0.24), (2, "stem", 0.5), (3, "left", 0.76),
            (4, "left", 0.24), (5, "left", 0.3), (6, "right", 0.7)]
    out = pathops.Path()
    for index, side, h in plan:
        glyph = w.glyphs[index]
        x0, _, x1, _ = glyph.bounds
        y = baseline - h * cap
        width = x1 - x0
        opening = 0.04 * cap
        if side == "full":
            cut = polyline([(x0 - 2, y - opening * 0.9), (x1 + 2, y - opening * 1.4),
                            (x1 + 2, y + opening * 0.6), (x0 - 2, y + opening * 1.1)])
            cut.close()
        elif side == "stem":
            centre = (x0 + x1) / 2
            cut = wedge(centre - 0.16 * width, y, 1, 0.36 * width, opening)
        elif side == "left":
            cut = wedge(x0, y, 1, 0.3 * width, opening)
        else:
            cut = wedge(x1, y, -1, 0.3 * width, opening)
        out = union(out, cut)
    return out


def d_of(path: pathops.Path) -> str:
    pen = SVGPathPen(None, ntos=lambda v: f"{v:.2f}".rstrip("0").rstrip("."))
    path.draw(pen)
    return pen.getCommands()


# ── Déclinaisons ──────────────────────────────────────────────────────────────
def svg(view: str, parts: list[tuple[str, str, pathops.Path]], title: str = "CAP Fitness by EBC Sport",
        background: str | None = None) -> str:
    rect = ""
    if background:
        x, y, w, h = view.split()
        rect = f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{background}"/>'
    body = "".join(f'<path class="{cls}" fill="{fill}" d="{d_of(path)}"/>' for cls, fill, path in parts)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{view}"><title>{title}</title>'
            f"{rect}{body}</svg>\n")


def horizontal() -> tuple[str, dict]:
    cap = 100.0
    base = 100.0
    iso = 90.0
    cap_word = fit(MONT_900, "CAP", cap, 150, base, 290, track_em=0.0)
    fit_word = fit(EXO_900, "FITNESS", cap, 450, base, 520, sx=0.97, track_em=-0.04)
    plein = difference(fit_word.path, fitness_cuts(fit_word, cap, base))
    delie = stroked(cap_word.path, 6.0, miter=4.0)
    view = "0 -21 1120 213"
    # Empan d'origine (99) : l'amplitude est réduite pour que l'aiguille tienne dans
    # la viewBox ; l'angle du pic s'ouvre un peu, l'aiguille raccourcit d'autant.
    amp = fit_amp(lambda a: union(
        trace_solid([(0, iso), *complex_points(50, iso, 99, a), (150, iso)], 8.0, taper_from=0),
        trace_tube([(970, iso), *complex_points(990, iso, 99, a), (1120, iso)], TUBE, WALL),
    ), view)
    left = trace_solid([(0, iso), *complex_points(50, iso, 99, amp), (150, iso)], 8.0,
                       taper_from=0)
    right = trace_tube([(970, iso), *complex_points(990, iso, 99, amp), (1120, iso)],
                       TUBE, WALL)
    sig_cap = 27.0
    probe = word(MONT_500I, "BY EBC SPORT", sig_cap, 0, 145, track_em=0.02)
    sig = word(MONT_500I, "BY EBC SPORT", sig_cap, 973 - (probe.x1 - probe.x0) - probe.x0, 145, track_em=0.02)
    parts = [
        ("cap-logo__trace", BLANC, left),
        ("cap-logo__delie", CITRON, delie),
        ("cap-logo__plein", BLANC, plein),
        ("cap-logo__tube", CITRON, right),
        ("cap-logo__signature", CITRON, sig.path),
    ]
    report = {"CAP": (cap_word.x0, cap_word.x1), "FITNESS": (fit_word.x0, fit_word.x1), "signature": (sig.x0, sig.x1),
              "amplitude": (0, amp)}
    return svg(view, parts), report


def reduit() -> str:
    cap = 100.0
    cap_word = fit(MONT_900, "CAP", cap, 0, cap, 290)
    fit_word = fit(EXO_900, "FITNESS", cap, 300, cap, 520, sx=0.97, track_em=-0.04)
    plein = difference(fit_word.path, fitness_cuts(fit_word, cap, cap))
    parts = [
        ("cap-logo__delie", CITRON, stroked(cap_word.path, 6.0)),
        ("cap-logo__plein", BLANC, plein),
    ]
    return svg("-3 -3 826 106", parts)


def carre() -> str:
    cap_word = fit(MONT_900, "CAP", 100, 0, 100, 340)
    fit_cap = 65.0
    fit_base = 100 + 5 + fit_cap
    fit_word = fit(EXO_900, "FITNESS", fit_cap, 0, fit_base, 340, sx=0.97, track_em=-0.04)
    plein = difference(fit_word.path, fitness_cuts(fit_word, fit_cap, fit_base))
    sig_cap = 17.0
    sig_base = fit_base + 0.35 * fit_cap + sig_cap
    probe = word(MONT_500I, "BY EBC SPORT", sig_cap, 0, sig_base, track_em=0.02)
    sig = word(MONT_500I, "BY EBC SPORT", sig_cap, 325 - (probe.x1 - probe.x0) - probe.x0, sig_base, track_em=0.02)
    view = "-152 -14 648 302"
    tubes = lambda a: (  # noqa: E731
        trace_tube([(-150, 100), *complex_points(-62.5 - 0.45 * a, 100, 0.9 * a, a), (-4, 100)], TUBE, WALL),
        trace_tube([(344, fit_base), *complex_points(415.5 - 0.45 * a, fit_base, 0.9 * a, a), (494, fit_base)],
                   TUBE, WALL),
    )
    left, right = tubes(fit_amp(lambda a: union(*tubes(a)), view))
    parts = [
        ("cap-logo__tube", BLANC, left),
        ("cap-logo__tube", BLANC, right),
        ("cap-logo__delie", CITRON, stroked(cap_word.path, 5.5)),
        ("cap-logo__plein", BLANC, plein),
        ("cap-logo__signature", CITRON, sig.path),
    ]
    return svg(view, parts)


def monogramme() -> str:
    cap_word = fit(MONT_900, "CAP", 100, 0, 100, 290)
    return svg("-3 -3 296 106", [("cap-logo__delie", CITRON, stroked(cap_word.path, 6.0))], title="CAP")


def ecg_icon(background: str | None) -> str:
    points = [(2, 17), *complex_points(9.5, 17, 13, 12), (30, 17)]
    return svg("0 0 32 32", [("cap-logo__trace", CITRON, trace_solid(points, 3.2))], title="CAP Fitness",
               background=background)


def og() -> str:
    """Image de partage : fond noir, logo carré de 560 px, mention vectorisée."""
    square = carre()
    inner = square[square.index("</title>") + 8: square.rindex("</svg>")]
    scale = 560 / 648
    mention = word(FIGTREE_600, "Maquette non officielle", 28 * 0.7, 80, 570)
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">'
        f'<rect width="1200" height="630" fill="{NOIR}"/>'
        f'<g transform="translate({80 + 152 * scale:.2f} {120 + 14 * scale:.2f}) scale({scale:.4f})">{inner}</g>'
        f'<path fill="{CRAIE}" d="{d_of(mention.path)}"/></svg>\n'
    )


def main() -> None:
    BRAND.mkdir(parents=True, exist_ok=True)
    PUBLIC.mkdir(parents=True, exist_ok=True)
    text, report = horizontal()
    (BRAND / "cap-horizontal.svg").write_text(text)
    (BRAND / "cap-reduit.svg").write_text(reduit())
    (BRAND / "cap-carre.svg").write_text(carre())
    (BRAND / "cap-monogramme.svg").write_text(monogramme())
    (BRAND / "cap-ecg.svg").write_text(ecg_icon(None))
    (PUBLIC / "favicon.svg").write_text(ecg_icon(NOIR))
    (HERE / "og.svg").write_text(og())
    for name, (x0, x1) in report.items():
        print(f"{name:10} x {x0:7.1f} → {x1:7.1f} ({x1 - x0:.1f})")


if __name__ == "__main__":
    main()
