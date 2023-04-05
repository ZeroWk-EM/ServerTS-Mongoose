import express from "express";
import dotenv from "dotenv";
import { connectToMongoDB } from "./configs/dbConnection.config";

dotenv.config();

const port = process.env.PORT;
const app = express();

app.use(express.json());
app.get("/", (req, res) => {
  res.status(200).json({ status_code: 200, message: "Server is started" });
});

import user from "./routes/user.routes";

app.use("/users", user);

app.listen(port, () => {
  console.log(`\x1b[32m[Server] Server Connected on port [${port}]\x1b[0m`);
  connectToMongoDB();
});
