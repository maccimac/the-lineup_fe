import { render, screen } from '@testing-library/react'
import StoryGrid from './StoryGrid'
import { HOME } from '../../content/home'

test('renders one card per story', () => {
  render(<StoryGrid stories={HOME.stories} />)
  expect(screen.getAllByRole('article')).toHaveLength(3)
})

test('renders nothing when given no stories', () => {
  const { container } = render(<StoryGrid stories={[]} />)
  expect(container.querySelectorAll('.story-card')).toHaveLength(0)
})
