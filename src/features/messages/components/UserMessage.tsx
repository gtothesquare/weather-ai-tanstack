import { MessageCard } from './MessageCard';

interface Props {
  content: string;
}

export const UserMessage = ({ content }: Props) => {
  return (
    <MessageCard variant={'user'}>
      {'You: '}
      {content}
    </MessageCard>
  );
};
