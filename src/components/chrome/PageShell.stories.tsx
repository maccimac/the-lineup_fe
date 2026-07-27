import type { Meta, StoryObj } from '@storybook/react-vite'
import PageShell from './PageShell'
import { HOME } from '../../content/home'

const meta: Meta<typeof PageShell> = {
  title: 'Chrome/PageShell',
  component: PageShell,
}

export default meta
type Story = StoryObj<typeof PageShell>

export const Empty: Story = {
  args: {
    metaBarCenter: HOME.metaBarCenter,
    children: (
      <p className="type-body" style={{ padding: '5rem 7.5rem' }}>
        Page content goes here in phase 3.
      </p>
    ),
  },
}
