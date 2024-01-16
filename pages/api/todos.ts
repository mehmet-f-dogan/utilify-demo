import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET':
            try {
                const todos = await prisma.todo.findMany();
                res.status(200).json(todos);
            } catch (error) {
                res.status(500).json({ message: 'Internal Server Error' });
            }
            break;

        case 'POST':
            try {
                const { name, description } = req.body;
                const todo = await prisma.todo.create({
                    data: {
                        name,
                        description,
                    },
                });
                res.status(201).json(todo);
            } catch (error) {
                res.status(500).json({ message: 'Internal Server Error' });
            }
            break;

        default:
            res.status(405).json({ message: 'Method Not Allowed' });
            break;
    }
}
