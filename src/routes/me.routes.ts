import express from "express";
import dotenv from "dotenv";
import { header } from "express-validator";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { IUser } from "../interfaces/user.interface";
import { checkErrors } from "../middlewares/validation.middleware";

dotenv.config();
const secret_key = String(process.env.KEY);
const router = express.Router();
router.use(express.json());

router.get(
  "/",
  header("authorization").isJWT(),
  checkErrors,
  async ({ headers: { authorization } }, res) => {
    const auth = String(authorization);
    try {
      const user = jwt.verify(auth, secret_key) as IUser;
      if (user) {
        const findUser = await User.findOne({ email: user.email });
        if (findUser) {
          return res.status(200).json(user);
        } else {
          return res
            .status(400)
            .json({ message: "This token belongs to no user" });
        }
      }
    } catch (errors) {
      return res.status(400).json({ message: "Error to JTW", error: errors });
    }
  }
);

export default router;
