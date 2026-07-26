import { render, screen } from '@testing-library/react'
import Kicker from './Kicker'

test('renders its children', () => {
  render(<Kicker>Editor's Feature</Kicker>)
  expect(screen.getByText("Editor's Feature")).toBeInTheDocument()
})

test('defaults to the forest tone at meta size', () => {
  render(<Kicker>Case Study</Kicker>)
  const el = screen.getByText('Case Study')
  expect(el).toHaveClass('kicker--forest')
  expect(el).toHaveClass('kicker--meta')
})

test('honours an explicit tone and size', () => {
  render(
    <Kicker tone="coral" size="micro">
      Related
    </Kicker>,
  )
  const el = screen.getByText('Related')
  expect(el).toHaveClass('kicker--coral')
  expect(el).toHaveClass('kicker--micro')
  expect(el).not.toHaveClass('kicker--forest')
})
