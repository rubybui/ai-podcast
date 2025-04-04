import { Schema, model } from "mongoose";
import { IPlaylist } from "../interfaces";

const PlaylistSchema = new Schema<IPlaylist>({
  name: { type: String, required: true },
  user: {
    ref: "User",
    type: Schema.Types.ObjectId,
  },
  podcasts: [
    {
      ref: "Podcast",
      type: Schema.Types.ObjectId,
    },
  ],
});

export const PlaylistModel = model<IPlaylist>("Playlist", PlaylistSchema);
