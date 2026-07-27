import type { Meta, StoryObj } from '@storybook/react-vite'
import ArticleSectionBlock from './ArticleSection'
import { getArticle } from '../../content/articles'

const article = getArticle('building-compliance-in-a-sea-of-digital-assets')!

const meta: Meta<typeof ArticleSectionBlock> = {
  title: 'Blocks/ArticleSection',
  component: ArticleSectionBlock,
  args: { section: article.sections[0] },
  decorators: [
    (Story) => (
      <div style={{ padding: '2rem 7.5rem' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ArticleSectionBlock>

export const Single: Story = {}

export const AllThree: Story = {
  render: () => (
    <div style={{ padding: '2rem 7.5rem' }}>
      {article.sections.map((section) => (
        <ArticleSectionBlock key={section.heading} section={section} />
      ))}
    </div>
  ),
}
