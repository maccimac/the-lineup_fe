import type { Meta, StoryObj } from '@storybook/react-vite'
import StoryGrid from './StoryGrid'
import { HOME } from '../../content/home'

const meta: Meta<typeof StoryGrid> = {
  title: 'Blocks/StoryGrid',
  component: StoryGrid,
  args: { stories: HOME.stories },
  decorators: [
    (Story) => (
      <div style={{ background: 'var(--color-surface)', padding: '0 7.5rem' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof StoryGrid>

export const ThreeUp: Story = {}
