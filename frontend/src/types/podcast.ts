import { IBoundary } from "./boundary";
import { ICategory } from "./category";

export type IPodcast = {
  _id: string;
  name: string;
  categories?: ICategory[];
  description: string;
  slug: string;
  primaryImage: string;
  thumbnail: string;
  author?: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  variants: IVariant[];
  views?: number;
  poster?: IPoster;
};

export interface IPoster {
  name?: string;
  email?: string;
}

export interface IVariant {
  _id: string;
  name: string;
  content: string;
  order: number;
  versions: IAudio[];
}

export interface IAudio {
  audioName: string;
  speed: number;
  voiceName: string;
  style?: string;
  transcript: ITranscript[];
}

export interface ITranscript extends IBoundary {
  words: IBoundary[];
}

export interface ICreatePodcastFormData {
  name: string;
  description: string;
  author: string;
  categories: string[];
  primaryImage: string;
  variants: ICreatePodcastVariant[];
  poster: IPoster;
}

export interface ICreatePodcastVariant {
  variantName: string;
  order: number;
  content: string;
  speed: number[];
  voiceName: string;
  tone: string;
}

export interface IRecentPlayedPodcast {
  _id: string;
  slug: string;
  name: string;
  primaryImage: string;
}

export interface IPagination {
  currentPage: number;
  perPage: number;
  total: number;
  totalPages: number;
};