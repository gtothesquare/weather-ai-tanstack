import { createFileRoute, Outlet } from '@tanstack/react-router';
import { PageLayout } from '~/components/layouts/PageLayout';

export const Route = createFileRoute('/about')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PageLayout>
      <Outlet />
    </PageLayout>
  );
}
