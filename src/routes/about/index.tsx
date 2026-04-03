import React from 'react';
import { Card, CardContent, Stack } from '@yaip/yads-ui';
import { createFileRoute } from '@tanstack/react-router';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const Route = createFileRoute('/about/')({
  component: About,
});

const todoMd = `
 - [x] Fix the unknown conditions message
 - [x] Render a widget for the daily forecast
 - [ ] Suggest a song based on the forecast
 - [ ] Add a temperature range to the forecast widget
 - [ ] Improve when to render the widgets, right now they are always rendered if I want just the forecast for tomorrow.
`;

export default function About() {
  return (
    <div className="mx-auto w-full max-w-3xl py-8">
      <Card className="bg-card/68 shadow-sm ring-border/45 backdrop-blur-xl">
        <CardContent className="pt-1">
          <Stack gap="4">
            <h1 className="font-heading text-3xl text-foreground">About</h1>
            <p className="text-sm leading-relaxed text-foreground/88">
              The goal of this project is to investigate how to build UI
              components that render messages from LLM tools. If the location is
              not provided in the chat, the app uses different APIs to get the
              location and generate a weather forecast and a map.
            </p>
            <h2 className="font-heading text-2xl text-foreground">Stack</h2>
            <p className="text-sm leading-relaxed text-foreground/88">
              TanStack AI, TanStack Start, Yads UI, TanStack Query, Tailwind
              CSS, Storybook, and Lucide icons.
            </p>
            <h2 className="font-heading text-2xl text-foreground">To-do</h2>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{todoMd}</ReactMarkdown>
          </Stack>
        </CardContent>
      </Card>
    </div>
  );
}
