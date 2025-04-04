import { Router } from "express";
import { uploadFile } from "../controllers";
import { uploadMiddleware } from "../middlewares";
const router = Router();

router.post("/", uploadMiddleware.single("image"), uploadFile);

export const uploadRouter = router;
