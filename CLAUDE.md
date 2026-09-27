# Dhonaadhi — website monorepo

Marketing and product-catalogue site for **Dhonaadhi Hitec Innovations** (security + AIoT). Company and brand names live in Sanity `siteSettings` (`companyName`, `brandName`). **Never hard-code them in components.**

Read first: `docs/research.md` (domain/IA), `docs/design-system.md` (tokens, contrast), `docs/stage-plan.md` (routes, schemas, milestones).

## Stack

- `apps/web`: SvelteKit 2 + Svelte 5 **runes only**, TypeScript strict, Tailwind v4 (CSS-first `@theme` in `src/app.css`), tailwind-variants, GSAP (ScrollTrigger/SplitText/Flip) + Lenis, `@lucide/svelte`, adapter-vercel
- `studio`: Sanity Studio v6 (structure + presentation + vision)
- `seed`: generates `seed/data/dataset.ndjson` + images and imports them into Sanity
- `packages/sanity-types`: Sanity TypeGen output, imported as `@dhonaadhi/sanity-types`
- `tools/render`: offline three.js renderer for product shots and exploded-view frames

## Commands (run from the repo root)

| Command                                  | What                                                                                 |
| ---------------------------------------- | ------------------------------------------------------------------------------------ |
| `pnpm dev` / `pnpm dev:studio`           | web on :5173, studio on :3333                                                        |
| `pnpm check` / `pnpm lint` / `pnpm test` | svelte-check + tsc / prettier + eslint / vitest                                      |
| `pnpm test:e2e`                          | Playwright e2e + axe + screenshots (375/768/1280/1920)                               |
| `pnpm typegen`                           | extract schema, then regenerate `packages/sanity-types`                              |
| `pnpm seed`                              | build the fixture dataset; imports it into Sanity if `SANITY_API_WRITE_TOKEN` is set |
| `pnpm render`                            | re-render product images and exploded frames                                         |

## Data source

One `.env` at the repo root (see `.env.example`). **If `PUBLIC_SANITY_PROJECT_ID` is empty, the site runs on fixtures**: the same GROQ queries are evaluated by `groq-js` over `seed/data/dataset.ndjson`. Every query must work in both modes. Never branch UI code on the data source; only `src/lib/sanity/fetch.ts` knows about it.

## Design tokens (see docs/design-system.md)

- Theme: mixed — dark home/campaign pages, light catalogue (`src/lib/theme.ts`, docs/design-system.md §8). Primary buttons use the `btn` token.
- Colours: ink-950 `#07090D`, ink-900 `#0C1017`, ink-800 `#141A23`, ink-700 `#1F2733`, steel-400 `#8A95A8`, mist-100 `#E8EDF4`, paper-50 `#F6F8FB`, optic-400 `#2FE6C8`, optic-600 `#12B89E`, thermal-400 `#FFB547`, signal-blue `#4C8DFF`, alert-500 `#FF5A5F`
- On-light AA variants: optic-700 `#0A7A69`, steel-600 `#566173`, steel-500 `#6B7689` (control borders), signal-blue-600 `#2A5FC4`, thermal-700 `#8A5200`, alert-600 `#C4282E`
- Type: Clash Display (display, 500/600, −0.02em) · Geist (UI) · JetBrains Mono (model numbers, spec values, detection labels)
- Radius: chip 4 · control 10 · panel 20 · scene 32. Grid: 12 columns, 1440px max, 24/16px gutters.
- Motion: `--ease-lens` (0.22,1,0.36,1), `--ease-shutter` (0.83,0,0.17,1); 180 / 320 / 700 / 1200ms

## Conventions

- Components under 250 lines; split scenes into `*.svelte` (markup) + `*.motion.ts` (GSAP). No `any`.
- Animate only transform, opacity, clip-path and filter. Every GSAP context is created inside `$effect`/an action and reverted on cleanup.
- Reduced motion comes from `motion.reduced` (`src/lib/stores/motion.svelte.ts`), which combines the OS setting and the footer toggle. Never read `matchMedia` directly in components.
- Every internal link goes through `resolveLink()` (`src/lib/links.ts`). Stage 2/3 targets resolve to `/coming-soon/[section]`.
- Images: `<SanityImage>` only (srcset, LQIP, alt required). Every image field in Sanity requires alt text.
- Interactive elements: focus ring optic-400 2px/2px offset, 44×44 minimum target, keyboard operable.
- Conventional commits. Commit after each milestone in `docs/stage-plan.md`.

## Stage plan

- **Stage 1 (current):** foundation, shell, landing, products hub/category/listing/detail, compare, seed.
- Stage 2: solutions (industry / function / scenario), technologies, case studies, partners map. **Do not build yet.**
- Stage 3: support/downloads, newsroom, events, about, contact forms, search, i18n, user centre. **Do not build yet.**

## Definition of done (Stage 1)

- All Stage 1 routes work with seeded Sanity data and live preview
- No console errors, `pnpm check` clean, all tests pass, axe reports 0 serious/critical violations
- Lighthouse mobile: Performance ≥ 90 and A11y/BP/SEO 100 on `/` and a PDP; LCP < 2.5s, CLS < 0.05
- Reduced-motion mode verified; screenshots at 375 and 1440 reviewed
- README covers setup, env, dev, seed, deploy, and the Stage 2/3 roadmap
