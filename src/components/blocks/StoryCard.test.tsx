import { render, screen } from '@testing-library/react'
import StoryCard from './StoryCard'
import { HOME } from '../../content/home'

test('renders kicker, headline, and meta', () => {
  render(<StoryCard story={HOME.stories[0]} />)
  expect(screen.getByText('CASE STUDY')).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: /study\.com versus vibal/i })).toBeInTheDocument()
  expect(screen.getByText('Content operations · 2024–present')).toBeInTheDocument()
})

test('links the headline to the story', () => {
  render(<StoryCard story={HOME.stories[1]} />)
  expect(screen.getByRole('link')).toHaveAttribute('href', HOME.stories[1].href)
})

test('uses the 10px kicker size', () => {
  render(<StoryCard story={HOME.stories[0]} />)
  expect(screen.getByText('CASE STUDY')).toHaveClass('kicker--kicker')
})
