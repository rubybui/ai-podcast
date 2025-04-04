import {
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  PutObjectCommand,
  S3Client,
  UploadPartCommand,
} from "@aws-sdk/client-s3";
import { AppConfig } from "../config";

class FileService {
  private s3 = new S3Client({
    region: AppConfig.s3.region,
    credentials: {
      accessKeyId: AppConfig.s3.accessKey,
      secretAccessKey: AppConfig.s3.secretKey,
    },
  });

  uploadFile(fileContent: Buffer, fileName: string) {
    return this.s3.send(
      new PutObjectCommand({
        Bucket: AppConfig.s3.bucketName,
        Key: fileName,
        Body: fileContent,
      })
    );
  }

  async uploadFileMultipart(fileContent: Buffer, fileName: string) {
    const createMultipartUploadParams = {
      Bucket: AppConfig.s3.bucketName,
      Key: fileName,
    };
    const { UploadId } = await this.s3.send(
      new CreateMultipartUploadCommand(createMultipartUploadParams)
    );

    const partSize = 5 * 1024 * 1024; // 5MB
    const partNumber = Math.ceil(fileContent.length / partSize);

    const parts = await Promise.all(
      Array(partNumber)
        .fill("")
        .map((_, index) => {
          const start = index * partSize;
          const end = Math.min(start + partSize, fileContent.length);
          const chunk = fileContent.slice(start, end);

          return this.s3.send(
            new UploadPartCommand({
              Bucket: AppConfig.s3.bucketName,
              Key: fileName,
              PartNumber: index + 1,
              UploadId,
              Body: chunk,
            })
          );
        })
    );

    return await this.s3.send(
      new CompleteMultipartUploadCommand({
        Bucket: AppConfig.s3.bucketName,
        Key: fileName,
        UploadId,
        MultipartUpload: {
          Parts: parts.map((part, index) => ({
            ETag: part.ETag,
            PartNumber: index + 1,
          })),
        },
      })
    );
  }
}

export const fileService = new FileService();
