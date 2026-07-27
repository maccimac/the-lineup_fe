# The Lineup — React Components — Design

**Date:** 2026-07-25
**Status:** Implemented
**Phase:** 2 of 8 (see `MASTER TODO.md`)

## Purpose

Build the reusable component kit that the Homepage ([node 44:2](https://www.figma.com/design/b0nXewYmbsbTlSr74Sg9pU/The-Lineup?node-id=44-2)) and Article Template ([node 40:2](https://www.figma.com/design/b0nXewYmbsbTlSr74Sg9pU/The-Lineup?node-id=40-2)) comps are assembled from.

`MASTER TODO.md` previously tracked a single item called "Pages". That is too coarse to execute in one pass — it spans four Figma comps, a component library that does not exist, and routing that is not installed. It is now split into eight ordered phases; this document specs phase 2.

This phase produces pieces, not pages. Arrangement — grids, column widths, vertical rhythm — belongs to phase 3.

## Phase map

| # | Phase | Deliverable | Status |
|---|---|---|---|
| 1 | Design system | `src/styles/` tokens, reset, base, five type classes, StyleGuide | Done |
| 2 | React components | Chrome, primitives, content blocks — props-driven | **This spec** |
| 3 | Page templates | `HomeTemplate`, `ArticleTemplate` — layout only, no copy | Next |
| 4 | Pages | `HomePage`, `ArticlePage` — template plus content | After 3 |
| 5 | Routes | `react-router-dom`, `/` and `/features/:slug` | After 4 |
| 6 | Remaining comps | The Editor (`41:2`), Masthead (`42:2`) | Later |
| 7 | Backend integration | Content module swaps to `src/lib/api.ts` fetches | Later |
| 8 | Responsive | Breakpoints, once desktop is verified | Later |

## Scope

In scope:

- Five chrome components shared by every page
- Five primitives reused across blocks
- Seven content blocks specific to the Homepage and Article comps
- A typed content module holding the Figma copy
- A StyleGuide section rendering the whole kit

Out of scope:

- Page assembly and grids (phase 3)
- Routing; nav links are inert `<a href>` placeholders (phase 5)
- The Editor and Masthead comps (phase 6)
- Data fetching (phase 7)
- Responsive behaviour — the comps are desktop-only, as the design-system spec already assumes (phase 8)

## Architecture

Seventeen presentational components, grouped into three directories. `src/components/` currently holds two flat files; seventeen more with paired CSS would make thirty-eight, so the kit is grouped. `BackendStatus.tsx` and `StyleGuide.tsx` stay at the top level.

```
src/components/
  chrome/      Wordmark SiteHeader MetaBar SiteFooter PageShell
  primitives/  Kicker ArrowLink Portrait PullQuote Band
  blocks/      HeroFeature SidebarStory StoryCard StoryGrid
               ArticleHeader ArticleSection RelatedLink
```

Two conventions carry over from the design-system phase unchanged:

1. Shared design language lives in `src/styles/`; component-specific layout lives in a `.css` file beside its component, written against tokens — the pattern `BackendStatus.css` established.
2. No hex literal exists anywhere in `src/` outside `tokens.css`.

The five type classes set family, size, weight, leading, and tracking but never color. Components apply a type class and pick their own color token. This is what lets `Kicker` render forest on the Homepage and coral on the Article page without a second class.

### Rejected alternatives

**Blocks written inline in templates.** Fewer files, but the kicker / headline / dek / arrow-link pattern appears four times across the two comps, and the Homepage and Article page would each carry their own copy of it.

**One polymorphic `<Story variant="hero|sidebar|card|related">`.** Fewest components, but the four forms differ in element structure, not just styling — the variant prop becomes a switch statement pretending to be a component.

## Components

### Chrome

| Component | Nodes | Props |
|---|---|---|
| `Wordmark` | `44:4`, `44:50` | `size: 'nav' \| 'footer'` |
| `SiteHeader` | `44:3`, `40:4` | none |
| `MetaBar` | `44:9`, `40:10` | `center: string` |
| `SiteFooter` | `44:49`, `40:29` | none |
| `PageShell` | — | `metaBarCenter: string`, `children` |

`Wordmark` is coral "THE LINEUP" at two sizes — 30px in the nav, 17px in the footer. `SiteHeader` places it at the left gutter with four meta links right: FEATURES, MASTHEAD, FIELD NOTES, THE EDITOR.

`MetaBar` takes only its center string. The left ("VOL. 1 — ISSUE 1") and right ("VANCOUVER, BC · JUNE 2026") slots are site constants; the center is what changes per page — the tagline on the Homepage, the article title on the Article page.

`PageShell` composes `SiteHeader` → `MetaBar` → `<main>` → `SiteFooter`. It is the only structural component in this phase.

### Primitives

| Component | Nodes | Props |
|---|---|---|
| `Kicker` | `44:14`, `40:14`, `44:36` | `children`, `tone?: 'forest' \| 'coral' \| 'ink'` |
| `ArrowLink` | `44:17`, `44:23`, `44:28` | `href`, `children`, `emphasis?: 'meta' \| 'card'` |
| `Portrait` | `44:29`–`44:31` | `src`, `alt` |
| `PullQuote` | `44:33`, `40:25` | `children`, `variant: 'band' \| 'sidebar'` |
| `Band` | `44:32` | `children`, `tone: 'forest'` |

`ArrowLink` is a coral link with a trailing arrow. `meta` is the 11px default used throughout the Homepage; `card` is the 18px form the Article page's Related link uses.

`PullQuote` has two settings that differ by more than color: `band` is centered and inverse-toned for the dark section; `sidebar` is left-aligned forest on the page background.

`Portrait` is the 134px circular mask only. The rectangular variant the Editor page needs is deferred to phase 6.

`Band` is a full-bleed section that breaks the gutter while constraining its inner content. The Masthead's Pitch frame (`43:57`) reuses it in phase 6.

Hairline rules (`44:18`, `40:17`, `44:24`, `40:24`) are deliberately **not** components. They are a `.rule` / `.rule--thick` utility pair added to `src/styles/`, because they appear as borders on existing elements as often as they appear as standalone dividers.

### Blocks

| Component | Nodes | Props |
|---|---|---|
| `HeroFeature` | `44:14`–`44:17` | `story: FeatureStory` |
| `SidebarStory` | `44:19`–`44:23`, `44:25`–`44:28` | `story: SidebarStory` |
| `StoryCard` | `44:35`–`44:38` | `story: Story` |
| `StoryGrid` | `44:34` | `stories: Story[]` |
| `ArticleHeader` | `40:14`–`40:17` | `article: Article` |
| `ArticleSection` | `40:18`–`40:23` | `section: ArticleSection` |
| `RelatedLink` | `40:26`–`40:28` | `related: LinkRef` |

`SidebarStory` covers both the Editor's Letter and Featured Work. The two are the same shape — kicker, serif headline, dek, arrow link — and differ only in whether a portrait sits beside the headline. One component with an optional image beats two near-duplicates.

`StoryGrid` owns the vertical hairlines between cards rather than `StoryCard` owning a left border, because the dividers belong to the row: the first card has no rule to its left.

## Content module

```
src/content/
  types.ts     Story, FeatureStory, SidebarStory, Article, ArticleSection, LinkRef
  site.ts      nav links, footer strings, meta bar constants
  home.ts      hero, editorsLetter, featuredWork, pitchQuote, stories[]
  articles.ts  the Genentech case study, keyed by slug
```

Copy is taken verbatim from the comps. Every export is typed against `types.ts`, so phase 7 replaces the module bodies with fetches and no component changes.

`articles.ts` is keyed by slug from the start, so phase 5 routing has something to resolve `/features/:slug` against.

## Assets

The Homepage portrait (`44:31`) is the only bitmap in either comp. Pull it with `download_assets` into `src/assets/` during implementation.

## Assumptions

1. Kicker tones are forest on the Homepage and coral on the Article page. Confirm against `get_design_context` before building `Kicker`, rather than trusting the screenshots.
2. The Article comp's background reads slightly warmer than the Homepage's. Treat both as `--color-bg` unless design context proves a second surface token is intended.
3. ~~Both comps' Nav and Footer frames are 1519px wide inside a 1440px Homepage frame, which clips the nav links in the rendered screenshot. This is a Figma artifact, not design intent — the chrome is built full-bleed with gutter tokens positioning content.~~ **Corrected during implementation:** the homepage nav is not clipped by the 1519px frame. Its links are set to the surface color (matching the header background), which renders them invisible in the comp — not a framing artifact. See "Deviations from the comps" below for the fix and the full set of invisible-text defects this same pattern caused elsewhere.

## Verification

Routing does not exist until phase 5, but the kit is verified in **Storybook**, not an extended StyleGuide. All seventeen components (five primitives, five chrome, seven blocks) each have a co-located `.stories.tsx` file (17 story files total) rendering it against sample content from `src/content/`; `npm run storybook` / `npm run build-storybook` is the kit's living documentation. The StyleGuide (`StyleGuide.tsx`, `localhost:5173`) keeps its phase-1 scope — it was not given a components section, and its behaviour is unchanged from phase 1.

- `npm run test:run` passes across every test file added in Tasks 1–21 (20 test files, 48 tests).
- `npm run build` (`tsc -b && vite build`) and `npm run lint` both pass with no errors.
- No hex literal exists anywhere in `src/` outside `tokens.css`, with one narrow exception: component `.css` files carry hex values only inside comments that document a snapped-color deviation (see below), never in a declaration.
- `npm run build-storybook` builds cleanly; all 17 stories are included in the output with no build errors.
- `npm run dev` starts cleanly and serves the StyleGuide at `localhost:5173` unchanged from phase 1.
- A pixel-level side-by-side against the Figma screenshots for `44:2` and `40:2` was not performed in this verification pass (no Figma MCP access in this environment); it remains an open follow-up for a human or browser-automation pass. The deviations catalogued below were instead found via `get_design_context` calls made during implementation of Tasks 3–21, not via a final visual diff.

## Deviations from the comps

Implementation surfaced defects in the Figma comps themselves — mostly text set to the same color as its background, rendering it invisible. Each was given a distinct, legible token rather than silently matching the comp's literal (invisible) value. All are documented inline in the relevant component's `.css` file.

**Invisible text, fixed with new color tokens:**

| Element | Nodes | Token |
|---|---|---|
| Nav links (inactive) | `44:5–7`, `40:6–8` | `--color-ink` |
| Nav link (active) | `40:9` | `--color-accent` |
| Meta bar strings | `44:10–12`, `40:11–13` | `--color-ink-muted` |
| Hero dek | `44:16` | `--color-ink-muted` |
| Sidebar deks | `44:22`, `44:27` | `--color-ink-muted` |
| Story card meta | `44:38`, `44:43`, `44:48` | `--color-ink-muted` |
| Article byline | `40:16` | `--color-ink-muted` |

Full node list: `44:5–7`, `40:6–8`, `40:9`, `44:10–12`, `40:11–13`, `44:16`, `44:22`, `44:27`, `44:38`, `44:43`, `44:48`, `40:16`.

**Snapped colors** (comp's literal value → existing token, rather than adding a new near-duplicate token):

| Comp value | Token used | Where |
|---|---|---|
| `#f55f51` | `--color-accent` (`--color-coral`, `#ee6352`) | `Wordmark`, nodes `44:4`, `44:50` |
| `#1f332b` | `--color-deep-forest` (`#10422e`) | `Band--forest` / home pitch band, node `44:32` |
| `#1e1e1e` | `--color-ink` (`--color-black`, `#07020d`) | `SiteFooter`, node `44:49` |

**Added type-scale size tokens.** The Design System page (`33:2`) named five sizes; the page comps (`44:2`, `40:2`) use thirteen. Task 3 added eight to `src/styles/tokens.css`: `--text-headline` (46px, article headline), `--text-quote` (28px, pitch band quote), `--text-section` (20px, article section headings), `--text-related` (14px, related-link headline), `--text-dek` (13px, sidebar deks + article byline), `--text-link` (12px, arrow links + footer meta), `--text-kicker` (10px, story card + related kickers), `--text-micro` (9px, sidebar kickers). The original five (`--text-feature`, `--text-serif`, `--text-card`, `--text-body`, `--text-meta`) are unchanged.

**Hex literals outside `src/`.** `.storybook/preview.ts` carries two literal color values in its Storybook `backgrounds` addon configuration, which takes literal colors rather than CSS custom properties. This is outside `src/` and is a documented, deliberate exception to the no-hex-literal rule.

**"Surboards" typo.** Figma node `44:42` spells "Surboards" (missing the second "f"). Per the plan's instruction not to silently correct source copy, this is reproduced verbatim in `src/content/home.ts`.
