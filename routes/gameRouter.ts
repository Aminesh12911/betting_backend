import express from 'express';

import {
  createGame,
  updateGame,
  getGame,
  getAllGames,
  deleteGame,
} from '../controllers/gameController';
import { validateUser, validateAdminOnly } from '../middlewares/authMiddleware';

const router = express.Router();

router
  .route('/')
  .get(getAllGames)
  .post(validateUser, validateAdminOnly, createGame);

router
  .route('/:gameId')
  .get(getGame)
  .put(validateUser, validateAdminOnly, updateGame)
  .delete(validateUser, validateAdminOnly, deleteGame);
export default router;
