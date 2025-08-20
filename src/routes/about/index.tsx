import React from 'react';
import { Container, Heading, Text, VStack } from '~/components/ui';
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
    <Container>
      <VStack spacing="md" width="full">
        <Heading variant="h1">About</Heading>
        <Text as="p">
          About The goal of this project is to investigate how to build ui
          components that renders message from LLMs using "tools". So continuous
          updates will be deployed. If the location is not provided in the chat
          it uses different APIs to get the location to generate a weather
          forecast and a map.
        </Text>
        <Heading variant="h2">Stack</Heading>
        <Text as="p">
          Vercel AI sdk, Tanstack Start, Shadcn UI, Tailwind CSS, Storybook,
          Lucide icons.
        </Text>
        <Heading variant="h2">To-do</Heading>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{todoMd}</ReactMarkdown>
      </VStack>
    </Container>
  );
}
