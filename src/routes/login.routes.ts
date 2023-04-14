import express from "express";
import dotenv from "dotenv";
import { body } from "express-validator";
import bcrypt from "bcrypt";
import User from "../models/user.model";
import { checkErrors } from "../middlewares/validation.middleware";
import jwt from "jsonwebtoken";

dotenv.config();
const secret_key = String(process.env.KEY);
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
          return res.status(200).json({
            message: "Auth Successful",
            token: jwt.sign(
              {
                _id: user._id,
                name: user.name,
                surname: user.surname,
                email: user.email,
              },
              secret_key
            ),
          });
        }
        return res.status(401).json({ message: "Wrong password" });
      }
      res.status(401).json({ message: "Verify Token please..." });
    } catch (errors) {
      res.status(400).json({ message: "Error to login", error: errors });
    }
  }
);

export default router;
