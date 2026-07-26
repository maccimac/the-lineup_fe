import type { Meta, StoryObj } from '@storybook/react-vite'
import ArrowLink from './ArrowLink'

const meta: Meta<typeof ArrowLink> = {
  title: 'Primitives/ArrowLink',
  component: ArrowLink,
  args: { href: '#', children: 'Continue reading' },
}

export default meta
type Story = StoryObj<typeof ArrowLink>

export const Meta_: Story = { name: 'Meta' }

export const Card: Story = {
  args: {
    emphasis: 'card',
    children: 'Study.com: scaling a distributed editorial contractor team',
  },
}
