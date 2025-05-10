import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from '../Alert';

const meta = {
  title: 'ui/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: { children: <div>this is an alert message body</div> },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InfoAlert: Story = { args: { title: 'the title' } };

export const ErrorAlert: Story = {
  args: { title: 'the title', type: 'error' },
};

export const WarningAlert: Story = {
  args: { title: 'the title', type: 'warning' },
};
