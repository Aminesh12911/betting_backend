import express from 'express';

import {
  getOffers,
  createOffer,
  deleteOffer,
} from '../controllers/offerController';

import { validateUser, validateAdminOnly } from '../middlewares/authMiddleware';

const router = express.Router();
router
  .route('/')
  .get(getOffers)
  .post(validateUser, validateAdminOnly, createOffer);
router.route('/:id').delete(validateUser, validateAdminOnly, deleteOffer);

export default router;
