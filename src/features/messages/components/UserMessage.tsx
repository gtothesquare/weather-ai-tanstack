import { MessageCard } from './MessageCard';

interface Props {
  content: string;
}

export const UserMessage = ({ content }: Props) => {
  return (
    <MessageCard variant={'user'}>
      <div className="px-1">
        <p className="text-sm leading-relaxed text-foreground">{`You: ${content}`}</p>
      </div>
    </MessageCard>
  );
};
