"""
Police d'affiche de la V2 (CAP Fitness) : « CAP Display ».

Anybody variable (OFL), instanciée à la graisse 900 en gardant l'axe de chasse
75–150 %, réduite aux glyphes du français, renommée pour ne réutiliser aucun nom
réservé. Le fichier produit est versionné : le build du site n'a pas besoin de
Python.

    python3 scripts/fonts/build-cap-display.py

Dépendances (hors dépôt) : fontTools ≥ 4.68 et brotli.
"""
from __future__ import annotations

import shutil
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "node_modules/@fontsource-variable/anybody/files/anybody-latin-wdth-normal.woff2"
LICENSE = ROOT / "node_modules/@fontsource-variable/anybody/LICENSE"
TARGET = ROOT / "public/fonts/cap-display-900.woff2"
FAMILY = "CAP Display"

# Le français, ses signes et quelques ligatures : capitales et bas de casse (les
# horaires « 18 h 15 » et un titre en casse normale en ont besoin).
LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "ÀÂÄÇÉÈÊËÎÏÔÖÙÛÜŸŒÆ"
TEXT = (
    LETTERS
    + LETTERS.lower()
    + "ß0123456789.,;:!?'’‘“”«»\"-–—‑&()/·•%€+=[]#@*…° "
    + " "
)
FEATURES = ["kern", "tnum", "case", "liga", "locl", "ccmp", "mark", "mkmk"]


def rename(font: TTFont) -> None:
    """Nouveau nom de famille partout où la table « name » le porte."""
    name = font["name"]
    for record in list(name.names):
        if record.nameID in (1, 16):
            name.setName(FAMILY, record.nameID, record.platformID, record.platEncID, record.langID)
        elif record.nameID in (4,):
            name.setName(f"{FAMILY} Black", record.nameID, record.platformID, record.platEncID, record.langID)
        elif record.nameID in (6,):
            name.setName("CAPDisplay-Black", record.nameID, record.platformID, record.platEncID, record.langID)
        elif record.nameID == 3:
            name.setName("CAP Display 900; d'après Anybody (OFL)", record.nameID, record.platformID,
                         record.platEncID, record.langID)


def main() -> None:
    font = TTFont(SOURCE)
    font = instancer.instantiateVariableFont(font, {"wght": 900, "wdth": (75, 150)})
    options = subset.Options()
    options.layout_features = FEATURES
    options.flavor = "woff2"
    options.name_IDs = ["*"]
    options.notdef_outline = True
    options.hinting = False
    sub = subset.Subsetter(options)
    sub.populate(text=TEXT)
    sub.subset(font)
    rename(font)
    TARGET.parent.mkdir(parents=True, exist_ok=True)
    font.flavor = "woff2"
    font.save(TARGET)
    shutil.copyfile(LICENSE, TARGET.parent / "OFL-Anybody.txt")
    print(f"{TARGET.relative_to(ROOT)} : {TARGET.stat().st_size} o")


if __name__ == "__main__":
    main()
