# Dhonaadhi design system — "Night Vision / Signal"

The brand's story is **seeing clearly when others can't**. Every design decision traces back to optics: aperture, focus, exposure, detection.

## 1. Where the boldness goes

The brief fixes the palette (deep ink + optic teal), the type trio and mono data labels, and the brief wins on those. The free axes are spent deliberately:

- **The one memorable thing is the aperture.** An iris (a six-blade SVG polygon mask) is the logo monogram, the loader, the hero reveal, the lens-card hover and the page-transition shutter. One shape, reused, becomes the brand. Nothing else competes with it.
- **Colour means state, not decoration.** Optic teal marks _detection and action_: CTAs, focus, active filters and bounding boxes. Thermal amber marks _measured value_: stats, AI badges and "new". No gradient washes; light only appears as a lens glow behind something that is being revealed.
- **Mono is for data, not for chrome.** JetBrains Mono carries model numbers, spec values and detection labels, because those are machine-readable identifiers in the real product world. Section eyebrows are used only where they carry information (for example `CATEGORY · 12 PRODUCTS`), never as a label above every heading.
- **Radius follows hierarchy.** 4 for chips and inputs, 10 for buttons and cards, 20 for panels and drawers, 32 for scene frames. Not one radius on everything.

## 2. Colour tokens

Dark theme is the default. The light theme is used for print, the spec table and an optional user toggle.

### Core (from the brief)

| Token         | Hex       | Role                                                |
| ------------- | --------- | --------------------------------------------------- |
| `ink-950`     | `#07090D` | page background (dark)                              |
| `ink-900`     | `#0C1017` | sections, cards                                     |
| `ink-800`     | `#141A23` | elevated surfaces                                   |
| `ink-700`     | `#1F2733` | hairlines, dividers (decorative only)               |
| `steel-400`   | `#8A95A8` | secondary text (dark)                               |
| `mist-100`    | `#E8EDF4` | primary text (dark) / surface tint (light)          |
| `paper-50`    | `#F6F8FB` | light-theme background                              |
| `optic-400`   | `#2FE6C8` | primary: CTA fill, focus ring, active, detection UI |
| `optic-600`   | `#12B89E` | primary hover on dark                               |
| `thermal-400` | `#FFB547` | stats, AI/thermal badges                            |
| `signal-blue` | `#4C8DFF` | links, info, charts                                 |
| `alert-500`   | `#FF5A5F` | errors only                                         |

### Added for AA compliance in the light theme

The brief lists `optic-600` as the on-light primary. It measures **2.36:1** on paper-50, which fails AA for both text and UI components. Every accent fails on light backgrounds, so each gets an on-light partner:

| Token                   | Hex       | On paper-50          | Replaces on light                       |
| ----------------------- | --------- | -------------------- | --------------------------------------- |
| `optic-700`             | `#086A5B` | 6.12                 | optic-400/600 as text, link, focus ring |
| `steel-600`             | `#566173` | 5.89                 | steel-400 as secondary text             |
| `signal-blue-600`       | `#2A5FC4` | 5.59                 | signal-blue                             |
| `thermal-700`           | `#8A5200` | 6.00                 | thermal-400 as text                     |
| `alert-600`             | `#C4282E` | 5.35                 | alert-500                               |
| `steel-500` (UI border) | `#6B7689` | ≥ 3:1 on both themes | input borders (see §2.2)                |

On light surfaces the optic-400 **fill** stays as the CTA background, with ink-950 text on it (12.59:1), so the brand colour survives in the light theme.

### 2.1 Contrast results (WCAG 2.2, computed 2026-09-27)

Text needs 4.5:1 (AA normal) or 3:1 (≥ 24px, or ≥ 18.66px bold).

| Foreground → / Background ↓    | ink-950      | ink-900      | ink-800      | paper-50                  |
| ------------------------------ | ------------ | ------------ | ------------ | ------------------------- |
| mist-100                       | **16.94** ✅ | **16.20** ✅ | **14.85** ✅ | 1.11 ❌ (not used)        |
| steel-400                      | **6.59** ✅  | **6.30** ✅  | **5.78** ✅  | 2.84 ❌ → steel-600       |
| optic-400                      | **12.59** ✅ | **12.04** ✅ | **11.05** ✅ | 1.49 ❌ → optic-700       |
| optic-600                      | **7.95** ✅  | **7.60** ✅  | **6.97** ✅  | 2.36 ❌ → optic-700       |
| thermal-400                    | **11.34** ✅ | **10.85** ✅ | **9.95** ✅  | 1.65 ❌ → thermal-700     |
| signal-blue                    | **6.23** ✅  | **5.95** ✅  | **5.46** ✅  | 3.01 ❌ → signal-blue-600 |
| alert-500                      | **6.53** ✅  | **6.24** ✅  | **5.72** ✅  | 2.87 ❌ → alert-600       |
| ink-950                        | —            | —            | —            | **18.73** ✅              |
| ink-950 on optic-400 (button)  | **12.59** ✅ |              |              |                           |
| ink-950 on thermal-400 (badge) | **11.34** ✅ |              |              |                           |

### 2.2 Non-text contrast (SC 1.4.11)

`ink-700` hairlines measure 1.32:1 against ink-950. That is fine for **decorative** dividers, but not for component boundaries users must perceive. Inputs, checkboxes, the range track and selects therefore use `steel-500` borders (≥ 3:1), and change to optic-400 on focus. The focus ring is optic-400 on dark (12.6:1) and optic-700 on light (6.1:1), with a 2px width and 2px offset.

