import multer, { FileFilterCallback } from "multer";
import * as fs from "fs";
import { Types } from "mongoose";
import IRequestExtended from "../types/Requet";
import AppError from "../utils/appError";
import { BannerSavePath } from "../constants";

// ---- FIX: ensure folder exists safely ----
const storage = multer.diskStorage({
  destination(req, file, cb) {
    try {
      fs.mkdirSync(BannerSavePath, { recursive: true });
    } catch (e) {
      console.error("Error creating upload folder:", e);
    }
    cb(null, BannerSavePath);
  },

  filename(req, file, cb) {
    const ext = file.mimetype.split("/")[1] || "png";
    const fileName = `${new Types.ObjectId().toString()}.${ext}`;
    cb(null, fileName);
  },
});

// ---- FIX: Use correct type for fileFilter ----
const fileFilter = (
  req: IRequestExtended,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Please upload only image files", 400));
  }
};

// ---- FIX: Export properly typed Multer instance ----
const upload = multer({
  storage,
  fileFilter,
});

export default upload;
