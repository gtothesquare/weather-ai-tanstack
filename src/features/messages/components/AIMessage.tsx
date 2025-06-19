import { HStack } from '~/components/ui/HStack';
import { Sparkles } from 'lucide-react';
import { MessageCard } from '~/features/messages/components/MessageCard';
import { MarkdownBlock } from '~/components/MarkdownBlock';

interface AiMessageProps {
  content: string;
}

export const AiMessage = ({ content }: AiMessageProps) => {
  return (
    <MessageCard variant="ai">
      <HStack align="start" spacing={'md'}>
        <div className="border border-gray-500 rounded-full p-2 text-gray-800">
          <Sparkles size={16} />
        </div>
        <div className="leading-tight pt-1">
          <MarkdownBlock>{content}</MarkdownBlock>
        </div>
      </HStack>
    </MessageCard>
  );
};
