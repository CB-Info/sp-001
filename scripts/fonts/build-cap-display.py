"""
Police d'affiche de la V2 (CAP Fitness) : « CAP Display ».

Anybody variable (OFL), instanciée à la graisse 900 en gardant l'axe de chasse
75–150 %, réduite aux glyphes du français, renommée pour ne réutiliser aucun nom
réservé. Le fichier produit est versionné : le build du site n'a pas besoin de
Python.

    python3 scripts/fonts/build-cap-display.py

Les contours qui se chevauchent (jambe et panse du R, queue du Q, cédille,
esperluette…) sont fusionnés dans la police variable elle-même, à toutes les
chasses : un délié (-webkit-text-stroke) trace chaque contour, et un
chevauchement y dessine un trait parasite à l'intérieur de la lettre (brief
§2.5 R2, §7.1 V2). L'instancier ne sait retirer les chevauchements que d'une
instance statique ; voir remove_overlaps().

Dépendances (hors dépôt) : fontTools ≥ 4.68, brotli et skia-pathops ≥ 0.9
(python3 -m pip install fonttools brotli skia-pathops).
"""
from __future__ import annotations

import math
import shutil
from array import array
from pathlib import Path

import pathops
from fontTools import subset
from fontTools.misc.bezierTools import splitQuadraticAtT
from fontTools.pens.basePen import decomposeQuadraticSegment
from fontTools.pens.recordingPen import DecomposingRecordingPen, RecordingPen
from fontTools.ttLib import TTFont
from fontTools.ttLib.tables import ttProgram
from fontTools.ttLib.tables._g_l_y_f import Glyph, GlyphCoordinates
from fontTools.ttLib.tables.TupleVariation import TupleVariation
from fontTools.varLib import instancer
from fontTools.varLib.iup import iup_delta, iup_delta_optimize
from fontTools.varLib.models import VariationModel, normalizeValue, piecewiseLinearMap, supportScalar

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
    + "\u00a0"  # espace insécable (U+00A0)
)
FEATURES = ["kern", "tnum", "case", "liga", "locl", "ccmp", "mark", "mkmk"]

# Chasses (font-stretch, %) employées par la page : délié 150, 125 et 100 ;
# plein 80 et 75 (brief §2.3). Le retrait des chevauchements y est le plus fidèle.
PAGE_STRETCHES = (75, 80, 100, 125, 150)

# Tolérance, en unités de police (2000 par em), pour dire qu'un point est posé
# sur un segment : les intersections de skia-pathops sont calculées en float32.
NEAR = 0.05


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


# ── Retrait des chevauchements dans la police variable ──────────────────────────
#
# Méthode : pour chaque glyphe qui se chevauche, skia-pathops fusionne les
# contours à chaque maître (chasses 75, 100 et 150 %). Ses sorties ne sont pas
# interpolables entre elles (il coupe les courbes à leurs extrema, retire les
# points alignés, choisit ses départs). On ne garde donc d'elles que la
# topologie : chaque contour fusionné est relu comme une suite de « parcours »
# le long des contours d'origine, du point d'intersection d'entrée au point de
# sortie. Les maîtres sont ensuite reconstruits depuis leurs propres segments
# d'origine, coupés aux intersections, avec la même suite de points partout :
# un nœud d'origine franchi dans un maître et pas dans un autre y devient un
# segment de longueur nulle posé sur l'intersection. Les écarts du gvar sont
# enfin recalculés ; chasses et approches ne changent pas (points fantômes
# repris tels quels), donc app/data/cap-fit.ts reste valide.
#
# Un glyphe dont la topologie change le long de l'axe (une intersection qui
# apparaît entre deux maîtres) est laissé tel quel et signalé : seul « æ » est
# dans ce cas, et un délié est toujours en capitales.


class Incompatible(Exception):
    """Le glyphe ne peut pas être fusionné de la même façon à tous les maîtres."""


