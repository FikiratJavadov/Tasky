import { Router } from 'express';
import * as commentController from '../controllers/commentController';


const commentRoute = Router();

// commentRoute.get('/', commentController.getTasks);
commentRoute.post('/', commentController.createComment);
// commentRoute.patch('/:id', commentController.updateTask);

export { commentRoute };
