import { render, screen } from '@testing-library/react'
import PageShell from './PageShell'

test('renders header, meta bar, main, and footer', () => {
  render(
    <PageShell metaBarCenter="TAGLINE">
      <p>Page body</p>
    </PageShell>,
  )
  expect(screen.getByRole('banner')).toBeInTheDocument()
  expect(screen.getByText('TAGLINE')).toBeInTheDocument()
  expect(screen.getByRole('main')).toHaveTextContent('Page body')
  expect(screen.getByRole('contentinfo')).toBeInTheDocument()
})

test('passes the active href through to the nav', () => {
  render(
    <PageShell metaBarCenter="X" activeHref="/features">
      <p>Body</p>
    </PageShell>,
  )
  expect(screen.getByRole('link', { name: 'FEATURES' })).toHaveClass(
    'site-header__link--active',
  )
})
