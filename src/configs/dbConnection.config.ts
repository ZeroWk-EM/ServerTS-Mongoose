import mongoose, { Connection } from "mongoose";

import dotenv from "dotenv";
dotenv.config();

const mongoURI = String(process.env.MONGO_URL);

export const connectToMongoDB = () => {
  mongoose.set("strictQuery", false);
  mongoose.connect(mongoURI);

  const connection = mongoose.connection;
  connection.on("connected", function () {
    console.log("\x1b[32m[Server] Database Connected\x1b[0m");
  });

  connection.on("error", function (err) {
    console.error("\x1b[31m[Server] Error connecting to MongoDB\x1b[0m", err);
  });
};
