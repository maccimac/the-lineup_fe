import { render, screen } from '@testing-library/react'
import Wordmark from './Wordmark'

test('renders the site name', () => {
  render(<Wordmark size="nav" />)
  expect(screen.getByText('THE LINEUP')).toBeInTheDocument()
})

test('applies the size variant', () => {
  render(<Wordmark size="footer" />)
  expect(screen.getByText('THE LINEUP')).toHaveClass('wordmark--footer')
})
