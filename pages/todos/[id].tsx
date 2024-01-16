import { Todo } from '@prisma/client'
import { PrismaClient } from '@prisma/client';
import { useRouter } from 'next/router';
import { useState } from 'react';

const prisma = new PrismaClient()

export default function TodoDetail(props: { data: string }) {
    const router = useRouter();
    const [isDeleting, setDeleting] = useState(false);
    const [isUpdating, setUpdating] = useState(false);
    const todo = JSON.parse(props.data) as Todo;
    const [newDescription, setNewDescription] = useState(todo.description);

    const handleDelete = async () => {
        setDeleting(true);
        await fetch(`/api/todos/${todo.id}`, {
            method: 'DELETE',
        });
        setDeleting(false);
        router.push('/');
    };

    const handleUpdate = async () => {
        setUpdating(true);
        await fetch(`/api/todos/${todo.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                description: newDescription,
            }),
        });
        setUpdating(false);
    };

    return (
        <div className="max-w-2xl mx-auto mt-8 p-4 bg-white shadow-md text-black">
            <h1 className="text-2xl font-bold mb-4">{todo.name}</h1>
            <textarea
                className="w-full mb-4 p-2 border rounded-md"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
            />
            <p className="text-sm text-gray-500 mb-4">
                Created: {new Date(todo.createdAt).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mb-4">
                Last Updated: {new Date(todo.updatedAt).toLocaleString()}
            </p>
            <div className="flex space-x-4">
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
                <button
                    onClick={handleUpdate}
                    disabled={isUpdating}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                    {isUpdating ? 'Updating...' : 'Update'}
                </button>
            </div>
        </div>
    );
}

export async function getServerSideProps(context: { params: any }) {
    const { id } = context.params;
    const data = await prisma.todo.findFirst({
        where: {
            id: parseInt(id),
        },
    }).catch(() => { });

    if (!data) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    return { props: { data: JSON.stringify(data) } }
}