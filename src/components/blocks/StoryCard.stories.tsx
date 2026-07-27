import type { Meta, StoryObj } from '@storybook/react-vite'
import StoryCard from './StoryCard'
import { HOME } from '../../content/home'

const meta: Meta<typeof StoryCard> = {
  title: 'Blocks/StoryCard',
  component: StoryCard,
  args: { story: HOME.stories[0] },
  decorators: [
    (Story) => (
      <div style={{ background: 'var(--color-surface)', maxWidth: '25rem' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof StoryCard>

export const CaseStudy: Story = {}
export const Column: Story = { args: { story: HOME.stories[1] } }
