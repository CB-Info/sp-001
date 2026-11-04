"""
Plan de production des images de la direction B, « Le Club » (page /v2).

Même méthode que la V1 (art/production.py) : ce script est la source unique des
prompts. Il écrit art/v2/prompts/<id>.prompt.txt et art/v2/production.json ; la
chaîne envoyée à Higgsfield est exactement le contenu du fichier .prompt.txt.

L'effectif reste celui de la V1 (mêmes coachs, mêmes elements de référence) :
c'est le même club, montré dans une autre direction. Tout le reste est nouveau.
"""
import json
from pathlib import Path

ART = Path(__file__).parent
ELEMENTS = {
    k: v["id"] for k, v in json.loads((ART.parent / "elements.json").read_text())["elements"].items()
}


def el(name: str) -> str:
    return f"<<<{ELEMENTS[name]}>>>"


# Le kit du club : la même tenue sur toutes les images de la série.
KIT = (
    "the club kit: a fitted dark bottle-green technical training jersey with one wide "
    "canary-yellow horizontal band across the chest (like a football club home shirt), "
    "completely plain, no crest, no logo, no lettering, no numbers; black or bottle-green shorts or "
    "leggings"
)

# Le club-house : un seul lieu pour toute la série.
GYM = (
    "the same bright community strength club for the whole series: tall industrial steel windows "
    "with soft overcast daylight, pale raw concrete walls, black rubber floor, light birch-plywood "
    "plyo boxes, matte black racks and barbells, a few plain rubber bumper plates in bottle green "
    "and canary yellow; tidy and uncluttered, no signage, no posters, no mirrors"
)

GRADE = (
    "GRADE (series 'Jour de club'): natural daylight colour, crisp and clean, true-to-life bottle "
    "greens and canary yellows, gently warm skin, open shadows, fine film grain; no teal-orange look, "
    "no heavy vignette, no haze."
)

AVOID = (
    "AVOID: any text, letters, numbers, logos, crests, badges, brand marks, swooshes, watermarks, "
    "signatures, signage; printed numbers on weight plates or dumbbells; plastic or airbrushed skin; "
    "beauty filter; extra or fused fingers; duplicated limbs; distorted equipment; CGI or "
    "illustration look; HDR halos."
)

SPORT = (
    "Photorealistic documentary sports photograph for a gym club website. SETTING: " + GYM + ". "
    "WARDROBE: " + KIT + ". " + GRADE
)

# Portraits officiels : la journée photo d'avant-saison, comme les clubs de foot.
OFFICIAL = (
    "Photorealistic official squad portrait from a sports club's pre-season photo day, 4:5 portrait, "
    "for a collectible player-card layout. FRAMING: head and shoulders to mid-chest, square to the "
    "camera, subject centred, eyes on a line about 34% from the top, about 10% headroom; arms "
    "relaxed. BACKDROP: seamless matte paper in a pale cool grey-green (close to #E3E9E4), evenly lit, "
    "no texture, no shadow on the paper. LIGHT: large soft key from camera left, white fill, clean "
    "catchlights. CAMERA: 85mm lens, f/5.6, everything sharp. WARDROBE: " + KIT + ". " + GRADE
    + " Same backdrop, light, lens and camera height for every portrait of the series."
)

