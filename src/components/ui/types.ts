import { ThemeConfig } from 'tailwindcss/types/config';

export type Size = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
export type JustifyContent =
  | 'start'
  | 'center'
  | 'between'
  | 'around'
  | 'stretch'
  | 'end';
export type AlignItems = 'start' | 'center' | 'stretch' | 'end' | 'baseline';
export type Flex = 'row' | 'column';
export type Wrap = 'wrap' | 'nowrap' | 'wrap-reverse';
export type Border = 'none' | 'square' | 'rounded';
export type Background = string;
export type Foreground = string;
