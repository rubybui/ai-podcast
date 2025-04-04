import slugify from "slugify";
import { ICustomResponse } from "../middlewares";
import { fileService } from "../services";
// import S3 from "../services/S3";

export async function uploadFile(req: any, res: ICustomResponse) {
  const fileType = req?.file.originalname.split(".")[1];
  const fileName = slugify(`${req?.file.originalname}-${Date.now()}`, {
    strict: true,
  });
  await fileService.uploadFile(
    req.file.buffer,
    `images/${fileName}.${fileType}`
  );
  return res.success({
    data: `/images/${fileName}.${fileType}`,
  });
}
