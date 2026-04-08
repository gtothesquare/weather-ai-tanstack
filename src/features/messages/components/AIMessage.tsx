import { SparkleIcon } from '@phosphor-icons/react';
import { MessageCard } from '~/features/messages/components/MessageCard';
import { MarkdownBlock } from '~/components/MarkdownBlock';
import { Group } from '@yaip/yads-ui';

interface AiMessageProps {
  content: string;
  isAnimating?: boolean;
}

export const AiMessage = ({ content, isAnimating = false }: AiMessageProps) => {
  return (
    <MessageCard variant="ai">
      <Group className="items-start gap-4">
        <div className="rounded-full border border-white/14 bg-white/6 p-2 text-white/78">
          <SparkleIcon size={16} />
        </div>
        <div className="flex-1 px-1 pt-1">
          <MarkdownBlock isAnimating={isAnimating}>{content}</MarkdownBlock>
        </div>
      </Group>
    </MessageCard>
  );
};
