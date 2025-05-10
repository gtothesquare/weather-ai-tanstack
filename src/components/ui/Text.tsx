import { ReactNode } from 'react';

interface Props {
  as?: 'span' | 'p';
  children?: ReactNode;
}

const TextParagraph = ({ children }: { children?: ReactNode }) => {
  return (
    <p className="text-base mt-2 mb-2 leading-relaxed text-gray-900">
      {children}
    </p>
  );
};

const TextSpan = ({ children }: { children?: ReactNode }) => {
  return (
    <span className="text-base leading-relaxed text-gray-900">{children}</span>
  );
};

export const Text = ({ as = 'span', children }: Props) => {
  return as === 'p' ? (
    <TextParagraph>{children}</TextParagraph>
  ) : (
    <TextSpan>{children}</TextSpan>
  );
};
