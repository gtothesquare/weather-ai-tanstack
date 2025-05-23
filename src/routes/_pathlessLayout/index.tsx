'use client';

import { createFileRoute } from '@tanstack/react-router';
import { useChat } from '@ai-sdk/react';
import { Alert } from '~/components/ui/Alert';
import { ChatMessages } from '~/features/weather/components/ChatMessages';
import { KeyboardEvent } from 'react';
import { Textarea } from '~/components/sui/textarea';

export const Route = createFileRoute('/_pathlessLayout/')({
  component: Home,
});

const getLocationPromise = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, error, status } =
    useChat({
      maxSteps: 5,
      api: '/api/weather',
      async onToolCall({ toolCall }) {
        if (typeof window !== 'undefined') {
          if (toolCall.toolName === 'userLocation') {
            if (navigator.geolocation) {
              const location = await getLocationPromise();
              return JSON.stringify({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              });
            }
          }
        }
      },
      onError(error) {
        console.log(error);
      },
    });

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full min-w-0">
      <div className="w-full h-full">
        <ChatMessages messages={messages} status={status} />
      </div>

      <div className="w-full pb-8 pt-4">
        {error && (
          <div className="max-w-3xl py-4 m-auto">
            <Alert type="error">{error.message}</Alert>
          </div>
        )}

        <form className="flex mx-auto max-w-3xl w-full" onSubmit={handleSubmit}>
          <div className="relative w-full flex flex-col">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="prompt"
            ></label>
            <Textarea
              placeholder="Get the weather"
              name="prompt"
              className="flex w-full border bg-zinc-50 border-input px-3 py-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm min-h-[24px] overflow-hidden resize-none rounded-2xl pb-10"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