def to_contours(value):
    """Commandes de stylo -> contours de segments explicites (lignes, quadratiques simples)."""
    contours, cur, start, last = [], None, None, None
    for op, args in value:
        if op == "moveTo":
            cur, start, last = [], args[0], args[0]
        elif op == "lineTo":
            if args[0] != last:
                cur.append(("L", last, args[0]))
            last = args[0]
        elif op == "qCurveTo":
            if args[-1] is None:
                raise Incompatible("contour tout hors courbe")
            for off, on in decomposeQuadraticSegment(list(args)) if len(args) > 2 else [args]:
                cur.append(("Q", last, off, on))
                last = on
        elif op == "curveTo":
            raise Incompatible("courbe cubique")
        else:  # closePath, endPath
            if last != start:
                cur.append(("L", last, start))
            if cur:
                contours.append(cur)
    return contours


def point_at(seg, t):
    if seg[0] == "L":
        (x0, y0), (x1, y1) = seg[1], seg[2]
        return (x0 + (x1 - x0) * t, y0 + (y1 - y0) * t)
    (x0, y0), (cx, cy), (x1, y1) = seg[1], seg[2], seg[3]
    a, b, c = (1 - t) ** 2, 2 * (1 - t) * t, t * t
    return (a * x0 + b * cx + c * x1, a * y0 + b * cy + c * y1)


def project(seg, p):
    """(t, distance) du point de seg le plus proche de p (Newton pour une courbe)."""
    if seg[0] == "L":
        (x0, y0), (x1, y1) = seg[1], seg[2]
        dx, dy = x1 - x0, y1 - y0
        l2 = dx * dx + dy * dy
        t = 0.0 if l2 == 0 else min(1.0, max(0.0, ((p[0] - x0) * dx + (p[1] - y0) * dy) / l2))
        return t, math.dist(point_at(seg, t), p)
    (x0, y0), (cx, cy), (x1, y1) = seg[1], seg[2], seg[3]
    t = min(range(65), key=lambda k: math.dist(point_at(seg, k / 64), p)) / 64
    for _ in range(40):
        bx, by = point_at(seg, t)
        d1x, d1y = 2 * ((1 - t) * (cx - x0) + t * (x1 - cx)), 2 * ((1 - t) * (cy - y0) + t * (y1 - cy))
        d2x, d2y = 2 * (x1 - 2 * cx + x0), 2 * (y1 - 2 * cy + y0)
        f = (bx - p[0]) * d1x + (by - p[1]) * d1y
        df = d1x * d1x + d1y * d1y + (bx - p[0]) * d2x + (by - p[1]) * d2y
        if df == 0:
            break
        nt = min(1.0, max(0.0, t - f / df))
        done = abs(nt - t) < 1e-14
        t = nt
        if done:
            break
    return t, math.dist(point_at(seg, t), p)


def piece(seg, t0, t1):
    """Morceau de seg de t0 à t1 (t0 > t1 : parcouru à l'envers)."""
    a, b = sorted((t0, t1))
    if seg[0] == "L":
        out = ("L", point_at(seg, a), point_at(seg, b))
    elif a <= 0 and b >= 1:
        out = seg
    else:
        parts = splitQuadraticAtT(seg[1], seg[2], seg[3], *[t for t in (a, b) if 0 < t < 1])
        out = ("Q", *parts[1 if a > 0 else 0])
    if t0 > t1:
        out = ("L", out[2], out[1]) if out[0] == "L" else ("Q", out[3], out[2], out[1])
    return out


def cyc(d, n):
    """Écart d sur un contour de n segments, ramené dans [-n/2, n/2)."""
    return (d + n / 2) % n - n / 2


def positions(orig, i, p):
    """Positions u (indice du segment + t) de p sur le contour d'origine i."""
    out = []
    for j, s in enumerate(orig[i]):
        t, d = project(s, p)
        if d < NEAR:
            out.append(j + t)
    return out


def split_on_nodes(orig, seg):
    """
    Coupe un segment fusionné rectiligne aux nœuds d'origine posés dessus : skia
    réunit en une seule ligne deux bords colinéaires de contours différents
    (la barre haute de Æ).
    """
    if seg[0] != "L":
        return [seg]
    ts = sorted(
        {
            t
            for c in orig
            for s in c
            for t, d in [project(seg, s[1])]
            if d < NEAR and 1e-9 < t < 1 - 1e-9
        }
    )
    pts = [seg[1]] + [point_at(seg, t) for t in ts] + [seg[2]]
    return [("L", a, b) for a, b in zip(pts, pts[1:])]


