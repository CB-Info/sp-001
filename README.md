# CLUSEM — reconstruction animée (projet portfolio)

Reconstruction fidèle et animée d'une landing page de salle de sport, sous la marque fictive CLUSEM, pour mon portfolio. Elle reproduit un shot Dribbble (« VYRON ») d'un autre designer ; le crédit sera ajouté dans ce README, dans le footer de la démo et dans l'étude de cas.

## Statut

**v0.3 livrée** : couche de mouvement complète, sur la page de la v0.1 (statique, responsive, images définitives).

- Intro « Vitesse → Arrêt » du hero en CSS, puis une entrée tirée de sa propre matière pour chaque section (GSAP, ScrollTrigger, Lenis sur ordinateur).
- Overdrive : flou de bougé en WebGL sur la photo du hero (OGL, appareils capables seulement), échos de vitesse sur « SERVICES. », serre-livre du footer.
- Mouvement réduit en direct, sans JS, bfcache : toujours l'état final. Rien ne tourne au repos.

Vérifications : [`docs/verification/v0.1.md`](docs/verification/v0.1.md) et [`docs/verification/v0.3.md`](docs/verification/v0.3.md). Prochaine étape : revue de fin, `DESIGN.md`, `audit` et `polish`.

## Direction B « Le Club » (`/v2`)

Un deuxième modèle sur le même projet, pour proposer à un gérant de salle de quartier une autre envie que la V1. La V1 (`/`) est une salle de force nocturne, noir et rouge, sans conversion. La V2 traite CLUSEM comme **un club sportif en plein jour** : vert bouteille et jaune canari, Saira et Schibsted Grotesk, maillot, écusson, effectif, calendrier et carte de saison.

- **Moment signature** : le visiteur écrit son prénom, qui se floque au dos du maillot, lettre par lettre. Le prénom revient dans le formulaire d'essai.
- **Ce que la V1 n'avait pas** : calendrier de la semaine (jour du visiteur, ligne « Maintenant »), abonnements, horaires avec « Ouvert maintenant », adresse et plan, FAQ, formulaire d'essai qui imprime un billet. Rien n'est envoyé.
- **Garanties de la V1** : état final par défaut, sans JS et en mouvement réduit ; WCAG 2.2 AA ; Lighthouse ; tests e2e ; fiction étiquetée ; provenance des images.

Documents : [analyse de la V1](docs/v2/analyse-v1.md), [brief](docs/brief/v2.md), [vérification](docs/verification/v2.md). Code : [`app/pages/v2.vue`](app/pages/v2.vue), [`app/components/v2/`](app/components/v2/), tokens dans [`app/assets/css/v2.css`](app/assets/css/v2.css) (sous `<html data-site="v2">`), contenu dans [`app/data/club.ts`](app/data/club.ts). Images : [`art/v2/`](art/v2/).

## Commandes

| Commande                          | Rôle                                                            |
| --------------------------------- | --------------------------------------------------------------- |
| `pnpm dev`                        | Variantes d'images, puis serveur de développement               |
| `pnpm generate` (ou `pnpm build`) | Variantes d'images, puis site statique dans `.output/public`    |
| `pnpm check`                      | Prettier, ESLint, types                                         |
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
