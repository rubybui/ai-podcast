import { ErrorRequestHandler } from "express";
import { StatusCodeEnum } from "../enums";
import { ICustomResponse } from "./api-response.middleware";

export const controllerWrapper = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));

export const errorHandling: ErrorRequestHandler = (
  err: any,
  req,
  res: ICustomResponse,
  next
) => {
  console.log(err);
  return res.error({
    message: "Something went wrong",
    statusCode: StatusCodeEnum.INTERNAL_ERROR,
  });
};
