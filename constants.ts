import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const BannerSavePath = path.join(
  __dirname,
  process.env.BANNER_IMG_PATH || ''
);

export default BannerSavePath;
