# DataTalks.Club Academy: landing site

Static site for academy.datatalks.club. It is a demand test for a selective, full-time program starting April 2027 (about 15 seats). Two candidate tracks each get one landing page, and the only conversion is leaving an email to join the shortlist. The full design, copy and test plan is in [`docs/SPEC.md`](docs/SPEC.md).

Stack: Astro (static output), plain CSS, one small vanilla TypeScript module (`src/scripts/signup.ts`). No cookies, no storage, no third-party requests; fonts and images are self-hosted.

## Run it

```sh
npm install
npx playwright install chromium     # once, for the tests and screenshots
PUBLIC_API_URL=http://localhost:8787 npm run dev
npm run build && npm run preview
npm test                            # Playwright, desktop 1440 and mobile 390, API mocked
npm run test:base                   # same suite with BASE_PATH=/academy/
npm run check                       # astro check
```

`npm run og` regenerates `public/og/*.png` and `public/favicon-32.png` (Playwright screenshots of an HTML template, fonts read from `node_modules`). Commit the results.

## How the two track pages are kept identical

All track-specific copy lives in `src/data/tracks.ts`; shared copy in `src/data/shared.ts`. Both landings are rendered from one template, `src/pages/[track].astro`, over `getStaticPaths`, with one stylesheet. Test 1 in `tests/landing.spec.ts` compares the ordered section ids, heading levels, form fields and label sequence of the two built pages, so structural drift fails CI.

## Environment variables

| Variable | Used by | Default | Meaning |
|---|---|---|---|
| `SITE_URL` | build | `https://academy.datatalks.club` | Origin used for canonical and Open Graph URLs, sitemap |
| `BASE_PATH` | build | `/` | Path the site is served under (e.g. `/academy/`) |
| `PUBLIC_API_URL` | build | empty | Signup API origin, no trailing slash. Empty means the form shows the error state on submit and no page-view beacon is sent |

Every internal link and asset goes through `url()` in `src/lib.ts`, which applies the base path.

## Deploy and the domain switch

`https://datatalks.club/academy/` is the live site. The datatalks.club deploy (`DataTalksClub/datatalksclub.github.io`, `deploy-s3.yml`) checks out this repo at `main`, builds it with `SITE_URL=https://datatalks.club BASE_PATH=/academy/` and publishes `dist/` under `/academy/` in the datatalks.club bucket.

`.github/workflows/deploy.yml` runs on every push to `main`. It publishes `academy.datatalks.club` (GitHub Pages) as a redirect site: `scripts/redirects.mjs` writes a stub for every page that sends the visitor to the same path under `https://datatalks.club/academy/`, keeping the query string and hash, plus a `404.html` that does the same for any other path. It then triggers the datatalks.club deploy when the `DTC_SITE_DISPATCH_TOKEN` secret (a token allowed to run workflows in `datatalksclub.github.io`) is set; otherwise run that workflow by hand.
