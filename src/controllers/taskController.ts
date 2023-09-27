import { Request, Response } from 'express';
import { prisma } from '../db';
import { Prisma } from '@prisma/client';

type PostCreateBody = Prisma.Args<typeof prisma.task, 'create'>['data'];

export const getTasks = async (req: Request, res: Response) => {
  const allTasks = await prisma.task.findMany();
  res.status(200).json({ data: allTasks });
};

export const createTask = async (req: Request, res: Response) => {
  const { name, columnId } = (req.body as PostCreateBody) ?? {};

  if (!name || !columnId)
    return res.status(404).json({ message: 'Missing some fields' });

  const newTask = await prisma.task.create({
    data: {
      name,
      column: {
        connect: {
          id: columnId,
        },
      },
    },
  });

  res.status(201).json({ data: newTask });
};
