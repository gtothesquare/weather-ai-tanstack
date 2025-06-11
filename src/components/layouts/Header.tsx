import { HStack, Link } from '~/components/ui';

export const Header = () => {
  return (
    <header className="py-1 w-full bg-gray-900">
      <div className="flex mx-auto w-full max-w-5xl px-4 py-2">
        <HStack justify="between" align="center">
          <h1 className="text-3xl py-2 font-light text-gray-100">
            <HStack align={'center'} spacing="sm">
              <img alt="logo" className="h-8" src="/logo.png" />
              <a href={'/'}>Weather Chat</a>
            </HStack>
          </h1>
          <Link href={'/about'}>About</Link>
        </HStack>
      </div>
    </header>
  );
};
