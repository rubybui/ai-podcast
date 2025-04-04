import { Router } from "express";
import {
  createUser,
  listUsers,
  getUser,
  deleteUser,
} from "../controllers/user.controller";
import { controllerWrapper } from "../middlewares";

const router = Router();

router.post("/", controllerWrapper(createUser));
router.get("/", controllerWrapper(listUsers));
router.get("/:id", controllerWrapper(getUser));
router.delete("/:id", controllerWrapper(deleteUser));

export const userRouter = router;
