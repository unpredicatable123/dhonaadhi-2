# Dhonaadhi — website (Stage 1)

Marketing site and product catalogue for **Dhonaadhi Hitec Innovations**, a security and AIoT manufacturer. It's a SvelteKit 2 app (Svelte 5 runes, Tailwind v4, GSAP + Lenis) with a Sanity Studio, in a pnpm monorepo.

| Workspace               | What                                                                                        |
| ----------------------- | ------------------------------------------------------------------------------------------- |
| `apps/web`              | The website (SvelteKit, adapter-vercel)                                                     |
| `studio`                | Sanity Studio: schemas, desk structure, Presentation (live preview)                         |
| `seed`                  | Seed dataset: 7 categories, 16 subcategories, 47 products, taxonomy, site content, PDFs     |
| `tools/render`          | Generates product renders, 360° spins, the exploded-view sequence and the night-city scenes |
| `packages/sanity-types` | Sanity TypeGen output shared by web and seed                                                |

Design and planning docs: [`docs/research.md`](docs/research.md), [`docs/design-system.md`](docs/design-system.md), [`docs/stage-plan.md`](docs/stage-plan.md). Conventions for contributors (and AI assistants) are in [`CLAUDE.md`](CLAUDE.md).

---

## Quick start (no Sanity account needed)

```bash
corepack enable            # or: npm i -g pnpm
pnpm install
cp .env.example .env       # leave PUBLIC_SANITY_PROJECT_ID empty
pnpm seed                  # builds seed/data/dataset.ndjson (skips the Sanity import)
pnpm dev                   # http://localhost:5173
```

With no project ID configured, the site runs in **fixtures mode**. It evaluates the same GROQ queries locally over `seed/data/dataset.ndjson` using `groq-js`, Sanity's reference GROQ engine, and serves images and PDFs from `seed/data`. Unit tests and e2e tests use this mode, so they need no network or CMS.

## Connecting Sanity

