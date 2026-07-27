import { render, screen } from '@testing-library/react'
import SiteFooter from './SiteFooter'

test('renders the wordmark, byline, and contact', () => {
  render(<SiteFooter />)
  expect(screen.getByText('THE LINEUP')).toBeInTheDocument()
  expect(
    screen.getByText('Joshua Kevin R. Bondoc · Editor & Content Manager'),
  ).toBeInTheDocument()
  expect(
    screen.getByText('joshua.kevin.bondoc@gmail.com · Vancouver, BC'),
  ).toBeInTheDocument()
})

test('renders as a contentinfo landmark', () => {
  render(<SiteFooter />)
  expect(screen.getByRole('contentinfo')).toHaveClass('site-footer')
})
