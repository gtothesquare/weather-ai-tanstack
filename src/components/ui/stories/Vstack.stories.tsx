import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { VStack } from '../VStack';

const meta: Meta<typeof VStack> = {
  title: 'ui/VStack',
  component: VStack,
  tags: ['autodocs'],
  argTypes: {
    spacing: {
      control: { type: 'text' },
      description: 'Vertical spacing between children (e.g., "2", "4")',
    },
    align: {
      control: { type: 'select' },
      options: ['start', 'center', 'end', 'stretch'],
    },
    justify: {
      control: { type: 'select' },
      options: ['start', 'center', 'end', 'between', 'around'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof VStack>;

export const Default: Story = {
  args: {
    spacing: 'sm',
    align: 'start',
    justify: 'start',
    children: (
      <>
        <div className="bg-blue-200 p-2 rounded">Item 1</div>
        <div className="bg-blue-300 p-2 rounded">Item 2</div>
        <div className="bg-blue-400 p-2 rounded">Item 3</div>
      </>
    ),
  },
};
