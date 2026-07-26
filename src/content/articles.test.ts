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
