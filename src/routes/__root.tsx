import type { ReactNode } from 'react';
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import appCss from '~/styles/app.css?url';
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundry';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'My title',
      },
    ],
    links: [
      {
        rel: 'icon',
        sizes: '16x16',
        href: '/favicon.ico',
      },
      {
        rel: 'icon',
        sizes: '512x512',
        href: '/icon.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-icon.png',
      },
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  component: RootComponent,
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    );
  },
  notFoundComponent: () => {
    return (
      <h1 className="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16 text-center">
        Not Found
      </h1>
    );
  },
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="w-full h-full flex flex-col m-0">
      <head>
        <HeadContent />
      </head>
      {/* flex flex-col grow with the html el classes makes the footer be in the bottom without content*/}
      <body className="flex flex-col grow bg-ghost-white text-eerie-black">
        {children}
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  );
}
