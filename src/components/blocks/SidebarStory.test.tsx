import { render, screen } from '@testing-library/react'
import SidebarStoryBlock from './SidebarStory'
import { HOME } from '../../content/home'

test('renders the editor letter with its portrait', () => {
  render(<SidebarStoryBlock story={HOME.editorsLetter} />)
  expect(screen.getByText("EDITOR'S LETTER")).toBeInTheDocument()
  expect(
    screen.getByRole('heading', { name: /why this site exists/i }),
  ).toBeInTheDocument()
  expect(screen.getByAltText(/joshua bondoc/i)).toBeInTheDocument()
})

test('renders featured work without a portrait', () => {
  render(<SidebarStoryBlock story={HOME.featuredWork} />)
  expect(screen.getByText('FEATURED WORK')).toBeInTheDocument()
  expect(screen.queryByRole('img')).toBeNull()
})

test('uses the micro kicker size', () => {
  render(<SidebarStoryBlock story={HOME.featuredWork} />)
  expect(screen.getByText('FEATURED WORK')).toHaveClass('kicker--micro')
})
