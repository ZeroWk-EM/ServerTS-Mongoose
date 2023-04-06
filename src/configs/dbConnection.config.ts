import mongoose, { Connection } from "mongoose";

import dotenv from "dotenv";
dotenv.config();

const db = String(process.env.DB);
const mongoURI = String(`${process.env.MONGO_URL}_${db}`);

export const connectToMongoDB = () => {
  mongoose.set("strictQuery", false);
  mongoose.connect(mongoURI);

  const connection = mongoose.connection;
  connection.on("connected", () => {
    console.log(`\x1b[32m[Server] Database Connected in \x1b[34m[${db.toUpperCase()}]\x1b[0m\x1b[32m mode\x1b[0m`);
  });

  connection.on("error", (err) => {
    console.error("\x1b[31m[Server] Error connecting to MongoDB\x1b[0m", err);
  });
};
