import React, { ReactNode } from 'react';
import { twJoin } from 'tailwind-merge';

interface Props {
  variant: 'ai' | 'user';
  children: ReactNode;
}

export function MessageCard({ variant, children }: Props) {
  return (
    <div
      className={twJoin(
        'rounded-3xl px-5 py-4 ring-1 shadow-[0_8px_30px_rgba(0,0,0,0.12)]',
        variant === 'user' && 'bg-primary/14 ring-border/45 backdrop-blur-md',
        variant === 'ai' && 'bg-card/70 ring-border/45 backdrop-blur-xl'
      )}
    >
      {children}
    </div>
  );
}
