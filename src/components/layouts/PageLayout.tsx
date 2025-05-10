import { Header } from '~/components/layouts/Header';
import { Footer } from '~/components/layouts/Footer';
import { Container } from '~/components/ui/Container';
import { Outlet } from '@tanstack/react-router';

export const PageLayout = () => {
  return (
    <div>
      <Header />
      <Container>
        <Outlet />
      </Container>
      <Footer />
    </div>
  );
};
