import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button';
import { fn } from '@storybook/test';

const meta = {
  title: 'ui/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: { children: 'Click me please', onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PrimaryButton: Story = { args: {} };

export const SecondaryButton: Story = { args: { variant: 'secondary' } };
export const DangerButton: Story = { args: { variant: 'danger' } };
export const SuccessButton: Story = { args: { variant: 'success' } };
