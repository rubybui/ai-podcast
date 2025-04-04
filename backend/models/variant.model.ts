import { Schema, model } from "mongoose";
import { IVariant } from "../interfaces";

const VariantSchema = new Schema<IVariant>({
  name: { type: String, required: true },
  content: { type: String, required: true },
  podcast: { type: Schema.Types.ObjectId, ref: "Podcast" },
  order: { type: Number, required: true},
  versions: [
    {
      ref: "Version",
      type: Schema.Types.ObjectId,
    },
  ],
});
export const VariantModel = model<IVariant>("Variant", VariantSchema);
