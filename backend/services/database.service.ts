import mongoose from "mongoose";
import { AppConfig } from "../config";
import { MongoMemoryServer } from "mongodb-memory-server";

export const connectToDb = async () => {
  let connectionUri = AppConfig.mongoURI;

  return mongoose
    .connect(connectionUri)
    .then(() => console.log("Connected to MongoDB"));
};

let mongod;
export const connectToTestDb = async () => {
  mongod = await MongoMemoryServer.create();
  const connectionUri = mongod.getUri();
  return mongoose
    .connect(connectionUri)
    .then(() => console.log("Connected to Test MongoDB Uri: ", connectionUri));
};
export const closeTestDb = async () => {
  mongoose.disconnect();
  return mongod.stop();
};
