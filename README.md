# Vitreva

One-page French, English and Spanish website for mobile windshield replacement in Gatineau. Built with SvelteKit 3, Svelte 5 and plain CSS, and prerendered for GitHub Pages.

## Develop

Use Node 24 LTS and npm.

```sh
npm ci
npm run dev
```

Open `/` for French, `/en/` for English or `/es/` for Spanish. All three pages render complete HTML and retain their language links without JavaScript.

```sh
npm run check
npm test
npm run build
npm run preview
```

The static site is written to `build/`. There is no server to run in production.

## Edit content

- `src/lib/content/fr.json`, `en.json` and `es.json`: page copy, metadata, FAQs, form labels and legal text. Keep their keys aligned.
- `src/lib/content/index.ts`: typed locale selection.
- `src/lib/config/site.ts`: public business contact details and shared settings.
- `src/lib/components/`: named page sections, language switching, photography and legal dialog.
- `src/app.css`: shared typography, spacing, actions and glass material. Section styles live with their Svelte files.

The glass uses browser backdrop filtering, edge highlights and a restrained reflection. The service-area headline is softened under the reflective surface; form fields stay sharp. Pointer highlights run only with a fine pointer and motion enabled. Reduced motion and a solid-material fallback are included.

## Images

Current photographs are generated illustrations, used temporarily until real business photographs are available. They do not document completed customer jobs. The vehicle reference is a black 2010 Ford Transit Connect.

Source images are in `assets/source/`. After replacing them, run `node scripts/prepare-images.mjs` to regenerate the responsive WebP files and social image in `static/images/`. Preserve the intended subjects and crops when replacing them. Manrope is self-hosted through Fontsource. Carousel arrows are exported from the approved Figma design.

`static/favicon.svg` is the windshield mark; the image script also generates its PNG and Apple touch variants. The custom Transit Connect illustration is `static/images/transit-connect-404.svg`.

The shared error page uses localized copy from the content files. The `/404` route overrides trailing slashes to prerender the exact `404.html` file GitHub Pages serves for unknown URLs; the SvelteKit error handler uses the same design.

## Form inbox

The quote form uses Web3Forms directly from the browser, following the same pattern as yesid.dev. Create a Vitreva form, verify `contact@vitreva.ca` and select it as the recipient. Set the form's access key as `PUBLIC_WEB3FORMS_ACCESS_KEY` locally or `WEB3FORMS_ACCESS_KEY` in GitHub repository variables. This is a public client-side form key. Use Vitreva's own key rather than the one associated with yesid.dev.

The form validates required fields, leaves the VIN optional and sends quote details as JSON to `https://api.web3forms.com/submit`. A contact email becomes the reply-to address; phone-only contact stays a separate phone field. Vehicle, VIN, location, language, consent and message are forwarded with the request. Success requires both an accepted HTTP response and Web3Forms' explicit success acknowledgement. Failed requests retain entered details. A blank key disables submission and offers telephone/email contact. No request data is stored in browser storage.

Before launch, verify an actual message reaches the inbox, configure provider spam/domain protections, and review privacy text against the provider and business practices. The preview does not claim operational email delivery while that setup is pending.

## GitHub Pages

The `Deploy GitHub Pages` workflow is manually started from the Actions tab. Enable **Settings → Pages → Source: GitHub Actions** first. It checks and builds the site, uploads `build/`, and deploys through the official Pages actions.

| Repository variable | Purpose |
| --- | --- |
| `SITE_URL` | Public origin, for example `https://mgkdante.github.io` or `https://vitreva.ca`. |
| `PAGES_BASE_PATH` | `/vitreva` for the project URL; empty for a custom domain. |
| `WEB3FORMS_ACCESS_KEY` | Public form access key linked to the verified Vitreva recipient; leave empty until connected. |

Without overrides, the workflow uses GitHub Pages metadata for origin and base path. Locally, copy `.env.example` to `.env` and set `PUBLIC_SITE_URL`, `BASE_PATH` and `PUBLIC_WEB3FORMS_ACCESS_KEY` as needed. Build-time settings require rebuilding the site.

The site emits complete localized HTML, canonical and reciprocal language links, social metadata, LocalBusiness data with known facts, `sitemap.xml`, `robots.txt` and an optional `llms.txt`. The latter does not guarantee recommendations or rankings.

## Review and launch

The initial deployment is a review preview. Human visual/content acceptance, real inbox receipt, final privacy/terms review, real-photo replacement and custom-domain DNS/HTTPS checks are separate launch work. No ratings, service statistics, warranty terms or direct-insurer-billing arrangement are invented.

Local business documents, design research, verification captures and environment files are excluded from this repository.
