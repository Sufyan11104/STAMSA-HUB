import { useEffect, useState, ComponentType } from 'react';
import { useRouter } from 'next/router';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../app/lib/firebase';

function withAuth<P>(WrappedComponent: ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user) {
          router.replace('/login');
        } else {
          setUser(user);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    }, [router]);

    if (loading) {
      return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }
    if (!user) {
      return null;
    }
    return <WrappedComponent {...(props as any)} />;
  };
}

export default withAuth; 