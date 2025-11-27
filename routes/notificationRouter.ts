import express, { Request } from 'express';
import { validateUser, validateAdminOnly } from '../middlewares/authMiddleware';
import sendNotification from '../utils/notifications';
import IResponse from '../types/Response';

const router = express.Router();
router
  .route('/')
  .post(validateUser, validateAdminOnly, async (req: Request, res) => {
    const { topic, title, content } = req.body;
    sendNotification({
      topic,
      title,
      body: content,
    });
    const payload: IResponse = { status: 'success', data: {} };
    return res.status(200).json(payload);
  });
export default router;
