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
