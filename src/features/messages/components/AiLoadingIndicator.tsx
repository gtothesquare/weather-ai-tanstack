import React from 'react';
import { Group } from '@yaip/yads-ui';

export function AiLoadingIndicator() {
  return (
    <Group className="items-start gap-4">
      <p className="text-sm leading-relaxed text-foreground/20">Thinking...</p>
    </Group>
  );
}
