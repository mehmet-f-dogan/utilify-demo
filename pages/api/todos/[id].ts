import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const todoId = req.query.id;

    if (!todoId || typeof todoId !== 'string') {
        res.status(400).json({ message: 'Bad Request: Invalid todo ID' });
        return;
    }

    switch (req.method) {
        case 'DELETE':
            try {
                const deletedTodo = await prisma.todo.delete({
                    where: {
                        id: parseInt(todoId),
                    },
                });

                res.status(200).json(deletedTodo);
            } catch (error) {
                res.status(500).json({ message: 'Internal Server Error' });
            }
            break;

        case 'PUT':
            const { description } = req.body;

            try {
                const updatedTodo = await prisma.todo.update({
                    where: {
                        id: parseInt(todoId),
                    },
                    data: {
                        description,
                    },
                });

                res.status(200).json(updatedTodo);
            } catch (error) {
                res.status(500).json({ message: 'Internal Server Error' });
            }
            break;

        default:
            res.status(405).json({ message: 'Method Not Allowed' });
            break;
    }
}
