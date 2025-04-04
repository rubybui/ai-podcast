import { Schema, model } from "mongoose";
import { IUser } from "../interfaces";

const UserSchema = new Schema<IUser>({
  providerId: String,
  email: { type: String, required: true },
  name: { type: String, required: true },
  image: String,
  lastLogin: { type: Date },
});

export const UserModel = model<IUser>("User", UserSchema);
