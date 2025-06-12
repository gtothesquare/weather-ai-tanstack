import { ReactNode } from 'react';
import { BaseBox } from '~/components/ui/BaseBox';
import {
  AlignItems,
  Height,
  JustifyContent,
  Size,
  Width,
} from '~/components/ui/types';

interface Props {
  spacing?: Size;
  align?: AlignItems;
  justify?: JustifyContent;
  children?: ReactNode;
  width?: Width;
  height?: Height;
}

export const VStack = ({
  spacing,
  align,
  justify,
  width,
  height,
  children,
}: Props) => {
  return (
    <BaseBox
      flex="column"
      align={align}
      justify={justify}
      spacingY={spacing}
      width={width}
      height={height}
    >
      {children}
    </BaseBox>
  );
};
