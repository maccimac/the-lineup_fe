# The Lineup — Design System — Design

**Date:** 2026-07-25
**Status:** Implemented

## Purpose

Translate the Figma **Design System** page ([node 33:2](https://www.figma.com/design/b0nXewYmbsbTlSr74Sg9pU/The-Lineup?node-id=33-2)) into a `src/styles/` directory of plain CSS that every page and component consumes. This is step two of `MASTER TODO.md` (React → **Design system** → Pages).

## Scope

In scope:

- Design tokens as CSS custom properties — colors, font families, sizes, leading, tracking, spacing, layout
- A minimal reset and base element defaults
- Five semantic type classes matching the five named styles in Figma
- Webfont loading for Archivo Black, Jomolhari, and Barlow
- A styleguide page proving the system renders correctly

Out of scope (deferred to the Pages task):

- Component primitives — nav, meta bar, card, pull quote, footer
- Routing and the four page comps on node `39:2`
- Responsive type scaling; the comps are desktop-only

## Source values

Pulled with `get_design_context` on nodes `33:26` (Color Palette) and `33:43` (Typography).

**Palette:** Papaya Whip `#FFECD1` (page background), Papaya Milk `#FFF6E8` (secondary surface), Black `#07020D` (primary text), Dim Grey `#686963` (secondary text), Deep Forest `#10422E` (section labels, dark surfaces), Vibrant Coral `#EE6352` (accent).

**Type:** Feature Headline (Archivo Black / 52px), Card Headline (Archivo Black / 18px), Editorial Serif (Jomolhari 400 / 22px), Body (Barlow 300 / 16px / 1.5), Meta / Nav (Barlow 500 / 11px, 0.1em tracking, uppercase).

Figma labels the display face "Archivo Black 900", but Archivo Black is a single-weight family shipping as `400`. `--weight-display` is `400`; requesting `900` would synthetically bold an already-black face.

## Architecture

```
src/styles/
  index.css        entry point — imports the other four, in order
  reset.css        box-sizing, margin zeroing, media defaults
  tokens.css       every custom property; the only file with literal colors
  base.css         element defaults (body, h1–h6, a, hr, blockquote, focus)
  typography.css   .type-feature .type-card .type-serif .type-body .label-meta
```

Two rules define where CSS lives:

1. **Shared design language** → `src/styles/`.
2. **Component-specific layout** → a `.css` file next to its component (`BackendStatus.css`, `StyleGuide.css`, `App.css`), written against tokens.

The type classes set family, size, weight, leading, and tracking — never color. The same style appears in ink, dim grey, forest, and coral depending on context, so color stays a consumer decision.

Fonts load from Google Fonts via `<link>` in `index.html` (preconnect + one stylesheet), keeping the dependency list empty.

## Styleguide page

`src/components/StyleGuide.tsx` mirrors Figma sections 00–03 (Cover, Logo, Color Palette, Typography) and is rendered by `App.tsx`. Section 04 (Moodboard) is skipped — it is placeholder tiles with no real content.

Swatch hex labels are read at runtime from `:root` via `getComputedStyle`, so the documentation reports what the tokens actually are and cannot drift out of sync with `tokens.css`.

`BackendStatus` and `src/lib/api.ts` from the scaffold task are unchanged; the health pill is parked bottom-right so the backend plumbing stays live and visible.

## Assumptions

1. `--color-rule` is black at 15% opacity. The comps use 1px hairlines but expose no rule color.
2. Layout tokens (`--page-gutter`, `--content-max`, `--nav-height`, `--meta-bar-height`) are measured from the page comps on node `39:2`, not the Design System page. Nothing consumes them yet; they exist so the Pages task has them.
3. `--leading-tight: 1.1` — Figma reports `leading: normal` on headlines. Expect tuning when the homepage is built.

## Verification

- `npm run build` (`tsc -b && vite build`) and `npm run lint` both pass.
- Rendered at `localhost:5173`: all three webfonts load, background is Papaya Whip, all six swatches and all five type specimens match Figma, no console errors.
- No hex literal exists anywhere in `src/` outside `tokens.css`.
