import type { Meta, StoryObj } from '@storybook/react-vite'
import Portrait from './Portrait'
import portrait from '../../assets/joshua-portrait.png'

const meta: Meta<typeof Portrait> = {
  title: 'Primitives/Portrait',
  component: Portrait,
  args: { src: portrait, alt: 'Joshua Bondoc reading in a bookshop' },
}

export default meta
type Story = StoryObj<typeof Portrait>

export const Circular: Story = {}
