import { ReactNode } from 'react';
import {
  AlignItems,
  JustifyContent,
  Size,
  Wrap,
} from '~/components/ui/types';
import { BaseBox } from '~/components/ui/BaseBox';

interface Props {
  children?: ReactNode;
  spacing?: Size;
  align?: AlignItems;
  justify?: JustifyContent;
  wrap?: Wrap;
}

export const HStack = ({ children, spacing, align, justify, wrap }: Props) => {
  return (
    <BaseBox
      flex="row"
      align={align}
      justify={justify}
      spacingX={spacing}
      wrap={wrap}
    >
      {children}
    </BaseBox>
  );
};
