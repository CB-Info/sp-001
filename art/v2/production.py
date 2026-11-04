"""
Plan de production des images de la V2 : maquette CAP Fitness by EBC Sport.

Source unique des prompts (brief docs/brief/v2.md, §3). Ce script écrit
art/v2/prompts/<id>.prompt.txt et art/v2/production.json ; la chaîne envoyée à
Higgsfield est exactement le contenu du fichier .prompt.txt.

Série « nuit » : une seule salle de village fictive, de nuit, photographiée en
couleur puis convertie en noir et blanc vrai par art/v2/grade.py. Les personnes
sont fictives ; six portraits de casting (non publiés) servent de références de
visage pour que la même personne reste la même d'une scène à l'autre.
"""
import json
from pathlib import Path

ART = Path(__file__).parent

SERIES = (
    "Photographed in full color; it will be converted to black and white in post-production. "
    "Setting: the same small independent gym in a French village, at night: matte black walls, black "
    "rubber floor tiles with a faint sheen, a row of tall industrial windows on one wall letting in cool "
    "streetlight, no other light sources unless specified. People: ordinary local members of varied ages "
    "and body types, natural non-model bodies, real textured skin, no oiled muscles, no heavy makeup; "
    "candid, caught mid-action; nobody looks at the camera. Clothing: plain unbranded sportswear in "
    "black, charcoal or dark grey, each person in a different cut. Equipment: plain, unbranded, matte. "
    "Absolutely no text, letters, numbers, logos, brand marks, signage, posters, screens, displays, "
    "stickers, sponsor patches or watermarks anywhere in the image. Camera: full-frame, 35 mm lens at "
    "f/2, 1/30 s, slight motion blur on moving limbs and equipment, subjects may be cut by the frame "
    "edge. Low-key photographic look: deep true blacks, controlled highlights, no glow, no haze, no lens "
    "flare, no HDR look."
)

# La tenue du club : dégradé noir → citron, sans logo ni texte (jamais sous une zone de texte).
TEE = (
    "the club t-shirt: a plain crew-neck short-sleeve t-shirt dyed in a vertical gradient, solid black "
    "from the collar down to mid-chest, then a smooth fade through dark olive into bright lime green at "
    "the hem; plain fabric with no logo, no text, no print, no stripes and no reflective tape"
)

REFERENCE = (
    "Neutral reference portrait of a fictional person: {who}. Head and shoulders, plain dark grey studio "
    "background, soft even light, neutral relaxed expression, plain black crew-neck t-shirt, no jewellery, "
    "no text, no logo. Natural skin texture. Color photograph, 85 mm, f/4."
)

CASTING = {
    "a": "a woman around 40 with short dark-brown hair",
    "b": "a man around 55 with a short grey beard",
    "c": "a woman around 22 with long braids",
    "d": "a man around 30 with short black hair, clean-shaven",
    "e": "a woman around 62 with short white hair",
    "f": "a man around 68, balding, glasses removed",
}

FACES = (
    "Use the reference images only for the faces and builds of the people described; ignore their "
    "background, lighting and clothing. "
)

