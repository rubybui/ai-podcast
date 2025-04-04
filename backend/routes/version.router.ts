import { Router } from "express";
import { getVersion, deleteVersion } from "../controllers/version.controller";
import { controllerWrapper } from "../middlewares";

const router = Router();

router.get("/:id", controllerWrapper(getVersion));
router.delete("/:id", controllerWrapper(deleteVersion));

export const versionRouter = router;
