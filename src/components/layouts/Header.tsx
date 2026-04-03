import { Group } from '@yaip/yads-ui';

export const Header = () => {
  return (
    <header className="w-full border-b border-border/50 bg-card/55 backdrop-blur-xl">
      <div className="flex mx-auto w-full max-w-5xl px-4 py-2">
        <div className="flex w-full items-center justify-between gap-4">
          <h1 className="py-2 text-3xl font-light text-foreground">
            <Group className="items-center gap-2">
              <img alt="logo" className="h-8" src="/logo.png" />
              <a href={'/'}>Weather Chat</a>
            </Group>
          </h1>
          <a
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            href="/about"
          >
            About
          </a>
        </div>
      </div>
    </header>
  );
};
