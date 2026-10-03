> **Annexe brute** : vérification adverse de l'identification typographique (`v1b`), 2026-10-03. Les chemins `$W/…` renvoient au scratchpad de la session d'analyse (`…/scratchpad/work/v1b-fonts/`) et ne sont pas versionnés. La synthèse arbitrée est dans [`../00-synthese.md`](../00-synthese.md).

## Vérification adverse de l'identification typographique VYRON (v1b)

**Bilan.** Tektur, Inter et IBM Plex Mono résistent aux tests : aucun concurrent ne s'en approche. Trois points de l'analyste a2 sont en revanche faux :
- le **logo du header est en Tektur 700** avec un tracking de 0, et non en 600 à +0,02em ;
- les **chiffres 01/02 n'utilisent pas `tnum`** : ce sont les chiffres par défaut ;
- **Tektur possède bien le glyphe U+2192 (→)**, contrairement à ce qu'affirme le § 2 de a2.

**Méthode.** Les polices Google Fonts sont rendues en TTF complet dans Chromium, avec les mêmes mots que la capture. Les masques d'encre sont ensuite comparés après normalisation de la hauteur (IoU). La mention « largeur ×n » donne la largeur du candidat rapportée à celle de la référence, à hauteur égale. 28 instances display, 22 grotesques et 26 monos ont été testées. Scripts : `render.mjs` et `compose.py` ; rendus bruts dans `r/`.

### (a) Verdicts par rôle

**1. Display « BUILD », « STRENGTH » (2.png) et « SERVICES. » (3.png) : CONFIRMÉ, Tektur 500 à −0,02em**

| Mot | Tektur 500 (−0,02em) | Tektur 600 | Meilleurs concurrents |
|---|---|---|---|
| BUILD | **0,960** (largeur ×0,990) | 0,813 | Tomorrow 600 : 0,720 · Oxanium : 0,705 · Russo One : 0,696 · Chakra Petch : 0,668 |
| STRENGTH | **0,971** (largeur ×1,004) | 0,836 | Orbitron : 0,768 · Bai Jamjuree : 0,748 · Chakra Petch : 0,742 · Tomorrow : 0,721 · Kode Mono : 0,621 |
| SERVICES. | **0,959** (largeur ×0,991) | 0,834 | Tomorrow : 0,708 · Russo One : 0,696 · Oxanium : 0,674 · Chakra Petch : 0,628 · Aldrich : 0,578 |

Les glyphes concordent :
- **S** : terminaison haute coupée en biais, et un seul chanfrein, en bas à droite. Chakra Petch chanfreine les quatre coins, Oxanium les arrondit.
- **G** : barre horizontale avec marche, sans diagonale. Tomorrow et Chakra Petch ont un G biseauté.
- **R** : jambe droite en diagonale.
- **I** : empattements haut et bas, absents chez Chakra Petch, Oxanium et Aldrich.

Specimens : `view_str.png`, `view_svc.png`, `cmp_build.png`, `cmp_str.png`, `cmp_svc.png`.

**2. H2 « BUILT FOR THOSE WHO DON'T » : CONFIRMÉ, Tektur 600, même famille que le display**

| Zone | Tektur 600 | Tektur 500 | Tektur 700 | Concurrents |
|---|---|---|---|---|
| 4.png | **0,912** | 0,817 | 0,832 | Russo One : 0,764 · Tomorrow : 0,567 · Chakra Petch : 0,376 · Kode Mono : 0,321 |
| 3.png « KEEPS YOU MOTIVATED AND » | **0,924** | 0,839 | 0,829 | Russo One : 0,681 · Rajdhani : 0,630 · Tomorrow : 0,620 |

- À tracking 0, la largeur vaut ×1,025 : le tracking réel est donc d'environ −0,015 à −0,02em.
- Le Y en forme de « y » minuscule et le W se superposent à l'identique.
- La graisse 600 l'emporte aussi bien sur fond clair que sur fond sombre. La mesure n'est donc pas biaisée par l'effet de halo du texte clair sur fond foncé.

Specimens : `view_h2.png`, `cmp_h2.png`, `cmp_h2b.png`.

**3. Wordmark VYRON**

