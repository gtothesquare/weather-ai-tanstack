import { twJoin, twMerge } from 'tailwind-merge';
import {
  AlignItems,
  Background,
  Border,
  Flex,
  Foreground,
  JustifyContent,
  Size,
  Wrap,
} from '~/components/ui/types';

import {
  getAlignItems,
  getFlex,
  getFlexWrap,
  getHorizontalSpacing,
  getJustifyContent,
  getPadding,
  getPaddingB,
  getPaddingL,
  getPaddingR,
  getPaddingT,
  getVerticalSpacing,
} from '~/components/ui/utils';

import { ReactNode } from 'react';

export interface BaseBoxProps {
  flex?: Flex;
  align?: AlignItems;
  justify?: JustifyContent;
  spacingX?: Size;
  spacingY?: Size;
  wrap?: Wrap;
  pad?: Size;
  padx?: Size;
  pady?: Size;
  padt?: Size;
  padb?: Size;
  padr?: Size;
  padl?: Size;
  border?: Border;
  bg?: Background;
  fg?: Foreground;
  children?: ReactNode;
  className?: string;
}

export const BaseBox = (props: BaseBoxProps) => {
  const flex = getFlex(props.flex);
  const pad = getPadding(props.pad);
  const padx = twJoin(getPaddingR(props.padx), getPaddingL(props.padx));
  const pady = twJoin(getPaddingR(props.pady), getPaddingL(props.pady));
  const padr = getPaddingR(props.padr);
  const padl = getPaddingL(props.padl);
  const padb = getPaddingB(props.padb);
  const padt = getPaddingT(props.padt);
  const align = getAlignItems(props.align);
  const justify = getJustifyContent(props.justify);
  const spacingY = getVerticalSpacing(props.spacingY);
  const spacingX = getHorizontalSpacing(props.spacingX);
  const wrap = getFlexWrap(props.wrap);

  return (
    <div
      className={twMerge(
        flex,
        pad,
        padx,
        pady,
        padr,
        padl,
        padb,
        padt,
        align,
        justify,
        spacingX,
        spacingY,
        wrap,
        props.bg,
        props.fg,
        props.className
      )}
    >
      {props.children}
    </div>
  );
};
