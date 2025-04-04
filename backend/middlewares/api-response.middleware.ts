import { Request, Response, NextFunction } from "express";
import { StatusCodeEnum } from "../enums";

export interface IPagination {
  currentPage: number;
  perPage: number;
  total: number;
  totalPages: number;
};
export interface IApiResponse {
  success: boolean;
  message?: string;
  data?: any;
  pagination? 
}

export interface ICustomResponse extends Response {
  success: (params: {
    message?: string;
    data?: any;
    pagination?: IPagination;
    statusCode?: number;
  }) => any;
  error: (params: { message?: string; statusCode?: number }) => any;
}

export function customApiResponse(
  req: Request,
  res: ICustomResponse,
  next: NextFunction
) {
  res.success = ({ message, data, pagination, statusCode }) => {
    const response: IApiResponse = {
      success: true,
    };
    if (message) response.message = message;
    if (data) response.data = data;
    if (pagination) response.pagination = pagination;
    res.status(statusCode || StatusCodeEnum.OK).json(response);
  };

  res.error = ({ message, statusCode }) => {
    const response: IApiResponse = {
      success: false,
    };
    if (message) response.message = message;
    res.status(statusCode || StatusCodeEnum.BAD_REQUEST).json(response);
  };

  next();
}
