import { Types } from "mongoose";
import { IBoundary } from "./boundary.interface";

export interface IPoster {
  email: string;
  name: string;
}

export interface IPodcast {
  name: string;
  categories?: Types.ObjectId[];
  description: string;
  slug?: string;
  primaryImage: string;
  thumbnail: string;
  author?: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  variants: Types.ObjectId[];
  views?: number;
  poster?: IPoster;
}

export interface ITranscript extends IBoundary {
  words: IBoundary[];
}
