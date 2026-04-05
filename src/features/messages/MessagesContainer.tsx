import React, { useEffect, useRef } from 'react';
import { UIMessage } from '@tanstack/ai-react';
import { twMerge } from 'tailwind-merge';
import { UserMessage } from './components/UserMessage';
import { AiMessage } from './components/AIMessage';
import { ThinkingMessage } from './components/ThinkingMessage';
import { Alert, AlertDescription, Stack } from '@yaip/yads-ui';
import { AiLoadingIndicator } from './components/AiLoadingIndicator';
import { WeatherWidgetRenderer } from './widgets/weatherWidget';
import { weatherWidgetPayloadSchema } from '~/features/weather/widgetSchema';

interface Props {
  messages: UIMessage[];
  status: 'submitted' | 'streaming' | 'ready' | 'error';
}

function stripRenderedWidgetJson(content: string) {
  return content
    .replace(
      /\{\s*"type"\s*:\s*"weather-forecast"[\s\S]*?"showMap"\s*:\s*(true|false)\s*\}/g,
      ''
    )
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export const MessagesContainer = ({ messages, status }: Props) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const isStreaming = status === 'submitted' || status === 'streaming';

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-auto pt-4">
      {messages.map((message) => {
        const textContent = message.parts
          .filter(
            (part): part is Extract<typeof part, { type: 'text' }> =>
              part.type === 'text'
          )
          .map((part) => part.content)
          .join('');
        const cleanedTextContent = stripRenderedWidgetJson(textContent);

        const errorResults = message.parts.filter(
          (
            part
          ): part is Extract<
            (typeof message.parts)[number],
            { type: 'tool-result' }
          > => part.type === 'tool-result' && part.state === 'error'
        );

        return (
          <React.Fragment key={message.id}>
            <div
              className={twMerge(
                'w-full text-sm flex mx-auto max-w-3xl',
                message.role === 'user' && 'justify-end'
              )}
            >
              {message.role === 'user' && <UserMessage content={textContent} />}
              {message.role === 'assistant' && cleanedTextContent ? (
                <AiMessage
                  content={cleanedTextContent}
                  isAnimating={isStreaming}
                />
              ) : null}
            </div>
            <div className="w-full text-sm flex mx-auto max-w-3xl">
              <Stack className="w-full" gap="4">
                {message.parts.map((part, index) => {
                  if (part.type === 'thinking') {
                    const content = part.content.trim();

                    if (!content) {
                      return null;
                    }

                    return (
                      <ThinkingMessage
                        content={content}
                        key={`${message.id}-thinking-${index}`}
                      />
                    );
                  }

                  if (part.type !== 'tool-call') {
                    return null;
                  }

                  if (
                    part.name === 'weatherInfoWithCity' ||
                    part.name === 'weatherInfoWithCoordinates'
                  ) {
                    if (part.output) {
                      const parsed = weatherWidgetPayloadSchema.safeParse(
                        part.output.widget
                      );

                      if (parsed.success) {
                        return (
                          <WeatherWidgetRenderer
                            key={part.id}
                            widget={parsed.data}
                          />
                        );
                      }
                    }

                    if (
                      isStreaming &&
                      (part.state === 'awaiting-input' ||
                        part.state === 'input-streaming' ||
                        part.state === 'input-complete')
                    ) {
                      return (
                        <AiMessage content="Getting weather..." key={part.id} />
                      );
                    }
                  }

                  if (part.name === 'userLocation') {
                    if (
                      isStreaming &&
                      !part.output &&
                      (part.state === 'awaiting-input' ||
                        part.state === 'input-streaming' ||
                        part.state === 'input-complete')
                    ) {
                      return (
                        <AiMessage
                          content="Getting location..."
                          key={part.id}
                        />
                      );
                    }
                  }

                  return null;
                })}
                {errorResults.map((part) => (
                  <Alert key={part.toolCallId} variant="destructive">
                    <AlertDescription>
                      {part.error ?? part.content}
                    </AlertDescription>
                  </Alert>
                ))}
              </Stack>
            </div>
          </React.Fragment>
        );
      })}
      <div className="w-full flex mx-auto max-w-3xl">
        {status === 'submitted' && <AiLoadingIndicator />}
      </div>
      <div className="mb-10" ref={bottomRef} />
    </div>
  );
};
