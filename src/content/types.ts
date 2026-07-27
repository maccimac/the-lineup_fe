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

/** The homepage's full content payload — everything HomeTemplate needs. */
export type HomeContent = {
  hero: FeatureStory
  editorsLetter: SidebarStory
  featuredWork: SidebarStory
  pitchQuote: string
  stories: Story[]
  metaBarCenter: string
}
