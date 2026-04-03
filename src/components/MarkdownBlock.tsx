import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Props {
  children: string | null | undefined;
}

export const MarkdownBlock = ({ children }: Props) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1 className="font-heading text-3xl">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="font-heading text-2xl">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="font-heading text-xl">{children}</h3>
        ),
        h4: ({ children }) => (
          <h4 className="font-heading text-lg">{children}</h4>
        ),
        p: ({ children }) => (
          <p className="text-sm leading-relaxed text-foreground">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="mt-2 list-disc space-y-1 pl-5">{children}</ul>
        ),
        li: ({ children }) => (
          <li className="text-base leading-relaxed text-foreground/88">
            {children}
          </li>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
};
