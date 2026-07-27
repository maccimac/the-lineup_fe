import type { Meta, StoryObj } from '@storybook/react-vite'
import SiteHeader from './SiteHeader'

const meta: Meta<typeof SiteHeader> = {
  title: 'Chrome/SiteHeader',
  component: SiteHeader,
}

export default meta
type Story = StoryObj<typeof SiteHeader>

export const Homepage: Story = {}
export const ArticlePage: Story = { args: { activeHref: '/features' } }
