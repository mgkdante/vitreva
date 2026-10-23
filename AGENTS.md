# Vitreva · Guide des agents

Ce dépôt contient le site vitrine multilingue de remplacement de pare-brise mobile de Vitreva à Gatineau : SvelteKit statique, publié sur GitHub Pages. Langue de travail : français; dates et heures : `America/Toronto`. Les instructions actuelles de l’utilisateur priment.

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
- **Langues.** Le français est à `/`, les traductions sous leur préfixe (par exemple `/en/`), avec un seul rendu dans `src/routes/[[lang=lang]]/`. Garder le HTML complet et les liens de langue utilisables sans JavaScript. `src/lib/content/index.ts` porte les locales et le type `Content` dérivé de `fr.json`; maintenir toutes les traductions sur cette structure. Lors d’un ajout de langue, aligner contenu, paramètres, entrées de prérendu, sélecteur, langue HTML, SEO, sitemap et erreurs.
- **Propriété du contenu.** La copie, les libellés et les textes juridiques appartiennent à `src/lib/content/`; les contacts et faits communs à `src/lib/config/site.ts`. Suivre les runes Svelte 5 et les imports `#lib/` existants. Placer le CSS de section dans son composant et les styles partagés dans `src/app.css`.
- **Chemins.** Utiliser `asset` et `resolve` de `$app/paths` pour les ressources et liens internes, `absoluteUrl()` pour les URL publiques absolues. `PUBLIC_SITE_URL` est une origine sans sous-chemin; `BASE_PATH` est séparé. Les valeurs sont fixées au build. La production utilise la racine du domaine; préserver aussi la compatibilité de construction sous `/vitreva`.
- **404.** `src/routes/404/+page.ts` impose volontairement `trailingSlash = 'never'` pour générer exactement `404.html`. Préserver le composant d’erreur partagé, la localisation et le retour vers l’accueil de la bonne langue.
- **Soumissions.** `src/lib/quote.ts` possède le transport Web3Forms; `QuoteSection.svelte` possède les champs et états. Garder le NIV/VIN facultatif, le consentement obligatoire, la distinction courriel/téléphone, le piège à robots et le délai de 15 secondes. Le succès exige une réponse HTTP acceptée et `success === true`; réinitialiser seulement après ce succès et conserver les champs en cas d’erreur. Aucune demande n’est stockée dans le navigateur.
- **Clé du formulaire.** Utiliser exclusivement la clé publique Web3Forms de Vitreva, injectée par configuration; sa valeur n’a pas sa place dans la documentation. Une clé absente désactive l’envoi avec un avis et les contacts directs. Les variables locales et leurs correspondances GitHub sont documentées dans le README.

## Produit, design et faits publics

Préserver le design établi pendant une correction fonctionnelle : interface noire et blanche, photographies en couleur naturelle, Manrope auto-hébergée, navigation centrée indépendamment du logo et des langues, pied de page centré avec contact courriel et crédit `Powered by yesid.dev`. Les boutons d’appel affichent `Appeler` / `Call` sans numéro visible. L’identité publique est Vitreva, sans nom ni portrait du propriétaire.

Le véhicule de référence est un **Ford Transit Connect compact noir de 2010**; les scènes d’installation sont extérieures. Les images générées sont des illustrations temporaires, jamais une preuve de travaux clients. Après remplacement des sources dans `assets/source/` ou du favicon SVG, exécuter `npm run images`; vérifier aussi les dimensions et descripteurs `srcset` de `Photo.svelte`, car le nom du fichier ne garantit pas sa largeur réelle.

Préserver le verre natif, les reflets mesurés, le titre Gatineau légèrement adouci et les champs lisibles. Dans le CSS partagé, conserver l’ordre `-webkit-backdrop-filter` puis `backdrop-filter` et contrôler le rendu après minification. Conserver le repli sans filtre, le mouvement réduit, les contrôles manuels du carrousel, les FAQ natives et la gestion du focus des dialogues.

Les promesses publiques exigent une source métier. La couverture retenue est **Québec seulement, environ 50 km à vol d’oiseau**, avec confirmation individuelle du lieu et du rendez-vous. Val-des-Bois reste un cas en limite à confirmer selon l’adresse; un centre de localité dans le rayon ne garantit ni tout son territoire ni une distance routière équivalente. Maintenir la cohérence entre toutes les traductions, `site.serviceArea`, la FAQ, JSON-LD et `llms.txt`.

L’ADAS est une orientation vers un fournisseur approprié; les questions de couverture d’assurance vont à l’assureur. Ne pas inventer tarifs, délais, garanties, avis clients, statistiques, facturation directe aux assureurs ou partenariats. Les métadonnées utilisent les seuls faits connus, sans adresse de boutique fictive ni promesse de classement dans les moteurs ou les assistants.

## Vérification et livraison

Utiliser Node 24 LTS et npm, comme le workflow. Pour une copie propre : `npm ci`. Pour une modification de source, exécuter `npm run check`, `npm test` et `npm run build`. Pour une modification documentaire seule, vérifier les références, le contenu et le diff; aucun test applicatif supplémentaire n’est nécessaire.

Les tests actuels couvrent le transport du formulaire avec `fetch` simulé. Ils ne prouvent ni le rendu, ni la réception dans une boîte courriel. Pour une modification visible ou de navigation, contrôler le build avec `npm run preview` dans chaque langue active, sur écran étroit et bureau; vérifier les interactions et préférences affectées. Pour les chemins/configurations, vérifier les sorties à la racine et sous `/vitreva`, dont `404.html`, ressources, canoniques et liens de langue.

Avant un nouvel essai réel du formulaire, relire la preuve de livraison dans S06/Architecture et le besoin de la tâche : un test déjà reçu ne doit pas être renvoyé par routine. Préparer les changements avant toute publication; déclencher le workflow manuel GitHub Pages seulement dans le périmètre autorisé par l’utilisateur.

Présenter séparément source modifiée, contrôles locaux, commit distant, déploiement du commit exact, acceptation du fournisseur, réception courriel et acceptation humaine. La revue juridique, les photos réelles et les décisions métier restent suivies dans S07. Une publication réussie ne clôt pas ces décisions. Terminer par le résultat, son lien, la vérification effectuée et le point restant utile.
