import { Router } from "express";
import {
  createPlaylist,
  listPlaylists,
  updatePlaylist,
} from "../controllers/playlist.controller";
import { controllerWrapper } from "../middlewares";

const router = Router();

router.get("/", controllerWrapper(listPlaylists));
router.post("/", controllerWrapper(createPlaylist));
router.patch("/:id", controllerWrapper(updatePlaylist));

export const playlistRouter = router;
