import { Header } from '~/components/layouts/Header';
import { Footer } from '~/components/layouts/Footer';
import { twJoin } from 'tailwind-merge';
import React from 'react';

interface Props {
  children: React.ReactNode;
  withPattern?: boolean;
}

export const PageLayout = ({ children, withPattern }: Props) => {
  return (
    <>
      <Header />
      <main
        className={twJoin(
          'flex flex-col grow inset-shadow-xs',
          withPattern && 'bg-pattern',
          'px-4',
          'lg:px-0'
        )}
      >
        {children}
      </main>
      <Footer />
    </>
  );
};
