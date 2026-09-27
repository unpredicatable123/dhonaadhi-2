# Stage plan

## Repo layout (pnpm workspaces)

```
/
├─ apps/web/                 SvelteKit 2 + Svelte 5 site
│  ├─ src/lib/components/ui/       design-system primitives (Button, Tag, SpecChip, …)
│  ├─ src/lib/components/cards/    Viewfinder, Lens, Technology, Stat cards
│  ├─ src/lib/components/shell/    Header, MegaMenu, MobileDrawer, Footer, CommandPalette
│  ├─ src/lib/components/scenes/   one folder per home section (lazy-loaded)
│  ├─ src/lib/components/products/ FilterPanel, ResultsGrid, CompareTray, SpecTable, …
│  ├─ src/lib/motion/              gsap.ts, lenis.ts, tokens.ts, actions/*.ts, transitions.ts
│  ├─ src/lib/sanity/              client.ts, image.ts, queries.ts, filters.ts, loaders
│  ├─ src/lib/stores/              compare.svelte.ts, motion.svelte.ts (runes-based)
│  └─ src/routes/                  (see route map)
├─ studio/                   Sanity Studio (structure, presentation, schemas)
├─ packages/sanity-types/    TypeGen output (sanity.types.ts), shared by web + seed
├─ seed/                     pnpm seed: taxonomy + ≥ 40 products + generated imagery
├─ tools/render/             offline three.js renderer for product shots + exploded-view frames
└─ docs/                     research.md, design-system.md, stage-plan.md
```

## Route map

| Route                                                              | Stage | Notes                                                                        |
| ------------------------------------------------------------------ | ----- | ---------------------------------------------------------------------------- |
| `/`                                                                | 1     | page builder from `homePage.sections[]`                                      |
| `/products`                                                        | 1     | hub                                                                          |
| `/products/[category]`                                             | 1     | category overview + subcategory lens cards + all-products listing            |
| `/products/[category]/[subcategory]`                               | 1     | listing with product selector filters (URL-driven)                           |
| `/products/[category]/[subcategory]/[slug]`                        | 1     | PDP, ISR                                                                     |
| `/products/compare?ids=`                                           | 1     | up to 4                                                                      |
| `/products/[…]/[slug]/og.png`                                      | 1     | per-product OG image (satori + resvg)                                        |
| `/coming-soon/[section]`                                           | 1     | CMS-driven page, used for every Stage 2/3 link                               |
| `/styleguide`                                                      | 1     | dev-only (404 in production)                                                 |
| `/api/revalidate`, `/api/draft`                                    | 1     | webhook + draft mode enable/disable                                          |
| `/sitemap.xml`, `/robots.txt`                                      | 1     |                                                                              |
| `/solutions/**`, `/technologies/**`, `/partners`                   | 2     | resolved through `linkResolver()`; returns coming-soon until the page exists |
| `/support/**`, `/newsroom/**`, `/about`, `/contact`, `/[region]/…` | 3     | same                                                                         |

**Plug-in rule:** every internal link goes through one `resolveLink(doc)` function. When Stage 2 adds `/solutions/[slug]`, one line flips from `coming-soon` to the real path. No component changes.

## Schemas (Stage 1 builds all of these)

- **Site:** `siteSettings`, `navigation`, `footer`
- **Pages:** `homePage` (sections: heroAperture, duskToNight, categoryRail, explodedView, statsBand, industriesMosaic, featuredProducts, ctaSearch, logoCloud, richTextSection), `comingSoonPage`
- **Catalogue:** `productCategory`, `productSubcategory` (+ `filterConfig[]`), `productSeries` (tier enum, optional subcategory), `product`
- **Product additions from research:** `variants[]` (suffix, lens, status), `lensType`, `activeDeterrence[]`, `ikRating` enum incl. IK08, `dori{}`, `compatibleWith[]`, `bundleItems[]`
- **Taxonomy:** `technology`, `aiFunction`, `formFactor`
- **Stage 2 minimal:** `solution` (+ `axis: industry | function | scenario`), `industry`
- **Shared objects:** `seo`, `link` (internal ref | external URL), `specGroup`, `download`, `imageWithAlt` (alt required)

## Milestones (one conventional commit each, or more)

Each milestone gate: `pnpm check && pnpm lint && pnpm test`, plus Playwright screenshots at 375 / 1440 (and 768 / 1920 for page milestones), reviewed before moving on.

1. **chore:** monorepo, tooling (ESLint flat, Prettier, Husky, lint-staged, Vitest, Playwright, axe), env validation (zod), `.env.example`, `CLAUDE.md`
2. **feat(design):** tokens in `@theme`, fonts, base styles, logo + monogram SVGs, UI primitives, `/styleguide`, contrast test
3. **feat(motion):** gsap/lenis singletons, actions (reveal, parallax, magnetic, splitText, tilt, counter), reduced-motion store + footer toggle, shutter + shared-element view transitions
4. **feat(cms):** studio structure, all schemas, Presentation tool, TypeGen, orderable lists
5. **feat(seed):** generated imagery + ≥ 6 categories, ≥ 40 products, taxonomy, home page content
6. **feat(data):** client, image/LQIP helpers, typed queries, GROQ filter builder (unit-tested), visual-editing loaders, draft mode, revalidate webhook
7. **feat(shell):** header, mega menu, mobile drawer, footer, ⌘K palette, coming-soon, error/404
8. **feat(home):** one commit per scene (hero, dusk-to-night, category rail, exploded view, stats, industries, featured carousel, CTA search, trust band/logo cloud, rich text)
9. **feat(products):** hub → category → listing + filters + compare tray → PDP → compare page
10. **chore(quality):** SEO (meta, canonical, JSON-LD, sitemap, OG), axe audit, Lighthouse pass, e2e suite, README

## Imagery strategy (a decision)

There are no royalty-free photos of _our invented products_, and stock photos of real branded cameras would carry someone else's industrial design. So:

- **Product shots and the exploded-view sequence** are rendered from one procedural three.js camera model (bullet, dome, turret, PTZ, fisheye, box and NVR/switch/terminal variants) in `tools/render/`. It exports WebP at fixed angles plus 120 exploded frames. This gives a consistent, original, on-brand catalogue look, and the same model can power the optional Threlte hero.
- **Scenes** (night city, industries, day/night pair) come from Unsplash under the Unsplash licence. They are downloaded by the seed script from a curated list of photo IDs, uploaded to Sanity with alt text and credit stored in the asset metadata.

## Risks and mitigations

| Risk                                               | Mitigation                                                                                                                                                                          |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lighthouse ≥ 90 mobile with pinned scenes          | Scenes are code-split and mounted by IntersectionObserver. The hero LCP is a static AVIF with the aperture as a CSS clip-path (no JS needed for LCP). GSAP loads after first paint. |
| 120-frame sequence weight                          | ~25 KB per frame at 960px WebP; progressive preload (every 8th frame first, then fill in); 60 frames on mobile                                                                      |
| Lenis + View Transitions + ScrollTrigger conflicts | Lenis is stopped during transitions; `ScrollTrigger.killAll()` and a Lenis reset run in `onNavigate`                                                                                |
| Visual editing API churn                           | Pin to the current official SvelteKit loader after checking docs at milestone 6                                                                                                     |
| Components < 250 lines                             | Scenes split into a controller (motion) and a view (markup)                                                                                                                         |
