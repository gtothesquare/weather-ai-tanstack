import type { Meta, StoryObj } from '@storybook/react';
import { Card } from '../Card';

const meta = {
  title: 'ui/Alert',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: { children: <div>this is an card message body</div> },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CardDefault: Story = { args: { title: 'the title' } };
