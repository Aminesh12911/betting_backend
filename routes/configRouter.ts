import express from 'express';

import {
  createConfig,
  getConfig,
  updateConfig,
} from '../controllers/configController';
import { validateAdminOnly, validateUser } from '../middlewares/authMiddleware';

const router = express.Router();
router
  .route('/')
  .get(getConfig)
  .post(validateUser, validateAdminOnly, createConfig)
  .put(validateUser, validateAdminOnly, updateConfig);
router.route('/text').get().post().put().delete();
router.route('/banner').get().post().put().delete();

export default router;
