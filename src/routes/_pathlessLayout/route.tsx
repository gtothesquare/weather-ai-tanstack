import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Header } from '~/components/layouts/Header';
import { Footer } from '~/components/layouts/Footer';

export const Route = createFileRoute('/_pathlessLayout')({
  component: LayoutComponent,
});

function LayoutComponent() {
  return (
    <>
      <Header />
      <main className="flex flex-col grow inset-shadow-xs">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
