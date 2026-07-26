import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Testing Library does not auto-clean under Vitest's globals-off default.
afterEach(() => {
  cleanup()
})