| Zone | Verdict | Tektur 700 (0) | 700 (+0,02em) | 600 (0) | 600 (+0,02em), thèse de a2 | 800 | 500 | Concurrents |
|---|---|---|---|---|---|---|---|---|
| Header (2.png) | **REMPLACÉ : Tektur 700, tracking 0** | **0,937** (largeur ×1,000) | 0,932 | 0,885 | 0,855 | 0,831 | 0,740 | Russo One : 0,799 · Tomorrow : 0,796 |
| Footer (s7) | **CONFIRMÉ : Tektur 700** | **0,940** | — | 0,901 | — | 0,847 | — | Tomorrow : 0,826 · Russo One : 0,800 |

- **Densité d'encre** du header, mesurée à trois seuils : 0,553 à 0,576. Celle de Tektur vaut 0,508 en 600 et 0,575 en 700.
- Les contreformes étroites du O et du R correspondent à la graisse 700.

Specimens : `view_vyh.png`, `view_vyf.png`, `cmp_vy_head.png`, `cmp_vy_foot.png`.

**4. Lead « Redefine Your / Physical Potential » : CONFIRMÉ (dessin Inter), à rendre en Inter Tight 400 à −0,01em**

| Candidat | Redefine Your | Physical Potential |
|---|---|---|
| **Inter Tight 400, −0,01em** | **0,814** | **0,771** |
| Inter 400, −0,05em | 0,746 | 0,678 |
| Inter opsz 32 (Display), −0,02em | 0,703 (à −0,01em) | 0,694 |
| Schibsted Grotesk | 0,734 | — |
| Roboto | 0,729 | 0,579 |
| Albert Sans | 0,717 | 0,631 |
| Instrument Sans | — | 0,464 |
| Geist | — | 0,361 |

- Les traits d'Inter sont présents : y à queue droite, t à coupe oblique, a à deux étages, f étroit.
- Seule la chasse d'Inter Tight colle au rythme des lettres. Inter, même resserré à −0,05em, ou en version optique Display, reste en dessous.

Specimens : `view_phys.png`, `cmp_redef.png`, `cmp_phys.png`.

Le corps de texte n'a pas été revérifié (trop flou dans les captures) : Inter en 300 ou 400 reste **INCERTAIN** sur la graisse.

**5. Mono « Trusted by people who demand real » (3.png) et « WHY VYRON » (4.png) : CONFIRMÉ, IBM Plex Mono 400, tracking 0**

| Zone | IBM Plex Mono 400 | Suivants |
|---|---|---|
| Trusted… | **0,718** (largeur ×0,990) | Fira Mono : 0,666 · Inconsolata : 0,657 · Fira Code : 0,651 · Plex 300 : 0,633 |
| fitness results. | **0,736** | Roboto Mono : 0,618 · Source Code Pro : 0,617 · Fira Mono : 0,610 |
| WHY VYRON | **0,779** | Plex 300 : 0,720 · JetBrains Mono : 0,680 · Red Hat Mono : 0,679 |

Indices glyphiques :
- le **r a un empattement de pied**, absent chez Fira, Inconsolata, JetBrains et Red Hat ;
- le T est sans empattement, ce qui exclut Courier Prime ;
- le a est à deux étages et le l à queue courbe ;
- le rapport chasse/capitale vaut ×0,99. Inconsolata est à ×0,92, Ubuntu Mono à ×0,87.

Specimens : `view_trust.png`, `cmp_trust.png`, `cmp_fitres.png`, `cmp_why.png`.

**6. Chiffres 01 / 02 : famille et graisse CONFIRMÉES (Tektur 500), `tnum` REMPLACÉ par les chiffres par défaut**

| Candidat (s3, astérisque masqué) | IoU |
|---|---|
| **Tektur 500, chiffres par défaut** | **0,903** |
| Tektur 600 | 0,823 |
| Tektur 500 + `tnum` | 0,703 |
| Goldman (largeur ×1,28) | 0,803 |
| Chakra Petch | 0,753 |

