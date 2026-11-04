"""
Métriques des polices de repli de la V2 (CAP Display et Figtree), pour que le
texte occupe la même place avant et après le chargement de la police (CLS 0).

Méthode (celle des replis de la V1) : size-adjust = chasse moyenne de A–Z et a–z
de la police ÷ celle d'Arial ; ascent et descent = métriques de la police ÷
size-adjust. Arial est mesurée sur Liberation Sans, de métriques identiques.

    python3 scripts/fonts/fallback-metrics.py
"""
from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT = Path(__file__).resolve().parents[2]
ARIAL = Path("/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf")
ARIAL_BLACK_LIKE = Path("/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf")
LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"


def average_width(font: TTFont) -> float:
    cmap = font.getBestCmap()
    hmtx = font["hmtx"]
    widths = [hmtx[cmap[ord(c)]][0] for c in LETTERS]
    return sum(widths) / len(widths) / font["head"].unitsPerEm


def metrics(font: TTFont, reference: TTFont, name: str, local: str) -> str:
    adjust = average_width(font) / average_width(reference)
    upm = font["head"].unitsPerEm
    hhea = font["hhea"]
    ascent = hhea.ascent / upm / adjust
    descent = -hhea.descent / upm / adjust
    return (
        f"@font-face {{\n  font-family: '{name}';\n  src: {local};\n"
        f"  size-adjust: {adjust * 100:.1f}%;\n  ascent-override: {ascent * 100:.1f}%;\n"
        f"  descent-override: {descent * 100:.1f}%;\n  line-gap-override: 0%;\n}}\n"
    )


def main() -> None:
    arial = TTFont(ARIAL)
    arial_bold = TTFont(ARIAL_BLACK_LIKE)
    display = instancer.instantiateVariableFont(
        TTFont(ROOT / "public/fonts/cap-display-900.woff2"), {"wdth": 80}
    )
    figtree = instancer.instantiateVariableFont(
        TTFont(ROOT / "public/fonts/figtree-latin-wght-normal.woff2"), {"wght": 400}
    )
    print(metrics(display, arial_bold, "CAP Display Fallback", "local('Arial Bold'), local('Arial')"))
    print(metrics(figtree, arial, "Figtree Fallback", "local('Arial')"))


if __name__ == "__main__":
    main()
