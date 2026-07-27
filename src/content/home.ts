import type { FeatureStory, HomeContent, SidebarStory, Story } from './types'
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

export const HOME: HomeContent = {
  hero,
  editorsLetter,
  featuredWork,
  pitchQuote,
  stories,
  metaBarCenter: 'CONTENT · SUSTAINABILITY · BOARD SPORTS',
}
