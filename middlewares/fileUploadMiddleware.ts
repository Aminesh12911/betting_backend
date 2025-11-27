import multer from 'multer';
import * as fs from 'fs';
import { Types } from 'mongoose';
import IRequestExtended from '../types/Requet';

import AppError from '../utils/appError';
import { BannerSavePath } from '../constants';

const storage = multer.diskStorage({
  destination(req, file, cb) {
    fs.mkdirSync(BannerSavePath, { recursive: true });
    cb(null, BannerSavePath);
  },
  filename(req, file, cb) {
    const ext = file.mimetype.split('/')[1];
    const fileName = `${new Types.ObjectId()}.${ext}`;
    cb(null, fileName);
  },
});

const fileFilter = (
  req: IRequestExtended,
  file: Express.Multer.File,
  cb: (error: Error | null, status?: boolean | undefined) => void
) => {
  if (file.mimetype.startsWith('image')) cb(null, true);
  else cb(new AppError('Please upload only image files', 400));
};

export default multer({ storage, fileFilter });
