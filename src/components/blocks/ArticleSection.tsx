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