- **Le 1 par défaut de Tektur a déjà un drapeau et un pied.** L'argument de a2 (« le pied n'existe qu'avec `tnum` ») est faux.
- **Sur 3.png en haute définition**, le drapeau du 1 mesure environ 19 px pour une largeur totale du glyphe d'environ 39 px. Le 1 par défaut donne environ 20/40, le 1 tabulaire environ 38/58.
- **Le 2** a une épine oblique (barre qui descend de droite à gauche), comme chez Tektur. Chakra Petch, Tomorrow, Kode Mono et Goldman ont une diagonale, Oxanium une forme ronde.
- **Le 0** a des chanfreins aux deux coins du haut. Son rapport hauteur/largeur vaut environ 1,31 à 1,36, contre 1,306 pour Tektur, 1,52 pour Kode Mono et 1,01 pour Goldman.
- Le tracking de −0,06em retenu par a2 servait surtout à compenser la largeur des chiffres tabulaires. Avec les chiffres par défaut, il faut viser environ −0,02 à −0,04em (ESTIMÉ).

Specimens : `view_one.png`, `view_num_hi.png`, `view_n01.png`, `cmp_n01.png`.

**Hors périmètre.** Tags « 24/7 ACCESS » : Tektur 500 reste le meilleur (0,621), mais la capture est petite (`cmp_tag.png`). L'accent « Results are built, » n'a pas été vérifié : le masque rouge n'était pas fiable.

### (b) Familles recommandées pour le rebuild

Toutes sont libres (OFL) et auto-hébergeables via Fontsource.

| Rôle | Famille | Réglages |
|---|---|---|
| Display | **Tektur** variable (wght 400–900, wdth 75–100 ; garder wdth 100) | 500, −0,02em |
| H2 / H3 | Tektur | 600, −0,01 à −0,02em |
| Logo (header et footer) | Tektur | **700, tracking 0** |
| Chiffres-affiche 01/02 | Tektur | 500, chiffres proportionnels par défaut, **sans `tnum`** |
| Boutons | Tektur | 400 (thèse de a2, non revérifiée) |
| Lead 40 px | **Inter Tight** | 400, −0,01em ; UI en capitales en 500 (non revérifié) |
| Corps | **Inter** variable | 300–400, tracking modéré (graisse incertaine) |
| Labels | **IBM Plex Mono** | 400, tracking 0 |

Paquets correspondants : `@fontsource-variable/tektur`, `@fontsource-variable/inter-tight`, `@fontsource-variable/inter`, `@fontsource/ibm-plex-mono`. Il faut charger les sous-ensembles latin et latin-ext.

Pour se limiter à trois fichiers, on peut remplacer Inter Tight par Inter à −0,05em, au prix d'une fidélité moindre (IoU −0,07).

### (c) Display et H2 partagent-ils une famille ?

**Oui : Tektur partout.** Seule la graisse change : 500 pour le display, 600 pour les H2, 700 pour le logo.

### (d) Accents français et ™

La table des caractères des fichiers Tektur 500, 600 et 700 servis par Google Fonts (v1.005, 962 points de code) a été vérifiée, et une phrase de test rendue.

- **Couverts** : É È Ê Ë À Â Ä Ç Î Ï Ô Ö Ù Û Ü Ÿ Œ œ Æ æ « » ’ ‘ “ ” … – — €, ainsi que l'espace insécable (U+00A0).
- **™** : glyphe natif, en exposant aligné sur la ligne des capitales.
- **Seul manque l'espace fine insécable U+202F**, utilisée avant ; : ! ? et à l'intérieur des guillemets. Le navigateur prendra ce caractère dans la police de repli. IBM Plex Mono a le même manque ; Inter et Inter Tight sont complets.
- La cédille du Ç est dessinée comme une virgule détachée. C'est un choix de dessin, à valider visuellement.
- **Correction du § 2 de a2** : Tektur **contient** U+2192 (→). En revanche, le sous-ensemble « latin » de Google Fonts ne l'inclut pas : la flèche n'est disponible que si l'on auto-héberge le fichier complet ou un sous-ensemble sur mesure.
- Aucun astérisque (U+2731, U+2217) dans Tektur : l'astérisque à 8 branches doit bien être un SVG.

Specimen : `specimen_tektur_fr.png`.
