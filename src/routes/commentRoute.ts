import { Router } from 'express';
import * as commentController from '../controllers/commentController';

const commentRoute = Router();

commentRoute.get('/:taskId', commentController.getCommentByTaskId);
commentRoute.post('/', commentController.createComment);

export { commentRoute };
