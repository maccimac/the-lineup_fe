import { render, screen } from '@testing-library/react'
import Portrait from './Portrait'

test('renders the image with its alt text', () => {
  render(<Portrait src="/joshua.png" alt="Joshua Bondoc" />)
  const img = screen.getByAltText('Joshua Bondoc')
  expect(img).toHaveAttribute('src', '/joshua.png')
})

test('carries the circular frame class', () => {
  render(<Portrait src="/joshua.png" alt="Joshua Bondoc" />)
  expect(screen.getByAltText('Joshua Bondoc').parentElement).toHaveClass(
    'portrait',
  )
})
