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
import { getHeadMeta } from '~/lib/getHeadMeta';

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
      ...getHeadMeta(),
    ],
    links: [
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/favicon/favicon.svg',
      },
      {
        rel: 'shortcut icon',
        href: '/favicon/favicon.ico',
      },
      {
        rel: 'icon',
        sizes: '96x96',
        type: 'image/png',
        href: '/favicon/favicon-96x96.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/favicon/apple-touch-icon.png',
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
      <body className="flex flex-col grow text-eerie-black">
        {children}
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  );
}
