import { Todo } from '@prisma/client'
import { PrismaClient } from '@prisma/client';
import { useRouter } from 'next/router';
import { useState } from 'react';
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'


const prisma = new PrismaClient()

function DeleteButton(props: { todo: Todo }) {
    const router = useRouter();
    const [isDeleting, setDeleting] = useState(false);
    const handleDelete = async () => {
        setDeleting(true);
        await fetch(`/api/todos/${props.todo.id}`, {
            method: 'DELETE',
        });
        setDeleting(false);
        router.push('/');
    };

    return <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="bg-red-500 text-white px-4 py-2 rounded-md"
    >
        {isDeleting ? 'Deleting...' : 'Delete'}
    </button>;
}

function UpdateButton(props: { todo: Todo, newDescription: string }) {
    const [isUpdating, setUpdating] = useState(false);
    const handleUpdate = async () => {
        setUpdating(true);
        await fetch(`/api/todos/${props.todo.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                description: props.newDescription,
            }),
        });
        setUpdating(false);
    };

    return <button
        onClick={handleUpdate}
        disabled={isUpdating}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
    >
        {isUpdating ? 'Updating...' : 'Update'}
    </button>

}

export default function TodoDetail({
    todoWrapper: todo,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [newDescription, setNewDescription] = useState(todo.description);

    return (
        <div className="max-w-2xl mx-auto mt-8 p-4 bg-white shadow-md text-black">
            <h1 className="text-2xl font-bold mb-4">{todo.name}</h1>
            <textarea
                className="w-full mb-4 p-2 border rounded-md"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
            />
            <p className="text-sm text-gray-500 mb-4">
                Created: {todo.createdAt}
            </p>
            <p className="text-sm text-gray-500 mb-4">
                Last Updated: {todo.updatedAt}
            </p>
            <div className="flex space-x-4">
                <DeleteButton todo={todo} />
                <UpdateButton todo={todo} newDescription={newDescription} />
            </div>
        </div>
    );
}

type TodoWrapper = Todo & {
    createdAt: string
    updatedAt: string
}

export const getServerSideProps = (async (context: any) => {
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
    const todo = data as Todo
    const todoWrapper = {
        ...todo,
        createdAt: todo.createdAt.toLocaleString(),
        updatedAt: todo.updatedAt.toLocaleString()
    } as TodoWrapper
    return { props: { todoWrapper } }
}) satisfies GetServerSideProps<{ todoWrapper: TodoWrapper }>