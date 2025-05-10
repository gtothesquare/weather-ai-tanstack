import { ReactNode } from 'react';
import { BaseBox } from '~/components/ui/BaseBox';
import { AlignItems, JustifyContent, Size } from '~/components/ui/types';

interface Props {
  spacing?: Size;
  align?: AlignItems;
  justify?: JustifyContent;
  children?: ReactNode;
}

export const VStack = ({ spacing, align, justify, children }: Props) => {
  return (
    <BaseBox flex="column" align={align} justify={justify} spacingY={spacing}>
      {children}
    </BaseBox>
  );
};
