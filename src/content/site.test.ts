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
