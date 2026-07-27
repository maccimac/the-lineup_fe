import type { Meta, StoryObj } from '@storybook/react-vite'
import Wordmark from './Wordmark'

const meta: Meta<typeof Wordmark> = {
  title: 'Chrome/Wordmark',
  component: Wordmark,
}

export default meta
type Story = StoryObj<typeof Wordmark>

export const Nav: Story = { args: { size: 'nav' } }
export const Footer: Story = { args: { size: 'footer' } }
