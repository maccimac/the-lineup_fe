import { render, screen } from '@testing-library/react'
import ArticleSectionBlock from './ArticleSection'

const section = {
  heading: 'What shipped',
  paragraphs: ['First paragraph.', 'Second paragraph.'],
}

test('renders the heading and every paragraph', () => {
  render(<ArticleSectionBlock section={section} />)
  expect(screen.getByRole('heading', { name: 'What shipped' })).toBeInTheDocument()
  expect(screen.getByText('First paragraph.')).toBeInTheDocument()
  expect(screen.getByText('Second paragraph.')).toBeInTheDocument()
})

test('sets the prose measure on paragraphs', () => {
  render(<ArticleSectionBlock section={section} />)
  expect(screen.getByText('First paragraph.')).toHaveClass('type-prose')
})
