import type { AppProps } from 'next/app';
import '../app/globals.css';
import withAuth from '../components/withAuth';

function MyApp({ Component, pageProps, router }: AppProps & { router: any }) {
  // Don't wrap /login with withAuth
  const isLogin = router?.pathname === '/login';
  const WrappedComponent = isLogin ? Component : withAuth(Component);
  return <WrappedComponent {...pageProps} />;
}

export default MyApp; 