import express from 'express';

import { getWinList } from '../controllers/winlistController';
import { validateUser, validateAdminOnly } from '../middlewares/authMiddleware';

const router = express.Router();

router.route('/').get(validateUser, getWinList);
export default router;
