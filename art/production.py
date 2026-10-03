"""
Plan de production des images CLUSEM (Higgsfield) : un prompt par plate.

Source unique des prompts envoyés : ce script écrit art/prompts/<id>.prompt.txt
et art/production.json (modèle, ratio, résolution, cible). La chaîne envoyée à
l'outil est exactement le contenu du fichier .prompt.txt (provenance).

Les visages récurrents passent par les elements de référence (art/elements.json),
créés depuis les ancres de casting validées : aucune image du shot Dribbble
n'entre jamais dans le générateur.
"""
import json
from pathlib import Path

ART = Path(__file__).parent
ELEMENTS = {k: v["id"] for k, v in json.loads((ART / "elements.json").read_text())["elements"].items()}


def el(name: str) -> str:
    return f"<<<{ELEMENTS[name]}>>>"


AVOID = (
    "AVOID: any text, letters, numbers, logos, brand marks, swooshes, watermarks, signatures, "
    "signage; numbers on weight plates or dumbbells; plastic or airbrushed skin; beauty filter; "
    "extra or fused fingers; duplicated limbs; distorted equipment; CGI or illustration look; HDR halos."
)

TEAM_COMMON = (
    "Photorealistic environmental portrait of a fitness coach for a five-person team grid on a "
    "near-black website section, 4:5 portrait. FRAMING: chest-up, camera at eye level, subject "
    "centred, eyes on a line about 36% from the top, about 12% headroom; the portrait must also "
    "work when cropped to a centred square. SETTING: the same dark gym after hours for the whole "
    "series: black squat racks and cable machines far out of focus behind. LIGHT: soft key from "
    "45 degrees camera left, gentle fill, subtle cool rim light separating hair and shoulders from "
    "the background. CAMERA: 85mm lens, f/1.8, eyes critically sharp. GRADE (series 'Teal night'): "
    "low-key exposure, background desaturated slate grey, shadows tinted toward teal-black #040F0E, "
    "natural warm skin, the bottom of the frame darker so it fades into a near-black page; same "
    "exposure, lens, camera height and lighting for all five portraits of the series."
)

SERVICE_COMMON = (
    "Photorealistic sports photograph for a small service card on a gym website, 16:9 landscape. "
    "FRAMING: close medium shot; keep the top-right corner (12% of the width, 10% of the height) and "
    "the bottom-left corner (13% of the width, 22% of the height) free of faces, hands and key "
    "details because the card has notched corners. LIGHT: hard directional light, deep shadows, high "
    "contrast, rich tonal range (the image will be converted to black and white)."
)

