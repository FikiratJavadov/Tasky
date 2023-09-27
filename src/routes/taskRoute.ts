import { Router } from 'express';
import * as taskController from '../controllers/taskController';

const taskRouter = Router();

taskRouter.get('/', taskController.getTasks);
taskRouter.post('/', taskController.createTask);

export { taskRouter };
