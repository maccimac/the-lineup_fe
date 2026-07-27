import type { Meta, StoryObj } from '@storybook/react-vite'
import ArticleHeader from './ArticleHeader'
import { getArticle } from '../../content/articles'

const meta: Meta<typeof ArticleHeader> = {
  title: 'Blocks/ArticleHeader',
  component: ArticleHeader,
  args: {
    article: getArticle('building-compliance-in-a-sea-of-digital-assets')!,
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '2rem 7.5rem' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ArticleHeader>

export const CaseStudy: Story = {}
