import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut } from 'firebase/auth';
import { auth } from '../app/lib/firebase';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <nav className="bg-white shadow px-4 py-2 flex items-center justify-between w-full mb-8">
      <div className="flex items-center gap-6">
        <Link href="/" className="font-bold text-lg text-blue-700">STAMSA Hub</Link>
        <Link href="/events" className="hover:text-blue-600">Events</Link>
        <Link href="/tasks" className="hover:text-blue-600">Tasks</Link>
        <Link href="/volunteer" className="hover:text-blue-600">Volunteer</Link>
        <Link href="/announcements" className="hover:text-blue-600">Announcements</Link>
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <span className="text-gray-700 text-sm">{user.displayName}</span>
        )}
        <button
          onClick={handleLogout}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm"
        >
          Logout
        </button>
      </div>
    </nav>
  );
} 