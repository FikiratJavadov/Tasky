import { Request, Response } from 'express';
import { prisma } from '../db';

export const getBoards = async (req: Request, res: Response) => {
  const allBoard = await prisma.board.findMany({
    include: {
      columns: true,
    },
  });
  res.status(200).json({ data: allBoard });
};

export const createBoard = async (req: Request, res: Response) => {
  const { name } = req.body ?? {};
  if (!name) return res.status(404).json({ message: 'Name is missing' });

  const newBoard = await prisma.board.create({
    data: {
      name,
      columns: {
        create: [{ name: 'Queue' }, { name: 'Development' }, { name: 'Done' }],
      },
    },
  });

  res.status(201).json({ data: newBoard });
};
