import { BrainIcon } from '@phosphor-icons/react';
import { Group } from '@yaip/yads-ui';
import { MessageCard } from '~/features/messages/components/MessageCard';

interface ThinkingMessageProps {
  content: string;
}

export function ThinkingMessage({ content }: ThinkingMessageProps) {
  return (
    <MessageCard variant="ai">
      <Group className="items-start gap-4">
        <div className="rounded-full border border-white/10 bg-white/5 p-2 text-white/62">
          <BrainIcon size={16} />
        </div>
        <div className="flex-1 px-1 pt-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/46">
            Thinking
          </p>
          <p className="mt-2 text-sm leading-6 text-white/72">
            {content || 'Working through the request...'}
          </p>
        </div>
      </Group>
    </MessageCard>
  );
}
