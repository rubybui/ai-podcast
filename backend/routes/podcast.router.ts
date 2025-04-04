import { Router } from "express";
import {
  createPodcast,
  listPodcasts,
  getPodcast,
  updatePodcast,
  deletePodcast,
  listLatestPodcasts,
  listMyPodcasts,
  listTrendingPodcasts,
  searchPodcasts,
} from "../controllers";
import {
  createVariant,
  createVersion,
} from "../controllers/variant.controller";
import {
  CreatePodcastRequest,
  CreateVariantRequest,
  CreateVersionRequest,
} from "../dto";
import { validateRequest, controllerWrapper } from "../middlewares";
const router = Router();

router.post(
  "/",
  validateRequest(CreatePodcastRequest),
  controllerWrapper(createPodcast)
);
router.get("/", controllerWrapper(listPodcasts));
router.get("/myPodcasts", controllerWrapper(listMyPodcasts));
router.get("/trending", controllerWrapper(listTrendingPodcasts));
router.get("/latest", controllerWrapper(listLatestPodcasts));
router.get("/search", controllerWrapper(searchPodcasts));
router.get("/:id", controllerWrapper(getPodcast));
router.patch("/:id", controllerWrapper(updatePodcast));
router.delete("/:id", controllerWrapper(deletePodcast));

// VARIANT
router.post(
  "/:id/variants",
  validateRequest(CreateVariantRequest),
  controllerWrapper(createVariant)
);
router.post(
  "/:id/variants/:variantId/versions",
  validateRequest(CreateVersionRequest),
  controllerWrapper(createVersion)
);

export const podcastRouter = router;
