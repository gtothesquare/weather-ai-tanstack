import { ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

export const Container = ({ children }: Props) => {
  return (
    <div className="container mx-auto w-full max-w-xl lg:max-w-5xl py-2 px-4 h-full flex flex-col justify-between">
      {children}
    </div>
  );
};
