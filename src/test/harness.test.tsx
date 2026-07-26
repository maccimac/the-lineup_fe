import { render, screen } from '@testing-library/react'

/*
 * Proves the harness itself: JSX compiles, jsdom provides a DOM, Testing
 * Library queries it, and the jest-dom matchers from setup.ts are registered.
 * Every later task's tests depend on all four.
 */
function Probe() {
  return <p className="probe">harness online</p>
}

test('renders a component and exposes jest-dom matchers', () => {
  render(<Probe />)
  const el = screen.getByText('harness online')
  expect(el).toBeInTheDocument()
  expect(el).toHaveClass('probe')
})
