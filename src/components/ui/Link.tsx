import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface Props {
  href: string;
  cssClass?: string;
  target?: string;
  children?: ReactNode;
}

export const Link = ({ href, cssClass, target, children }: Props) => {
  const isExternal = target === '_blank';
  const rel = isExternal ? 'noopener noreferrer' : undefined;

  return (
    <a
      className={twMerge('text-sky-700', 'hover:underline', cssClass)}
      href={href}
      target={target}
      rel={rel}
    >
      {children}
    </a>
  );
};
