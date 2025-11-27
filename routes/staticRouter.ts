import express from 'express';

import {
  createText,
  updateText,
  deleteText,
} from '../controllers/staticTextController';

import { saveImage, deleteImage } from '../controllers/staticBannerController';

import { validateAdminOnly, validateUser } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(validateUser, validateAdminOnly);
// text routes
router.route('/text').post(createText);
router.route('/text/:textID').put(updateText).delete(deleteText);

// banner image routes
router.route('/banner').post(saveImage);
router.route('/banner/:id').delete(deleteImage);

export default router;
