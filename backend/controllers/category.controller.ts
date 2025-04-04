import { Request } from "express";
import { StatusCodeEnum } from "../enums";
import { ICustomResponse } from "../middlewares";
import { CategoryModel } from "../models";

export async function listCategories(req: Request, res: ICustomResponse) {
  const categories = await CategoryModel.find({}).lean();
  return res.success({
    data: categories,
  });
}

export async function createCategory(req: Request, res: ICustomResponse) {
  const { name, bannerUrl } = req.body;
  const category = await CategoryModel.create({ name, bannerUrl });
  return res.success({
    statusCode: StatusCodeEnum.CREATED,
    data: category,
  });
}
export async function getCategory(req: Request, res: ICustomResponse) {
  const category = await CategoryModel.findOne({ _id: req.params.id }).lean();
  if (!category) {
    return res.error({
      statusCode: StatusCodeEnum.NO_CONTENT,
    });
  }
  return res.success({
    data: category,
  });
}

export async function updateCategory(req: Request, res: ICustomResponse) {
  const id = req.params.id;
  const { name, bannerUrl } = req.body;

  const updatedCategory = await CategoryModel.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        name,
        bannerUrl,
      },
    },
    {
      new: true,
    }
  );
  if (!updatedCategory) {
    return res.error({
      statusCode: StatusCodeEnum.NOT_FOUND,
    });
  }
  return res.success({
    data: updatedCategory,
  });
}

export async function deleteCategory(req: Request, res: ICustomResponse) {
  const { id } = req.params;

  const deleteResult = await CategoryModel.deleteOne({
    _id: id,
  });
  if (deleteResult.deletedCount === 0) {
    return res.error({
      statusCode: StatusCodeEnum.NOT_FOUND,
    });
  }
  return res.success({ statusCode: StatusCodeEnum.NO_CONTENT });
}
