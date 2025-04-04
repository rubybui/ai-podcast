import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";

import { connectToDb } from "./services";
import { AppConfig } from "./config";
import { customApiResponse, errorHandling } from "./middlewares";
import {
  categoryRouter,
  podcastRouter,
  variantRouter,
  uploadRouter,
  versionRouter,
  userRouter,
  codaRouter,
  playlistRouter,
} from "./routes";

export const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(customApiResponse);

const api = express.Router();
app.use("/api", api);
api.use("/podcasts", podcastRouter);
api.use("/categories", categoryRouter);
api.use("/upload", uploadRouter);
api.use("/variants", variantRouter);
api.use("/versions", versionRouter);
api.use("/survey", codaRouter);
api.use("/users", userRouter);
api.use("/playlists", playlistRouter);

app.use(errorHandling);

if (AppConfig.nodeEnv !== "test") {
  connectToDb().then(() => {
    app.listen(AppConfig.port, () =>
      console.log(`🚀 Server ready at: http://localhost:${AppConfig.port}`)
    );
  });
}
