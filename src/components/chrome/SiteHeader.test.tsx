import { render, screen } from '@testing-library/react'
import SiteHeader from './SiteHeader'

test('renders the wordmark and all four nav links', () => {
  render(<SiteHeader />)
  expect(screen.getByText('THE LINEUP')).toBeInTheDocument()
  expect(screen.getAllByRole('link')).toHaveLength(5) // 4 nav + wordmark home link
})

test('marks no link active by default', () => {
  const { container } = render(<SiteHeader />)
  expect(container.querySelectorAll('.site-header__link--active')).toHaveLength(0)
})

test('marks the matching link active', () => {
  render(<SiteHeader activeHref="/features" />)
  expect(screen.getByRole('link', { name: 'FEATURES' })).toHaveClass(
    'site-header__link--active',
  )
})
