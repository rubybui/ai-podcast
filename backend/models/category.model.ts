import { model, Schema } from "mongoose";
import { postFindHelper, postSaveHelper } from "../helpers";
import { ICategory } from "../interfaces";

const CategorySchema = new Schema<ICategory>({
  name: {
    type: String,
    require: true,
  },
  bannerUrl: String,
});

CategorySchema.post(["find", "findOne"], postFindHelper);
CategorySchema.post("save", postSaveHelper);

export const CategoryModel = model<ICategory>("Category", CategorySchema);
