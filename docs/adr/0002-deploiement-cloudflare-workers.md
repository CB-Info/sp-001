# ADR 0002 — Déploiement : Cloudflare Workers, sortie statique « assets-only »

- **Statut** : accepté
- **Date** : 2026-10-03
- **Décideur** : l'auteur du projet (dépôt relié à Cloudflare Workers & Pages), configuration vérifiée par l'agent

## Contexte

Le dépôt GitHub est relié à Cloudflare « Workers & Pages » ; le Worker `sp-001` est construit par **Workers Builds** à chaque push sur la branche de production. Le premier déploiement automatique était un **Worker SSR Nitro** (bundle d'environ 1 Mo avec `env.ASSETS.fetch`), et non le site statique que l'on teste.

Cause, vérifiée en reproduisant l'environnement de build (`WORKERS_CI=1`) :

- Workers Builds définit `WORKERS_CI=1`. Nitro (détection « zero-config » via std-env) en déduit le fournisseur `cloudflare_workers` et choisit le preset `cloudflare-module`, aussi bien pour `nuxt build` que pour `nuxt generate`.
- Sous ce preset, Nitro écrit `.wrangler/deploy/config.json`, une redirection qui fait ignorer à Wrangler la configuration du dépôt.

## Décision

**Servir uniquement la sortie statique, par un Worker « assets-only » (aucun code serveur).**

| Élément                | Choix                                                                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Preset Nitro           | `nitro.preset: 'static'` dans `nuxt.config.ts` : la détection de Workers Builds n'a plus d'effet                               |
| Configuration Wrangler | `wrangler.jsonc` : `assets.directory: ./.output/public`, pas de `main`, `not_found_handling: 404-page`, `previews: {}`         |
| En-têtes               | `public/_headers` : `X-Robots-Tag: noindex` partout, durcissement sans CSP, cache `immutable` pour les fichiers hachés         |
| Scripts                | `build` et `generate` produisent la même sortie (images, puis build statique) : le script lancé par Workers Builds importe peu |
| Wrangler               | épinglé (4.147.0) : Workers Builds utilise la version de `package.json`                                                        |

### Réglages du tableau de bord (Workers & Pages → `sp-001` → Settings → Build)

| Réglage                         | Valeur                                                                                          |
| ------------------------------- | ----------------------------------------------------------------------------------------------- |
| Branche de production           | `claude/sharp-sagan-r45flc` (seule branche du dépôt)                                            |
| Commande de build               | `pnpm run build` (ou `pnpm run generate`, équivalent)                                           |
| Commande de déploiement         | `npx wrangler deploy` (valeur par défaut)                                                       |
| Commande de preview             | `npx wrangler preview` (valeur par défaut)                                                      |
| Répertoire racine               | vide                                                                                            |
| Variable de build (optionnelle) | `PNPM_VERSION=10.28.0`                                                                          |
| À **ne pas** définir            | `NITRO_PRESET`, `SERVER_PRESET`, `NUXT_IMAGE_PROVIDER` : ils écrasent la configuration du dépôt |

## Conséquences

- **Positives** : aucune exécution serveur (ni coût ni latence de Worker), ce qui est servi est exactement ce que testent la suite e2e et Lighthouse, les en-têtes sont tous déclarés dans le dépôt.
- **Limites** :
  - pas de CSP : Nuxt génère des scripts et des styles en ligne, et le nonce exige un serveur ;
  - la page 404 est le shell Nuxt rendu côté client ;
  - les URL de Preview sont publiques (contenu identique, `noindex`).
- **Vérifications** :
  - build sous `WORKERS_CI=1 CI=1` : « Nitro preset: static », `.output/public` seul ;
  - `wrangler deploy --dry-run` ;
  - `wrangler dev` : en-têtes, 404, 0 redirection, 0 erreur console.

## Sources

Documentation Cloudflare :

- [Workers Builds, configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)
- [Static assets, sites générés](https://developers.cloudflare.com/workers/static-assets/routing/static-site-generation/)
- [En-têtes `_headers`](https://developers.cloudflare.com/workers/static-assets/headers/)
- [Previews](https://developers.cloudflare.com/workers/previews/)

Sources Nitro et std-env (détection du fournisseur) sur GitHub. Rapport de recherche et vérification adverse : workflow `cloudflare-deploy-config` du 2026-10-03.
