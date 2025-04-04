import { Router } from "express";
import {
  createCategory,
  listCategories,
  updateCategory,
  deleteCategory,
  getCategory,
} from "../controllers";
import { CreateCategoryRequest } from "../dto";
import { validateRequest, controllerWrapper } from "../middlewares";

const router = Router();

router.get("/", controllerWrapper(listCategories));
router.get("/:id", getCategory);
router.post(
  "/",
  validateRequest(CreateCategoryRequest),
  controllerWrapper(createCategory)
);
router.patch("/:id", controllerWrapper(updateCategory));
router.delete("/:id", controllerWrapper(deleteCategory));

export const categoryRouter = router;
