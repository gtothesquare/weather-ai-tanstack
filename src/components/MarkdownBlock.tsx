import { Streamdown } from 'streamdown';

interface Props {
  children: string | null | undefined;
  isAnimating?: boolean;
}

export const MarkdownBlock = ({ children, isAnimating = false }: Props) => {
  return (
    <Streamdown
      className="text-foreground [&_h1]:font-heading [&_h1]:text-3xl [&_h1]:tracking-tight [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:tracking-tight [&_h3]:font-heading [&_h3]:text-xl [&_h4]:font-heading [&_h4]:text-lg [&_p]:text-sm [&_p]:leading-relaxed [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_ol]:mt-2 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5 [&_li]:text-base [&_li]:leading-relaxed [&_li]:text-foreground/88 [&_a]:text-primary [&_a]:underline-offset-4 hover:[&_a]:underline [&_strong]:text-foreground [&_code]:rounded-md [&_code]:bg-white/6 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.95em]"
      isAnimating={isAnimating}
      mode={isAnimating ? 'streaming' : 'static'}
      parseIncompleteMarkdown={isAnimating}
    >
      {children ?? ''}
    </Streamdown>
  );
};
