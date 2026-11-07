# Vitreva

One-page French, English and Spanish website for mobile windshield replacement in Gatineau. Built with SvelteKit 3, Svelte 5 and plain CSS, and prerendered for GitHub Pages.

## Develop

Use Bun for installs, scripts and tests. Vite and SvelteKit still run on Node 24 LTS.

```sh
bun install --frozen-lockfile
bun run dev
```

Open `/` for French, `/en/` for English or `/es/` for Spanish. All three pages render complete HTML and retain their language links without JavaScript.

```sh
bun run check
bun run test
bun run build
bun run preview
```

The static site is written to `build/`. There is no server to run in production.

## Edit content

- `src/lib/content/<name>.<locale>.json`: one file per place on the site and per language, such as `home.fr.json` or `quote.en.json`. `contentGroups` in `cms.ts` lists them all and lays out the editor: Pages, Partout sur le site, Textes légaux.
- `src/lib/content/contract.ts`: what can be edited, with its labels and checks. It gives the code its types, the tests their checks and the CMS its fields. After changing it, run `bun run cms:config`, and `bun run content:format` if the order changed.
- `src/lib/content/index.ts`: typed locale selection.
- `src/lib/content/business.<locale>.json`: phone, email, hours and service area, written once and shared by every language except the wording of the hours. Other content refers to them with placeholders such as `{hours}` or `{email}`, and an unknown placeholder stops the build.
- `src/lib/config/site.ts`: reads those facts and holds shared settings.
- `src/lib/components/`: named page sections, language switching, photography and legal dialog.
- `src/app.css`: shared typography, spacing, actions and glass material. Section styles live with their Svelte files.

The glass uses browser backdrop filtering, edge highlights and a restrained reflection. The service-area headline is softened under the reflective surface; form fields stay sharp. Pointer highlights run only with a fine pointer and motion enabled. Reduced motion and a solid-material fallback are included.

## Images

Current photographs are generated illustrations, used temporarily until real business photographs are available. They do not document completed customer jobs. The vehicle reference is a black 2010 Ford Transit Connect.

Source images are in `assets/source/`. After replacing them, run `bun run images` to regenerate the responsive WebP files and social image in `static/images/`. Preserve the intended subjects and crops when replacing them. Manrope is self-hosted through Fontsource. Carousel arrows are exported from the approved Figma design.

`static/favicon.svg` is the windshield mark; the image script also generates its PNG and Apple touch variants. The custom Transit Connect illustration is `static/images/transit-connect-404.svg`.

The shared error page uses localized copy from the content files. The `/404` route overrides trailing slashes to prerender the exact `404.html` file GitHub Pages serves for unknown URLs; the SvelteKit error handler uses the same design.

## Form inbox

The quote form uses Web3Forms directly from the browser, following the same pattern as yesid.dev. Create a Vitreva form, verify `contact@vitreva.ca` and select it as the recipient. Set the form's access key as `PUBLIC_WEB3FORMS_ACCESS_KEY` locally or `WEB3FORMS_ACCESS_KEY` in GitHub repository variables. This is a public client-side form key. Use Vitreva's own key rather than the one associated with yesid.dev.

The form validates required fields, leaves the VIN optional and sends quote details as JSON to `https://api.web3forms.com/submit`. A contact email becomes the reply-to address; phone-only contact stays a separate phone field. Vehicle, VIN, location, language, consent and message are forwarded with the request. Success requires both an accepted HTTP response and Web3Forms' explicit success acknowledgement. Failed requests retain entered details. A blank key disables submission and offers telephone/email contact. No request data is stored in browser storage.

Before launch, verify an actual message reaches the inbox, configure provider spam/domain protections, and review privacy text against the provider and business practices. The preview does not claim operational email delivery while that setup is pending.

## Cloudflare Workers test site

`vitreva.ca` is still served by GitHub Pages. The `Deploy Workers test site` workflow publishes every push to `main` to the Worker's `workers.dev` address, so hosting can be proven before the cutover. The address is marked `noindex` and the quote form is off there. If a check, the build or the deploy fails, the previous version stays online and the workflow opens or updates an issue assigned to the repository owner.

| Repository secret | Value |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | Account API token scoped to the `vitreva` Worker only, with the Editor role. |
| `CLOUDFLARE_ACCOUNT_ID` | The Cloudflare account that holds the Worker. |

To try the Worker locally, run `bun run build`, then `./node_modules/.bin/wrangler dev`.

## GitHub Pages

The `Deploy GitHub Pages` workflow runs by itself when a CMS save changes `src/lib/content/*.json` or `static/images/uploads/` on `main`. Any other change is published by starting it from the Actions tab. Enable **Settings → Pages → Source: GitHub Actions** first. It checks and builds the site, uploads `build/`, and deploys through the official Pages actions. If a check fails, nothing is deployed and the previous site stays online.

`/admin` on the site leads to the editor at `https://login.yesid.dev/vitreva/`.

| Repository variable | Purpose |
| --- | --- |
| `SITE_URL` | Public origin, for example `https://mgkdante.github.io` or `https://vitreva.ca`. |
| `PAGES_BASE_PATH` | `/vitreva` for the project URL; empty for a custom domain. |
| `WEB3FORMS_ACCESS_KEY` | Public form access key linked to the verified Vitreva recipient; leave empty until connected. |

Without overrides, the workflow uses GitHub Pages metadata for origin and base path. Locally, copy `.env.example` to `.env` and set `PUBLIC_SITE_URL`, `BASE_PATH` and `PUBLIC_WEB3FORMS_ACCESS_KEY` as needed. Build-time settings require rebuilding the site.

The site emits complete localized HTML for the home page and eight translated pages, canonical and reciprocal language links, social metadata with a share card per page and language, structured business data with known facts, `sitemap.xml`, `robots.txt` and an optional `llms.txt`.

`bun run build` first makes the photos chosen in the editor, in the sizes the site serves and without metadata, then the share cards in `static/images/og/`, so they always match the saved titles, banner, phone number and van photo. Neither is committed, the build needs Microsoft Edge or Google Chrome, and it removes `build/images/uploads` so no original is published. Other generated assets are committed: `bun run images` regenerates photos and icons, and `bun scripts/generate-crack.mjs` regenerates the crack drawing.

## Review and launch

The initial deployment is a review preview. Human visual/content acceptance, real inbox receipt, real-photo replacement and custom-domain DNS/HTTPS checks are separate launch work. No ratings, service statistics, warranty terms or direct-insurer-billing arrangement are invented.

Local business documents, design research, verification captures and environment files are excluded from this repository.
