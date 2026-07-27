import type { Meta, StoryObj } from '@storybook/react-vite'
import SidebarStoryBlock from './SidebarStory'
import { HOME } from '../../content/home'

const meta: Meta<typeof SidebarStoryBlock> = {
  title: 'Blocks/SidebarStory',
  component: SidebarStoryBlock,
  decorators: [
    (Story) => (
      <div
        style={{
          background: 'var(--color-surface)',
          padding: '3.25rem',
          maxWidth: '34.5rem',
        }}
      >
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof SidebarStoryBlock>

export const EditorsLetter: Story = { args: { story: HOME.editorsLetter } }
export const FeaturedWork: Story = { args: { story: HOME.featuredWork } }
