import { Types } from "mongoose";

export interface IPlaylist {
  name: string;
  user: Types.ObjectId;
  podcasts: Types.ObjectId[];
}
