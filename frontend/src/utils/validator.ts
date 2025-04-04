import { string, object, array, number, boolean, mixed } from "yup";

const LIMIT_CONTENT_CHARACTER = 5000;
const LIMIT_NAME_CHARACTER = 50;
const podcastVariantValidator = object().shape({
  variantName: string()
  .required("Chapter name is required")
  .max(
    LIMIT_NAME_CHARACTER,
    `Chapter name must be shorter than ${LIMIT_NAME_CHARACTER} characters`
  ),
  content: string()
    .required("Podcast content is required")
    .max(
      LIMIT_CONTENT_CHARACTER,
      `Podcast content must be shorter than ${LIMIT_CONTENT_CHARACTER} characters`
    ),
  speed: array()
    .of(number())
    .min(1, "Please select at least one speed")
    .required("Podcast speed is required"),
  order: number(),
  voiceName: string().required("Podcast voice is required"),
  tone: string().required("Podcast tone is required"),
});

export const createPodcastValidator = object().shape({
  name: string().required("Podcast name is required"),
  categories: array()
    .of(string())
    .min(1, "Please select at least one category")
    .required("Podcast category is required"),
  description: string().required("Podcast description is required"),
  variants: array().of(podcastVariantValidator),
});
