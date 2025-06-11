import React from 'react';
import { Container, Heading, Text, VStack } from '~/components/ui';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/about/')({
  component: About,
});

export default function About() {
  return (
    <Container>
      <VStack spacing="md">
        <Heading>About</Heading>
        <Text as="p">
          About The goal of this project is to investigate how to build ui
          components that renders message from LLMs using "tools". So continuous
          updates will be deployed. If the location is not provided in the chat
          it uses different APIs to get the location to generate a weather
          forecast and a map.
        </Text>
        <Heading variant="h2">To-do</Heading>
        <ul className="list-disc">
          <li>
            <Text>Fix the unknown conditions message</Text>
          </li>
          <li>
            <Text>Render a widget for the daily forecast</Text>
          </li>
          <li>
            <Text>Suggest a song based on the forecast</Text>
          </li>
        </ul>
        <Heading variant="h2">Stack</Heading>
        <Text as="p">
          Vercel AI sdk, Tanstack Start, Tailwind CSS, Storybook, Lucide icons.
        </Text>
      </VStack>
    </Container>
  );
}