PLATES = [
    # ── Hero : deux prises, on garde la meilleure ─────────────────────────────
    *[
        dict(
            id=f"hero-athlete--take-{n}",
            target="art/masters/hero/hero-athlete.jpg",
            model="cinematic_studio_2_5", ratio="4:3", resolution="4k", family="crimson",
            prompt=(
                "Photorealistic editorial sports photograph for the full-bleed hero of a gym website, "
                "4:3 landscape. FRAMING: medium close-up at shoulder height, subject placed well right of "
                "centre: her face at about 72% of the frame width and 33% of its height, eyes on the "
                "upper-third line. Her extended punching arm enters from the left edge between 40% and 55% "
                "of the frame height, in the upper half; below it the frame stays dark and calm. The bottom "
                "30% of the frame falls off into near-black shadow (reserved for a very large white "
                "headline). The upper-left 40% is soft, low-detail background (reserved for a short text "
                f"list). SUBJECT: {el('clusem-athlete')}, a woman around 28, athletic and lean, focused "
                "intense expression, lips closed, looking past the camera toward frame right; dark brown "
                "hair in a high ponytail whipping backwards with the movement; glistening sweat on shoulders "
                "and forearm. Wardrobe: plain white racerback training tank, dark unbranded boxing gloves "
                "with no lettering. ACTION: follow-through of a straight punch, shoulder rotated toward "
                "camera, torso twisting. SETTING: indoor boxing gym abstracted into long horizontal streaks: "
                "very strong horizontal motion blur across the entire background, soft out-of-focus vertical "
                "light columns at the far right edge. LIGHT: warm white key from frame right sculpting the "
                "face; deep crimson red light filling the whole background and rim-lighting hair, ear and "
                "shoulder; deep natural shadows. CAMERA: 85mm lens, f/2, 1/30 s panning shot: face and eyes "
                "tack sharp, ponytail ends and background smeared horizontally. GRADE: background deep "
                "crimson, natural warm skin, bottom of the frame crushed to near black, no haze. "
                + AVOID.replace("numbers on weight plates or dumbbells; ", "lettering on gloves; ")
            ),
        )
        for n in (1, 2)
    ],
    # ── Footer ────────────────────────────────────────────────────────────────
    dict(
        id="footer-pushup",
        target="art/masters/footer/footer-pushup.jpg",
        model="cinematic_studio_2_5", ratio="16:9", resolution="4k", family="crimson",
        prompt=(
            "Photorealistic cinematic sports photograph used as a full-bleed website footer background, "
            "16:9 landscape. FRAMING: camera at floor level, three-quarter front view. The athlete occupies "
            "the left 55% of the frame, head at about 30% of the width and 45% of the height; the right 45% "
            "is deep near-black negative space with almost no detail (reserved for navigation and text); "
            "the bottom 30% is dark rubber gym floor (a huge white wordmark will overlap it); the top-left "
            "corner stays dark enough for a white headline. SUBJECT: a muscular man around 30, shaved head, "
            "mid push-up with arms locked, head slightly lowered, intense focus, sweat on shoulders and "
            "upper back. Wardrobe: plain dark sleeveless training top, no logo. SETTING: dark functional "
            "training zone, black rubber floor, two red fluorescent tube lights mounted overhead, out of "
            "focus, at the top-left, faint haze catching the light. LIGHT: monochrome crimson practical "
            "light from above and behind; strong red rim on shoulders, arms and back; face mostly in "
            "shadow; no fill on the right side. CAMERA: 35mm lens, f/2.8, slight natural vignette. GRADE: "
            "crimson monochrome, midtones around #89060E, blacks crushed to pure black, smooth falloff into "
            "black toward the right edge. " + AVOID
        ),
    ),
    # ── À propos ──────────────────────────────────────────────────────────────
    dict(
        id="about-coach-alex-vance",
        target="art/masters/about/coach-alex-vance.jpg",
        model="nano_banana_pro", ratio="16:9", resolution="2k", family="teal",
        prompt=(
            "Photorealistic environmental portrait of a fitness coach for a website card, 16:9 landscape. "
            "FRAMING: medium shot from the chest up, camera at eye level; the coach stands at about 55% of "
            "the frame width, face at about 35% of the height, looking off-frame to the left with a slight "
            "confident smile; keep the top-right corner (15% x 15%) and the bottom-left corner (15% x 25%) "
            f"free of the face and hands, the card has notched corners. SUBJECT: {el('clusem-alex-vance')}. "
            "Wardrobe: plain red quarter-zip training top with a high collar, no logo. SETTING: a dark gym "
            "after hours, a black squat rack and a loaded barbell softly out of focus behind him, charcoal "
            "grey tones. LIGHT: soft key from camera left, subtle cool rim light, low-key exposure. CAMERA: "
            "50mm lens, f/2. GRADE: neutral dark, desaturated environment, the red top is the only strong "
            "colour, natural skin. " + AVOID
        ),
    ),
    *[
        dict(
            id=f"about-reviewer-0{i}",
            target=f"art/masters/about/reviewer-0{i}.jpg",
            model="nano_banana_pro", ratio="1:1", resolution="1k", family="warm",
            prompt=(
                "Photorealistic close headshot of a gym member for a tiny square avatar, 1:1. FRAMING: face "
                "centred and filling about 60% of the frame, eyes slightly above the middle, softly blurred "
                f"gym background. SUBJECT: {who}. Wardrobe: plain training top, no logo. LIGHT: soft warm "
                "window light from the side. GRADE: warm film look, slightly lifted blacks, natural skin, "
                "fine grain. " + AVOID
            ),
        )
        for i, who in enumerate(
            [
                "a man around 30, Black, short hair, friendly open smile",
                "a woman around 40, North African heritage, dark curly hair tied up, warm smile",
                "a man around 50, Western European, short grey hair and grey stubble, kind smile",
                "a woman around 25, South Asian, long dark hair, bright smile",
                "a man around 35, Latino, short dark beard, relaxed smile",
            ],
            start=1,
        )
    ],
    # ── Services (N&B ; l'état actif rouge est fait en CSS) ───────────────────
    dict(
        id="service-01-coaching", target="art/masters/services/service-01-coaching.jpg",
        model="nano_banana_pro", ratio="16:9", resolution="2k", family="mono",
        prompt=(
            SERVICE_COMMON + " SUBJECT: a personal trainer spotting a client during a dumbbell bench press: "
            "the trainer's hands hover just under the client's elbows, the client's face partly visible in "
            "profile, the trainer seen over the shoulder; both in plain dark training clothes, no logos. "
            "SETTING: dark gym, softly blurred background. CAMERA: 50mm lens, f/2.8. " + AVOID
        ),
    ),
    dict(
        id="service-02-force", target="art/masters/services/service-02-force.jpg",
        model="nano_banana_pro", ratio="16:9", resolution="2k", family="mono",
        prompt=(
            SERVICE_COMMON + " SUBJECT: a very muscular male torso and arms, the face cropped out of frame "
            "above the chin, plain sleeveless training top, no logo, a heavy plain chrome dumbbell in the "
            "foreground lower-centre, mid-curl. SETTING: dark gym. CAMERA: 50mm lens, f/2.8, the dumbbell "
            "slightly out of focus. " + AVOID
        ),
    ),
    dict(
        id="service-03-fonctionnel", target="art/masters/services/service-03-fonctionnel.jpg",
        model="nano_banana_pro", ratio="16:9", resolution="2k", family="mono",
        prompt=(
            SERVICE_COMMON + " SUBJECT: an athletic woman in profile swinging a plain black kettlebell at "
            "chest height, ponytail, head slightly down, plain light training top, no logo. SETTING: "
            "functional training zone, black rubber floor, dark background. CAMERA: 50mm lens, f/2.8, slight "
            "motion blur on the kettlebell. " + AVOID
        ),
    ),
    dict(
        id="service-04-conditioning", target="art/masters/services/service-04-conditioning.jpg",
        model="nano_banana_pro", ratio="16:9", resolution="2k", family="mono",
        prompt=(
            SERVICE_COMMON + " SUBJECT: an athlete leaning forward and driving a weighted sled across "
            "artificial turf, low camera angle from the side, face lowered and partly hidden, plain dark "
            "training clothes, no logos. SETTING: indoor turf lane in a dark gym. CAMERA: 35mm lens, f/2.8, "
            "1/30 s, motion blur on the legs and the background. " + AVOID
        ),
    ),
    # ── Programmes ────────────────────────────────────────────────────────────
    dict(
        id="program-marcus-roy", target="art/masters/programs/program-marcus-roy.jpg",
        model="nano_banana_pro", ratio="1:1", resolution="2k", family="teal",
        prompt=(
            "Photorealistic sports portrait for the programmes section of a gym website, 1:1 square. "
            "FRAMING: waist-up, camera at chest height, face at 50% of the width and 22% of the height; the "
            "top-right corner (13% x 6%) and the bottom-left corner (13% x 14%) hold no important detail, "
            f"the frame has notched corners. SUBJECT: {el('clusem-marcus-roy')}, very muscular build with "
            "broad shoulders and strong arms, intense focused expression, holding the ends of two thick "
            "battle ropes, one in each hand. Wardrobe: plain dark navy sleeveless training top, absolutely "
            "no logo. FOREGROUND: two out-of-focus vertical ropes very close to the lens at the left and "
            "right edges, creating depth. SETTING: dark gym. LIGHT: cool low-key, soft key from the upper "
            "left, subtle rim light. CAMERA: 85mm lens, f/2. GRADE: cool slate low-key, shadows toward "
            "teal-black #040F0E, natural warm skin. " + AVOID
        ),
    ),
    # ── Équipe (4:5 pour toutes : n'importe quel coach peut passer en vedette) ─
    *[
        dict(
            id=f"team-0{i}-{slug}", target=f"art/masters/team/team-0{i}-{slug}.jpg",
            model="nano_banana_pro", ratio="4:5", resolution="2k", family="teal",
            prompt=(
                f"{TEAM_COMMON} SUBJECT: {el('clusem-' + slug)}, {mood}, looking straight into the lens, "
                f"relaxed confident posture. Wardrobe: {wear}, no logo. " + AVOID
            ),
        )
        for i, slug, mood, wear in [
            (1, "alex-vance", "warm confident half smile", "plain black training t-shirt"),
            (2, "sarah-jenkins", "warm open smile", "plain black fitted training t-shirt"),
            (3, "marcus-roy", "focused expression with a slight smile, very muscular build, arms crossed",
             "plain black sleeveless training top"),
            (4, "elena-rostova", "calm assured expression with a subtle smile", "plain black long-sleeve training top"),
            (5, "drake-torres", "warm smile", "plain black training t-shirt"),
        ]
    ],
    # ── Témoignages (21:9, recadrés en 2,14:1 et en 16:9) ─────────────────────
    *[
        dict(
            id=f"testimonial-0{i}-{slug}", target=f"art/masters/testimonials/testimonial-0{i}-{slug}.jpg",
            model="cinematic_studio_2_5", ratio="21:9", resolution="4k", family="warm",
            prompt=(
                "Photorealistic candid sports photograph for a client testimonial card on a gym website, "
                "21:9 ultra-wide. FRAMING: the subject stays inside the central 50% of the frame so a "
                f"centred 16:9 crop still works; face at about 50% of the width and 38% of the height. "
                f"SUBJECT: {who}. ACTION: {action}. SETTING: {setting}. LIGHT: warm natural daylight, golden "
                "highlights. CAMERA: 35mm lens, f/2.8, 1/60 s, natural motion blur on the moving parts. "
                "GRADE: warm film look, slightly lifted blacks, shadows pushed toward yellow, fine visible "
                "grain. " + AVOID
            ),
        )
        for i, slug, who, action, setting in [
            (1, "jordan-tucker",
             "a man around 30, Black, athletic boxer build, wearing plain dark boxing shorts with a plain "
             "waistband without any text and dark unbranded boxing gloves",
             "throwing a hook into a red heavy bag at the right edge of the frame, mid-punch, focused",
             "an old boxing gym with daylight falling from high windows at the top-left"),
            (2, "nadia-benali",
             "a woman around 41, North African heritage, strong build, dark curly hair tied up, plain grey "
             "training top and black leggings, no logos",
             "finishing a barbell deadlift at lockout, proud focused expression, plain unmarked black "
             "bumper plates",
             "a bright warehouse gym with large windows, a little chalk dust in the air"),
            # v2 : la première prise montrait un homme d'environ 35 ans, minuscule dans un plan large.
            (3, "paul-mercier",
             "a man in his early fifties, Western European, short grey hair, grey stubble beard, visible "
             "crow's feet and laugh lines, fit but not a bodybuilder, plain navy training t-shirt, no logo; "
             "medium shot from the knees up, he fills about 75% of the frame height",
             "walking toward the camera carrying two heavy plain kettlebells in a farmer's carry, "
             "determined half smile",
             "a bright functional training gym with rubber floor and large windows behind him"),
        ]
    ],
]

if __name__ == "__main__":
    out = []
    for p in PLATES:
        (ART / "prompts" / f"{p['id']}.prompt.txt").write_text(p["prompt"] + "\n")
        out.append({k: v for k, v in p.items() if k != "prompt"})
    (ART / "production.json").write_text(json.dumps(out, indent=2, ensure_ascii=False) + "\n")
    print(len(PLATES), "plates")