def runs(orig, merged_contours):
    """
    Relit chaque contour fusionné comme une suite cyclique de parcours
    [i, sens, u_début, u_fin, entier] le long des contours d'origine : u n'est
    pas borné (u_fin - u_début est la longueur signée du parcours), et
    « entier » dit qu'un contour d'origine est repris tout entier.
    """
    result = []
    for contour in merged_contours:
        pieces = []
        for seg0 in contour:
            for seg in split_on_nodes(orig, seg0):
                mid = point_at(seg, 0.5)
                found = None
                for i in range(len(orig)):
                    um = positions(orig, i, mid)
                    ua = positions(orig, i, seg[1])
                    ub = positions(orig, i, seg[-1])
                    if not (um and ua and ub):
                        continue
                    n = len(orig[i])
                    da = min((cyc(u - um[0], n) for u in ua), key=abs)
                    db = min((cyc(u - um[0], n) for u in ub), key=abs)
                    if da < 0 < db or db < 0 < da:
                        found = [i, 1 if db > 0 else -1, um[0] + da, um[0] + db]
                        break
                if not found:
                    raise Incompatible("segment fusionné hors des contours d'origine")
                pieces.append(found)

        def joins(a, b, n):
            return abs(cyc(a - b, n)) < 1e-6

        merged = []
        for p in pieces:
            last = merged[-1] if merged else None
            if last and last[:2] == p[:2] and joins(last[3], p[2], len(orig[p[0]])):
                last[3] += p[3] - p[2]
            else:
                merged.append(list(p))
        if len(merged) > 1:
            first, last = merged[0], merged[-1]
            if first[:2] == last[:2] and joins(last[3], first[2], len(orig[first[0]])):
                first[2] -= last[3] - last[2]
                merged.pop()
        for r in merged:
            n = len(orig[r[0]])
            shift = math.floor(r[2] / n) * n
            r[2] -= shift
            r[3] -= shift
            r.append(len(merged) == 1 and abs(abs(r[3] - r[2]) - n) < 1e-6)
        result.append(merged)
    return result


def canonical(contours):
    """Ordre et départs fixes : par contour d'origine, puis par position."""
    out = []
    for c in sorted(contours, key=lambda c: min((r[0], r[2]) for r in c)):
        k = min(range(len(c)), key=lambda q: (c[q][0], c[q][2]))
        out.append(c[k:] + c[:k])
    return out


def align(orig, ref, cand):
    """Range les contours et parcours de cand dans l'ordre de ref (même topologie)."""
    free = list(range(len(cand)))
    aligned = []
    for rc in ref:
        best = None
        for ci in free:
            cc = cand[ci]
            if len(cc) != len(rc):
                continue
            for rot in range(len(cc)):
                rr = cc[rot:] + cc[:rot]
                if any(a[0] != b[0] or a[1] != b[1] or a[4] != b[4] for a, b in zip(rc, rr)):
                    continue
                cost = sum(
                    abs(cyc(b[2] - a[2], len(orig[a[0]]))) + abs(cyc(b[3] - a[3], len(orig[a[0]])))
                    for a, b in zip(rc, rr)
                )
                if best is None or cost < best[0]:
                    best = (cost, ci, rr)
        if best is None:
            raise Incompatible("topologie différente selon la chasse")
        free.remove(best[1])
        rows = []
        for a, b in zip(rc, best[2]):
            shift = cyc(b[2] - a[2], len(orig[a[0]])) - (b[2] - a[2])
            rows.append([b[0], b[1], b[2] + shift, b[3] + shift, b[4]])
        aligned.append(rows)
    if free:
        raise Incompatible("contours en trop")
    return aligned


