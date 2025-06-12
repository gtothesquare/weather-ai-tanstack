import { ReactNode } from 'react';
import {
  AlignItems,
  Height,
  JustifyContent,
  Size,
  Width,
  Wrap,
} from '~/components/ui/types';
import { BaseBox } from '~/components/ui/BaseBox';

interface Props {
  children?: ReactNode;
  spacing?: Size;
  align?: AlignItems;
  justify?: JustifyContent;
  wrap?: Wrap;
  width?: Width;
  height?: Height;
}

export const HStack = ({ children, spacing, align, justify, wrap }: Props) => {
  return (
    <BaseBox
      flex="row"
      align={align}
      justify={justify}
      spacingX={spacing}
      wrap={wrap}
      className="w-full"
    >
      {children}
    </BaseBox>
  );
};
