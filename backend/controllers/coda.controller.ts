import { Request } from "express";
import { codaService } from "../services";
import { ICustomResponse } from "../middlewares";
import { StatusCodeEnum } from "../enums";

export async function getSurveyData(req: Request, res: ICustomResponse) {
  const surveyData = await codaService.getSurveyData();
  return res.success({
    data: surveyData,
  });
}

export async function addSurveyOption(req: Request, res: ICustomResponse) {
  const { option } = req.body;
  if (!option) {
    return res.error({
      statusCode: StatusCodeEnum.BAD_REQUEST,
      message: "option is required",
    });
  }

  await codaService.addSurveyOption(option);
  return res.success({
    statusCode: StatusCodeEnum.CREATED,
    data: "success",
  });
}

export async function addReportRow(req: Request, res: ICustomResponse) {
  const { subject, message, anonymous, name, email } = req.body;
  if (!subject || !message || !anonymous) {
    return res.error({
      statusCode: StatusCodeEnum.BAD_REQUEST,
      message: "subject, message, anonymous are required",
    });
  }

  await codaService.AddReportRow(subject, message, anonymous, name, email);
  return res.success({
    statusCode: StatusCodeEnum.CREATED,
    data: "success",
  });
}

export async function voteSurveyOption(req: Request, res: ICustomResponse) {
  const surveyData = await codaService.getSurveyData();
  const { id } = req.params;

  if (id === undefined) {
    return res.error({
      statusCode: StatusCodeEnum.BAD_REQUEST,
      message: "id is required",
    });
  }
  if (!surveyData.find((data) => data.id === id)) {
    return res.error({
      statusCode: StatusCodeEnum.BAD_REQUEST,
      message: "id is not found",
    });
  }

  await codaService.voteSurveyOption(id);
  return res.success({
    data: "success",
  });
}
