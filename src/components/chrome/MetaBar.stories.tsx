import type { Meta, StoryObj } from '@storybook/react-vite'
import MetaBar from './MetaBar'
import { HOME } from '../../content/home'
import { getArticle } from '../../content/articles'

const meta: Meta<typeof MetaBar> = {
  title: 'Chrome/MetaBar',
  component: MetaBar,
}

export default meta
type Story = StoryObj<typeof MetaBar>

export const Homepage: Story = { args: { center: HOME.metaBarCenter } }

export const ArticlePage: Story = {
  args: {
    center: getArticle('building-compliance-in-a-sea-of-digital-assets')!
      .metaBarTitle,
  },
}
