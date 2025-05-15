import { Link } from '~/components/ui/Link';

export const Footer = () => {
  return (
    <footer className="flex justify-center mt-5 py-5 w-full bg-slate-50">
      <div className="flex flex-col space-y-2">
        <div className="text-xs">
          <Link href="https://gerieshandal.com" cssClass="text-ghost-white">by @gtothesquare</Link>
        </div>
      </div>
    </footer>
  );
};
