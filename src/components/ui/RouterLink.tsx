import { ReactNode } from 'react';
import { Link} from '@tanstack/react-router';
import { twMerge } from 'tailwind-merge';

interface Props {
  href: string;
  target?: string;
  cssClass?: string;
  children?: ReactNode;
}

export const RouterLink = ({ href, target, cssClass, children }: Props) => {
  return (
    <Link
      to={href}
      target={target}
      className={twMerge('hover:underline', cssClass)}
    >
      {children}
    </Link>
  );
};