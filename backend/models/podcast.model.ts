import { Schema, model } from "mongoose";
import { postFindHelper, postSaveHelper } from "../helpers";
import { IPodcast, IPoster } from "../interfaces";

const PodcastSchema = new Schema<IPodcast>(
  {
    name: { type: String, required: true },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    variants: [
      {
        ref: "Variant",
        type: Schema.Types.ObjectId,
      },
    ],
    description: { type: String, required: true },
    slug: String,
    primaryImage: String,
    thumbnail: String,
    author: String,
    createdAt: { type: Date },
    updatedAt: { type: Date },
    publishedAt: { type: Date },
    views: { type: Number, default: 0 },
    poster: {
      email: String,
      name: String,
    },
  },
  { timestamps: true }
);

PodcastSchema.post(["find", "findOne"], postFindHelper);
PodcastSchema.post("save", postSaveHelper);

export const PodcastModel = model<IPodcast>("Podcast", PodcastSchema);
