import { AppConfig } from "@/config";

const defaultImage = "/img/podcast/microphone.png";

export const converseTimeToNumber = (time: string) => {
  return parseInt(
    time.includes("ms") ? time?.substring(0, time.length - 2) : time // transcripts of old podcasts are "{number}ms" instead of "{number}"
  );
};

export const isProduction = process.env.NODE_ENV === "production";

export const formatNumber = (num: number) => {
  // formatNumber(1000) // Output: "1K"
  // formatNumber(1543) // Output: "1.5K"
  // formatNumber(2000000) // Output: "2M"

  if (num >= 1000000) {
    const formatted = (num / 1000000).toFixed(1);
    return formatted.replace(/\.0$/, "") + "M";
  } else if (num >= 1000) {
    const formatted = (num / 1000).toFixed(1);
    return formatted.replace(/\.0$/, "") + "K";
  } else {
    return num.toString();
  }
};

export const getPodcastThumbnail = (podcast: any) => {
  if (podcast?.primaryImage) {
    if (podcast.primaryImage.includes("unsplash")) {
      return podcast.primaryImage;
    }
    return `${AppConfig.imageUrl}${podcast?.primaryImage}`;
  }
  return defaultImage;
};

export const getImageUrl = (object: Record<string, any>, key: string) => {
  if (object[key]) {
    if (object[key].includes("unsplash")) {
      return object[key];
    }
    return `${AppConfig.imageUrl}${object[key]}`;
  }
  return defaultImage;
};
