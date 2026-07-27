import { render, screen } from '@testing-library/react'
import Band from './Band'

test('renders its children inside a section', () => {
  render(<Band tone="forest">Pitch</Band>)
  const section = screen.getByText('Pitch').closest('section')
  expect(section).toHaveClass('band--forest')
})

test('constrains content in an inner wrapper', () => {
  const { container } = render(<Band tone="surface">Content</Band>)
  expect(container.querySelector('.band__inner')).not.toBeNull()
})
