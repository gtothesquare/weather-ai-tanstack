import React, { useEffect, useRef } from 'react';
import { Message } from '@ai-sdk/react';
import { WeatherWidget } from './WeatherWidget';
import { twMerge } from 'tailwind-merge';
import { UserMessage } from './UserMessage';
import { AiMessage } from './AIMessage';
import { ToolInvocationUIPart } from '@ai-sdk/ui-utils';

interface Props {
  messages: Message[];
  status: 'submitted' | 'streaming' | 'ready' | 'error';
}

export const ChatMessages = ({ messages, status }: Props) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-auto pt-4">
      {messages.map((message, index) => {
        return (
          <React.Fragment key={message.id}>
            <div
              className={twMerge(
                'w-full text-sm flex mx-auto max-w-3xl',
                message.role === 'user' && 'justify-end'
              )}
            >
              {message.role === 'user' && (
                <UserMessage content={message.content} />
              )}
              {message.role === 'assistant' && (
                <AiMessage
                  content={message.content}
                  isLoading={
                    status === 'submitted' && messages.length - 1 === index
                  }
                />
              )}
            </div>

            <div className="w-full text-sm flex mx-auto max-w-3xl">
              {message.parts?.map((part) => {
                if (part.type === 'tool-invocation') {
                  const tool = (part as ToolInvocationUIPart).toolInvocation;
                  const callId = part.toolInvocation.toolCallId;

                  if (tool.toolName === 'currentLocation') {
                    if (tool.state === 'call') {
                      return (
                        <div key={callId} className="text-gray-500">
                          <AiMessage content="Getting location..." />
                        </div>
                      );
                    } else if (
                      tool.state === 'result' &&
                      typeof tool.result === 'string'
                    ) {
                      return (
                        <AiMessage
                          key={callId}
                          content={`Location: ${tool.result}`}
                        />
                      );
                    }
                  }
                  if (tool.toolName === 'userLocation') {
                    if (tool.state === 'call') {
                      return (
                        <AiMessage
                          key={callId}
                          content={`Getting location...`}
                        />
                      );
                    } else if (tool.state === 'result') {
                      return (
                        <AiMessage
                          key={callId}
                          content={`Location: ${tool.result}`}
                        />
                      );
                    }
                  }

                  if (
                    tool.toolName === 'weatherInfo' &&
                    tool.state === 'result' &&
                    tool.result &&
                    tool.result.data
                  ) {
                    return (
                      <WeatherWidget key={callId} data={tool.result.data} />
                    );
                  }
                }

                return null;
              })}
            </div>
          </React.Fragment>
        );
      })}
      <div className="mb-10" ref={bottomRef} />
    </div>
  );
};
