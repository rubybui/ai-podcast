import { ICustomResponse } from "../middlewares";
import { Request } from "express";
import { ICreateVariantRequest, ICreateVersionRequest } from "../interfaces";
import { PodcastModel, VariantModel, VersionModel } from "../models";
import { convertTextToSpeechMultiPart, fileService } from "../services";
import slugify from "slugify";
import { StatusCodeEnum } from "../enums";

export async function createVariant(
  req: Request<any, any, ICreateVariantRequest>,
  res: ICustomResponse
) {
  const { id: podcastId } = req.params;
  const { name, content, order } = req.body;

  const podcast = await PodcastModel.findOne({ _id: podcastId }, "_id").lean();
  if (!podcast) {
    return res.error({
      statusCode: StatusCodeEnum.NOT_FOUND,
    });
  }

  const variant = await VariantModel.create({
    name,
    content,
    order,
    podcast: podcastId,
  });

  await PodcastModel.updateOne(
    { _id: podcast._id },
    { $push: { variants: variant._id } },
    { new: true, upsert: true }
  );

  return res.success({
    data: variant,
    statusCode: StatusCodeEnum.CREATED,
  });
}

export async function getVariant(req: Request, res: ICustomResponse) {
  const { id } = req.params;

  const variant = await VariantModel.find({
    _id: id,
  }).populate({
    path: "versions",
  });

  if (!variant) {
    return res.error({
      statusCode: StatusCodeEnum.NOT_FOUND,
    });
  }

  return res.success({
    data: variant,
  });
}

export async function updateVariant(req: Request, res: ICustomResponse) {
  const id = req.params.id;
  const { name, content, order } = req.body;

  const updatedVariant = await VariantModel.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        name,
        content,
        order
      },
    },
    {
      new: true,
    }
  );
  if (!updatedVariant) {
    return res.error({
      statusCode: StatusCodeEnum.NOT_FOUND,
    });
  }
  return res.success({
    data: updatedVariant,
  });
}

export async function deleteVariant(req: Request, res: ICustomResponse) {
  const { id } = req.params;

  const deleteResult = await VariantModel.deleteOne({
    _id: id,
  });

  if (deleteResult.deletedCount === 0) {
    return res.error({
      statusCode: StatusCodeEnum.NOT_FOUND,
    });
  }
  return res.success({ statusCode: StatusCodeEnum.NO_CONTENT });
}

export async function createVersion(
  req: Request<any, any, ICreateVersionRequest>,
  res: ICustomResponse
) {
  const { id: podcastId, variantId } = req.params;
  const {
    voiceName = "en-US-JennyNeural",
    speed = 0.95,
    style = "",
  } = req.body;

  let [podcast, variant, version] = await Promise.all([
    PodcastModel.findOne({ _id: podcastId }, "name").lean(),
    VariantModel.findOne({
      _id: variantId,
      podcast: podcastId,
    }).lean(),
    VersionModel.findOne({
      variant: variantId,
      speed,
      voiceName,
    }),
  ]);

  if (!variant || !podcast) {
    return res.error({
      statusCode: StatusCodeEnum.NOT_FOUND,
    });
  }

  if (version) {
    return res.error({
      statusCode: StatusCodeEnum.CONFLICT,
      message: `CONFLICT - Version is existed - ${version._id}`,
    });
  }

  version = await VersionModel.create({
    variant: variantId,
    speed,
    voiceName,
  });
  const { buffer, transcript, duration } = await convertTextToSpeechMultiPart({
    content: variant.content,
    speed,
    voiceName,
  });
  const fileName =
    slugify(`${podcast.name}-${speed}-${voiceName}-${style}-${Date.now()}`, {
      lower: true,
      strict: true,
    }) + ".wav";
  await fileService.uploadFileMultipart(buffer, fileName);
  version.audioName = fileName;
  version.transcript = transcript;
  version.duration = duration;
  version.status = "finished";
  await version.save();

  await VariantModel.updateOne(
    { _id: variant._id },
    { $push: { versions: version._id } },
    { new: true, upsert: true }
  );

  return res.success({
    data: version,
  });
}
