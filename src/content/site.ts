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
