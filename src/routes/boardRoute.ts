import { Router } from 'express';
import * as boardController from '../controllers/boardController';

const boardRouter = Router();

boardRouter.get('/', boardController.getBoards);
boardRouter.post('/', boardController.createBoard);

export { boardRouter };
