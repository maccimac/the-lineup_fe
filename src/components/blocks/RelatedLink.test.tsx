import { render, screen } from '@testing-library/react'
import RelatedLink from './RelatedLink'

const related = { label: 'Study.com: scaling a team', href: '/features/studycom' }

test('renders the RELATED kicker and the link', () => {
  render(<RelatedLink related={related} />)
  expect(screen.getByText('RELATED')).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /study\.com/i })).toHaveAttribute(
    'href',
    '/features/studycom',
  )
})

test('uses the card emphasis and a strong rule', () => {
  const { container } = render(<RelatedLink related={related} />)
  expect(screen.getByRole('link')).toHaveClass('arrow-link--card')
  expect(container.querySelector('.rule--strong')).not.toBeNull()
})