PLATES = [
    # ── Effectif : portraits officiels (elements de la V1) ────────────────────
    *[
        dict(
            id=f"squad-{slug}",
            target=f"art/masters/v2/squad/squad-{slug}.jpg",
            model="nano_banana_pro", ratio="4:5", resolution="2k", family="jour",
            prompt=f"{OFFICIAL} SUBJECT: {el(element)}, {who}. {AVOID}",
        )
        for slug, element, who in [
            ("alex-vance", "clusem-alex-vance",
             "a confident personal coach, calm half-smile, looking straight into the lens"),
            ("sarah-jenkins", "clusem-sarah-jenkins",
             "a strength coach, blond hair tied back, friendly direct look, light smile"),
            ("marcus-roy", "clusem-marcus-roy",
             "a powerlifting coach with a very muscular build, serious and warm, chin slightly up"),
            ("elena-rostova", "clusem-elena-rostova",
             "a mobility and conditioning coach, composed, slight smile"),
            ("drake-torres", "clusem-drake-torres",
             "a boxing and conditioning coach, broad grin, relaxed shoulders"),
        ]
    ],
    # ── Photo d'équipe : l'effectif aligné, comme une photo de club ───────────
    dict(
        id="squad-team-photo",
        target="art/masters/v2/squad/team-photo.jpg",
        model="nano_banana_pro", ratio="21:9", resolution="2k", family="jour",
        prompt=(
            "Photorealistic official team photo of a sports club's five coaches, 21:9 panorama, "
            "symmetrical like a football team photo: all five standing side by side in one row in the "
            "middle third of the frame, shoulders slightly overlapping, arms crossed or hands behind "
            "the back, everyone looking into the camera, proud and relaxed. FROM LEFT TO RIGHT: "
            f"{el('clusem-drake-torres')}, {el('clusem-sarah-jenkins')}, {el('clusem-marcus-roy')} "
            f"in the centre, {el('clusem-elena-rostova')}, {el('clusem-alex-vance')}. Full bodies "
            "visible from head to knees, generous empty space above their heads and on both sides "
            "(about 22% on each side) for the website to crop. SETTING: " + GYM + ", racks softly out "
            "of focus behind them. WARDROBE: all five in " + KIT + ". CAMERA: 35mm lens at chest "
            "height, f/5.6, everyone sharp. " + GRADE + " " + AVOID
        ),
    ),
    # ── Geste : la photo annotée de la méthode ───────────────────────────────
    dict(
        id="method-squat",
        target="art/masters/v2/method/method-squat.jpg",
        model="nano_banana_pro", ratio="4:5", resolution="2k", family="jour",
        prompt=(
            SPORT + " 4:5 portrait. FRAMING: full body side view, slightly low camera, the athlete in "
            "the bottom of a heavy barbell back squat inside a matte black rack, thighs just below "
            "parallel, chest up, the loaded barbell (bottle-green bumper plates) clearly readable, the "
            "subject filling the central 60% of the frame with clean concrete wall around for "
            "annotations. SUBJECT: a strong woman in her early thirties with short dark hair, intense "
            "focus, chalk on her hands. A coach's hand is not visible. CAMERA: 35mm, f/4, sharp. "
            + AVOID
        ),
    ),
    # ── Disciplines (4:5, un sujet par discipline) ────────────────────────────
    *[
        dict(
            id=f"discipline-{slug}",
            target=f"art/masters/v2/disciplines/discipline-{slug}.jpg",
            model="nano_banana_pro", ratio="4:5", resolution="2k", family="jour",
            prompt=(
                SPORT + " 4:5 portrait. FRAMING: the action centred and close, the subject filling about "
                "two thirds of the frame height, head in the upper half, no limb cut at a joint. SUBJECT: " + subject + " CAMERA: "
                "35mm documentary, f/2.8, fast shutter, sharp subject. " + AVOID
            ),
        )
        for slug, subject in [
            ("force",
             "a man in his late twenties pulling a heavy conventional deadlift with textbook "
             "technique: the bar just leaving the floor over mid-foot, back flat and long, hips lower "
             "than the shoulders, arms straight, determined face; bottle-green and canary-yellow "
             "bumper plates with completely smooth faces, no embossed or printed marks."),
            ("cross-training",
             "a woman in her thirties driving a weighted push sled across the black rubber floor, "
             "low angle, body almost horizontal, powerful stride."),
            ("boxe",
             f"{el('clusem-drake-torres')} in the club kit holding black focus mitts while a "
             "woman member in the club kit throws a straight right punch, both in profile, sweat "
             "visible, plain black boxing gloves without any writing."),
            ("mobilite",
             f"{el('clusem-elena-rostova')} in the club kit guiding a male member through a deep "
             "lunge hip-flexor stretch on a dark mat beside the tall windows, calm and precise, "
             "her hand on his shoulder."),
            ("cardio",
             "two members in the club kit side by side on generic unbranded air rowing machines "
             "(plain matte black frame, monorail and flywheel cover with no writing, no logo, no "
             "label anywhere on the machines), mid-stroke, legs driving, faces focused, seen from a "
             "three-quarter front angle."),
            ("recuperation",
             "a member in the club kit sitting on the edge of a wooden sauna bench in a small bright "
             "recovery room next to a round cold-plunge tub, towel around the neck, relaxed after "
             "training, daylight from a frosted window."),
        ]
    ],
    # ── Club-house ────────────────────────────────────────────────────────────
    dict(
        id="clubhouse-floor",
        target="art/masters/v2/clubhouse/clubhouse-floor.jpg",
        model="nano_banana_pro", ratio="16:9", resolution="2k", family="jour",
        prompt=(
            SPORT + " 16:9 landscape. FRAMING: wide establishing shot of the main training floor in the "
            "morning, one-point perspective toward the tall windows, a row of racks on the left, open "
            "turf lane on the right, four or five members training far apart, small in the frame, no "
            "face recognisable. CAMERA: 24mm at chest height, f/8, everything sharp. " + AVOID
        ),
    ),
    dict(
        id="clubhouse-vestiaire",
        target="art/masters/v2/clubhouse/clubhouse-vestiaire.jpg",
        model="nano_banana_pro", ratio="4:5", resolution="2k", family="jour",
        prompt=(
            "Photorealistic interior photograph of a sports club locker room, 4:5 portrait, nobody in "
            "the frame. FRAMING: a long light-birch bench in the lower third; above it, a neat row of "
            "identical club jerseys hanging on black hooks against a pale concrete wall, each one "
            + KIT.split(";")[0].replace("the club kit: a fitted", "a")
            + "; a pair of clean trainers and a folded towel on the bench. LIGHT: soft morning daylight "
            "from a high window on the right. CAMERA: 35mm, f/5.6. " + GRADE + " " + AVOID
        ),
    ),
    dict(
        id="clubhouse-accueil",
        target="art/masters/v2/clubhouse/clubhouse-accueil.jpg",
        model="nano_banana_pro", ratio="4:5", resolution="2k", family="jour",
        prompt=(
            SPORT + " 4:5 portrait. FRAMING: the club's reception and juice bar, a light birch-wood "
            "counter in the foreground with two fresh smoothies and a potted plant, a member in the "
            "club kit laughing with a staff member behind the counter, the training floor softly out "
            "of focus beyond. CAMERA: 35mm, f/2.8. " + AVOID
        ),
    ),
    # ── Tribune : la parole aux membres (personnes fictives) ──────────────────
    *[
        dict(
            id=f"tribune-{slug}",
            target=f"art/masters/v2/tribune/tribune-{slug}.jpg",
            model="nano_banana_pro", ratio="1:1", resolution="1k", family="jour",
            prompt=(
                "Photorealistic candid portrait of a gym club member right after training, 1:1 square, "
                "chest-up, looking into the camera, genuine expression. SETTING: " + GYM + ", softly out "
                "of focus behind. WARDROBE: " + KIT + ". SUBJECT: " + who + " " + GRADE + " " + AVOID
            ),
        )
        for slug, who in [
            ("camille", "a woman in her late twenties with curly brown hair in a high bun, flushed "
                        "cheeks, bright laugh, a small towel over one shoulder."),
            ("bernard", "a fit man around 58 with a short grey beard and reading-glasses pushed up on "
                        "his head, warm proud smile."),
            ("yanis", "a man around 24, slim, short black hair, earnest quiet smile, holding a water "
                      "bottle without any label."),
        ]
    ],
]


def main() -> None:
    prompts = ART / "prompts"
    prompts.mkdir(exist_ok=True)
    for plate in PLATES:
        (prompts / f"{plate['id']}.prompt.txt").write_text(plate["prompt"] + "\n")
    meta = [{k: v for k, v in p.items() if k != "prompt"} for p in PLATES]
    (ART / "production.json").write_text(json.dumps(meta, indent=2, ensure_ascii=False) + "\n")
    print(f"{len(PLATES)} plates → art/v2/prompts, art/v2/production.json")


if __name__ == "__main__":
    main()
