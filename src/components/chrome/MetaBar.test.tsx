import { render, screen } from '@testing-library/react'
import MetaBar from './MetaBar'

test('renders the fixed left and right slots', () => {
  render(<MetaBar center="CONTENT · SUSTAINABILITY · BOARD SPORTS" />)
  expect(screen.getByText('VOL. 1 — ISSUE 1')).toBeInTheDocument()
  expect(screen.getByText('VANCOUVER, BC · JUNE 2026')).toBeInTheDocument()
})

test('renders the caller-supplied centre slot', () => {
  render(<MetaBar center="THE EDITOR" />)
  expect(screen.getByText('THE EDITOR')).toBeInTheDocument()
})

test('uses the light meta weight', () => {
  render(<MetaBar center="X" />)
  expect(screen.getByText('VOL. 1 — ISSUE 1')).toHaveClass('label-meta--light')
})
