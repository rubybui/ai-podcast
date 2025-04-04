import { Router } from "express";
import {
  deleteVariant,
  updateVariant,
  getVariant,
} from "../controllers/variant.controller";
import { controllerWrapper } from "../middlewares";

const router = Router();

router.get("/:id", controllerWrapper(getVariant));
router.patch("/:id", controllerWrapper(updateVariant));
router.delete("/:id", controllerWrapper(deleteVariant));

export const variantRouter = router;
