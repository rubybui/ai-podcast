import { Request } from "express";
import { isValidObjectId } from "mongoose";
import slugify from "slugify";
import { StatusCodeEnum } from "../enums";
import { ICustomResponse } from "../middlewares/api-response.middleware";
import { PodcastModel } from "../models";

const MAX_SEARCH_RESULTS = 10;
const MAX_TRENDING_PODCASTS = 4;
const MAX_LATEST_PODCASTS = 8;
const MAX_CATEGORIES_PODCASTS = 10;
const PAGE_SIZE = 20;

export async function createPodcast(req: Request, res: ICustomResponse) {
  const {
    name,
    author,
    description,
    categories,
    primaryImage,
    thumbnail,
    poster
  } = req.body;

  const podcast = await PodcastModel.create({
    name,
    author,
    description,
    primaryImage,
    thumbnail,
    categories,
    poster
  });

  const slug =
    slugify(name, {
      lower: true,
      strict: true
    }).slice(0, 40) +
    "-" +
    podcast._id.toString().slice(-4);

  const podcastWithSlug = await PodcastModel.findOneAndUpdate(
    { _id: podcast._id },
    {
      $set: {
        slug
      }
    },
    {
      new: true
    }
  );

  return res.success({
    data: podcastWithSlug,
    statusCode: StatusCodeEnum.CREATED
  });
}

export const searchPodcasts = async (req: Request, res: ICustomResponse) => {
  const { name } = req.query;

  if (!name) {
    return res.error({
      statusCode: StatusCodeEnum.NO_CONTENT
    });
  }

  const podcasts = await PodcastModel.find({
    name: {
      $regex: name,
      $options: "i"
    }
  })
    .limit(MAX_SEARCH_RESULTS)
    .lean();

  if (!podcasts) {
    return res.error({
      statusCode: StatusCodeEnum.NOT_FOUND
    });
  }

  return res.success({
    data: podcasts
  });
};

export const listTrendingPodcasts = async (
  req: Request,
  res: ICustomResponse
) => {
  const podcasts = await PodcastModel.find()
    .sort({ views: -1 })
    .limit(MAX_TRENDING_PODCASTS);

  return res.success({
    data: podcasts
  });
};

export const listLatestPodcasts = async (
  req: Request,
  res: ICustomResponse
) => {
  const podcasts = await PodcastModel.find()
    .sort({ createdAt: -1 })
    .limit(MAX_LATEST_PODCASTS);

  return res.success({
    data: podcasts
  });
};

export const listMyPodcasts = async (req: Request, res: ICustomResponse) => {
  const { email, author } = req.query;

  // TODO: should also check if the request is from the email owner
  if (!email) {
    return res.error({
      statusCode: StatusCodeEnum.NOT_FOUND
    });
  }

  const podcasts = await PodcastModel.find({
    $or: [{ "poster.email": { $eq: email } }, { author: { $eq: author } }]
  }).sort({
    createdAt: -1
  });

  return res.success({
    data: podcasts
  });
};

export const listPodcasts = async (req: Request, res: ICustomResponse) => {
  const {
    categories,
    page = 1
  }: { categories?: string | string[]; page?: number } = req.query;
  const filters: any = {};

  if (typeof categories === "string" && isValidObjectId(categories)) {
    filters.categories = categories;
  }

  if (categories && Array.isArray(categories)) {
    const orFilter = (categories as string[])
      .filter((id) => isValidObjectId(id))
      .map((cat) => ({ categories: cat }));
    if (orFilter.length > 0) {
      filters["$or"] = orFilter;
    }
  }

  const customPageSize = categories ? MAX_CATEGORIES_PODCASTS : PAGE_SIZE;
  const count = await PodcastModel.countDocuments(filters);
  const podcasts = await PodcastModel.find(filters)
    .sort({ createdAt: -1 })
    .skip((page - 1) * customPageSize)
    .limit(customPageSize);

  return res.success({
    data: podcasts,
    pagination: {
      currentPage: page,
      perPage: customPageSize,
      total: count,
      totalPages: Math.ceil(count / customPageSize)
    }
  });
};

export async function getPodcast(req: Request, res: ICustomResponse) {
  const { id } = req.params;
  let query: any = { _id: id };
  if (!isValidObjectId(id)) {
    query = { slug: id };
  }
  const podcast = await PodcastModel.findOne(query)
    .populate("categories", "_id name")
    .populate({
      path: "variants",
      populate: { path: "versions", options: { sort: { speed: 1 } } },
      options: {
        sort: {
          order: 1,
          name: -1
        }
      }
    })
    .lean();

  if (!podcast) {
    return res.error({
      statusCode: StatusCodeEnum.NOT_FOUND
    });
  }
  const aggregateResult = await PodcastModel.aggregate([
    {
      $facet: {
        latestPodcasts: [
          {
            $match: {
              $nor: [{ _id: podcast._id }]
            }
          },
          { $sort: { createdAt: -1 } },
          { $limit: 5 },
          {
            $project: {
              _id: 1,
              name: 1,
              primaryImage: 1,
              slug: 1
              // author: 1,
              // createdAt: 1,
              // variant,
            }
          }
        ],
        categoriesPodcasts: [
          { $sort: { createdAt: -1 } },
          {
            $match: {
              $nor: [{ _id: podcast._id }],
              categories: { $in: podcast.categories.map((i) => i._id) }
            }
          },
          { $limit: 5 },
          { $project: { _id: 1, name: 1, primaryImage: 1, slug: 1 } }
        ]
      }
    }
  ]);
  let responseData: any = {
    podcast
  };
  if (aggregateResult?.length) {
    responseData = {
      ...responseData,
      ...aggregateResult[0]
    };
  }

  PodcastModel.findOneAndUpdate(query, { $inc: { views: 1 } }).catch();

  return res.success({
    data: responseData
  });
}

export async function updatePodcast(req: Request, res: ICustomResponse) {
  const id = req.params.id;
  const { name, description, slug, primaryImage, thumbnail } = req.body;

  const updatedPodcast = await PodcastModel.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        name,
        description,
        slug,
        primaryImage,
        thumbnail
      }
    },
    {
      new: true
    }
  );
  if (!updatedPodcast) {
    return res.error({
      statusCode: StatusCodeEnum.NOT_FOUND
    });
  }
  return res.success({
    data: updatedPodcast
  });
}

export async function deletePodcast(req: Request, res: ICustomResponse) {
  const { id } = req.params;

  const deleteResult = await PodcastModel.deleteOne({
    _id: id
  });
  if (deleteResult.deletedCount === 0) {
    return res.error({
      statusCode: StatusCodeEnum.NOT_FOUND
    });
  }
  return res.success({ statusCode: StatusCodeEnum.NO_CONTENT });
}
