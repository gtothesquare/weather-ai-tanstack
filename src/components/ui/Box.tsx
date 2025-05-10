import type { BaseBoxProps } from '~/components/ui/BaseBox';
import { BaseBox } from '~/components/ui/BaseBox';
import { ReactNode } from 'react';

type BoxProps = Omit<
  BaseBoxProps,
  'spacingX' | 'spacingY' | 'flex' | 'align' | 'justify'
> & { children: ReactNode };

export const Box = ({ children, ...props }: BoxProps) => {
  return <BaseBox {...props}>{children}</BaseBox>;
};