def rebuild(origs, masters):
    """
    Contours fusionnés de chaque maître, reconstruits sur ses segments d'origine
    avec la même suite de points partout. Un nœud d'origine franchi par un
    parcours dans un maître au moins est gardé dans tous : là où il tombe hors
    du parcours, il devient un segment de longueur nulle posé sur l'intersection.
    """
    out = [[] for _ in masters]
    for k, ref_contour in enumerate(masters[0]):
        for contours in out:
            contours.append([])
        for r, (i, sens, _, _, full) in enumerate(ref_contour):
            n = len(origs[0][i])
            if full:
                for m, contours in enumerate(out):
                    segs = origs[m][i]
                    contours[k].extend(segs if sens > 0 else [piece(s, 1, 0) for s in reversed(segs)])
                continue
            nodes = set()
            for mr in masters:
                lo, hi = sorted(mr[k][r][2:4])
                nodes.update(range(math.floor(lo) + 1, math.ceil(hi)))
            nodes = sorted(nodes, reverse=sens < 0)
            bounds = [None, *nodes, None]
            for m, mr in enumerate(masters):
                ua, ub = mr[k][r][2:4]
                lo, hi = sorted((ua, ub))
                cuts = [ua, *[min(hi, max(lo, float(x))) for x in nodes], ub]
                for q, (a, b) in enumerate(zip(cuts, cuts[1:])):
                    # Segment d'origine du morceau, fixé par la structure commune.
                    before, after = bounds[q], bounds[q + 1]
                    if sens > 0:
                        j = before if before is not None else (after - 1 if after is not None else math.floor(ua))
                    else:
                        j = before - 1 if before is not None else (after if after is not None else math.ceil(ua) - 1)
                    seg = origs[m][i][j % n]
                    if abs(a - b) < 1e-12:
                        f = math.floor(a)
                        here = point_at(origs[m][i][f % n], a - f)
                        out[m][k].append(("L", here, here) if seg[0] == "L" else ("Q", here, here, here))
                    else:
                        out[m][k].append(piece(seg, min(1.0, max(0.0, a - j)), min(1.0, max(0.0, b - j))))
    return out


def tt_glyph(contours):
    """
    Glyphe TrueType simple, en coordonnées entières. Construit à la main et non
    par TTGlyphPen, qui retire le dernier point d'un contour quand il retombe sur
    le premier : selon la chasse, un segment de longueur nulle y conduirait ou non.
    """
    points, flags, ends = [], [], []
    for segs in contours:
        points.append(segs[0][1])
        flags.append(1)
        for k, s in enumerate(segs):
            if s[0] == "Q":
                points.append(s[2])
                flags.append(0)
            if k < len(segs) - 1:
                points.append(s[-1])
                flags.append(1)
        ends.append(len(points) - 1)
    glyph = Glyph()
    glyph.numberOfContours = len(ends)
    glyph.coordinates = GlyphCoordinates([(round(x), round(y)) for x, y in points])
    glyph.flags = array("B", flags)
    glyph.endPtsOfContours = ends
    glyph.program = ttProgram.Program()
    glyph.program.fromBytecode(b"")
    return glyph


def drop_implied(glyphs, tolerance=0.5):
    """
    Retire, dans tous les maîtres à la fois, les points sur la courbe posés au
    milieu de leurs deux voisins hors courbe (à 0,5 unité près) : TrueType les
    sous-entend, la police reste aussi légère que possible.
    """
    g0 = glyphs[0]
    keep = [True] * len(g0.flags)
    start = 0
    for end in g0.endPtsOfContours:
        idx = list(range(start, end + 1))
        for k, p in enumerate(idx):
            prev, nxt = idx[k - 1], idx[(k + 1) % len(idx)]
            if len(idx) > 3 and g0.flags[p] & 1 and not g0.flags[prev] & 1 and not g0.flags[nxt] & 1:
                keep[p] = not all(
                    abs(g.coordinates[p][d] - (g.coordinates[prev][d] + g.coordinates[nxt][d]) / 2) <= tolerance
                    for g in glyphs
                    for d in (0, 1)
                )
        start = end + 1
    ends, count, start = [], 0, 0
    for end in g0.endPtsOfContours:
        count += sum(keep[start : end + 1])
        ends.append(count - 1)
        start = end + 1
    for g in glyphs:
        g.coordinates = GlyphCoordinates([c for c, k in zip(g.coordinates, keep) if k])
        g.flags = array("B", [f for f, k in zip(g.flags, keep) if k])
        g.endPtsOfContours = list(ends)


