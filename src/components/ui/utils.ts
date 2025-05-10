import {
  AlignItems,
  Flex,
  JustifyContent,
  Size,
  Wrap,
} from '~/components/ui/types';

import { DefaultColors } from 'tailwindcss/types/generated/colors';

export const getPadding = (size?: Size) => {
  switch (size) {
    case 'xxs':
      return `p-0.5`;
    case 'xs':
      return `p-1`;
    case 'sm':
      return `p-2`;
    case 'md':
      return `p-3`;
    case 'lg':
      return `p-4`;
    case 'xl':
      return `p-5`;
    case 'xxl':
      return `p-6`;
    default:
      return '';
  }
};

export const getPaddingL = (size?: Size) => {
  switch (size) {
    case 'xxs':
      return `pl-0.5`;
    case 'xs':
      return `pl-1`;
    case 'sm':
      return `pl-2`;
    case 'md':
      return `pl-3`;
    case 'lg':
      return `pl-4`;
    case 'xl':
      return `pl-5`;
    case 'xxl':
      return `pl-6`;
    default:
      return '';
  }
};

export const getPaddingR = (size?: Size) => {
  switch (size) {
    case 'xxs':
      return `pr-0.5`;
    case 'xs':
      return `pr-1`;
    case 'sm':
      return `pr-2`;
    case 'md':
      return `pr-3`;
    case 'lg':
      return `pr-4`;
    case 'xl':
      return `pr-5`;
    case 'xxl':
      return `pr-6`;
    default:
      return '';
  }
};

export const getPaddingT = (size?: Size) => {
  switch (size) {
    case 'xxs':
      return `pt-0.5`;
    case 'xs':
      return `pt-1`;
    case 'sm':
      return `pt-2`;
    case 'md':
      return `pt-3`;
    case 'lg':
      return `pt-4`;
    case 'xl':
      return `pt-5`;
    case 'xxl':
      return `pt-6`;
    default:
      return '';
  }
};

export const getPaddingB = (size?: Size) => {
  switch (size) {
    case 'xxs':
      return `pb-0.5`;
    case 'xs':
      return `pb-1`;
    case 'sm':
      return `pb-2`;
    case 'md':
      return `pb-3`;
    case 'lg':
      return `pb-4`;
    case 'xl':
      return `pb-5`;
    case 'xxl':
      return `pb-6`;
    default:
      return '';
  }
};

export const getVerticalSpacing = (size?: Size) => {
  switch (size) {
    case 'xxs':
      return `space-y-0.5`;
    case 'xs':
      return `space-y-1`;
    case 'sm':
      return `space-y-2`;
    case 'md':
      return `space-y-3`;
    case 'lg':
      return `space-y-4`;
    case 'xl':
      return `space-y-5`;
    case 'xxl':
      return `space-y-6`;
    default:
      return '';
  }
};

export const getHorizontalSpacing = (size?: Size) => {
  switch (size) {
    case 'xxs':
      return `space-x-0.5`;
    case 'xs':
      return `space-x-1`;
    case 'sm':
      return `space-x-2`;
    case 'md':
      return `space-x-3`;
    case 'lg':
      return `space-x-4`;
    case 'xl':
      return `space-x-5`;
    case 'xxl':
      return `space-x-6`;
    default:
      return '';
  }
};

export const getJustifyContent = (justify?: JustifyContent) => {
  switch (justify) {
    case 'start':
      return 'justify-start';
    case 'end':
      return 'justify-end';
    case 'center':
      return 'justify-center';
    case 'around':
      return 'justify-around';
    case 'between':
      return 'justify-between';
    case 'stretch':
      return 'justify-stretch';
    default:
      return '';
  }
};

export const getAlignItems = (align?: AlignItems) => {
  switch (align) {
    case 'start':
      return 'items-start';
    case 'end':
      return 'items-end';
    case 'center':
      return 'items-center';
    case 'stretch':
      return 'items-stretch';
    case 'baseline':
      return 'items-baseline';
    default:
      return '';
  }
};

export const getFlex = (flex?: Flex) => {
  switch (flex) {
    case 'row':
      return 'flex';
    case 'column':
      return 'flex flex-col';
    default:
      return '';
  }
};

export const getFlexWrap = (wrap?: Wrap) => {
  switch (wrap) {
    case 'wrap':
      return 'flex-wrap';
    case 'wrap-reverse':
      return 'flex-wrap-reverse';
    case 'nowrap':
      return 'flex-nowrap';
    default:
      return '';
  }
};