PLATES = [
    *[
        dict(id=f"cap-casting-{key}", target=None, model="nano_banana_pro", ratio="1:1", resolution="1k",
             family=None, references=[], prompt=REFERENCE.format(who=who))
        for key, who in CASTING.items()
    ],
    dict(
        id="cap-couverture", target="art/masters/v2/cap-couverture.jpg",
        model="nano_banana_pro", ratio="16:9", resolution="4k", family="nuit", references=["a", "b", "e", "d"],
        prompt=FACES + (
            "Wide horizontal photograph of a cross-training class at night, camera at hip height, slight "
            "low angle. On the far right edge of the frame, partly cut off by the edge, a woman around 40 "
            "with short dark-brown hair, in sharp focus, mid-way through a kettlebell swing, the plain "
            "black kettlebell at chest height; she wears a plain black fitted long-sleeve top and black "
            "leggings and is strongly rim-lit from behind by the tall windows on the right side of the "
            "room. Behind her, receding toward the left into darkness, a man around 55 with a short grey "
            "beard, a woman around 62 with short white hair and a man around 30 do the same movement "
            "slightly out of sync, small in the frame and softly out of focus, only their outlines "
            "catching faint light. Composition: the left three quarters of the frame and the lower third "
            "stay almost entirely in deep shadow, near-black floor and walls, leaving room for large "
            "overlaid text; the top tenth is a dark ceiling; the only bright areas are the windows and the "
            "rim light in the right quarter of the frame. "
        ) + SERIES,
    ),
    dict(
        id="cap-pound", target="art/masters/v2/cap-pound.jpg",
        model="nano_banana_pro", ratio="16:9", resolution="4k", family="nuit", references=["c", "b"],
        prompt=FACES + (
            "Medium shot at floor level of a cardio drumming class: a woman around 22 with long braids "
            "kneels in a deep lunge, both arms raised mid-strike, holding two plain light-wood drumsticks "
            "without any marking; the sticks are blurred by motion, her hands are sharp. She wears "
            f"{TEE} with plain black leggings. Behind her, slightly out of focus and cut by the right "
            "edge, a man around 55 with a short grey beard strikes the floor with the same plain sticks. "
            "Hard side light from the right only, black background. Composition: the subjects occupy the "
            "right 42 % of the frame; the left 58 % is almost black, empty floor and wall for overlaid "
            "text. "
        ) + SERIES,
    ),
    dict(
        id="cap-jump", target="art/masters/v2/cap-jump.jpg",
        model="nano_banana_pro", ratio="16:9", resolution="4k", family="nuit", references=["d"],
        prompt=FACES + (
            "Low three-quarter shot of a mini-trampoline fitness class: a row of three plain black round "
            "mini-trampolines with black frames recedes in perspective toward the right. A man around 30 "
            "is caught in the air above the nearest trampoline, knees lifted, feet sharp, arms blurred; "
            "two other people bounce on the trampolines behind him, out of focus. Backlight from the tall "
            "windows behind them outlines the bodies. He wears a plain charcoal t-shirt and black shorts. "
            "Composition: the action stays in the right 45 % of the frame; the left 55 % remains in deep "
            "shadow for overlaid text. "
        ) + SERIES,
    ),
    dict(
        id="cap-step", target="art/masters/v2/cap-step.jpg",
        model="nano_banana_pro", ratio="16:9", resolution="4k", family="nuit", references=[],
        prompt=(
            "Close shot at shin height of a step aerobics class: three plain black step platforms in a "
            "row; the feet and lower legs of three people, a woman around 62, a woman around 40 and a man "
            "around 55, step up in near-unison, one foot slightly out of time. Plain unbranded dark "
            "trainers, black leggings or joggers. A hard overhead pool of light falls on the steps, with "
            "reflections on the dark rubber floor. Composition: steps and feet in the right 45 % of the "
            "frame; the left 55 % is dark, empty floor. "
        ) + SERIES,
    ),
    dict(
        id="cap-force", target="art/masters/v2/cap-force.jpg",
        model="nano_banana_pro", ratio="3:4", resolution="2k", family="nuit", references=[],
        prompt=(
            "Very close, off-centre shot: the two chalk-covered hands of a man around 55 closing around "
            "the handle of a plain black cast-iron kettlebell with no markings, forearms visible, a cloud "
            "of chalk dust hanging in a single hard beam of light coming from the upper left; everything "
            "else falls into pure black. The top-right corner and the right side of the frame are pure "
            "black. "
        ) + SERIES,
    ),
    dict(
        id="cap-calme", target="art/masters/v2/cap-calme.jpg",
        model="nano_banana_pro", ratio="4:5", resolution="2k", family="nuit", references=["f"],
        prompt=FACES + (
            "Wide, quiet shot: a man around 68 with a balding head sits on a dark exercise mat in a seated "
            "forward fold, eyes closed, small in the frame and placed in the lower-left third; plain "
            "charcoal long-sleeve top and black joggers. A single soft light from above and a thin slice "
            "of window light across the floor. About 70 % of the image is deep black empty space. "
        ) + SERIES,
    ),
    dict(
        id="cap-famille", target="art/masters/v2/cap-famille.jpg",
        model="nano_banana_pro", ratio="16:9", resolution="4k", family="nuit",
        references=["a", "c", "d", "e", "f", "b"],
        prompt=FACES + (
            "Candid moment right after a class: six members of different ages, a woman around 40 with "
            "short dark-brown hair, a woman around 22 with long braids, a man around 30, a woman around "
            "62 with short white hair, a man around 68 and a man around 55 with a short grey beard, sit "
            "on the floor and on a low black bench, laughing together, towels around their necks, plain "
            "unlabelled stainless-steel bottles; one of them stands and stretches an arm. The man around "
            f"30, seated in the upper-right part of the group, wears {TEE}; everyone else wears plain dark "
            "sportswear. Gentle backlight from the tall windows behind them plus a soft overhead light. "
            "Composition: the group fills the upper two thirds of the frame; the bottom fifth is dark "
            "floor in deep shadow for overlaid text. Eye-level camera, slightly from above, 35 mm. "
        ) + SERIES,
    ),
    dict(
        id="cap-lieu", target="art/masters/v2/cap-lieu.jpg",
        model="nano_banana_pro", ratio="21:9", resolution="4k", family="nuit", references=[],
        prompt=(
            "Empty indoor-cycling room of the same gym at night, no people: a single row of plain "
            "matte-black indoor bikes with no brand, no screens and no display consoles recedes in strong "
            "perspective from the right foreground toward the back left. The only light is cool "
            "streetlight entering through the tall windows on the right, drawing long reflections on the "
            "slightly glossy black floor. The lower-left 45 % of the frame is deep shadow for overlaid "
            "text. 24 mm lens at f/4, tripod, everything sharp and still. "
        ) + SERIES,
    ),
]


def main() -> None:
    prompts = ART / "prompts"
    prompts.mkdir(exist_ok=True)
    for old in prompts.glob("*.prompt.txt"):
        old.unlink()
    for plate in PLATES:
        (prompts / f"{plate['id']}.prompt.txt").write_text(plate["prompt"] + "\n")
    meta = [{k: v for k, v in p.items() if k != "prompt"} for p in PLATES if p["target"]]
    (ART / "production.json").write_text(json.dumps(meta, indent=2, ensure_ascii=False) + "\n")
    print(f"{len(PLATES)} prompts → art/v2/prompts ; {len(meta)} plaques → art/v2/production.json")


if __name__ == "__main__":
    main()
