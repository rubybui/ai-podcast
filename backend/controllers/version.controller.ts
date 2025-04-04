import { Request } from "express";
import { ICustomResponse } from "../middlewares";
import { ICreateVariantRequest } from "../interfaces";
import { VersionModel } from "../models";
import { StatusCodeEnum } from "../enums";

export async function getVersion(req: Request, res: ICustomResponse) {
  const { id } = req.params;

  const version = await VersionModel.find({
    _id: id,
  });

  if (!version) {
    return res.error({
      statusCode: StatusCodeEnum.NOT_FOUND,
    });
  }

  return res.success({
    data: version,
  });
}

export async function deleteVersion(
  req: Request<any, any, ICreateVariantRequest>,
  res: ICustomResponse
) {
  const { id } = req.params;

  const deleteResult = await VersionModel.deleteOne({
    _id: id,
  });

  if (deleteResult.deletedCount === 0) {
    return res.error({
      statusCode: StatusCodeEnum.NOT_FOUND,
    });
  }
  return res.success({ statusCode: StatusCodeEnum.NO_CONTENT });
}
