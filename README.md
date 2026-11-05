# CLUSEM — reconstruction animée (projet portfolio)

Reconstruction fidèle et animée d'une landing page de salle de sport, sous la marque fictive CLUSEM, pour mon portfolio. Elle reproduit un shot Dribbble (« VYRON ») d'un autre designer ; le crédit sera ajouté dans ce README, dans le footer de la démo et dans l'étude de cas.

## Statut

**v0.3 livrée** : couche de mouvement complète, sur la page de la v0.1 (statique, responsive, images définitives).

- Intro « Vitesse → Arrêt » du hero en CSS, puis une entrée tirée de sa propre matière pour chaque section (GSAP, ScrollTrigger, Lenis sur ordinateur).
- Overdrive : flou de bougé en WebGL sur la photo du hero (OGL, appareils capables seulement), échos de vitesse sur « SERVICES. », serre-livre du footer.
- Mouvement réduit en direct, sans JS, bfcache : toujours l'état final. Rien ne tourne au repos.

Vérifications : [`docs/verification/v0.1.md`](docs/verification/v0.1.md) et [`docs/verification/v0.3.md`](docs/verification/v0.3.md). Prochaine étape : revue de fin, `DESIGN.md`, `audit` et `polish`.

## V2 : maquette CAP Fitness, « Pleins & Déliés » (`/v2`)

Une maquette **non officielle** de site pour une vraie salle de village, CAP Fitness by EBC Sport, à lui proposer. Elle reprend l'identité de la salle (logo carré, citron sur noir, pouls ECG) sans copier son flyer, et garde les exigences de la V1. La page l'annonce en tête (« Maquette non officielle ») et liste dans son pied de page ce qui reste à confirmer par le club. Elle n'est pas indexée.

- **Direction « Pleins & Déliés »** : le logo éclaté en lockups. Un mot au contour citron ou craie (délié), un mot plein, une signature en italique. Le tracé ECG du logo traverse la page.
- **Typographie** : CAP Display, Anybody variable instanciée maison (graisse 900, chasses 75 à 150 %, 20,8 Ko), et Figtree pour le texte. Chaque mot d'affiche est ajusté à sa ligne sans JS, d'après des largeurs mesurées au build (`scripts/measure-fit.mjs`, contrôlées par `check-fit.mjs`).
- **Photo** : une série « nuit » en noir et blanc vrai. Ce sont des personnes fictives générées par IA, étalonnées par `art/v2/grade.py`, avec leur provenance embarquée. Le grain est posé en CSS.
- **Sept chapitres** : couverture, édito, cours (scènes et fiches), semaine (prochain cours à l'heure de Paris, fichiers `.ics` pour l'agenda), famille, tarifs et infos (en HTML natif, sans hydratation), fin.
- **Garanties de la V1** : état final par défaut, sans JS et en mouvement réduit ; WCAG 2.2 AA ; Lighthouse mobile ≥ 97 ; la V1 reste identique au pixel.

Documents : [analyse](docs/v2/analyse/README.md), [brief](docs/brief/v2.md) (amendements au §8), [vérification](docs/verification/v2.md). Code : [`app/pages/v2.vue`](app/pages/v2.vue), [`app/components/cap/`](app/components/cap/), tokens dans [`app/assets/css/v2.css`](app/assets/css/v2.css) (sous `<html data-site="v2">`), contenu dans [`app/data/cap.ts`](app/data/cap.ts). Images : [`art/v2/`](art/v2/).

## Commandes

| Commande                          | Rôle                                                            |
| --------------------------------- | --------------------------------------------------------------- |
| `pnpm dev`                        | Variantes d'images, puis serveur de développement               |
| `pnpm generate` (ou `pnpm build`) | Variantes d'images, puis site statique dans `.output/public`    |
| `pnpm check`                      | Prettier, ESLint, types, mots ajustés de la V2                  |
| `pnpm verify`                     | `check`, génération, puis tests e2e (Playwright, axe)           |
| `pnpm preview:worker`             | Sert la sortie comme en production (Cloudflare, `wrangler dev`) |

Déploiement : Cloudflare Workers, sortie statique (voir l'[ADR 0002](docs/adr/0002-deploiement-cloudflare-workers.md)). Images : [ADR 0003](docs/adr/0003-images-variantes-pregenerees.md) et le dossier [`art/`](art/) (prompts, provenance, étalonnage).

## Documents

- Analyse de la référence et recommandations : [`docs/analyse/00-synthese.md`](docs/analyse/00-synthese.md) (rapports détaillés dans [`docs/analyse/annexes/`](docs/analyse/annexes/))
- Produit (Impeccable `init`) : [`PRODUCT.md`](PRODUCT.md)
- Décisions : [stack Nuxt 4.5 + GSAP](docs/adr/0001-stack-nuxt-gsap.md), [déploiement Cloudflare](docs/adr/0002-deploiement-cloudflare-workers.md), [images](docs/adr/0003-images-variantes-pregenerees.md)
- Brief de la page (Impeccable `shape`), validé : [`docs/brief/accueil.md`](docs/brief/accueil.md) ; contrat de direction dans [`.impeccable/surfaces/`](.impeccable/surfaces/)

## Méthode

Design piloté par [Impeccable](https://github.com/pbakaus/impeccable) :

1. `init` : écrire `PRODUCT.md`.
2. `shape` : rédiger le brief de la surface.
3. Établir le contrat de direction.
4. Construire par jalons.
5. Passer la revue de fin.
6. `document` : écrire `DESIGN.md`.
7. `audit` puis `polish`.
