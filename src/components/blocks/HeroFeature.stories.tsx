import type { Meta, StoryObj } from '@storybook/react-vite'
import HeroFeature from './HeroFeature'
import { HOME } from '../../content/home'

const meta: Meta<typeof HeroFeature> = {
  title: 'Blocks/HeroFeature',
  component: HeroFeature,
  args: { story: HOME.hero },
  decorators: [
    (Story) => (
      <div style={{ background: 'var(--color-surface)', padding: '3.25rem 7.5rem' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof HeroFeature>

export const Default: Story = {}
