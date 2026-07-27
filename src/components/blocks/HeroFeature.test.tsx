import { render, screen } from '@testing-library/react'
import HeroFeature from './HeroFeature'
import { HOME } from '../../content/home'

test('renders kicker, headline, dek, and link', () => {
  render(<HeroFeature story={HOME.hero} />)
  expect(screen.getByText("EDITOR'S FEATURE")).toBeInTheDocument()
  expect(
    screen.getByRole('heading', { name: /discontent with content/i }),
  ).toBeInTheDocument()
  expect(screen.getByText(/eight years of shaping/i)).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /continue reading/i })).toHaveAttribute(
    'href',
    HOME.hero.link.href,
  )
})

test('renders the headline at feature scale', () => {
  render(<HeroFeature story={HOME.hero} />)
  expect(screen.getByRole('heading')).toHaveClass('type-feature')
})
