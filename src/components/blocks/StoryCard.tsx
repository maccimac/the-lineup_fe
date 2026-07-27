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
