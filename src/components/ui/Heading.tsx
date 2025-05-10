import { ReactNode } from 'react';

interface Props {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
  children?: ReactNode;
}

export const Heading = ({ variant = 'h2', children }: Props) => {
  switch (variant) {
    case 'h1':
      return <h1 className="text-4xl font-bold mt-1 mb-2">{children}</h1>;
    case 'h3':
      return <h3 className="text-2xl font-bold mt-1 mb-2">{children}</h3>;
    case 'h4':
      return <h4 className="text-xl font-bold mt-1 mb-2">{children}</h4>;
    case 'h5':
      return <h5 className="text-lg font-bold mt-1 mb-2">{children}</h5>;
    case 'h2':
    default:
      return <h2 className="text-3xl font-bold mt-1 mb-2">{children}</h2>;
  }
};
