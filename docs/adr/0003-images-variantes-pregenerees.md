# ADR 0003 — Images : variantes pré-générées plutôt qu'IPX

- **Statut** : accepté
- **Date** : 2026-10-03
- **Remplace** : l'usage du provider IPX de `@nuxt/image` prévu par l'ADR 0001

## Contexte

En génération statique, `@nuxt/image` (provider IPX) prérend chaque variante sous une URL du type `/_ipx/f_avif&q_72&s_2048x1568/images/hero/hero-athlete.jpg`.

Sur Cloudflare (static assets), ces URL sont canonicalisées : **« & » comme « , » déclenchent une redirection 307** vers « %26 » ou « %2C ». Vérifié avec `wrangler dev` : 22 redirections sur la page d'accueil, image LCP comprise, soit un aller-retour réseau de plus par image. IPX n'accepte que ces deux séparateurs, et une URL déjà encodée ne passe plus au prérendu.

## Décision

**Générer nous-mêmes les variantes au build et garder `NuxtPicture`** :

- `scripts/build-images.mjs` (sharp) lit les masters étalonnés de `art/masters/` et écrit `public/img/<chemin>-<largeur>.<empreinte>.<avif|webp|jpg>` :
  - une échelle de largeurs commune, plafonnée à la largeur du master ;
  - AVIF en 4:4:4 pour la famille cramoisie ;
  - XMP IPTC « image générée par IA » et renvoi vers le master ;
  - mode incrémental, et suppression des variantes orphelines.
- `app/providers/variants.ts`, provider `@nuxt/image` : renvoie la plus petite variante assez large. Les 9 `NuxtPicture` ne changent pas (`sizes`, `preload`, `fetchpriority`).
- `app/data/image-variants.json`, généré par le script : largeurs et empreinte par image.

## Conséquences

- **Positives** :
  - aucune redirection, ce qui permet un cache `immutable` sur `/img/*` (empreinte de contenu dans le nom) ;
  - génération du site en 12 s au lieu de 34 à 84 s (plus de 382 routes IPX) ;
  - réglages d'encodage maîtrisés.
- **Coûts** :
  - environ 2 minutes d'encodage au premier build (incrémental ensuite) ;
  - `public/img` est un artefact de build, non versionné ;
  - les descripteurs `w` du `srcset` sont ceux calculés par `@nuxt/image`, donc une même variante peut y figurer plusieurs fois (sans effet visuel).
- **Vérifié** :
  - rendu identique à la version IPX (écart moyen de 0,33/255) ;
  - e2e 20/20 ;
  - 0 redirection et 0 erreur console via `wrangler dev`.