def skia_path(value=None, contours=None):
    path = pathops.Path()
    pen = path.getPen()
    for op, args in value or []:
        getattr(pen, op)(*args)
    for segs in contours or []:
        pen.moveTo(segs[0][1])
        for s in segs:
            pen.lineTo(s[2]) if s[0] == "L" else pen.qCurveTo(s[2], s[3])
        pen.closePath()
    return path


def overlapping(path):
    merged = pathops.Path(path)
    merged.simplify()
    return len(list(path.contours)) != len(list(merged.contours)) or abs(abs(path.area) - abs(merged.area)) > 1


def master_locations(font):
    """
    Positions normalisées des maîtres : le défaut et les pics des régions du gvar,
    puis les chasses de la page qui n'en sont pas (renvoie aussi le nombre des
    premiers). Entre deux maîtres, le contour fusionné s'interpole et s'écarte un
    peu de la vraie fusion (7 unités sur 2000 au plus sans maître ajouté) ; aux
    chasses de la page, il s'en tient à une unité.
    """
    if len(font["fvar"].axes) != 1:
        raise ValueError("un seul axe de variation attendu")
    axis = font["fvar"].axes[0]
    peaks = {peak for tvs in font["gvar"].variations.values() for tv in tvs for _, peak, _ in tv.axes.values()}
    peaks.discard(0)
    avar = font["avar"].segments.get(axis.axisTag) if "avar" in font else None
    page = set()
    for value in PAGE_STRETCHES:
        v = normalizeValue(value, (axis.minValue, axis.defaultValue, axis.maxValue))
        page.add(piecewiseLinearMap(v, avar) if avar else v)
    page -= peaks | {0}
    base = [{}] + [{axis.axisTag: v} for v in sorted(peaks)]
    return base + [{axis.axisTag: v} for v in sorted(page)], len(base)


def coords_at(font, name, location):
    """Coordonnées d'origine du glyphe (points fantômes compris) à une position."""
    glyf, hmtx = font["glyf"], font["hmtx"]
    base, control = glyf._getCoordinatesAndControls(name, hmtx.metrics, None)
    ends = control[1] if control[0] >= 1 else list(range(len(control[1])))
    coords = GlyphCoordinates(base)
    for tv in font["gvar"].variations.get(name, []):
        scalar = supportScalar(location, tv.axes)
        if scalar:
            delta = tv.coordinates
            if None in delta:
                delta = iup_delta(delta, base, ends)
            coords += GlyphCoordinates(delta) * scalar
    return coords


def merge_glyph(font, name, locs):
    """Maîtres fusionnés et interpolables du glyphe, ou None s'il ne chevauche pas."""
    recordings = []
    for loc in locs:
        glyphset = font.getGlyphSet(location=loc, normalized=True)
        pen = DecomposingRecordingPen(glyphset)
        glyphset[name].draw(pen)
        # Coordonnées entières, comme une instance : skia-pathops calcule en
        # float32 et place mal les intersections de points non entiers.
        recordings.append(
            [(op, tuple(p if p is None else (round(p[0]), round(p[1])) for p in args)) for op, args in pen.value]
        )
    paths = [skia_path(value) for value in recordings]
    if not any(overlapping(p) for p in paths):
        return None
    origs, readings, areas = [], [], []
    for value, path in zip(recordings, paths):
        merged = pathops.simplify(path, clockwise=path.clockwise)
        out = RecordingPen()
        merged.draw(out)
        orig = to_contours(value)
        origs.append(orig)
        readings.append(runs(orig, to_contours(out.value)))
        areas.append(abs(merged.area))
    ref = canonical(readings[0])
    masters = [ref] + [align(origs[0], ref, reading) for reading in readings[1:]]
    glyphs = []
    for contours, area in zip(rebuild(origs, masters), areas):
        got = abs(skia_path(contours=contours).area)
        if abs(got - area) > max(2.0, area * 1e-4):
            raise Incompatible(f"aire {got:.0f} au lieu de {area:.0f}")
        glyphs.append(tt_glyph(contours))
    shape = (list(glyphs[0].endPtsOfContours), [f & 1 for f in glyphs[0].flags])
    if any((list(g.endPtsOfContours), [f & 1 for f in g.flags]) != shape for g in glyphs):
        raise Incompatible("points incompatibles")
    drop_implied(glyphs)
    return glyphs