An automated check (`pnpm test:contrast`) re-computes this table from the `@theme` tokens in CI, so a token change can't silently regress it.

## 3. Typography

| Role      | Family                                        | Weights       | Notes                                        |
| --------- | --------------------------------------------- | ------------- | -------------------------------------------- |
| Display   | Clash Display (Fontshare, self-hosted woff2)  | 500, 600      | tracking −0.02em, line-height 1.05           |
| Body / UI | Geist (OFL, `@fontsource/geist`)              | 400, 500, 600 | line-height 1.6                              |
| Data      | JetBrains Mono (`@fontsource/jetbrains-mono`) | 400, 500      | model numbers, spec values, detection labels |

Only Clash 600 and Geist 400 are preloaded (they are the LCP text). Everything uses `font-display: swap` with size-adjusted fallbacks to keep CLS under 0.02.

### Fluid scale (`clamp()` from 375 → 1440 viewport)

| Token         | Min → Max  | Use                                                                  |
| ------------- | ---------- | -------------------------------------------------------------------- |
| `display-2xl` | 72 → 128px | hero headline                                                        |
| `display-xl`  | 56 → 88px  | scene headlines                                                      |
| `h1`          | 40 → 64px  | page titles                                                          |
| `h2`          | 32 → 48px  | section titles                                                       |
| `h3`          | 24 → 32px  | card titles                                                          |
| `body-lg`     | 18 → 20px  | leads                                                                |
| `body`        | 16px       |                                                                      |
| `caption`     | 13px       |                                                                      |
| `mono-sm`     | 12px       | +0.08em tracking. Uppercase only for detection labels and spec keys. |

Prose is capped at `max-w-[68ch]`.

## 4. Layout

- 12-column grid, `max-width: 1440px`, gutters 24px (16px under 768px), outer margin `clamp(16px, 4vw, 64px)`
- 8pt spacing scale (Tailwind's 4px base, used in 2-step increments)
- Radius tokens: `r-chip 4` · `r-control 10` · `r-panel 20` · `r-scene 32`
- Breakpoints tested: 375, 768, 1024, 1280, 1920

## 5. Signature effects (used sparingly)

| Effect              | Implementation                                                            | Where it is allowed                        |
| ------------------- | ------------------------------------------------------------------------- | ------------------------------------------ |
| Hairline            | 1px `ink-700`                                                             | card edges, table rows                     |
| Grain               | inline SVG `feTurbulence`, 3% opacity, fixed layer, `pointer-events:none` | whole page, once                           |
| Lens glow           | radial gradient `optic-400` at 12% → 0                                    | behind _one_ focal object per section      |
| Scanline            | 2px repeating-linear-gradient at 4%                                       | category rail reveal and hero overlay only |
| Viewfinder brackets | 4 corner L-shapes (CSS borders)                                           | product card, hero detection boxes         |

## 6. Motion tokens

| Token            | Value                                                      |
| ---------------- | ---------------------------------------------------------- |
| `--ease-lens`    | `cubic-bezier(0.22, 1, 0.36, 1)`: things coming into focus |
| `--ease-shutter` | `cubic-bezier(0.83, 0, 0.17, 1)`: mechanical open/close    |
| `--dur-fast`     | 180ms: hovers, toggles                                     |
| `--dur-base`     | 320ms: menus, drawers                                      |
| `--dur-slow`     | 700ms: reveals                                             |
| `--dur-scene`    | 1200ms: hero aperture, scene transitions                   |

**Rules:** animate only `transform`, `opacity`, `clip-path` and `filter`. Reduced motion (the OS setting _or_ the footer toggle) disables Lenis, pinning, parallax, tilt and magnetic effects, and turns scenes into 200ms opacity fades. Pinned scenes remain readable as static content: every scene has a text equivalent in the DOM.

## 7. Logo

- **Monogram:** a "D" built from a six-blade aperture. The counter of the D is the iris opening, and the blades rotate closed in the loader. Designed on a 32-unit grid so it stays crisp at 16px (favicon).
- **Wordmark:** "Dhonaadhi" set in Clash Display 600, with custom kerning of the double "aa" (tightened −30 units). It is converted to outlined SVG paths so the logo never depends on font loading.
- **Versions:** `logo-dark.svg` (mist-100 wordmark + optic-400 iris) and `logo-light.svg` (ink-950 wordmark + optic-700 iris), plus monogram-only versions and `favicon.svg` with `prefers-color-scheme` inside the SVG.

## 8. Mixed theme (decided 2026-09-27)

The home page and campaign/coming-soon pages stay **dark**, with the cinematic "Night Vision" scenes. The **catalogue is light**: `/products`, category and subcategory listings, product detail and compare. It's white paper for long reading and spec comparison.

- The theme is chosen per route by `themeFor()` (`src/lib/theme.ts`). The server renders `data-theme` on `<html>` (no flash), and the layout keeps it in sync on client navigation.
- **Primary buttons use the `btn` token:** teal with ink text on dark, **ink with white text on light** (19.9:1). Teal stays the accent for focus, active chips, checkboxes and sliders (`optic-700` with white text, 6.52:1).
- **Deliberate dark islands on light pages:** the footer, the Lens (category) cards, and product image wells. The renders are studio shots on a dark backdrop, framed like a viewfinder.
- Cards on light pages get a soft two-layer shadow (`shadow-card`); on dark pages the token is `none`.
