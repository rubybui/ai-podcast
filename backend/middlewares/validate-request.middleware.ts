import { Request, Response, NextFunction } from "express";
import { validateSync } from "class-validator";
import { StatusCodeEnum } from "../enums";

export function validateRequest(dto: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors = validateSync(
      Object.assign(new dto(), { ...req.body, ...req.query })
    );

    if (errors.length > 0) {
      const constraintError = errors[0].constraints;
      return res.status(StatusCodeEnum.BAD_REQUEST).json({
        statusCode: StatusCodeEnum.BAD_REQUEST,
        message: constraintError[Object.keys(constraintError)[0]],
      });
    }

    next();
  };
}
