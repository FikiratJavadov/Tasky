import { Request, Response } from 'express';
import { prisma } from '../db';

export const createComment = async (req: Request, res: Response) => {
  const { content, taskId } = (req.body as any) ?? {};

  if (!content || !taskId)
    return res.status(400).json({ message: 'Invalid inputs' });

  try {
    const newComment = await prisma.comment.create({
      data: {
        content: content,
        taskId: taskId,
      },
    });

    res.status(401).json({ data: newComment });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
};
