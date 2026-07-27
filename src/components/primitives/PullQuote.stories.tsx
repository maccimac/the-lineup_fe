import type { Meta, StoryObj } from '@storybook/react-vite'
import PullQuote from './PullQuote'
import { HOME } from '../../content/home'
import { getArticle } from '../../content/articles'

const meta: Meta<typeof PullQuote> = {
  title: 'Primitives/PullQuote',
  component: PullQuote,
}

export default meta
type Story = StoryObj<typeof PullQuote>

export const Band: Story = {
  args: { variant: 'band', children: HOME.pitchQuote },
  parameters: { backgrounds: { value: 'dark' } },
  render: (args) => (
    <div style={{ background: 'var(--color-deep-forest)', padding: '2.4375rem 7.5rem' }}>
      <PullQuote {...args} />
    </div>
  ),
}

export const Sidebar: Story = {
  args: {
    variant: 'sidebar',
    children: getArticle('building-compliance-in-a-sea-of-digital-assets')!
      .pullQuote,
  },
}
