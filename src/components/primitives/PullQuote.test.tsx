import { render, screen } from '@testing-library/react'
import PullQuote from './PullQuote'

test('renders as a blockquote', () => {
  const { container } = render(
    <PullQuote variant="sidebar">Only as trustworthy as its slowest step.</PullQuote>,
  )
  expect(container.querySelector('blockquote')).not.toBeNull()
  expect(
    screen.getByText('Only as trustworthy as its slowest step.'),
  ).toBeInTheDocument()
})

test('applies the band variant class', () => {
  const { container } = render(<PullQuote variant="band">Quote</PullQuote>)
  expect(container.querySelector('blockquote')).toHaveClass('pull-quote--band')
})

test('applies the sidebar variant class', () => {
  const { container } = render(<PullQuote variant="sidebar">Quote</PullQuote>)
  expect(container.querySelector('blockquote')).toHaveClass(
    'pull-quote--sidebar',
  )
})
