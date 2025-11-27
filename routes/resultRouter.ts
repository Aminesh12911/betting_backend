import express from 'express';

import {
  getAllResults,
  getResult,
  updateResult,
  deleteResult,
  createResult,
} from '../controllers/resultCotroller';

import { validateAdminOnly, validateUser } from '../middlewares/authMiddleware';

const router = express.Router();
router
  .route('/')
  .get(getAllResults)
  .post(validateUser, validateAdminOnly, createResult);

router
  .route('/:resultID')
  .get(getResult)
  .put(validateUser, validateAdminOnly, updateResult)
  .delete(validateUser, validateAdminOnly, deleteResult);

export default router;
