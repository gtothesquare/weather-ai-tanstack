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
        'border rounded-3xl px-4 py-3',
        variant === 'user' && 'border-green-300 bg-green-50',
        variant === 'ai' && 'border-gray-300 bg-white'
      )}
    >
      {children}
    </div>
  );
}
