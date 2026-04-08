import React from 'react';
import { MessageCard } from '~/features/messages/components/MessageCard';
import { Group, Spinner } from '@yaip/yads-ui';

export function AiLoadingIndicator() {
  return (
    <MessageCard variant="ai">
      <Group className="items-start gap-4">
        <div className="rounded-full border border-white/14 bg-white/6 p-2 text-white/78">
          <Spinner className="text-white/78" />
        </div>
      </Group>
    </MessageCard>
  );
}
