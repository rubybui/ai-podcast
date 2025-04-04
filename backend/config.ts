require("dotenv").config();

export const AppConfig = {
  subscriptionKey: process.env.SPEECH_KEY,
  serviceRegion: process.env.SPEECH_REGION,

  endPoint: process.env.TEXT_SUMMARY_END_POINT,
  apiKey: process.env.TEXT_SUMMARY_API_KEY,

  mongoURI: process.env.MONGO_URI,

  s3: {
    bucketName: process.env.S3_BUCKET_NAME,
    region: process.env.S3_REGION,
    accessKey: process.env.S3_ACCESS_KEY,
    secretKey: process.env.S3_SECRET_KEY,
  },
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV,
  coda: process.env.CODA_ACCESS_TOKEN,
  codaReportData: process.env.CODA_REPORT_TABLE_ACCESS_TOKEN,
};
