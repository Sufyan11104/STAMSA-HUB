import Navbar from '../components/Navbar';
import { useEffect, useState, FormEvent } from 'react';
import { collection, addDoc, getDocs, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../app/lib/firebase';

interface Task {
  id: string;
  title: string;
  assignedTo: string;
  completed: boolean;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      const q = query(collection(db, 'tasks'), orderBy('title', 'asc'));
      const querySnapshot = await getDocs(q);
      const tasksData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];
      setTasks(tasksData);
      setLoading(false);
    };
    fetchTasks();
  }, []);

  const handleAddTask = async (e: FormEvent) => {
    e.preventDefault();
    setAdding(true);
    await addDoc(collection(db, 'tasks'), {
      title,
      assignedTo,
      completed: false,
    });
    setTitle('');
    setAssignedTo('');
    // Refresh tasks
    const q = query(collection(db, 'tasks'), orderBy('title', 'asc'));
    const querySnapshot = await getDocs(q);
    const tasksData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Task[];
    setTasks(tasksData);
    setAdding(false);
  };

  const toggleTaskCompletion = async (task: Task) => {
    const taskRef = doc(db, 'tasks', task.id);
    await updateDoc(taskRef, { completed: !task.completed });
    // Refresh tasks
    const q = query(collection(db, 'tasks'), orderBy('title', 'asc'));
    const querySnapshot = await getDocs(q);
    const tasksData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Task[];
    setTasks(tasksData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Tasks</h1>
        <form onSubmit={handleAddTask} className="bg-white rounded-lg shadow p-6 mb-8 flex flex-col gap-4">
          <h2 className="text-lg font-semibold mb-2">Add New Task</h2>
          <input
            type="text"
            placeholder="Task Title"
            className="border rounded px-3 py-2"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Assigned To"
            className="border rounded px-3 py-2"
            value={assignedTo}
            onChange={e => setAssignedTo(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition self-end"
            disabled={adding}
          >
            {adding ? 'Adding...' : 'Add Task'}
          </button>
        </form>
        <h2 className="text-lg font-semibold mb-4">To-Do List</h2>
        {loading ? (
          <div>Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div>No tasks found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {tasks.map(task => (
              <div key={task.id} className="bg-white rounded-lg shadow p-6 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h3 className={`text-lg font-bold ${task.completed ? 'line-through text-gray-400' : ''}`}>{task.title}</h3>
                  <button
                    onClick={() => toggleTaskCompletion(task)}
                    className={`px-3 py-1 rounded text-xs font-semibold ${task.completed ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'} hover:bg-green-300 transition`}
                  >
                    {task.completed ? 'Completed' : 'Mark Complete'}
                  </button>
                </div>
                <p className="text-gray-600 text-sm">Assigned to: {task.assignedTo}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
} 