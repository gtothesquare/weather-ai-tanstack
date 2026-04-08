export const Footer = () => {
  return (
    <footer className="mt-5 flex w-full justify-center border-t border-border/50 bg-card/45 py-5 backdrop-blur-xl">
      <div className="flex flex-col space-y-2">
        <div className="text-xs text-muted-foreground">
          <a
            className="text-muted-foreground transition-colors hover:text-foreground"
            href="https://gerieshandal.com"
          >
            by @gtothesquare
          </a>
        </div>
      </div>
    </footer>
  );
};
