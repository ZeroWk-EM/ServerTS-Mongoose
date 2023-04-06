import express from "express";
import dotenv from "dotenv";
import { IUser } from "../interfaces/user.interface";
import { body } from "express-validator";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import User from "../models/user.model";
import { checkErrors } from "../middlewares/validation.middleware";
import { use } from "chai";

dotenv.config();
const saltRounds = Number(process.env.SALT);
const router = express.Router();
router.use(express.json());

router.post(
  "/",
  body("email").isEmail(),
  body("password").isLength({ min: 8 }).notEmpty(),
  checkErrors,
  async ({ body }, res) => {
    try {
      const user = await User.findOne({
        email: body.email,
        verify: { $exists: false },
      });
      if (user) {
        const comparePassword = await bcrypt.compare(
          body.password,
          user.password
        );
        if (comparePassword) {
          return res.status(200).json({ message: "Auth Successful" });
        }
        return res.status(401).json({ message: "Wrong password" });
      }
      res.status(401).json({ message: "Verify Token please..." });
    } catch (errors) {
      res.status(400).json({ message: "Error to create user", error: errors });
    }
  }
);

export default router;
