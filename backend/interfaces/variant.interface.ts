import { Types } from "mongoose";
import { ITranscript } from "./podcast.interface";

export interface ICreateVersionRequest {
  voiceName?: string;
  speed?: number;
  style?: string;
}

export interface ICreateVariantRequest {
  name: string;
  content: string;
  order: number;
}

export interface IVariant {
  name: string;
  content: string;
  versions: Types.ObjectId[];
  podcast: Types.ObjectId;
  order: number;
}

export interface IVersion {
  variant: Types.ObjectId;
  speed: number;
  voiceName: string;
  style?: string;
  audioName?: string;
  transcript?: ITranscript[];
  duration?: number;
  status: "created" | "finished";
}
