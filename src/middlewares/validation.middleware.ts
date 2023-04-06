import { Response, Request, NextFunction } from "express";
import { validationResult } from "express-validator";
import mongoose from "mongoose";
import User from "../models/user.model";

export const checkErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const uniqueEmail = async (
  { body: { email } }: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await User.findOne({ email });
  if (user) {
    return res.status(409).json({ message: "Email is just present" });
  }
  next();
};