1. **Create a project.** Run `npx sanity login`, then `npx sanity projects create "Dhonaadhi"`, or use [sanity.io/manage](https://www.sanity.io/manage). Create a `production` dataset.
2. **Create tokens** under _API → Tokens_:
   - `SANITY_API_READ_TOKEN`: **Viewer** role (drafts for live preview).
   - `SANITY_API_WRITE_TOKEN`: **Editor** role (used only by `pnpm seed`, never by the site).
3. **Add CORS origins** under _API → CORS_: `http://localhost:5173`, `http://localhost:3333` and your production URL, with credentials allowed.
4. **Fill in `.env`** at the repo root:

   | Variable                    | Notes                                                                 |
   | --------------------------- | --------------------------------------------------------------------- |
   | `PUBLIC_SANITY_PROJECT_ID`  | Switches the site from fixtures to Sanity                             |
   | `PUBLIC_SANITY_DATASET`     | `production`                                                          |
   | `PUBLIC_SANITY_API_VERSION` | e.g. `2026-09-01`                                                     |
   | `PUBLIC_SANITY_STUDIO_URL`  | Studio URL (used for click-to-edit overlays)                          |
   | `PUBLIC_SITE_URL`           | Canonical site URL (sitemap, OG, revalidation)                        |
   | `SANITY_API_READ_TOKEN`     | Viewer token (server only)                                            |
   | `SANITY_API_WRITE_TOKEN`    | Editor token (seed only)                                              |
   | `SANITY_REVALIDATE_SECRET`  | ≥ 32 characters. Signs the webhook and is the Vercel ISR bypass token |

   The environment is validated with zod at startup; a missing or malformed variable fails with a clear message.

5. **Import the content:** run `pnpm seed`. It uploads every image and PDF (asset IDs match the fixtures) and creates all documents. It is safe to re-run.
6. **Run the Studio:** `pnpm dev:studio` → http://localhost:3333. **Presentation** opens the site with live draft preview and click-to-edit.

## Commands (from the repo root)

| Command                                         | What it does                                                                                                        |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `pnpm dev` / `pnpm dev:studio`                  | Web on :5173, Studio on :3333                                                                                       |
| `pnpm check`                                    | svelte-check (web) and tsc (studio, seed)                                                                           |
| `pnpm lint`                                     | Prettier and ESLint                                                                                                 |
| `pnpm test`                                     | Vitest: tokens and contrast, selector URL state, GROQ queries against the dataset, optics maths                     |
| `pnpm test:e2e`                                 | Playwright against a production build: smoke, axe (WCAG 2.2 AA), journeys, reduced motion                           |
| `pnpm --filter web exec playwright test visual` | Review screenshots at 375/768/1280/1920, saved to `/screenshots`                                                    |
| `pnpm typegen`                                  | Extracts the schema, then regenerates `packages/sanity-types` from schema and queries                               |
| `pnpm seed`                                     | Rebuilds the dataset, and imports it when `SANITY_API_WRITE_TOKEN` is set                                           |
| `pnpm render`                                   | Re-renders all generated imagery (about 30 min in software WebGL). Accepts `products`, `spin`, `exploded` or `city` |

## Deploying (Vercel)

1. Import the repo into Vercel and set the **root directory to `apps/web`**. The framework preset is SvelteKit, and the install command is `pnpm install` run at the monorepo root.
2. Add the environment variables above (you don't need `SANITY_API_WRITE_TOKEN` on Vercel).
3. Product pages use **ISR** (1 h expiry). For instant updates, add a Sanity webhook: _API → Webhooks → Create_.
   - URL: `https://<your-domain>/api/revalidate`
   - Trigger on create, update and delete; filter `_type in ["product","productCategory","productSubcategory","siteSettings","navigation","footer","homePage"]`
   - Projection `{_id}`, with the secret set to `SANITY_REVALIDATE_SECRET`
     The endpoint checks the signature, works out which paths the document affects, and re-renders them.
4. Deploy the Studio with `pnpm --filter studio deploy` (or host it anywhere). In the Studio, update the Presentation `previewUrl` origin through `PUBLIC_SITE_URL`.

## Architecture notes

- **Everything is content-managed.** Company and brand names, navigation, footer, home-page sections and their order, coming-soon pages, catalogue and taxonomy all come from Sanity. Components never hard-code the company name.
- **One link resolver** (`src/lib/links.ts`) builds every internal URL. Stage 2/3 destinations (solutions, technologies, support…) resolve to `/coming-soon/{section}`; when a Stage 2 page ships, one line changes.
- **The product selector is URL state.** GROQ runs on the server with static queries driven by params, so every filter state is a shareable, crawlable, back-button-safe URL.
- **Motion:** GSAP loads lazily and stays off the critical path. Lenis is synced to the GSAP ticker. Every ScrollTrigger is created in an effect and reverted on navigation. Reduced motion (OS setting or the footer toggle) removes smooth scroll, pinning, parallax and tilt.
- **Theme:** dark cinematic home, light catalogue (see `docs/design-system.md` §8).
- **Imagery:** product shots, spins, the exploded view and the night-city scenes are rendered from original procedural 3D models (`tools/render`), so there's no third-party industrial design. Industry photos are CC0 or public domain via Openverse, with credits stored in the asset metadata (`seed/data/photos.json`).

## Roadmap

**Stage 2: Solutions & storytelling**

- Solution pages by industry, function and scenario (the `solution` and `industry` schemas already exist and are referenced by products and the home mosaic)
- Technology explainer pages (LumaNight, SentinelAI, ClearEdge, PanoSight, SunLink, VaultNVR)
- Case studies, and a partners / where-to-buy map

**Stage 3: Support, content & scale**

- Support and downloads centre (firmware, manuals, tools, accessory selector)
- Newsroom and blog, events, About
- Contact and sales forms (superforms + zod)
- Global search (Algolia or Sanity text search)
- i18n with regional routing, and a user centre
