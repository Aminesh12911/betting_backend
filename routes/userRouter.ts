import express from 'express';

import * as UserController from '../controllers/userController';
import { validateUser, validateAdminOnly } from '../middlewares/authMiddleware';
import getUserStats from '../controllers/userStatsController';

const router = express.Router();

router
  .route('/')
  .get(validateUser, validateAdminOnly, UserController.getAllUser)
  .post(UserController.createUser);
router
  .route('/:username')
  .get(validateUser, UserController.getUser)
  .put(validateUser, UserController.updateuser)
  .delete(validateUser, UserController.deleteUser);
router
  .route('/:username/stats')
  .get(validateUser, validateAdminOnly, getUserStats);

export default router;
