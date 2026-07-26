import type { Meta, StoryObj } from '@storybook/react-vite'
import Kicker from './Kicker'

const meta: Meta<typeof Kicker> = {
  title: 'Primitives/Kicker',
  component: Kicker,
  args: { children: "EDITOR'S FEATURE" },
}

export default meta
type Story = StoryObj<typeof Kicker>

export const Forest: Story = {}

export const Coral: Story = {
  args: { tone: 'coral', children: 'CASE STUDY' },
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem', padding: '2rem' }}>
      <Kicker size="micro">EDITOR'S LETTER — 9PX</Kicker>
      <Kicker size="kicker">CASE STUDY — 10PX</Kicker>
      <Kicker size="meta">EDITOR'S FEATURE — 11PX</Kicker>
    </div>
  ),
}
