import type { Meta, StoryObj } from '@storybook/react';
import { BaseBox } from '../BaseBox';
import React from 'react';

const sizeOptions = ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const;

const meta: Meta<typeof BaseBox> = {
  title: 'ui/BaseBox',
  component: BaseBox,
  tags: ['autodocs'],
  argTypes: {
    flex: {
      control: { type: 'select' },
      options: ['row', 'column'],
    },
    align: {
      control: { type: 'select' },
      options: ['start', 'center', 'end', 'stretch'],
    },
    justify: {
      control: { type: 'select' },
      options: ['start', 'center', 'end', 'between', 'around'],
    },
    wrap: {
      control: { type: 'select' },
      options: ['wrap', 'nowrap', 'wrap-reverse'],
    },
    spacingX: {
      control: { type: 'select' },
      options: sizeOptions,
    },
    spacingY: {
      control: { type: 'select' },
      options: sizeOptions,
    },
    pad: {
      control: { type: 'select' },
      options: sizeOptions,
    },
    padx: {
      control: { type: 'select' },
      options: sizeOptions,
    },
    pady: {
      control: { type: 'select' },
      options: sizeOptions,
    },
    padt: {
      control: { type: 'select' },
      options: sizeOptions,
    },
    padb: {
      control: { type: 'select' },
      options: sizeOptions,
    },
    padl: {
      control: { type: 'select' },
      options: sizeOptions,
    },
    padr: {
      control: { type: 'select' },
      options: sizeOptions,
    },
  },
};

export default meta;
type Story = StoryObj<typeof BaseBox>;

export const BaseBoxes: Story = {
  args: {
    flex: 'row',
    align: 'center',
    justify: 'center',
    spacingX: 'md',
    pad: 'md',
    children: (
      <>
        <BaseBox pad={'sm'} className=" border rounded">
          Child 1
        </BaseBox>
        <BaseBox pad={'md'} className="bg-amber-400 border rounded">
          Child 2
        </BaseBox>
        <BaseBox pad={'lg'} className="bg-amber-400 border rounded">
          Child 3
        </BaseBox>
      </>
    ),
  },
};
