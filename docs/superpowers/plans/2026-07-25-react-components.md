# React Components (Phase 2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the fourteen presentational components, plus a typed content module, that the Homepage (`44:2`) and Article Template (`40:2`) comps are assembled from.

**Architecture:** Components are grouped into `chrome/`, `primitives/`, and `blocks/` under `src/components/`. Every component is presentational — it takes props from `src/content/` and holds no state. Layout CSS is co-located per component and written against tokens; shared design language stays in `src/styles/`. Each component gets a Vitest + Testing Library spec and a Storybook story.

**Tech Stack:** React 19, TypeScript 5.8, Vite 6, Vitest 4.1, @testing-library/react 16.3, Storybook 10.5, plain CSS with custom properties. Node 24 LTS.

## Global Constraints

- **Node 24 LTS is required.** The machine ran v18.12.1 at planning time, which Vitest 4 and Storybook 10 both reject. Task 1 does not proceed until `node -v` reports v24. (Node 22 was the LTS when this plan was drafted; 24.18.0 is now Active LTS and satisfies Vitest 4's `^20 || ^22 || >=24` equally.)
- **No hex literal may appear anywhere in `src/` outside `src/styles/tokens.css`.** Every color is a `var(--token)` reference.
- **The five type classes set no color.** `.type-feature`, `.type-card`, `.type-serif`, `.type-body`, `.label-meta` control family, size, weight, leading, and tracking only. Each component picks its own color token.
- **Desktop-only.** Build to the comps' fixed 120px gutters and fixed type scale. No media queries, no fluid units.
- **Never run `git commit`.** Every task's final step stages files and proposes a message. The user reviews the message and the file list, then commits. This overrides the commit steps any skill would otherwise insert.
- **Component CSS lives beside its component** (`Kicker.tsx` + `Kicker.css`), the pattern `BackendStatus.css` established.
- Every component file exports a single named component as its default export, matching the existing `BackendStatus` / `StyleGuide` convention.

## Design decisions locked before implementation

`get_design_context` on both nodes revealed three conflicts with the phase-1 design system. All three were resolved by the user; the plan below encodes those resolutions and the tasks must not revisit them.

**1. Invisible text is fixed by role.** A dozen text elements in the comps are `#fff6e8` on a `#fff6e8` background. Each is assigned a token by role:

| Element | Nodes | Token |
|---|---|---|
| Nav links (inactive) | `44:5–7`, `40:6–8` | `--color-ink` |
| Nav link (active) | `40:9` | `--color-accent` |
| Meta bar strings | `44:10–12`, `40:11–13` | `--color-ink-muted` |
| Hero dek | `44:16` | `--color-ink-muted` |
| Sidebar deks | `44:22`, `44:27` | `--color-ink-muted` |
| Story card meta | `44:38`, `44:43`, `44:48` | `--color-ink-muted` |
| Article byline | `40:16` | `--color-ink-muted` |

**2. Tokens win over comp color drift.** Where the comps disagree with `tokens.css`, the token is used:

| Comp value | Used for | Built as |
|---|---|---|
| `#f55f51` | Wordmark, both pages | `--color-accent` (`#ee6352`) |
| `#1f332b` | Home pitch band | `--color-deep-forest` (`#10422e`) |
| `#1e1e1e` | Footer, both pages | `--color-ink` (`#07020d`) |
| `rgba(7,2,13,0.85)` | Home headlines | `--color-ink` (solid) |

**3. The type scale is extended, not snapped.** The comps use thirteen sizes; `tokens.css` defines five. Task 3 adds the missing eight plus the leading and tracking values they need.

## File Structure

```
.nvmrc                                  Node version pin
package.json                            engines + test/storybook scripts
vite.config.ts                          gains a Vitest `test` block
src/test/setup.ts                       jest-dom matchers, cleanup
.storybook/main.ts                      Storybook config
.storybook/preview.ts                   imports the design system

src/styles/tokens.css                   MODIFY — extended scale
src/styles/typography.css               MODIFY — light meta + prose variants
src/styles/rules.css                    CREATE — .rule utilities
src/styles/index.css                    MODIFY — import rules.css

src/content/types.ts                    Story, FeatureStory, SidebarStory,
                                        Article, ArticleSection, LinkRef, NavLink
src/content/site.ts                     nav, meta bar, footer constants
src/content/home.ts                     hero, letter, featured, quote, stories
src/content/articles.ts                 the case study, keyed by slug
src/assets/joshua-portrait.png          downloaded from node 44:31

src/components/primitives/              Kicker ArrowLink Portrait PullQuote Band
src/components/chrome/                  Wordmark SiteHeader MetaBar SiteFooter
                                        PageShell
src/components/blocks/                  HeroFeature SidebarStory StoryCard
                                        StoryGrid ArticleHeader ArticleSection
                                        RelatedLink
```

Each component directory entry is three or four files: `Name.tsx`, `Name.css`, `Name.test.tsx`, `Name.stories.tsx`.

---

### Task 1: Test harness

**Files:**
- Create: `.nvmrc`, `src/test/setup.ts`, `src/test/harness.test.tsx`
- Modify: `package.json`, `vite.config.ts`, `tsconfig.app.json`

**Interfaces:**
- Produces: an `npm test` script running Vitest in jsdom with jest-dom matchers registered. Every later task depends on it.

- [ ] **Step 1: Verify Node 24**

Run: `node -v`
Expected: `v24.x.x`. If it reports v18, stop — install Node 24 LTS first. Vitest 4 declares `engines.node: ^20.0.0 || ^22.0.0 || >=24.0.0` and will fail to run.

- [ ] **Step 2: Pin the Node version**

Create `.nvmrc`:

```
24
```

Add to `package.json`, as a sibling of `"scripts"`:

```json
  "engines": {
    "node": ">=24"
  },
```

- [ ] **Step 3: Install test dependencies**

Run:

```bash
npm install -D vitest@^4.1.10 @vitest/coverage-v8@^4.1.10 @testing-library/react@^16.3.2 @testing-library/jest-dom@^7.0.0 @testing-library/user-event@^14.5.2 jsdom@^29.1.1
```

- [ ] **Step 4: Write the test setup file**

Create `src/test/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Testing Library does not auto-clean under Vitest's globals-off default.
afterEach(() => {
  cleanup()
})
```

- [ ] **Step 5: Wire Vitest into the Vite config**

Replace `vite.config.ts` entirely:

```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
```

`css: true` matters — components assert on class names, and without it Vitest stubs CSS imports in a way that has bitten co-located-CSS setups before.

- [ ] **Step 6: Add the test scripts**

In `package.json`, add to `"scripts"`:

```json
    "test": "vitest",
    "test:run": "vitest run",
```

- [ ] **Step 7: Add `vitest/globals` to the TS config**

In `tsconfig.app.json`, inside `compilerOptions`, add:

```json
    "types": ["vitest/globals", "@testing-library/jest-dom"],
```

Also ensure `include` covers the test setup — if it reads `["src"]` it already does.

- [ ] **Step 8: Write the harness smoke test**

Create `src/test/harness.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'

/*
 * Proves the harness itself: JSX compiles, jsdom provides a DOM, Testing
 * Library queries it, and the jest-dom matchers from setup.ts are registered.
 * Every later task's tests depend on all four.
 */
function Probe() {
  return <p className="probe">harness online</p>
}

test('renders a component and exposes jest-dom matchers', () => {
  render(<Probe />)
  const el = screen.getByText('harness online')
  expect(el).toBeInTheDocument()
  expect(el).toHaveClass('probe')
})
```

This test must be self-contained. It must not import a component that does not exist yet — `tsconfig.app.json` includes `src`, so `tsc -b` type-checks test files, and an unresolved import would make `npm run build` fail for the rest of the phase.

- [ ] **Step 9: Run it to confirm the harness works**

Run: `npm run test:run`
Expected: PASS, 1 test. `toHaveClass` passing is the proof that `setup.ts` registered the jest-dom matchers — without it that assertion throws rather than failing.

If the output says no test files were found, the `include` glob in `vite.config.ts` is wrong; fix that before continuing.

- [ ] **Step 10: Confirm the existing build still works**

Run: `npm run build` then `npm run lint`
Expected: both pass. The `test` block in `vite.config.ts` must not break `tsc -b`.

Task 1 ends with build, lint, and tests all green. Later tasks each open RED on their own new test and close GREEN; none of them leaves the tree broken.

- [ ] **Step 11: Stage and propose a commit**

```bash
git add .nvmrc package.json package-lock.json vite.config.ts tsconfig.app.json src/test/setup.ts src/test/harness.test.tsx
```

Propose: `chore: add Vitest + Testing Library harness on Node 24`
Show the user the staged file list and wait for approval. Do not commit.

---

### Task 2: Storybook

**Files:**
- Create: `.storybook/main.ts`, `.storybook/preview.ts`
- Modify: `package.json`, `.gitignore`

**Interfaces:**
- Produces: `npm run storybook`. Every later task adds a `*.stories.tsx` that this config picks up.

- [ ] **Step 1: Initialise Storybook**

Run: `npx storybook@latest init --yes`

It detects Vite + React and installs `storybook`, `@storybook/react-vite`, and the eslint plugin. Accept whatever it scaffolds, then overwrite the two config files in the next steps.

- [ ] **Step 2: Replace the generated main config**

Replace `.storybook/main.ts`:

```ts
import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
}

export default config
```

- [ ] **Step 3: Load the design system into every story**

Replace `.storybook/preview.ts`:

```ts
import type { Preview } from '@storybook/react-vite'
import '../src/styles/index.css'

// The comps are desktop-only and every component assumes the page background.
const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      options: {
        page: { name: 'Page', value: '#ffecd1' },
        surface: { name: 'Surface', value: '#fff6e8' },
      },
    },
  },
  initialGlobals: {
    backgrounds: { value: 'page' },
  },
}

export default preview
```

The two hex values here are the only ones outside `tokens.css`, and they are deliberate: Storybook's backgrounds addon takes literal colors, not custom properties. Note this exception in the spec at Task 22.

- [ ] **Step 4: Delete the scaffolded example stories**

Run: `rm -rf src/stories`

The `storybook init` template drops a `src/stories/` folder of Button/Header/Page demos. They are not our components and would pollute the gallery.

- [ ] **Step 5: Ignore the build output**

Append to `.gitignore`:

```
storybook-static
```

- [ ] **Step 6: Verify Storybook boots**

Run: `npm run storybook`
Expected: it starts and opens on port 6006 with an empty sidebar (no stories exist yet) and no console errors. Stop the server.

- [ ] **Step 7: Verify nothing else broke**

Run: `npm run build` and `npm run lint`
Expected: both pass.

- [ ] **Step 8: Stage and propose a commit**

```bash
git add .storybook package.json package-lock.json .gitignore
git rm -r --cached src/stories 2>/dev/null || true
```

Propose: `chore: add Storybook for component development`
Show the user the staged file list and wait for approval.

---

### Task 3: Extend the design system

**Files:**
- Modify: `src/styles/tokens.css`, `src/styles/typography.css`, `src/styles/index.css`
- Create: `src/styles/rules.css`

**Interfaces:**
- Produces: the token names every component below references. Nothing renders correctly until this lands.

- [ ] **Step 1: Add the missing size, leading, and tracking tokens**

In `src/styles/tokens.css`, replace the `--- Sizes ---`, `--- Leading ---`, and `--- Tracking ---` blocks with:

```css
  /* --- Sizes (16px root) ---
   * Measured from the page comps (nodes 44:2, 40:2). The Design System page
   * named only five; the comps use thirteen.
   */
  --text-feature: 3.25rem; /* 52px — home hero headline */
  --text-headline: 2.875rem; /* 46px — article headline */
  --text-quote: 1.75rem; /* 28px — pitch band quote */
  --text-serif: 1.375rem; /* 22px — serif headlines, sidebar quote */
  --text-section: 1.25rem; /* 20px — article section headings */
  --text-card: 1.125rem; /* 18px — story card headlines */
  --text-related: 0.875rem; /* 14px — related-link headline */
  --text-body: 1rem; /* 16px — prose */
  --text-dek: 0.8125rem; /* 13px — sidebar deks, article byline */
  --text-link: 0.75rem; /* 12px — arrow links, footer meta */
  --text-meta: 0.6875rem; /* 11px — nav, meta bar, card meta, page kickers */
  --text-kicker: 0.625rem; /* 10px — story card + related kickers */
  --text-micro: 0.5625rem; /* 9px — sidebar kickers */

  /* --- Leading --- */
  --leading-tight: 1.1; /* feature + article headlines */
  --leading-card: 1.28; /* story card headlines */
  --leading-snug: 1.3;
  --leading-serif: 1.35; /* serif headlines */
  --leading-normal: 1.5;
  --leading-dek: 1.65; /* sidebar deks */
  --leading-quote: 1.68; /* pitch band quote */
  --leading-prose: 1.75; /* hero dek, article body */

  /* --- Tracking --- */
  --tracking-tight: 0.02em; /* story card meta */
  --tracking-link: 0.04em; /* arrow links */
  --tracking-bar: 0.05em; /* meta bar */
  --tracking-wordmark: 0.08em; /* nav wordmark */
  --tracking-meta: 0.1em; /* nav links, footer wordmark */
  --tracking-label: 0.12em; /* all kickers */
```

The comps use 0.04em on the hero arrow link and 0.03em on the sidebar ones. That is a 0.12px difference at 12px; both use `--tracking-link`.

- [ ] **Step 2: Add the derived color tokens**

In `src/styles/tokens.css`, replace the `--color-rule` line in the `Semantic aliases` block with:

```css
  /* Assumption: the comps use 1px hairlines but never state a rule color. */
  --color-rule: rgb(7 2 13 / 15%);
  /* Article sidebar rules read visibly darker than the homepage hairlines. */
  --color-rule-strong: rgb(7 2 13 / 30%);
  /* The meta bar's bottom border is near-solid ink. */
  --color-rule-ink: rgb(7 2 13 / 85%);
  /* Footer meta and the pitch quote are the inverse ink, held back. */
  --color-ink-inverse-muted: rgb(255 236 209 / 50%);
  --color-ink-inverse-faint: rgb(239 233 224 / 33%);
```

- [ ] **Step 3: Add the nav border width**

In the `--- Borders ---` block, add below `--rule-width`:

```css
  --rule-width-medium: 2px; /* nav bottom border, node 44:3 */
```

- [ ] **Step 4: Add the typography variants**

Append to `src/styles/typography.css`:

```css
/*
 * Barlow Light at meta size. The meta bar and story-card meta lines are Light
 * in the comps, not the Medium that .label-meta sets.
 */
.label-meta--light {
  font-weight: var(--weight-body);
}

/* Mixed-case small text — the article byline is not a label, despite its size. */
.type-dek {
  font-family: var(--font-sans);
  font-weight: var(--weight-body);
  font-size: var(--text-dek);
  line-height: var(--leading-dek);
}

/* Long-form reading measure — looser than --leading-normal. */
.type-prose {
  font-family: var(--font-sans);
  font-weight: var(--weight-body);
  font-size: var(--text-body);
  line-height: var(--leading-prose);
}
```

- [ ] **Step 5: Create the rule utilities**

Create `src/styles/rules.css`:

```css
/*
 * Hairlines. These appear as often as borders on existing elements as they do
 * standalone, so they are utilities rather than a <Rule> component.
 */

.rule {
  border: 0;
  border-top: var(--rule-width) solid var(--color-rule);
  margin: 0;
}

/* Article sidebar dividers, node 40:24. */
.rule--strong {
  border-top-color: var(--color-rule-strong);
}

/* Story card top rules, node 44:35. */
.rule--thick {
  border-top: var(--rule-width-thick) solid var(--color-ink);
}
```

- [ ] **Step 6: Import it**

In `src/styles/index.css`, add after the typography import:

```css
@import './rules.css';
```

- [ ] **Step 7: Verify the styleguide still renders**

Run: `npm run dev`, open `localhost:5173`.
Expected: the existing StyleGuide is unchanged — every token it referenced still exists. The five original size tokens kept their names and values, so nothing should shift.

- [ ] **Step 8: Verify the build**

Run: `npm run build` and `npm run lint`
Expected: both pass.

- [ ] **Step 9: Stage and propose a commit**

```bash
git add src/styles
```

Propose: `feat: extend design tokens to cover the page comps`
Show the user the staged file list and wait for approval.

---

### Task 4: Content types and site constants

**Files:**
- Create: `src/content/types.ts`, `src/content/site.ts`, `src/content/site.test.ts`

**Interfaces:**
- Produces: every type name used by the components below. Exact shapes:
  - `NavLink { label: string; href: string; active?: boolean }`
  - `LinkRef { label: string; href: string }`
  - `Story { kicker: string; headline: string; meta: string; href: string }`
  - `FeatureStory { kicker: string; headline: string; dek: string; link: LinkRef }`
  - `SidebarStory { kicker: string; headline: string; dek: string; link: LinkRef; portrait?: { src: string; alt: string } }`
  - `ArticleSection { heading: string; paragraphs: string[] }`
  - `Article { slug: string; kicker: string; headline: string; byline: string; metaBarTitle: string; sections: ArticleSection[]; pullQuote: string; related: LinkRef }`

- [ ] **Step 1: Write the types**

Create `src/content/types.ts`:

```ts
/*
 * The shape of every piece of copy on the site. Components are typed against
 * these, so phase 8 can replace the module bodies with API calls without
 * touching a single component.
 */

export type NavLink = {
  label: string
  href: string
  /** The nav highlights the section the current page belongs to. */
  active?: boolean
}

export type LinkRef = {
  label: string
  href: string
}

/** A story-grid card: kicker, headline, and a single meta line. */
export type Story = {
  kicker: string
  headline: string
  meta: string
  href: string
}

/** The homepage hero — the loudest thing on the page. */
export type FeatureStory = {
  kicker: string
  headline: string
  dek: string
  link: LinkRef
}

/** Editor's Letter and Featured Work. The portrait is what distinguishes them. */
export type SidebarStory = {
  kicker: string
  headline: string
  dek: string
  link: LinkRef
  portrait?: {
    src: string
    alt: string
  }
}

export type ArticleSection = {
  heading: string
  paragraphs: string[]
}

export type Article = {
  slug: string
  kicker: string
  headline: string
  byline: string
  /** The meta bar shows the article title, uppercased, in its centre slot. */
  metaBarTitle: string
  sections: ArticleSection[]
  pullQuote: string
  related: LinkRef
}
```

- [ ] **Step 2: Write the failing test**

Create `src/content/site.test.ts`:

```ts
import { NAV_LINKS, META_BAR, FOOTER, WORDMARK } from './site'

test('exposes the four nav links from the comps', () => {
  expect(NAV_LINKS.map((link) => link.label)).toEqual([
    'FEATURES',
    'MASTHEAD',
    'FIELD NOTES',
    'THE EDITOR',
  ])
})

test('meta bar carries the fixed left and right slots', () => {
  expect(META_BAR.left).toBe('VOL. 1 — ISSUE 1')
  expect(META_BAR.right).toBe('VANCOUVER, BC · JUNE 2026')
})

test('wordmark and footer copy match the comps', () => {
  expect(WORDMARK).toBe('THE LINEUP')
  expect(FOOTER.byline).toBe('Joshua Kevin R. Bondoc · Editor & Content Manager')
  expect(FOOTER.contact).toBe('joshua.kevin.bondoc@gmail.com · Vancouver, BC')
})
```

- [ ] **Step 3: Run it to verify it fails**

Run: `npx vitest run src/content/site.test.ts`
Expected: FAIL — `Failed to resolve import "./site"`.

- [ ] **Step 4: Write the site constants**

Create `src/content/site.ts`:

```ts
import type { NavLink } from './types'

/*
 * Copy that is identical on every page. Taken verbatim from nodes 44:3/44:9/
 * 44:49 and 40:4/40:10/40:29.
 */

export const WORDMARK = 'THE LINEUP'

/* Nav order is left-to-right as rendered; the comps position them right-aligned. */
export const NAV_LINKS: NavLink[] = [
  { label: 'FEATURES', href: '/features' },
  { label: 'MASTHEAD', href: '/masthead' },
  { label: 'FIELD NOTES', href: '/field-notes' },
  { label: 'THE EDITOR', href: '/editor' },
]

export const META_BAR = {
  left: 'VOL. 1 — ISSUE 1',
  right: 'VANCOUVER, BC · JUNE 2026',
} as const

export const FOOTER = {
  byline: 'Joshua Kevin R. Bondoc · Editor & Content Manager',
  contact: 'joshua.kevin.bondoc@gmail.com · Vancouver, BC',
} as const
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/content/site.test.ts`
Expected: PASS, 3 tests.

- [ ] **Step 6: Stage and propose a commit**

```bash
git add src/content
```

Propose: `feat: add content types and site constants`
Show the user the staged file list and wait for approval.

---

### Task 5: Page content and the portrait asset

**Files:**
- Create: `src/content/home.ts`, `src/content/articles.ts`, `src/content/articles.test.ts`, `src/assets/joshua-portrait.png`

**Interfaces:**
- Consumes: every type from `src/content/types.ts` (Task 4).
- Produces: `HOME` (`{ hero: FeatureStory; editorsLetter: SidebarStory; featuredWork: SidebarStory; pitchQuote: string; stories: Story[] }`) and `ARTICLES` (`Record<string, Article>`) plus `getArticle(slug: string): Article | undefined`.

- [ ] **Step 1: Download the portrait**

Call the Figma MCP tool `download_assets` with `fileKey: "b0nXewYmbsbTlSr74Sg9pU"` and `nodeId: "44:31"`. Save the `rawImages` entry — the source photograph, not the export — to `src/assets/joshua-portrait.png`, using the extension its `format` field reports.

The asset URLs `get_design_context` returns expire after about seven days, so this must be an actual downloaded file, not a remote URL in the source.

- [ ] **Step 2: Write the homepage content**

Create `src/content/home.ts`:

```ts
import type { FeatureStory, SidebarStory, Story } from './types'
import portrait from '../assets/joshua-portrait.png'

/* Copy taken verbatim from node 44:2. */

const hero: FeatureStory = {
  kicker: "EDITOR'S FEATURE",
  headline:
    'Discontent with content. Editing suddenly mattered more and how AI Helps.',
  dek: "Eight years of shaping editorial systems by day, reading ocean conditions at dawn. The two disciplines are less different than you'd think.",
  link: { label: 'Continue reading', href: '/features/discontent-with-content' },
}

const editorsLetter: SidebarStory = {
  kicker: "EDITOR'S LETTER",
  headline: 'Why this site exists as a magazine, not a portfolio',
  dek: "I've spent 8 years curating other people's content.",
  link: { label: 'About Joshua', href: '/editor' },
  portrait: { src: portrait, alt: 'Joshua Bondoc reading in a bookshop' },
}

const featuredWork: SidebarStory = {
  kicker: 'FEATURED WORK',
  headline:
    'Academia, Medicine, Entertainment: building compliance in a sea of digital assets',
  dek: "A two-year overhaul of a global biotech's content library — on deadline, under regulatory pressure.",
  link: {
    label: 'Read the case study',
    href: '/features/building-compliance-in-a-sea-of-digital-assets',
  },
}

const pitchQuote =
  '"The accuracy of a million-copy print run, the technical rigor to coordinate distributed teams — eight years across pharmaceutical (Genentech), education (Study.com, Vibal), and media (EA Games)."'

const stories: Story[] = [
  {
    kicker: 'CASE STUDY',
    headline:
      'Study.com versus Vibal, Online versus Print: The processes overview',
    meta: 'Content operations · 2024–present',
    href: '/features/studycom-versus-vibal',
  },
  {
    kicker: 'COLUMN',
    headline: 'Who is the true king? Surboards, snowboards, skateboards',
    meta: 'By Joshua Bondoc · 6 min',
    href: '/features/who-is-the-true-king',
  },
  {
    kicker: 'FIELD NOTES',
    headline: 'The many ways AI has been changing content management.',
    meta: 'Board sports · Local guide',
    href: '/field-notes/ai-and-content-management',
  },
]

export const HOME = {
  hero,
  editorsLetter,
  featuredWork,
  pitchQuote,
  stories,
  metaBarCenter: 'CONTENT · SUSTAINABILITY · BOARD SPORTS',
}
```

"Surboards" is the comp's spelling (node `44:42`). It is reproduced verbatim; flag it to the user at Task 22 rather than silently correcting the source.

- [ ] **Step 3: Write the failing article test**

Create `src/content/articles.test.ts`:

```ts
import { getArticle } from './articles'

test('resolves the case study by slug', () => {
  const article = getArticle('building-compliance-in-a-sea-of-digital-assets')
  expect(article?.headline).toBe(
    'Building compliance in a sea of digital assets',
  )
  expect(article?.sections).toHaveLength(3)
})

test('returns undefined for an unknown slug', () => {
  expect(getArticle('nope')).toBeUndefined()
})
```

- [ ] **Step 4: Run it to verify it fails**

Run: `npx vitest run src/content/articles.test.ts`
Expected: FAIL — `Failed to resolve import "./articles"`.

- [ ] **Step 5: Write the article content**

Create `src/content/articles.ts`:

```ts
import type { Article } from './types'

/* Copy taken verbatim from node 40:2. */

const buildingCompliance: Article = {
  slug: 'building-compliance-in-a-sea-of-digital-assets',
  kicker: 'CASE STUDY',
  headline: 'Building compliance in a sea of digital assets',
  byline: 'By Joshua Bondoc — 12 min read — Content Operations, 2019–2024',
  metaBarTitle: 'GENENTECH: BUILDING COMPLIANCE IN A SEA OF DIGITAL ASSETS',
  sections: [
    {
      heading: 'The problem with a growing pipeline',
      paragraphs: [
        'Every new drug approval multiplies the content that has to move through review. By the time the asset library hit six figures, the bottleneck was not creative output — it was knowing which version of which asset was actually compliant to ship.',
      ],
    },
    {
      heading: 'Rebuilding the system, not just the spreadsheet',
      paragraphs: [
        'The fix was not a bigger team. It was a taxonomy that matched how regulatory, brand, and medical teams actually thought about an asset — and a review workflow that made the compliant version the easiest one to find.',
      ],
    },
    {
      heading: 'What shipped',
      paragraphs: [
        'Eighteen months in, time-to-approval dropped by half, and the library stopped being a place assets went to get lost. The same logic now runs the broader content operations function.',
      ],
    },
  ],
  pullQuote:
    'A digital asset library is only as trustworthy as its slowest approval step.',
  related: {
    label: 'Study.com: scaling a distributed editorial contractor team',
    href: '/features/studycom-scaling-a-distributed-editorial-contractor-team',
  },
}

export const ARTICLES: Record<string, Article> = {
  [buildingCompliance.slug]: buildingCompliance,
}

export function getArticle(slug: string): Article | undefined {
  return ARTICLES[slug]
}
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npx vitest run src/content`
Expected: PASS, 5 tests.

- [ ] **Step 7: Verify the image import typechecks**

Run: `npm run build`
Expected: pass. `src/vite-env.d.ts` already references `vite/client`, which declares the PNG module type.

- [ ] **Step 8: Stage and propose a commit**

```bash
git add src/content src/assets
```

Propose: `feat: add homepage and article content`
Show the user the staged file list and wait for approval.

---

### Task 6: Kicker

**Files:**
- Create: `src/components/primitives/Kicker.tsx`, `Kicker.css`, `Kicker.stories.tsx`
- Modify: `src/components/primitives/Kicker.test.tsx` (replaces the Task 1 smoke test)

**Interfaces:**
- Produces: `Kicker({ children, tone, size }): JSX.Element` where `tone?: 'forest' | 'coral' | 'ink'` (default `'forest'`) and `size?: 'micro' | 'kicker' | 'meta'` (default `'meta'`).

The comps use three kicker sizes: 9px in the homepage sidebar (`44:20`), 10px in the story grid and article Related (`44:36`, `40:27`), 11px on the hero and article header (`44:14`, `40:14`). All three share `--tracking-label`.

- [ ] **Step 1: Write the failing test**

Replace `src/components/primitives/Kicker.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import Kicker from './Kicker'

test('renders its children', () => {
  render(<Kicker>Editor's Feature</Kicker>)
  expect(screen.getByText("Editor's Feature")).toBeInTheDocument()
})

test('defaults to the forest tone at meta size', () => {
  render(<Kicker>Case Study</Kicker>)
  const el = screen.getByText('Case Study')
  expect(el).toHaveClass('kicker--forest')
  expect(el).toHaveClass('kicker--meta')
})

test('honours an explicit tone and size', () => {
  render(
    <Kicker tone="coral" size="micro">
      Related
    </Kicker>,
  )
  const el = screen.getByText('Related')
  expect(el).toHaveClass('kicker--coral')
  expect(el).toHaveClass('kicker--micro')
  expect(el).not.toHaveClass('kicker--forest')
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/components/primitives/Kicker.test.tsx`
Expected: FAIL — `Failed to resolve import "./Kicker"`.

- [ ] **Step 3: Write the component**

Create `src/components/primitives/Kicker.tsx`:

```tsx
import type { ReactNode } from 'react'
import './Kicker.css'

type KickerProps = {
  children: ReactNode
  /** Forest on the homepage, coral on the article page. */
  tone?: 'forest' | 'coral' | 'ink'
  /** 9px in the homepage sidebar, 10px in the story grid, 11px on headers. */
  size?: 'micro' | 'kicker' | 'meta'
}

export default function Kicker({
  children,
  tone = 'forest',
  size = 'meta',
}: KickerProps) {
  return (
    <p className={`kicker label-meta label-meta--wide kicker--${tone} kicker--${size}`}>
      {children}
    </p>
  )
}
```

- [ ] **Step 4: Write the styles**

Create `src/components/primitives/Kicker.css`:

```css
/* Section eyebrow. Nodes 44:14, 44:20, 44:36, 40:14, 40:27. */

.kicker {
  margin: 0;
}

.kicker--forest {
  color: var(--color-deep-forest);
}

.kicker--coral {
  color: var(--color-accent);
}

.kicker--ink {
  color: var(--color-ink);
}

.kicker--micro {
  font-size: var(--text-micro);
}

.kicker--kicker {
  font-size: var(--text-kicker);
}

.kicker--meta {
  font-size: var(--text-meta);
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/components/primitives/Kicker.test.tsx`
Expected: PASS, 3 tests.

- [ ] **Step 6: Write the story**

Create `src/components/primitives/Kicker.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import Kicker from './Kicker'

const meta: Meta<typeof Kicker> = {
  title: 'Primitives/Kicker',
  component: Kicker,
  args: { children: "EDITOR'S FEATURE" },
}

export default meta
type Story = StoryObj<typeof Kicker>

export const Forest: Story = {}

export const Coral: Story = {
  args: { tone: 'coral', children: 'CASE STUDY' },
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem', padding: '2rem' }}>
      <Kicker size="micro">EDITOR'S LETTER — 9PX</Kicker>
      <Kicker size="kicker">CASE STUDY — 10PX</Kicker>
      <Kicker size="meta">EDITOR'S FEATURE — 11PX</Kicker>
    </div>
  ),
}
```

- [ ] **Step 7: Stage and propose a commit**

```bash
git add src/components/primitives
```

Propose: `feat: add Kicker primitive`
Show the user the staged file list and wait for approval.

---

### Task 7: ArrowLink

**Files:**
- Create: `src/components/primitives/ArrowLink.tsx`, `ArrowLink.css`, `ArrowLink.test.tsx`, `ArrowLink.stories.tsx`

**Interfaces:**
- Produces: `ArrowLink({ href, children, emphasis }): JSX.Element` where `emphasis?: 'meta' | 'card'` (default `'meta'`).

`meta` is Barlow Medium 12px coral with `--tracking-link` (nodes `44:17`, `44:23`, `44:28`). `card` is Archivo Black 14px ink with no tracking (node `40:28`).

- [ ] **Step 1: Write the failing test**

Create `src/components/primitives/ArrowLink.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import ArrowLink from './ArrowLink'

test('renders an anchor to the href', () => {
  render(<ArrowLink href="/features">Continue reading</ArrowLink>)
  expect(screen.getByRole('link', { name: /continue reading/i })).toHaveAttribute(
    'href',
    '/features',
  )
})

test('appends an arrow that screen readers skip', () => {
  render(<ArrowLink href="/x">About Joshua</ArrowLink>)
  const link = screen.getByRole('link')
  expect(link).toHaveTextContent('About Joshua →')
  expect(link.querySelector('[aria-hidden="true"]')).not.toBeNull()
})

test('defaults to meta emphasis', () => {
  render(<ArrowLink href="/x">Read</ArrowLink>)
  expect(screen.getByRole('link')).toHaveClass('arrow-link--meta')
})

test('honours card emphasis', () => {
  render(
    <ArrowLink href="/x" emphasis="card">
      Study.com
    </ArrowLink>,
  )
  expect(screen.getByRole('link')).toHaveClass('arrow-link--card')
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/components/primitives/ArrowLink.test.tsx`
Expected: FAIL — `Failed to resolve import "./ArrowLink"`.

- [ ] **Step 3: Write the component**

Create `src/components/primitives/ArrowLink.tsx`:

```tsx
import type { ReactNode } from 'react'
import './ArrowLink.css'

type ArrowLinkProps = {
  href: string
  children: ReactNode
  /** 12px coral meta by default; 14px display for the article's Related link. */
  emphasis?: 'meta' | 'card'
}

export default function ArrowLink({
  href,
  children,
  emphasis = 'meta',
}: ArrowLinkProps) {
  return (
    <a className={`arrow-link arrow-link--${emphasis}`} href={href}>
      {children}
      {/* Decorative — the link text already says where it goes. */}
      <span aria-hidden="true"> →</span>
    </a>
  )
}
```

- [ ] **Step 4: Write the styles**

Create `src/components/primitives/ArrowLink.css`:

```css
/* Nodes 44:17, 44:23, 44:28 (meta) and 40:28 (card). */

.arrow-link {
  text-decoration: none;
}

.arrow-link:hover {
  text-decoration: underline;
}

.arrow-link--meta {
  color: var(--color-accent);
  font-family: var(--font-sans);
  font-weight: var(--weight-meta);
  font-size: var(--text-link);
  letter-spacing: var(--tracking-link);
}

.arrow-link--card {
  color: var(--color-ink);
  font-family: var(--font-display);
  font-weight: var(--weight-display);
  font-size: var(--text-related);
  line-height: var(--leading-snug);
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/components/primitives/ArrowLink.test.tsx`
Expected: PASS, 4 tests.

- [ ] **Step 6: Write the story**

Create `src/components/primitives/ArrowLink.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import ArrowLink from './ArrowLink'

const meta: Meta<typeof ArrowLink> = {
  title: 'Primitives/ArrowLink',
  component: ArrowLink,
  args: { href: '#', children: 'Continue reading' },
}

export default meta
type Story = StoryObj<typeof ArrowLink>

export const Meta_: Story = { name: 'Meta' }

export const Card: Story = {
  args: {
    emphasis: 'card',
    children: 'Study.com: scaling a distributed editorial contractor team',
  },
}
```

- [ ] **Step 7: Stage and propose a commit**

```bash
git add src/components/primitives
```

Propose: `feat: add ArrowLink primitive`
Show the user the staged file list and wait for approval.

---

### Task 8: Portrait

**Files:**
- Create: `src/components/primitives/Portrait.tsx`, `Portrait.css`, `Portrait.test.tsx`, `Portrait.stories.tsx`

**Interfaces:**
- Produces: `Portrait({ src, alt }): JSX.Element` — a 134px circular image (node `44:29`).

- [ ] **Step 1: Write the failing test**

Create `src/components/primitives/Portrait.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import Portrait from './Portrait'

test('renders the image with its alt text', () => {
  render(<Portrait src="/joshua.png" alt="Joshua Bondoc" />)
  const img = screen.getByAltText('Joshua Bondoc')
  expect(img).toHaveAttribute('src', '/joshua.png')
})

test('carries the circular frame class', () => {
  render(<Portrait src="/joshua.png" alt="Joshua Bondoc" />)
  expect(screen.getByAltText('Joshua Bondoc').parentElement).toHaveClass(
    'portrait',
  )
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/components/primitives/Portrait.test.tsx`
Expected: FAIL — `Failed to resolve import "./Portrait"`.

- [ ] **Step 3: Write the component**

Create `src/components/primitives/Portrait.tsx`:

```tsx
import './Portrait.css'

type PortraitProps = {
  src: string
  alt: string
}

export default function Portrait({ src, alt }: PortraitProps) {
  return (
    <div className="portrait">
      <img className="portrait__image" src={src} alt={alt} />
    </div>
  )
}
```

- [ ] **Step 4: Write the styles**

Create `src/components/primitives/Portrait.css`:

```css
/*
 * Node 44:29. Figma masks a 166.9 x 222.6 photograph with a 134px circle; the
 * equivalent here is a fixed circular frame with the image cropped to cover.
 */

.portrait {
  width: 8.375rem; /* 134px */
  height: 8.375rem;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.portrait__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/components/primitives/Portrait.test.tsx`
Expected: PASS, 2 tests.

- [ ] **Step 6: Write the story**

Create `src/components/primitives/Portrait.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import Portrait from './Portrait'
import portrait from '../../assets/joshua-portrait.png'

const meta: Meta<typeof Portrait> = {
  title: 'Primitives/Portrait',
  component: Portrait,
  args: { src: portrait, alt: 'Joshua Bondoc reading in a bookshop' },
}

export default meta
type Story = StoryObj<typeof Portrait>

export const Circular: Story = {}
```

- [ ] **Step 7: Stage and propose a commit**

```bash
git add src/components/primitives
```

Propose: `feat: add Portrait primitive`
Show the user the staged file list and wait for approval.

---

### Task 9: PullQuote

**Files:**
- Create: `src/components/primitives/PullQuote.tsx`, `PullQuote.css`, `PullQuote.test.tsx`, `PullQuote.stories.tsx`

**Interfaces:**
- Produces: `PullQuote({ children, variant }): JSX.Element` where `variant: 'band' | 'sidebar'`.

`band` is 28px Jomolhari, centred, `--color-ink-inverse-faint`, `--leading-quote` (node `44:33`). `sidebar` is 22px Jomolhari, left-aligned, `--color-deep-forest`, `--leading-serif` (node `40:25`).

- [ ] **Step 1: Write the failing test**

Create `src/components/primitives/PullQuote.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import PullQuote from './PullQuote'

test('renders as a blockquote', () => {
  const { container } = render(
    <PullQuote variant="sidebar">Only as trustworthy as its slowest step.</PullQuote>,
  )
  expect(container.querySelector('blockquote')).not.toBeNull()
  expect(
    screen.getByText('Only as trustworthy as its slowest step.'),
  ).toBeInTheDocument()
})

test('applies the band variant class', () => {
  const { container } = render(<PullQuote variant="band">Quote</PullQuote>)
  expect(container.querySelector('blockquote')).toHaveClass('pull-quote--band')
})

test('applies the sidebar variant class', () => {
  const { container } = render(<PullQuote variant="sidebar">Quote</PullQuote>)
  expect(container.querySelector('blockquote')).toHaveClass(
    'pull-quote--sidebar',
  )
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/components/primitives/PullQuote.test.tsx`
Expected: FAIL — `Failed to resolve import "./PullQuote"`.

- [ ] **Step 3: Write the component**

Create `src/components/primitives/PullQuote.tsx`:

```tsx
import type { ReactNode } from 'react'
import './PullQuote.css'

type PullQuoteProps = {
  children: ReactNode
  /** The homepage's dark band, or the article page's sidebar aside. */
  variant: 'band' | 'sidebar'
}

export default function PullQuote({ children, variant }: PullQuoteProps) {
  return (
    <blockquote className={`pull-quote type-serif pull-quote--${variant}`}>
      {children}
    </blockquote>
  )
}
```

- [ ] **Step 4: Write the styles**

Create `src/components/primitives/PullQuote.css`:

```css
/* Nodes 44:33 (band) and 40:25 (sidebar). */

.pull-quote {
  margin: 0;
}

.pull-quote--band {
  font-size: var(--text-quote);
  line-height: var(--leading-quote);
  color: var(--color-ink-inverse-faint);
  text-align: center;
  max-width: 74.6875rem; /* 1195px, node 44:33 */
  margin-inline: auto;
}

.pull-quote--sidebar {
  font-size: var(--text-serif);
  line-height: var(--leading-serif);
  color: var(--color-deep-forest);
}
```

The band quote sits at 33% opacity in the comp, which is faint but deliberate. Raise it to `--color-ink-inverse-muted` only if the user asks after seeing it rendered.

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/components/primitives/PullQuote.test.tsx`
Expected: PASS, 3 tests.

- [ ] **Step 6: Write the story**

Create `src/components/primitives/PullQuote.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import PullQuote from './PullQuote'
import { HOME } from '../../content/home'
import { getArticle } from '../../content/articles'

const meta: Meta<typeof PullQuote> = {
  title: 'Primitives/PullQuote',
  component: PullQuote,
}

export default meta
type Story = StoryObj<typeof PullQuote>

export const Band: Story = {
  args: { variant: 'band', children: HOME.pitchQuote },
  parameters: { backgrounds: { value: 'dark' } },
  render: (args) => (
    <div style={{ background: 'var(--color-deep-forest)', padding: '2.4375rem 7.5rem' }}>
      <PullQuote {...args} />
    </div>
  ),
}

export const Sidebar: Story = {
  args: {
    variant: 'sidebar',
    children: getArticle('building-compliance-in-a-sea-of-digital-assets')!
      .pullQuote,
  },
}
```

- [ ] **Step 7: Stage and propose a commit**

```bash
git add src/components/primitives
```

Propose: `feat: add PullQuote primitive`
Show the user the staged file list and wait for approval.

---

### Task 10: Band

**Files:**
- Create: `src/components/primitives/Band.tsx`, `Band.css`, `Band.test.tsx`, `Band.stories.tsx`

**Interfaces:**
- Produces: `Band({ children, tone }): JSX.Element` where `tone: 'forest' | 'surface'`. A full-bleed section whose inner content is held to the 120px gutter.

- [ ] **Step 1: Write the failing test**

Create `src/components/primitives/Band.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import Band from './Band'

test('renders its children inside a section', () => {
  render(<Band tone="forest">Pitch</Band>)
  const section = screen.getByText('Pitch').closest('section')
  expect(section).toHaveClass('band--forest')
})

test('constrains content in an inner wrapper', () => {
  const { container } = render(<Band tone="surface">Content</Band>)
  expect(container.querySelector('.band__inner')).not.toBeNull()
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/components/primitives/Band.test.tsx`
Expected: FAIL — `Failed to resolve import "./Band"`.

- [ ] **Step 3: Write the component**

Create `src/components/primitives/Band.tsx`:

```tsx
import type { ReactNode } from 'react'
import './Band.css'

type BandProps = {
  children: ReactNode
  /** The homepage pitch band is forest; the nav, hero, and grid sit on surface. */
  tone: 'forest' | 'surface'
}

export default function Band({ children, tone }: BandProps) {
  return (
    <section className={`band band--${tone}`}>
      <div className="band__inner">{children}</div>
    </section>
  )
}
```

- [ ] **Step 4: Write the styles**

Create `src/components/primitives/Band.css`:

```css
/* Full-bleed section. Node 44:32. */

.band {
  width: 100%;
}

.band__inner {
  padding-inline: var(--page-gutter);
}

.band--forest {
  background-color: var(--color-deep-forest);
  padding-block: var(--space-10); /* 40px, node 44:32 */
}

.band--surface {
  background-color: var(--color-surface);
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/components/primitives/Band.test.tsx`
Expected: PASS, 2 tests.

- [ ] **Step 6: Write the story**

Create `src/components/primitives/Band.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import Band from './Band'
import PullQuote from './PullQuote'
import { HOME } from '../../content/home'

const meta: Meta<typeof Band> = {
  title: 'Primitives/Band',
  component: Band,
}

export default meta
type Story = StoryObj<typeof Band>

export const Forest: Story = {
  args: {
    tone: 'forest',
    children: <PullQuote variant="band">{HOME.pitchQuote}</PullQuote>,
  },
}

export const Surface: Story = {
  args: { tone: 'surface', children: <p className="type-body">Surface band</p> },
}
```

- [ ] **Step 7: Stage and propose a commit**

```bash
git add src/components/primitives
```

Propose: `feat: add Band primitive`
Show the user the staged file list and wait for approval.

---

### Task 11: Wordmark

**Files:**
- Create: `src/components/chrome/Wordmark.tsx`, `Wordmark.css`, `Wordmark.test.tsx`, `Wordmark.stories.tsx`

**Interfaces:**
- Consumes: `WORDMARK` from `src/content/site.ts` (Task 4).
- Produces: `Wordmark({ size }): JSX.Element` where `size: 'nav' | 'footer'`.

28px / `--tracking-wordmark` in the nav (`44:4`); 16px / `--tracking-meta` in the footer (`44:50`). Both `--color-accent`.

- [ ] **Step 1: Write the failing test**

Create `src/components/chrome/Wordmark.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import Wordmark from './Wordmark'

test('renders the site name', () => {
  render(<Wordmark size="nav" />)
  expect(screen.getByText('THE LINEUP')).toBeInTheDocument()
})

test('applies the size variant', () => {
  render(<Wordmark size="footer" />)
  expect(screen.getByText('THE LINEUP')).toHaveClass('wordmark--footer')
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/components/chrome/Wordmark.test.tsx`
Expected: FAIL — `Failed to resolve import "./Wordmark"`.

- [ ] **Step 3: Write the component**

Create `src/components/chrome/Wordmark.tsx`:

```tsx
import { WORDMARK } from '../../content/site'
import './Wordmark.css'

type WordmarkProps = {
  size: 'nav' | 'footer'
}

export default function Wordmark({ size }: WordmarkProps) {
  return <span className={`wordmark wordmark--${size}`}>{WORDMARK}</span>
}
```

- [ ] **Step 4: Write the styles**

Create `src/components/chrome/Wordmark.css`:

```css
/* Nodes 44:4 (nav) and 44:50 (footer). */

.wordmark {
  color: var(--color-accent);
  font-family: var(--font-display);
  font-weight: var(--weight-display);
  text-transform: uppercase;
}

.wordmark--nav {
  font-size: 1.75rem; /* 28px */
  letter-spacing: var(--tracking-wordmark);
}

.wordmark--footer {
  font-size: 1rem; /* 16px */
  letter-spacing: var(--tracking-meta);
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/components/chrome/Wordmark.test.tsx`
Expected: PASS, 2 tests.

- [ ] **Step 6: Write the story**

Create `src/components/chrome/Wordmark.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import Wordmark from './Wordmark'

const meta: Meta<typeof Wordmark> = {
  title: 'Chrome/Wordmark',
  component: Wordmark,
}

export default meta
type Story = StoryObj<typeof Wordmark>

export const Nav: Story = { args: { size: 'nav' } }
export const Footer: Story = { args: { size: 'footer' } }
```

- [ ] **Step 7: Stage and propose a commit**

```bash
git add src/components/chrome
```

Propose: `feat: add Wordmark component`
Show the user the staged file list and wait for approval.

---

### Task 12: SiteHeader

**Files:**
- Create: `src/components/chrome/SiteHeader.tsx`, `SiteHeader.css`, `SiteHeader.test.tsx`, `SiteHeader.stories.tsx`

**Interfaces:**
- Consumes: `Wordmark` (Task 11), `NAV_LINKS` from `src/content/site.ts`.
- Produces: `SiteHeader({ activeHref }): JSX.Element` where `activeHref?: string`.

The comp highlights FEATURES in coral on the article page (`40:9`) and leaves it inactive on the homepage. Inactive links are `--color-ink` — the fix for the invisible-text defect.

- [ ] **Step 1: Write the failing test**

Create `src/components/chrome/SiteHeader.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import SiteHeader from './SiteHeader'

test('renders the wordmark and all four nav links', () => {
  render(<SiteHeader />)
  expect(screen.getByText('THE LINEUP')).toBeInTheDocument()
  expect(screen.getAllByRole('link')).toHaveLength(5) // 4 nav + wordmark home link
})

test('marks no link active by default', () => {
  const { container } = render(<SiteHeader />)
  expect(container.querySelectorAll('.site-header__link--active')).toHaveLength(0)
})

test('marks the matching link active', () => {
  render(<SiteHeader activeHref="/features" />)
  expect(screen.getByRole('link', { name: 'FEATURES' })).toHaveClass(
    'site-header__link--active',
  )
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/components/chrome/SiteHeader.test.tsx`
Expected: FAIL — `Failed to resolve import "./SiteHeader"`.

- [ ] **Step 3: Write the component**

Create `src/components/chrome/SiteHeader.tsx`:

```tsx
import Wordmark from './Wordmark'
import { NAV_LINKS } from '../../content/site'
import './SiteHeader.css'

type SiteHeaderProps = {
  /** The nav highlights the section the current page belongs to. */
  activeHref?: string
}

export default function SiteHeader({ activeHref }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <a className="site-header__home" href="/">
        <Wordmark size="nav" />
      </a>
      <nav className="site-header__nav">
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            className={`site-header__link label-meta${
              link.href === activeHref ? ' site-header__link--active' : ''
            }`}
            href={link.href}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  )
}
```

- [ ] **Step 4: Write the styles**

Create `src/components/chrome/SiteHeader.css`:

```css
/*
 * Node 44:3. The comp sets the inactive nav links to the surface color, which
 * renders them invisible; they are ink here by deliberate deviation.
 */

.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--nav-height);
  padding-inline: var(--page-gutter);
  background-color: var(--color-surface);
  border-bottom: var(--rule-width-medium) solid var(--color-ink);
}

.site-header__home {
  text-decoration: none;
}

.site-header__nav {
  display: flex;
  gap: var(--space-8);
}

.site-header__link {
  color: var(--color-ink);
  text-decoration: none;
}

.site-header__link:hover,
.site-header__link--active {
  color: var(--color-accent);
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/components/chrome/SiteHeader.test.tsx`
Expected: PASS, 3 tests.

- [ ] **Step 6: Write the story**

Create `src/components/chrome/SiteHeader.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import SiteHeader from './SiteHeader'

const meta: Meta<typeof SiteHeader> = {
  title: 'Chrome/SiteHeader',
  component: SiteHeader,
}

export default meta
type Story = StoryObj<typeof SiteHeader>

export const Homepage: Story = {}
export const ArticlePage: Story = { args: { activeHref: '/features' } }
```

- [ ] **Step 7: Stage and propose a commit**

```bash
git add src/components/chrome
```

Propose: `feat: add SiteHeader component`
Show the user the staged file list and wait for approval.

---

### Task 13: MetaBar

**Files:**
- Create: `src/components/chrome/MetaBar.tsx`, `MetaBar.css`, `MetaBar.test.tsx`, `MetaBar.stories.tsx`

**Interfaces:**
- Consumes: `META_BAR` from `src/content/site.ts`.
- Produces: `MetaBar({ center }): JSX.Element`.

Barlow **Light** 11px, `--tracking-bar`, `--color-ink-muted` (the invisible-text fix). Node `44:9`.

- [ ] **Step 1: Write the failing test**

Create `src/components/chrome/MetaBar.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import MetaBar from './MetaBar'

test('renders the fixed left and right slots', () => {
  render(<MetaBar center="CONTENT · SUSTAINABILITY · BOARD SPORTS" />)
  expect(screen.getByText('VOL. 1 — ISSUE 1')).toBeInTheDocument()
  expect(screen.getByText('VANCOUVER, BC · JUNE 2026')).toBeInTheDocument()
})

test('renders the caller-supplied centre slot', () => {
  render(<MetaBar center="THE EDITOR" />)
  expect(screen.getByText('THE EDITOR')).toBeInTheDocument()
})

test('uses the light meta weight', () => {
  render(<MetaBar center="X" />)
  expect(screen.getByText('VOL. 1 — ISSUE 1')).toHaveClass('label-meta--light')
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/components/chrome/MetaBar.test.tsx`
Expected: FAIL — `Failed to resolve import "./MetaBar"`.

- [ ] **Step 3: Write the component**

Create `src/components/chrome/MetaBar.tsx`:

```tsx
import { META_BAR } from '../../content/site'
import './MetaBar.css'

type MetaBarProps = {
  /** The only slot that changes per page. */
  center: string
}

export default function MetaBar({ center }: MetaBarProps) {
  return (
    <div className="meta-bar">
      <span className="label-meta label-meta--light meta-bar__slot">
        {META_BAR.left}
      </span>
      <span className="label-meta label-meta--light meta-bar__slot">
        {center}
      </span>
      <span className="label-meta label-meta--light meta-bar__slot">
        {META_BAR.right}
      </span>
    </div>
  )
}
```

- [ ] **Step 4: Write the styles**

Create `src/components/chrome/MetaBar.css`:

```css
/*
 * Node 44:9. The comp sets all three strings to the surface color, rendering
 * them invisible; they are muted ink here by deliberate deviation.
 */

.meta-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--meta-bar-height);
  padding-inline: var(--page-gutter);
  background-color: var(--color-surface);
  border-bottom: var(--rule-width) solid var(--color-rule-ink);
}

.meta-bar__slot {
  color: var(--color-ink-muted);
  letter-spacing: var(--tracking-bar);
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/components/chrome/MetaBar.test.tsx`
Expected: PASS, 3 tests.

- [ ] **Step 6: Write the story**

Create `src/components/chrome/MetaBar.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import MetaBar from './MetaBar'
import { HOME } from '../../content/home'
import { getArticle } from '../../content/articles'

const meta: Meta<typeof MetaBar> = {
  title: 'Chrome/MetaBar',
  component: MetaBar,
}

export default meta
type Story = StoryObj<typeof MetaBar>

export const Homepage: Story = { args: { center: HOME.metaBarCenter } }

export const ArticlePage: Story = {
  args: {
    center: getArticle('building-compliance-in-a-sea-of-digital-assets')!
      .metaBarTitle,
  },
}
```

- [ ] **Step 7: Stage and propose a commit**

```bash
git add src/components/chrome
```

Propose: `feat: add MetaBar component`
Show the user the staged file list and wait for approval.

---

### Task 14: SiteFooter

**Files:**
- Create: `src/components/chrome/SiteFooter.tsx`, `SiteFooter.css`, `SiteFooter.test.tsx`, `SiteFooter.stories.tsx`

**Interfaces:**
- Consumes: `Wordmark` (Task 11), `FOOTER` from `src/content/site.ts`.
- Produces: `SiteFooter(): JSX.Element`.

Background `--color-ink`, meta text `--color-ink-inverse-muted` at 12px Barlow Light. Node `44:49`.

- [ ] **Step 1: Write the failing test**

Create `src/components/chrome/SiteFooter.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import SiteFooter from './SiteFooter'

test('renders the wordmark, byline, and contact', () => {
  render(<SiteFooter />)
  expect(screen.getByText('THE LINEUP')).toBeInTheDocument()
  expect(
    screen.getByText('Joshua Kevin R. Bondoc · Editor & Content Manager'),
  ).toBeInTheDocument()
  expect(
    screen.getByText('joshua.kevin.bondoc@gmail.com · Vancouver, BC'),
  ).toBeInTheDocument()
})

test('renders as a contentinfo landmark', () => {
  render(<SiteFooter />)
  expect(screen.getByRole('contentinfo')).toHaveClass('site-footer')
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/components/chrome/SiteFooter.test.tsx`
Expected: FAIL — `Failed to resolve import "./SiteFooter"`.

- [ ] **Step 3: Write the component**

Create `src/components/chrome/SiteFooter.tsx`:

```tsx
import Wordmark from './Wordmark'
import { FOOTER } from '../../content/site'
import './SiteFooter.css'

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <Wordmark size="footer" />
      <span className="site-footer__meta">{FOOTER.byline}</span>
      <span className="site-footer__meta">{FOOTER.contact}</span>
    </footer>
  )
}
```

- [ ] **Step 4: Write the styles**

Create `src/components/chrome/SiteFooter.css`:

```css
/* Node 44:49. The comp uses #1e1e1e; the ink token wins per the phase-2 spec. */

.site-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4.5rem; /* 72px */
  padding-inline: var(--page-gutter);
  background-color: var(--color-ink);
}

.site-footer__meta {
  color: var(--color-ink-inverse-muted);
  font-family: var(--font-sans);
  font-weight: var(--weight-body);
  font-size: var(--text-link);
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/components/chrome/SiteFooter.test.tsx`
Expected: PASS, 2 tests.

- [ ] **Step 6: Write the story**

Create `src/components/chrome/SiteFooter.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import SiteFooter from './SiteFooter'

const meta: Meta<typeof SiteFooter> = {
  title: 'Chrome/SiteFooter',
  component: SiteFooter,
}

export default meta
type Story = StoryObj<typeof SiteFooter>

export const Default: Story = {}
```

- [ ] **Step 7: Stage and propose a commit**

```bash
git add src/components/chrome
```

Propose: `feat: add SiteFooter component`
Show the user the staged file list and wait for approval.

---

### Task 15: PageShell

**Files:**
- Create: `src/components/chrome/PageShell.tsx`, `PageShell.css`, `PageShell.test.tsx`, `PageShell.stories.tsx`

**Interfaces:**
- Consumes: `SiteHeader` (Task 12), `MetaBar` (Task 13), `SiteFooter` (Task 14).
- Produces: `PageShell({ metaBarCenter, activeHref, children }): JSX.Element`.

- [ ] **Step 1: Write the failing test**

Create `src/components/chrome/PageShell.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import PageShell from './PageShell'

test('renders header, meta bar, main, and footer', () => {
  render(
    <PageShell metaBarCenter="TAGLINE">
      <p>Page body</p>
    </PageShell>,
  )
  expect(screen.getByRole('banner')).toBeInTheDocument()
  expect(screen.getByText('TAGLINE')).toBeInTheDocument()
  expect(screen.getByRole('main')).toHaveTextContent('Page body')
  expect(screen.getByRole('contentinfo')).toBeInTheDocument()
})

test('passes the active href through to the nav', () => {
  render(
    <PageShell metaBarCenter="X" activeHref="/features">
      <p>Body</p>
    </PageShell>,
  )
  expect(screen.getByRole('link', { name: 'FEATURES' })).toHaveClass(
    'site-header__link--active',
  )
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/components/chrome/PageShell.test.tsx`
Expected: FAIL — `Failed to resolve import "./PageShell"`.

- [ ] **Step 3: Write the component**

Create `src/components/chrome/PageShell.tsx`:

```tsx
import type { ReactNode } from 'react'
import SiteHeader from './SiteHeader'
import MetaBar from './MetaBar'
import SiteFooter from './SiteFooter'
import './PageShell.css'

type PageShellProps = {
  metaBarCenter: string
  activeHref?: string
  children: ReactNode
}

export default function PageShell({
  metaBarCenter,
  activeHref,
  children,
}: PageShellProps) {
  return (
    <div className="page-shell">
      <SiteHeader activeHref={activeHref} />
      <MetaBar center={metaBarCenter} />
      <main className="page-shell__main">{children}</main>
      <SiteFooter />
    </div>
  )
}
```

- [ ] **Step 4: Write the styles**

Create `src/components/chrome/PageShell.css`:

```css
/* The chrome every page shares. Nodes 44:2 and 40:2. */

.page-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--color-bg);
}

.page-shell__main {
  flex: 1;
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/components/chrome/PageShell.test.tsx`
Expected: PASS, 2 tests.

- [ ] **Step 6: Write the story**

Create `src/components/chrome/PageShell.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import PageShell from './PageShell'
import { HOME } from '../../content/home'

const meta: Meta<typeof PageShell> = {
  title: 'Chrome/PageShell',
  component: PageShell,
}

export default meta
type Story = StoryObj<typeof PageShell>

export const Empty: Story = {
  args: {
    metaBarCenter: HOME.metaBarCenter,
    children: (
      <p className="type-body" style={{ padding: '5rem 7.5rem' }}>
        Page content goes here in phase 3.
      </p>
    ),
  },
}
```

- [ ] **Step 7: Stage and propose a commit**

```bash
git add src/components/chrome
```

Propose: `feat: add PageShell layout component`
Show the user the staged file list and wait for approval.

---

### Task 16: HeroFeature

**Files:**
- Create: `src/components/blocks/HeroFeature.tsx`, `HeroFeature.css`, `HeroFeature.test.tsx`, `HeroFeature.stories.tsx`

**Interfaces:**
- Consumes: `Kicker` (Task 6), `ArrowLink` (Task 7), `FeatureStory` type (Task 4).
- Produces: `HeroFeature({ story }: { story: FeatureStory }): JSX.Element`.

Headline 52px `--leading-tight` `--color-ink`; dek 16px `--leading-prose` `--color-ink-muted` (invisible-text fix). Nodes `44:14`–`44:17`.

- [ ] **Step 1: Write the failing test**

Create `src/components/blocks/HeroFeature.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import HeroFeature from './HeroFeature'
import { HOME } from '../../content/home'

test('renders kicker, headline, dek, and link', () => {
  render(<HeroFeature story={HOME.hero} />)
  expect(screen.getByText("EDITOR'S FEATURE")).toBeInTheDocument()
  expect(
    screen.getByRole('heading', { name: /discontent with content/i }),
  ).toBeInTheDocument()
  expect(screen.getByText(/eight years of shaping/i)).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /continue reading/i })).toHaveAttribute(
    'href',
    HOME.hero.link.href,
  )
})

test('renders the headline at feature scale', () => {
  render(<HeroFeature story={HOME.hero} />)
  expect(screen.getByRole('heading')).toHaveClass('type-feature')
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/components/blocks/HeroFeature.test.tsx`
Expected: FAIL — `Failed to resolve import "./HeroFeature"`.

- [ ] **Step 3: Write the component**

Create `src/components/blocks/HeroFeature.tsx`:

```tsx
import Kicker from '../primitives/Kicker'
import ArrowLink from '../primitives/ArrowLink'
import type { FeatureStory } from '../../content/types'
import './HeroFeature.css'

type HeroFeatureProps = {
  story: FeatureStory
}

export default function HeroFeature({ story }: HeroFeatureProps) {
  return (
    <div className="hero-feature">
      <Kicker>{story.kicker}</Kicker>
      <h1 className="hero-feature__headline type-feature">{story.headline}</h1>
      <p className="hero-feature__dek type-prose">{story.dek}</p>
      <ArrowLink href={story.link.href}>{story.link.label}</ArrowLink>
    </div>
  )
}
```

- [ ] **Step 4: Write the styles**

Create `src/components/blocks/HeroFeature.css`:

```css
/* Nodes 44:14–44:17. The comp's dek is invisible; muted ink here. */

.hero-feature {
  max-width: 42.8125rem; /* 685px, node 44:15 */
}

.hero-feature__headline {
  color: var(--color-ink);
  margin: var(--space-8) 0 0;
}

.hero-feature__dek {
  color: var(--color-ink-muted);
  max-width: 41.25rem; /* 660px, node 44:16 */
  margin: var(--space-10) 0 var(--space-6);
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/components/blocks/HeroFeature.test.tsx`
Expected: PASS, 2 tests.

- [ ] **Step 6: Write the story**

Create `src/components/blocks/HeroFeature.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import HeroFeature from './HeroFeature'
import { HOME } from '../../content/home'

const meta: Meta<typeof HeroFeature> = {
  title: 'Blocks/HeroFeature',
  component: HeroFeature,
  args: { story: HOME.hero },
  decorators: [
    (Story) => (
      <div style={{ background: 'var(--color-surface)', padding: '3.25rem 7.5rem' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof HeroFeature>

export const Default: Story = {}
```

- [ ] **Step 7: Stage and propose a commit**

```bash
git add src/components/blocks
```

Propose: `feat: add HeroFeature block`
Show the user the staged file list and wait for approval.

---

### Task 17: SidebarStory

**Files:**
- Create: `src/components/blocks/SidebarStory.tsx`, `SidebarStory.css`, `SidebarStory.test.tsx`, `SidebarStory.stories.tsx`

**Interfaces:**
- Consumes: `Kicker` (Task 6), `ArrowLink` (Task 7), `Portrait` (Task 8), `SidebarStory` type (Task 4).
- Produces: `SidebarStoryBlock({ story }: { story: SidebarStory }): JSX.Element`, default export.

Kicker at `micro` size (9px). Headline 22px Jomolhari `--leading-serif` `--color-ink`. Dek 13px `--leading-dek` `--color-ink-muted` (invisible-text fix). Nodes `44:19`–`44:23` and `44:25`–`44:28`.

- [ ] **Step 1: Write the failing test**

Create `src/components/blocks/SidebarStory.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import SidebarStoryBlock from './SidebarStory'
import { HOME } from '../../content/home'

test('renders the editor letter with its portrait', () => {
  render(<SidebarStoryBlock story={HOME.editorsLetter} />)
  expect(screen.getByText("EDITOR'S LETTER")).toBeInTheDocument()
  expect(
    screen.getByRole('heading', { name: /why this site exists/i }),
  ).toBeInTheDocument()
  expect(screen.getByAltText(/joshua bondoc/i)).toBeInTheDocument()
})

test('renders featured work without a portrait', () => {
  render(<SidebarStoryBlock story={HOME.featuredWork} />)
  expect(screen.getByText('FEATURED WORK')).toBeInTheDocument()
  expect(screen.queryByRole('img')).toBeNull()
})

test('uses the micro kicker size', () => {
  render(<SidebarStoryBlock story={HOME.featuredWork} />)
  expect(screen.getByText('FEATURED WORK')).toHaveClass('kicker--micro')
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/components/blocks/SidebarStory.test.tsx`
Expected: FAIL — `Failed to resolve import "./SidebarStory"`.

- [ ] **Step 3: Write the component**

Create `src/components/blocks/SidebarStory.tsx`:

```tsx
import Kicker from '../primitives/Kicker'
import ArrowLink from '../primitives/ArrowLink'
import Portrait from '../primitives/Portrait'
import type { SidebarStory } from '../../content/types'
import './SidebarStory.css'

type SidebarStoryProps = {
  story: SidebarStory
}

/*
 * Editor's Letter and Featured Work are the same block. The portrait is the
 * only structural difference, so it is an optional prop rather than a second
 * near-identical component.
 */
export default function SidebarStoryBlock({ story }: SidebarStoryProps) {
  return (
    <article className="sidebar-story">
      <Kicker size="micro">{story.kicker}</Kicker>
      <div className="sidebar-story__body">
        {story.portrait && (
          <Portrait src={story.portrait.src} alt={story.portrait.alt} />
        )}
        <div className="sidebar-story__text">
          <h2 className="sidebar-story__headline type-serif">
            {story.headline}
          </h2>
          <p className="sidebar-story__dek">{story.dek}</p>
          <ArrowLink href={story.link.href}>{story.link.label}</ArrowLink>
        </div>
      </div>
    </article>
  )
}
```

- [ ] **Step 4: Write the styles**

Create `src/components/blocks/SidebarStory.css`:

```css
/* Nodes 44:19–44:23 and 44:25–44:28. The comp's deks are invisible. */

.sidebar-story__body {
  display: flex;
  gap: var(--space-8);
  margin-top: var(--space-4);
}

.sidebar-story__text {
  flex: 1;
}

.sidebar-story__headline {
  color: var(--color-ink);
  line-height: var(--leading-serif);
  margin: 0;
}

.sidebar-story__dek {
  color: var(--color-ink-muted);
  font-family: var(--font-sans);
  font-weight: var(--weight-body);
  font-size: var(--text-dek);
  line-height: var(--leading-dek);
  margin: var(--space-3) 0 var(--space-4);
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/components/blocks/SidebarStory.test.tsx`
Expected: PASS, 3 tests.

- [ ] **Step 6: Write the story**

Create `src/components/blocks/SidebarStory.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import SidebarStoryBlock from './SidebarStory'
import { HOME } from '../../content/home'

const meta: Meta<typeof SidebarStoryBlock> = {
  title: 'Blocks/SidebarStory',
  component: SidebarStoryBlock,
  decorators: [
    (Story) => (
      <div
        style={{
          background: 'var(--color-surface)',
          padding: '3.25rem',
          maxWidth: '34.5rem',
        }}
      >
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof SidebarStoryBlock>

export const EditorsLetter: Story = { args: { story: HOME.editorsLetter } }
export const FeaturedWork: Story = { args: { story: HOME.featuredWork } }
```

- [ ] **Step 7: Stage and propose a commit**

```bash
git add src/components/blocks
```

Propose: `feat: add SidebarStory block`
Show the user the staged file list and wait for approval.

---

### Task 18: StoryCard and StoryGrid

**Files:**
- Create: `src/components/blocks/StoryCard.tsx`, `StoryCard.css`, `StoryCard.test.tsx`, `StoryCard.stories.tsx`, `StoryGrid.tsx`, `StoryGrid.css`, `StoryGrid.test.tsx`, `StoryGrid.stories.tsx`

**Interfaces:**
- Consumes: `Kicker` (Task 6), `Story` type (Task 4).
- Produces: `StoryCard({ story }: { story: Story })` and `StoryGrid({ stories }: { stories: Story[] })`.

Kicker at `kicker` size (10px). Headline 18px Archivo Black `--leading-card` `--color-ink`. Meta 11px Barlow Light `--tracking-tight` `--color-ink-muted` (invisible-text fix). 2.5px ink top rule. Nodes `44:34`–`44:48`.

These ship together because the vertical dividers belong to the grid, not the card — the first card has no rule to its left, so the card cannot own it.

- [ ] **Step 1: Write the failing tests**

Create `src/components/blocks/StoryCard.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import StoryCard from './StoryCard'
import { HOME } from '../../content/home'

test('renders kicker, headline, and meta', () => {
  render(<StoryCard story={HOME.stories[0]} />)
  expect(screen.getByText('CASE STUDY')).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: /study\.com versus vibal/i })).toBeInTheDocument()
  expect(screen.getByText('Content operations · 2024–present')).toBeInTheDocument()
})

test('links the headline to the story', () => {
  render(<StoryCard story={HOME.stories[1]} />)
  expect(screen.getByRole('link')).toHaveAttribute('href', HOME.stories[1].href)
})

test('uses the 10px kicker size', () => {
  render(<StoryCard story={HOME.stories[0]} />)
  expect(screen.getByText('CASE STUDY')).toHaveClass('kicker--kicker')
})
```

Create `src/components/blocks/StoryGrid.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import StoryGrid from './StoryGrid'
import { HOME } from '../../content/home'

test('renders one card per story', () => {
  render(<StoryGrid stories={HOME.stories} />)
  expect(screen.getAllByRole('article')).toHaveLength(3)
})

test('renders nothing when given no stories', () => {
  const { container } = render(<StoryGrid stories={[]} />)
  expect(container.querySelectorAll('.story-card')).toHaveLength(0)
})
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run src/components/blocks/StoryCard.test.tsx src/components/blocks/StoryGrid.test.tsx`
Expected: FAIL — both cannot resolve their imports.

- [ ] **Step 3: Write StoryCard**

Create `src/components/blocks/StoryCard.tsx`:

```tsx
import Kicker from '../primitives/Kicker'
import type { Story } from '../../content/types'
import './StoryCard.css'

type StoryCardProps = {
  story: Story
}

export default function StoryCard({ story }: StoryCardProps) {
  return (
    <article className="story-card">
      <Kicker size="kicker">{story.kicker}</Kicker>
      <h2 className="story-card__headline type-card">
        <a className="story-card__link" href={story.href}>
          {story.headline}
        </a>
      </h2>
      <p className="story-card__meta label-meta label-meta--light">
        {story.meta}
      </p>
    </article>
  )
}
```

Create `src/components/blocks/StoryCard.css`:

```css
/* Nodes 44:35–44:38. The comp's meta line is invisible; muted ink here. */

.story-card {
  border-top: var(--rule-width-thick) solid var(--color-ink);
  padding: var(--space-8) var(--space-8) 0;
}

.story-card__headline {
  font-size: var(--text-card);
  line-height: var(--leading-card);
  color: var(--color-ink);
  margin: var(--space-3) 0 var(--space-6);
}

.story-card__link {
  text-decoration: none;
}

.story-card__meta {
  color: var(--color-ink-muted);
  letter-spacing: var(--tracking-tight);
  text-transform: none;
  margin: 0;
}
```

- [ ] **Step 4: Write StoryGrid**

Create `src/components/blocks/StoryGrid.tsx`:

```tsx
import StoryCard from './StoryCard'
import type { Story } from '../../content/types'
import './StoryGrid.css'

type StoryGridProps = {
  stories: Story[]
}

/*
 * The vertical hairlines belong to the row, not the card — the first card has
 * no rule to its left — so the grid owns them.
 */
export default function StoryGrid({ stories }: StoryGridProps) {
  return (
    <div className="story-grid">
      {stories.map((story) => (
        <StoryCard key={story.href} story={story} />
      ))}
    </div>
  )
}
```

Create `src/components/blocks/StoryGrid.css`:

```css
/* Node 44:34. Three 400px columns at the page gutter. */

.story-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  background-color: var(--color-surface);
  padding-inline: var(--page-gutter);
  padding-bottom: var(--space-10);
}

.story-grid > * + * {
  border-left: var(--rule-width) solid var(--color-rule);
}
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npx vitest run src/components/blocks/StoryCard.test.tsx src/components/blocks/StoryGrid.test.tsx`
Expected: PASS, 5 tests.

- [ ] **Step 6: Write the stories**

Create `src/components/blocks/StoryCard.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import StoryCard from './StoryCard'
import { HOME } from '../../content/home'

const meta: Meta<typeof StoryCard> = {
  title: 'Blocks/StoryCard',
  component: StoryCard,
  args: { story: HOME.stories[0] },
  decorators: [
    (Story) => (
      <div style={{ background: 'var(--color-surface)', maxWidth: '25rem' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof StoryCard>

export const CaseStudy: Story = {}
export const Column: Story = { args: { story: HOME.stories[1] } }
```

Create `src/components/blocks/StoryGrid.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import StoryGrid from './StoryGrid'
import { HOME } from '../../content/home'

const meta: Meta<typeof StoryGrid> = {
  title: 'Blocks/StoryGrid',
  component: StoryGrid,
  args: { stories: HOME.stories },
}

export default meta
type Story = StoryObj<typeof StoryGrid>

export const ThreeUp: Story = {}
```

- [ ] **Step 7: Stage and propose a commit**

```bash
git add src/components/blocks
```

Propose: `feat: add StoryCard and StoryGrid blocks`
Show the user the staged file list and wait for approval.

---

### Task 19: ArticleHeader

**Files:**
- Create: `src/components/blocks/ArticleHeader.tsx`, `ArticleHeader.css`, `ArticleHeader.test.tsx`, `ArticleHeader.stories.tsx`

**Interfaces:**
- Consumes: `Kicker` (Task 6), `Article` type (Task 4).
- Produces: `ArticleHeader({ article }: { article: Article }): JSX.Element`.

Kicker coral at `meta` size. Headline **46px** (`--text-headline`, not `--text-feature`) `--leading-tight` `--color-ink`. Byline 13px `.type-dek` `--color-ink-muted` (invisible-text fix), mixed case — not a label. Closing hairline 760px. Nodes `40:14`–`40:17`.

- [ ] **Step 1: Write the failing test**

Create `src/components/blocks/ArticleHeader.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import ArticleHeader from './ArticleHeader'
import { getArticle } from '../../content/articles'

const article = getArticle('building-compliance-in-a-sea-of-digital-assets')!

test('renders kicker, headline, and byline', () => {
  render(<ArticleHeader article={article} />)
  expect(screen.getByText('CASE STUDY')).toBeInTheDocument()
  expect(
    screen.getByRole('heading', { name: 'Building compliance in a sea of digital assets' }),
  ).toBeInTheDocument()
  expect(screen.getByText(/12 min read/)).toBeInTheDocument()
})

test('uses the coral kicker and the 46px headline scale', () => {
  render(<ArticleHeader article={article} />)
  expect(screen.getByText('CASE STUDY')).toHaveClass('kicker--coral')
  expect(screen.getByRole('heading')).toHaveClass('article-header__headline')
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/components/blocks/ArticleHeader.test.tsx`
Expected: FAIL — `Failed to resolve import "./ArticleHeader"`.

- [ ] **Step 3: Write the component**

Create `src/components/blocks/ArticleHeader.tsx`:

```tsx
import Kicker from '../primitives/Kicker'
import type { Article } from '../../content/types'
import './ArticleHeader.css'

type ArticleHeaderProps = {
  article: Article
}

export default function ArticleHeader({ article }: ArticleHeaderProps) {
  return (
    <header className="article-header">
      <Kicker tone="coral">{article.kicker}</Kicker>
      <h1 className="article-header__headline">{article.headline}</h1>
      <p className="article-header__byline type-dek">{article.byline}</p>
      <hr className="rule article-header__rule" />
    </header>
  )
}
```

- [ ] **Step 4: Write the styles**

Create `src/components/blocks/ArticleHeader.css`:

```css
/*
 * Nodes 40:14–40:17. The article headline is 46px, not the homepage's 52px,
 * so this does not use .type-feature. The comp's byline is invisible.
 */

.article-header__headline {
  font-family: var(--font-display);
  font-weight: var(--weight-display);
  font-size: var(--text-headline);
  line-height: var(--leading-tight);
  color: var(--color-ink);
  max-width: 47.5rem; /* 760px */
  margin: var(--space-8) 0 0;
}

.article-header__byline {
  color: var(--color-ink-muted);
  margin: var(--space-10) 0 0;
}

.article-header__rule {
  max-width: 47.5rem; /* 760px, node 40:17 */
  margin-top: var(--space-6);
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/components/blocks/ArticleHeader.test.tsx`
Expected: PASS, 2 tests.

- [ ] **Step 6: Write the story**

Create `src/components/blocks/ArticleHeader.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import ArticleHeader from './ArticleHeader'
import { getArticle } from '../../content/articles'

const meta: Meta<typeof ArticleHeader> = {
  title: 'Blocks/ArticleHeader',
  component: ArticleHeader,
  args: {
    article: getArticle('building-compliance-in-a-sea-of-digital-assets')!,
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '2rem 7.5rem' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ArticleHeader>

export const CaseStudy: Story = {}
```

- [ ] **Step 7: Stage and propose a commit**

```bash
git add src/components/blocks
```

Propose: `feat: add ArticleHeader block`
Show the user the staged file list and wait for approval.

---

### Task 20: ArticleSection

**Files:**
- Create: `src/components/blocks/ArticleSection.tsx`, `ArticleSection.css`, `ArticleSection.test.tsx`, `ArticleSection.stories.tsx`

**Interfaces:**
- Consumes: `ArticleSection` type (Task 4).
- Produces: `ArticleSectionBlock({ section }: { section: ArticleSection }): JSX.Element`, default export.

Heading **20px** Archivo Black (`--text-section`). Body 16px `.type-prose` `--leading-prose` `--color-ink`, 680px measure. Nodes `40:18`–`40:23`.

- [ ] **Step 1: Write the failing test**

Create `src/components/blocks/ArticleSection.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import ArticleSectionBlock from './ArticleSection'

const section = {
  heading: 'What shipped',
  paragraphs: ['First paragraph.', 'Second paragraph.'],
}

test('renders the heading and every paragraph', () => {
  render(<ArticleSectionBlock section={section} />)
  expect(screen.getByRole('heading', { name: 'What shipped' })).toBeInTheDocument()
  expect(screen.getByText('First paragraph.')).toBeInTheDocument()
  expect(screen.getByText('Second paragraph.')).toBeInTheDocument()
})

test('sets the prose measure on paragraphs', () => {
  render(<ArticleSectionBlock section={section} />)
  expect(screen.getByText('First paragraph.')).toHaveClass('type-prose')
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/components/blocks/ArticleSection.test.tsx`
Expected: FAIL — `Failed to resolve import "./ArticleSection"`.

- [ ] **Step 3: Write the component**

Create `src/components/blocks/ArticleSection.tsx`:

```tsx
import type { ArticleSection } from '../../content/types'
import './ArticleSection.css'

type ArticleSectionProps = {
  section: ArticleSection
}

export default function ArticleSectionBlock({ section }: ArticleSectionProps) {
  return (
    <section className="article-section">
      <h2 className="article-section__heading">{section.heading}</h2>
      {section.paragraphs.map((paragraph) => (
        <p key={paragraph} className="article-section__body type-prose">
          {paragraph}
        </p>
      ))}
    </section>
  )
}
```

- [ ] **Step 4: Write the styles**

Create `src/components/blocks/ArticleSection.css`:

```css
/* Nodes 40:18–40:23. Section headings are 20px, not the 18px card scale. */

.article-section + .article-section {
  margin-top: var(--space-10);
}

.article-section__heading {
  font-family: var(--font-display);
  font-weight: var(--weight-display);
  font-size: var(--text-section);
  line-height: var(--leading-snug);
  color: var(--color-ink);
  margin: 0 0 var(--space-4);
}

.article-section__body {
  color: var(--color-ink);
  max-width: 42.5rem; /* 680px */
  margin: 0 0 var(--space-4);
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/components/blocks/ArticleSection.test.tsx`
Expected: PASS, 2 tests.

- [ ] **Step 6: Write the story**

Create `src/components/blocks/ArticleSection.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import ArticleSectionBlock from './ArticleSection'
import { getArticle } from '../../content/articles'

const article = getArticle('building-compliance-in-a-sea-of-digital-assets')!

const meta: Meta<typeof ArticleSectionBlock> = {
  title: 'Blocks/ArticleSection',
  component: ArticleSectionBlock,
  args: { section: article.sections[0] },
  decorators: [
    (Story) => (
      <div style={{ padding: '2rem 7.5rem' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ArticleSectionBlock>

export const Single: Story = {}

export const AllThree: Story = {
  render: () => (
    <div style={{ padding: '2rem 7.5rem' }}>
      {article.sections.map((section) => (
        <ArticleSectionBlock key={section.heading} section={section} />
      ))}
    </div>
  ),
}
```

- [ ] **Step 7: Stage and propose a commit**

```bash
git add src/components/blocks
```

Propose: `feat: add ArticleSection block`
Show the user the staged file list and wait for approval.

---

### Task 21: RelatedLink

**Files:**
- Create: `src/components/blocks/RelatedLink.tsx`, `RelatedLink.css`, `RelatedLink.test.tsx`, `RelatedLink.stories.tsx`

**Interfaces:**
- Consumes: `Kicker` (Task 6), `ArrowLink` (Task 7), `LinkRef` type (Task 4).
- Produces: `RelatedLink({ related }: { related: LinkRef }): JSX.Element`.

Strong hairline above (`--color-rule-strong`), coral kicker at `kicker` size (10px), then an `ArrowLink` in `card` emphasis. Nodes `40:26`–`40:28`.

- [ ] **Step 1: Write the failing test**

Create `src/components/blocks/RelatedLink.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import RelatedLink from './RelatedLink'

const related = { label: 'Study.com: scaling a team', href: '/features/studycom' }

test('renders the RELATED kicker and the link', () => {
  render(<RelatedLink related={related} />)
  expect(screen.getByText('RELATED')).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /study\.com/i })).toHaveAttribute(
    'href',
    '/features/studycom',
  )
})

test('uses the card emphasis and a strong rule', () => {
  const { container } = render(<RelatedLink related={related} />)
  expect(screen.getByRole('link')).toHaveClass('arrow-link--card')
  expect(container.querySelector('.rule--strong')).not.toBeNull()
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/components/blocks/RelatedLink.test.tsx`
Expected: FAIL — `Failed to resolve import "./RelatedLink"`.

- [ ] **Step 3: Write the component**

Create `src/components/blocks/RelatedLink.tsx`:

```tsx
import Kicker from '../primitives/Kicker'
import ArrowLink from '../primitives/ArrowLink'
import type { LinkRef } from '../../content/types'
import './RelatedLink.css'

type RelatedLinkProps = {
  related: LinkRef
}

export default function RelatedLink({ related }: RelatedLinkProps) {
  return (
    <div className="related-link">
      <hr className="rule rule--strong" />
      <Kicker tone="coral" size="kicker">
        RELATED
      </Kicker>
      <div className="related-link__target">
        <ArrowLink href={related.href} emphasis="card">
          {related.label}
        </ArrowLink>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Write the styles**

Create `src/components/blocks/RelatedLink.css`:

```css
/* Nodes 40:26–40:28. */

.related-link {
  max-width: 23.75rem; /* 380px */
}

.related-link .kicker {
  margin-top: var(--space-6);
}

.related-link__target {
  margin-top: var(--space-2);
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/components/blocks/RelatedLink.test.tsx`
Expected: PASS, 2 tests.

- [ ] **Step 6: Write the story**

Create `src/components/blocks/RelatedLink.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import RelatedLink from './RelatedLink'
import { getArticle } from '../../content/articles'

const meta: Meta<typeof RelatedLink> = {
  title: 'Blocks/RelatedLink',
  component: RelatedLink,
  args: {
    related: getArticle('building-compliance-in-a-sea-of-digital-assets')!
      .related,
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '2rem' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof RelatedLink>

export const Default: Story = {}
```

- [ ] **Step 7: Stage and propose a commit**

```bash
git add src/components/blocks
```

Propose: `feat: add RelatedLink block`
Show the user the staged file list and wait for approval.

---

### Task 22: Verify the phase and update the spec

**Files:**
- Modify: `docs/superpowers/specs/2026-07-25-react-components-design.md`, `MASTER TODO.md`

**Interfaces:**
- Consumes: everything above.

- [ ] **Step 1: Run the full test suite**

Run: `npm run test:run`
Expected: PASS across every test file added in Tasks 1–21, no failures.

- [ ] **Step 2: Run the build and linter**

Run: `npm run build` then `npm run lint`
Expected: both pass with no errors.

- [ ] **Step 3: Verify the no-hex-literals rule**

Run:

```bash
grep -rEn "#[0-9a-fA-F]{3,8}\b" src/ --include=*.css --include=*.tsx --include=*.ts
```

Expected: matches only in `src/styles/tokens.css`. `.storybook/preview.ts` also carries two literals by necessity, but it is outside `src/` and is documented as an exception in Step 6.

- [ ] **Step 4: Review every component in Storybook**

Run: `npm run storybook`

Open each story and compare against the Figma screenshots for `44:2` and `40:2`. Confirm specifically:
- All three webfonts render (Archivo Black, Jomolhari, Barlow).
- Every previously-invisible element is now legible: nav links, all three meta bar slots, hero dek, both sidebar deks, all three story card meta lines, article byline.
- The article headline is visibly smaller than the homepage hero headline (46px vs 52px).
- Story card top rules are thick ink; the grid's vertical dividers are faint hairlines.
- No console errors in any story.

- [ ] **Step 5: Confirm the StyleGuide still works**

Run: `npm run dev` and open `localhost:5173`.
Expected: the StyleGuide renders as before. It was not given a components section — Storybook took that role — so it should be byte-identical in behaviour to phase 1.

- [ ] **Step 6: Update the spec**

In `docs/superpowers/specs/2026-07-25-react-components-design.md`:

- Change **Status** to `Implemented`.
- Replace the **Verification** section's first paragraph: the kit is verified in Storybook, not an extended StyleGuide. The StyleGuide keeps its phase-1 scope.
- Add a **Deviations from the comps** section recording, with node ids: the twelve invisible-text fixes and their tokens; the three snapped colors (`#f55f51`→`--color-accent`, `#1f332b`→`--color-deep-forest`, `#1e1e1e`→`--color-ink`); the eight added size tokens; and the two hex literals in `.storybook/preview.ts`.
- Correct **Assumption 3**: the homepage nav is not clipped by the 1519px frame. Its links are set to the surface color and are invisible. Replace the assumption with this finding.
- Note that node `44:42` spells "Surboards", reproduced verbatim in `src/content/home.ts`.

- [ ] **Step 7: Tick the phase off**

In `MASTER TODO.md`, change line 3 to:

```
[x] 3. React components — docs/superpowers/specs/2026-07-25-react-components-design.md
```

- [ ] **Step 8: Stage and propose a commit**

```bash
git add docs "MASTER TODO.md"
```

Propose: `docs: mark phase 2 implemented and record comp deviations`
Show the user the staged file list and wait for approval.

- [ ] **Step 9: Report the Figma defects**

Tell the user which nodes need fixing in Figma so design and code can reconverge:
- Invisible text: `44:5–7`, `44:10–12`, `44:16`, `44:22`, `44:27`, `44:38`, `44:43`, `44:48`, `40:6–8`, `40:11–13`, `40:16`
- Two corals: `#f55f51` on the wordmarks vs `#ee6352` on the article kickers
- Inconsistent rule opacity: 14% on the homepage, 30% on the article sidebar
- "Surboards" typo: `44:42`

---

## Self-Review

**Spec coverage.** All fourteen components in the spec's inventory have a task: chrome (11–15), primitives (6–10), blocks (16–21). The content module is Tasks 4–5, the portrait asset is Task 5 Step 1, the rule utilities are Task 3 Step 5. The spec's verification criteria are Task 22 Steps 1–5.

**Spec amendments.** Two spec statements are overridden by decisions made after it was written, and Task 22 Step 6 records both: Storybook replaces the extended StyleGuide as the verification surface, and Assumption 3's explanation of the clipped nav was wrong.

**Type consistency.** `SidebarStory` is both a type in `types.ts` and a component; the component's default export is named `SidebarStoryBlock` to avoid the collision, and Tasks 17's test and story both import it under that name. The same applies to `ArticleSection` / `ArticleSectionBlock` in Task 20. `Kicker`'s `size` values (`micro` / `kicker` / `meta`) are used consistently: `micro` in Task 17, `kicker` in Tasks 18 and 21, the `meta` default in Tasks 16 and 19. `ArrowLink`'s `emphasis` values (`meta` / `card`) are used in Tasks 16, 17 (default) and 21 (`card`).

**Known soft spot.** Exact vertical spacing between blocks is deliberately not pinned here. The comps position everything absolutely, and translating those coordinates into flow layout is phase 3's job. Task-level margins are a reasonable starting rhythm, not a match to the comp's pixel offsets.
