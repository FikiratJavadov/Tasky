import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { boardRouter } from './src/routes/boardRoute';
import { taskRouter } from './src/routes/taskRoute';
import { columnRouter } from './src/routes/columnRoute';
import { commentRoute } from './src/routes/commentRoute';
import { prisma } from './src/db';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

//Routes
app.use('/board', boardRouter);
app.use('/task', taskRouter);
app.use('/column', columnRouter);
app.use('/comment', commentRoute);

async function startServer() {
  await prisma.$connect();
  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
}

startServer().catch((e) => console.error(e));
