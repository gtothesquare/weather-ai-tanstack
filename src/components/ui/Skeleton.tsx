import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface Props {
  className?: string;
  children?: ReactNode;
}

export const Skeleton = ({ className, children, ...rest }: Props) => {
  return (
    <div
      className={twMerge('animate-pulse rounded-md bg-gray-700', className)}
      {...rest}
    >
      {children}
    </div>
  );
};