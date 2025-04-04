import { Router } from "express";
import {
  addReportRow,
  addSurveyOption,
  getSurveyData,
  voteSurveyOption,
} from "../controllers";

import { controllerWrapper, validateRequest } from "../middlewares";
import { CreateSurveyOptionRequest, CreateReportRowRequest } from "../dto";

const router = Router();

router.get("/", controllerWrapper(getSurveyData));

router.post(
  "/add-option",
  validateRequest(CreateSurveyOptionRequest),
  controllerWrapper(addSurveyOption)
);
router.post(
  "/add-report",
  validateRequest(CreateReportRowRequest),
  controllerWrapper(addReportRow)
);
router.post("/vote/:id", controllerWrapper(voteSurveyOption));

export const codaRouter = router;
