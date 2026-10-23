# Vitreva

One-page French and English website for mobile windshield replacement in Gatineau. Built with SvelteKit 3, Svelte 5 and plain CSS, and prerendered for GitHub Pages.

## Develop

Use Node 24 LTS and npm.

```sh
npm ci
npm run dev
```

Open `/` for French or `/en/` for English. Both pages render complete HTML and retain both language links without JavaScript.

```sh
npm run check
npm test
npm run build
npm run preview
```

The static site is written to `build/`. There is no server to run in production.

## Edit content

- `src/lib/content/fr.json` and `en.json`: page copy, metadata, FAQs, form labels and legal text. Keep their keys aligned.
- `src/lib/content/index.ts`: typed locale selection.
- `src/lib/config/site.ts`: public business contact details and shared settings.
- `src/lib/components/`: named page sections, language switching, photography and legal dialog.
- `src/app.css`: shared typography, spacing, actions and glass material. Section styles live with their Svelte files.

The glass uses browser backdrop filtering, edge highlights and a restrained reflection. The service-area headline is softened under the reflective surface; form fields stay sharp. Pointer highlights run only with a fine pointer and motion enabled. Reduced motion and a solid-material fallback are included.

## Images

Current photographs are generated illustrations, used temporarily until real business photographs are available. They do not document completed customer jobs. The vehicle reference is a black 2010 Ford Transit Connect.

Source images are in `assets/source/`. After replacing them, run `node scripts/prepare-images.mjs` to regenerate the responsive WebP files and social image in `static/images/`. Preserve the intended subjects and crops when replacing them. Manrope is self-hosted through Fontsource. Carousel arrows are exported from the approved Figma design.

## Form inbox

Create and verify a Formspree form that delivers to `contact@vitreva.ca`. Set its HTTPS endpoint as `PUBLIC_QUOTE_ENDPOINT` locally or `QUOTE_ENDPOINT` in GitHub repository variables. The endpoint is public configuration, not a secret.

The form validates required fields, leaves the VIN optional, sends details to the configured endpoint, and displays success only after an accepted HTTP response. Failed requests retain entered details. A blank endpoint disables submission and offers telephone/email contact. No request data is stored in browser storage.

Before launch, verify an actual message reaches the inbox, configure provider spam/domain protections, and review privacy text against the provider and business practices. The preview does not claim operational email delivery while that setup is pending.

## GitHub Pages

The `Deploy GitHub Pages` workflow is manually started from the Actions tab. Enable **Settings → Pages → Source: GitHub Actions** first. It checks and builds the site, uploads `build/`, and deploys through the official Pages actions.

| Repository variable | Purpose |
| --- | --- |
| `SITE_URL` | Public origin, for example `https://mgkdante.github.io` or `https://vitreva.ca`. |
| `PAGES_BASE_PATH` | `/vitreva` for the project URL; empty for a custom domain. |
| `QUOTE_ENDPOINT` | Verified form inbox HTTPS endpoint; leave empty until connected. |

Without overrides, the workflow uses GitHub Pages metadata for origin and base path. Locally, copy `.env.example` to `.env` and set `PUBLIC_SITE_URL`, `BASE_PATH` and `PUBLIC_QUOTE_ENDPOINT` as needed. Build-time settings require rebuilding the site.

The site emits complete localized HTML, canonical and reciprocal language links, social metadata, LocalBusiness data with known facts, `sitemap.xml`, `robots.txt` and an optional `llms.txt`. The latter does not guarantee recommendations or rankings.

## Review and launch

The initial deployment is a review preview. Human visual/content acceptance, real inbox receipt, final privacy/terms review, real-photo replacement and custom-domain DNS/HTTPS checks are separate launch work. No ratings, service statistics, warranty terms or direct-insurer-billing arrangement are invented.

Local business documents, design research, verification captures and environment files are excluded from this repository.
