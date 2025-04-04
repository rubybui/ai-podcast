import { Request } from "express";
import { ICustomResponse } from "../middlewares/api-response.middleware";
import { UserModel } from "../models";
import { StatusCodeEnum } from "../enums";

export async function createUser(req: Request, res: ICustomResponse) {
  const { email, name, image, providerId } = req.body;

  const existUser = await UserModel.findOne({
    email,
  });

  if (existUser) {
    await existUser.updateOne({
      $set: {
        lastLogin: Date.now(),
      },
    });

    return res.success({
      statusCode: StatusCodeEnum.OK,
    });
  }

  const user = await UserModel.create({
    email,
    name,
    image,
    providerId,
    lastLogin: Date.now(),
  });

  return res.success({
    data: user,
    statusCode: StatusCodeEnum.CREATED,
  });
}

export async function listUsers(req: Request, res: ICustomResponse) {
  const users = await UserModel.find({}).lean();
  return res.success({
    data: users,
    statusCode: StatusCodeEnum.CREATED,
  });
}

export async function getUser(req: Request, res: ICustomResponse) {
  const user = await UserModel.findOne({ _id: req.params.id }).lean();

  if (!user) {
    return res.error({
      statusCode: StatusCodeEnum.NOT_FOUND,
    });
  }
  return res.success({ data: user });
}

export async function deleteUser(req: Request, res: ICustomResponse) {
  const { id } = req.params;

  const deleteResult = await UserModel.deleteOne({
    _id: id,
  });

  if (deleteResult.deletedCount === 0) {
    return res.error({
      statusCode: StatusCodeEnum.NOT_FOUND,
    });
  }
  return res.success({ statusCode: StatusCodeEnum.NO_CONTENT });
}
