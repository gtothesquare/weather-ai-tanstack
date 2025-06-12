import React from 'react';
import { MessageCard } from '~/features/messages/components/MessageCard';
import { HStack, LoadingIndicator } from '~/components/ui';

export function AiLoadingIndicator() {
  return (
    <MessageCard variant="ai">
      <HStack align="start" spacing={'md'}>
        <LoadingIndicator />
      </HStack>
    </MessageCard>
  );
}