def remove_overlaps(font: TTFont) -> None:
    """Fusionne les contours qui se chevauchent, à toutes les chasses de l'axe."""
    glyf, gvar, hmtx = font["glyf"], font["gvar"], font["hmtx"]
    locs, n_base = master_locations(font)
    axis = font["fvar"].axes[0].axisTag
    base_model = VariationModel(locs[:n_base], axisOrder=[axis])
    stops = sorted({0.0, *(v for loc in locs for v in loc.values())})
    # Glyphes simples d'abord : un composé (« ç ») est relu avec ses composants corrigés.
    order = sorted((g for g in font.getGlyphOrder() if g != ".notdef"), key=lambda g: glyf[g].isComposite())
    done, left = [], []
    for name in order:
        try:
            glyphs = merge_glyph(font, name, locs)
        except Incompatible as err:
            left.append(f"{name} ({err})")
            continue
        if glyphs is None:
            continue
        phantoms = [list(coords_at(font, name, loc))[-4:] for loc in locs]
        masters = [
            GlyphCoordinates([(round(x), round(y)) for x, y in list(g.coordinates) + ph])
            for g, ph in zip(glyphs, phantoms)
        ]
        glyph = glyphs[0]
        glyph.recalcBounds(glyf)
        # Écarts des maîtres d'origine, puis, à chaque chasse ajoutée, une
        # correction en tente entre ses deux voisins : l'écart à l'interpolation
        # des maîtres d'origine. Un point qui s'en écarte d'une unité au plus n'en
        # porte pas : seules les jonctions sont corrigées, le gvar reste léger.
        # (getDeltas soustrait en place : il reçoit des copies.)
        deltas = base_model.getDeltas([GlyphCoordinates(m) for m in masters[:n_base]])
        tuples = list(zip(base_model.supports[1:], deltas[1:]))
        for k in range(n_base, len(locs)):
            peak = locs[k][axis]
            lower = max(v for v in stops if v < peak)
            upper = min(v for v in stops if v > peak)
            predicted = base_model.interpolateFromDeltas(locs[k], deltas)
            correction = [
                (0, 0) if max(abs(p[0] - q[0]), abs(p[1] - q[1])) <= 1 else (p[0] - q[0], p[1] - q[1])
                for p, q in zip(masters[k], predicted)
            ]
            tuples.append(({axis: (lower, peak, upper)}, correction))
        variations = []
        for support, delta in tuples:
            delta = [(round(x), round(y)) for x, y in delta]
            if any(x or y for x, y in delta):
                optimized = iup_delta_optimize(delta, list(masters[0]), glyph.endPtsOfContours, tolerance=0.5)
                variations.append(TupleVariation(support, optimized if None in optimized else delta))
        glyf[name] = glyph
        # Même point fantôme gauche : l'approche ne bouge pas.
        hmtx[name] = (hmtx[name][0], glyph.xMin - masters[0][-4][0])
        gvar.variations[name] = variations
        done.append(name)
    print(f"Chevauchements retirés : {len(done)} glyphes ({' '.join(done)}).")
    if left:
        print(f"Laissés tels quels : {', '.join(left)}.")


def main() -> None:
    # Horodatage de la source conservé : deux constructions donnent le même fichier.
    font = TTFont(SOURCE, recalcTimestamp=False)
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
    remove_overlaps(font)
    rename(font)
    TARGET.parent.mkdir(parents=True, exist_ok=True)
    font.flavor = "woff2"
    font.save(TARGET)
    shutil.copyfile(LICENSE, TARGET.parent / "OFL-Anybody.txt")
    print(f"{TARGET.relative_to(ROOT)} : {TARGET.stat().st_size} o")


if __name__ == "__main__":
    main()
