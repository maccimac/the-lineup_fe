import { render, screen } from '@testing-library/react'
import ArrowLink from './ArrowLink'

test('renders an anchor to the href', () => {
  render(<ArrowLink href="/features">Continue reading</ArrowLink>)
  expect(screen.getByRole('link', { name: /continue reading/i })).toHaveAttribute(
    'href',
    '/features',
  )
})

test('appends an arrow that screen readers skip', () => {
  render(<ArrowLink href="/x">About Joshua</ArrowLink>)
  const link = screen.getByRole('link')
  expect(link).toHaveTextContent('About Joshua →')
  expect(link.querySelector('[aria-hidden="true"]')).not.toBeNull()
})

test('defaults to meta emphasis', () => {
  render(<ArrowLink href="/x">Read</ArrowLink>)
  expect(screen.getByRole('link')).toHaveClass('arrow-link--meta')
})

test('honours card emphasis', () => {
  render(
    <ArrowLink href="/x" emphasis="card">
      Study.com
    </ArrowLink>,
  )
  expect(screen.getByRole('link')).toHaveClass('arrow-link--card')
})
