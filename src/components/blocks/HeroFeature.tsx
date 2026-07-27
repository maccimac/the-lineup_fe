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
