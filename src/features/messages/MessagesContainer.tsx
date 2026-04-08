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

/**
 * that extracts an error message from tool payloads when they
 *   arrive as either:
 *
 *   - an object like { error: "..." }
 *   - a JSON string like "{"error":"..."}"
 * @param content
 */
function parseStructuredToolError(content: unknown) {
  if (
    content &&
    typeof content === 'object' &&
    'error' in content &&
    typeof content.error === 'string'
  ) {
    return content.error;
  }

  if (typeof content !== 'string') {
    return null;
  }

  try {
    const parsed = JSON.parse(content) as { error?: unknown };
    return typeof parsed.error === 'string' ? parsed.error : null;
  } catch {
    return null;
  }
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
        const hasTextRow =
          (message.role === 'user' && textContent.trim().length > 0) ||
          (message.role === 'assistant' && cleanedTextContent.length > 0);

        const toolErrors = new Map<string, string>();

        for (const part of message.parts) {
          if (part.type === 'tool-call') {
            const outputError = parseStructuredToolError(part.output);

            if (outputError) {
              toolErrors.set(part.id, outputError);
            }
          }

          if (part.type === 'tool-result') {
            const resultError =
              part.state === 'error'
                ? (part.error ?? part.content)
                : parseStructuredToolError(part.content);

            if (typeof resultError === 'string' && resultError.trim()) {
              toolErrors.set(part.toolCallId, resultError);
            }
          }
        }

        const renderedToolParts = message.parts
          .map((part, index) => {
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
              const toolError = toolErrors.get(part.id);

              if (toolError) {
                return (
                  <Alert key={part.id} variant="destructive">
                    <AlertDescription>{toolError}</AlertDescription>
                  </Alert>
                );
              }

              if (part.output) {
                const parsed = weatherWidgetPayloadSchema.safeParse(
                  part.output.widget
                );

                if (parsed.success) {
                  return (
                    <WeatherWidgetRenderer key={part.id} widget={parsed.data} />
                  );
                }
              }

              if (
                isStreaming &&
                !part.output &&
                (part.state === 'awaiting-input' ||
                  part.state === 'input-streaming' ||
                  part.state === 'input-complete')
              ) {
                return (
                  <AiMessage
                    content="Working to get the latest weather data..."
                    key={part.id}
                  />
                );
              }
            }

            return null;
          })
          .filter((part) => part !== null);
        const hasMetaRow = renderedToolParts.length > 0;

        if (!hasTextRow && !hasMetaRow) {
          return null;
        }

        return (
          <React.Fragment key={message.id}>
            {hasTextRow ? (
              <div
                className={twMerge(
                  'w-full text-sm flex mx-auto max-w-3xl',
                  message.role === 'user' && 'justify-end'
                )}
              >
                {message.role === 'user' ? (
                  <UserMessage content={textContent} />
                ) : (
                  <AiMessage
                    content={cleanedTextContent}
                    isAnimating={isStreaming}
                  />
                )}
              </div>
            ) : null}
            {hasMetaRow ? (
              <div className="w-full text-sm flex mx-auto max-w-3xl">
                <Stack className="w-full" gap="4">
                  {renderedToolParts}
                </Stack>
              </div>
            ) : null}
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
