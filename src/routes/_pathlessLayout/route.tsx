import { createFileRoute, Outlet } from '@tanstack/react-router';
import { PageLayout } from '~/components/layouts/PageLayout';

export const Route = createFileRoute('/_pathlessLayout')({
  component: Layout,
});

function Layout() {
  return (
    <PageLayout withPattern={true}>
      <Outlet />
    </PageLayout>
  );
}
