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
