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

import login from "./routes/login.routes";
import me from "./routes/me.routes";
import signup from "./routes/signup.routes";
import user from "./routes/user.routes";
import validate from "./routes/validate.routes";

app.use("/login", login);
app.use("/me", me);
app.use("/signup", signup);
app.use("/users", user);
app.use("/validate", validate);

app.listen(port, () => {
  console.log(`\x1b[32m[Server] Server Connected on port ${port}\x1b[0m`);
  connectToMongoDB();
});
