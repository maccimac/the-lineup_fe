import type { Meta, StoryObj } from '@storybook/react-vite'
import SiteFooter from './SiteFooter'

const meta: Meta<typeof SiteFooter> = {
  title: 'Chrome/SiteFooter',
  component: SiteFooter,
}

export default meta
type Story = StoryObj<typeof SiteFooter>

export const Default: Story = {}
