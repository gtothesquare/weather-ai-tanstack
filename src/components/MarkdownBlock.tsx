import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Heading, Text } from '~/components/ui';

interface Props {
  children: string | null | undefined;
}

export const MarkdownBlock = ({ children }: Props) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => <Heading variant="h1">{children}</Heading>,
        h2: ({ children }) => <Heading variant="h2">{children}</Heading>,
        h3: ({ children }) => <Heading variant="h3">{children}</Heading>,
        h4: ({ children }) => <Heading variant="h4">{children}</Heading>,
        p: ({ children }) => <Text>{children}</Text>,
        ul: ({ children }) => (
          <ul className="mt-2 list-disc space-y-1">{children}</ul>
        ),
        li: ({ children }) => (
          <li className="text-base leading-relaxed text-gray-900">
            {children}
          </li>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
};
