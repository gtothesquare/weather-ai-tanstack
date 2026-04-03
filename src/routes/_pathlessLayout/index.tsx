import { createFileRoute } from '@tanstack/react-router';
import { fetchServerSentEvents } from '@tanstack/ai-client';
import { type UIMessage, useChat } from '@tanstack/ai-react';
import { ArrowUp } from 'lucide-react';
import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardContent,
  Textarea,
} from '@yaip/yads-ui/client';
import { MessagesContainer } from '~/features/messages/MessagesContainer';
import { FormEvent, KeyboardEvent, useState } from 'react';
import { getUserLocationBrowser } from '~/features/location/utils/getUserLocationBrowser';
import { userLocationTool } from '~/features/weather/tools';

export const Route = createFileRoute('/_pathlessLayout/')({
  component: Home,
  ssr: false,
});

function Home() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, error, status, isLoading } = useChat({
    connection: fetchServerSentEvents('/api/weather'),
    tools: [
      userLocationTool.client(async () => {
        const location = await getUserLocationBrowser();

        if (!location.success) {
          throw new Error('Browser geolocation is not supported.');
        }

        return location.data;
      }),
    ],
    onError(error) {
      console.error(error);
    },
  });

  const typedMessages = messages as UIMessage[];

  const handleSubmit = async (event?: FormEvent) => {
    event?.preventDefault();

    const value = input.trim();
    if (!value || isLoading) {
      return;
    }

    setInput('');
    await sendMessage(value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void handleSubmit();
    }
  };

  return (
    <div className="flex flex-col h-full min-w-0">
      <div className="w-full h-full">
        <MessagesContainer messages={typedMessages} status={status} />
      </div>

      <div className="w-full pb-8 pt-4">
        {error && (
          <div className="max-w-3xl py-4 m-auto px-4">
            <Alert variant="destructive">
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          </div>
        )}

        <form
          className="mx-auto max-w-3xl w-full px-4"
          onSubmit={(event) => void handleSubmit(event)}
        >
          <Card className="bg-card/76 shadow-sm ring-border/45 backdrop-blur-xl">
            <CardContent className="pt-1">
              <div className="flex items-end gap-3">
                <Textarea
                  placeholder="Get the weather"
                  name="prompt"
                  className="min-h-14 flex-1 resize-none border-0 bg-transparent px-1 py-2 text-base leading-6 text-foreground shadow-none focus-visible:ring-0"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Button
                  aria-label="Send message"
                  className="mb-1 size-10 rounded-full"
                  disabled={isLoading || input.trim().length === 0}
                  size="icon"
                  type="submit"
                >
                  <ArrowUp size={18} />
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
