export interface IUnplashPhoto {
  id: string;
  created_at: string;
  updated_at: string;
  promoted_at: any;
  width: number;
  height: number;
  color: string;
  blur_hash: string;
  description: any;
  alt_description: string;
  urls: IUnplashUrls;
  links: IUnsplashLinks;
  likes: number;
  liked_by_user: boolean;
  current_user_collections: any[];
  sponsorship: any;
  topic_submissions: IUnsplashTopicSubmissions;
  user: IUnplashUser;
  tags: IUnplashTag[];
}

interface IUnplashUrls {
  raw: string;
  full: string;
  regular: string;
  small: string;
  thumb: string;
  small_s3: string;
}

interface IUnsplashLinks {
  self: string;
  html: string;
  download: string;
  download_location: string;
}

interface IUnsplashTopicSubmissions {}

interface IUnplashUser {
  id: string;
  updated_at: string;
  username: string;
  name: string;
  first_name: string;
  last_name: string;
  twitter_username: any;
  portfolio_url: string;
  bio: string;
  location: string;
  links: IUnplashLinks2;
  profile_image: IUnsplashProfileImage;
  instagram_username: string;
  total_collections: number;
  total_likes: number;
  total_photos: number;
  accepted_tos: boolean;
  for_hire: boolean;
  social: IUnsplashSocial;
}

interface IUnplashLinks2 {
  self: string;
  html: string;
  photos: string;
  likes: string;
  portfolio: string;
  following: string;
  followers: string;
}

interface IUnsplashProfileImage {
  small: string;
  medium: string;
  large: string;
}

interface IUnsplashSocial {
  instagram_username: string;
  portfolio_url: string;
  twitter_username: any;
  paypal_email: any;
}

interface IUnplashTag {
  type: string;
  title: string;
}
