import express from 'express';

import {
  createBid,
  getAllBids,
  getBid,
  updateBid,
  deleteBid,
} from '../controllers/bidController';
import { validateUser } from '../middlewares/authMiddleware';

const router = express.Router();

router.route('/').get(getAllBids).post(validateUser, createBid);

router
  .route('/:bidId')
  .get(getBid)
  .put(validateUser, updateBid)
  .delete(validateUser, deleteBid);

export default router;
