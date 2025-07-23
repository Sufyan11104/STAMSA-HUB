import Navbar from '../components/Navbar';
import { useEffect, useState, FormEvent } from 'react';
import { collection, addDoc, getDocs, Timestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../app/lib/firebase';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const q = query(collection(db, 'events'), orderBy('date', 'asc'));
      const querySnapshot = await getDocs(q);
      const eventsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate ? doc.data().date.toDate().toISOString().slice(0, 10) : doc.data().date
      })) as Event[];
      setEvents(eventsData);
      setLoading(false);
    };
    fetchEvents();
  }, []);

  const handleAddEvent = async (e: FormEvent) => {
    e.preventDefault();
    setAdding(true);
    await addDoc(collection(db, 'events'), {
      title,
      description,
      date: Timestamp.fromDate(new Date(date)),
    });
    setTitle('');
    setDescription('');
    setDate('');
    // Refresh events
    const q = query(collection(db, 'events'), orderBy('date', 'asc'));
    const querySnapshot = await getDocs(q);
    const eventsData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate ? doc.data().date.toDate().toISOString().slice(0, 10) : doc.data().date
    })) as Event[];
    setEvents(eventsData);
    setAdding(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Events</h1>
        <form onSubmit={handleAddEvent} className="bg-white rounded-lg shadow p-6 mb-8 flex flex-col gap-4">
          <h2 className="text-lg font-semibold mb-2">Add New Event</h2>
          <input
            type="text"
            placeholder="Title"
            className="border rounded px-3 py-2"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            className="border rounded px-3 py-2"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />
          <input
            type="date"
            className="border rounded px-3 py-2"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition self-end"
            disabled={adding}
          >
            {adding ? 'Adding...' : 'Add Event'}
          </button>
        </form>
        <h2 className="text-lg font-semibold mb-4">Upcoming Events</h2>
        {loading ? (
          <div>Loading events...</div>
        ) : events.length === 0 ? (
          <div>No events found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {events.map(event => (
              <div key={event.id} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                <p className="text-gray-700 mb-2">{event.description}</p>
                <p className="text-gray-500 text-sm">{event.date}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
} 