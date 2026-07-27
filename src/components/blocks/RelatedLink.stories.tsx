import type { Meta, StoryObj } from '@storybook/react-vite'
import RelatedLink from './RelatedLink'
import { getArticle } from '../../content/articles'

const meta: Meta<typeof RelatedLink> = {
  title: 'Blocks/RelatedLink',
  component: RelatedLink,
  args: {
    related: getArticle('building-compliance-in-a-sea-of-digital-assets')!
      .related,
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '2rem' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof RelatedLink>

export const Default: Story = {}
