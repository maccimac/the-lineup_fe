import StoryCard from './StoryCard'
import type { Story } from '../../content/types'
import './StoryGrid.css'

type StoryGridProps = {
  stories: Story[]
}

/*
 * The vertical hairlines belong to the row, not the card — the first card has
 * no rule to its left — so the grid owns them.
 */
export default function StoryGrid({ stories }: StoryGridProps) {
  return (
    <div className="story-grid">
      {stories.map((story) => (
        <StoryCard key={story.href} story={story} />
      ))}
    </div>
  )
}
