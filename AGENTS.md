# Vitreva · Guide des agents

Ce dépôt contient le site vitrine multilingue de remplacement de pare-brise mobile de Vitreva à Gatineau : SvelteKit statique, publié sur GitHub Pages. Langue de travail : français; dates et heures : `America/Toronto`. Les instructions actuelles de l’utilisateur priment.

## Project context (Notion)
Profile: https://app.notion.com/p/4033e8630690813cba9afa4949d1c849
Start page: https://app.notion.com/p/4083e863069080df9e63d165128a1522
This project's guide: https://app.notion.com/p/4013e863069081889671c9674b2f1057
Shared formats (roadmap, slice, spec, handoff, session): https://app.notion.com/p/4003e8630690809b8045d8ad3a439995

- You MUST start every session by fetching my enabled Notion Skills via `notion-get-enabled-skills`.
- When Notion is connected, read the project guide before planning; re-read live records before relying on any status.
- Save durable facts about me as Notion Memories (parent "memory"), not in this file.
- Repository instructions own local commands and constraints; Notion owns plans, decisions and handoffs.
- Without Notion access, say what you couldn't read and propose the Notion update instead of claiming it.
- Never use em dashes in anything written for Yesito.

## Sources à consulter

Lire le [guide commun LLMs](https://app.notion.com/p/4013e863069081889671c9674b2f1057) au début d’une session et avant un nouveau travail. Ce fichier porte les contraintes du dépôt; les règles métier détaillées restent dans Notion.

| Travail | Source à ouvrir |
| --- | --- |
| Installation, commandes, configuration | `README.md`, `package.json`, `.env.example` et `.github/workflows/deploy.yml` |
| Périmètre, décisions et livraison technique | [Canonical](https://app.notion.com/p/4013e86306908158a8ccd41746d4b811), puis la slice concernée; [S06](https://app.notion.com/p/4013e863069081718912cfb0a08185d5) pour le site |
| Hébergement, domaine, intégrations et maintenance | [Architecture · Site web](https://app.notion.com/p/4013e86306908198a2f7c1b4efb15c14) |
| Modification visuelle | [S05 · Design](https://app.notion.com/p/4013e8630690812d8c21da1801f35be0) et [Figma Vitreva](https://www.figma.com/design/XAq0igNsPAHj2qKkgGObOg/Vitreva) |
| Acceptation humaine et points de lancement | [S07 · Revue](https://app.notion.com/p/4013e863069081bdb6c5e2ee4a60bec7) |
| Documents, finances, clients ou travaux réels | [Business](https://app.notion.com/p/4013e863069081bc9356f46cee126c10), puis le schéma vivant et la fiche propriétaire |

Le code établit le comportement implémenté; les décisions explicites établissent le périmètre accepté. Distinguer ces deux choses lorsqu’elles divergent. Les anciennes preuves `/fr/`, `/vitreva` ou « formulaire non configuré » ne décrivent pas nécessairement l’installation actuelle. Relire Architecture et la décision concernée avant d’en déduire une correction. Signaler un accès manquant et poursuivre le travail indépendant qui reste possible.

Dans Notion, réutiliser les fiches et leurs relations. Business possède les faits métier, Canonical les décisions de livraison, Architecture le fonctionnement installé. Garder les index courts et le contenu dans les feuilles; relire les éléments réellement modifiés. Une demande sur le code n’autorise pas à réorganiser les bases. Préférer une correction ciblée; une nouvelle couche ou un pipeline permanent doit répondre à un besoin réel.

## Dépôt public et données privées

`documents/`, `docs/`, `design-qa.md`, les captures de vérification et les fichiers d’environnement sont des matériaux locaux exclus de Git. Respecter `.gitignore`; conserver `.env.example` comme exemple sans valeurs d’accès réelles. Les originaux métier, données financières/juridiques, coordonnées personnelles, codes d’accès et captures privées restent hors du dépôt public.

Le point de départ précis du service et ses coordonnées géographiques sont privés. La recherche locale `docs/research/service-area-50km.md` peut justifier une modification de couverture si elle est disponible; publier seulement les conclusions autorisées. Les fichiers locaux de design et de vérification sont des références facultatives, pas des dépendances nécessaires à une copie propre du dépôt.

## Contrats du code

- **Site statique.** La configuration SvelteKit est dans `vite.config.ts`, avec `adapter-static` strict et entrées de prérendu explicites. Les routes `+server.ts` produisent des documents au build. GitHub Pages ne fournit aucun serveur applicatif en production.
- **Langues.** Le français est à `/`, les traductions sous leur préfixe (par exemple `/en/`), avec un seul rendu d’accueil dans `src/routes/[[lang=lang]]/` et les pages sous `src/routes/[[lang=lang]]/[page=page]/`, aux adresses traduites listées dans `src/lib/content/slugs.ts`. Garder le HTML complet et les liens de langue utilisables sans JavaScript. `src/lib/content/contract.ts` décrit le contenu modifiable et donne ses types, ses contrôles et les champs du CMS, avec les constructeurs de `@yesid/content-contract`; après l’avoir modifié, exécuter `bun run cms:config` et, si l’ordre change, `bun run content:format`. `locales.ts` porte les locales et `slugs.ts` les adresses. Chaque endroit du site a un fichier par langue, `<nom>.<locale>.json`; `contentGroups` dans `cms.ts` les liste tous et dispose l’éditeur comme le site. `index.ts` et `pages.ts` les assemblent sans changer la forme lue par les composants. Les valeurs dont le code dépend restent dans le code, jamais dans le contenu. Lors d’un ajout de langue, aligner contenu, paramètres, entrées de prérendu, sélecteur, langue HTML, SEO, sitemap et erreurs.
- **Propriété du contenu.** La copie, les libellés et les textes juridiques appartiennent à `src/lib/content/`. Téléphone, courriel, heures et zone sont écrits une seule fois, dans `business.<locale>.json` (Entreprise dans l’éditeur); `src/lib/config/site.ts` les lit, et les textes les citent avec `{phone}`, `{email}`, `{hours}`, `{hoursShort}`, `{days}`, `{Days}`, `{daysShort}`, `{radiusKm}`, `{municipalities}`, `{villages}` et `{boundary}`. Un repère inconnu arrête la construction. La description Google de la page de la zone garde une courte sélection de secteurs, modifiée dans son texte. Suivre les runes Svelte 5 et les imports `#lib/` existants. Placer le CSS de section dans son composant et les styles partagés dans `src/app.css`.
- **Chemins.** Utiliser `asset` et `resolve` de `$app/paths` pour les ressources et liens internes, `absoluteUrl()` pour les URL publiques absolues. `PUBLIC_SITE_URL` est une origine sans sous-chemin; `BASE_PATH` est séparé. Les valeurs sont fixées au build. La production utilise la racine du domaine; préserver aussi la compatibilité de construction sous `/vitreva`.
- **404.** `src/routes/404/+page.ts` impose volontairement `trailingSlash = 'never'` pour générer exactement `404.html`. Préserver le composant d’erreur partagé, la localisation et le retour vers l’accueil de la bonne langue.
- **Soumissions.** `src/lib/quote.ts` possède le transport Web3Forms; `QuoteSection.svelte` possède les champs et états. Garder le NIV/VIN facultatif, le consentement obligatoire, la distinction courriel/téléphone, le piège à robots et le délai de 15 secondes. Le succès exige une réponse HTTP acceptée et `success === true`; réinitialiser seulement après ce succès et conserver les champs en cas d’erreur. Aucune demande n’est stockée dans le navigateur.
- **Clé du formulaire.** Utiliser exclusivement la clé publique Web3Forms de Vitreva, injectée par configuration; sa valeur n’a pas sa place dans la documentation. Une clé absente désactive l’envoi avec un avis et les contacts directs. Les variables locales et leurs correspondances GitHub sont documentées dans le README.

## Produit, design et faits publics

Préserver le design établi pendant une correction fonctionnelle : interface noire et blanche, photographies en couleur naturelle, Manrope auto-hébergée, navigation dans un petit rétroviseur centré, bandeau publicitaire en dégradé noir vers transparent, héros vu du poste de conduite (fissure, tableau de bord et rétroviseurs en SVG), pied de page centré avec téléphone, courriel et crédit `Powered by yesid.dev`. Le numéro de téléphone est visible près des appels, sauf dans le dock compact. L’identité publique est Vitreva, sans nom ni portrait du propriétaire.

Le véhicule de référence est un **Ford Transit Connect compact noir de 2010**; les scènes d’installation sont extérieures. Les images générées sont des illustrations temporaires, jamais une preuve de travaux clients. Après remplacement des sources dans `assets/source/` ou du favicon SVG, exécuter `bun run images`; vérifier aussi les dimensions et descripteurs `srcset` de `Photo.svelte`, car le nom du fichier ne garantit pas sa largeur réelle. `bun run build` refait d’abord les cartes de partage de `static/images/og/`, non versionnées, à partir des titres, du bandeau et du téléphone enregistrés; il lui faut Microsoft Edge ou Google Chrome. Un titre trop long pour la carte est écrit plus petit, jamais refusé. Les quatre photos se choisissent dans Photos (`photos.<locale>.json`); vide, chaque emplacement garde la photo du site. `scripts/make-photos.ts` en fait les tailles servies, sans métadonnées, dans `static/images/photos/`, non versionné, et la construction retire `build/images/uploads` : aucun original n’est publié.

Préserver le verre natif, les reflets mesurés, le titre Gatineau légèrement adouci et les champs lisibles. Dans le CSS partagé, conserver l’ordre `-webkit-backdrop-filter` puis `backdrop-filter` et contrôler le rendu après minification. Le tableau de bord, les rétroviseurs latéraux et la radio forment un seul conteneur qui disparaît d’un bloc au défilement; la fissure se résorbe au défilement avec GSAP, chargé seulement au montage, et le héros reste complet sans JavaScript ou en mouvement réduit. Conserver le repli sans filtre, le mouvement réduit, et les FAQ natives.

Le propriétaire modifie son contenu et répond de ce que le site affirme : les contrôles portent sur la structure, jamais sur ses mots, et son contenu n’est pas remis en question. Un agent qui rédige pour lui utilise seulement les faits fournis. La couverture retenue est **Québec seulement, environ 50 km à vol d’oiseau**, avec confirmation individuelle du lieu et du rendez-vous. Val-des-Bois reste un cas en limite à confirmer selon l’adresse; un centre de localité dans le rayon ne garantit ni tout son territoire ni une distance routière équivalente. Maintenir la cohérence entre toutes les traductions, `site.serviceArea`, la FAQ, JSON-LD et `llms.txt`.

L’ADAS est une orientation vers un fournisseur approprié; les questions de couverture d’assurance vont à l’assureur. Ne pas inventer tarifs, délais, garanties, avis clients, statistiques, facturation directe aux assureurs ou partenariats. Les métadonnées utilisent les seuls faits connus, sans adresse de boutique fictive ni promesse de classement dans les moteurs ou les assistants.

## Vérification et livraison

Utiliser Bun pour les installations, scripts et tests, comme le workflow; Vite et SvelteKit restent sur Node 24 LTS. Pour une copie propre : `bun install --frozen-lockfile`. Pour une modification de source, exécuter `bun run check`, `bun run test` et `bun run build`. Pour une modification documentaire seule, vérifier les références, le contenu et le diff; aucun test applicatif supplémentaire n’est nécessaire.

Les tests actuels couvrent le transport du formulaire avec `fetch` simulé. Ils ne prouvent ni le rendu, ni la réception dans une boîte courriel. Pour une modification visible ou de navigation, contrôler le build avec `bun run preview` dans chaque langue active, sur écran étroit et bureau; vérifier les interactions et préférences affectées. Pour les chemins/configurations, vérifier les sorties à la racine et sous `/vitreva`, dont `404.html`, ressources, canoniques et liens de langue.

Avant un nouvel essai réel du formulaire, relire la preuve de livraison dans S06/Architecture et le besoin de la tâche : un test déjà reçu ne doit pas être renvoyé par routine. Un enregistrement du CMS sur `main` (`src/lib/content/*.json` ou `static/images/uploads/`) publie seul; `/admin` mène à l’éditeur sur `login.yesid.dev`. Pour tout autre changement, préparer avant toute publication et déclencher le workflow GitHub Pages seulement dans le périmètre autorisé par l’utilisateur.

Présenter séparément source modifiée, contrôles locaux, commit distant, déploiement du commit exact, acceptation du fournisseur, réception courriel et acceptation humaine. Les photos réelles et les décisions métier restent suivies dans S07. Une publication réussie ne clôt pas ces décisions. Terminer par le résultat, son lien, la vérification effectuée et le point restant utile.
