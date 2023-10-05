import { Request, Response } from 'express';
import { prisma } from '../db';
import { Prisma } from '@prisma/client';

enum Columns {
  QUEUE = 'Queue',
  DEVELOPMENT = 'Development',
  DONE = 'Done',
}

const allowToUpate = ['name', 'description', 'priority', "columnId"];

type PostCreateBody = Prisma.Args<typeof prisma.task, 'create'>['data'];

export const getTasks = async (req: Request, res: Response) => {
  const allTasks = await prisma.task.findMany();
  res.status(200).json({ data: allTasks });
};

export const createTask = async (req: Request, res: Response) => {
  const { name, columnId } = (req.body as PostCreateBody) ?? {};

  if (!name || !columnId)
    return res.status(404).json({ message: 'Missing some fields' });

  try {
    const column = await prisma.column.findUnique({
      where: {
        id: columnId,
        name: Columns.QUEUE,
      },
    });

    console.log({ column });

    if (!column)
      return res
        .status(404)
        .json({ message: 'You can create task only in QUEUE' });

    const newTask = await prisma.task.create({
      data: {
        name: name,
        columnId: columnId,
      },
    });

    res.status(201).json({ data: newTask });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export const createSubTask = async (req: Request, res: Response) => {
  const { name } = (req.body as PostCreateBody) ?? {};

  const { parentId } = req.params;
  console.log(parentId);

  if (!name || !parentId || isNaN(+parentId))
    return res.status(404).json({ message: 'Missing some fields' });

  try {
    const taskParent = await prisma.task.findUnique({
      where: {
        id: +parentId,
        parentId: null,
      },
    });

    if (!taskParent)
      return res.status(400).json({ message: 'Error creating subtask' });

    const subTask = await prisma.task.create({
      data: {
        name,
        parentId: +parentId,
      },
      include: {
        subTasks: true
      }
    });

    res.status(201).json({
      data: {
        subTask: subTask,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  const body = req.body;
  const param = req.params as { id: string };

  const newBody = allowToUpate.reduce<any>((obj, current) => {
    if (body[current]) {
      return { ...obj, [current]: body[current] };
    } else {
      return obj;
    }
  }, {});

  if (!param || !newBody)
    return res.status(400).json({ message: 'Wrong input' });

  if (isNaN(Number(param.id))) return res.status(400);

  try {
    const updatedTask = await prisma.task.update({
      where: {
        id: +param.id,
      },
      data: newBody,
    });

    res.status(201).json({ data: updatedTask });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
};
