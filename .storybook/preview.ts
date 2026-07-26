import type { Preview } from '@storybook/react-vite'
import '../src/styles/index.css'

// The comps are desktop-only and every component assumes the page background.
const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      options: {
        page: { name: 'Page', value: '#ffecd1' },
        surface: { name: 'Surface', value: '#fff6e8' },
      },
    },
  },
  initialGlobals: {
    backgrounds: { value: 'page' },
  },
}

export default preview
