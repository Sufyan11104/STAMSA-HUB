import Navbar from '../components/Navbar';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../app/lib/firebase';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">Welcome{user ? `, ${user.displayName}` : ''}!</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
          <Link href="/events" className="block bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2">Events</h2>
            <p className="text-gray-600">View and manage upcoming ISOC events.</p>
          </Link>
          <Link href="/tasks" className="block bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2">Tasks</h2>
            <p className="text-gray-600">Track and complete committee tasks.</p>
          </Link>
          <Link href="/volunteer" className="block bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2">Volunteer Signups</h2>
            <p className="text-gray-600">Sign up or manage volunteer opportunities.</p>
          </Link>
          <Link href="/announcements" className="block bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2">Announcements</h2>
            <p className="text-gray-600">Read the latest ISOC announcements.</p>
          </Link>
        </div>
      </main>
    </div>
  );
} 