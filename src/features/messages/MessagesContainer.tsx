import React, { lazy, Suspense, useEffect, useRef } from 'react';
import { Message } from '@ai-sdk/react';
import { WeatherCurrentWidget } from '../weather/components/WeatherCurrentWidget';
import { twMerge } from 'tailwind-merge';
import { UserMessage } from './components/UserMessage';
import { AiMessage } from './components/AIMessage';
import { Alert, VStack } from '~/components/ui';
import { Coordinates, WeatherData } from '~/features/weather/types';
import { AiLoadingIndicator } from './components/AiLoadingIndicator';
import { WeatherDailyWidget } from '~/features/weather/components/WeatherDailyWidget';

const LocationWidget = lazy(() => import('../location/LocationWidget'));

interface Props {
  messages: Message[];
  status: 'submitted' | 'streaming' | 'ready' | 'error';
}

export const MessagesContainer = ({ messages, status }: Props) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-auto pt-4">
      {messages.map((message) => {
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
                <AiMessage content={message.content} />
              )}
            </div>
            <div className="w-full text-sm flex mx-auto max-w-3xl">
              {message.parts?.map((part) => {
                if (part.type === 'tool-invocation') {
                  const toolInvocation = part.toolInvocation;
                  const { state, toolName, toolCallId } = toolInvocation;

                  if (state === 'result') {
                    const { result } = toolInvocation;
                    if (toolName === 'weatherInfoWithCoordinates') {
                      const mapArgs = toolInvocation.args as Coordinates;
                      const coordinates = mapArgs.coordinates;
                      const renderMap =
                        coordinates?.latitude !== undefined &&
                        coordinates?.longitude !== undefined;

                      if (result.success) {
                        const data = result.data as WeatherData;
                        return (
                          <VStack spacing={'md'} key={toolCallId}>
                            {renderMap && (
                              <Suspense fallback="Loading location map...">
                                <LocationWidget
                                  latitude={coordinates.latitude}
                                  longitude={coordinates.longitude}
                                />
                              </Suspense>
                            )}
                            <WeatherCurrentWidget
                              weatherData={data.current}
                              location={data.location}
                            />
                            <WeatherDailyWidget
                              weatherData={data.daily}
                              location={data.location}
                            />
                          </VStack>
                        );
                      } else {
                        return (
                          <div key={toolCallId}>
                            <Alert>{result.error}</Alert>
                          </div>
                        );
                      }
                    }
                    if (toolName === 'weatherInfoWithCity') {
                      const data = result.data as WeatherData;
                      return (
                        <VStack spacing="md" key={toolCallId}>
                          <WeatherCurrentWidget
                            weatherData={data.current}
                            location={data.location}
                          />
                          <WeatherDailyWidget
                            weatherData={data.daily}
                            location={data.location}
                          />
                        </VStack>
                      );
                    }
                  } else {
                    if (toolName === 'currentLocation') {
                      return (
                        <div key={toolCallId} className="text-gray-500">
                          <AiMessage content="Getting location..." />
                        </div>
                      );
                    }
                    if (toolName === 'weatherInfoWithCoordinates') {
                      return (
                        <div key={toolCallId} className="text-gray-500">
                          <AiMessage content="Getting weather based on yoru location..." />
                        </div>
                      );
                    }
                    if (toolName === 'weatherInfoWithCity') {
                      return (
                        <div key={toolCallId} className="text-gray-500">
                          <AiMessage content="Getting weather..." />
                        </div>
                      );
                    }
                  }
                }
              })}
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
