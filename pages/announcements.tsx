import Navbar from '../components/Navbar';
import { useEffect, useState, FormEvent } from 'react';
import { collection, addDoc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../app/lib/firebase';

interface Announcement {
  id: string;
  text: string;
  createdAt: Timestamp;
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true);
      const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Announcement[];
      setAnnouncements(data);
      setLoading(false);
    };
    fetchAnnouncements();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await addDoc(collection(db, 'announcements'), {
      text,
      createdAt: Timestamp.now(),
    });
    setText('');
    // Refresh announcements
    const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Announcement[];
    setAnnouncements(data);
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-2xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Announcements</h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-8 flex flex-col gap-4">
          <h2 className="text-lg font-semibold mb-2">Post New Announcement</h2>
          <textarea
            placeholder="Write your announcement here..."
            className="border rounded px-3 py-2 min-h-[80px]"
            value={text}
            onChange={e => setText(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition self-end"
            disabled={submitting}
          >
            {submitting ? 'Posting...' : 'Post'}
          </button>
        </form>
        <h2 className="text-lg font-semibold mb-4">Latest Announcements</h2>
        {loading ? (
          <div>Loading announcements...</div>
        ) : announcements.length === 0 ? (
          <div>No announcements yet.</div>
        ) : (
          <div className="flex flex-col gap-4">
            {announcements.map(a => (
              <div key={a.id} className="bg-white rounded-lg shadow p-4">
                <div className="text-gray-700 mb-2 whitespace-pre-line">{a.text}</div>
                <div className="text-xs text-gray-500">
                  {a.createdAt?.toDate ? a.createdAt.toDate().toLocaleString() : ''}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
} 