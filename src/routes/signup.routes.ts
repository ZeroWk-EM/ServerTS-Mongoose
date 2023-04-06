import express from "express";
import dotenv from "dotenv";
import { IUser } from "../interfaces/user.interface";
import { body } from "express-validator";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import User from "../models/user.model";
import { checkErrors, uniqueEmail } from "../middlewares/validation.middleware";

dotenv.config();
const saltRounds = Number(process.env.SALT);
const router = express.Router();
router.use(express.json());

router.post(
  "/",
  body("email").isEmail(),
  body("name").notEmpty(),
  body("surname").notEmpty(),
  body("password").isLength({ min: 8 }).notEmpty(),
  checkErrors,
  uniqueEmail,
  async ({ body }, res) => {
    const userBody: IUser = body;
    try {
      const user = await User.create({
        name: userBody.name,
        surname: userBody.surname,
        email: userBody.email,
        password: await bcrypt.hash(userBody.password, saltRounds),
        verify: uuidv4(),
      });
      if (user) {
        res.status(201).json({
          name: user.name,
          surname: user.surname,
          email: user.email,
        });
      }
    } catch (errors) {
      res.status(400).json({ message: "Error to create user", error: errors });
    }
  }
);

export default router;
