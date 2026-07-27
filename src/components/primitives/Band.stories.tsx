import type { Meta, StoryObj } from '@storybook/react-vite'
import Band from './Band'
import PullQuote from './PullQuote'
import { HOME } from '../../content/home'

const meta: Meta<typeof Band> = {
  title: 'Primitives/Band',
  component: Band,
}

export default meta
type Story = StoryObj<typeof Band>

export const Forest: Story = {
  args: {
    tone: 'forest',
    children: <PullQuote variant="band">{HOME.pitchQuote}</PullQuote>,
  },
}

export const Surface: Story = {
  args: { tone: 'surface', children: <p className="type-body">Surface band</p> },
}
