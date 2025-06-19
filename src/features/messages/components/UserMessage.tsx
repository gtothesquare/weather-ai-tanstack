import { MessageCard } from './MessageCard';
import { Text } from '~/components/ui';

interface Props {
  content: string;
}

export const UserMessage = ({ content }: Props) => {
  return (
    <MessageCard variant={'user'}>
      <Text>{`You: ${content}`}</Text>
    </MessageCard>
  );
};
