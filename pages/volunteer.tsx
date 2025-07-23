import Navbar from '../components/Navbar';
import { useState, FormEvent } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../app/lib/firebase';

export default function VolunteerPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rolePreference, setRolePreference] = useState('');
  const [availability, setAvailability] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await addDoc(collection(db, 'volunteerSignups'), {
      name,
      email,
      rolePreference,
      availability,
      submittedAt: new Date(),
    });
    setName('');
    setEmail('');
    setRolePreference('');
    setAvailability('');
    setSubmitting(false);
    setSuccess(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Volunteer Signup</h1>
        {success ? (
          <div className="bg-green-100 text-green-800 p-4 rounded mb-6 text-center">
            Thank you for signing up! We will be in touch soon.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 flex flex-col gap-4">
            <input
              type="text"
              placeholder="Name"
              className="border rounded px-3 py-2"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="border rounded px-3 py-2"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Role Preference (e.g. Event Volunteer, Media, etc.)"
              className="border rounded px-3 py-2"
              value={rolePreference}
              onChange={e => setRolePreference(e.target.value)}
              required
            />
            <textarea
              placeholder="Availability (e.g. weekends, evenings, specific dates)"
              className="border rounded px-3 py-2"
              value={availability}
              onChange={e => setAvailability(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition self-end"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        )}
      </main>
    </div>
  );
} 