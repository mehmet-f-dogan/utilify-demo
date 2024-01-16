// pages/index.tsx
import { useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import { Todo } from '@prisma/client';
import { useTodos } from '@/swr';

const inter = Inter({ subsets: ['latin'] });

const TodoList: React.FC<{ todos: Todo[] }> = ({ todos }) => (
  <ul className="list-disc">
    {todos.map((todo) => (
      <li key={todo.id} className="mb-4">
        <Link href={`/todos/${todo.id}`} className='text-blue-500 hover:underline'>
          <strong>{todo.name}</strong>: {todo.description}
        </Link>
      </li>
    ))}
  </ul>
);

const TodoForm: React.FC<{ onAdd: (name: string, description: string) => void }> = ({ onAdd }) => {
  const [newTodo, setNewTodo] = useState({ name: '', description: '' });

  const handleAddTodo = () => {
    const { name, description } = newTodo;
    if (name.trim() !== '' && description.trim() !== '') {
      onAdd(name, description);
      setNewTodo({ name: '', description: '' });
    }
  };

  return (
    <div className="mt-4 text-black">
      <input
        type="text"
        value={newTodo.name}
        onChange={(e) => setNewTodo({ ...newTodo, name: e.target.value })}
        placeholder="Todo Name"
        className="mr-2 p-2 border rounded"
      />
      <input
        type="text"
        value={newTodo.description}
        onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
        placeholder="Todo Description"
        className="mr-2 p-2 border rounded"
      />
      <button
        onClick={handleAddTodo}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add Todo
      </button>
    </div>
  );
};

export default function Home() {
  const { todos, mutateTodos } = useTodos()
  const handleAddTodo = async (name: string, description: string) => {
    await fetch('/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, description }),
    });

    mutateTodos();
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-8 ${inter.className}`}
    >
      <h1 className="text-3xl font-bold mb-4">Todo List</h1>
      <TodoList todos={todos || []} />
      <TodoForm onAdd={handleAddTodo} />
    </main>
  );
}
