import * as multer from "multer";

export const uploadMiddleware = multer({
  limits: {
    fileSize: 4 * 1024 * 1024,
  },
});
